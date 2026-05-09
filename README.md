# PureSmile Dental — Landing Page

A high-converting, production-ready landing page for **PureSmile Dental** built with Next.js 16. Features a bilingual UI (ES/EN), professional scroll animations, an appointment booking form with server-side validation, bot protection, and rate limiting — all backed by Supabase and Upstash Redis.

## Features

- **Bilingual (ES / EN)** — locale-aware routing via `next-intl`; users switch languages without a page reload
- **Professional animations** — scroll-triggered reveals (`IntersectionObserver`), animated stat counters (RAF + cubic easing), floating blobs, shimmer headline
- **Appointment booking** — server action with Zod schema validation and direct Supabase insert
- **Bot protection** — honeypot hidden field silently discards automated submissions
- **Rate limiting** — sliding-window limiter (3 requests / minute per IP) powered by Upstash Redis
- **Fully responsive** — mobile-first layout with a collapsible nav, built with Tailwind CSS v4
- **Logo with fallback** — loads `public/images/logo.png`; falls back to an inline SVG if the file is absent
- **UI components** — shadcn/ui primitives (Button, Input) with Radix UI under the hood

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui · Radix UI · Lucide React |
| Internationalization | next-intl 4 |
| Database | Supabase (PostgreSQL) |
| Rate Limiting | Upstash Redis |
| Validation | Zod 4 |

## Project Structure

```
messages/
├── es.json                  # Spanish translations
└── en.json                  # English translations
public/
└── images/
    └── logo.png             # Clinic logo (replace with your own)
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx       # Root layout with locale provider
│   │   └── page.tsx         # Main landing page (all sections + animations)
│   └── actions.ts           # Server action: appointment booking
├── components/
│   └── ui/                  # shadcn/ui components (Button, Input)
├── i18n/
│   ├── routing.ts           # Locale routing config (locales, defaultLocale)
│   └── request.ts           # next-intl server request config
└── lib/
    ├── supabase.ts          # Supabase client
    └── utils.ts             # cn() helper
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Upstash](https://upstash.com) Redis database

### Installation

```bash
git clone <repo-url>
cd landing-dental
npm install
```

### Environment Variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### Supabase Table

Run the following SQL in your Supabase SQL editor to create the appointments table:

```sql
create table pacientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text not null,
  servicio text not null,
  created_at timestamptz default now()
);
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Internationalization

Supported locales: **`es`** (default) and **`en`**.

Translation files live in the [`messages/`](messages/) directory at the project root. To add a new locale, add it to the `locales` array in [src/i18n/routing.ts](src/i18n/routing.ts) and create a matching `messages/<locale>.json` file.

## Security

- **Honeypot field** — a hidden `direccion_postal` input traps bots; any submission with it filled in is silently accepted but not persisted.
- **Rate limiting** — Upstash sliding-window limiter caps submissions at 3 per minute per IP address.
- **Input validation** — all form fields are parsed through a strict Zod schema before hitting the database.

## Deployment

The easiest way to deploy is with [Vercel](https://vercel.com). Connect your repository, add the environment variables above in the Vercel dashboard, and deploy.

```bash
# Or build locally for any Node-compatible host
npm run build
npm run start
```

## License

MIT
