# Page: Home

## PRD

**Scop:** Pagina de prezentare a sălii. Primul contact al vizitatorului cu PrimaGym.

**Utilizatori:** Vizitatori noi și membri existenți.

**Comportament așteptat:**
- Video de fundal rulează automat, fără sunet, în buclă
- Orarul afișează clasele zilei curente și marchează vizual dacă sala e deschisă sau închisă
- Secțiunea „Despre noi" prezintă 3 blocuri: Povestea noastră, Misiunea noastră, Comunitatea PrimaGym
- Click pe un Short → deschide modal overlay cu preview-ul; modal se poate închide

---

## Tech Specs

**Rută:** `/` → `src/app/page.tsx`

**Componente și rolul lor:**
- `TitleHome` — logo + titlu hero suprapus pe video
- `BackgroundVideo` — `<video autoPlay muted loop>`, fișier din `public/videos/backgroundVideo.webm`
- `Schedule` — Server Component; citește `schedules[]` din `_core/schedule.ts`, calculează ziua curentă și afișează status deschis/închis
- `AboutUs` — Server Component; 3 instanțe de `AboutModel` cu titlu + descriere
- `Shorts` + `ShortModal` — Client Components; `activeModal` din `ContextAPI` controlează dacă modalul e deschis
- `MultipleSections` — compozitor care grupează Schedule, Shorts, ShortModal, AboutUs

**State folosit:**
- `activeModal` / `setActiveModal` din `ContextAPI` — toggle modal short

**Probleme actuale:**
- Textele din `AboutUs` sunt Lorem Ipsum
- Logica de calcul zi (weekday/weekend) e inline în `Schedule.tsx`, nu separată
- Progress bar din `ShortModal` e comentat și nefuncțional
- `export const dynamic = "force-dynamic"` pe pagină deși datele sunt statice
- `console.log(activeModal)` rămas în `ShortBody.tsx`

---

## TODOs Frontend

- [ ] Înlocuiește textele Lorem Ipsum din `AboutUs.tsx` cu conținut real
- [ ] Extrage logica de calcul zi din `Schedule.tsx` în `_lib/home/GetDate.tsx` (fișierul există dar e gol)
- [ ] Finalizează progress bar-ul din `ShortModal` (codul e comentat)
- [ ] Șterge `console.log(activeModal)` din `ShortBody.tsx`
- [ ] Elimină `export const dynamic = "force-dynamic"` din `page.tsx`
- [ ] Tipizează `schedule` și `values` în `Schedule.tsx` — acum sunt `any`
- [ ] Tipizează `setActiveModal` în `ShortBody` — acum e `any`

## TODOs Backend

- [ ] Elimină `src/app/api/schedule/route.ts` — importă direct din `_core/schedule.ts` în `Schedule.tsx`
- [ ] Elimină `src/app/_lib/home/getSchedule.tsx` după înlocuire
