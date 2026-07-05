# How to build and run the Android app

Your project has been set up with **Capacitor** and **Ionic**, and the Android platform has been added successfully. The Android native code now resides in the `android/` directory in the root of your project.

Follow these steps to build the APK and run the application on an Android device or emulator.

## Prerequisites

To build the APK, you will need the Android SDK. The easiest way to get the Android SDK is by installing **Android Studio**.
- Download and install [Android Studio](https://developer.android.com/studio).

## Step 1: Open the Project in Android Studio

1. Open Android Studio.
2. Select **Open an existing Android Studio project**.
3. Navigate to your project folder and select the `android/` directory (`/home/reyfuu/fintrack/android`).
4. Wait for Android Studio to sync the Gradle project. It will automatically download the required Gradle version and Android SDK components.

## Step 2: Build the APK

Once the Gradle sync is complete, you can build the APK.

1. In Android Studio, go to the top menu bar.
2. Click on **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
3. Once the build is finished, a popup will appear in the bottom right corner with a link to **locate** the generated APK.
4. The generated APK will be located in `android/app/build/outputs/apk/debug/app-debug.apk`.

### Alternative: Building via Command Line (Gradle)

If you prefer using the command line and you have the Android SDK setup (e.g., `ANDROID_HOME` is exported):

```bash
cd android
./gradlew assembleDebug
```
The APK will be located at `app/build/outputs/apk/debug/app-debug.apk`.

## Step 3: Install the APK on your Android Device

1. Connect your Android device to your computer via USB.
2. Make sure **USB debugging** is enabled in your device's Developer Options.
3. In Android Studio, you can directly run the app by clicking the **Run** button (green play icon) on the toolbar.
4. Alternatively, you can install the generated APK via the command line using ADB:

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Making Changes to the Web Code

Whenever you modify your Vue.js code in `src/`, you need to rebuild the web project and sync it with the Android project:

1. Build the Vue project:
   ```bash
   npm run build-only
   ```
2. Sync the new built files to the Android project:
   ```bash
   npx cap sync android
   ```
3. Rebuild the APK using Android Studio or `./gradlew assembleDebug`.
