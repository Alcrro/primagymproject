# Layout: Footer

## PRD

**Scop:** Footer persistent cu informații de contact, program și linkuri utile. Accesibil de pe orice pagină.

**Comportament așteptat:**
- Secțiunea Contact: adresă, telefon, email
- Secțiunea Program: ore de funcționare (luni–vineri 08:00–22:00, sâmbătă 08:00–13:00, duminică închis)
- Secțiunea Informatii: lista de linkuri spre pagini informative
- Secțiunea Regulament: lista de linkuri spre pagini de regulament
- Secțiunea Social Media: iconițe SVG pentru Facebook, Instagram, TikTok cu link către profiluri
- Click pe link din Informatii/Regulament → navighează la `/(footer)/[footer]/[slug]`

---

## Tech Specs

**Componentă root:** `src/components/footer/Footer.tsx` — Server Component

**Arbore componente:**
- `Footer` — Server Component; importă direct din `_core/` (fără fetch la API)
- `Contact` — date din `_core/contact.ts`
- `Program` — ore din `_core/program.ts`
- `FooterModal` — Client Component; props `IFooterLink[]`, fără `any`
- `SocialMedia` — iconițe SVG inline (Facebook, Instagram, TikTok)

**Date folosite:**
- `_core/contact.ts` → adresă, telefon, email (mutat din JSX hardcodat)
- `_core/program.ts` → ore funcționare (mutat din JSX hardcodat)
- `_core/information.ts` → secțiunea Informatii
- `_core/rules.ts` → secțiunea Regulament

**Ruta destinație linkuri:** `/(footer)/[footer]/[slug]/page.tsx` — stub în prezent

**Probleme actuale:**
- `Contact` și `Program` au date hardcodate în JSX — nu pot fi modificate din `_core/`
- Linkurile din `information.ts` au toate același `link: "despre-noi"` — nu sunt unice
- `FooterModal` primește `props: []` și face `rule: any` în map
- Paginile destinație ale linkurilor din footer sunt stub-uri
- Self-referential fetch: `Footer` → `getInformation()` / `getRules()` → `fetch /api/footer/...` → `_core/`

---

## TODOs Frontend

**UI/UX — Redesign:**
- [x] Restructurează layout-ul footer în grid 4 coloane pe desktop (Contact | Program | Informatii | Regulament), 2 coloane pe tabletă, 1 coloană pe mobil
- [x] Aplică design tokens: `bg-navbar` pe background, `text-content` / `text-muted` pe texte, `text-primary` pe hover-ul linkurilor
- [x] Mărește spațierea internă: padding vertical generos, gap între secțiuni, line-height pe liste
- [x] Adaugă linie separator subtilă între secțiunile principale și bara de jos (copyright)
- [x] Înlocuiește iconița Facebook actuală cu SVG-uri corecte pentru Facebook, Instagram, TikTok
- [x] Adaugă efect hover pe iconițele social media (scale + color)
- [x] Adaugă bara de jos cu copyright `© {year} PrimaGym`

**Refactorizare cod:**
- [x] Creează `src/app/_core/contact.ts` cu interfața `IContactItem` și datele (adresă, telefon, email)
- [x] Creează `src/app/_core/program.ts` cu interfața `IProgramItem` și orele de funcționare
- [x] Actualizează `Contact.tsx` să importe din `_core/contact.ts`
- [x] Actualizează `Program.tsx` să importe din `_core/program.ts`
- [x] Definește `IFooterLink`, `IContactItem`, `IProgramItem` în `src/types/footer.ts`
- [x] Tipizează `FooterModal` cu `links: IFooterLink[]`, elimină `rule: any`, convertit la Server Component
- [x] Corectează slugurile din `_core/information.ts` — fiecare item are `link` unic
- [x] Importă direct din `_core/information.ts` și `_core/rules.ts` în `Footer.tsx` (elimină getters)

## TODOs Backend

- [x] Șters `src/app/api/footer/informatii/route.ts`
- [x] Șters `src/app/api/footer/rules/route.ts`
- [x] Șters `src/app/_lib/footer/getInformation/`
- [x] Șters `src/app/_lib/footer/getRules/`
