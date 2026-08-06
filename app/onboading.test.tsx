import Onboading from "./onboading";

describe("Onboading (app/onboading.tsx)", () => {
  it("exports a function component", () => {
    expect(typeof Onboading).toBe("function");
  });

  it("currently returns undefined because its JSX body is commented out", () => {
    // The component body only contains commented-out JSX and has no
    // return statement, so invoking it directly yields `undefined`.
    // This regression test documents the current (incomplete) state of
    // the component introduced by this change.
    expect((Onboading as () => unknown)()).toBeUndefined();
  });
});