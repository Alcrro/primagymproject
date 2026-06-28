# Feature: Auth

## PRD

**Scop:** Sistem de autentificare și autorizare pentru membrii, antrenorii și administratorii PrimaGym. Accesul la zona privată (abonamente, rezervări, profil, admin panel) este condiționat de rol.

**Roluri:**
| Rol | Acces |
|---|---|
| `MEMBER` | Abonamente active, checkout, rezervări clase, editare profil |
| `TRAINER` | Programul propriu, lista membrilor din clasele sale |
| `ADMIN` | Dashboard complet `/admin` — gestionare membri, abonamente, conținut |

**Metode de autentificare:**
- Email + Parolă (cont creat la register)
- Google OAuth
- Facebook OAuth
- TikTok OAuth (custom provider)

**Fluxuri principale:**

1. **Register** `/register` — creare cont nou cu email + parolă; rol implicit `MEMBER`
2. **Login** `/login` — autentificare prin email/parolă sau OAuth
3. **Reset parolă** `/forgot-password` → email cu link → `/reset-password?token=` → parolă nouă
4. **Logout** — invalidează sesiunea, redirect la `/`

**Comportament sesiune:**
- Sesiune expira după inactivitate (timeout configurabil, recomandat 30 min)
- La expirare → redirect automat la `/login` cu mesaj informativ
- „Ține-mă logat" — opțional, extinde sesiunea la 30 zile

**Comportament după login:**
- Redirect la pagina de unde a venit utilizatorul (callbackUrl)
- Dacă nu există callbackUrl → redirect la `/profil`
- Admin → redirect la `/admin`

**Erori vizibile utilizatorului:**
- Credențiale greșite → „Email sau parolă incorectă"
- Cont inexistent → „Nu există niciun cont cu acest email"
- Email neconfirmat (dacă se implementează verificare) → „Confirmă adresa de email"
- OAuth eșuat → „Autentificarea cu [provider] a eșuat. Încearcă din nou."

---

## Tech Specs

**Stack:** Auth.js v5 (NextAuth) — integrare nativă cu Next.js App Router, suport JWT + server actions

**Rute:**
```
/(auth)/
  login/page.tsx
  register/page.tsx
  forgot-password/page.tsx
  reset-password/page.tsx
/(protected)/
  profil/page.tsx
  rezervari/page.tsx
/admin/
  page.tsx (dashboard)
```

**Fișiere create:**
```
src/
  auth.ts                              ✅ providers, callbacks, session, maxAge
  middleware.ts                        ✅ protecție rute /profil, /rezervari, /admin
  app/
    api/auth/[...nextauth]/route.ts    ✅
    api/auth/forgot-password/route.ts  ✅ generează token + trimite email via Resend
    api/auth/reset-password/route.ts   ✅ validează token + actualizează parola
    api/auth/change-password/route.ts  ✅
    actions/auth.ts                    ✅ loginWithCredentials, registerUser, loginWithGoogle/Facebook/TikTok
    (auth)/
      layout.tsx                       ✅
      login/page.tsx                   ✅ LoginForm cu email/parolă + OAuthButtons
      register/page.tsx                ✅ RegisterForm cu validare + OAuthButtons + mesaj succes
      forgot-password/page.tsx         ✅
      reset-password/page.tsx          ✅
    (protected)/
      layout.tsx                       ✅
      profil/page.tsx                  ✅ ProfilHeader, AbonamenteActive, IstoricAchizitii, SchimbareParola
      rezervari/page.tsx               ✅ (stub)
    admin/
      layout.tsx                       ✅
      page.tsx                         ✅ (dashboard stub)
```

**Configurare Auth.js (`src/auth.ts`):**
```ts
providers: [
  Credentials({ ... }),   // email + parolă
  Google({ ... }),        // GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
  Facebook({ ... }),      // FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET
  {                       // TikTok custom provider
    id: "tiktok",
    name: "TikTok",
    type: "oauth",
    authorization: "https://www.tiktok.com/v2/auth/authorize",
    token: "https://open.tiktokapis.com/v2/oauth/token/",
    userinfo: "https://open.tiktokapis.com/v2/user/info/",
    ...
  }
]
```

**Roluri în sesiune — callback `jwt`:**
```ts
callbacks: {
  jwt({ token, user }) {
    if (user) token.role = user.role  // salvat la login
    return token
  },
  session({ session, token }) {
    session.user.role = token.role
    return session
  }
}
```

**Middleware (`src/middleware.ts`):**
```ts
// Rute protejate după rol
/profil/*        → MEMBER, TRAINER, ADMIN
/rezervari/*     → MEMBER
/admin/*         → ADMIN only
```

**Timeout sesiune:** configurat via `maxAge` în Auth.js session config (ex: `maxAge: 30 * 60` pentru 30 min)

**Reset parolă — flow:**
1. User trimite email la `/forgot-password`
2. Server generează token unic (UUID), salvat în DB cu expirare 1h
3. Email trimis cu link `/reset-password?token=UUID`
4. User setează parolă nouă → token invalidat

**Email provider recomandat:** Resend (`npm install resend`) — integrare simplă cu Next.js

**Variabile de mediu necesare:**
```
AUTH_SECRET=                    # openssl rand -base64 32
AUTH_URL=                       # URL-ul aplicației (ex: https://primagym.ro)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
TIKTOK_CLIENT_ID=
TIKTOK_CLIENT_SECRET=
RESEND_API_KEY=                 # pentru email reset parolă
```

**Schema DB (Neon/PostgreSQL):**

