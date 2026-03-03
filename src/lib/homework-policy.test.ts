import { describe, expect, it } from "vitest";

import {
  getNoDirectAnswerMessage,
  isDirectAnswerRequest,
  isMathLikeSubject,
  looksLikeDirectFinalAnswer,
} from "./homework-policy";

describe("homework-policy", () => {
  it("detects math-like subject", () => {
    expect(isMathLikeSubject("matematica")).toBe(true);
    expect(isMathLikeSubject("portugues")).toBe(false);
    expect(isMathLikeSubject(null)).toBe(false);
  });

  it("builds a locale-safe no-direct-answer message", () => {
    expect(getNoDirectAnswerMessage("pt-br", null)).toContain("não posso");
    expect(getNoDirectAnswerMessage("en", null)).toContain("can’t");
    expect(getNoDirectAnswerMessage("es", null)).toContain("No puedo");

    expect(getNoDirectAnswerMessage("xx", null)).toContain("não posso");
  });

  it("adds photo hint for math subject", () => {
    const msg = getNoDirectAnswerMessage("pt-br", "matematica");
    expect(msg.toLowerCase()).toContain("foto");
    expect(msg.toLowerCase()).toContain("tentativa");
  });

  it("detects direct answer requests across locales (including diacritics)", () => {
    expect(isDirectAnswerRequest("Qual é a resposta?", "pt-br")).toBe(true);
    expect(isDirectAnswerRequest("qual e a resposta?", "pt-br")).toBe(true);
    expect(isDirectAnswerRequest("Me dá a resposta", "pt-br")).toBe(true);
    expect(isDirectAnswerRequest("give me the answer", "en")).toBe(true);
    expect(isDirectAnswerRequest("dame la respuesta", "es")).toBe(true);

    expect(isDirectAnswerRequest("Eu tentei, mas travei no passo 2", "pt-br")).toBe(false);
  });

  it("flags answers that look like a direct final answer", () => {
    expect(looksLikeDirectFinalAnswer("A resposta é 42.", "pt-br")).toBe(true);
    expect(looksLikeDirectFinalAnswer("Answer: 12", "en")).toBe(true);
    expect(looksLikeDirectFinalAnswer("Respuesta: 7", "es")).toBe(true);

    expect(looksLikeDirectFinalAnswer("42", "pt-br")).toBe(true);
    expect(looksLikeDirectFinalAnswer("  3,14  ", "pt-br")).toBe(true);

    expect(
      looksLikeDirectFinalAnswer(
        "Vamos pensar juntos: qual operação você acha que vem primeiro?",
        "pt-br"
      )
    ).toBe(false);
  });
});
