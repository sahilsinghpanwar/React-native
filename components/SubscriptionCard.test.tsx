process.env.TZ = "UTC";

import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import SubscriptionCard from "./SubscriptionCard";

const baseProps: SubscriptionCardProps = {
  icon: { uri: "adobe-icon" },
  name: "Adobe Creative Cloud",
  plan: "Teams Plan",
  category: "Design",
  paymentMethod: "Visa ending in 8530",
  status: "active",
  startDate: "2025-03-20T10:00:00.000Z",
  price: 77.49,
  currency: "USD",
  billing: "Monthly",
  renewalDate: "2026-03-20T10:00:00.000Z",
  color: "#f5c542",
  expanded: false,
  onPress: jest.fn(),
};

describe("SubscriptionCard - collapsed state", () => {
  it("renders the name, formatted price and billing cycle", () => {
    render(<SubscriptionCard {...baseProps} />);
    expect(screen.getByText("Adobe Creative Cloud")).toBeTruthy();
    expect(screen.getByText("$77.49")).toBeTruthy();
    expect(screen.getByText("Monthly")).toBeTruthy();
  });

  it("prefers the category for the meta line when provided", () => {
    render(<SubscriptionCard {...baseProps} />);
    expect(screen.getByText("Design")).toBeTruthy();
  });

  it("falls back to the plan when category is missing", () => {
    render(<SubscriptionCard {...baseProps} category={undefined} />);
    expect(screen.getByText("Teams Plan")).toBeTruthy();
  });

  it("falls back to the plan when category is an empty/whitespace string", () => {
    render(<SubscriptionCard {...baseProps} category="   " />);
    expect(screen.getByText("Teams Plan")).toBeTruthy();
  });

  it("falls back to the formatted renewal date when category and plan are missing", () => {
    render(
      <SubscriptionCard
        {...baseProps}
        category={undefined}
        plan={undefined}
      />,
    );
    expect(screen.getByText("03/20/2026")).toBeTruthy();
  });

  it("does not render the expanded details section", () => {
    render(<SubscriptionCard {...baseProps} />);
    expect(screen.queryByText("Payment:")).toBeNull();
    expect(screen.queryByText("Status:")).toBeNull();
  });

  it("calls onPress when the card is pressed", () => {
    const onPress = jest.fn();
    render(<SubscriptionCard {...baseProps} onPress={onPress} />);
    fireEvent.press(screen.getByText("Adobe Creative Cloud"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("applies the provided background color inline when collapsed", () => {
    const { toJSON } = render(<SubscriptionCard {...baseProps} />);
    const root: any = toJSON();
    expect(root.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#f5c542" }),
    );
  });

  it("does not apply an inline background color when no color is provided", () => {
    const { toJSON } = render(
      <SubscriptionCard {...baseProps} color={undefined} />,
    );
    const root: any = toJSON();
    expect(root.props.style).toBeUndefined();
  });
});

describe("SubscriptionCard - expanded state", () => {
  it("renders the full set of detail rows", () => {
    render(<SubscriptionCard {...baseProps} expanded />);
    expect(screen.getByText("Payment:")).toBeTruthy();
    expect(screen.getByText("Visa ending in 8530")).toBeTruthy();
    expect(screen.getByText("Category:")).toBeTruthy();
    expect(screen.getByText("Started:")).toBeTruthy();
    expect(screen.getByText("03/20/2025")).toBeTruthy();
    expect(screen.getByText("Renewal date:")).toBeTruthy();
    expect(screen.getByText("03/20/2026")).toBeTruthy();
    expect(screen.getByText("Status:")).toBeTruthy();
    expect(screen.getByText("Active")).toBeTruthy();
  });

  it("does not apply the inline background color even when a color is provided", () => {
    const { toJSON } = render(<SubscriptionCard {...baseProps} expanded />);
    const root: any = toJSON();
    expect(root.props.style).toBeUndefined();
  });

  it("shows 'Not provided' fallback for missing payment method", () => {
    render(
      <SubscriptionCard {...baseProps} expanded paymentMethod={undefined} />,
    );
    expect(screen.getAllByText("Not provided").length).toBeGreaterThan(0);
  });

  it("shows 'Not provided' fallback for missing start and renewal dates", () => {
    render(
      <SubscriptionCard
        {...baseProps}
        expanded
        startDate={undefined}
        renewalDate={undefined}
      />,
    );
    expect(screen.getAllByText("Not provided").length).toBeGreaterThanOrEqual(
      2,
    );
  });

  it("shows 'Not provided' fallback for missing status", () => {
    render(<SubscriptionCard {...baseProps} expanded status={undefined} />);
    expect(screen.queryByText("Active")).toBeNull();
    expect(screen.getAllByText("Not provided").length).toBeGreaterThan(0);
  });

  it("falls back to plan for the category row when category is missing", () => {
    render(
      <SubscriptionCard {...baseProps} expanded category={undefined} />,
    );
    expect(screen.getAllByText("Teams Plan").length).toBeGreaterThan(0);
  });
});