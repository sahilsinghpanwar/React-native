import { HOME_USER } from "./data";

describe("HOME_USER", () => {
  it("has the updated display name", () => {
    expect(HOME_USER.name).toBe("Sahil Panwar");
  });

  it("exposes a non-empty string name", () => {
    expect(typeof HOME_USER.name).toBe("string");
    expect(HOME_USER.name.length).toBeGreaterThan(0);
  });
});