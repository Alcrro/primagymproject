# Feature: QR Acces

## PRD

**Scop:** Membrul prezintă un cod QR de pe telefon la intrarea în sală; staff-ul scanează codul și vede instant dacă abonamentul e activ, câte intrări mai are și identitatea membrului.

**Utilizatori:**
- **MEMBER** — generează și afișează QR-ul din profilul personal
- **ADMIN / TRAINER** — scanează QR-ul de pe pagina `/admin/scan` și marchează intrarea

**Comportament așteptat:**

*Fluxul membrului:*
- Membrul intră în `/profil` → secțiunea „Acces sală" afișează un cod QR dinamic
- QR-ul conține un JWT semnat, valabil **5 minute**
- Un countdown vizibil arată cât timp mai e valabil; la expirare se regenerează automat fără refresh manual
- Membrul nu poate genera QR dacă nu are niciun abonament PAID activ

*Fluxul staff-ului:*
- Staff-ul deschide `/admin/scan` pe telefon sau tabletă
- Camera se activează automat și scanează QR-ul membrului
- La scan reușit: apare un card cu **poza de profil, numele, emailul** și lista abonamentelor active
- Pentru fiecare abonament tip **intrări**: afișează „X intrări rămase din Y total" + buton **„Marchează intrare"**
- Pentru fiecare abonament tip **lunar**: afișează data expirării (ex: „Valabil până pe 1 octombrie 2026")
- La click pe „Marchează intrare": intrarea e înregistrată, contorul scade cu 1, card-ul se actualizează
- Dacă membrul nu are abonament activ sau QR-ul e expirat: mesaj de eroare clar

*Edge cases:*
- QR expirat (>5 min) → eroare „QR expirat, roagă membrul să regenereze"
- QR falsificat / semnatură invalidă → eroare „QR invalid"
- Abonament de tip intrări cu 0 intrări rămase → badge „Epuizat", butonul „Marchează intrare" dezactivat
- Abonament lunar expirat → badge „Expirat", nu apare în lista activelor
- Membrul are mai multe abonamente active → toate sunt afișate, staff-ul alege care să folosească

---

## Tech Specs

**Rute:**
- `/profil` — secțiune nouă QR (componentă adăugată)
- `/admin/scan` — pagina de scanare (ADMIN + TRAINER)
- `GET /api/qr/token` — generează JWT pentru utilizatorul curent
- `POST /api/qr/verify` — validează token, returnează datele membrului
- `POST /api/check-in` — înregistrează o intrare și decrementează

**Componente și rolul lor:**
- `QrCodeSection` — Client Component în `/profil`; fetch la `/api/qr/token`, afișează QR + countdown 5 min, auto-refresh la expirare; ascuns dacă nu există abonamente PAID
- `ScannerPage` — Client Component la `/admin/scan`; activează camera, decodează QR via `@zxing/browser`, trimite tokenul la `/api/qr/verify`, afișează `MemberCard`
- `MemberCard` — Client Component; afișează poza, numele, emailul și lista `ActiveSubCard` per abonament activ
- `ActiveSubCard` — afișează detalii per abonament (intrări rămase sau dată expirare) + buton „Marchează intrare" conectat la `/api/check-in`

**Date folosite:**
- Token JWT semnat cu `AUTH_SECRET`, payload: `{ userId, iat, exp }`
- `/api/qr/verify` returnează: `{ name, email, image, subscriptions: ActiveSub[] }`
- `ActiveSub`: `{ orderItemId, planName, categoryName, type: 'entries'|'monthly', remainingEntries?, totalEntries?, expiresAt? }`

**State folosit:**
- `QrCodeSection`: `useState` pentru token + countdown; `useEffect` pentru auto-refresh la expirare
- `ScannerPage`: `useState` pentru `memberData`, `scanState: 'idle'|'loading'|'success'|'error'`

**Integrări externe:**
- `qrcode.react` — generare QR client-side pe profilul membrului
- `@zxing/browser` — decodare QR din camera device-ului (fără backend)
- JWT semnat cu `jose` (deja instalat via next-auth) — fără librărie nouă necesară

**Schema DB (Neon/PostgreSQL):**

```sql
-- Câmpuri noi pe order_items (pentru calcul expirare și total intrări)
ALTER TABLE "OrderItem"
  ADD COLUMN expires_at    TIMESTAMPTZ,   -- NULL pentru abonamente entries
  ADD COLUMN total_entries INT;           -- NULL pentru abonamente lunare

-- Tabel check-in: fiecare intrare efectivă în sală
CREATE TABLE check_ins (
  id              SERIAL PRIMARY KEY,
  order_item_id   INT  NOT NULL REFERENCES "OrderItem"(id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL REFERENCES "User"(id)      ON DELETE CASCADE,
  scanned_by_id   TEXT NOT NULL REFERENCES "User"(id),
  scanned_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON check_ins(order_item_id);
CREATE INDEX ON check_ins(user_id);
CREATE INDEX ON check_ins(scanned_at);
```

**Date seed / valori default:**
- `expires_at` — calculat la crearea comenzii: `ORDER.created_at + durationMonths`; NULL pentru abonamente tip entries
- `total_entries` — calculat la crearea comenzii: `OrderItem.quantity × pass`; NULL pentru abonamente lunare
- Nu sunt necesare date seed statice — tabelul `check_ins` se populează la fiecare intrare

**Probleme actuale / decizii de luat:**
- `OrderItem` nu stochează `pass` (nr. intrări per pachet) sau `durationMonths` — acestea există în `ICart` la adăugare în coș dar nu sunt persitate. Trebuie adăugate câmpurile `total_entries` și `expires_at` la crearea comenzii în `/api/checkout/route.ts`
- `OrderItem.planName` conține date ca „Zumba — 4 intrări" dar nu e parsabil programatic; câmpurile noi rezolvă asta
- Librăria `jose` e disponibilă via next-auth — de verificat că exportă `SignJWT` / `jwtVerify` accesibile
- Pagina `/admin/scan` necesită cameră — pe desktop funcționează cu webcam, dar UX-ul e gândit pentru mobil/tabletă

---

## TODOs Frontend

- [ ] Instalează `qrcode.react` și `@zxing/browser`
- [ ] Creează `src/components/profil/qrCodeSection/QrCodeSection.tsx` — fetch token, display QR, countdown 5 min
- [ ] Creează `src/components/profil/qrCodeSection/QrCodeSection.module.scss`
- [ ] Adaugă `<QrCodeSection />` în `src/app/(protected)/profil/page.tsx` (ascuns dacă nu există abonamente PAID)
- [ ] Creează `src/app/admin/scan/page.tsx` — protejat ADMIN/TRAINER, importă `ScannerPage`
- [ ] Creează `src/components/admin/scanner/ScannerPage.tsx` — Client Component cu cameră și state management
- [ ] Creează `src/components/admin/scanner/MemberCard.tsx` — afișare date membru după scan
- [ ] Creează `src/components/admin/scanner/ActiveSubCard.tsx` — per abonament activ cu buton „Marchează intrare"
- [ ] Creează `src/components/admin/scanner/scanner.scss`
- [ ] Adaugă ruta `/admin/scan` în middleware/`auth.config.ts` protejată pentru ADMIN și TRAINER
- [ ] Countdown vizibil pe QR cu auto-refresh la 0

## TODOs Backend

### DB / Migrări
- [ ] Adaugă coloana `expires_at TIMESTAMPTZ` pe tabelul `OrderItem` în Prisma schema
- [ ] Adaugă coloana `total_entries INT` pe tabelul `OrderItem` în Prisma schema
- [ ] Creează modelul `CheckIn` în `prisma/schema.prisma`
- [ ] Rulează `prisma db push` pentru a aplica schema în Neon
- [ ] Adaugă indexuri pe `check_ins(order_item_id)`, `check_ins(user_id)`, `check_ins(scanned_at)`

### API Routes / Server Actions
- [ ] Creează `src/app/api/qr/token/route.ts` — `GET`: verifică sesiune, semnează JWT cu `jose` (exp 5 min), returnează token
- [ ] Creează `src/app/api/qr/verify/route.ts` — `POST { token }`: verifică semnătura JWT, returnează datele membrului + abonamentele active cu intrări rămase
- [ ] Creează `src/app/api/check-in/route.ts` — `POST { orderItemId }`: validează că abonamentul aparține tokenului, inserează `CheckIn`, returnează intrări rămase actualizate
- [ ] Actualizează `src/app/api/checkout/route.ts` — la creare `OrderItem`, populează `total_entries` (din `ICart.pass × quantity`) și `expires_at` (din `createdAt + durationMonths`)
- [ ] Adaugă `total_entries` și `expires_at` la tipul `ICart` în `src/types/subscription.ts`
