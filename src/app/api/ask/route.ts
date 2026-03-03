import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/llm";
import { isInappropriate, safeResponse } from "@/lib/moderation";
import { ratelimit } from "@/lib/ratelimit";
import { getSystemPrompt } from "@/lib/prompt";
import { getNoDirectAnswerMessage, isDirectAnswerRequest, looksLikeDirectFinalAnswer } from "@/lib/homework-policy";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  
  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "rate_limit" },
        { status: 429 }
      );
    }
  } catch (err) {
    // If Redis is not configured, we let it pass for development
    console.error("Rate limit error:", err);
  }

  const { question, image, history, locale, grade, subject } = await req.json();

  if (question && isDirectAnswerRequest(question, locale ?? "pt-br")) {
    return NextResponse.json({ answer: getNoDirectAnswerMessage(locale ?? "pt-br", subject) });
  }

  if (!question?.trim() && !image) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }

  if (question && isInappropriate(question)) {
    return NextResponse.json({ answer: safeResponse(locale ?? "pt-br") });
  }

  const provider = getProvider();
  const system = getSystemPrompt(locale ?? "pt-br", grade ?? null, subject ?? null);
  
  const currentMessage: any = image 
    ? { 
        role: "user" as const, 
        content: [
          { type: "text", text: question || "" },
          { type: "image", image_url: { url: image } }
        ]
      }
    : { role: "user" as const, content: question };

  const messages = [
    ...(history ?? []),
    currentMessage,
  ];

  try {
    const answer = await provider.ask(messages, system);
    if (looksLikeDirectFinalAnswer(answer, locale ?? "pt-br")) {
      return NextResponse.json({ answer: getNoDirectAnswerMessage(locale ?? "pt-br", subject) });
    }
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("LLM Provider error:", err);
    return NextResponse.json({ error: "generic" }, { status: 500 });
  }
}
