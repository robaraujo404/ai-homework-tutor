"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useLocale } from "next-intl";
import posthog from "posthog-js";
import { MessageContent } from "@/lib/llm/types";

const CELEBRATION_WORDS: Record<string, string[]> = {
  "pt-br": ["muito bem", "isso mesmo", "acertou", "correto", "parabéns", "conseguiu", "excelente"],
  en: ["great job", "that's right", "correct", "excellent", "well done", "you got it"],
  es: ["muy bien", "correcto", "excelente", "lo lograste", "eso es", "bien hecho"],
};

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string | MessageContent[];
  isLatest?: boolean;
}

export default function MessageBubble({ role, content, isLatest }: MessageBubbleProps) {
  const locale = useLocale();

  useEffect(() => {
    if (role === "assistant" && isLatest && typeof content === "string") {
      const lowerContent = content.toLowerCase();
      const words = CELEBRATION_WORDS[locale] || CELEBRATION_WORDS["pt-br"];
      const shouldCelebrate = words.some((word) => lowerContent.includes(word));

      if (shouldCelebrate) {
        posthog.capture("celebration_triggered", { locale });
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.8 },
          zIndex: 9999,
        });
      }
    }
  }, [role, content, isLatest, locale]);

  const isAssistant = role === "assistant";

  const renderContent = () => {
    if (typeof content === "string") {
      return content;
    }

    return (
      <div className="flex flex-col gap-2">
        {content.map((item, idx) => {
          if (item.type === "text") {
            return <p key={idx}>{item.text}</p>;
          }
          if (item.type === "image" && item.image_url) {
            return (
              <img
                key={idx}
                src={item.image_url.url}
                alt="User upload"
                className="max-w-full rounded-lg border border-gray-200"
              />
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col ${
        isAssistant ? "self-start items-start" : "self-end items-end"
      } max-w-[85%] sm:max-w-[75%]`}
    >
      <div
        className={`rounded-2xl p-3 text-sm leading-relaxed ${
          isAssistant
            ? "bg-gray-100 text-gray-800 rounded-bl-sm"
            : "bg-blue-100 text-blue-900 rounded-br-sm"
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
}

export function LoadingBubble() {
  return (
    <div className="flex flex-col self-start max-w-[85%] items-start">
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-3 flex gap-1 items-center h-10">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
