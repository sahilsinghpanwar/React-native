type ClerkApiErrorItem = {
  code?: string;
  message?: string;
  longMessage?: string;
  meta?: { paramName?: string };
};

type ClerkApiError = {
  errors?: ClerkApiErrorItem[];
  message?: string;
};

const normalizeFieldKey = (paramName: string) => {
  if (paramName === "email_address") return "emailAddress";
  return paramName;
};

export const parseClerkApiError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return { fieldErrors: {} as Record<string, string>, formError: null };
  }

  const clerkError = error as ClerkApiError;
  const fieldErrors: Record<string, string> = {};

  for (const item of clerkError.errors ?? []) {
    const paramName = item.meta?.paramName;
    if (!paramName) continue;

    fieldErrors[normalizeFieldKey(paramName)] =
      item.longMessage || item.message || "Something went wrong. Please try again.";
  }

  const firstError = clerkError.errors?.[0];
  const formError =
    firstError?.longMessage ||
    firstError?.message ||
    clerkError.message ||
    null;

  return { fieldErrors, formError };
};
