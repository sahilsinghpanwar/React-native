import { readFileSync } from "fs";
import { join } from "path";

const cssContent = readFileSync(join(__dirname, "global.css"), "utf-8");

describe("global.css - font theme variables", () => {
  it("defines the sans-regular font variable pointing to the loaded font family", () => {
    expect(cssContent).toMatch(/--font-sans:\s*"?sans-regular"?;/);
  });

  it("defines the sans-light font variable", () => {
    expect(cssContent).toMatch(/--font-sans-light:\s*"?sans-light"?;/);
  });

  it("defines the sans-medium font variable", () => {
    expect(cssContent).toMatch(/--font-sans-medium:\s*"?sans-medium"?;/);
  });

  it("defines the sans-semibold font variable", () => {
    expect(cssContent).toMatch(/--font-sans-semibold:\s*"?sans-semibold"?;/);
  });

  it("defines the sans-bold font variable", () => {
    expect(cssContent).toMatch(/--font-sans-bold:\s*"?sans-bold"?;/);
  });

  it("defines the sans-extrabold font variable", () => {
    expect(cssContent).toMatch(
      /--font-sans-extrabold:\s*"?sans-extrabold"?;/,
    );
  });

  it("still defines the pre-existing color theme variables", () => {
    expect(cssContent).toMatch(/--color-background:\s*#fff9e3;/);
    expect(cssContent).toMatch(/--color-primary:\s*#081126;/);
  });
});