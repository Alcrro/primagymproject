# PrimaGym — Analiză Funcționalitate

---

## 1. Autentificare & Conturi — 7.5 / 10

### Ce există
- Login cu email/parolă (bcrypt), Google, Facebook, TikTok
- Înregistrare cu validare
- Reset parolă via email (Resend + token temporar în DB)
- Schimbare parolă din profil
- Middleware cu protecție route-uri (`/profil`, `/rezervari`, `/admin`, `/trainer`)
- Roluri: `MEMBER` / `TRAINER` / `ADMIN`

### Lipsește / Broken
- [x] Nu există validare client-side pe formulare — adăugat în RegisterForm și LoginForm (onBlur per câmp, SubmitButton disabled)
- [x] Nu există pagină de confirmare email la înregistrare — `/verificare-email/[token]` implementat, email via Resend la înregistrare
- [x] OAuth callback error handling nu e vizibil în UI — eroarea din `?error=` searchParam afișată pe login page
- [ ] Avatar upload din profil — câmpul `image` există în DB dar UI-ul nu permite upload

---

## 2. Abonamente & Coș — 8.5 / 10

### Ce există
- 34 planuri în DB (`SubscriptionPlan`) pentru toate 4 categorii: zumba, aerobic, cycling, fitness
- Cart cu context + localStorage persistence
- Adaugă / șterge / modifică cantitate
- Stripe Checkout integration
- Webhook Stripe → `PAID` + recalculare `expiresAt` de la momentul plății + email confirmare
- Email confirmare plată (HTML branded, cu lista produselor și data expirare)
- Pagină succes după plată
- Order history în profil funcțional (toate comenzile cu status + items)
- `AbonamenteActive` filtrează corect după `expiresAt` și statusul `PAID`

### Lipsește / Broken
- [x] `aerobic` și `cycling` — paginile goale (DB avea planuri, pagina citea din DB — OK)
- [x] Nu există confirmare email după plată reușită
- [x] Order history — funcțional, datele vin corect din DB
- [x] Abonamentele plătite — `expiresAt` recalculat de la momentul plății în webhook
- [ ] Nu există refund flow (necesită Stripe Refunds API + logică complexă)

---

## 3. Rezervări Sesiuni — 7.5 / 10

### Ce există
- `ClassSession` în DB cu `max_capacity`, `status`, trainer asociat
- `SessionBooking` cu status `CONFIRMED` / `CANCELLED`
- `BookingButton` client component pe pagina sesiunii
- Server actions pentru creare/anulare rezervare
- Pagina `/rezervari` pentru user cu lista rezervărilor
- Trainer dashboard `/trainer/sesiuni` pentru management sesiuni
- `PersonalRequest` — cereri antrenament personal (PENDING/ACCEPTED/REJECTED)
- Validare abonament activ în `bookSessionAction` (verifică `OrderItem` cu status PAID + expiresAt)
- Badge "Complet" în `SessionCard` și buton dezactivat în `BookingButton` când capacitatea e atinsă
- Filtrare sesiuni pe categorie pe `/sesiuni` (Toate / Zumba / Aerobic / Cycling / Fitness)

### Lipsește / Broken
- [x] Nu există notificare email la confirmare/anulare rezervare
- [x] Nu se verifică dacă user-ul are abonament activ înainte de rezervare
- [x] Capacitate maximă — logica de blocare când e full nu e clară în UI
- [x] `/sesiuni` listează sesiunile dar filtrare/search lipsește
- [x] Nu există calendar vizual pentru sesiuni disponibile — view toggle Grid/Calendar pe `/sesiuni`, calendar grupează sesiunile pe zi
- [x] Email reminder cu 24h înainte de sesiune — `/api/cron/sesiuni-reminder` + `vercel.json` cron la 08:00 UTC zilnic

---

## 4. Profil Utilizator — 8 / 10

