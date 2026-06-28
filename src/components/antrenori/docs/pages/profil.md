# Page: Profil

## PRD

**Scop:** Pagina personală a membrului autentificat — prezintă datele contului, abonamentele active, istoricul achizițiilor și permite schimbarea parolei.

**Utilizatori:** Orice utilizator autentificat (MEMBER, TRAINER, ADMIN).

**Comportament așteptat:**

Pagina are trei zone principale:

1. **Header utilizator** — avatar (inițiala numelui sau imagine OAuth), nume complet, email, badge rol (MEMBER / TRAINER / ADMIN) și data înscrierii. Buton Logout vizibil.

2. **Abonamente active** — carduri cu abonamentele active ale membrului (denumire, categorie, dată expirare, status). Dacă nu are niciun abonament activ, mesaj empty state cu CTA către `/abonamente`.

3. **Istoric achiziții** — tabel sau listă cu toate achizițiile anterioare (dată, denumire, preț, status). Empty state dacă lista e goală.

4. **Securitate — Schimbare parolă** — formular cu câmpurile: parolă curentă, parolă nouă, confirmare. Vizibil doar pentru conturi Credentials (nu OAuth). Pentru conturi OAuth, mesaj informativ.

**Edge cases:**
- User OAuth (Google/Facebook/TikTok): câmpul parolă nu apare, se afișează „Contul tău este conectat prin [Provider]"
- Abonamente goale: empty state cu ilustrație și buton „Vezi abonamente"
- Istoric gol: mesaj simplu

---

## Tech Specs

**Rută:** `/profil` → `src/app/(protected)/profil/page.tsx`

**Componente și rolul lor:**
- `ProfilHeader` — Server Component; avatar, nume, email, rol, data înscrierii, buton logout
- `AbonamenteActive` — Server Component; listă abonamente active (placeholder până se implementează achizițiile)
- `IstoricAchizitii` — Server Component; tabel achiziții (placeholder)
- `SchimbareParola` — **Client Component**; formular cu validare și stare loading/error

**Date folosite:**
- `session.user` din `auth()` — id, name, email, image, role
- Query Neon pe `users` — pentru `created_at` și prezența `password_hash` (detectare tip cont Credentials vs OAuth)
- Query Neon pe `orders JOIN order_items JOIN subscription_plans` — abonamente active și istoric achiziții

**State folosit:**
- `SchimbareParola` — `useState` pentru câmpuri, loading, error, success

**Probleme actuale:**
- Abonamentele active sunt placeholder — nu există tabel de achiziții în DB încă
- Istoricul achizițiilor este placeholder
- `createdAt` nu e expus în sesiune — trebuie query separat în `page.tsx`

---

## TODOs Frontend

- [x] Creează layout de bază al paginii `/profil`
- [ ] Creează componenta `ProfilHeader` cu avatar, nume, email, badge rol, dată înscriere, logout
- [ ] Creează componenta `AbonamenteActive` cu empty state și CTA spre `/abonamente`
- [ ] Creează componenta `IstoricAchizitii` cu empty state
- [ ] Creează componenta `SchimbareParola` (Client) cu formular parolă curentă / nouă / confirmare
- [ ] Ascunde `SchimbareParola` dacă userul s-a autentificat OAuth (câmpul `password` e null în DB)
- [ ] Adaugă badge vizual diferit per rol (MEMBER = gri, TRAINER = albastru, ADMIN = roșu/portocaliu)
- [ ] Layout responsiv: sidebar stânga + conținut dreapta pe desktop, stack pe mobile

## TODOs Backend

### DB / Migrări
- [ ] Schema `users`, `orders`, `order_items` sunt definite în `auth.md` și `cos.md` — nu e nevoie de tabele suplimentare
- [ ] Adaugă index pe `orders(user_id, status)` dacă nu există deja (definit în `cos.md`)

### API Routes / Server Actions
- [ ] Adaugă server action `changePasswordAction` în `src/app/actions/auth.ts` — verifică `password_hash` curent cu `bcrypt.compare`, hashează noua parolă, actualizează în Neon
- [ ] Query Neon în `page.tsx` pentru `created_at` și prezența `password_hash` pe userul curent
- [ ] Query Neon în `AbonamenteActive` — `SELECT orders.*, order_items.*, subscription_plans.name FROM orders JOIN order_items ... WHERE user_id = ? AND status = 'paid'`
- [ ] Query Neon în `IstoricAchizitii` — același join, toate statusurile, ORDER BY created_at DESC
