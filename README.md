# Our Forever 💖 — Android app

A personal, offline Android app for love letters, memories, a future bucket list, and a love meter. Runs on Android 6.0 or newer. The original website remains available by opening `index.html`.

## Download on your Android phone

**[Download Our Forever for Android (.apk)](https://github.com/Slindile16/i_love_you/raw/refs/heads/main/downloads/Our-Forever.apk)**

Open this README on your Android phone and tap the download link. When the download finishes, open **Our-Forever.apk**, allow **Install unknown apps** for your browser or file manager if prompted, and tap **Install**. Look for **Our Forever** on your home screen or in your app drawer.

This is the version 1.0.0 debug APK for personal installation and testing. Android 6.0 or newer is required. The installed app works offline.

The Android app bundles the HTML, styles, scripts, and icons inside the APK using Android's [WebViewAssetLoader](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content). It needs no internet connection or runtime permission prompts.

## Build and install

Open the **`android` folder** in Android Studio. Install Android SDK Platform 36 when prompted, let Gradle sync, then choose **Run** with a connected phone or emulator. Android Studio supplies the JDK and SDK tools.

To build from a terminal with JDK 17 or 21 and the Android SDK installed:

```sh
cd android
# Set ANDROID_HOME to your SDK, or add sdk.dir to android/local.properties.
./gradlew assembleDebug lintDebug
```

On Windows, use `gradlew.bat`. The Gradle wrapper downloads its pinned Gradle version on the first build. Build dependencies require internet; the installed app works offline.

The installable APK is at `android/app/build/outputs/apk/debug/app-debug.apk`. Transfer it to an Android phone, open it, and allow installation from the app used to open it. Alternatively, install on a connected phone with:

```sh
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

For GitHub builds, push these files and open **Actions → Build Android APK → Run workflow**. Download the **Our-Forever-Android-APK** artifact from the completed run and unzip it to find the APK. The workflow also runs on pull requests and pushes to `main` or `master`.

Debug APKs are for personal installation and testing. For Google Play distribution, use Android Studio's **Generate Signed App Bundle / APK** to create a signed release bundle. Keep the signing key private and use it for future updates.

## App behavior

- Bottom navigation switches between Home, From Her, From Him, and Ours.
- Android Back closes the letter, returns from a story to Home, then exits the app.
- Bucket-list additions, checked items, and the love meter are saved on the device. They survive closing the app, but do not sync between devices. Clearing app data or uninstalling deletes them.
- The existing password stays in `script.js`. The gate is a personal greeting, not secure authentication or encryption: bundled content and the password can be inspected. A fresh WebView session shows the gate again.
- From Him and Ours retain their existing placeholder content. Uploads, accounts, and shared storage are not implemented.
- System fonts and local symbols replace CDN fonts and icons for reliable offline use.

## Customize

Edit `index.html`, `styles.css`, `icons.css`, and `script.js` in the repository root. Gradle copies these into the Android app automatically on every build. Change the name and icon in `android/app/src/main/AndroidManifest.xml` and `android/app/src/main/res/drawable/ic_love.xml`. The application ID is `com.ourforever.love`.

After building a new version, replace `downloads/Our-Forever.apk` with the new APK and commit it to update the README download. Use the same signing key so an update can preserve existing app data.

## Verification

`./gradlew assembleDebug lintDebug` checks the Android package. Browser interaction checks use Node 22+ and Chrome without npm dependencies:

```sh
google-chrome --headless --no-sandbox --remote-debugging-port=9223 --user-data-dir=/tmp/our-forever-chrome about:blank
# In a separate terminal:
node tests/mobile-check.mjs
```

The browser checks cover the gate, every story at 320px, 360px, 412px and landscape sizes, saved checklist progress, the love meter, letter prompts, Back navigation, and offline resources. They use a dedicated Chrome profile and reset that profile's app data. Verify keyboard resizing, system Back gestures, and rotation on a real Android device before distributing.

In work with ValambyaT3ch.
Website demo: https://slindile16.github.io/i_love_you/
