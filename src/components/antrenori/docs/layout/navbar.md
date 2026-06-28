# Layout: Navbar

## PRD

**Scop:** Navigare principală persistentă pe toate paginile. Conține logo, linkuri de navigare, coș și starea de autentificare a utilizatorului.

**Comportament așteptat:**

**Desktop (>690px):**
- Logo stânga, meniu centru/dreapta, auth (login/user) dreapta
- Hover pe „Abonamente" → dropdown cu categoriile disponibile
- Hover pe „Coș" (când are produse) → preview modal coș
- Link-uri cu efect de hover: underline animat slide-in cu culoare primary
- Background transparent pe pagina Home, `bg-navbar` pe restul paginilor

**Mobile (≤690px):**
- Logo + hamburger SVG vizibile
- Click hamburger → meniu vertical overlay cu toate linkurile
- Meniul mobil are background `bg-navbar` cu border-radius jos

**Autentificare:**
- Neautentificat: buton „Login" în navbar
- Autentificat: avatar (inițiala sau imagine OAuth) + nume + buton Logout

**Edge cases:**
- Coș gol → nu apare dropdown la hover pe Coș
- Utilizator neautentificat → buton Login din `NavbarAuth`, nu item din meniu
- La resize peste 690px → meniu mobil se închide automat

---

## Tech Specs

**Componentă root:** `src/components/navbar/Navbar.tsx` — Server Component async

**Arbore componente:**
- `Navbar` — Server Component; citește sesiunea (`auth()`) și meniul direct din `_core/navbarMenu.ts`
- `NavbarModal` — **Client Component**; orchestrează layout-ul, starea `active` (mobile) și `onHoverActive`
- `Logo` — **Client Component**; folosește `logoRef` din `ContextAPI` pentru a ascunde logo-ul pe mobil când dropdown coș e deschis
- `Menu` — **Client Component**; randează linkurile, dropdown-uri, gestionează click pe mobile
- `MenuModal` — **Client Component**; container dropdown; folosește `IntersectionObserver` pentru a ascunde logo
- `NavbarAuth` — **Client Component**; afișează Login sau avatar + logout
- `CosNavbar` — subcomponentă pentru preview coș în dropdown
- `NotifiedCos` — badge cu numărul de produse din coș

**State folosit:**
- `ContextAPI` → `active` (mobile menu open), `onHoverActive`, `logoRef`, `titleRef`
- `AddToCartContext` → `addToCart` (badge + dropdown preview coș)

**Date folosite:**
- `_core/navbarMenu.ts` → lista de linkuri (importat direct în `Navbar.tsx`, fără fetch)
- `auth()` → sesiunea utilizatorului curent

**Probleme actuale:**
- Nu sunt probleme cunoscute după refactorizare

---

## TODOs Frontend

**UI/UX — Redesign:**
- [x] Înlocuiește `background-color: white / #000` din `navbar.scss` cu `var(--color-navbar)` — elimină selectorii `html.light` / `html.dark` separați
- [x] Adaugă efect hover pe linkuri: underline animat slide-in din stânga cu `var(--color-primary)`
- [x] Înlocuiește hamburger Bootstrap Icons (`::before` cu content code) cu SVG inline în `NavbarModal`
- [x] Redesenează dropdown abonamente din `MenuModal`: background `var(--color-card)`, border subtil, shadow, hover `var(--color-primary)` pe itemi
- [x] Elimină `color: #ddd` din `menu.scss` → `var(--color-muted)`
- [x] Elimină selectorul eronat `f .locatie::before` din `menu.scss`

**Refactorizare cod:**
- [x] Elimină `src/app/_lib/navbar/getNavbar.tsx` și importul ei din `Navbar.tsx`
- [x] Importă direct `menuNavbar` din `@/app/_core/navbarMenu` în `Navbar.tsx`
- [x] Scoate itemul `{ category: "Login", link: "login" }` din `_core/navbarMenu.ts`
- [x] Definește `INavbarItem` în `src/types/navbar.ts`: `{ category: string; link: string; modal: boolean }`
- [x] Tipizează `menu: INavbarItem[]` în `NavbarModal`, `Menu`, `Navbar.tsx`
- [x] Înlocuiește `map((menu: any, key: any))` cu `map((item: INavbarItem, key: number))`
- [x] Elimină `| any` din `setActive` și `onHoverHandler` în `Menu.tsx`
- [x] Redenumește `ggHandler` → `closeMobileMenuHandler` în `Menu.tsx`
- [x] Adaugă cleanup la resize listener în `ContextAPI`: `return () => window.removeEventListener(...)`

## TODOs Backend

- [x] Șters `src/app/api/navbar/route.ts`
- [x] Șters `src/app/_lib/navbar/getNavbar.tsx`
