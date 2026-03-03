export interface MessageContent {
  type: "text" | "image";
  text?: string;
  image_url?: {
    url: string; // base64 data url for user uploads
  };
}

export interface Message {
  role: "user" | "assistant";
  content: string | MessageContent[];
}

export interface LLMProvider {
  ask(messages: Message[], system: string): Promise<string>;
}
