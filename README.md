# PadosiPro Full-Stack Lifestyle Management App

A production-ready native mobile application and backend API built for **PadosiPro**. Built as a unified monorepo containing both the backend service (`api/`) and the React Native Expo mobile frontend (`app/`).

---

## 🏗️ Monorepo Structure

```
PadosiPro Assignment/
├── docker-compose.yml       # Local PostgreSQL Database & Mailpit SMTP Server
├── README.md                # Project documentation & execution guide
├── DESIGN.md                # Architecture decisions & trade-offs (1 page)
├── plan.md                  # Project blueprint
│
├── api/                     # Backend REST API (Node.js + Express + TypeScript + Prisma)
│   ├── .env.example         # Environment variables template
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema (PostgreSQL)
│   │   └── seed.ts          # Seeds 21 tasks across 4 categories
│   ├── src/                 # Controllers, Services, Middlewares, Routes
│   └── tests/               # Jest unit tests for OTP expiry, rate limits, hashing
│
└── app/                     # Mobile App (React Native Expo + TypeScript)
    ├── App.tsx              # Root component
    ├── app.json             # Expo configuration & APK build manifest
    └── src/
        ├── api/             # Axios client with JWT interceptors
        ├── components/      # UI components (PadosiInput, OtpInput, TaskCard)
        ├── context/         # AuthContext & persistent session state
        ├── screens/         # Register, VerifyOTP, Login, Profile, ChooseTasks, Home
        └── theme/           # Color palette matching PadosiPro brand
```

---

## 🚀 Quick Start Guide (Under 10 Minutes)

### Prerequisites
- **Node.js**: v18.0.0+ (Tested on v24.18.0)
- **npm**: v9.0.0+
- **Docker Compose** (for PostgreSQL database & Mailpit SMTP server)

---

### Step 1: Start Database & Mailpit SMTP Server

From the root project directory:
```bash
docker compose up -d
```
This launches:
- **PostgreSQL Database** on `localhost:5432`
- **Mailpit Web UI** on `http://localhost:8025` (View generated OTP emails in real-time)
- **Mailpit SMTP Server** on `localhost:1025`

---

### Step 2: Setup & Launch Backend API (`api/`)

1. Navigate to the `api/` directory:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Run Database Migrations & Seed Task Catalogue:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```
   *Seeds 21 tasks across 4 categories (`Home`, `Errands`, `Events`, `Admin`).*

5. Run Backend Unit Tests:
   ```bash
   npm test
   ```

6. Start API Server in Development Mode:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000` (Health check: `http://localhost:5000/health`).*

---

### Step 3: Setup & Launch React Native Expo App (`app/`)

1. Open a new terminal and navigate to the `app/` directory:
   ```bash
   cd app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run Frontend Unit Tests:
   ```bash
   npm test
   ```

4. Start Expo Development Server:
   ```bash
   npm start
   ```

5. Run on Android / iOS / Web:
   - Press **`a`** for Android Emulator (Make sure Android Studio emulator is running).
   - Press **`w`** for Web Browser.
   - Scan QR code with the **Expo Go** app on a physical Android device connected to the same Wi-Fi.

---

## 🤖 Running via Android Studio & Android 14+ (8KB / 16KB Page Size Alignment)

### 1. Launching via Android Studio & CLI
- **Via Expo CLI**:
  ```bash
  cd app
  npm run android
  ```
  *(or `npx expo run:android` to compile and launch native debug build)*.
- **Via Android Studio IDE**:
  1. Generate native Android project:
     ```bash
     cd app
     npx expo prebuild
     ```
  2. Open **Android Studio** -> **Open File or Project** -> Select `app/android`.
  3. Select your Android 14+ (API Level 34/35) Emulator or connected physical device.
  4. Click **Run 'app'** (`Shift + F10`).

### 2. Android 14 / 15 (16KB & 8KB Page Size Alignment) Configuration
To ensure smooth compatibility with Android 14 & Android 15 flexible memory page sizes (16KB / 8KB / 4KB alignment) for native React Native NDK libraries (Hermes engine, Reanimated):

Add flexible page alignment linker flags in `app/android/app/build.gradle`:
```groovy
android {
    compileSdkVersion 34
    defaultConfig {
        minSdkVersion 24
        targetSdkVersion 34
        
        // 16KB / 8KB Memory Page Size Alignment Flags for NDK
        externalNativeBuild {
            cmake {
                arguments "-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON",
                          "-DCMAKE_SHARED_LINKER_FLAGS=-Wl,-z,max-page-size=16384"
            }
        }
        ndk {
            abiFilters 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'
        }
    }
}
```

---

## 📲 How to Build the Standalone APK (Android)

To compile a production `.apk` binary file for Android:

### Option A: Local Build via Expo Prebuild (Recommended)
```bash
cd app
npx expo prebuild
cd android
./gradlew assembleRelease
```
The output `.apk` file will be generated at:
`app/android/app/build/outputs/apk/release/app-release.apk`.

### Option B: Cloud Build via EAS CLI
```bash
cd app
npx eas-cli build -p android --profile preview
```


---

## 🔒 Environment Variables Reference (`api/.env.example`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for Express API server |
| `DATABASE_URL` | `postgresql://postgres:postgrespassword@localhost:5432/padosipro?schema=public` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | `padosipro_super_secret_access_jwt_key_2026_production` | Secret key for signing short-lived access tokens |
| `JWT_REFRESH_SECRET` | `padosipro_super_secret_refresh_jwt_key_2026_production` | Secret key for signing long-lived refresh tokens |
| `JWT_ACCESS_TIME` | `15m` | Short-lived Access token expiration duration |
| `JWT_REFRESH_TIME` | `7d` | Long-lived Refresh token expiration duration |
| `SMTP_HOST` | `smtp.ethereal.email` | SMTP host (Ethereal Email / Mailpit container) |
| `SMTP_PORT` | `587` | SMTP port (587 for Ethereal, 1025 for Mailpit) |
| `SMTP_USER` | `ethereal_account_user` | Ethereal Email account username |
| `SMTP_PASS` | `ethereal_account_pass` | Ethereal Email account password |
| `SMTP_FROM` | `PadosiPro Support <no-reply@padosipro.com>` | Sender email header |

---

## 📩 Email Delivery & Testing (Ethereal Email & Mailpit)

For sending transactional OTP emails during development and testing:
- **Ethereal Email (Nodemailer)**: Used as the primary fake SMTP service to test email sending. Real-time preview URLs and delivered messages can be viewed directly on [Ethereal Email](https://ethereal.email).
- **Mailpit Web UI (Local Docker)**: Alternatively, run `docker compose up -d` to catch emails locally at `http://localhost:8025`.

