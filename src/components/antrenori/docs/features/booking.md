# Feature: Booking Sesiuni

## PRD

**Scop:** Membrii pot rezerva locuri la clasele de grup sau pot solicita ședințe personale cu un antrenor, direct din site, fără telefon sau mesaje.

**Utilizatori:**
- **MEMBER** — vede sesiunile disponibile, rezervă locuri la grupe, trimite cereri pentru personal
- **TRAINER** — creează și gestionează sesiunile de grup, acceptă/refuză cererile personale, adaugă manual participanți
- **ADMIN** — acces read-only la toate sesiunile și rezervările (viitor)

---

**Comportament așteptat:**

### Sesiuni de grupă (Trainer → Member)

_Fluxul trainerului:_
1. Trainerul accesează `/trainer/sesiuni` din dashboard-ul lui
2. Creează o sesiune nouă: tip clasă (zumba/cycling/etc.), dată, oră, durată, capacitate maximă, locație
3. Sesiunea apare imediat pe pagina publică `/sesiuni`
4. Trainerul poate edita sau anula sesiunea (anulare notifică membrii cu rezervare — viitor)

_Fluxul membrului:_
1. Membrul accesează `/sesiuni` și vede toate sesiunile viitoare
2. Filtrează opțional după tip clasă sau dată
3. Click pe o sesiune → pagina de detalii `/sesiuni/[id]`
4. Dacă nu are abonament activ la categoria respectivă → mesaj blocat cu link spre `/abonamente/[slug]`
5. Dacă are abonament și mai sunt locuri → buton „Rezervă loc"
6. Dacă sesiunea e plină → buton dezactivat „Complet"
7. Rezervarea apare în `/profil/rezervari`

### Sesiuni personale (Member → Trainer)

_Fluxul membrului:_
1. Pe pagina unui antrenor `/antrenori/[location]/[id]` → buton „Solicită ședință personală"
2. Membrul completează: data și ora dorită + mesaj opțional
3. Cererea ajunge la trainer cu status `PENDING`

_Fluxul trainerului:_
1. Trainerul vede cererile noi în `/trainer/cereri`
2. Acceptă (opțional adaugă un mesaj) sau refuză cu motiv
3. Membrul vede statusul actualizat în `/profil/rezervari`

_Edge cases:_
- Membrul fără abonament activ → blocat la trimiterea cererii, redirect spre abonamente
- Trainerul inactiv → butonul de solicitare nu apare pe profilul lui
- Locuri epuizate la grupă → butonul de rezervare dezactivat, se afișează „Complet (X/X locuri)"
- Membrul încearcă să rezerve de două ori aceeași sesiune → eroare „Ai deja o rezervare la această sesiune"
- Sesiune anulată de trainer → rezervările existente afișează badge „Anulat"

---

## Tech Specs

**Rute:**
- `/sesiuni` → `src/app/sesiuni/page.tsx` — lista publică de sesiuni de grup viitoare
- `/sesiuni/[id]` → `src/app/sesiuni/[id]/page.tsx` — detalii sesiune + buton rezervare
- `/trainer` → `src/app/trainer/page.tsx` — dashboard trainer (acces: TRAINER)
- `/trainer/sesiuni` → `src/app/trainer/sesiuni/page.tsx` — gestionare sesiuni de grup
- `/trainer/sesiuni/[id]/edit` → `src/app/trainer/sesiuni/[id]/edit/page.tsx` — editare sesiune
- `/trainer/cereri` → `src/app/trainer/cereri/page.tsx` — cereri personale primite
- `/profil/rezervari` → `src/app/profil/rezervari/page.tsx` — rezervările membrului

**Componente și rolul lor:**
- `SessionCard.tsx` — Server Component; card sesiune cu tip, dată, locuri rămase; de creat în `src/components/sesiuni/`
- `SessionsList.tsx` — Server Component; grid/list de SessionCard cu filtrare; de creat în `src/components/sesiuni/`
- `BookingButton.tsx` — Client Component; buton „Rezervă" cu validare abonament activ; de creat în `src/components/sesiuni/`
- `TrainerSessionForm.tsx` — Client Component; form creare/editare sesiune de grup; de creat în `src/components/trainer/`
- `PersonalRequestForm.tsx` — Client Component; form cerere ședință personală; de creat în `src/components/antrenori/`
- `TrainerRequestsTable.tsx` — Client Component; tabel cereri cu butoane accept/refuz; de creat în `src/components/trainer/`

**Date folosite:**
- `Session` — sesiunile de grup create de traineri
- `SessionBooking` — rezervările membrilor la sesiuni de grup
- `PersonalRequest` — cererile 1:1 trimise de membri
- `ISession`, `ISessionBooking`, `IPersonalRequest` — de creat în `src/types/booking.ts`
- Validare abonament activ: query `OrderItem` cu `expiresAt > now()` și `category === session.categorySlug`

**State folosit:**
- `BookingButton.tsx`: `useState` pentru loading și eroare la submit
- `TrainerRequestsTable.tsx`: `useState` pentru form accept/refuz deschis

**Integrări externe:** N/A — nu sunt necesare

**Schema DB (Neon/PostgreSQL):**

