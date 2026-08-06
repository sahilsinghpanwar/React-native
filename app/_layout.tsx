import "@/global.css";
import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PostHogErrorBoundary, PostHogProvider } from "posthog-react-native";
import { useEffect, type ReactNode } from "react";
import { LogBox, StyleSheet, Text, View } from "react-native";
import { posthog } from "@/lib/posthog";
LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys"]);

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

// ─── Auth redirect guard ────────────────────────────────────────────────────
function ErrorFallback() {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>Please restart the app and try again.</Text>
    </View>
  );
}

function PostHogBoundary({ children }: { children: ReactNode }) {
  if (!posthog) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary fallback={ErrorFallback}>
        {children}
      </PostHogErrorBoundary>
    </PostHogProvider>
  );
}

function AuthGuard() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && inAuthGroup) {
      // Signed-in users shouldn't be on auth screens
      router.replace("/(tabs)");
    } else if (!isSignedIn && !inAuthGroup) {
      // Signed-out users must authenticate first
      router.replace("/(auth)/sign-in");
    }
  }, [isLoaded, isSignedIn, router, segments]);

  return <Slot />;
}

// ─── Root layout ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  errorContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  errorMessage: {
    marginTop: 8,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <PostHogBoundary>
        <ClerkLoaded>
          <AuthGuard />
        </ClerkLoaded>
      </PostHogBoundary>
    </ClerkProvider>
  );
}
