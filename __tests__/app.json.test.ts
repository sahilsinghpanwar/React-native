import appConfig from "../app.json";

describe("app.json - expo-font plugin configuration", () => {
  const findPlugin = (name: string) =>
    appConfig.expo.plugins.find(
      (plugin) => plugin === name || (Array.isArray(plugin) && plugin[0] === name),
    );

  it("declares the expo-font plugin", () => {
    const plugin = findPlugin("expo-font");
    expect(plugin).toBeDefined();
    expect(Array.isArray(plugin)).toBe(true);
  });

  it("registers exactly the six expected Poppins font files", () => {
    const plugin = findPlugin("expo-font") as [string, { fonts: string[] }];
    const [, options] = plugin;

    expect(options.fonts).toEqual([
      "./assets/fonts/Poppins-Regular.ttf",
      "./assets/fonts/Poppins-Bold.ttf",
      "./assets/fonts/Poppins-SemiBold.ttf",
      "./assets/fonts/Poppins-Medium.ttf",
      "./assets/fonts/Poppins-ExtraBold.ttf",
      "./assets/fonts/Poppins-Light.ttf"
    ]);
  });

  it("only lists .ttf font assets", () => {
    const plugin = findPlugin("expo-font") as [string, { fonts: string[] }];
    const [, options] = plugin;

    for (const fontPath of options.fonts) {
      expect(fontPath).toMatch(/\.ttf$/);
    }
  });

  it("keeps the pre-existing expo-router and expo-splash-screen plugins intact", () => {
    expect(findPlugin("expo-router")).toBeDefined();
    expect(findPlugin("expo-splash-screen")).toBeDefined();
  });
});