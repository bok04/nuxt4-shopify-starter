# Nuxt 4 + Shopify Storefront Boilerplate
A minimal Shopify storefront built with Nuxt 4, Tailwind CSS v4, and Pinia. Drop in your credentials and you've got a working shop.

## Features
- Product listing with pagination-ready GraphQL queries
- Product detail page with image gallery and variant selector
- Full shopping cart — add, update, remove line items
- Cart that survives page refreshes (persisted via server-side cookies)
- Checkout redirect to Shopify's hosted checkout

## Setting Up Shopify

Before running the app you'll need to set up a storefront in your Shopify Admin.

1. In your Shopify Admin go to **Sales Channels** and install **Headless**
2. Once installed click **Create Storefront**
3. In your storefront settings check the API access scopes and make sure `unauthenticated_read_product_inventory` is enabled — the others should be on by default
4. Copy the **public access token** generated for your storefront — you'll need this for your `.env` file

## Getting Started
```bash
npm install
```
Copy the example env file and fill in your Shopify details:
```bash
cp .env.example .env
```
You'll need:
- **SHOPIFY_DOMAIN** — your myshopify.com domain, e.g. `my-store.myshopify.com`
- **SHOPIFY_TOKEN** — the public access token generated from your Shopify Headless storefront
- **SITE_URL** — your public URL (used to bring customers back after checkout)

Then run it:
```bash
npm run dev
```
Visit `/` to see your products.

## Project Structure
```
├── app/
│   ├── assets/css/main.css          # Tailwind imports and theme
│   ├── components/shop/
│   │   ├── ProductCard.vue          # Card with image, price, and view button
│   │   └── CartButton.vue           # Cart icon with item count badge
│   ├── composables/
│   │   ├── useShopify.ts            # Low-level Shopify GraphQL client
│   │   ├── useProducts.ts           # Product queries
│   │   └── useCart.ts               # Cart mutations
│   ├── layouts/
│   │   └── shop.vue                 # Shop layout with cart header
│   ├── pages/
│   │   ├── index.vue                # Product grid
│   │   ├── cart.vue                 # Cart page
│   │   └── product/[handle].vue     # Product detail page
│   ├── stores/
│   │   └── cart.ts                  # Pinia cart store
│   └── types/
│       └── shopify.ts               # TypeScript interfaces for Shopify
├── server/
│   ├── api/
│   │   ├── cart-id.get.ts           # Read cart cookie
│   │   └── cart-id.post.ts          # Write cart cookie
│   └── plugins/
│       └── cart.ts                  # Renews cart cookie on every request
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

## How It Works
**Products.** `useProducts()` wraps a shared GraphQL fragment with queries for listing all products, fetching by handle, or filtering by collection. Data is fetched server-side via `useAsyncData` and hydrated on the client.

**Cart.** The `useCartStore` (Pinia) keeps your cart in sync with Shopify. On first visit it checks for an existing cart ID cookie. If there is one, it fetches that cart. If not, a new cart is created the first time you add something. The cart ID is stored in a server-set cookie so it persists across refreshes without any client-side storage tricks.

**Checkout.** The cart page links straight to Shopify's hosted checkout with a `return_to` param so customers come back to your site after paying.

## Customisation
- **Styling** — edit `app/assets/css/main.css` to tweak the Tailwind theme
- **Fonts** — configured in `nuxt.config.ts` via `@nuxtjs/google-fonts`
- **Product fields** — edit the `PRODUCT_FRAGMENT` in `app/composables/useProducts.ts`
- **Products per page** — change the `first` argument in `app/pages/index.vue`

## Requirements
- Node.js 18+
- A Shopify store with the Storefront API enabled via the Headless sales channel
- A public Storefront API access token

## Author
Built by [Ben O'Connor](https://www.benoconnor.co.uk) — web developer and designer based in Scarborough, UK.
