# Feature: Antrenori

## PRD

**Scop:** Pagina dedicată antrenorilor permite vizitatorilor să descopere echipa sălii înainte de a se abona. Antrenorii sunt organizați pe locații, iar click pe un card deschide o pagină de detalii cu bio complet, clase predate și date de contact.

**Utilizatori:** Vizitatori anonimi (citire); Admini autentificați (CRUD complet din `/admin/antrenori`).

**Comportament așteptat:**

_Pagina per locație `/antrenori/[location]`:_
- Afișează cardurile tuturor antrenorilor activi din acea locație
- Cardul conține: fotografie profil (sau placeholder siluetă), nume, specialitate, vârstă, bio scurt
- Dacă locația nu există sau nu are antrenori activi → mesaj empty state „Nu există antrenori disponibili momentan"
- Loading state în timp ce se încarcă datele

_Pagina de detalii `/antrenori/[location]/[id]`:_
- Bio extins, lista claselor predate, date de contact (Instagram, email)
- Dacă antrenorul nu există → 404
- Buton înapoi la lista locației

_Navbar:_
- „Antrenori" înlocuiește „Galerie" în navbar; dropdown cu toate locațiile active
- Click pe locație → `/antrenori/[location]`

_Admin `/admin/antrenori`:_
- Tabel cu toți antrenorii (activi + inactivi), filtrabil pe locație
- Butoane: Adaugă antrenor, Editează, Dezactivează/Activează, Șterge
- Form add/edit: toate câmpurile modelului Trainer + selector locație
- Acces restricționat la rol ADMIN

---

## Tech Specs

**Rute:**
- `/antrenori/[location]` → `src/app/antrenori/[location]/page.tsx`
- `/antrenori/[location]/[id]` → `src/app/antrenori/[location]/[id]/page.tsx`
- `/admin/antrenori` → `src/app/admin/antrenori/page.tsx`

**Componente și rolul lor:**
- `TrainerCard.tsx` — Server Component; card cu foto, nume, specialitate, vârstă, bio scurt; există deja în `src/components/abonamente/trainers/`, necesită extindere
- `Trainers.tsx` — Server Component async; query Prisma filtrat pe `locationId`; există deja, necesită modificare (filtrare pe locație în loc de categorie)
- `TrainerDetail.tsx` — Server Component nou; bio extins, classes[], instagram, email; de creat în `src/components/antrenori/`
- `AdminTrainersTable.tsx` — Client Component nou; tabel cu CRUD; de creat în `src/components/admin/antrenori/`
- `TrainerForm.tsx` — Client Component nou; form add/edit cu validare; de creat în `src/components/admin/antrenori/`

**Date folosite:**
- Tabel `trainers` + tabel `locations` din Neon via Prisma
- `ITrainer` în `src/types/trainer.ts` — necesită actualizare cu câmpurile noi
- `ILocation` în `src/types/location.ts` — de creat

**State folosit:**
- Admin page: `useState` pentru form deschis/închis și antrenorul selectat pentru edit
- Restul paginilor: Server Components, fără state client

**Integrări externe:**
- Upload poze antrenori: Cloudinary sau stocare în `public/profileTrainers/` (decizie deschisă)
- Autentificare admin: `next-auth` sesiune existentă, verificare rol `ADMIN` în Server Component

**Schema DB (Neon/PostgreSQL):**

```sql
-- Tabel locații (nou)
CREATE TABLE locations (
  id         SERIAL PRIMARY KEY,
  slug       TEXT NOT NULL UNIQUE,   -- ex: 'satu-mare-central'
  name       TEXT NOT NULL,          -- ex: 'Satu Mare - Central'
  address    TEXT,
  is_active  BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON locations(sort_order) WHERE is_active = true;

-- Modificări tabel trainers (existent)
ALTER TABLE trainers ADD COLUMN location_id INT REFERENCES locations(id) ON DELETE SET NULL;
ALTER TABLE trainers ADD COLUMN bio         TEXT;          -- bio extins pt pagina de detalii
ALTER TABLE trainers ADD COLUMN instagram   TEXT;          -- handle fără @, ex: 'primagym.ro'
ALTER TABLE trainers ADD COLUMN email       TEXT;
ALTER TABLE trainers ADD COLUMN classes     TEXT[];        -- ['zumba', 'cycling']

-- Index locație pentru filtrare
CREATE INDEX ON trainers(location_id) WHERE is_active = true;
```

**Note schema:**
- Câmpul `category` existent pe `trainers` devine redundant dacă `classes TEXT[]` îl înlocuiește — decizie de luat la migrare
- `bio` este descrierea lungă pentru pagina de detalii; `description` existent = bio scurt pe card

