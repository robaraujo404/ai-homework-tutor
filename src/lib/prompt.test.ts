import { describe, expect, it } from "vitest";

import { getSystemPrompt } from "./prompt";

describe("prompt", () => {
  it("falls back to pt-br for unknown locale", () => {
    const system = getSystemPrompt("xx", null, null);
    expect(system).toContain("tutor amigável");
    expect(system).toContain("português do Brasil");
  });

  it("includes grade and subject context when provided", () => {
    const system = getSystemPrompt("pt-br", "5", "matematica");
    expect(system).toContain("5º ano");
    expect(system).toContain("A matéria atual é");
    expect(system).toContain("matematica");
  });

  it("does not include grade/subject context when null", () => {
    const system = getSystemPrompt("en", null, null);
    expect(system).toContain("friendly tutor");
    expect(system).not.toContain("The child is in");
    expect(system).not.toContain("The current subject is");
  });
});
