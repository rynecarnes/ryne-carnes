# Project Instructions

## Overview

This is a **Next.js** web application using **Supabase** as the database backend, deployable locally for development and to **Vercel** for production. The app is structured around a global top navigation bar that routes users to different tools and features, each of which may contain their own sub-pages.

The UI design follows a **Dark Glassmorphism** aesthetic — deep navy backgrounds, frosted glass card components, and electric blue/violet gradient accents.

---

## Free Tier Constraints & Considerations

This project runs entirely on free tiers. The plan is fully compatible, but you must be aware of the following limits and behaviors.

### Supabase Free Plan

| Resource | Free Limit |
|---|---|
| Database size | 500 MB |
| File storage | 1 GB |
| Monthly egress | 5 GB |
| Monthly active users (Auth) | 50,000 |
| Active projects | 2 max |
| Backups | None (Pro only) |
| Support | Community only |

> **⚠️ Project Pausing**: Free projects are automatically **paused after 1 week of inactivity**. When a paused project receives a request, it takes ~30 seconds to wake up. To avoid this during active development, make at least one request to the project each week, or upgrade to Pro when launching publicly.

> **⚠️ No Backups**: The free tier has zero automated backups. Export your data manually from the Supabase dashboard → Database → Backups (or use `pg_dump`) before making any destructive schema changes.

### Vercel Hobby Plan

| Resource | Free Limit |
|---|---|
| Deployments | Unlimited |
| Bandwidth | 100 GB / month |
| Serverless compute | 100 GB-hrs / month |
| Preview deployments | ✅ Included |
| Custom domains | ✅ Included |
| CI/CD (GitHub) | ✅ Included |
| Team members | 1 (personal only) |
| Commercial use | ❌ Not permitted |

> **⚠️ Personal Use Only**: Vercel's Hobby plan is for **non-commercial, personal projects** per their Terms of Service. If this app is used commercially or by a business, upgrade to the Pro plan ($20/mo).

> **⚠️ Serverless Function Timeouts**: On the Hobby plan, serverless functions (API routes, Server Components that make DB calls) have a **10-second max execution time**. Keep your Supabase queries fast and indexed. Long-running operations are not supported on the free tier.

### What Works Fine on Free Tiers

- ✅ Next.js App Router with Server Components
- ✅ Supabase Auth (up to 50k MAUs)
- ✅ Supabase database queries (CRUD)
- ✅ Vercel preview deployments per PR
- ✅ Automatic HTTPS + custom domain
- ✅ Edge Middleware (Supabase auth session refresh)
- ✅ CI/CD from GitHub → Vercel

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (CSS Custom Properties) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel (prod) / `next dev` (local) |
| Package Manager | npm |

---

## Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout — includes global nav
│   ├── page.tsx                  # Home / landing page
│   ├── globals.css               # Global CSS design tokens & base styles
│   └── [tool-name]/              # Each top-nav tool gets its own route group
│       ├── page.tsx              # Tool landing page
│       └── [sub-page]/
│           └── page.tsx          # Sub-pages within a tool
│
├── components/
│   ├── nav/
│   │   └── TopNav.tsx            # Global top navigation bar
│   └── ui/                       # Shared UI primitives (cards, buttons, etc.)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser-side Supabase client
│   │   └── server.ts             # Server-side Supabase client (SSR)
│   └── utils.ts                  # Shared utility functions
│
├── middleware.ts                  # Supabase auth session refresh middleware
├── .env.local                    # Local environment variables (never commit)
├── .env.example                  # Template for required env vars
├── next.config.ts                # Next.js config
├── vercel.json                   # Vercel deployment config (optional overrides)
└── package.json
```

---

## Design System — Dark Glassmorphism

All design tokens are defined as CSS custom properties in `app/globals.css`. Every component must use these tokens — no hardcoded color values.

### Color Palette

```css
:root {
  /* Backgrounds */
  --color-bg-base:        #0A0F1E;   /* Deepest navy — page background */
  --color-bg-surface:     #0F172A;   /* Card/panel background */
  --color-bg-elevated:    #1E293B;   /* Hover states, elevated elements */
  --color-bg-glass:       rgba(15, 23, 42, 0.6);  /* Glass card fill */

  /* Accents */
  --color-accent-blue:    #3B82F6;   /* Primary interactive / links */
  --color-accent-violet:  #8B5CF6;   /* Secondary accent */
  --color-accent-gradient: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);

  /* Text */
  --color-text-primary:   #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-text-muted:     #475569;

  /* Borders */
  --color-border:         rgba(148, 163, 184, 0.1);
  --color-border-glass:   rgba(148, 163, 184, 0.15);

  /* Status */
  --color-success:        #10B981;
  --color-warning:        #F59E0B;
  --color-error:          #EF4444;
}
```

### Typography

Use **Inter** from Google Fonts (loaded in `app/layout.tsx`).

```
Font family: 'Inter', system-ui, sans-serif
Scale:
  --text-xs:   0.75rem   (12px)
  --text-sm:   0.875rem  (14px)
  --text-base: 1rem       (16px)
  --text-lg:   1.125rem  (18px)
  --text-xl:   1.25rem   (20px)
  --text-2xl:  1.5rem    (24px)
  --text-3xl:  1.875rem  (30px)
  --text-4xl:  2.25rem   (36px)
