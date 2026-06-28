# Feature: Locații

## PRD

**Scop:** Afișează toate locațiile fizice ale sălii cu poze, adresă, program, facilități și contact, pentru ca clienții să știe unde se află fiecare gym, ce oferă și cum pot ajunge sau lua legătura.

**Utilizatori:** Oricine — vizitatori anonimi, membri, traineri.

**Comportament așteptat:**

### `/locatii` — pagina de overview
- Grid de carduri, câte unul per locație activă
- Fiecare card: fotografie, nume, oraș, adresă scurtă, buton "Vezi locația →"
- Dacă există o singură locație activă → redirect automat la `/locatii/[slug]`

### `/locatii/[slug]` — pagina completă a locației
- Hero cu fotografie full-width + numele locației overlay
- Adresă completă + buton "Deschide în Maps" (link Google Maps navigation)
- Program săptămânal (din JSON în DB)
- Facilități disponibile (`amenities`)
- Google Maps embed centrat pe coordonate
- Secțiune antrenori activi din locație (carduri, link → `/antrenori/[slug]`)
- Contact + CTA:
  - Buton primar "Sună acum" → `tel:[phone]`
  - Buton secundar "Trimite email" → `mailto:[email]`
  - Buton terțiar "Vezi abonamente" → `/abonamente`

**Edge cases:**
- Fără foto → placeholder imagine generică
- Fără `lat`/`lng` → adresa text + link Maps, fără embed interactiv
- Program incomplet → ziua respectivă nu apare
- `amenities` gol → secțiunea Facilități nu apare
- Fără telefon și email → secțiunea Contact nu apare

---

## Tech Specs

**Rute:**
- `/locatii` → `src/app/locatii/page.tsx`
- `/locatii/[slug]` → `src/app/locatii/[slug]/page.tsx`

**Componente și rolul lor:**
- `LocationCard.tsx` — Server Component; card cu foto, nume, oraș, adresă, link
- `LocationDetail.tsx` — Server Component; hero, adresă, program, facilități, contact + CTA, antrenori
- `LocationMap.tsx` — Client Component; Google Maps cu marker; fallback dacă lipsesc coordonatele
- `LocationStructuredData.tsx` — Server Component; injectează JSON-LD `LocalBusiness` în `<head>`
- `locatii.scss` — stiluri comune

**Date folosite:**
- `Location` din Prisma — model extins
- `ILocation` extins în `src/types/location.ts`

```ts
interface IScheduleDay {
  days: string;        // "Luni–Vineri"
  open: string | null; // "08:00" — null = închis
  close: string | null;// "22:00"
}

interface ILocation {
  id: number;
  slug: string;
  name: string;
  city: string | null;
  address: string | null;    // stradă + număr
  county: string | null;     // "Satu Mare" — județ, pentru adresă structurată
  postalCode: string | null; // "440012" — cod poștal, pentru JSON-LD
  phone: string | null;
  email: string | null;
  lat: number | null;
  lng: number | null;
  photo: string | null;
  amenities: string[];
  schedule: IScheduleDay[] | null;
  isActive: boolean;
  sortOrder: number;
}
```

**SEO — per pagină `/locatii/[slug]`:**

