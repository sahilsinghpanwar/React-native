import { render, screen } from "@testing-library/react-native";
import React from "react";
import UpcomingSubscriptionCard from "./UpcomingSubscriptionCard";

const baseProps: UpcomingSubscription = {
  id: "spotify",
  icon: "test-icon" as unknown as UpcomingSubscription["icon"],
  name: "Spotify",
  price: 5.99,
  currency: "USD",
  daysLeft: 2,
};

describe("UpcomingSubscriptionCard", () => {
  it("renders the subscription name", () => {
    render(<UpcomingSubscriptionCard {...baseProps} />);
    expect(screen.getByText("Spotify")).toBeTruthy();
  });

  it("renders the price formatted as currency", () => {
    render(<UpcomingSubscriptionCard {...baseProps} />);
    expect(screen.getByText("$5.99")).toBeTruthy();
  });

  it("uses USD as the default currency when none is provided", () => {
    const { currency, ...rest } = baseProps;
    render(<UpcomingSubscriptionCard {...rest} price={12} />);
    expect(screen.getByText("$12.00")).toBeTruthy();
  });

  it("shows 'X days left' when more than one day remains", () => {
    render(<UpcomingSubscriptionCard {...baseProps} daysLeft={4} />);
    expect(screen.getByText("4 days left")).toBeTruthy();
  });

  it("shows 'Last day' when exactly one day remains", () => {
    render(<UpcomingSubscriptionCard {...baseProps} daysLeft={1} />);
    expect(screen.getByText("Last day")).toBeTruthy();
  });

  it("shows 'Last day' when zero days remain (boundary case)", () => {
    render(<UpcomingSubscriptionCard {...baseProps} daysLeft={0} />);
    expect(screen.getByText("Last day")).toBeTruthy();
  });

  it("shows 'Last day' for a negative daysLeft value (defensive edge case)", () => {
    render(<UpcomingSubscriptionCard {...baseProps} daysLeft={-1} />);
    expect(screen.getByText("Last day")).toBeTruthy();
  });

  it("formats a different currency correctly", () => {
    render(
      <UpcomingSubscriptionCard {...baseProps} price={12} currency="EUR" />,
    );
    expect(screen.getByText("€12.00")).toBeTruthy();
  });
});