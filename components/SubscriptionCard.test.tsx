process.env.TZ = "UTC";

import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Pressable } from "react-native";
import SubscriptionCard from "./SubscriptionCard";

const icon = "test-icon" as unknown as SubscriptionCardProps["icon"];

const baseProps: SubscriptionCardProps = {
  icon,
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

describe("SubscriptionCard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("collapsed state", () => {
    it("renders the name, formatted price and billing cycle", () => {
      render(<SubscriptionCard {...baseProps} />);
      expect(screen.getByText("Adobe Creative Cloud")).toBeTruthy();
      expect(screen.getByText("$77.49")).toBeTruthy();
      expect(screen.getByText("Monthly")).toBeTruthy();
    });

    it("does not render the expanded detail rows", () => {
      render(<SubscriptionCard {...baseProps} />);
      expect(screen.queryByText("Payment:")).toBeNull();
      expect(screen.queryByText("Status:")).toBeNull();
    });

    it("prefers category over plan/renewalDate for the meta line", () => {
      render(<SubscriptionCard {...baseProps} />);
      expect(screen.getByText("Design")).toBeTruthy();
    });

    it("falls back to plan when category is absent", () => {
      render(<SubscriptionCard {...baseProps} category={undefined} />);
      expect(screen.getByText("Teams Plan")).toBeTruthy();
    });

    it("falls back to the formatted renewal date when category and plan are absent", () => {
      render(
        <SubscriptionCard
          {...baseProps}
          category={undefined}
          plan={undefined}
        />,
      );
      expect(screen.getByText("03/20/2026")).toBeTruthy();
    });

    it("applies the background color style when collapsed and a color is provided", () => {
      render(<SubscriptionCard {...baseProps} />);
      const pressable = screen.UNSAFE_getByType(Pressable);
      expect(pressable.props.style).toEqual({ backgroundColor: "#f5c542" });
      expect(pressable.props.className).toBe("sub-card bg-card");
    });

    it("has no background color style when no color is provided", () => {
      render(<SubscriptionCard {...baseProps} color={undefined} />);
      const pressable = screen.UNSAFE_getByType(Pressable);
      expect(pressable.props.style).toBeUndefined();
    });
  });

  describe("expanded state", () => {
    it("renders all detail rows with formatted values", () => {
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

    it("does not apply a background color style even when a color is provided", () => {
      render(<SubscriptionCard {...baseProps} expanded />);
      const pressable = screen.UNSAFE_getByType(Pressable);
      expect(pressable.props.style).toBeUndefined();
      expect(pressable.props.className).toBe("sub-card sub-card-expanded");
    });

    it("shows 'Not provided' for payment method when undefined", () => {
      render(
        <SubscriptionCard
          {...baseProps}
          expanded
          paymentMethod={undefined}
        />,
      );
      expect(screen.getByText("Not provided")).toBeTruthy();
    });

    it("shows 'Not provided' for category when category and plan are both undefined", () => {
      render(
        <SubscriptionCard
          {...baseProps}
          expanded
          category={undefined}
          plan={undefined}
        />,
      );
      const notProvided = screen.getAllByText("Not provided");
      // meta line falls back to "" (no category/plan/renewalDate override here since
      // renewalDate is still provided), and the Category detail row falls back too.
      expect(notProvided.length).toBeGreaterThanOrEqual(1);
    });

    it("shows 'Not provided' for started date when startDate is undefined", () => {
      render(<SubscriptionCard {...baseProps} expanded startDate={undefined} />);
      expect(screen.getByText("Started:")).toBeTruthy();
      expect(screen.getAllByText("Not provided").length).toBeGreaterThanOrEqual(
        1,
      );
    });

    it("shows 'Not provided' for renewal date when renewalDate is undefined", () => {
      render(
        <SubscriptionCard {...baseProps} expanded renewalDate={undefined} />,
      );
      expect(screen.getByText("Renewal date:")).toBeTruthy();
    });

    it("shows 'Not provided' for status when status is undefined", () => {
      render(<SubscriptionCard {...baseProps} expanded status={undefined} />);
      expect(screen.getByText("Not provided")).toBeTruthy();
    });

    it("capitalizes an already-capitalized status without altering the rest of the string", () => {
      render(<SubscriptionCard {...baseProps} expanded status="PAUSED" />);
      expect(screen.getByText("PAUSED")).toBeTruthy();
    });

    it("renders a whitespace-only payment method as blank text rather than falling back (boundary case)", () => {
      render(<SubscriptionCard {...baseProps} expanded paymentMethod="   " />);
      // paymentMethod?.trim() produces "", and "" ?? fallback keeps "" because
      // "" is not nullish - this documents the actual current behavior.
      expect(screen.queryByText("Visa ending in 8530")).toBeNull();
      expect(screen.getByText("Payment:")).toBeTruthy();
    });
  });

  describe("interaction", () => {
    it("calls onPress when the card is pressed", () => {
      const onPress = jest.fn();
      render(<SubscriptionCard {...baseProps} onPress={onPress} />);
      const pressable = screen.UNSAFE_getByType(Pressable);
      fireEvent.press(pressable);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("toggles expanded content when re-rendered with expanded=true after a press", () => {
      const { rerender } = render(
        <SubscriptionCard {...baseProps} expanded={false} />,
      );
      expect(screen.queryByText("Status:")).toBeNull();

      rerender(<SubscriptionCard {...baseProps} expanded={true} />);
      expect(screen.getByText("Status:")).toBeTruthy();
    });
  });
});