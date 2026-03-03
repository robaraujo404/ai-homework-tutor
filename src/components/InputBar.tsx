"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";

interface InputBarProps {
  onSend: (message: string, image?: string) => void;
  disabled?: boolean;
}

export default function InputBar({ onSend, disabled }: InputBarProps) {
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const t = useTranslations("chat");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || image) && !disabled) {
      onSend(input.trim(), image || undefined);
      setInput("");
      setImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");

        try {
          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          if (data.text) {
            setInput((prev) => (prev ? `${prev} ${data.text}` : data.text));
          }
        } catch (error) {
          console.error("Transcription error:", error);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl flex flex-col gap-2">
        {image && (
          <div className="relative inline-block self-start">
            <img src={image} alt="Preview" className="h-20 w-20 rounded-lg object-cover border border-gray-200" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex gap-2 relative items-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            title={t("upload_image")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
          >
            📷
          </button>
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled}
            title={isRecording ? t("stop_recording") : t("record_audio")}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-50 ${
              isRecording ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {isRecording ? "⏹" : "🎤"}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? t("thinking") : t("placeholder")}
            disabled={disabled}
            maxLength={500}
            enterKeyHint="send"
            className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 outline-none transition-focus focus:border-blue-500 sm:text-lg"
          />
          <button
            type="submit"
            disabled={disabled || (!input.trim() && !image)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <span className="text-xl">→</span>
          </button>
        </div>
        {input.length > 200 && (
          <span className="self-end text-[10px] text-gray-400">
            {input.length}/500 {t("char_limit")}
          </span>
        )}
      </form>
    </div>
  );
}
