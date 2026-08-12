process.env.TZ = "UTC";

import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Pressable } from "react-native";
import HomeScreen from "./index";

describe("app/(tabs)/index (HomeScreen)", () => {
  it("renders the home user's name", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Sahil Panwar")).toBeTruthy();
  });

  it("renders the formatted balance amount and next renewal date", () => {
    render(<HomeScreen />);
    expect(screen.getByText("$2,489.48")).toBeTruthy();
    expect(screen.getByText("03/18")).toBeTruthy();
  });

  it("renders both list section headings", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Upcoming")).toBeTruthy();
    expect(screen.getByText("All Subscription")).toBeTruthy();
    expect(screen.getAllByText("view all").length).toBe(2);
  });

  it("renders every upcoming subscription with formatted price and days-left copy", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Spotify")).toBeTruthy();
    expect(screen.getByText("$5.99")).toBeTruthy();
    expect(screen.getByText("2 days left")).toBeTruthy();

    expect(screen.getByText("Notion")).toBeTruthy();
    expect(screen.getByText("$12.00")).toBeTruthy();
    expect(screen.getByText("4 days left")).toBeTruthy();

    expect(screen.getByText("Figma")).toBeTruthy();
    expect(screen.getByText("$15.00")).toBeTruthy();
    expect(screen.getByText("6 days left")).toBeTruthy();
  });

  it("renders every subscription in the main list, collapsed by default", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Adobe Creative Cloud")).toBeTruthy();
    expect(screen.getByText("GitHub Pro")).toBeTruthy();
    expect(screen.getByText("Claude Pro")).toBeTruthy();
    expect(screen.getByText("Canva Pro")).toBeTruthy();

    // No card should be expanded initially.
    expect(screen.queryByText("Payment:")).toBeNull();
  });

  it("expands a subscription card when it is pressed", () => {
    render(<HomeScreen />);
    const pressables = screen.UNSAFE_getAllByType(Pressable);

    fireEvent.press(pressables[0]);

    expect(screen.getByText("Payment:")).toBeTruthy();
    expect(screen.getByText("Visa ending in 8530")).toBeTruthy();
  });

  it("collapses the currently expanded card and expands the newly pressed one (single-expansion behavior)", () => {
    render(<HomeScreen />);
    const pressables = screen.UNSAFE_getAllByType(Pressable);

    fireEvent.press(pressables[0]);
    expect(screen.getByText("Visa ending in 8530")).toBeTruthy();

    fireEvent.press(pressables[1]);
    expect(screen.queryByText("Visa ending in 8530")).toBeNull();
    expect(screen.getByText("Mastercard ending in 2408")).toBeTruthy();
  });

  it("collapses a card when it is pressed a second time", () => {
    render(<HomeScreen />);
    const pressables = screen.UNSAFE_getAllByType(Pressable);

    fireEvent.press(pressables[0]);
    expect(screen.getByText("Visa ending in 8530")).toBeTruthy();

    fireEvent.press(pressables[0]);
    expect(screen.queryByText("Visa ending in 8530")).toBeNull();
    expect(screen.queryByText("Payment:")).toBeNull();
  });

  it("renders the empty-state messages when there is no subscription data", () => {
    jest.resetModules();
    jest.doMock("@/constants/data", () => ({
      HOME_USER: { name: "Test User" },
      HOME_BALANCE: {
        amount: 0,
        nextRenewalDate: "2026-01-01T00:00:00.000Z",
      },
      HOME_SUBSCRIPTIONS: [],
      UPCOMING_SUBSCRIPTIONS: [],
    }));

    let EmptyHomeScreen!: typeof HomeScreen;
    jest.isolateModules(() => {
      EmptyHomeScreen = require("./index").default;
    });

    render(<EmptyHomeScreen />);
    expect(screen.getByText("No subscription yet.")).toBeTruthy();
    expect(screen.getByText("No upcoming renewals yet.")).toBeTruthy();

    jest.dontMock("@/constants/data");
  });
});