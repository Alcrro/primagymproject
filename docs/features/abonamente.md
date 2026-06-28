# Feature: Abonamente

## PRD

**Scop:** Permite vizitatorilor să exploreze categoriile de activități, să compare planurile de abonament disponibile per categorie și să adauge un abonament în coș — cu cât mai puține fricțiuni până la decizia de cumpărare.

**Utilizatori:** Vizitatori noi care caută prețurile sălii; membri existenți care vor să schimbe sau să reînnoiască abonamentul.

**Comportament așteptat:**
- `/abonamente` — grid cu 4 categorii (zumba, aerobic, cycling, fitness), fiecare cu imagine reprezentativă și link spre detalii
- `/abonamente/[slug]` — carduri cu planuri pentru categoria selectată: imagine, număr intrări, preț, buton „Doresc abonament"
  - Pe mobile: carousel snap orizontal — un card vizibil la un moment, swipe stânga/dreapta
  - Pe desktop: grid cu toate planurile vizibile
- Butonul „Doresc abonament" adaugă planul în coș și persistă în `localStorage`
- Sub carduri: antrenorii specializați pe categoria respectivă
- Dacă categoria nu are planuri definite → pagina afișează o secțiune de antrenori, fără carduri

**UX goals:**
- Ierarhie vizuală clară: imagine → titlu abonament → număr intrări → preț → CTA
- Hover animation pe card (scale + shadow) semnalează interactivitatea
- Focus vizibil pe buton „Doresc abonament" (keyboard nav, WCAG AA)
- Skeleton loader la navigarea între slug-uri elimină flash-ul de conținut gol

---

## Tech Specs

**Rute:**
- `/abonamente` → `src/app/abonamente/page.tsx`
- `/abonamente/[slug]` → `src/app/abonamente/[slug]/page.tsx`
- `/abonamente/[slug]` loading state → `src/app/abonamente/[slug]/loading.tsx`

**Componente și rolul lor:**
- `Subscriptions` — Server Component async; query `prisma.subscriptionCategory.findMany()`, afișează grid categorii
- `SubscriptionCarousel` — Client Component; carousel scroll-snap pe mobile + dots indicator; primește `plans: ICart[]` și `imageCard: StaticImageData`
- `SubscriptionCard` — Client Component; afișează un card de plan; redă fie „X ședințe" (entries) fie „X luni" (monthly); apelează `addToCartHandler` la click
- `SubscriptionCardSkeleton` — Server Component; placeholder animat folosit în `loading.tsx`
- `Trainers` — Server Component async; query `prisma.trainer.findMany({ where: { category: slug } })`

**Structura secțiunilor pe `/abonamente/[slug]`:**
- Planurile sunt împărțite în două grupe după `planType`:
  - `fitness` → „Cu antrenor" (entries, withTrainer: true) + „Fără antrenor" (monthly, withTrainer: false)
  - alte categorii → „Pe intrări" (entries) + „Pe luni" (monthly)
- Fiecare grupă e un `<div class="plan-section">` cu heading + `SubscriptionCarousel` independent

**Date folosite:**
- Tabel `subscription_categories` din Neon — categorii active, ordonate după `sortOrder`
- Tabel `subscription_plans` din Neon — planuri filtrate după `categoryId` și `isActive`
- Tabel `trainers` din Neon — filtrați după `category === slug`

**Tipuri:**
- `src/types/subscription.ts` — `ICart` cu câmpurile: `planType: 'entries' | 'monthly'`, `pass?: number`, `durationMonths?: number`, `withTrainer?: boolean`
- `src/types/trainer.ts` — `ITrainer`

**SEO:**
- `/abonamente` — `export const metadata` static (title + description cu keywords locale)
- `/abonamente/[slug]` — `generateMetadata` dinamic per categorie
- `/abonamente/[slug]` — `generateStaticParams` → generare statică pentru cele 4 slug-uri
- JSON-LD `ItemList` inline în `[slug]/page.tsx` cu planurile de preț

**Mobile UX:**
- Carousel CSS scroll-snap în `subscriptionCatCards.scss`
- Dots indicator sincronizat cu scroll via `useRef` + `scroll` event în `SubscriptionCarousel`

**Schema DB (Neon/PostgreSQL):**

