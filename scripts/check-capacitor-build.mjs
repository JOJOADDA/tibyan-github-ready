import { existsSync } from "node:fs";
import { resolve } from "node:path";

const required = resolve(".output/public/index.html");

if (!existsSync(required)) {
  console.error("\n❌ Capacitor build failed: .output/public/index.html is missing.\n");
  console.error("The Android build was intentionally stopped to prevent a white-screen APK.\n");
  process.exit(1);
}

console.log("✅ Capacitor build verified: .output/public/index.html exists.");
