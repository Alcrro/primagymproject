# Feature: Cos (Cart)

## PRD

**Scop:** Gestionarea abonamentelor selectate înainte de finalizarea comenzii.

**Utilizatori:** Vizitatori care au adăugat cel puțin un abonament și vor să cumpere.

**Comportament așteptat:**
- Navbar badge: iconița coșului afișează numărul de abonamente adăugate
- Navbar dropdown (hover pe „Cos", când are iteme): lista abonamentelor, total în RON, buton „Cumpara" → redirect `/cos`
- Pagina `/cos`: lista completă, posibilitate de ștergere per item, total recalculat
- Coșul persistă în `localStorage` între vizite și refresh
- Coșul gol → mesaj informativ

---

## Tech Specs

**Rută:** `/cos` → `src/app/cos/page.tsx`

**Componente și rolul lor:**
- `Cart` — Client Component; afișează lista din context, calculează totalul
- `ModalCart` — item individual în lista coșului; afișează categorie, intrări, stepper cantitate, preț
- `CosNavbar` — Client Component în navbar; dropdown preview cu lista + stepper cantitate + total + buton checkout
- `NotifiedCos` — Client Component; badge cu suma cantităților din coș

**State folosit — `AddToCartContext`:**
- `addToCart: ICart[]` — lista curentă (tipizat corect)
- `addToCartHandler(item: ICart)` — dacă itemul există, incrementează `quantity`; altfel adaugă cu `quantity: 1` + salvează `localStorage`
- `removeHandler(item: ICart)` — decrementează `quantity`; elimină itemul când ajunge la 0 + actualizează `localStorage`
- `deleteHandler(item: ICart)` — șterge complet itemul indiferent de cantitate + actualizează `localStorage`

**Schema DB (Neon/PostgreSQL):**

```sql
CREATE TABLE orders (
  id             SERIAL PRIMARY KEY,
  user_id        TEXT REFERENCES users(id) ON DELETE SET NULL,
  status         TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'cancelled', 'expired'
  total_ron      NUMERIC(10,2) NOT NULL,
  discount_code  TEXT REFERENCES discount_codes(code),
  discount_ron   NUMERIC(10,2) DEFAULT 0,
  payment_method TEXT,                             -- 'stripe', 'netopia', 'cash'
  payment_ref    TEXT,                             -- referința externă de la payment gateway
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  plan_id     INT NOT NULL REFERENCES subscription_plans(id),
  quantity    INT NOT NULL DEFAULT 1,
  price_ron   NUMERIC(10,2) NOT NULL,  -- prețul blocat la momentul achiziției
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Indexuri
CREATE INDEX ON orders(user_id);
CREATE INDEX ON orders(status);
CREATE INDEX ON order_items(order_id);
```

**Date seed / valori default:**
- Nu sunt necesare date seed — tabelele se populează la fiecare achiziție
- `status = 'pending'` la creare, devine `'paid'` după confirmare payment gateway

**Probleme actuale:**
- Nu sunt probleme cunoscute în implementarea curentă

---

## TODOs Frontend

- [x] **Fix bug critic:** înlocuiește `useEffect + localStorage` din `Cart.tsx` cu `useAddToCart()`
- [x] **Fix bug critic:** înlocuiește `splice` din `removeHandler` cu `.filter()` — `AddToCartContext.tsx`
- [x] Adaugă buton de ștergere în `ModalCart.tsx` conectat la `deleteHandler`
- [x] Adaugă mesaj „Coșul este gol" când `addToCart.length === 0`
- [x] Tipizează `addToCart` ca `ICart[]` și elimină `any` din context
- [x] Elimină `console.log(sub)` din `removeHandler`
- [x] Elimină `export const dynamic = "force-dynamic"` din `cos/page.tsx`
- [x] Stepper cantitate `−/nr/+` în `ModalCart.tsx` — incrementează/decrementează per item
- [x] Stepper cantitate `−/nr/+` în `CosNavbar.tsx` — același comportament în dropdown hover
- [x] `deleteHandler` în `AddToCartContext` — șterge complet un item indiferent de cantitate
- [x] Badge `NotifiedCos` afișează suma totală a cantităților, nu numărul de tipuri distincte
- [x] Migrare localStorage — la încărcare, item-urile duplicate fără `quantity` sunt consolidate automat

## TODOs Backend

### DB / Migrări
- [x] Creare tabel `orders` în Neon
- [x] Creare tabel `order_items`
- [x] Adaugă indexuri pe `orders(user_id, status)` și `order_items(order_id)`
- [x] Modele Prisma pentru `Order` și `OrderItem` în `prisma/schema.prisma`

### API Routes / Server Actions
- [x] Creează `src/app/api/checkout/route.ts` — creare order + order_items în DB, redirect la payment
- [x] Creează webhook handler pentru payment gateway — `src/app/api/webhooks/stripe/route.ts` actualizează `status` pe `PAID`
- [x] Integrare Stripe Checkout pentru finalizarea plății
- [x] Adaugă `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_BASE_URL` în `.env.example`