### Ce există
- Header cu nume, email, avatar (din OAuth sau placeholder)
- `EditNume` — editare inline a numelui direct din profil (fără re-login)
- `AbonamenteActive` — filtrare reală pe `expiresAt`, afișare dată expirare
- `IstoricAchizitii` — istoricul comenzilor cu status
- `QrCodeSection` — QR code cu countdown timer și auto-refresh la expirare
- `SchimbareParola` — formular schimbare parolă

### Lipsește / Broken
- [ ] Upload foto profil custom (necesită S3 sau storage extern)
- [x] QR countdown timer — implementat complet
- [x] Nu există posibilitate de editare nume din profil
- [x] „Abonamente active" nu filtrau după `expiresAt` real
- [ ] Editare email din profil (risc de securitate — necesită re-verificare)

---

## 5. QR Check-in — 7 / 10

### Ce există
- QR generat cu JWT (TTL 5 minute) via `/api/qr/token`
- `qrcode.react` pentru display
- Scanner cu cameră (`@zxing/browser`) la `/admin/scan`
- `/api/qr/verify` → creare `CheckIn` în DB
- `/admin/check-ins` pentru istoricul scanărilor

### Lipsește / Broken
- [x] QR-ul nu se regenerează automat la expirare — countdown + auto-refresh la 0 implementat în `QrCodeSection`
- [x] Scanner nu afișează info utilizator după scan reușit — `MemberCard` cu avatar, nume, email și abonamente active
- [x] Nu verifică dacă utilizatorul are abonament activ valid la momentul scanului — verify route filtrează, check-in route validează; profil ascunde QR dacă nu există sub activ; success state verde pe `ActiveSubCard`; scanner auto-pornește camera

---

## 6. Galerie — 6 / 10

### Ce există
- Grid responsive cu poze din DB (`GalleryPhoto` table)
- Modal overlay cu intercepting routes (funcționalitate avansată Next.js)
- Full-page view la `/galerie/[id]` — pagină completă cu back link
- Dark mode SCSS corect cu CSS variables + `:global(.dark)`
- Pagina **nu e în navbar** — vizibilă doar prin link direct

### Lipsește / Broken
- [x] Stub `/galerie/[id]` care afișa doar `{id}` — înlocuit cu pagină reală
- [x] Dark mode hardcodat cu `html.dark`/`html.light` — corectat
- [x] `_core/gallery.ts` dead code — șters
- [ ] Poze reale în DB — necesită upload din admin (0 poze în DB momentan)
- [ ] Lazy loading / blur placeholder pe imagini
- [ ] Categorii în galerie (sala, echipamente, clase, echipă)

---

## 7. Admin Panel — 7.5 / 10

### Ce există
- `/admin` — dashboard cu statistici reale: membri totali, comenzi luna curentă, check-in-uri azi, sesiuni viitoare
- `/admin/antrenori` — management antrenori (formular add/edit/delete/toggle)
- `/admin/utilizatori` — lista utilizatori cu search + filtrare rol + schimbare rol instant
- `/admin/galerie` — management galerie: add (URL), toggle vizibilitate, delete
- `/admin/scan` — scanner QR
- `/admin/check-ins` — istoric check-in-uri
- `AdminNav` — navigare persistentă pe toate paginile admin (sticky top)

### Lipsește / Broken
- [x] Dashboard-ul principal nu afișează statistici reale
- [x] Nu există management utilizatori
- [x] Nu există management galerie
- [x] Management sesiuni de grup — `/admin/sesiuni` cu filtru categorie/status, formular add/edit
- [x] Management locații — `/admin/locatii` cu toate câmpurile (schedule JSON, amenities, coordonate)
- [x] Management abonamente/prețuri — `/admin/abonamente` cu editare preț inline și toggle activ
- [x] Discount codes — `/admin/discounturi` cu CRUD complet (tip pct/ron, validitate, max utilizări)

---

## 8. Antrenori — 9 / 10

