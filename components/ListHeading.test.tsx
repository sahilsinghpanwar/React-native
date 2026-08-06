import { render, screen } from "@testing-library/react-native";
import React from "react";
import ListHeading from "./ListHeading";

describe("ListHeading", () => {
  it("renders the provided title", () => {
    render(<ListHeading title="Upcoming" />);
    expect(screen.getByText("Upcoming")).toBeTruthy();
  });

  it("renders the static 'view all' action text", () => {
    render(<ListHeading title="All Subscription" />);
    expect(screen.getByText("view all")).toBeTruthy();
  });

  it("re-renders with a new title when props change", () => {
    const { rerender } = render(<ListHeading title="Upcoming" />);
    expect(screen.getByText("Upcoming")).toBeTruthy();

    rerender(<ListHeading title="All Subscription" />);
    expect(screen.getByText("All Subscription")).toBeTruthy();
    expect(screen.queryByText("Upcoming")).toBeNull();
  });

  it("renders an empty title without crashing", () => {
    render(<ListHeading title="" />);
    expect(screen.getByText("view all")).toBeTruthy();
  });
});