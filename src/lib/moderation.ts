const BLOCKED_PATTERNS = [
  /\b(sexo|pornô|porno|droga|matar|suicídio|suicidio|bomba|violência|violencia)\b/i,
  /\b(sex|porn|drug|kill|suicide|bomb|violence|weapon)\b/i,
];

export function isInappropriate(text: string): boolean {
  return BLOCKED_PATTERNS.some((p) => p.test(text));
}

export function safeResponse(locale: string): string {
  const responses: Record<string, string> = {
    "pt-br": "Essa pergunta não consigo responder. Me manda uma dúvida da escola! 😊",
    en: "I can't answer that. Send me a school question! 😊",
    es: "No puedo responder eso. ¡Mándame una pregunta de la escuela! 😊",
  };
  return responses[locale] ?? responses["pt-br"];
}
