# Implementare Feature

Când este invocat acest command, urmează **exact** ordinea de mai jos. Nu sări pași.

---

## Pasul 1 — Identifică feature-ul

Dacă utilizatorul a dat un nume ca argument (ex: `/implementFeature cos`), folosește-l direct.
Dacă nu, întreabă: „Ce feature vrei să implementezi?"

Citește documentul corespunzător din `docs/features/<nume>.md`.
Dacă documentul nu există, oprește-te și spune utilizatorului să ruleze mai întâi `/creareDocsFeature`.

---

## Pasul 2 — Scaffold (structura de fișiere)

Creează toate fișierele necesare **goale sau cu schelet minim**, în această ordine:

### 2a. Tipuri — `src/types/<feature>.ts`
- Definește toate interfețele necesare feature-ului
- Prefix `I` pe toate interfețele: `ICart`, `INavbarItem`
- Exportă fiecare interfață individual (nu `export default`)

```ts
// src/types/subscription.ts
export interface ICart {
  id: number
  category: string
  pass: number
  price: number
}
```

### 2b. Date statice — `src/app/_core/<feature>.ts` (dacă e cazul)
- Dacă feature-ul are date noi, adaugă-le în `_core/`
- Importă tipul din `src/types/`, nu îl redefinești

### 2c. API Route — `src/app/api/<feature>/route.ts` (doar dacă e necesar pentru client fetch extern)
- Dacă Server Components pot importa direct din `_core/` → **nu crea route**
- Creează route doar dacă un Client Component are nevoie să fetch-uiască date dinamice

### 2d. Componente — `src/components/<feature>/`
- Un fișier `.tsx` + un fișier `.scss` per componentă
- Server Components: fără `"use client"`, fără hooks
- Client Components: `"use client"` prima linie, urmat de importuri

```tsx
// Schelet Server Component
import styles from './ComponentName.scss'

interface IComponentNameProps {
  // props
}

export default function ComponentName({ }: IComponentNameProps) {
  return <div></div>
}
```

```tsx
// Schelet Client Component
"use client"

import styles from './ComponentName.scss'

interface IComponentNameProps {
  // props
}

export default function ComponentName({ }: IComponentNameProps) {
  return <div></div>
}
```

### 2e. Pagină — `src/app/<ruta>/page.tsx` (dacă e o rută nouă)

---

## Pasul 3 — Implementare

Implementează în această ordine fixă:

1. **Tipuri** (`src/types/`) — completează toate interfețele
2. **Date** (`src/app/_core/`) — adaugă date dacă lipsesc
3. **Server Components** — implementează fetch + render (importă direct din `_core/`)
4. **Client Components** — implementează interactivitate, hooks, event handlers
5. **Pagini** — asamblează componentele în pagina finală
6. **SCSS** — stiluri pentru fiecare componentă nouă

---

## Reguli obligatorii în timpul implementării

### TypeScript
- Zero `any` — fiecare prop, parametru și return type are tip explicit
- Interfețe în `src/types/<feature>.ts`, nu inline în componentă
- Prefix `I` pe toate interfețele

### Componente
- Default **Server Component** — adaugă `"use client"` doar dacă folosești `useState`, `useEffect`, `useRef`, event handlers sau context hooks
- Niciodată `"use client"` doar pentru că componenta părinte e client
- Fișiere PascalCase: `SubscriptionCard.tsx`, `SubscriptionCard.scss`
- Import direct: `import SubscriptionCard from '@/components/abonamente/SubscriptionCard'`
- Path alias `@/` mereu — niciodată `../../`

### Date
- Server Components importă direct din `@/app/_core/` — fără fetch la `/api/`
- Niciun `localStorage` citit direct în componente — doar prin context

### State
- Niciodată `.splice()`, `.push()`, `.sort()` pe state — mereu `.filter()`, `.map()`, spread
- Cart: mereu prin `useAddToCart()` — niciodată `localStorage` direct

### Funcții
- Handler-e: sufix `Handler` — `addToCartHandler`, `removeHandler`
- Fetch functions: prefix `get` — `getSchedule`
- Niciun `console.log`

### Culori — design tokens obligatorii

Folosește **mereu** tokenurile semantice. Niciodată hex hardcodat sau clase Tailwind generice de culoare.

**În JSX / Tailwind:**
```tsx
// ✅ Corect
<div className="bg-card text-content">
<button className="bg-primary hover:bg-primary-hover text-white">

// ❌ Greșit
<div className="bg-white dark:bg-gray-900">
<div style={{ backgroundColor: '#1a1f2e' }}>
```

**În SCSS:**
```scss
// ✅ Corect — CSS var, se schimbă automat cu dark mode
.card { background-color: var(--color-card); }
.title { color: var(--color-content); }
.subtitle { color: var(--color-muted); }

// ❌ Greșit — hex hardcodat sau selector dark manual
.card { background: white; }
:global(.dark) .card { background: #1a1f2e; }
```

**Tokenuri disponibile:**

| Token Tailwind | Folosit pentru |
|---|---|
| `bg-surface` | Background pagină |
| `bg-card` | Carduri, panouri, liste |
| `bg-navbar` | Navbar background |
| `bg-modal` | Modal background |
| `text-content` | Text principal |
| `text-muted` | Text secundar, placeholder, subtitluri |
| `bg-primary` / `text-primary` | Butoane CTA, accente, highlight-uri |
| `bg-primary-hover` | Hover pe butoane primary |

**Excepție acceptată:** proprietăți fără echivalent Tailwind (`box-shadow`, `border-color` complex) — folosește `var(--color-*)` direct în SCSS.

### Stiluri
- SCSS co-locat cu componenta
- Nu folosi `@media (prefers-color-scheme)` — dark mode e class-based via `next-themes`
- Culorile din SCSS via `var(--color-*)`, culorile din JSX via clase Tailwind semantice

### Font
- Roboto e aplicat global via `roboto.className` pe `<main>` în `layout.tsx`
- Nu adăuga `font-family` în componente individuale

### Pagini
- Fără `export const dynamic = "force-dynamic"` dacă datele vin din `_core/`

---

## Pasul 4 — Verificare finală

După implementare, verifică:

- [ ] `npm run lint` — zero erori
- [ ] Zero `any` în fișierele create
- [ ] Zero `console.log`
- [ ] Toate componentele noi au fișier `.scss` co-locat
- [ ] Toate importurile folosesc `@/`
- [ ] Zero hex hardcodat în componente — doar tokeni semantici (`bg-card`, `var(--color-*)`)
- [ ] Zero `font-family` hardcodat în componente individuale
- [ ] TODOs din `docs/features/<nume>.md` bifate ca `[x]` — rulează `/updateDocs` după
