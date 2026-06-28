# Creare documentație pentru un Feature nou

Când este invocat acest command, urmează pașii de mai jos în ordine.

## Pasul 1 — Întreabă utilizatorul

Pune întrebări pentru a înțelege feature-ul. Folosește `AskUserQuestion` cu cel mult 4 întrebări per rundă. Acoperă:

- **Ce face feature-ul** — descriere scurtă, scopul principal
- **Cine îl folosește** — roluri (MEMBER, ADMIN, TRAINER, vizitator anonim)
- **Fluxuri principale** — ce acțiuni poate face utilizatorul, ce se întâmplă la fiecare pas
- **Stări și edge cases** — ce se întâmplă când ceva merge greșit (erori, loading, empty states)
- **Integrări** — depinde de alt feature? folosește un API extern? necesită autentificare?
- **Status** — e de la zero sau există ceva deja implementat?
- **Bază de date** — ce date trebuie persitate? ce entități/tabele sunt necesare? există relații între tabele? există câmpuri opționale sau cu valori default?
- **Funcționalități business** — reduceri, prețuri dinamice, stări (activ/inactiv/expirat), istoric, roluri cu acces diferit?

Pune follow-up questions dacă răspunsurile sunt vagi.

## Pasul 2 — Generează documentul

Creează fișierul în `docs/features/<nume-feature>.md` respectând **exact** structura de mai jos.

---

## Template obligatoriu

```markdown
# Feature: <Nume>

## PRD

**Scop:** O frază clară despre ce rezolvă acest feature pentru utilizator.

**Utilizatori:** Cine îl folosește și în ce context.

**Comportament așteptat:**
- Flux principal pas cu pas
- Toate stările vizibile (loading, eroare, succes, empty state)
- Edge cases importante

---

## Tech Specs

**Rute:** lista rutelor Next.js implicate

**Componente și rolul lor:**
- `NumeComponenta` — Server/Client Component; ce face, ce date primește, ce randează

**Date folosite:**
- De unde vin datele (\_core/, API extern, context)
- Interfețe TypeScript relevante

**State folosit:**
- Ce context sau useState e implicat și de ce

**Integrări externe:** (dacă există)
- Librărie/API, cum e folosit, ce variabile de mediu necesită

**Schema DB (Neon/PostgreSQL):**

> Completează această secțiune dacă feature-ul citește sau scrie date în baza de date. Dacă nu e nevoie de DB, scrie explicit `N/A`.

```sql
-- Tabel principal
CREATE TABLE <nume_tabel> (
  id          SERIAL PRIMARY KEY,
  -- câmpuri specifice feature-ului
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Relații (dacă există)
-- ALTER TABLE ... ADD CONSTRAINT ...

-- Indexuri recomandate
-- CREATE INDEX ON ...
```

**Date seed / valori default:**
- Ce date inițiale trebuie inserate (ex: categorii fixe, prețuri de start)?
- Câmpuri cu valori default (ex: `is_active = true`, `discount_pct = 0`)?

**Probleme actuale / decizii de luat:**
- Ce nu e implementat încă
- Ce e buggy sau incomplet
- Întrebări deschise despre implementare

---

## TODOs Frontend

- [ ] taskuri granulare, câte unul per componentă sau per comportament
- [ ] fiecare item să fie acționabil și verificabil

## TODOs Backend

### DB / Migrări
- [ ] Creare tabel `<nume>` în Neon cu schema de mai sus
- [ ] Adaugă indexuri pe coloanele folosite la filtrare/sortare
- [ ] Seed date inițiale (categorii, prețuri default, etc.)

### API Routes / Server Actions
- [ ] route handlers, server actions, integrări server-side
- [ ] variabile de mediu de adăugat în `.env` și `.env.example`
- [ ] dacă nu e nevoie de backend: `- [ ] Nu sunt necesare acțiuni backend`
```

---

## Reguli de respectat

- **PRD** — scris din perspectiva utilizatorului, fără detalii tehnice
- **Tech Specs** — detalii tehnice clare, cu nume reale de fișiere și componente din acest proiect
- **TODOs** — granulare, câte un singur lucru per item, nu vagi ("refactorizează componenta" → greșit, "înlocuiește `any` cu `ICart` în `SubscriptionCard.tsx`" → corect)
- **Probleme actuale** — onest despre ce lipsește sau e broken, nu omite
- Dacă feature-ul implică autentificare, menționează ce rol e necesar
- Dacă feature-ul are sub-fluxuri complexe (ex: reset parolă), documentează fiecare separat în PRD
- **Schema DB** — obligatorie dacă feature-ul citește/scrie în DB; include toate câmpurile, tipurile, relațiile și indexurile
- **TODOs Backend → DB / Migrări** — listează explicit fiecare tabel de creat, index de adăugat, și date seed necesare
- Proiectul folosește **Neon (PostgreSQL)** — SQL standard, fără Prisma schema sau ORM specific
