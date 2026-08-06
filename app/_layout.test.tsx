import React from "react";

jest.mock("@/global.css", () => ({}), { virtual: true });

jest.mock("expo-router", () => {
  const Stack: any = ({ children }: any) => children ?? null;
  Stack.Screen = () => null;
  return { Stack };
});

import { Stack } from "expo-router";
import RootLayout from "./_layout";

describe("RootLayout (app/_layout.tsx)", () => {
  it("renders a single Stack containing the (tabs) screen", () => {
    const element = RootLayout() as React.ReactElement;

    expect(element.type).toBe(Stack);

    const children = React.Children.toArray(element.props.children);
    expect(children).toHaveLength(1);
  });

  it("configures the (tabs) screen with the header hidden", () => {
    const element = RootLayout() as React.ReactElement;
    const [screen] = React.Children.toArray(
      element.props.children,
    ) as React.ReactElement[];

    expect(screen.type).toBe(Stack.Screen);
    expect(screen.props.name).toBe("(tabs)");
    expect(screen.props.options).toEqual({ headerShown: false });
  });
});