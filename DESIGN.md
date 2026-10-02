# Architectural Design Document (DESIGN.md)

**Project**: PadosiPro Full-Stack Lifestyle Management App  
**Date**: October 2026  
**Author**: Full-Stack Engineering Candidate  

---

## 🏛️ System Architecture Overview

The system is structured as a single unified monorepo divided into a Node.js/Express REST API (`api/`) and a React Native Expo mobile frontend (`app/`).

```
┌─────────────────────────┐               HTTP / REST API               ┌─────────────────────────┐
│ React Native Expo App   │ ◄────────────────────────────────────────► │ Node.js + Express API   │
│ (Expo Router / AuthGuard│        Bearer JWT Authorization             │ (TypeScript + Zod)      │
└────────────┬────────────┘                                             └────────────┬────────────┘
             │                                                                       │
             ▼                                                                       ▼
┌─────────────────────────┐                                             ┌─────────────────────────┐
│  Expo SecureStore       │                                             │ PostgreSQL + Prisma ORM │
│  (Persistent Token)     │                                             │ (User, OTP, Profile)    │
└─────────────────────────┘                                             └─────────────────────────┘
```

---

## 🔒 Security & Risky Logic Design

1. **OTP Cryptographic Hashing**:
   - OTP codes are generated using cryptographically secure random bytes (`crypto.randomBytes`).
   - Plaintext OTPs are **never stored in the database**. Only an HMAC-SHA256 hash using the backend secret is persisted.
   - **Rate Limiting**: Hard ceiling of 5 failed attempts per OTP record. Upon the 5th failed attempt, the record is invalidated, forcing the user to request a new code.
   - **Resend Cooldown**: Enforced 30-second cooldown period stored on the database record (`resendAfter`).
   - **Expiry Window**: OTP expires strictly after 10 minutes (`expiresAt`).

2. **Password Security & Dual JWT Token Architecture**:
   - Passwords hashed using `bcrypt` (salt factor 10).
   - Authenticated endpoints enforce state checks (`isVerified: true`). Unverified users are rejected with `403 Forbidden` and redirected to OTP verification.
   - **Dual Token Architecture**: Uses `JWT_ACCESS_SECRET` (`JWT_ACCESS_TIME` = 15m) for short-lived API authorization and `JWT_REFRESH_SECRET` (`JWT_REFRESH_TIME` = 7d) for long-lived session renewal via `/auth/refresh-token`.
   - Tokens stored safely in device encrypted storage (`Expo SecureStore` / `AsyncStorage`).

---

## 💡 Business Name Field Rationale (Why Optional?)

**Decision**: The `businessName` field in `UserProfile` is made **optional**.

**Rationale**:
PadosiPro is primarily a lifestyle management service targeting individual households and consumers who need help with personal chores (grocery, AC repair, plumbing, doctor appointments). Forcing individual consumers to fill out a business name would create unnecessary friction during onboarding, causing drop-offs. However, keeping the field optional allows self-employed individuals, freelancers, or corporate clients to specify their business entity if they require business invoicing or corporate concierge services.

---

## ⚖️ Engineering Trade-Offs

1. **Fake SMTP Mailer (Ethereal Email & Mailpit) vs. Cloud SES**:
   - *Trade-off*: Used Ethereal Email (via Nodemailer) and Mailpit Docker container rather than AWS SES or SendGrid.
   - *Reasoning*: Guarantees zero-dependency, instantaneous developer testing and email preview without requiring real credit card credentials or cloud API keys.

2. **Dual JWT Token Architecture vs. Stateful Redis Session Store**:
   - *Trade-off*: Issued dual signed JWT access/refresh tokens with transparent Axios interceptor auto-refresh (`15m` access, `7d` refresh) instead of maintaining a centralized Redis session database.
   - *Reasoning*: Reduces backend infrastructure complexity while securing client credentials with short-lived access tokens and seamless background token renewal.


---

## 🚀 Future Scope (With Another Week)

1. **Push Notifications**: Real-time push notification integration via Expo Notifications / Firebase Cloud Messaging (FCM) to update users when their assigned Lifestyle Manager accepts or completes a task.
2. **SMS Gateway Integration**: Replace email OTP with SMS OTP (via Twilio or Fast2SMS for Indian numbers) + Android SMS Retriever API for auto-filling 6-digit codes.
3. **Live Task Status Tracker**: Add status badges (`Pending`, `Manager Assigned`, `In Progress`, `Completed`) with interactive chat between user and Lifestyle Manager.