```sql
CREATE TABLE subscription_categories (
  id         SERIAL PRIMARY KEY,
  slug       TEXT UNIQUE NOT NULL,        -- 'zumba', 'aerobic', 'cycling', 'fitness'
  name       TEXT NOT NULL,
  image_url  TEXT,
  is_active  BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

CREATE TYPE plan_type AS ENUM ('ENTRIES', 'MONTHLY');

CREATE TABLE subscription_plans (
  id              SERIAL PRIMARY KEY,
  category_id     INT NOT NULL REFERENCES subscription_categories(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  plan_type       plan_type NOT NULL DEFAULT 'ENTRIES',
  entries         INT,                        -- nr intrări; NULL pentru planuri lunare
  duration_months INT,                        -- 1, 3, 6, 12; NULL pentru planuri pe intrări
  with_trainer    BOOLEAN,                    -- fitness only: true = cu antrenor, false = fără
  price_ron       NUMERIC(10,2) NOT NULL,
  discount_pct    NUMERIC(5,2) DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE discount_codes (
  id            SERIAL PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,      -- cod introdus de user la checkout
  discount_pct  NUMERIC(5,2),             -- reducere % (ex: 20.00 = 20%)
  discount_ron  NUMERIC(10,2),            -- SAU sumă fixă în RON
  valid_from    TIMESTAMPTZ,
  valid_until   TIMESTAMPTZ,
  max_uses      INT,                       -- NULL = nelimitat
  current_uses  INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Indexuri
CREATE INDEX ON subscription_plans(category_id);
CREATE INDEX ON subscription_plans(is_active);
CREATE INDEX ON discount_codes(code) WHERE is_active = true;
```

**Date seed / valori default:**
- 4 categorii: `zumba`, `aerobic`, `cycling`, `fitness`
- Planuri entries (4 per categorie) + planuri monthly (4 per categorie) pentru toate
- Fitness: entries cu `withTrainer: true` + monthly cu `withTrainer: false`
- Prețuri monthly sunt placeholder — actualizează în seed.ts înainte de re-seed

**Migrare schemă (Neon):**
```bash
npx prisma db push    # aplică schema pe DB
npx prisma generate   # regenerează clientul
npx prisma db seed    # populează planurile noi
```

**Probleme actuale:**
- `aerobic` nu are niciun antrenor în tabelul `trainers` din DB → secțiunea antrenori e goală pentru aerobic

---

## TODOs Frontend

### Date și tipuri
- [x] Adaugă planuri pentru `aerobic` și `cycling` — inserate în DB via seed
- [x] Tipizează `SubscriptionCard` props: `category: ICart`, `imageCard: StaticImageData`
- [x] Tipizează map-ul din `Subscriptions.tsx` — folosește tipul Prisma `SubscriptionCategory`
- [x] Adaugă `planType: 'entries' | 'monthly'` în `ICart` — `pass` devine opțional
- [x] Adaugă `durationMonths?: number` și `withTrainer?: boolean` în `ICart`
- [ ] Adaugă un antrenor pentru `aerobic` în tabelul `trainers` din DB
- [ ] Actualizează prețurile planurilor lunare în `prisma/seed.ts` (valori placeholder acum)

### Refactorizare logică
- [x] Refactorizează `[slug]/page.tsx` — elimină branching-ul triplicat; lookup map `categoryImages`
- [x] Elimină `export const dynamic = "force-dynamic"` din `src/app/abonamente/page.tsx`
- [x] Elimină comentariul `// export const dynamic = 'force-dynamic'` din `[slug]/page.tsx`

### SEO
- [x] Adaugă `generateMetadata` în `src/app/abonamente/page.tsx`
- [x] Adaugă `generateMetadata` dinamic în `src/app/abonamente/[slug]/page.tsx`
- [x] Adaugă `generateStaticParams` în `[slug]/page.tsx`
- [x] Adaugă JSON-LD `ItemList` în `[slug]/page.tsx`
- [x] Corectează `alt` text în `SubscriptionCard` — `alt={`Abonament ${category.category}`}`

### UX / Interactivitate
- [x] Implementează carousel CSS scroll-snap pe mobile în `subscriptionCatCards.scss`
- [x] Adaugă indicatori de paginare (dots) sub carousel — sincronizați via scroll event
- [x] Adaugă hover animation pe `.card` — `transform: scale(1.02)` + `box-shadow`
- [x] Adaugă `:focus-visible` outline pe butonul „Doresc abonament" în `button.scss`
- [x] Creează `SubscriptionCardSkeleton.tsx` + `loading.tsx` în `[slug]/`

## TODOs Backend

### DB / Migrări
- [x] Creare tabel `subscription_categories` în Neon
- [x] Creare tabel `subscription_plans` cu câmpul `discount_pct`
- [x] Creare tabel `discount_codes`
- [x] Adaugă indexuri pe `category_id`, `is_active`, `code`
- [x] Seed date inițiale: 4 categorii + 18 planuri
- [ ] `npx prisma db push` — aplică câmpurile `planType`, `entries?`, `durationMonths`, `withTrainer` pe Neon
- [ ] `npx prisma db seed` — populează planurile lunare noi (32 planuri total)

### API Routes / Server Actions
- [x] Înlocuiește importul din `_core/subscription.ts` cu query Prisma în `[slug]/page.tsx`
- [x] Înlocuiește importul din `_core/subscriptionCategories.ts` cu query Prisma în `Subscriptions.tsx`
- [ ] Creează server action `applyDiscountCode` — validează codul, verifică `valid_until` și `max_uses`
- [x] Elimină `src/app/api/abonamente/route.ts`
- [x] Elimină `src/app/_lib/abonamente/getSubCategories.tsx`
