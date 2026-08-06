process.env.TZ = "UTC";

import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from "./utils";

describe("formatCurrency", () => {
  it("formats a value using the default USD currency", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats a value using an explicitly provided currency", () => {
    expect(formatCurrency(10, "EUR")).toBe("€10.00");
  });

  it("always renders exactly two fraction digits", () => {
    expect(formatCurrency(5)).toBe("$5.00");
    expect(formatCurrency(5.999)).toBe("$6.00");
  });

  it("formats zero correctly", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats negative values correctly", () => {
    expect(formatCurrency(-42.1)).toBe("-$42.10");
  });

  it("falls back to a plain fixed-point string when the currency code is invalid", () => {
    expect(formatCurrency(42, "NOT_A_CURRENCY")).toBe("42.00");
  });
});

describe("formatSubscriptionDateTime", () => {
  it("returns 'Not provided' when value is undefined", () => {
    expect(formatSubscriptionDateTime(undefined)).toBe("Not provided");
  });

  it("returns 'Not provided' when value is an empty string", () => {
    expect(formatSubscriptionDateTime("")).toBe("Not provided");
  });

  it("returns 'Not provided' when value is not a parseable date", () => {
    expect(formatSubscriptionDateTime("not-a-date")).toBe("Not provided");
  });

  it("formats a valid ISO date string as MM/DD/YYYY", () => {
    expect(formatSubscriptionDateTime("2026-03-20T10:00:00.000Z")).toBe(
      "03/20/2026",
    );
  });

  it("formats a different valid ISO date string correctly", () => {
    expect(formatSubscriptionDateTime("2025-06-15T12:00:00.000Z")).toBe(
      "06/15/2025",
    );
  });
});

describe("formatStatusLabel", () => {
  it("returns 'Unknown' when value is undefined", () => {
    expect(formatStatusLabel(undefined)).toBe("Unknown");
  });

  it("returns 'Unknown' when value is an empty string", () => {
    expect(formatStatusLabel("")).toBe("Unknown");
  });

  it("capitalizes only the first letter of the status", () => {
    expect(formatStatusLabel("active")).toBe("Active");
    expect(formatStatusLabel("cancelled")).toBe("Cancelled");
    expect(formatStatusLabel("paused")).toBe("Paused");
  });

  it("does not alter casing of the remainder of the string", () => {
    expect(formatStatusLabel("PAUSED")).toBe("PAUSED");
    expect(formatStatusLabel("aCTIVE")).toBe("ACTIVE");
  });

  it("leaves a single-character status capitalized correctly", () => {
    expect(formatStatusLabel("a")).toBe("A");
  });
});