`generateMetadata` în `page.tsx`:
```ts
export async function generateMetadata({ params }) {
  const loc = await getLocation(params.slug);
  return {
    title: `PrimaGYM ${loc.city} — Sală de fitness și aerobic`,
    description: `Vizitează PrimaGYM în ${loc.city}, ${loc.address}. Program: ${scheduleToString(loc.schedule)}. Sună la ${loc.phone}.`,
    openGraph: {
      title: `PrimaGYM ${loc.city}`,
      description: `...`,
      images: [{ url: `/locations/${loc.slug}.jpg` }],
      url: `https://primagym.ro/locatii/${loc.slug}`,
    },
  };
}
```

`generateStaticParams` în `page.tsx` — pre-renderează toate locațiile active la build:
```ts
export async function generateStaticParams() {
  const locations = await prisma.location.findMany({ where: { isActive: true }, select: { slug: true } });
  return locations.map(l => ({ slug: l.slug }));
}
```

**Structured data JSON-LD — `LocalBusiness`:**
```json
{
  "@context": "https://schema.org",
  "@type": "HealthClub",
  "name": "PrimaGYM Satu Mare",
  "url": "https://primagym.ro/locatii/satu-mare",
  "telephone": "+40712345678",
  "email": "satumare@primagym.ro",
  "image": "https://primagym.ro/locations/satu-mare.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Str. X, nr. 1",
    "addressLocality": "Satu Mare",
    "addressRegion": "SM",
    "postalCode": "440012",
    "addressCountry": "RO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.7991836,
    "longitude": 22.8738521
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "22:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "08:00", "closes": "13:00" }
  ]
}
```

**State folosit:**
- `LocationMap.tsx`: `useEffect` + `useRef` pentru Google Maps

**Integrări externe:**
- Google Maps JS API — `NEXT_PUBLIC_MAPS_API_KEY` în `.env.local`

**Schema DB — modificări pe modelul `Location`:**

```sql
ALTER TABLE "Location"
  ADD COLUMN city        TEXT,
  ADD COLUMN county      TEXT,
  ADD COLUMN postal_code TEXT,
  ADD COLUMN phone       TEXT,
  ADD COLUMN email       TEXT,
  ADD COLUMN lat         DOUBLE PRECISION,
  ADD COLUMN lng         DOUBLE PRECISION,
  ADD COLUMN photo       TEXT,
  ADD COLUMN amenities   TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN schedule    JSONB;
```

**Prisma schema — câmpuri adăugate pe `Location`:**
```prisma
city       String?
county     String?
postalCode String?
phone      String?
email      String?
lat        Float?
lng        Float?
photo      String?
amenities  String[]
schedule   Json?
```

**Probleme actuale / decizii de luat:**
- Pagina veche `/locatie` există — de înlocuit cu redirect spre `/locatii`
- Link-ul din navbar "Locatie" → de redenumit "Locații" cu href `/locatii`
- Nu există UI de admin pentru editat câmpurile noi ale locației
- `openingHoursSpecification` în JSON-LD trebuie generat din `schedule` JSON — conversie de zile românești → EN necesară (`"Luni–Vineri"` → `["Monday",...,"Friday"]`)

---

## TODOs Frontend

### Pagina overview `/locatii`
- [x] Crează `src/app/locatii/page.tsx` — Server Component; fetch locații active, redirect dacă e una singură
- [x] Crează `src/components/locatii/LocationCard.tsx` — card cu foto, nume, oraș, adresă, link
- [x] Crează `src/components/locatii/locatii.scss`

### Pagina detalii `/locatii/[slug]`
- [x] Crează `src/app/locatii/[slug]/page.tsx` — Server Component cu `generateMetadata` + `generateStaticParams`
- [x] Crează `src/components/locatii/LocationDetail.tsx` — hero, adresă + Maps link, program, facilități, contact + CTA, antrenori
- [x] Crează `src/components/locatii/LocationMap.tsx` — Client Component; Google Maps cu marker; fallback fără coordonate
- [x] Crează `src/components/locatii/LocationStructuredData.tsx` — injectează JSON-LD `LocalBusiness` via `<script type="application/ld+json">`
- [x] Crează `src/components/locatii/locationDetail.scss`

### Navbar + redirecturi
- [x] Redenumește "Locatie" → "Locații" în `NavbarV2Client.tsx` și actualizează href la `/locatii`
- [x] Înlocuiește `src/app/locatie/page.tsx` cu `redirect("/locatii")`

---

## TODOs Backend

### DB / Migrări
- [x] Adaugă câmpurile `city`, `county`, `postalCode`, `phone`, `email`, `lat`, `lng`, `photo`, `amenities`, `schedule` în modelul `Location` din `prisma/schema.prisma`
- [x] Rulează `prisma db push` + `prisma generate`
- [x] Actualizează locația "Satu Mare" în DB cu date reale: coordonate, `city`, `county`, `postalCode`, `phone`, `schedule`, `amenities`

### Admin UI
- [ ] Adaugă formular de editare locație în `/admin` cu câmpurile noi

### API Routes / Server Actions
- [ ] Nu sunt necesare route handlers noi — datele vin direct din Prisma în Server Components
