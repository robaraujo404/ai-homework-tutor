import { AnthropicProvider } from "./anthropic";
import { OpenAIProvider } from "./openai";
import type { LLMProvider } from "./types";

export function getProvider(): LLMProvider {
  if (process.env.LLM_PROVIDER === "openai") return new OpenAIProvider();
  return new AnthropicProvider();
}
