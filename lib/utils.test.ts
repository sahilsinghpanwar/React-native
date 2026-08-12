// Pin the timezone so date formatting assertions are deterministic
// regardless of the machine/CI environment running the tests.
process.env.TZ = "UTC";

import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from "./utils";

describe("formatCurrency", () => {
  it("formats a positive value with the default USD currency", () => {
    expect(formatCurrency(2489.48)).toBe("$2,489.48");
  });

  it("formats a value with a custom currency code", () => {
    expect(formatCurrency(15, "EUR")).toBe("€15.00");
  });

  it("always renders exactly two fraction digits", () => {
    expect(formatCurrency(5)).toBe("$5.00");
    expect(formatCurrency(9.999)).toBe("$10.00");
  });

  it("formats zero correctly", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats negative values correctly", () => {
    expect(formatCurrency(-42.5)).toBe("-$42.50");
  });

  it("falls back to a plain fixed-point string when Intl.NumberFormat throws", () => {
    expect(formatCurrency(19.999, "NOT_A_CURRENCY")).toBe("20.00");
  });
});

describe("formatSubscriptionDateTime", () => {
  it("returns 'Not provided' when the value is undefined", () => {
    expect(formatSubscriptionDateTime(undefined)).toBe("Not provided");
  });

  it("returns 'Not provided' when the value is an empty string", () => {
    expect(formatSubscriptionDateTime("")).toBe("Not provided");
  });

  it("formats a valid ISO date string as MM/DD/YYYY", () => {
    expect(formatSubscriptionDateTime("2026-03-20T10:00:00.000Z")).toBe(
      "03/20/2026",
    );
  });

  it("returns 'Not provided' for an unparsable date string", () => {
    expect(formatSubscriptionDateTime("not-a-real-date")).toBe(
      "Not provided",
    );
  });
});

describe("formatStatusLabel", () => {
  it("returns 'Unknown' when the value is undefined", () => {
    expect(formatStatusLabel(undefined)).toBe("Unknown");
  });

  it("returns 'Unknown' when the value is an empty string", () => {
    expect(formatStatusLabel("")).toBe("Unknown");
  });

  it("capitalizes only the first letter of a lowercase status", () => {
    expect(formatStatusLabel("active")).toBe("Active");
    expect(formatStatusLabel("cancelled")).toBe("Cancelled");
  });

  it("does not change casing beyond the first letter", () => {
    expect(formatStatusLabel("paUSED")).toBe("PaUSED");
  });

  it("handles a single-character status", () => {
    expect(formatStatusLabel("a")).toBe("A");
  });
});