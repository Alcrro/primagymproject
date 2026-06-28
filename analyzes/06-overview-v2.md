# ApexFit — Analiză Generală v2

> Dată analiză: 28 iunie 2026
> Stack: Next.js 14 · TypeScript · Neon (PostgreSQL) · Prisma · Stripe · Auth.js v5 · SCSS + Tailwind
> Față de: `01-overview.md` (27 iunie 2026)

---

## Scor Global

| Categorie | v1 (27 iun) | v2 (28 iun) | Delta | Comentariu |
|---|---|---|---|---|
| **Funcționalitate** | 6.0 | 6.5 | ▲ +0.5 | Link navbar fix, carduri antrenori unificate |
| **Marketing / UX** | 4.5 | 5.5 | ▲ +1.0 | Rebrand complet, imagini noi carduri, logo SVG |
| **Calitate cod** | 7.0 | 8.5 | ▲ +1.5 | Zero `any`, zero `force-dynamic`, zero self-fetch, build fix |
| **SEO / Vizibilitate** | 5.0 | 5.5 | ▲ +0.5 | Metadata actualizată cu noul brand pe toate paginile |
| **Mobile** | 6.5 | 6.5 | — | Nicio modificare |

**Scor final: 6.5 / 10** (v1: 5.8 / 10 — +0.7)

---

## Ce s-a rezolvat între v1 și v2

### Brand & Identitate
- ✅ **Rebranding complet PrimaGym → ApexFit** — toate aparițiile din: metadata, emailuri tranzacționale (confirmare cont, reset parolă, confirmare plată, reminder sesiune), texte UI, copyright footer
- ✅ **Logo înlocuit** — SVG inline `ApexFitLogo.tsx` (triunghi portocaliu + APEX/FITNESS), fără dependență de imagine PNG, se adaptează automat la dark/light mode via `currentColor`
- ✅ **Imagini carduri categorii** — 4 poze noi de pe Unsplash (licență liberă), fără fețe: sală goală echipamente (fitness), biciclete Keiser (cycling), covoraș roz cu gantere (zumba), siluetă la apus (aerobic)
- ✅ **Social media handles** actualizate: `facebook.com/apexfit`, `instagram.com/apexfit`, `tiktok.com/@apexfit`

### Funcționalitate
- ✅ **Navbar Abonamente** — era `<span>` fără link, acum `<Link href="/abonamente">` — utilizatorul poate naviga la pagina de abonamente cu click direct
- ✅ **Carduri antrenori unificate** — `TrainerCard` (folosit pe `/abonamente/[slug]`) și `TrainerListCard` (folosit pe `/antrenori`) aveau layout și stiluri diferite; acum folosesc aceleași clase CSS (`tl-*`) și același layout: foto → descriere → vârstă → badge-uri → rating stele
- ✅ **Query Trainers** actualizat să includă `reviews` și `classes` pentru paritate cu pagina `/antrenori`

### Calitate cod
- ✅ **Zero `any` types** — 0 fișiere cu `: any` sau `as any` (față de câteva în v1)
- ✅ **Zero `force-dynamic`** — șters complet (nu mai dezactivează ISR inutil)
- ✅ **Zero self-referential fetch** — Server Components nu mai fac `fetch('/api/...')` intern
- ✅ **Build script fix** — `"build": "next build"` fără sintaxă Windows `set NODE_ENV=`
- ✅ **`console.log` aproape eliminat** — rămâne doar în `_scripts/seed_orders.ts` (script de seed, nu cod de producție)
- ✅ **Import `Image` restaurat** în `NavbarV2Client.tsx` (lipsea după refactorul logo-ului)
- ⚠️ **4 importuri relative** rămase în `abonamente/[slug]/page.tsx` — toate pentru imagini statice din `public/` (pattern acceptat de Next.js pentru `StaticImageData`)

---

## Probleme rămase din v1

### Critice (blochează lansarea)
- [ ] **Imagini reale în galerie** — 0 poze în DB momentan; Admin galerie există, conținut lipsă
- [ ] **Fotografii locații** — placeholder portocaliu afișat în loc de poze reale ale sălii
- [ ] **Fotografii antrenori** — placeholder cu inițiala pentru toți (upload din admin necesar)
- [ ] **Video embed Thumbnail** — URL-ul din `Thumbnail.tsx` pointează la pagina Facebook veche PrimaGym — trebuie înlocuit cu conținut ApexFit

### Importante (UX & marketing)
- [ ] **Social media ApexFit nu există** — link-urile din footer duc la pagini inexistente; până la crearea conturilor, dezactivează sau ascunde iconițele
- [ ] **Logo placeholder** — SVG-ul curent e funcțional dar e un placeholder; necesită logo real ApexFit când e disponibil
- [ ] **Testimoniale** — zero social proof pe home și pe pagina abonamente (componenta există, datele lipsesc)
- [ ] **Galerie** — minim 15-20 poze reale pentru credibilitate

### Tehnice (datorii mici)
- [ ] **4 importuri relative** în `abonamente/[slug]/page.tsx` — pot fi lăsate (pattern Next.js acceptat) sau mutate la `@/` cu config path alias pentru `public/`
- [ ] **`TrainerCard.scss`** — fișier orfan, nu mai e importat nicăieri după unificare; poate fi șters
- [ ] **`apexFitLogoOriginal.png`** și **`primaGymBacground...`**, **`primaGymLogoOriginal...`** — fișiere PNG vechi în `public/cardsImages/` care nu mai sunt referențiate; pot fi șterse

---

## Probleme noi introduse în v2

> Niciuna semnificativă. Schimbările au fost conservatoare și verificate (`tsc --noEmit` → 0 erori).

---

## Priorități actualizate

### Blocanți lansare (conținut — nu cod)
1. Creare conturi social media ApexFit (Facebook, Instagram, TikTok) sau ascundere temporară link-uri
2. Adăugare poze reale în galerie din Admin (`/admin/galerie`)
3. Adăugare fotografii antrenori din Admin (`/admin/antrenori`)
4. Înlocuire video embed din `Thumbnail.tsx` cu conținut ApexFit
5. Creare logo real ApexFit și înlocuire SVG placeholder

### Următoarele taskuri de cod (impact bun, efort mic)
6. ~~Șterge `TrainerCard.scss` (orfan după unificare)~~ ✅
7. ~~Curăță PNG-urile vechi PrimaGym din `public/cardsImages/`~~ ✅
8. Rezolvă cele 4 importuri relative (opțional — nu e urgent)
9. Upload foto profil din admin antrenori (câmpul `thumbnail` există în DB, UI de upload lipsește)

---

## Starea fluxurilor end-to-end (actualizată)

| Flow | v1 | v2 | Observație |
|---|---|---|---|
| Înregistrare → Login | ✅ | ✅ | Neschimbat |
| Browse abonamente → Coș → Stripe | ⚠️ | ⚠️ | Link navbar fix; checkout intact |
| Rezervare sesiune grup | ⚠️ | ⚠️ | Neschimbat |
| QR check-in | ⚠️ | ⚠️ | Neschimbat |
| Reset parolă | ✅ | ✅ | Email rebranded ApexFit |
| Admin — antrenori | ✅ | ✅ | Neschimbat |
| Carduri antrenori consistente pe toate paginile | ❌ | ✅ | Rezolvat în v2 |
| Navbar — toate link-urile funcționale | ❌ | ✅ | Abonamente fix în v2 |
