# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run lint     # Run ESLint via Next.js
npm run start    # Start production server
```

Build on Linux/Mac (package.json uses Windows `set` — broken):
```bash
NODE_ENV=production next build
```

No test suite is configured.

## Refactoring Rules

These rules govern all changes made during refactoring. Follow them strictly.

### TypeScript — zero `any`
- Every prop, function parameter, and return type must have an explicit type or interface
- Define interfaces in the same file or in a dedicated `types.ts` co-located with the feature
- Never use `any`, `as any`, or `// @ts-ignore` as a shortcut

### No direct state mutation
- Never call `.splice()`, `.push()`, or `.sort()` on arrays held in React state
- Always produce a new array: `filter`, `map`, spread `[...arr]`

### Single source of truth for cart
- Cart state lives exclusively in `AddToCartContext` (`useAddToCart()` hook)
- `Cart.tsx` and any other consumer must use the context — never read `localStorage` directly in components

### Eliminate the self-referential fetch pattern
- Server Components import directly from `src/app/_core/` — no fetch to `/api/` during SSR
- `src/app/api/` routes remain for potential external/client use only
- `src/app/_lib/` fetchers are replaced by direct imports where they wrap internal API calls

### `"use client"` boundary
- Default to Server Component (no directive)
- Add `"use client"` only when the component uses: `useState`, `useEffect`, `useRef`, event handlers, or a context hook
- Never mark a component client-side just because its parent is

### `force-dynamic` — only when justified
- Remove `export const dynamic = "force-dynamic"` from pages that serve static or SSR data from `_core/`
- Only keep it on pages that genuinely need per-request dynamic behavior

### No `console.log` in committed code
- Remove all debug `console.log` and commented-out `console.log` lines

### Dark mode in SCSS
```scss
.element { color: black; }
:global(.dark) .element { color: white; }
```
Never use `@media (prefers-color-scheme)` — dark mode is class-based via `next-themes`.

### File placement
- All app content data → `src/app/_core/`
- Reusable UI components → `src/components/<feature>/`
- TypeScript types/interfaces → `src/types/<feature>.ts`
- Each component gets a co-located `.scss` file if it needs custom styles beyond Tailwind
- Path alias `@/` maps to `src/` — always use it, never relative `../../`

### No leftover stubs
- Remove stub pages that only render `{params.slug}` without real content
- Remove commented-out code blocks that are no longer relevant

## Design Tokens — Culori & Fonturi

### Font
- **Roboto 400** — încărcat via `next/font/google` în `layout.tsx`, aplicat pe `<main>` via `roboto.className`
- Nu adăuga alte fonturi fără aprobare explicită

### Culori — cum se folosesc

Toate culorile sunt definite ca **CSS variables în `globals.scss`** și expuse ca **clase Tailwind semantice** în `tailwind.config.ts`.

**Regulă:** folosește mereu numele semantic, niciodată hex-uri hardcodate în componente.

| Token Tailwind | CSS Var | Light | Dark | Folosit pentru |
|---|---|---|---|---|
| `bg-surface` | `--color-surface` | `rgb(233 233 233 / 59%)` | `#000000` | Background pagină |
| `bg-card` | `--color-card` | `#ffffff` | `#1a1f2e` | Carduri, panouri |
| `bg-navbar` | `--color-navbar` | `#f5f5f5` | `#0f1117` | Navbar background |
| `bg-modal` | `--color-modal` | `#ffffff` | `#1e2433` | Modal background |
| `text-content` | `--color-content` | `#000000` | `#ffffff` | Text principal |
| `text-muted` | `--color-muted` | `#6b7280` | `#9ca3af` | Text secundar |
| `bg-primary` / `text-primary` | `--color-primary` | `#FF5C00` | `#FF5C00` | Butoane, accent |
| `bg-primary-hover` | `--color-primary-hover` | `#e05200` | `#e05200` | Hover pe butoane |

### Cum se aplică dark mode cu tokenurile

**În Tailwind (JSX):**
```tsx
// ✅ Corect — token semantic, se schimbă automat
<div className="bg-card text-content">

// ❌ Greșit — hex hardcodat sau clasă Tailwind standard
<div className="bg-white dark:bg-gray-900">
```

**În SCSS:**
```scss
// ✅ Corect — CSS var, se schimbă automat
.card { background-color: var(--color-card); }

// ❌ Greșit — selector dark manual cu valoare hardcodată
.card { background: white; }
:global(.dark) .card { background: #1a1f2e; }
```

> **Excepție:** pentru proprietăți CSS fără echivalent Tailwind (ex: `border-color` complex, `box-shadow`), folosește `var(--color-*)` direct în SCSS.

## Naming Conventions

