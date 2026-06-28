# Layout: Dark Mode

## PRD

**Scop:** Comutare între tema light și dark, cu persistarea preferinței utilizatorului.

**Comportament așteptat:**
- Buton de switch vizibil pe toate paginile
- Schimbarea temei se aplică instant, fără reload
- Preferința se salvează în `localStorage` și se respectă la revenire pe site
- Dacă nu există preferință salvată → se folosește preferința sistemului de operare

---

## Tech Specs

**Librărie:** `next-themes` — `ThemeProvider` cu `attribute="class"` și `enableSystem: true`

**Arbore componente:**
- `DarkThemeProviders` — wrapper peste `ThemeProvider`; setat cu `attribute="class"` și `defaultTheme="system"`
- `ThemeSwitch` — Client Component; folosește `useTheme()` din `next-themes` pentru a citi și schimba tema

**Cum funcționează în CSS:**
- `next-themes` adaugă/elimină clasa `dark` pe `<html>` la schimbarea temei
- Tailwind: prefix `dark:` pe clase inline (ex: `dark:bg-black`)
- SCSS: selector `:global(.dark) .clasa { ... }`

**`suppressHydrationWarning` pe `<html>`:**
- Necesar deoarece `next-themes` modifică atributul `class` pe client după hydration SSR
- Fără el apar warning-uri de hydration mismatch în consolă

**Probleme actuale:**
- Nu toate componentele `.scss` au stiluri pentru dark mode definite
- Convenția nu e respectată consistent

---

## TODOs Frontend

- [ ] Verifică `ThemeSwitch.tsx` — iconița să reflecte tema activă (soare pentru light, lună pentru dark)
- [ ] Adaugă `aria-label` pe butonul de switch
- [ ] Auditează toate fișierele `.scss` și adaugă `:global(.dark)` unde lipsesc stiluri dark
- [ ] Aplică convenția consistent: `dark:` Tailwind pentru clase inline, `:global(.dark)` în SCSS

## TODOs Backend

- [ ] Nu sunt necesare acțiuni — dark mode e gestionat exclusiv client-side via `localStorage`
