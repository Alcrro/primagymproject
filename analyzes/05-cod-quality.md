# PrimaGym — Analiză Calitate Cod

**Scor: 7 / 10** — Arhitectură bună, convenții clare, câteva datorii tehnice de curățat.

---

## Ce e bine

### Arhitectură
- `src/app/_core/` ca single source of truth pentru date statice — pattern corect
- Server Components ca default, `"use client"` doar unde e nevoie
- Separare clară: `_core/` → date, `components/` → UI, `types/` → tipuri, `context/` → state global
- Route groups (`(auth)`, `(protected)`, `(footer)`) organizate logic fără impact pe URL
- Parallel + intercepting routes pentru galerie — utilizare avansată și corectă a Next.js

### TypeScript
- Interfețe cu prefix `I` (ICart, INavbarItem, ITrainerProfile) — convenție respectată
- `src/types/` per feature — nu co-locat în componente
- Prisma generează tipuri din schema — type safety la layer DB

### Styling
- Design tokens în `globals.scss` ca CSS variables + expuse în Tailwind config
- Co-locating SCSS cu componenta — ușor de găsit
- Dark mode via `next-themes` + `var(--color-*)` — corect, fără media query

### State Management
- `AddToCartProvider` — cart exclusiv în context, fără accese directe la localStorage din componente
- `ContextAPI` — UI state centralizat pentru navbar, modals, pathname

---

## Probleme de cod

### Datorii tehnice (de rezolvat)

**1. Self-referential fetch pattern**
Server Components fac fetch la propriile route-uri `/api/...` în loc să importe direct din `_core/`.
- Ex: `_lib/footer/getInformation/getInformation.tsx` face `fetch('/api/footer/informatii')` care returnează date din `_core/information.ts`
- Fix: import direct `import { information } from '@/app/_core/information'` în Server Component
- Status: parțial rezolvat (unele `_lib/` și `api/` au fost deja șterse conform gitStatus)

**2. `export const dynamic = "force-dynamic"` pe pagini statice**
- `src/app/page.tsx` (home) — datele vin din `_core/`, nu e nevoie de force-dynamic
- Impactul: dezactivează ISR și static generation, crește load time inutil

**3. `console.log` în cod**
- Prezent în mai multe componente conform CLAUDE.md
- Fix simplu: `grep -r "console.log" src/` și șterge

**4. Tipuri `any` rămase**
- Câteva componente folosesc `any` conform docs TODOs
- Fix: grep + înlocuire cu tipuri specifice

**5. Build script Windows-only**
```json
// package.json — broken pe Linux/Mac:
"build": "set NODE_ENV=production && next build"
// Fix:
"build": "next build"
```

### Inconsistențe minore

**Sursa de adevăr dublă pentru antrenori**
- `src/app/_core/antrenori.ts` — date hardcodate
- Tabelul `Trainer` în DB — date în Prisma
- Care e master? Neclar. Trebuie ales unul și migrați toți la el.

**Naming inconsistent**
- `durationMonths` (camelCase) în TypeScript vs `duration_months` (snake_case) în DB
- Prisma mappings rezolvă asta dar trebuie verificat că sunt aplicate

**Import paths**
- Convenție: `@/` alias pentru `src/` — verificat că e aplicat consistent?
- `grep -r "from '\.\./" src/` ar trebui să returneze zero rezultate

---

## Checklist cod quality

### Rulează acum
```bash
# Găsește console.log-uri
grep -r "console\.log" src/ --include="*.tsx" --include="*.ts"

# Găsește tipuri any
grep -r ": any" src/ --include="*.tsx" --include="*.ts"
grep -r "as any" src/ --include="*.tsx" --include="*.ts"

# Găsește import-uri relative (ar trebui să fie 0)
grep -r "from '\.\." src/ --include="*.tsx" --include="*.ts"

# Găsește force-dynamic
grep -r "force-dynamic" src/ --include="*.tsx" --include="*.ts"

# Găsește fetch auto-referențial
grep -r "fetch('/api/" src/ --include="*.tsx" --include="*.ts"
```

### Lint
```bash
npm run lint
```
Rulează și rezolvă toate warning-urile înainte de lansare.

---

## Recomandări arhitecturale pe termen lung

1. **Separă datele antrenorilor** — alege DB ca sursă unică și șterge `_core/antrenori.ts`
2. **Adaugă Zod** pentru validare server actions (formular register, login, cereri)
3. **Error boundaries** — wrapper per feature pentru erori izolate
4. **Rate limiting** pe `api/checkout` și `api/auth/*` (ex: `@upstash/ratelimit`)
5. **Testare** — cel puțin smoke tests pe fluxurile critice (checkout, QR scan)
