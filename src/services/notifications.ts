import { LocalNotifications } from "@capacitor/local-notifications";
import { playReminderSound, unlockAudio, type SoundId } from "./sound";

export const INTERVALS = [5, 15, 30, 60, 120] as const;
export type IntervalMinutes = (typeof INTERVALS)[number];

const isBrowser = () => typeof window !== "undefined";

function isNative(): boolean {
  if (!isBrowser()) return false;
  const cap = (window as unknown as {
    Capacitor?: { isNativePlatform?: () => boolean };
  }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}

let webTimer: ReturnType<typeof setInterval> | undefined;

export interface ScheduleOptions {
  minutes: IntervalMinutes;
  body: string;
  sound?: string;
  soundId?: SoundId;
}

export async function requestPermission(): Promise<boolean> {
  if (!isBrowser()) return false;

  if (isNative()) {
    const result = await LocalNotifications.requestPermissions();
    return result.display === "granted";
  }

  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  return (await Notification.requestPermission()) === "granted";
}

export async function schedule(options: ScheduleOptions): Promise<void> {
  if (!isBrowser()) return;

  await cancelAll();
  const soundId: SoundId = options.soundId ?? "salawat";

  if (isNative()) {
    try {
      const granted = await requestPermission();
      if (!granted) return;

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: "تِبْيَان",
            body: options.body,
            sound: options.sound
              ? options.sound.replace(/\.mp3$/i, "")
              : "salawat",
            channelId: "tibyan_salawat",
            schedule: {
              at: new Date(Date.now() + options.minutes * 60_000),
              repeats: true,
              every: "minute",
              allowWhileIdle: true,
            },
          },
        ],
      });
      return;
    } catch {
      // Browser fallback.
    }
  }

  await unlockAudio();
  const granted = await requestPermission();

  webTimer = setInterval(
    () => {
      void playReminderSound(soundId);
      if (granted) {
        try {
          new Notification("تِبْيَان", { body: options.body });
        } catch {
          // Notification unavailable.
        }
      }
    },
    options.minutes * 60 * 1000,
  );
}

export async function cancelAll(): Promise<void> {
  if (webTimer) {
    clearInterval(webTimer);
    webTimer = undefined;
  }

  if (!isNative()) return;

  try {
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
  } catch {
    // Nothing to cancel.
  }
}
