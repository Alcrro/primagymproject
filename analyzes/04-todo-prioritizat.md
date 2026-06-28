# PrimaGym — TODO Prioritizat

> Organizat pe 3 niveluri: **Blocker** (site-ul nu e lansabil fără), **Important** (reduce conversia), **Nice to have**

---

## BLOCKER — Fără astea nu lansezi

### Content
- [x] Înlocuiește Lorem ipsum în `AboutUs.tsx` cu text real despre PrimaGym
- [x] Completează categoriile `aerobic` și `cycling` în `src/app/_core/subscription.ts` cu planuri reale
- [ ] Adaugă minim 15 poze reale în galerie (actualizează `src/app/_core/gallery.ts` + `public/gallery/`)

### Funcționalitate critică
- [x] Email confirmare după plată Stripe (webhook → Resend) — `/api/webhooks/stripe` implementat
- [x] Logică activare abonament post-plată (legătură `Order` → `SubscriptionPlan` → status activ)
- [x] QR countdown timer — regenerare automată la expirare (5 min) — `TOKEN_TTL_SECONDS = 300`
- [x] Validare abonament activ la QR scan (`/api/qr/verify` verifică abonament activ)

### Technical
- [x] Șterge `export const dynamic = "force-dynamic"` de pe paginile statice (home, galerie, locatie)
- [x] Șterge toate `console.log`-urile din cod
- [x] Adaugă `.env.example` în repo cu toate variabilele necesare (fără valori reale)
- [ ] Fix build script în `package.json` pentru Linux/Mac (`NODE_ENV=production next build`) — actual: `set NODE_ENV=production` (Windows only)

---

## IMPORTANT — Cresc conversia și calitatea

### SEO & Discoverability
- [x] Adaugă `generateMetadata()` pe toate paginile: `/`, `/abonamente`, `/abonamente/[slug]`, `/galerie`, `/antrenori`, `/sesiuni`, `/cos`, `/locatii`
- [x] OG tags (`og:title`, `og:description`, `og:image`) pe home și pagini abonamente
- [x] `sitemap.ts` generat automat prin Next.js App Router (`src/app/sitemap.ts`)
- [x] `robots.ts` — `src/app/robots.ts` cu reguli și sitemap URL

### UX & Conversie
- [x] CTA vizibil pe hero: buton „Alege abonamentul tău" care duce la `/abonamente`
- [x] Badge „Cel mai ales" / „Recomandat" pe planul flagship — pe cardurile lunare
- [x] FAQ secțiune pe `/abonamente` (îngheț abonament, pauze, transfer)
- [ ] Mesaj vizibil când o sesiune e plină (capacitate maximă atinsă)
- [x] Testimoniale — 3 carduri pe home (`Testimoniale.tsx` + `_core/testimoniale.ts`)

### Admin Panel
- [x] Dashboard `/admin` cu statistici reale: membri totali, comenzi luna curentă, check-in-uri azi
- [ ] Management utilizatori — lipsesc blocare cont și dezactivare (există doar schimbare rol)
- [x] Management galerie (upload/ștergere/toggle poze) — `addGalleryPhotoAction`, `deleteGalleryPhotoAction`

### Profil Utilizator
- [ ] Upload foto profil (S3 sau similar) — `user.image` afișat, dar nu există UI de upload
- [x] Editare nume din profil — `EditNume` componentă cu `updateNameAction`
- [x] Afișare clară dacă abonamentul e activ/expirat cu dată expirare — `AbonamenteActive` cu `expiresAt`

### Antrenori
- [ ] Fotografii reale pentru toți antrenorii în `public/profileTrainers/`
- [ ] Certificări / specialități afișate pe pagina de detaliu
- [ ] Confirmare email la acceptare/respingere cerere antrenament personal

### Rezervări
- [x] Email confirmare la rezervare sesiune de grup
- [x] Email confirmare la anulare rezervare sesiune de grup
- [x] Filtrare sesiuni pe categorie pe `/sesiuni` (Toate / Zumba / Aerobic / Cycling / Fitness)
- [x] Email reminder cu 24h înainte de sesiune — `/api/cron/sesiuni-reminder`
- [x] Verificare abonament activ înainte de a permite rezervarea — `bookSessionAction` verifică `activeOrder`
- [ ] Calendar vizual pe `/sesiuni` (vedere pe săptămână) — `SesiuniCalendar` există dar grupează pe zile, nu săptămâni

---

## NICE TO HAVE — Diferențiatori pe termen lung

### Marketing
- [x] Secțiune „De ce PrimaGym?" pe home — `Benefits.tsx` cu 4 beneficii și iconițe
- [ ] Contador animat: „X membri activi", „Y clase pe săptămână"
- [ ] Rating Google Maps embed sau badge pe home
- [ ] Blog / articole fitness (pagini statice în MDX) pentru SEO organic

### Funcționalitate avansată
- [ ] Discount codes — UI în checkout incomplet (input există în `Cart.tsx` dar butonul „Aplică" fără handler)
- [ ] Refund flow pentru abonamente (admin poate iniția, Stripe API)
- [ ] Notificări push (web push API sau integrare Firebase)
- [ ] Waitlist pentru sesiuni pline
- [ ] Istoric check-in-uri vizibil în profilul utilizatorului

### Technical
- [ ] Migrare date antrenori din `_core/antrenori.ts` complet în DB (sursa de adevăr unică)
- [ ] Rate limiting pe API routes publice
- [ ] Error boundary per feature (nu doar 404/500 global)
- [ ] Lighthouse audit + performance optimizations (video hero pe mobile)
- [ ] Storybook sau similar pentru component library

---

## Estimare efort

| Categorie | Ore estimate |
|---|---|
| Blockers — content | 4-8h (depinde de copywriter) |
| Blockers — funcționalitate | 8-12h dev |
| Blockers — technical | 2-3h dev |
| Important — SEO | 3-4h dev |
| Important — UX/conversie | 6-10h dev + content |
| Important — Admin panel | 10-15h dev |
| Important — Email flows | 4-6h dev |
| Nice to have | 20-30h dev |

**Total blocker + important: ~38-58 ore de development + content**
