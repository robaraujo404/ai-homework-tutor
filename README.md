# Homework Tutor (Next.js)

A small web app that helps kids work through homework by asking questions and giving hints instead of handing out the final answer.

Built with Next.js App Router, TypeScript, Tailwind, and `next-intl`.

## What’s included

- Locales: `pt-br`, `en`, `es` (URL-based, e.g. `/pt-br/chat`)
- Chat UI with:
  - subject + grade context
  - image upload (useful for photos of the exercise or the student’s attempt)
  - audio recording with server-side transcription
- LLM provider switch via env (`anthropic` or `openai`)
- IP-based rate limiting (Upstash Redis)
- Analytics (PostHog)
- App name is configurable via `NEXT_PUBLIC_APP_NAME` (used in the browser title)

## Requirements

- Node.js 20+ (works with newer versions too)
- An API key for either Anthropic or OpenAI
- (Optional but recommended) Upstash Redis credentials for rate limiting
- (Optional) PostHog project key

## Quick start

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```bash
# LLM provider: "anthropic" or "openai"
LLM_PROVIDER=openai

# Provider keys
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# PostHog (client-side)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Browser title
NEXT_PUBLIC_APP_NAME="Homework Helper"
```

Run the dev server:

```bash
npm run dev
```

Then open:

- `http://localhost:3000` (you’ll be redirected to a locale)
- `http://localhost:3000/pt-br`
- `http://localhost:3000/en`
- `http://localhost:3000/es`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm test
```

## Notes

- If Upstash is not configured locally, the app still runs, but rate limiting is effectively disabled.
- Audio transcription requires `OPENAI_API_KEY` (the transcription route uses OpenAI).

## Deploy

This project is designed to work well on Vercel.

1. Push the repo to GitHub
2. Import it in Vercel
3. Add the same environment variables from `.env.local`
4. Deploy
