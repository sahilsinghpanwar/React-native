import { HOME_USER } from "./data";

describe("HOME_USER", () => {
  it("uses the updated display name 'Sahil Panwar'", () => {
    expect(HOME_USER.name).toBe("Sahil Panwar");
  });

  it("no longer uses the previous placeholder name", () => {
    expect(HOME_USER.name).not.toBe("Adrian | JS Mastery");
  });

  it("exposes name as a non-empty string", () => {
    expect(typeof HOME_USER.name).toBe("string");
    expect(HOME_USER.name.length).toBeGreaterThan(0);
  });
});