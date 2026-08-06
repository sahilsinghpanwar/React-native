import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const projectToken =
  process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN ??
  Constants.expoConfig?.extra?.posthogProjectToken;
const host =
  process.env.EXPO_PUBLIC_POSTHOG_HOST ?? Constants.expoConfig?.extra?.posthogHost;

const isConfigured = Boolean(projectToken && host);

if (__DEV__) {
  const missingVariable = !projectToken
    ? "EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN"
    : !host
      ? "EXPO_PUBLIC_POSTHOG_HOST"
      : undefined;

  if (missingVariable) {
    throw new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
}

export const posthog = isConfigured
  ? new PostHog(projectToken, {
      host,
      captureAppLifecycleEvents: true,
    })
  : undefined;
