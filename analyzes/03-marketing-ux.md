# PrimaGym — Analiză Marketing & UX

---

## Scor Marketing: 4.5 / 10

Infrastructura vizuală există (dark mode, design tokens, tipografie), dar conținutul care vinde lipsește aproape complet.

---

## 1. Prima impresie (Home Page) — 5 / 10

### Bun
- Video background în hero — impact vizual imediat
- Dark mode cu toggle — modern, diferențiator față de competitori
- Structură clară: hero → schedule → about → shorts

### Problematic
- **Lorem ipsum în AboutUs** — oricine intră vede că site-ul nu e finalizat. Credibilitate zero.
- **Nu există un headline clar** cu propunerea de valoare. „Ce câștig dacă mă înscriu la PrimaGym?" nu are răspuns pe home.
- **Niciun CTA vizibil above the fold** spre abonamente. Utilizatorul trebuie să deruleze sau să găsească meniul.
- **Shorts placeholder** — secțiunea de video-uri scurte arată gol dacă nu există conținut real.
- **Schedule-ul** afișat fără context vizual (ce înseamnă fiecare clasă?) poate confuza un utilizator nou.

### Recomandări
- [ ] Headline pe hero: „Transformă-te. Fii mai puternic. Începe azi." + buton `Alege abonament`
- [ ] Înlocuiește Lorem ipsum cu 3-4 fraze reale despre sală, valori, comunitate
- [ ] Adaugă o secțiune „De ce PrimaGym?" cu 3-4 iconițe + beneficii (echipamente moderne, antrenori certificați, etc.)
- [ ] Testimoniale reale de la clienți — cel puțin 3 pe home

---

## 2. Social Proof — 1 / 10

### Starea actuală
- Zero recenzii / testimoniale pe orice pagină
- Zero rating vizibil
- Antrenorii listați dar fără biografie completă sau certificări vizibile
- Galerie cu 4 poze — nu transmite energie sau activitate reală

### Impact
Utilizatorul nou nu are niciun motiv să aibă încredere că sala e bună. Un competitor cu 10 recenzii pe site va câștiga conversia.

### Recomandări
- [ ] Secțiune testimoniale pe home (3-5 carduri cu foto, nume, ce s-a schimbat)
- [ ] Rating Google Maps embed sau badge cu număr de recenzii
- [ ] Galerie cu minim 20-30 poze: sala plină, echipamente, clase în desfășurare, competiții
- [ ] Biografie completă antrenori: certificări, ani experiență, specialitate
- [ ] Contador „X membri activi", „Y clase pe săptămână" — social proof numeric

---

## 3. Abonamente & Conversie — 5.5 / 10

### Bun
- Structura pe categorii (zumba, fitness, etc.) e intuitivă
- Carduri cu preț clar, tip acces (intrări vs. luni)
- Coș persistent (localStorage)
- Carousel pe mobile

### Problematic
- **Aerobic și Cycling** au categorii dar paginile sunt goale — utilizatorul care apasă se lovește de un blank screen
- **Nu există comparație** între planuri (tabel comparativ ar ajuta decizia)
- **Nu există „cel mai popular"** sau badge de recomandat pe niciun plan
- **Nu există urgență**: fără promo temporare, fără „X locuri rămase", fără countdown
- **Prețul nu e contextualizat**: „e scump sau ieftin?" — fără comparație sau justificare valorii

### Recomandări
- [ ] Badge „Cel mai ales" pe planul cu cele mai multe vânzări
- [ ] Completat categoriile aerobic și cycling cu planuri reale
- [ ] Tabel comparativ simplificat pentru fitness (cu/fără antrenor, durate)
- [ ] Secțiune FAQ sub abonamente: „Ce se întâmplă dacă ratez antrenamente?", „Pot îngheța abonamentul?"

---

## 4. SEO — 4.5 / 10

