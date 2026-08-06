import { render } from "@testing-library/react-native";
import React from "react";

const screenSpy = jest.fn(() => null);

jest.mock("expo-router", () => {
  const ActualReact = require("react");
  const Stack = ({ children }: { children?: React.ReactNode }) =>
    ActualReact.createElement(
      "Stack",
      null,
      children,
    );
  Stack.Screen = (props: Record<string, unknown>) => {
    screenSpy(props);
    return null;
  };
  return { Stack };
});

import RootLayout from "./_layout";

describe("app/_layout (RootLayout)", () => {
  beforeEach(() => {
    screenSpy.mockClear();
  });

  it("renders without crashing", () => {
    expect(() => render(<RootLayout />)).not.toThrow();
  });

  it("registers a Stack.Screen for the (tabs) group with the header hidden", () => {
    render(<RootLayout />);
    expect(screenSpy).toHaveBeenCalledTimes(1);
    expect(screenSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "(tabs)",
        options: { headerShown: false },
      }),
    );
  });
});