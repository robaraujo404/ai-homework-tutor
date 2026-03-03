import Anthropic from "@anthropic-ai/sdk";
import type { LLMProvider, Message } from "./types";

export class AnthropicProvider implements LLMProvider {
  private client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
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
        // Extract base64 and media type from data URL
        const matches = c.image_url?.url.match(/^data:(image\/\w+);base64,(.+)$/);
        if (matches) {
          return {
            type: "image" as const,
            source: {
              type: "base64" as const,
              media_type: matches[1] as any,
              data: matches[2],
            },
          };
        }
        return { type: "text" as const, text: "" };
      });

      return {
        role: msg.role,
        content,
      };
    });

    const response = await this.client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      system,
      messages: formattedMessages as any[],
    });
    return response.content[0].type === "text" ? response.content[0].text : "";
  }
}
