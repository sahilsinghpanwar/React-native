import appConfig from "./app.json";

describe("app.json - expo-font plugin configuration", () => {
  const plugins = appConfig.expo.plugins as unknown[];

  it("registers the expo-font plugin", () => {
    const fontPluginEntry = plugins.find(
      (plugin) => Array.isArray(plugin) && plugin[0] === "expo-font",
    ) as [string, { fonts: string[] }] | undefined;

    expect(fontPluginEntry).toBeDefined();
  });

  it("lists exactly the six expected Poppins font files", () => {
    const [, fontPluginOptions] = plugins.find(
      (plugin) => Array.isArray(plugin) && plugin[0] === "expo-font",
    ) as [string, { fonts: string[] }];

    expect(fontPluginOptions.fonts).toEqual([
      "./assets/fonts/Poppins-Regular.ttf",
      "./assets/fonts/Poppins-Bold.ttf",
      "./assets/fonts/Poppins-SemiBold.ttf",
      "./assets/fonts/Poppins-Medium.ttf",
      "./assets/fonts/Poppins-ExtraBold.ttf",
      "./assets/fonts/Poppins-Light.ttf",
    ]);
  });

  it("every configured font file path points at a .ttf file", () => {
    const [, fontPluginOptions] = plugins.find(
      (plugin) => Array.isArray(plugin) && plugin[0] === "expo-font",
    ) as [string, { fonts: string[] }];

    fontPluginOptions.fonts.forEach((fontPath) => {
      expect(fontPath).toMatch(/\.ttf$/);
    });
  });

  it("still keeps the pre-existing expo-splash-screen plugin configured", () => {
    const splashPluginEntry = plugins.find(
      (plugin) => Array.isArray(plugin) && plugin[0] === "expo-splash-screen",
    );

    expect(splashPluginEntry).toBeDefined();
  });

  it("still keeps the expo-router plugin registered", () => {
    expect(plugins).toContain("expo-router");
  });
});