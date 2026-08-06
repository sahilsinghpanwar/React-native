import fs from "fs";
import path from "path";

const cssContent = fs.readFileSync(
  path.join(__dirname, "..", "global.css"),
  "utf8",
);

describe("global.css - font theme variables", () => {
  const expectedFontVariables: Record<string, string> = {
    "--font-sans": "sans-regular",
    "--font-sans-light": "sans-light",
    "--font-sans-medium": "sans-medium",
    "--font-sans-semibold": "sans-semibold",
    "--font-sans-bold": "sans-bold",
    "--font-sans-extrabold": "sans-extrabold",
  };

  it.each(Object.keys(expectedFontVariables))(
    "defines the %s custom property",
    (variableName) => {
      expect(cssContent).toContain(variableName);
    },
  );

  it("still imports the nativewind theme", () => {
    expect(cssContent).toContain('@import "nativewind/theme";');
  });

  it("declares the @theme block that hosts the font variables", () => {
    expect(cssContent).toMatch(/@theme\s*{/);
  });

  it("references every custom font weight name used by the new font variables", () => {
    const expectedFontNames = [
      "sans-regular",
      "sans-light",
      "sans-medium",
      "sans-semibold",
      "sans-bold",
      "sans-extrabold",
    ];

    for (const fontName of expectedFontNames) {
      expect(cssContent).toContain(fontName);
    }
  });
});