import packageJson from "../package.json";
import packageLockJson from "../package-lock.json";

describe("package.json - dayjs dependency", () => {
  it("declares dayjs as a runtime dependency", () => {
    expect(packageJson.dependencies).toHaveProperty("dayjs");
  });

  it("pins dayjs to the expected semver range", () => {
    expect(packageJson.dependencies.dayjs).toBe("^1.11.21");
  });

  it("does not list dayjs as a devDependency", () => {
    expect(packageJson.devDependencies).not.toHaveProperty("dayjs");
  });
});

describe("package-lock.json - dayjs dependency", () => {
  it("includes a locked entry for dayjs in node_modules", () => {
    const lockEntry = (packageLockJson.packages as Record<string, unknown>)[
      "node_modules/dayjs"
    ];
    expect(lockEntry).toBeDefined();
  });

  it("locks dayjs to a version that satisfies the package.json semver range", () => {
    const lockEntry = (
      packageLockJson.packages as Record<string, { version: string }>
    )["node_modules/dayjs"];
    expect(lockEntry.version).toBe("1.11.21");
  });

  it("lists dayjs as a root dependency in the lockfile's top-level package entry", () => {
    const rootPackage = (
      packageLockJson.packages as Record<string, { dependencies?: Record<string, string> }>
    )[""];
    expect(rootPackage.dependencies).toHaveProperty("dayjs");
    expect(rootPackage.dependencies?.dayjs).toBe(packageJson.dependencies.dayjs);
  });
});