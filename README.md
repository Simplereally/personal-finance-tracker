# Petal

A personal finance tracker with a warm ivory, rose, and plum interface. Built as a Lakebed capsule with Preact, Tailwind, and source-owned shadcn components adapted for Lakebed’s runtime.

**Live:** [petal-finance.lakebed.app](https://petal-finance.lakebed.app) · [Interactive preview](https://petal-finance.lakebed.app/preview) · [Create an account](https://petal-finance.lakebed.app/sign-up)

## What it does

- Email/password account creation and sign-in, with private account data across browsers.
- A focused monthly overview: remaining spending limit, income and expenses, and a daily allowance calculated from recorded spending and days remaining. Without a limit, it shows income after expenses.
- An interactive cumulative spending chart with pointer and keyboard day exploration; category breakdowns open filtered transactions directly.
- Add, edit, and delete transactions, with exact integer-cent amounts and validated dates.
- Transactions grouped by day, recent-entry shortcuts, and optional date/note details tucked away until needed.
- Search by description, category, or note; filter by type/category; see matching totals and export that same dataset to CSV.
- Monthly overall limits edited in place, category limits shown only when configured, and actionable warnings for categories approaching or exceeding their limit.
- Savings goals with editable targets and progress, plus a focused Add money action that atomically records contributions without moving funds.
- Personal categories, including safe removal that preserves transaction history.
- Name, currency, monthly budget, and password settings.
- Phone navigation, native date/month pickers, keyboard-accessible dialogs, reduced-motion support, and useful empty states.
- Press **N** outside a form to add a transaction, **/** to search on the transactions page, **?** to see shortcuts, and **Escape** to close a dialog.

The preview is isolated, uses fictional data, and keeps changes in memory. Newly created accounts start empty.

## Run locally

Use Node.js 22.18 or newer. Install the exact locked dependencies:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Lakebed’s local database is in memory and resets when the dev server restarts. Hosted account data is persistent.

## Validate

```sh
npm run check
npm run test:integration  # requires the local dev server
npm outdated
npm audit
```

`check` runs TypeScript, Oxlint, unit tests, and the Lakebed artifact build. The integration suite uses protected browser cookies and the actual WebSocket API to verify auth, money validation, account isolation, CRUD, custom categories, budgets, concurrent savings contributions, focused monthly-limit updates, password rotation, session revocation, and throttling. It creates synthetic accounts under `example.invalid` and removes its financial test rows.

To test an explicitly chosen hosted deployment:

```sh
PETAL_TEST_URL=https://petal-finance.lakebed.app PETAL_HOSTED_TEST=1 npm run test:integration
```

For a redeployment persistence check, run `scripts/persistence.mjs prepare`, redeploy, then run `scripts/persistence.mjs verify` with those same environment variables. It creates synthetic data, verifies the account and all financial rows survived, and removes the synthetic financial data and temporary local credential file after success.

## Deploy

```sh
npx lakebed auth status
npm run deploy
npx lakebed inspect dep_GEgIs49ZhLBvtENB
npx lakebed logs dep_GEgIs49ZhLBvtENB
```

The committed `lakebed.json` points to the existing claimed deployment. Redeploys update that same app and retain its hosted database. Inspection remains private; do not deploy with `--public-inspect` for personal finance data. Deployment credentials are stored by Lakebed outside the repository.

For a private full database backup, run `npx lakebed db export dep_GEgIs49ZhLBvtENB --out <private-backup-path>` and keep that file outside Git.

## Architecture

| Path                                   | Responsibility                                                                          |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| `server/index.ts`                      | Indexed schema, guarded queries, validated mutations, custom account/session bindings   |
| `server/password.ts`                   | Web Crypto PBKDF2-SHA-256 hashing with random salt and 600,000 iterations               |
| `client/index.tsx`                     | App entry, account gate, and connected data                                             |
| `client/components/`                   | Auth, preview, workspace, dashboard, transactions, budgets, goals, and settings modules |
| `client/components/forms.tsx`          | Transaction, budget, goal, and preference forms                                         |
| `client/components/ui/index.tsx`       | Preact-adapted shadcn Button/Input/Card and accessible native primitives                |
| `shared/finance.ts`                    | Pure types, money/date validation, aggregation, formatting, and safe CSV generation     |
| `tests/` and `scripts/integration.mjs` | Arithmetic/security tests and real-runtime integration checks                           |

Lakebed’s database API v1 persists hosted rows and maintains declared indexes. App code never writes data directly from the browser. Every private query resolves the verified Lakebed browser identity to a local email/password account, and every edit/delete rechecks account ownership.

Local auth does not use Google or Supabase. Lakebed’s protected guest identity supplies an HttpOnly browser credential; the app stores an expiring binding between that verified identity and the email/password account. Passwords and salts stay server-side. Login attempts are throttled by browser identity and email. Password changes revoke other app sessions. Up to 20 browser sessions are retained per account.

The app deliberately uses a bounded monthly dataset (900 transactions per account per month), up to 20 savings goals, and up to 24 custom categories so totals remain complete within Lakebed’s handler budgets. Currency preferences change display formatting, not the underlying numeric amounts. There is no password reset email or email verification service in this local auth model.

All direct packages are pinned to the current npm `latest` releases at implementation time; `package-lock.json` makes installs reproducible. The unsupported Next.js/Supabase/React/Radix stack was removed during migration. No existing Supabase records have been imported; the previous implementation remains available in Git history.

shadcn/ui source attribution is retained in [docs/SHADCN-LICENSE.txt](docs/SHADCN-LICENSE.txt). Lakebed API references: [docs index](https://docs.lakebed.dev/llms.txt), [capsule API](https://docs.lakebed.dev/capsule-api/), and [database API](https://docs.lakebed.dev/database/).
