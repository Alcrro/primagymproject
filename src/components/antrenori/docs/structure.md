# Project Structure

## Folder layout

```
src/
  app/                        # Next.js App Router
    _core/                    # Toate datele statice ale aplicației (sursa unică de adevăr)
    _lib/                     # Fetchers — funcții async care apelează API-urile interne
    _homeComponents/          # Componente folosite exclusiv în home (Thumbnail)
    _scripts/                 # Script-uri externe (Google Tag Manager)
    api/                      # Route handlers Next.js
    (auth)/                   # Route group — pagini de autentificare
    (footer)/                 # Route group — pagini generate din linkurile footer
    abonamente/               # Pagini abonamente
    galerie/                  # Pagini galerie + parallel/intercepting routes
    cos/                      # Pagina coș
    locatie/                  # Pagina locație
  components/                 # Componente UI reutilizabile, organizate pe feature
  context/                    # React Context providers
```

---

## Date — `src/app/_core/`

Singurul loc unde trăiesc datele aplicației. Nu există bază de date sau CMS.

| Fișier | Conținut | Tip exportat |
|---|---|---|
| `subscription.ts` | Planuri de abonament cu prețuri | `ICart`, `subscriptions[]` |
| `subscriptionCategories.ts` | Categorii activități (zumba, aerobic, cycling, fitness) | `subscriptionCategory[]` |
| `schedule.ts` | Orarul claselor | `schedules[]` |
| `antrenori.ts` | Lista antrenorilor | `IAntrenorProfile`, `trainers[]` |
| `gallery.ts` | Referințe imagini galerie (import static) | `WonderImage`, `gallery[]` |
| `navbarMenu.ts` | Linkuri navbar | `menuNavbar[]` |
| `information.ts` | Linkuri secțiunea Informatii din footer | `information[]` |
| `rules.ts` | Linkuri secțiunea Regulament din footer | `rules[]` |

**Regula de bază:** Orice conținut nou se adaugă exclusiv aici.

---

## API Routes — `src/app/api/`

Fiecare route returnează datele corespondente din `_core/`. Nu există logică, nu există DB.

```
api/
  abonamente/route.ts       → subscriptionCategory[]
  schedule/route.ts         → schedules[]
  navbar/route.ts           → menuNavbar[]
  gallery/route.ts          → gallery[]
  footer/
    informatii/route.ts     → information[]
    rules/route.ts          → rules[]
```

**Pattern actual (de refactorizat):** Server Components nu importă direct din `_core/` — apelează `_lib/` fetchers care fac `fetch()` la propriile API route-uri (self-referential). Trebuie înlocuit cu import direct.

---

## Fetchers — `src/app/_lib/`

Funcții async care fetch-uiesc din API routes. Folosite de Server Components.

```
_lib/
  abonamente/getSubCategories.tsx
  footer/
    getInformation/getInformation.tsx
    getRules/getRules.tsx
  gallery/getGallery.tsx
  home/
    getSchedule.tsx
    GetDate.tsx             (gol momentan)
  navbar/getNavbar.tsx
  addToLocalStorage/AddToLocalStorage.tsx
  resizableWidth.tsx
```

**De eliminat la refactorizare:** Toți fetchers care apelează route-uri ce returnează doar date statice din `_core/`.

---

## Componente — `src/components/`

Organizate pe feature. Fiecare componentă are un `.scss` co-locat.

