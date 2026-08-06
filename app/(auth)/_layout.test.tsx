import { render } from "@testing-library/react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import RootLayout from "./_layout";

jest.mock("@/global.css", () => ({}), { virtual: true });

jest.mock("expo-font", () => ({
  useFonts: jest.fn(),
}));

jest.mock("expo-splash-screen", () => ({
  hideAsync: jest.fn(),
}));

jest.mock("expo-router", () => {
  const Stack = jest.fn((props: any) => props.children ?? null);
  return { Stack };
});

const mockedUseFonts = useFonts as jest.Mock;
const mockedHideAsync = SplashScreen.hideAsync as jest.Mock;

describe("RootLayout (app/(auth)/_layout.tsx)", () => {
  beforeEach(() => {
    mockedUseFonts.mockReset();
    mockedHideAsync.mockReset();
  });

  it("renders nothing while fonts are still loading", () => {
    mockedUseFonts.mockReturnValue([false, null]);

    const { toJSON } = render(<RootLayout />);

    expect(toJSON()).toBeNull();
    expect(mockedHideAsync).not.toHaveBeenCalled();
  });

  it("renders the Stack and hides the splash screen once fonts are loaded", () => {
    mockedUseFonts.mockReturnValue([true, null]);

    render(<RootLayout />);

    expect(mockedHideAsync).toHaveBeenCalledTimes(1);
  });

  it("passes headerShown: false in the Stack's screenOptions", () => {
    mockedUseFonts.mockReturnValue([true, null]);

    render(<RootLayout />);

    const { Stack } = require("expo-router");
    const receivedProps = Stack.mock.calls[0][0];
    expect(receivedProps.screenOptions).toEqual({ headerShown: false });
  });

  it("requests the expected Plus Jakarta Sans font family keys", () => {
    mockedUseFonts.mockReturnValue([true, null]);

    render(<RootLayout />);

    const requestedFonts = mockedUseFonts.mock.calls[0][0];
    expect(Object.keys(requestedFonts).sort()).toEqual(
      [
        "sans-bold",
        "sans-extrabold",
        "sans-light",
        "sans-medium",
        "sans-regular",
        "sans-semibold",
      ].sort(),
    );
  });

  it("does not hide the splash screen again when fontsLoaded stays true across re-renders", () => {
    mockedUseFonts.mockReturnValue([true, null]);

    const { rerender } = render(<RootLayout />);
    rerender(<RootLayout />);

    expect(mockedHideAsync).toHaveBeenCalledTimes(1);
  });
});