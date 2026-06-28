# Feature: Galerie

## PRD

**Scop:** Galerie foto a sălii. Vizitatorii pot răsfoi fotografiile și le pot deschide mărite fără a pierde contextul grilei.

**Utilizatori:** Vizitatori care vor să vadă cum arată sala înainte de a veni.

**Comportament așteptat:**
- Grid cu toate fotografiile la `/galerie`
- Click pe o fotografie din grid → se deschide un modal overlay (URL devine `/galerie/[id]`, grid-ul rămâne vizibil în spate)
- Click în afara modalului → închide modalul, revine la grid
- Acces direct la `/galerie/[id]` (refresh, link extern) → fotografia apare full-page fără grid
- Buton back din browser → revine la grid

---

## Tech Specs

**Rute:**
- `/galerie` → `src/app/galerie/page.tsx`
- `/galerie/[id]` → `src/app/galerie/[id]/page.tsx` (acces direct → full-page)
- `/galerie/@modal/(..)galerie/[id]` → intercepting route (navigare internă → modal)

**Pattern Next.js folosit — Parallel Routes + Intercepting Routes:**
- `galerie/layout.tsx` primește două slot-uri: `{ children }` (grid) și `{ modal }` (overlay)
- `@modal/default.tsx` returnează `null` — niciun modal activ când nu e selectată nicio fotografie
- `(..)galerie/[id]` interceptează navigarea internă și redă fotografia în `Modal` fără a demonta grid-ul
- La acces direct (refresh/URL extern) intercepting route nu se activează → se servește `[id]/page.tsx` full-page

**Componente și rolul lor:**
- `GalleryPhotos` — grid de `<Link href="/galerie/[id]">` pentru fiecare fotografie
- `Modal` — wrapper overlay reutilizabil (folosit și de feature-ul Shorts)
- `[id]/page.tsx` și `@modal/(..)galerie/[id]/page.tsx` — ambele caută fotografia în `gallery[]` după `id` și redau `<Image>`

**Date folosite:**
- `_core/gallery.ts` — array static `WonderImage[]` cu 4 fotografii; importă `StaticImageData` din `public/gallery/`

**Schema DB (Neon/PostgreSQL):**

> Necesară când galeria va fi gestionată din admin panel (upload/ștergere fără deploy).

```sql
CREATE TABLE gallery_photos (
  id         SERIAL PRIMARY KEY,
  filename   TEXT NOT NULL,
  url        TEXT NOT NULL,     -- URL complet (Cloudinary, S3, sau /gallery/...)
  alt_text   TEXT,
  sort_order INT DEFAULT 0,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON gallery_photos(sort_order) WHERE is_active = true;
```

**Date seed / valori default:**
- Insert cele 4 fotografii existente din `_core/gallery.ts` cu URL-urile din `public/gallery/`

**Probleme actuale:**
- Doar 4 fotografii hardcodate
- `export const dynamic = "force-dynamic"` pe toate rutele deși datele sunt statice
- `src/components/gallery/getGallery.tsx` pare duplicat cu `GalleryPhotos.tsx`

---

## TODOs Frontend

- [ ] Adaugă mai multe fotografii în `public/gallery/` și înregistrează-le în `_core/gallery.ts`
- [ ] Adaugă buton explicit de închidere în `Modal` (în plus față de click pe overlay)
- [ ] Elimină `export const dynamic = "force-dynamic"` de pe toate paginile galeriei
- [ ] Verifică și elimină `src/components/gallery/getGallery.tsx` dacă e duplicat

## TODOs Backend

### DB / Migrări (când se implementează admin panel)
- [x] Creare tabel `gallery_photos` în Neon — model `GalleryPhoto` există în `prisma/schema.prisma`
- [ ] Adaugă `@@index([sortOrder, isActive])` în modelul `GalleryPhoto` din schema Prisma
- [ ] Seed fotografiile existente din `public/gallery/`

### API Routes / Server Actions
- [ ] Elimină `src/app/api/gallery/route.ts` — galeria importă imagini statice direct, nu prin fetch
- [ ] Creează server action `uploadPhotoAction` pentru upload din admin panel (integrare Cloudinary sau S3)
- [x] Înlocuiește importul din `_core/gallery.ts` cu query Neon în `GalleryPhotos.tsx` — folosește `prisma.galleryPhoto.findMany()` via `_lib/gallery/getGallery.tsx`
