process.env.TZ = "UTC";

import { fireEvent, render, screen } from "@testing-library/react-native";
import dayjs from "dayjs";
import React from "react";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "../../constants/data";
import { formatCurrency } from "../../lib/utils";
import HomeScreen from "./index";

jest.mock("nativewind", () => ({
  styled: (Component: any) => Component,
}));

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: any) => (
      <View {...props}>{children}</View>
    ),
  };
});

describe("Home screen (app/(tabs)/index.tsx)", () => {
  it("renders the signed-in user's name in the header", () => {
    render(<HomeScreen />);
    expect(screen.getByText(HOME_USER.name)).toBeTruthy();
  });

  it("renders the formatted balance amount and next renewal date", () => {
    render(<HomeScreen />);
    expect(
      screen.getByText(formatCurrency(HOME_BALANCE.amount)),
    ).toBeTruthy();
    expect(
      screen.getByText(dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")),
    ).toBeTruthy();
  });

  it("renders both the 'Upcoming' and 'All Subscription' section headings", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Upcoming")).toBeTruthy();
    expect(screen.getByText("All Subscription")).toBeTruthy();
  });

  it("renders every upcoming subscription from constants/data", () => {
    render(<HomeScreen />);
    UPCOMING_SUBSCRIPTIONS.forEach((item) => {
      expect(screen.getByText(item.name)).toBeTruthy();
    });
  });

  it("renders every subscription collapsed by default", () => {
    render(<HomeScreen />);
    HOME_SUBSCRIPTIONS.forEach((item) => {
      expect(screen.getByText(item.name)).toBeTruthy();
    });
    expect(screen.queryByText("Payment:")).toBeNull();
  });

  it("expands a subscription card when it is pressed", () => {
    render(<HomeScreen />);
    const first = HOME_SUBSCRIPTIONS[0];

    fireEvent.press(screen.getByText(first.name));

    expect(screen.getAllByText("Payment:")).toHaveLength(1);
  });

  it("collapses a subscription card when it is pressed a second time", () => {
    render(<HomeScreen />);
    const first = HOME_SUBSCRIPTIONS[0];

    fireEvent.press(screen.getByText(first.name));
    fireEvent.press(screen.getByText(first.name));

    expect(screen.queryByText("Payment:")).toBeNull();
  });

  it("only keeps a single subscription card expanded at a time", () => {
    render(<HomeScreen />);
    const [first, second] = HOME_SUBSCRIPTIONS;

    fireEvent.press(screen.getByText(first.name));
    expect(screen.getAllByText("Payment:")).toHaveLength(1);

    fireEvent.press(screen.getByText(second.name));
    expect(screen.getAllByText("Payment:")).toHaveLength(1);
  });

  it("shows the empty-subscriptions message when there is no subscription data", () => {
    const originalSubscriptions = [...HOME_SUBSCRIPTIONS];
    HOME_SUBSCRIPTIONS.splice(0, HOME_SUBSCRIPTIONS.length);

    try {
      render(<HomeScreen />);
      expect(screen.getByText("No subscription yet.")).toBeTruthy();
    } finally {
      HOME_SUBSCRIPTIONS.push(...originalSubscriptions);
    }
  });

  it("shows the empty-upcoming-renewals message when there is no upcoming data", () => {
    const originalUpcoming = [...UPCOMING_SUBSCRIPTIONS];
    UPCOMING_SUBSCRIPTIONS.splice(0, UPCOMING_SUBSCRIPTIONS.length);

    try {
      render(<HomeScreen />);
      expect(screen.getByText("No upcoming renewals yet.")).toBeTruthy();
    } finally {
      UPCOMING_SUBSCRIPTIONS.push(...originalUpcoming);
    }
  });
});