### Bun
- JSON-LD structured data pe pagini locații (`LocalBusiness` schema)
- URL-uri curate cu sluguri semantic
- Next.js Image optimization

### Lipsă
- [ ] `<title>` și `<meta description>` lips pe: home, `/abonamente`, `/abonamente/[slug]`, `/galerie`, `/antrenori`, `/sesiuni`, `/cos`
- [ ] Nu există `sitemap.xml` generat
- [ ] Nu există `robots.txt` configurat
- [ ] Nu există OG tags (Open Graph) pentru share pe social media — link-ul la share arată gol
- [ ] Blog / conținut SEO lipsă complet (articole despre fitness ar aduce trafic organic)
- [ ] Alt text pe imaginile din galerie e minimal

### Impact imediat
- Google nu indexează corect paginile de abonamente (cel mai important pentru conversie)
- Share pe Facebook/WhatsApp al site-ului arată fără preview (no OG tags)

### Recomandări prioritare
- [ ] Adaugă metadata în `layout.tsx` per route cu `generateMetadata()`
- [ ] `next-sitemap` package pentru sitemap automat
- [ ] OG image per categorie abonament

---

## 5. Mobile UX — 6.5 / 10

### Bun
- Carousel pe mobil pentru abonamente
- Navbar mobile cu hamburger menu
- Dark mode funcțional pe toate dimensiunile

### Problematic
- [ ] Video background pe hero — consumă date pe mobile, nu există fallback image
- [ ] Shorts modal pe mobile — nu am validat că funcționează corect
- [ ] Footer pe mobile — 4 coloane pot fi comprimate inestetic pe ecrane mici
- [ ] Butoanele de CTA (adaugă în coș) — mărimea touch target neverificată

---

## 6. Brand & Identitate Vizuală — 5.5 / 10

### Bun
- Design tokens bine definiți (`--color-primary: #FF5C00` — orange energic potrivit pentru gym)
- Dark mode consistent via CSS variables
- Roboto 400 — readable, modern
- Structura de culori light/dark coherentă

### Problematic
- [ ] Logo-ul nu e vizibil/evaluat în analiză — cât de memorabil e?
- [ ] Nu există iconografie consistentă (bootstrap-icons folosit, dar inconsistent)
- [ ] Fotografii reale ale sălii lipsesc — totul pare demo/template
- [ ] Nu există o voce de brand definită în texte (tonul e neutru, nu motivant)

---

## 7. Competitor Gap Analysis

Ce au concurenții din România și PrimaGym nu are încă:

| Feature | World Class | Superfit | PrimaGym |
|---|---|---|---|
| Testimoniale vizibile | ✅ | ✅ | ❌ |
| Galerie cu 30+ poze | ✅ | ✅ | ❌ (4 poze) |
| Blog / articole fitness | ✅ | ✅ | ❌ |
| Trial / ofertă de intrare | ✅ | ✅ | ❌ |
| App mobilă / notificări | ✅ | ⚠️ | ❌ |
| Rezervare online clase | ✅ | ✅ | ⚠️ (parțial) |
| Checkout online | ✅ | ✅ | ✅ (Stripe) |
| Dark mode | ❌ | ❌ | ✅ |
| Multi-locație | ✅ | ✅ | ✅ |

---

## Priorități Marketing (ordine impact)

1. **Lorem ipsum → text real** (30 minute, impact maxim pe credibilitate)
2. **Metadate SEO pe toate paginile** (1-2 ore, impact pe indexare Google)
3. **OG tags** pentru social share (30 minute)
4. **Testimoniale** — minim 3 pe home (content, nu development)
5. **Galerie** — minim 20 poze reale (content, nu development)
6. **CTA clar pe hero** spre abonamente
7. **Badge „Cel mai ales"** pe planul flagship
8. **FAQ pe pagina abonamente**
9. **Sitemap + robots.txt**
10. **Ofertă de intrare** (ex: „Prima lună 50 RON") pentru conversie nouă
