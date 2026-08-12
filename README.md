# Goldenstep

Fantasy football, but you are the tracker.

Goldenstep turns real running data into a Strava-powered fantasy league for university students, societies, and corporate teams. Players join a league, connect their Strava account, and compete over a weekly gameweek to cover the most distance. Each league has a small entry fee, and the top finishers share the prize pool at the end of the period.

Built for the Trojan Horse Hackathon — August 12, 2026.

## Team

Team name: Cerberus

- Khai — Backend Developer
- Barun — Frontend Developer
- Jason — Frontend Developer
- adam — Designer

## Product idea

Goldenstep creates a real-world fitness competition with the spirit of fantasy sports. Instead of picking players, participants track their actual activity and compete based on measurable performance.

### Core MVP features

- League creation with invite code or shareable link
- Strava OAuth integration to pull real run data
- Weekly gameweek scoring and live leaderboard
- Mocked wallet / stake system (no real payments yet)
- 1st / 2nd / 3rd payout split at the end of each gameweek

## Tech stack

| Layer | Tech |
| --- | --- |
| App | Expo (React Native) |
| Backend | Node.js + Express, or Supabase |
| Database | Postgres |
| Auth | Healthkid |
| Realtime | Supabase Realtime |
| Recap export | react-native-view-shot + expo-sharing |

### Important note on Expo and Strava

Most of the app will work in Expo Go, but Strava OAuth requires a development build because Expo Go cannot register the custom URL scheme needed for the redirect flow.

Recommended setup:

```bash
npx expo install expo-dev-client
npx expo run:ios
```

This is the highest-risk technical dependency in the stack, so it should be built early.

## Getting started

### 1. Clone the repository

```bash
git clone <repo-url>
cd goldenstep
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in real values. Never commit your .env file.

```bash
cp .env.example .env
```

Example variables:

```env
STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

- Get Strava credentials from Strava API settings
- Get Supabase credentials from your project API settings

### 4. Run the app

```bash
npx expo start
```

Scan the QR code with the Expo Go app on your phone. For healthkid login, use a development build instead of the default Expo Go flow.

## Project structure

```text
backend
├── database/
├── migration

frontend.
├── app/
├── components/
├── lib/
├── services/
├── screens/
├── assets/
├── .env.example
├── package.json
├── README.md
└── app.json
```

## Team workflow

- Communication: Discord channels for general updates, backend, frontend, design, and bug tracking
- Sync cadence: every 4–6 hours, with a short check-in on what is done, what is next, and any blockers
- Git workflow: small, frequent commits on feature branches; push schema or type changes early so others can work against the latest version
- Decisions: anything affecting more than one person, such as schema changes or API contracts, should be shared in the main group chat instead of staying informal

## Next steps

1. Finalise the MVP user flow and league rules
2. Build the Strava authentication flow
3. Define league scoring logic and leaderboard behaviour
4. Create the app shell and onboarding screens
5. Validate the development build requirement for OAuth

## Notes

This project is intended to be a hackathon-ready MVP with a strong social and fitness angle. The main differentiator is that it uses real running data instead of simulated or manually entered stats, making the competition feel authentic and meaningful.