```

### Glassmorphism Pattern

All cards and panel components follow this CSS pattern:

```css
.glass-card {
  background:           var(--color-bg-glass);
  backdrop-filter:      blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border:               1px solid var(--color-border-glass);
  border-radius:        12px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
```

### Navigation Bar Pattern

```css
.top-nav {
  position:             sticky;
  top:                  0;
  z-index:              100;
  background:           rgba(10, 15, 30, 0.75);
  backdrop-filter:      blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom:        1px solid var(--color-border);
  height:               64px;
}
```

### Spacing Scale

```
--space-1:  0.25rem   (4px)
--space-2:  0.5rem    (8px)
--space-3:  0.75rem   (12px)
--space-4:  1rem      (16px)
--space-5:  1.25rem   (20px)
--space-6:  1.5rem    (24px)
--space-8:  2rem      (32px)
--space-10: 2.5rem    (40px)
--space-12: 3rem      (48px)
--space-16: 4rem      (64px)
```

### Animation Tokens

```css
--transition-fast:    150ms ease;
--transition-base:    250ms ease;
--transition-slow:    400ms ease;
--transition-bounce:  300ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

All interactive elements (buttons, nav links, cards) must use `transition: var(--transition-base)` and provide visible hover/focus states.

---

## Navigation Architecture

The `TopNav` component lives in `app/layout.tsx` and renders on every page. Each top-level nav item corresponds to a route at `/[tool-name]`. Sub-pages within a tool are nested routes at `/[tool-name]/[sub-page]`.

### Nav Item Structure

```typescript
// components/nav/TopNav.tsx
interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;  // optional icon (e.g., from lucide-react)
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/' },
  // Add new tools here as they are built
];
```

**Rules:**
- Active nav items are highlighted using the `--color-accent-blue` underline with a gradient glow effect.
- The nav is responsive: on mobile, items collapse into a hamburger menu.
- The logo/wordmark is always left-aligned.
- A user avatar/profile button is always right-aligned (connect to Supabase Auth once auth is added).

---

## Supabase Setup

> **Free Tier Reminder**: Projects pause after 1 week of inactivity. Keep the project alive by visiting it weekly, or accept the ~30s cold-start wake-up time.

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. Copy your **Project URL** and **anon public key** from Project Settings → API.
3. You can have a maximum of **2 active free projects** per account. Use one for production and one for staging/dev if needed.

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 3. Environment Variables

Create `.env.local` at the project root (never commit this file):

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Create `.env.example` as a committed reference template:

```env
# .env.example — copy to .env.local and fill in values
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 4. Supabase Client Files

**Browser client** (`lib/supabase/client.ts`):
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Server client** (`lib/supabase/server.ts`):
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### 5. Auth Middleware

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session
  await supabase.auth.getUser();
  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd <project-name>

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Start the dev server
npm run dev
```

App will be available at `http://localhost:3000`.

### Optional: Supabase Local Development

For a fully local Supabase stack (runs Postgres in Docker):

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize (first time only)
supabase init

# Start local Supabase stack
supabase start

# This outputs local credentials — use them in .env.local
```

---

## Vercel Deployment

> **Free Tier Reminder**: The Hobby plan is for personal, non-commercial projects only. Serverless function timeout is 10 seconds max. Bandwidth cap is 100 GB/month.

### First Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (follow prompts — select "Hobby" plan when asked)
vercel
```

### Environment Variables on Vercel

In the Vercel dashboard → Project → Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL      → your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY → your Supabase anon key
```

Set these for **Production**, **Preview**, and **Development** environments.

### Automatic Deployments

Connect your GitHub repository to Vercel for automatic deployments:
- **`main` branch** → Production environment
- **Pull Requests** → Preview environments (each PR gets a unique URL, included free)

> **Tip**: Both preview and production deployments share the same Supabase project on the free tier (since you only get 2 projects). Use environment variable prefixes or a separate schema if you need to isolate test data from production data.

### `vercel.json` (optional)

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

---

## Adding a New Tool / Feature

To add a new top-nav tool:

1. **Create the route directory**: `app/[tool-name]/`
2. **Add a page**: `app/[tool-name]/page.tsx`
3. **Register in the nav**: Add an entry to the `NAV_ITEMS` array in `components/nav/TopNav.tsx`
4. **Add sub-pages** (optional): `app/[tool-name]/[sub-page]/page.tsx`

Each tool page should use the shared `glass-card` component class and follow the design token system.

---

## Component Conventions

- All components are **TypeScript** `.tsx` files.
- Shared UI primitives live in `components/ui/` (e.g., `Button.tsx`, `Card.tsx`, `Badge.tsx`).
- Each component uses **CSS Modules** (`.module.css`) or direct class names referencing global tokens — never inline styles.
- No component-level color values — all colors come from CSS custom properties.
- Hover and focus states are **required** on all interactive elements.
- Use `lucide-react` for icons (`npm install lucide-react`).

---

## Key Conventions & Rules

- **No hardcoded colors** — always use CSS custom properties.
- **No Tailwind** — use vanilla CSS with the design token system defined in `globals.css`.
- **Server Components by default** — only add `'use client'` when browser APIs or interactivity are needed.
- **Environment variables** starting with `NEXT_PUBLIC_` are safe to expose to the browser. All others are server-only.
- **Never commit `.env.local`** — it is in `.gitignore`.
- **TypeScript strict mode** — `"strict": true` in `tsconfig.json`.
- All new database tables must have Row Level Security (RLS) enabled in Supabase before going to production.

---

## Scripts

```json
{
  "scripts": {
    "dev":   "next dev",
    "build": "next build",
    "start": "next start",
    "lint":  "next lint"
  }
}
```

---

## References

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Vercel Deployment Docs](https://vercel.com/docs/frameworks/nextjs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
