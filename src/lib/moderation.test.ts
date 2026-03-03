import { describe, expect, it } from "vitest";

import { isInappropriate, safeResponse } from "./moderation";

describe("moderation", () => {
  it("detects inappropriate content in supported languages", () => {
    expect(isInappropriate("sexo")).toBe(true);
    expect(isInappropriate("pornô")).toBe(true);
    expect(isInappropriate("violencia")).toBe(true);

    expect(isInappropriate("porn")).toBe(true);
    expect(isInappropriate("weapon")).toBe(true);
  });

  it("does not flag typical school questions", () => {
    expect(isInappropriate("Como faço uma divisão por 2?")).toBe(false);
    expect(isInappropriate("What is 7 times 8?")).toBe(false);
  });

  it("returns a safe response per locale and falls back to pt-br", () => {
    expect(safeResponse("pt-br")).toContain("Essa pergunta");
    expect(safeResponse("en")).toContain("I can't");
    expect(safeResponse("es")).toContain("No puedo");
    expect(safeResponse("xx")).toContain("Essa pergunta");
  });
});