```sql
-- Tabel utilizatori
CREATE TABLE users (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name           TEXT,
  email          TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  password_hash  TEXT,                      -- NULL pentru conturi OAuth
  image          TEXT,
  role           TEXT NOT NULL DEFAULT 'MEMBER', -- 'MEMBER', 'TRAINER', 'ADMIN'
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- Conturi OAuth legate de utilizatori
CREATE TABLE accounts (
  id                   TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id              TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider             TEXT NOT NULL,        -- 'google', 'facebook', 'tiktok', 'credentials'
  provider_account_id  TEXT NOT NULL,
  access_token         TEXT,
  refresh_token        TEXT,
  expires_at           INT,
  UNIQUE(provider, provider_account_id)
);

-- Sesiuni (Auth.js Database strategy)
CREATE TABLE sessions (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires    TIMESTAMPTZ NOT NULL
);

-- Tokens reset parolă
CREATE TABLE password_reset_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '1 hour'),
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexuri
CREATE INDEX ON accounts(user_id);
CREATE INDEX ON sessions(user_id);
CREATE INDEX ON sessions(expires);
CREATE INDEX ON password_reset_tokens(token) WHERE used_at IS NULL;
```

**Date seed / valori default:**
- Insert cont `ADMIN` inițial manual (email + `password_hash` generat cu `bcrypt`)
- Toți userii noi primesc `role = 'MEMBER'` implicit

**Adapter folosit:** `@auth/prisma-adapter` — Auth.js + Prisma + Neon

---

## TODOs Frontend

**Login:**
- [x] Înlocuiește stub-ul din `login/page.tsx` cu componenta `LoginForm`
- [x] `LoginForm` — câmpuri email + parolă, validare client-side, stare loading pe submit
- [x] Butoane OAuth: Google, Facebook, TikTok — `OAuthButtons.tsx`
- [x] Afișare erori returnate de server (credențiale greșite etc.)
- [x] Link „Ai uitat parola?" → `/forgot-password`
- [x] Link „Nu ai cont? Înregistrează-te" → `/register`

**Register:**
- [x] Creează `/register` cu câmpuri: nume, email, parolă, confirmare parolă
- [x] Validare: email unic, parola min 8 caractere, parolele coincid
- [x] Butoane OAuth — `OAuthButtons.tsx` inclus în `RegisterForm`
- [x] Mesaj de succes după înregistrare

**Reset parolă:**
- [x] Creează `/forgot-password` — câmp email + buton „Trimite link"
- [x] Creează `/reset-password` — câmpuri parolă nouă + confirmare, citește `?token=` din URL
- [ ] Validare token expirat sau invalid — mesaj de eroare clar în UI

**Layout & UX:**
- [x] Creează `src/app/(auth)/layout.tsx`
- [x] Creează `src/app/(protected)/layout.tsx`
- [x] Creează `src/app/admin/layout.tsx`
- [x] Adaugă buton „Logout" în navbar — `NavbarAuth.tsx`
- [x] Navbar afișează numele utilizatorului / avatar când e logat
- [x] `export const dynamic = "force-dynamic"` eliminat din `login/page.tsx`

**Profil:**
- [x] Creează `/profil` cu `ProfilHeader`, `AbonamenteActive`, `IstoricAchizitii`, `SchimbareParola`
- [ ] `AbonamenteActive` și `IstoricAchizitii` — placeholder, necesită query pe tabelele `orders`
- [ ] Editare nume în `SchimbareParola` (momentan doar parolă)

## TODOs Backend

**Setup inițial:**
- [x] Instalează Auth.js: `next-auth@beta`
- [x] Instalează adapter: `@auth/prisma-adapter`
- [x] Creează `src/auth.ts` cu toți providerii configurați
- [x] Creează `src/app/api/auth/[...nextauth]/route.ts`
- [x] Creează `src/middleware.ts` cu protecție rute după rol
- [x] Adaugă variabilele în `.env.local` (`AUTH_SECRET`, `AUTH_URL`, `GOOGLE_*`, `RESEND_*`)

**Providers OAuth:**
- [x] Google — `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` configurate
- [ ] Facebook — aplicație creată în Meta for Developers, `FACEBOOK_CLIENT_ID` + `FACEBOOK_CLIENT_SECRET` de completat în `.env.local`
- [ ] TikTok — aplicație creată în TikTok for Developers, `TIKTOK_CLIENT_ID` + `TIKTOK_CLIENT_SECRET` de completat în `.env.local`

**Email:**
- [x] Resend instalat + `RESEND_API_KEY` configurat
- [x] `src/app/api/auth/forgot-password/route.ts` — generează token + trimite email
- [x] `src/app/api/auth/reset-password/route.ts` — validează token + actualizează parola

### DB / Migrări
- [x] Creare tabel `users` cu câmpul `role` în Neon
- [x] Creare tabel `accounts`
- [x] Creare tabel `sessions`
- [x] Creare tabel `password_reset_tokens`
- [x] Adaugă indexuri
- [ ] Seed cont ADMIN inițial cu `password_hash` generat via `bcrypt`

**Roluri:**
- [x] Câmpul `role` în schema Prisma (`UserRole` enum: MEMBER / TRAINER / ADMIN)
- [x] Callbacks `jwt` și `session` configurate în `auth.ts` — expun `id` și `role`
- [ ] Creează `src/app/api/admin/` routes pentru operațiunile din dashboard

**Sesiune:**
- [x] `maxAge: 30 * 60` configurat în `auth.ts`
- [ ] Adaugă opțiunea „Ține-mă logat" care extinde `maxAge` la 30 zile
