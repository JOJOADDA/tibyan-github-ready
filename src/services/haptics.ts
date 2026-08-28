import { Haptics, ImpactStyle } from "@capacitor/haptics";

const isBrowser = () => typeof window !== "undefined";

function isNative(): boolean {
  if (!isBrowser()) return false;
  const cap = (window as unknown as {
    Capacitor?: { isNativePlatform?: () => boolean };
  }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}

export async function impact(kind: "light" | "heavy" = "light"): Promise<void> {
  if (!isBrowser()) return;

  if (isNative()) {
    try {
      await Haptics.impact({
        style: kind === "heavy" ? ImpactStyle.Heavy : ImpactStyle.Light,
      });
      return;
    } catch {
      // Browser fallback below.
    }
  }

  try {
    navigator.vibrate?.(kind === "heavy" ? [30, 40, 30] : 12);
  } catch {
    // Vibration unsupported.
  }
}
