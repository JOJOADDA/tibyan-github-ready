# Tibyan — GitHub/VPS + Capacitor Android build

## Architecture

The website uses TanStack Start SSR/Nitro.

The Android app uses TanStack Start SPA mode and loads `.output/public/index.html`
locally through Capacitor. The Android app must NOT depend on the VPS SSR port.

## GitHub

Commit the source and the `android/` directory after the first `npx cap add android`.
Do not commit `node_modules`, `.output`, or Gradle build outputs.

## VPS build

```bash
git pull
npm ci
npm run build:mobile
npx cap sync android
cd android
./gradlew assembleDebug
```

APK:

`android/app/build/outputs/apk/debug/app-debug.apk`

Release:

```bash
npm run android:release
```

## Website SSR

```bash
npm run build:web
```

Run the generated SSR server using the existing PM2/Nginx setup.

## Critical rule

Do not add `server.url` to `capacitor.config.ts`.

The APK must boot from local web assets. `172.16.0.4:3000` is not a valid runtime
dependency for the Android package.

## Native notification sound

After `npx cap add android`, put the Android notification sound at:

`android/app/src/main/res/raw/salawat.mp3`

Android resource names must be lowercase and use underscores only.

Then:

```bash
npx cap sync android
```