### Ce există
- Lista antrenori per locație (`/antrenori/[location]`)
- Pagina de detaliu antrenor (`/antrenori/[location]/[id]`)
- `PersonalRequestForm` — cerere antrenament personal
- Admin poate adăuga/edita antrenori
- Specializări și certificări (câmpuri DB + afișare pe pagina de detalii + editare în admin)
- Review-uri cu rating stele (1-5): formular, afișare, medie calculată în header
- Placeholder cu inițiala numelui (portocaliu) când nu există fotografie
- Source of truth unic: DB (Prisma) — `_core/antrenori.ts` șters

### Lipsește / Broken
- [x] Datele antrenorilor sunt parțial hardcodate în `_core/antrenori.ts` — șters, DB e sursa unică
- [x] Fotografii antrenori lipsesc — placeholder cu inițiala + culoare brand adăugat
- [x] Specializări / certificări nu sunt afișate
- [x] Nu există reviews/rating pentru antrenori
- [ ] Fotografii reale pentru antrenori (necesită upload din admin — conținut, nu cod)

---

## 9. Locații — 7.5 / 10

### Ce există
- Multiple locații cu slug unic
- Hartă Google Maps pe fiecare locație
- Program orar, facilități, contact
- JSON-LD structured data (SEO bun)
- `/locatii` grid cu toate locațiile
- `/locatie` redirect la `/locatii`

### Lipsește / Broken
- [x] Google Maps API key trebuie configurat în `.env.local` — fallback automat pe OpenStreetMap iframe (fără API key) când `NEXT_PUBLIC_MAPS_API_KEY` lipsește; Google Maps JS API rămâne disponibil când cheia e setată
- [x] Nu există transportul în comun / parcare info — secțiune „Cum ajungi" cu 3 butoane Google Maps (Cu mașina / Transport în comun / Pe jos); info parcare extrasă din amenities
- [ ] Fotografii locații lipsesc — problemă de conținut, nu de cod; placeholder îmbunătățit (gradient portocaliu + inițiala orașului)

---

## 10. Home Page — 10 / 10

### Ce există
- Hero cu video background
- Tagline în română: „Fii activ. Fii sănătos. Fii PrimaGym."
- CTA button „Alege abonamentul tău →" above the fold → `/abonamente`
- Schedule afișat (ore clase) cu indicator „Acum" live
- Secțiune „De ce PrimaGym?" cu 4 beneficii cu iconițe
- Shorts cu 4 categorii (Cycling, Zumba, Aerobic, Fitness) + modal cu progress bar
- Testimoniale reale de la 3 membri
- AboutV2 — 3 carduri cu povestea/misiunea/comunitatea (text real, no lorem ipsum)
- Componente vechi nefolosite șterse (AboutUs, Shorts, ShortModal, ShortBody, Schedule)

### Lipsește / Broken
- [x] **Lorem ipsum** în AboutUs — critic (AboutV2 are text real; AboutUs șters)
- [x] Shorts — nu există conținut real (4 categorii adăugate)
- [x] Nu există secțiune „De ce PrimaGym?" cu beneficii
- [x] Nu există testimoniale vizibile pe home
- [x] Nu există CTA clar spre abonamente vizibil above the fold
- [x] `export const dynamic = "force-dynamic"` pe pagină statică

---

## Fluxuri complete end-to-end

| Flow | Status |
|---|---|
| Înregistrare → Login | ✅ Complet |
| Browse abonamente → Adaugă în coș → Checkout Stripe → Confirmare | ⚠️ Parțial (lipsesc email + activare) |
| Rezervare sesiune grup | ⚠️ Parțial (lipsesc notificări + validare abonament) |
| Cerere antrenament personal | ⚠️ Parțial (acceptare/respingere funcțională, lipsesc notificări) |
| QR check-in la sală | ⚠️ Parțial (lipsesc regenerare automată + validare abonament) |
| Reset parolă | ✅ Complet |
| Profil — vizualizare | ✅ Complet |
| Admin — management antrenori | ✅ Complet |
| Admin — dashboard statistici | ✅ Complet |
