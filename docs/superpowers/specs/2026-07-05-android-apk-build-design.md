# Design Spec: Android APK Build and Optimization

## 1. Goal
Build a production-ready, high-quality APK (and Bundle) for the `fintrack` project, ensuring it meets all technical requirements and is ready for installation.

## 2. Technical Context
- **Project Location:** `/home/reyfuu/fintrack/android`
- **Gradle Version:** 8.14.3
- **AGP Version:** 8.13.0
- **Compatible Java:** OpenJDK 21 at `/opt/android-studio/jbr`
- **Current System Java:** OpenJDK 25 (Incompatible)

## 3. Implementation Steps

### Phase 1: Environment Setup
- Explicitly set `JAVA_HOME` to `/opt/android-studio/jbr` for all Gradle operations.
- Verify Android SDK licenses.

### Phase 2: Web Sync (Capacitor Requirement)
- Ensure the latest web assets are built and synced to the Android project.
- Command: `npm run build-only` followed by `npx cap sync android` in the root directory.

### Phase 3: Build Execution
- Execute the build command: `./gradlew assembleRelease` to generate the APK.
- (Optional) Execute `./gradlew bundleRelease` for the App Bundle.
- Monitor logs for any linting errors or compiler warnings.

### Phase 4: Quality Check (10/10 Verification)
- Verify the output file exists at `app/build/outputs/apk/release/app-release-unsigned.apk` (or signed if keys exist).
- Run a basic integrity check on the APK size and structure.
- Ensure no critical errors were suppressed.

## 4. Success Criteria
- Successful generation of `app-release.apk`.
- Zero build errors.
- Verified compatibility with target Android versions (SDK 36.1+).

## 5. Security & Signing
- Initially, a release build might be unsigned if no keystore is provided. I will inform the user if a keystore is needed for a "10/10" Play Store ready result.
