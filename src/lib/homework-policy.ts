type Locale = "pt-br" | "en" | "es";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isMathLikeSubject(subject: string | null | undefined): boolean {
  return subject === "matematica";
}

export function getNoDirectAnswerMessage(locale: string, subject: string | null | undefined): string {
  const safe = (locale === "en" || locale === "es" || locale === "pt-br" ? locale : "pt-br") as Locale;
  const wantPhoto = isMathLikeSubject(subject);

  const base: Record<Locale, string> = {
    "pt-br": "Eu não posso te dar a resposta final pronta, mas posso te ajudar a chegar nela passo a passo. Me diz o que você já tentou e onde travou.",
    en: "I can’t give the final answer directly, but I can help you get there step by step. Tell me what you tried and where you got stuck.",
    es: "No puedo darte la respuesta final directamente, pero puedo ayudarte a llegar paso a paso. Dime qué intentaste y en qué te trabaste.",
  };

  const photo: Record<Locale, string> = {
    "pt-br": "Se for matemática, pode mandar uma foto da sua tentativa (contas e passos) que eu te ajudo a achar o erro.",
    en: "If it’s math, you can send a photo of your work (steps and calculations) and I’ll help you find the mistake.",
    es: "Si es matemáticas, puedes mandar una foto de tu intento (pasos y cuentas) y te ayudo a encontrar el error.",
  };

  return wantPhoto ? `${base[safe]} ${photo[safe]}` : base[safe];
}

export function isDirectAnswerRequest(question: string, locale: string): boolean {
  const safe = (locale === "en" || locale === "es" || locale === "pt-br" ? locale : "pt-br") as Locale;
  const q = normalize(question);

  const patterns: Record<Locale, RegExp[]> = {
    "pt-br": [
      /\bqual\s+(e|é)\s+a\s+resposta\b/,
      /\bme\s+da\s+a\s+resposta\b/,
      /\bme\s+fala\s+a\s+resposta\b/,
      /\bso\s+a\s+resposta\b/,
      /\bgabarito\b/,
      /\bresultado\s+final\b/,
      /\bresolva\s+pra\s+mim\b/,
      /\bresolve\s+pra\s+mim\b/,
      /\bme\s+entrega\s+o\s+resultado\b/,
    ],
    en: [
      /\bwhat\s+is\s+the\s+answer\b/,
      /\bgive\s+me\s+the\s+answer\b/,
      /\bjust\s+the\s+answer\b/,
      /\bfinal\s+answer\b/,
      /\banswer\s+only\b/,
      /\bsolve\s+it\s+for\s+me\b/,
    ],
    es: [
      /\bcual\s+es\s+la\s+respuesta\b/,
      /\bdame\s+la\s+respuesta\b/,
      /\bsolo\s+la\s+respuesta\b/,
      /\brespuesta\s+final\b/,
      /\bresuelve\s+por\s+mi\b/,
    ],
  };

  return patterns[safe].some((p) => p.test(q));
}

export function looksLikeDirectFinalAnswer(answer: string, locale: string): boolean {
  const safe = (locale === "en" || locale === "es" || locale === "pt-br" ? locale : "pt-br") as Locale;
  const a = normalize(answer);

  const markers: Record<Locale, RegExp[]> = {
    "pt-br": [/\ba\s+resposta\s+(e|é)\b/, /\bresultado\s+(e|é)\b/, /^\s*resposta\s*[:\-]/],
    en: [/\bthe\s+answer\s+is\b/, /\bfinal\s+answer\b/, /^\s*answer\s*[:\-]/],
    es: [/\bla\s+respuesta\s+es\b/, /\brespuesta\s+final\b/, /^\s*respuesta\s*[:\-]/],
  };

  if (markers[safe].some((m) => m.test(a))) return true;
  if (/^\s*\d+(?:[\.,]\d+)?\s*$/.test(answer.trim())) return true;

  return false;
}
