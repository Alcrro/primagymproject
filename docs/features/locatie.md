# Feature: Locatie

## PRD

**Scop:** Afișează locația fizică a sălii pe o hartă interactivă pentru a ajuta clienții să găsească adresa.

**Utilizatori:** Oricine vrea să știe unde se află sala.

**Comportament așteptat:**
- Hartă Google Maps centrată pe coordonatele sălii din Satu Mare
- Nivel de zoom stradal — se vede strada și clădirile vecine
- Hartă interactivă: scroll zoom, drag, click pe puncte de interes
- Marker vizibil pe locația exactă a sălii

---

## Tech Specs

**Rută:** `/locatie` → `src/app/locatie/page.tsx`

**Componentă:**
- `Location` — Client Component; inițializează Google Maps la mount via `useEffect` + `@googlemaps/js-api-loader`

**Cum funcționează inițializarea:**
```ts
const loader = new Loader({ apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY })
const { Map } = await loader.importLibrary("maps")
new Map(mapRef.current, { center: { lat: 47.7991836, lng: 22.8738521 }, zoom: 17 })
```
- `mapRef` — `useRef<HTMLDivElement>` atașat pe div-ul container al hărții
- Harta se montează pe div-ul referențiat după ce componenta e randată în DOM

**Variabilă de mediu necesară:**
- `NEXT_PUBLIC_MAPS_API_KEY` — cheie Google Maps; **nu există în repo**, harta nu se încarcă fără ea

**Probleme actuale:**
- `.env.local` lipsește din repo — cheie nedocumentată
- Nu există marker pe locația sălii
- Nu există loading state în timp ce Maps API se inițializează
- `mapId: "MY_NEXTJS_MAPID"` — placeholder neînlocuit
- Coordonatele și zoom-ul sunt magic numbers inline în componentă
- `export const dynamic = "force-dynamic"` pe pagină deși e pur client-side

---

## TODOs Frontend

- [ ] Adaugă loading state vizual pe div-ul hărții până la inițializarea Maps API
- [ ] Adaugă `Marker` pe coordonatele sălii
- [ ] Înlocuiește `"MY_NEXTJS_MAPID"` cu un Map ID real sau elimină opțiunea
- [ ] Mută coordonatele și zoom-ul într-o constantă (ex: `_core/location.ts`)
- [ ] Elimină `export const dynamic = "force-dynamic"` din `locatie/page.tsx`

## TODOs Backend

- [ ] Creează `.env.local.example` în root cu `NEXT_PUBLIC_MAPS_API_KEY=` (fără valoarea reală)
- [ ] Documentează în CLAUDE.md de unde se obține cheia Maps API
