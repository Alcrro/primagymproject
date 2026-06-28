# Creare documentație pentru o componentă de Layout

Când este invocat acest command, urmează pașii de mai jos în ordine.

## Pasul 1 — Întreabă utilizatorul

Pune întrebări pentru a înțelege componenta de layout. Acoperă:

- **Ce face componenta** — prezentă pe toate paginile sau doar pe unele?
- **Comportament responsiv** — desktop vs mobile, breakpoint-uri
- **State global** — interacționează cu contexte? cu alte componente?
- **Subcomponente** — ce părți are (ex: navbar are logo, menu, hamburger, dropdown)
- **Status actual** — există deja sau e de creat?
- **Bază de date** — componenta afișează date dinamice din DB (ex: meniu configurabil, link-uri sociale, ore program)? sau datele sunt statice în `_core/`?

## Pasul 2 — Generează documentul

Creează fișierul în `docs/layout/<nume>.md` respectând **exact** structura de mai jos.

---

## Template obligatoriu

```markdown
# Layout: <Nume>

## PRD

**Scop:** Ce rol joacă în interfață, pe ce pagini apare.

**Comportament așteptat:**
- Comportament desktop
- Comportament mobile / responsiv
- Interacțiuni (hover, click, animații)
- Edge cases (coș gol, utilizator nelogat etc.)

---

## Tech Specs

**Componentă root:** `src/components/<path>/Componenta.tsx` — Server/Client Component

**Arbore componente:**
- `Componenta` — rol, ce date primește
- `Subcomponenta` — rol, ce face

**State folosit:**
- Ce context expune și ce câmpuri folosește

**Date folosite:**
- Sursa datelor (\_core/, context, props)

**Schema DB (Neon/PostgreSQL):**

> Completează dacă componenta citește date din DB. Dacă datele sunt statice în `_core/`, scrie `N/A`.

```sql
-- ex: meniu dinamic, program ore, link-uri sociale
```

**Date seed / valori default:**
- Ce date inițiale trebuie inserate?

**Probleme actuale:**
- Bugs, missing types, memory leaks, missing cleanup

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

- Componente de layout = prezente pe mai multe pagini (Navbar, Footer, ThemeSwitch, Sidebar)
- Nu pune în layout/ componente care apar pe o singură pagină — acelea merg în features/ sau pages/
- TODOs granulare, cu fișiere și nume reale
- **Schema DB** — obligatorie dacă componenta citește din DB; `N/A` explicit dacă datele sunt statice
- Proiectul folosește **Neon (PostgreSQL)** — SQL standard, fără Prisma schema sau ORM specific
