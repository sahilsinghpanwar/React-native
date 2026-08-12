import packageJson from "./package.json";
import packageLockJson from "./package-lock.json";

describe("package.json - dayjs dependency", () => {
  it("declares dayjs as a production dependency", () => {
    expect(packageJson.dependencies).toHaveProperty("dayjs");
  });

  it("pins dayjs to the ^1.11.21 semver range", () => {
    expect(packageJson.dependencies.dayjs).toBe("^1.11.21");
  });
});

describe("package-lock.json - dayjs resolution", () => {
  it("resolves dayjs as a top-level dependency of the root package", () => {
    const rootDeps = packageLockJson.packages[""].dependencies;
    expect(rootDeps).toHaveProperty("dayjs");
    expect(rootDeps.dayjs).toBe("^1.11.21");
  });

  it("has a locked dayjs package entry with a matching resolved version", () => {
    const dayjsEntry = (packageLockJson.packages as Record<string, any>)[
      "node_modules/dayjs"
    ];

    expect(dayjsEntry).toBeDefined();
    expect(dayjsEntry.version).toBe("1.11.21");
    expect(dayjsEntry.resolved).toContain(
      "https://registry.npmjs.org/dayjs/-/dayjs-1.11.21.tgz",
    );
  });
});