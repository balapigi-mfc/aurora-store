# Aurora — a full-stack e-commerce storefront

Aurora is a small-batch design store, built as a complete, production-shaped
e-commerce application: catalogue, product pages, cart, coupons, checkout,
order history, accounts, saved items and an admin dashboard for staff.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** and a
file-backed JSON store, so it runs anywhere with nothing more than Node.

![Home page](https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80)

---

## Features

### Storefront

- **Home page** — editorial hero, category tiles, featured products, brand story, press and reviews
- **Catalogue** — server-side search, category and price filters, five sort orders, empty states
- **Product pages** — image gallery, colour selection, specs, verified reviews, related products
- **Cart** — persisted in `localStorage`, quantity controls, free-shipping progress, coupon codes (`SAVE10`, `FREESHIP`, `AURORA25`)
- **Checkout** — validated three-step form, server-recalculated pricing, stock checks, mock payment
- **Orders** — confirmation page with fulfilment timeline, order history per account
- **Accounts** — register, sign in, scrypt-hashed passwords, signed http-only session cookies
- **Saved items** — wishlist with one-click move to bag
- **Responsive** — mobile drawer navigation, sticky headers, fluid typography

### Admin (`/admin`, role-protected)

- Revenue, average order value, pending dispatch and stock KPIs
- 14-day revenue chart and best-sellers ranking
- Order table with inline fulfilment status updates and status filters
- Product CRUD — edit seeded products through overrides, create new pieces, soft delete
- Contact-form inbox

### Engineering

- Route handlers for orders, auth, newsletter, contact and admin operations
- Pricing and coupon rules shared between client and server (`src/lib/pricing.ts`)
- Server-side price/stock validation — the client cannot tamper with totals
- Strict TypeScript, typed domain models, accessible focus states
- SEO: metadata per page, Open Graph, sitemap and robots

---

## Getting started

```bash
npm install
npm run dev
```

The store runs at [http://localhost:3000](http://localhost:3000). The data store
(`data/db.json`) is created and seeded automatically on first request.

```bash
npm run build && npm run start   # production build
```

### Demo accounts

| Role     | Email                | Password    |
| -------- | -------------------- | ----------- |
| Customer | `hello@aurora.store` | `aurora123` |
| Admin    | `admin@aurora.store` | `aurora123` |

Checkout accepts the test card `4242 4242 4242 4242` with any future expiry —
no real payment is processed.

### Environment

Copy `.env.example` to `.env.local` and set a secret:

```bash
AUTH_SECRET="a-long-random-string"
```

If unset, a development fallback is used (fine locally, not for production).

---

## Project structure

```
src/
├── app/
│   ├── (store)/            # storefront routes (header + footer shell)
│   │   ├── page.tsx        # home
│   │   ├── products/       # listing + [slug] detail
│   │   ├── cart/           # bag
│   │   ├── checkout/       # checkout flow
│   │   ├── orders/         # history + confirmation
│   │   ├── account/        # dashboard
│   │   ├── wishlist/       # saved items
│   │   └── login|register|about|contact
│   ├── admin/              # role-protected dashboard
│   └── api/                # route handlers (auth, orders, admin, contact)
├── components/             # UI, cart provider, admin widgets
├── data/                   # seeded products and reviews
└── lib/                    # db, auth, catalog, pricing, formatting
```

---

## API

| Method | Route                      | Purpose                        |
| ------ | -------------------------- | ------------------------------ |
| `GET`  | `/api/products`            | Catalogue (via server helpers) |
| `POST` | `/api/orders`              | Create an order                |
| `GET`  | `/api/orders`              | Current user's orders          |
| `POST` | `/api/auth/register`       | Create account                 |
| `POST` | `/api/auth/login`          | Sign in                        |
| `POST` | `/api/auth/logout`         | Sign out                       |
| `GET`  | `/api/auth/me`             | Current session                |
| `POST` | `/api/newsletter`          | Subscribe                      |
| `POST` | `/api/contact`             | Contact form                   |
| `GET`  | `/api/admin/products`      | List products (admin)          |
| `POST` | `/api/admin/products`      | Create product (admin)         |
| `PATCH`| `/api/admin/products/:slug`| Update product (admin)         |
| `DELETE`| `/api/admin/products/:slug`| Delete product (admin)        |
| `PATCH`| `/api/admin/orders/:id`    | Update status (admin)          |

---

## Notes and limitations

- The JSON store is intentionally simple — swap `src/lib/db.ts` for Postgres or
  Prisma and the rest of the app keeps working through the same helpers.
- Payments are mocked; wiring Stripe means replacing the card fields with a
  Payment Intent and confirming server-side.
- Product photography is served from Unsplash for demonstration purposes.
- The admin dashboard is designed for a single studio, not multi-tenant staff.

## License

MIT
