import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.tibyan",
  appName: "تِبْيَان",
  webDir: ".output/public",
  android: {
    allowMixedContent: false,
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon",
      iconColor: "#0a5c3f",
      sound: "salawat",
    },
  },
};

export default config;
