# .claude — Index

Acest folder conține comenzile custom și regulile pentru Claude Code în proiectul PrimaGym.

---

## Slash Commands

Comenzi disponibile în acest proiect. Se invocă cu `/numeComanda`.

| Command | Fișier | Când se folosește |
|---|---|---|
| `/creareDocsFeature` | `commands/creareDocsFeature.md` | Documentație pentru un feature nou (funcționalitate activă: auth, coș, galerie) |
| `/creareDocsLayout` | `commands/creareDocsLayout.md` | Documentație pentru o componentă de layout (navbar, footer, theme switch) |
| `/creareDocsPage` | `commands/creareDocsPage.md` | Documentație pentru o pagină de conținut (home, despre noi, contact) |
| `/updateDocs` | `commands/updateDocs.md` | Actualizează un doc existent după implementare sau schimbare de cerințe |
| `/implementFeature` | `commands/implementFeature.md` | Scaffold + implementare completă a unui feature pe baza docului său |

**Structura oricărui doc generat:**
```
## PRD              ← perspectiva utilizatorului
## Tech Specs       ← componente, rute, date, probleme actuale
## TODOs Frontend   ← taskuri UI granulare
## TODOs Backend    ← route handlers, API, env vars
```

---

## Documentație Proiect

Toate documentele sunt în `docs/`. Structura reflectă tipul de conținut:

### `docs/structure.md`
Arhitectura tehnică generală — folder layout, data layer (`_core/`), API routes, componente, contexte, routing, stilizare, env vars.

### `docs/layout/`
Componente prezente pe toate paginile.

| Fișier | Conținut |
|---|---|
| `navbar.md` | Navigare desktop + mobile, dropdown-uri, badge coș |
| `footer.md` | Contact, program, informatii, regulament, social media |
| `dark-mode.md` | next-themes, ThemeSwitch, convenții SCSS/Tailwind |

### `docs/pages/`
Pagini de conținut și prezentare.

| Fișier | Conținut |
|---|---|
| `home.md` | Hero video, orar, despre noi, shorts |

### `docs/features/`
Funcționalități active pe care utilizatorul le folosește.

| Fișier | Conținut |
|---|---|
| `abonamente.md` | Grid categorii, carduri abonamente, add-to-cart, antrenori |
| `galerie.md` | Grid foto, modal overlay, parallel + intercepting routes |
| `cos.md` | Cart context, dropdown navbar, pagina coș, checkout |
| `locatie.md` | Google Maps, marker, env vars necesare |
| `auth.md` | Login, register, OAuth (Google/Facebook/TikTok), roluri, reset parolă, sesiune |

---

## Design Tokens

Definite în `globals.scss` (CSS vars) și `tailwind.config.ts` (clase semantice).

| Token | Light | Dark | Folosit pentru |
|---|---|---|---|
| `bg-surface` | `rgb(233 233 233 / 59%)` | `#000000` | Background pagină |
| `bg-card` | `#ffffff` | `#1a1f2e` | Carduri, panouri |
| `bg-navbar` | `#f5f5f5` | `#0f1117` | Navbar |
| `bg-modal` | `#ffffff` | `#1e2433` | Modale |
| `text-content` | `#000000` | `#ffffff` | Text principal |
| `text-muted` | `#6b7280` | `#9ca3af` | Text secundar |
| `bg-primary` / `text-primary` | `#FF5C00` | `#FF5C00` | Butoane, accent |

**Font:** Roboto 400 — încărcat în `layout.tsx`, aplicat via `roboto.className`

**Regula de aur:** mereu token semantic (`bg-card`, `text-content`) — niciodată hex hardcodat în componente.

---

## Naming Conventions

Definite în `CLAUDE.md` din root. Rezumat rapid:

| Ce | Convenție | Exemplu |
|---|---|---|
| Fișier componentă | PascalCase | `SubscriptionCard.tsx` |
| Fișier SCSS | PascalCase (același) | `SubscriptionCard.scss` |
| Pagini / Routes | Next.js standard | `page.tsx`, `route.ts` |
| Tipuri | `src/types/<feature>.ts` | `src/types/subscription.ts` |
| Interfețe TS | Prefix `I` | `ICart`, `INavbarItem` |
| Handler-e | Sufix `Handler` | `addToCartHandler` |
| Fetch functions | Prefix `get` | `getSchedule` |
| Organizare components | Folder per feature, fișiere plate | `components/abonamente/SubscriptionCard.tsx` |
| Import | Direct din fișier cu `@/` | `@/components/abonamente/SubscriptionCard` |

---

## Reguli Refactorizare

Definite în `CLAUDE.md` din root. Rezumat:

| Regulă | Ce înseamnă |
|---|---|
| Zero `any` | Tipuri explicite pe toate props, parametri, return types |
| No state mutation | `.filter()` în loc de `.splice()`, mereu array nou |
| Cart — un singur context | `useAddToCart()` peste tot, niciodată `localStorage` direct în componente |
| Import direct din `_core/` | Server Components nu mai fetch-uiesc la propriile API routes |
| `"use client"` strict | Doar când componenta folosește hooks sau event handlers |
| Fără `force-dynamic` inutil | Doar pe pagini cu date cu adevărat dinamice per request |
| Fără `console.log` | Șters din tot codul înainte de commit |
| Dark mode | `:global(.dark)` în SCSS, `dark:` în Tailwind — nu amestecate |
| Path alias | Mereu `@/` în loc de `../../` |