### Fișiere
| Tip | Convenție | Exemplu |
|---|---|---|
| Componentă | PascalCase | `SubscriptionCard.tsx` |
| SCSS componentă | PascalCase (același nume) | `SubscriptionCard.scss` |
| Pagină / Layout / Route | Next.js standard | `page.tsx`, `layout.tsx`, `route.ts` |
| Tipuri per feature | camelCase + `.ts` | `src/types/subscription.ts` |
| Date statice | camelCase + `.ts` | `src/app/_core/navbarMenu.ts` |

### Componente
- **Organizare:** folder per feature, fișiere plate — `src/components/abonamente/SubscriptionCard.tsx`
- **Import:** direct din fișier — `import SubscriptionCard from '@/components/abonamente/SubscriptionCard'`
- **Nu** se folosesc foldere per componentă cu `index.tsx`

### TypeScript
- **Interfețe:** prefix `I` — `ICart`, `INavbarItem`, `ITrainerProfile`
- **Tipuri utilitare:** fără prefix — `UserRole`, `ThemeMode`
- **Locație:** `src/types/<feature>.ts` — un fișier per feature, nu co-locat în componentă

### Funcții și handler-e
- **Handler-e pentru evenimente:** sufix `Handler` — `addToCartHandler`, `removeHandler`, `closeMobileMenuHandler`
- **Funcții async de fetch:** prefix `get` — `getSchedule`, `getSubCategories`
- **Funcții utilitare:** camelCase descriptiv — `calculateTotal`, `filterBySlug`

## Documentație — Slash Commands

Folosește comenzile de mai jos pentru a crea sau actualiza documentația proiectului. Fiecare command pune întrebări, apoi generează documentul cu structura corectă.

| Command | Când se folosește | Destinație |
|---|---|---|
| `/creareDocsFeature` | Funcționalitate activă pe care utilizatorul o folosește (galerie, coș, auth) | `docs/features/` |
| `/creareDocsLayout` | Componentă prezentă pe toate paginile (navbar, footer, theme switch) | `docs/layout/` |
| `/creareDocsPage` | Pagină de conținut/prezentare fără funcționalitate complexă (home, despre noi) | `docs/pages/` |
| `/updateDocs` | Actualizare doc existent după ce s-a implementat ceva sau cerințele s-au schimbat | fișierul existent |

### Structura obligatorie a oricărui doc

Toate documentele respectă **exact** această ordine de secțiuni:

```
## PRD              ← perspectiva utilizatorului: scop, cine folosește, comportament așteptat
## Tech Specs       ← componente, rute, surse de date, state, probleme actuale
## TODOs Frontend   ← taskuri UI granulare, câte un singur lucru per item
## TODOs Backend    ← route handlers, API, variabile de mediu
```

### Reguli docs

- **PRD** — scris fără termeni tehnici, din perspectiva utilizatorului
- **Tech Specs** — nume reale de fișiere și componente, nu generice
- **TODOs** — granulare și acționabile (`înlocuiește \`any\` cu \`ICart\` în \`SubscriptionCard.tsx\`` nu `refactorizează componenta`)
- **Nu omite** secțiunea „Probleme actuale" din Tech Specs — onestitate despre ce e broken sau lipsă
- Dacă nu există TODOs Backend → scrie explicit `- [ ] Nu sunt necesare acțiuni backend`

## Architecture

Next.js 14 App Router project for a Romanian gym website (PrimaGym). TypeScript, SCSS (co-located), Tailwind CSS.

### Data layer (`src/app/_core/`)

All content is hardcoded static TypeScript — no database or CMS:

- `subscription.ts` — plans with pricing (`ICart` interface + `subscriptions` array)
- `subscriptionCategories.ts` — activity categories (zumba, aerobic, cycling, fitness)
- `schedule.ts` — class timetable
- `antrenori.ts` — trainers list
- `gallery.ts` — gallery image references (imports from `public/gallery/`)
- `navbarMenu.ts`, `information.ts`, `rules.ts` — navbar links and footer content

**Note:** `aerobic` and `cycling` exist in `subscriptionCategories.ts` but have no entries in `subscriptions` — their detail pages are empty.

### Global state

Two React Context providers in `layout.tsx`:

- **`ContextAPI`** — navbar open/hover state, modal state, pathname, responsive refs. Hook: `useContextApi()`
- **`AddToCartProvider`** — cart items persisted to `localStorage`. Hook: `useAddToCart()`

### Routing

| Route | Description |
|---|---|
| `/` | Home: hero, schedule, about, shorts |
| `/abonamente` | Subscription category grid |
| `/abonamente/[slug]` | Cards filtered by category slug |
| `/galerie` | Gallery with parallel + intercepting route modal |
| `/galerie/[id]` | Full-page image (also `@modal` slot) |
| `/locatie` | Google Maps |
| `/cos` | Shopping cart |

### Styling

SCSS co-located with components for layout/structure. Tailwind inline for utilities. Dark mode via `next-themes` (`attribute="class"`) — use `dark:` Tailwind prefix or `:global(.dark)` in SCSS.
