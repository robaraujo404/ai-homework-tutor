import OpenAI from "openai";
import type { LLMProvider, Message } from "./types";

export class OpenAIProvider implements LLMProvider {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async ask(messages: Message[], system: string): Promise<string> {
    const formattedMessages = messages.map((msg) => {
      if (typeof msg.content === "string") {
        return {
          role: msg.role,
          content: msg.content,
        };
      }

      const content = msg.content.map((c) => {
        if (c.type === "text") {
          return { type: "text" as const, text: c.text ?? "" };
        }
        return {
          type: "image_url" as const,
          image_url: {
            url: c.image_url?.url ?? "",
          },
        };
      });

      return {
        role: msg.role,
        content,
      };
    });

    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1024,
      messages: [{ role: "system", content: system }, ...formattedMessages as any[]],
    });
    return response.choices[0].message.content ?? "";
  }
}
