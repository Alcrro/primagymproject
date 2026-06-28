# Creare documentație pentru o Pagină

Când este invocat acest command, urmează pașii de mai jos în ordine.

## Pasul 1 — Întreabă utilizatorul

Pune întrebări pentru a înțelege pagina. Acoperă:

- **Ce prezintă pagina** — conținut, secțiuni principale
- **Publicul țintă** — vizitator nou, membru, toți
- **Secțiuni** — câte secțiuni are, ce conține fiecare
- **Date dinamice vs statice** — conținutul se schimbă des sau e fix?
- **Status** — implementată complet, parțial sau e de creat?
- **Bază de date** — conținutul vine din DB (ex: text hero editabil, articole, testimoniale) sau e hardcodat în `_core/`?

## Pasul 2 — Generează documentul

Creează fișierul în `docs/pages/<nume>.md` respectând **exact** structura de mai jos.

---

## Template obligatoriu

```markdown
# Page: <Nume>

## PRD

**Scop:** Ce comunică această pagină vizitatorului.

**Utilizatori:** Cine ajunge pe această pagină și de ce.

**Comportament așteptat:**
- Secțiunile paginii în ordine
- Comportament interactiv (dacă există)
- Edge cases (conținut lipsă, loading etc.)

---

## Tech Specs

**Rută:** `/ruta` → `src/app/ruta/page.tsx`

**Componente și rolul lor:**
- `NumeComponenta` — Server/Client; ce afișează

**Date folosite:**
- Sursa datelor (\_core/, API, CMS)

**State folosit:**
- Dacă există interactivitate

**Schema DB (Neon/PostgreSQL):**

> Completează dacă pagina citește sau scrie date în DB (ex: formular contact, conținut CMS). Dacă conținutul e static, scrie `N/A`.

```sql
-- ex: tabel pentru submissions formular, conținut editabil din admin
```

**Date seed / valori default:**
- Ce date inițiale trebuie inserate?

**Probleme actuale:**
- Ce lipsește sau e placeholder

---

## TODOs Frontend

- [ ] taskuri granulare

## TODOs Backend

### DB / Migrări
- [ ] Creare tabel `<nume>` în Neon cu schema de mai sus
- [ ] Seed date inițiale
- [ ] sau `- [ ] Nu sunt necesare acțiuni backend`

### API Routes / Server Actions
- [ ] route handlers de eliminat/creat
```

---

## Reguli de respectat

- Pagini = rute cu conținut specific, nu funcționalitate activă (ex: Home, Despre noi, Contact)
- Dacă pagina are funcționalitate activă complexă (coș, galerie cu modal) → folosește `/creareDocsFeature`
- TODOs granulare, cu fișiere și nume reale
- **Schema DB** — obligatorie dacă pagina citește/scrie în DB; `N/A` explicit dacă conținutul e static
- Proiectul folosește **Neon (PostgreSQL)** — SQL standard, fără Prisma schema sau ORM specific
