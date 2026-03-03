"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import ConfigBar from "@/components/ConfigBar";
import MessageBubble, { LoadingBubble } from "@/components/MessageBubble";
import InputBar from "@/components/InputBar";
import { Message } from "@/lib/llm/types";
import posthog from "posthog-js";

export default function ChatPage() {
  const t = useTranslations("chat");
  const errT = useTranslations("errors");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [grade, setGrade] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialGrade = searchParams.get("grade");
    const initialSubject = searchParams.get("subject");
    if (initialGrade) setGrade(initialGrade);
    if (initialSubject) setSubject(initialSubject);

    setMessages([
      {
        role: "assistant",
        content: t("initial_message"),
      },
    ]);
  }, [t, searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleGradeChange = (g: string | null) => {
    setGrade(g);
    posthog.capture("grade_selected", { grade: g });
  };

  const handleSubjectChange = (s: string | null) => {
    setSubject(s);
    posthog.capture("subject_selected", { subject: s });
  };

  const handleSendMessage = async (content: string, image?: string) => {
    const userMessage: Message = image 
      ? { 
          role: "user", 
          content: [
            { type: "text", text: content },
            { type: "image", image_url: { url: image } }
          ] 
        }
      : { role: "user", content };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    posthog.capture("question_asked", { locale, grade, subject, has_image: !!image });

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: content,
          image: image, // pass explicitly for easier handling in route if needed, or just use history
          history: messages.slice(1),
          locale,
          grade,
          subject,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: errT(data.error || "generic"),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errT("generic"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white sm:bg-gray-50">
      <Header
        onToggleConfig={() => setIsConfigOpen(!isConfigOpen)}
        showConfigButton={true}
      />
      
      <ConfigBar
        selectedGrade={grade}
        onGradeChange={handleGradeChange}
        selectedSubject={subject}
        onSubjectChange={handleSubjectChange}
        isOpen={isConfigOpen}
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl flex flex-col gap-4" aria-live="polite">
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              role={msg.role}
              content={msg.content}
              isLatest={index === messages.length - 1}
            />
          ))}
          {loading && <LoadingBubble />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <InputBar onSend={handleSendMessage} disabled={loading} />
    </div>
  );
}
