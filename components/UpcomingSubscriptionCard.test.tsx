import { render, screen } from "@testing-library/react-native";
import React from "react";
import UpcomingSubscriptionCard from "./UpcomingSubscriptionCard";

const baseProps: UpcomingSubscription = {
  id: "spotify",
  icon: { uri: "spotify-icon" },
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

  it("falls back to USD formatting when currency is omitted", () => {
    render(
      <UpcomingSubscriptionCard
        {...baseProps}
        currency={undefined}
        price={12}
      />,
    );
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

  it("shows 'Last day' when zero or negative days remain", () => {
    render(<UpcomingSubscriptionCard {...baseProps} daysLeft={0} />);
    expect(screen.getByText("Last day")).toBeTruthy();
  });

  it("renders the icon with the provided image source", () => {
    render(<UpcomingSubscriptionCard {...baseProps} />);
    const image = screen.UNSAFE_getByProps({ source: baseProps.icon });
    expect(image).toBeTruthy();
  });
});