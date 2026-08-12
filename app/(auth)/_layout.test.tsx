import { render } from "@testing-library/react-native";
import React from "react";

const useFontsMock = jest.fn();
const hideAsyncMock = jest.fn();

jest.mock("expo-font", () => ({
  useFonts: (...args: unknown[]) => useFontsMock(...args),
}));

jest.mock("expo-splash-screen", () => ({
  hideAsync: (...args: unknown[]) => hideAsyncMock(...args),
}));

jest.mock("expo-router", () => {
  const ActualReact = require("react");
  const Stack = () => ActualReact.createElement("Stack", null);
  return { Stack };
});

import RootLayout from "./_layout";

describe("app/(auth)/_layout (RootLayout)", () => {
  beforeEach(() => {
    useFontsMock.mockReset();
    hideAsyncMock.mockReset();
  });

  it("renders nothing while fonts are still loading", () => {
    useFontsMock.mockReturnValue([false]);
    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).toBeNull();
  });

  it("does not hide the splash screen while fonts are still loading", () => {
    useFontsMock.mockReturnValue([false]);
    render(<RootLayout />);
    expect(hideAsyncMock).not.toHaveBeenCalled();
  });

  it("renders the Stack once fonts have finished loading", () => {
    useFontsMock.mockReturnValue([true]);
    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).not.toBeNull();
  });

  it("hides the splash screen once fonts have finished loading", () => {
    useFontsMock.mockReturnValue([true]);
    render(<RootLayout />);
    expect(hideAsyncMock).toHaveBeenCalledTimes(1);
  });

  it("requests the expected set of PlusJakartaSans font weights", () => {
    useFontsMock.mockReturnValue([true]);
    render(<RootLayout />);
    expect(useFontsMock).toHaveBeenCalledTimes(1);
    const requestedFonts = useFontsMock.mock.calls[0][0];
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

  it("re-renders and hides the splash screen when fonts transition from not-loaded to loaded", () => {
    useFontsMock.mockReturnValue([false]);
    const { rerender, toJSON } = render(<RootLayout />);
    expect(toJSON()).toBeNull();
    expect(hideAsyncMock).not.toHaveBeenCalled();

    useFontsMock.mockReturnValue([true]);
    rerender(<RootLayout />);
    expect(toJSON()).not.toBeNull();
    expect(hideAsyncMock).toHaveBeenCalledTimes(1);
  });
});