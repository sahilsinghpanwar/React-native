// Provide the officially recommended jest mock for react-native-safe-area-context
// so components using SafeAreaView/useSafeAreaInsets render without requiring a
// real SafeAreaProvider ancestor in tests.
jest.mock("react-native-safe-area-context", () =>
  require("react-native-safe-area-context/jest/mock"),
);