**Date seed / valori default:**
- Insert cel puțin o locație placeholder cu slug `placeholder-a` până când clientul confirmă numele reale
- `is_active = true` default pe toți antrenorii și locațiile noi
- `classes` populat cu `category`-ul existent la seed inițial

**Probleme actuale / decizii de luat:**
- Numele și slug-urile locațiilor nu sunt confirmate de client — momentan există locația placeholder „Satu Mare"
- `_core/antrenori.ts` — fișier legacy cu date placeholder, de șters după seed DB cu date reale
- Datele din DB sunt placeholder: `category: "nimic"` pentru alex, `description: "The best trainer"` pentru toți
- `Trainers.tsx` (folosit pe paginile de abonamente) filtrează în continuare pe `category` — intentionat, pentru a nu rupe abonamentele
- Upload poze: nu există mecanism de upload; momentan `thumbnail` e un string cu numele fișierului din `public/profileTrainers/`

---

## TODOs Frontend

### Pagini publice
- [x] Crează `src/app/antrenori/page.tsx` — pagina principală cu toate locațiile și antrenorii grupați pe secțiuni
- [x] Crează `src/app/antrenori/[location]/page.tsx` — Server Component, query trainers filtrați pe `location.slug`
- [x] Crează `src/app/antrenori/[location]/[id]/page.tsx` — Server Component, query un trainer + locație; 404 dacă nu există
- [x] Adaugă empty state în pagina locație când nu sunt antrenori activi
- [x] Crează `src/components/antrenori/TrainerDetail.tsx` — bio extins, classes[], instagram, email
- [x] Adaugă buton „Înapoi la [Locație]" pe pagina de detalii

### Navbar
- [x] Înlocuiește „Galerie" cu „Antrenori" în `NavbarV2Client.tsx` — link direct dacă locație unică, dropdown dacă multiple
- [x] Adaugă locațiile în props `INavbarV2ClientProps`
- [x] Adaugă locațiile în meniul mobile din `NavbarV2Client.tsx`

### Card și componente existente
- [x] Extinde `ITrainer` în `src/types/trainer.ts` cu câmpurile noi: `locationId`, `bio`, `instagram`, `email`, `classes`
- [x] Crează `src/types/location.ts` cu interfața `ILocation`
- [x] Crează `src/components/antrenori/TrainersList.tsx` — grid cu carduri clickabile per locație (înlocuiește nevoia de a modifica `TrainerCard.tsx`)
- [ ] Actualizează datele reale în DB: nume, descrieri, clase per antrenor

### Admin
- [x] Crează `src/app/admin/antrenori/page.tsx` — listează toți antrenorii, acces restricționat la ADMIN/TRAINER
- [x] Crează `src/components/admin/antrenori/AdminTrainersPage.tsx` — tabel cu filtrare pe locație, butoane edit/delete/toggle
- [x] Crează `src/components/admin/antrenori/TrainerForm.tsx` — form add/edit, selector locație, checkboxuri clase
- [ ] Adaugă CRUD pentru locații în pagina admin (momentan doar pentru antrenori)

---

## TODOs Backend

### DB / Migrări
- [x] Crează tabelul `locations` în Neon — model `Location` în `prisma/schema.prisma`, aplicat cu `prisma db push`
- [x] Adaugă index pe `(sort_order)` pe `locations`
- [x] Adaugă coloana `location_id` pe `trainers` cu FK către `locations(id)`
- [x] Adaugă coloanele `bio`, `instagram`, `email`, `classes String[]` pe `trainers`
- [x] Adaugă index pe `(location_id)` pe `trainers`
- [x] Seed locație placeholder „Satu Mare" cu slug `satu-mare`
- [x] Actualizează modelul `Trainer` și adaugă modelul `Location` în `prisma/schema.prisma`
- [x] Rulează `prisma db push` + `prisma generate`

### API Routes / Server Actions
- [x] Crează server action `createTrainerAction` în `src/app/actions/trainer.ts`
- [x] Crează server action `updateTrainerAction` în `src/app/actions/trainer.ts`
- [x] Crează server action `deleteTrainerAction` în `src/app/actions/trainer.ts`
- [x] Crează server action `toggleTrainerActiveAction` în `src/app/actions/trainer.ts`
- [x] Crează server actions pentru locații în `src/app/actions/location.ts` (`create`, `update`, `delete`)
- [x] Rolul `ADMIN` există pe modelul `User` — enum `UserRole { MEMBER, TRAINER, ADMIN }`
- [ ] Șterge `_core/antrenori.ts` după ce datele reale sunt introduse în DB