```sql
-- Sesiuni de grupă create de traineri
CREATE TABLE sessions (
  id               SERIAL PRIMARY KEY,
  trainer_id       INT NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  location_id      INT REFERENCES locations(id) ON DELETE SET NULL,
  category_slug    TEXT NOT NULL,               -- 'zumba', 'cycling', 'fitness', 'aerobic'
  start_at         TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  max_capacity     INT NOT NULL DEFAULT 20,
  status           TEXT NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED | CANCELLED | COMPLETED
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON sessions(trainer_id);
CREATE INDEX ON sessions(start_at) WHERE status = 'SCHEDULED';
CREATE INDEX ON sessions(category_slug, start_at);

-- Rezervările membrilor la sesiuni de grupă
CREATE TABLE session_bookings (
  id         SERIAL PRIMARY KEY,
  session_id INT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'CONFIRMED', -- CONFIRMED | CANCELLED
  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE (session_id, user_id)   -- un user o singură rezervare per sesiune
);

CREATE INDEX ON session_bookings(session_id);
CREATE INDEX ON session_bookings(user_id);

-- Cereri de ședințe personale (1:1)
CREATE TABLE personal_requests (
  id             SERIAL PRIMARY KEY,
  member_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trainer_id     INT NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  requested_at   TIMESTAMPTZ NOT NULL,           -- ora dorită de membru
  message        TEXT,
  status         TEXT NOT NULL DEFAULT 'PENDING', -- PENDING | ACCEPTED | REJECTED | CANCELLED
  response_note  TEXT,                            -- mesajul trainerului la accept/refuz
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON personal_requests(trainer_id, status);
CREATE INDEX ON personal_requests(member_id);
```

**Date seed / valori default:**
- `status = 'SCHEDULED'` implicit pentru sesiuni noi
- `status = 'CONFIRMED'` implicit pentru rezervări noi
- `duration_minutes = 60` default
- `max_capacity = 20` default
- Nu sunt necesare date seed inițiale

**Probleme actuale / decizii de luat:**
- Validarea abonamentului activ: `OrderItem` are `categoryName` (string) — trebuie să corespundă cu `category_slug` din sesiune; posibil mismatch de casing
- Notificări (email/push) la accept/anulare — nu sunt implementate, de decis dacă sunt necesare
- Calendarul trainerului: view săptămânal sau doar listă? — de decis
- Trainerul poate gestiona doar sesiunile lui (`trainer_id === session.trainer_id`) — verificare necesară în server actions
- `User.id` e `String` (cuid) în Prisma, `REFERENCES users(id)` trebuie verificat față de tabelul real din Neon

---

## TODOs Frontend

### Pagini publice (sesiuni de grupă)
- [x] Crează `src/app/sesiuni/page.tsx` — Server Component, listează sesiunile viitoare cu `status = SCHEDULED`
- [x] Crează `src/app/sesiuni/[id]/page.tsx` — Server Component, detalii sesiune + nr. locuri rămase
- [x] Crează `src/components/sesiuni/SessionCard.tsx` — card cu tip, dată, oră, antrenor, locuri rămase
- [ ] Crează `src/components/sesiuni/SessionsList.tsx` — grid de SessionCard cu filtrare pe categorie
- [x] Crează `src/components/sesiuni/BookingButton.tsx` — Client Component, validare abonament activ, submit rezervare
- [x] Adaugă buton „Solicită ședință personală" pe `TrainerDetail.tsx` (vizibil doar pentru MEMBER autentificat)
- [x] Crează `src/components/antrenori/PersonalRequestForm.tsx` — form cu dată/oră dorită + mesaj opțional

### Dashboard trainer
- [x] Crează `src/app/trainer/layout.tsx` — verifică rol TRAINER, redirect dacă nu
- [x] Crează `src/app/trainer/page.tsx` — sumar: sesiuni azi, cereri pending
- [x] Crează `src/app/trainer/sesiuni/page.tsx` — lista sesiunilor proprii + buton sesiune nouă
- [ ] Crează `src/app/trainer/sesiuni/nou/page.tsx` — form creare sesiune de grup
- [ ] Crează `src/app/trainer/sesiuni/[id]/edit/page.tsx` — form editare + buton anulare sesiune
- [x] Crează `src/components/trainer/TrainerSessionForm.tsx` — Client Component, form sesiune (dată, oră, durată, capacitate, categorie)
- [x] Crează `src/app/trainer/cereri/page.tsx` — lista cererilor personale primite, filtru status
- [x] Crează `src/components/trainer/TrainerRequestsTable.tsx` — tabel cereri cu accept/refuz inline

### Profil membru
- [x] Crează `src/app/(protected)/rezervari/page.tsx` — lista rezervărilor la grupe + cererile personale trimise
- [x] Adaugă link „Rezervările mele" în dropdown-ul de profil din `NavbarV2Client.tsx`

---

## TODOs Backend

### DB / Migrări
- [x] Crează tabelul `class_sessions` în Neon cu schema de mai sus
- [x] Crează tabelul `class_bookings` cu constraint `UNIQUE(session_id, user_id)`
- [x] Crează tabelul `personal_requests` în Neon
- [x] Adaugă indexuri și modele `ClassSession`, `ClassBooking`, `PersonalRequest` în `prisma/schema.prisma`
- [x] Rulează `prisma db push` + `prisma generate`

### API Routes / Server Actions
- [x] Crează `createSessionAction` în `src/app/actions/session.ts` — validare: trainer poate crea doar pentru el
- [x] Crează `updateSessionAction` în `src/app/actions/session.ts`
- [x] Crează `cancelSessionAction` în `src/app/actions/session.ts` — setează `status = CANCELLED`
- [x] Crează `bookSessionAction` în `src/app/actions/session.ts` — validare abonament activ + locuri disponibile
- [x] Crează `cancelBookingAction` în `src/app/actions/session.ts`
- [x] Crează `sendPersonalRequestAction` în `src/app/actions/personalRequest.ts` — validare abonament activ
- [x] Crează `respondPersonalRequestAction` în `src/app/actions/personalRequest.ts` — accept/refuz, doar trainerul destinatar
- [x] Crează `cancelPersonalRequestAction` în `src/app/actions/personalRequest.ts` — membrul poate anula cererea proprie
