import "@/global.css";
import { ClerkLoaded, ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { LogBox } from "react-native";
import { PostHogErrorBoundary, PostHogProvider } from "posthog-react-native";
import { posthog } from "@/lib/posthog";
LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys"]);

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

// ─── Auth redirect guard ────────────────────────────────────────────────────
function AuthGuard() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isUserLoaded) return;

    if (isSignedIn && user) {
      if (identifiedUserId.current !== user.id) {
        posthog?.identify(user.id, {
          $set: user.primaryEmailAddress?.emailAddress
            ? { email: user.primaryEmailAddress.emailAddress }
            : {},
        });
        identifiedUserId.current = user.id;
      }
      return;
    }

    if (identifiedUserId.current) {
      posthog?.reset();
      identifiedUserId.current = null;
    }
  }, [isLoaded, isSignedIn, isUserLoaded, user]);

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
  }, [isLoaded, isSignedIn, segments]);

  return <Slot />;
}

// ─── Root layout ─────────────────────────────────────────────────────────────
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
      <ClerkLoaded>
        {posthog ? (
          <PostHogProvider client={posthog}>
            <PostHogErrorBoundary fallback={null}>
              <AuthGuard />
            </PostHogErrorBoundary>
          </PostHogProvider>
        ) : (
          <AuthGuard />
        )}
      </ClerkLoaded>
    </ClerkProvider>
  );
}