```
components/
  abonamente/
    abonamente/Subscriptions.tsx          # Server — grid categorii
    subscriptionCard/SubscriptionCard.tsx # Client — card cu add-to-cart
    subscriptionCard/SubscriptionTrainsers.tsx
    trainers/Trainers.tsx                 # Server — wrapper
    trainers/TrainersModal.tsx            # Client — filtrare antrenori
  button/Button.tsx                       # Buton generic reutilizabil
  cart/
    Cart.tsx                              # Client — pagina coș
    modalCart/ModalCart.tsx               # Item individual în coș
  footer/
    Footer.tsx                            # Server — Promise.all informatii+rules
    contact/Contact.tsx                   # Static
    program/Program.tsx                   # Static
    footerModal/FooterModal.tsx           # Client — lista linkuri
    information/Information.tsx
    regulament/Rules.tsx
    socialMedia/SocialMedia.tsx
  gallery/
    GalleryPhotos.tsx                     # Grid fotografii
    modal/Modal.tsx                       # Modal generic (refolosit și de Shorts)
  header/Header.tsx
  home/
    backgroundVideo/BackgroundVideo.tsx   # Video autoplay
    about/AboutUs.tsx                     # Server
    about/aboutModel/AboutModel.tsx
    logo/TitleHome.tsx                    # Hero title
    schedule/Schedule.tsx                 # Server — orar
    schedule/ScheduleTemplate.tsx
    schedule/scheduleTemplate/            # ScheduleBody, ScheduleTime, ScheduleTitle
    sections/MultipleSections.tsx         # Compozitor secțiuni home
    shorts/Shorts.tsx                     # Client
    shorts/ShortBody.tsx                  # Client
    shorts/ShortModal.tsx                 # Client — modal short
  locatie/Location.tsx                    # Client — Google Maps
  navbar/
    Navbar.tsx                            # Server — fetch navbar data
    NavbarModal.tsx                       # Client — state hamburger
    logo/Logo.tsx
    menu/Menu.tsx                         # Client — desktop + mobile
    menuModal/MenuModal.tsx               # Dropdown generic
    cosNavbar/CosNavbar.tsx               # Client — dropdown cart
    cosNavbar/NotifiedCos.tsx             # Client — badge coș
```

---

## State Global — `src/context/`

Două providere, ambele wrappate în `layout.tsx`.

### `ContextAPI` — `src/context/contextAPI/ContextAPI.tsx`
Hook: `useContextApi()`

| State | Tip | Folosit de |
|---|---|---|
| `pathname` | `string` | Body class `home` pe `/` |
| `active` | `boolean` | Meniu mobil deschis/închis |
| `activeModal` | `boolean` | Modal shorts |
| `onHoverActive` | `boolean` | Hover desktop navbar |
| `logoRef`, `titleRef` | `MutableRefObject` | Referințe DOM navbar |

### `AddToCartProvider` — `src/context/addToCart/AddToCartContext.tsx`
Hook: `useAddToCart()`

| State/Metodă | Tip | Descriere |
|---|---|---|
| `addToCart` | `ICart[]` | Lista abonamentelor în coș |
| `addToCartHandler` | `(item) => void` | Adaugă în coș + salvează localStorage |
| `removeHandler` | `(item) => void` | Șterge din coș + actualizează localStorage |

**Persistență:** `localStorage` key `"cart"` — încărcat la mount via `useEffect`.

---

## Routing

### Route Groups
- `(auth)/` — grupează pagini de autentificare, fără impact în URL
- `(footer)/` — pagini generate din linkurile footer

### Parallel + Intercepting Routes (Galerie)
```
galerie/
  layout.tsx                        # Slot-uri: { children } + { modal }
  page.tsx                          # Grid
  [id]/page.tsx                     # Full-page (acces direct la URL)
  @modal/
    default.tsx                     # null — niciun modal activ
    (..)galerie/[id]/page.tsx       # Modal overlay (interceptează navigarea internă)
```
Comportament: navigare din grid → interceptat → modal. Refresh / acces direct URL → full-page.

---

## Stilizare

**Regulă:** SCSS co-locat pentru layout/structură, Tailwind inline pentru utilități.

**Dark mode:**
- Provider: `next-themes` cu `attribute="class"` și `defaultTheme="system"`
- Tailwind: prefix `dark:` pe clase inline
- SCSS: selector `:global(.dark) .clasa { ... }`
- `suppressHydrationWarning` pe `<html>` — necesar pentru hydration mismatch la schimbarea temei

---

## Variabile de mediu

| Variabilă | Unde | Valoare dev |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `next.config.mjs` | `http://localhost:3000` |
| `NEXT_PUBLIC_MAPS_API_KEY` | `.env.local` (lipsă din repo) | cheie Google Maps |

**Atenție build Linux/Mac:** `package.json` are `set NODE_ENV=production` (sintaxă Windows). Folosește `NODE_ENV=production next build`.
