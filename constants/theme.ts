export const colors = {
  background: "#09090B",
  foreground: "#F8FAFC",
  card: "#141417",
  muted: "#202025",
  mutedForeground: "rgba(248, 250, 252, 0.55)",
  primary: "#18181B",
  accent: "#6366F1",
  border: "rgba(255, 255, 255, 0.1)",
  success: "#10B981",
  destructive: "#FF4757",
  subscription: "#1E1B4B",
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  18: 72,
  20: 80,
  24: 96,
  30: 120,
} as const;

export const components = {
  tabBar: {
    height: spacing[18],
    horizontalInset: spacing[5],
    radius: spacing[8],
    iconFrame: spacing[12],
    itemPaddingVertical: spacing[2],
  },
} as const;

export const theme = {
  colors,
  spacing,
  components,
} as const;
