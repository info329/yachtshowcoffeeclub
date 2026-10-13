# The Yacht Show Coffee Club

The club's website — https://www.yachtshowcoffeeclub.com — with the Onshore
Roasters coffee shop built in.

Next.js 15 · Tailwind · deployed on Railway from `main`.

## How coffee orders work

The shop (`/coffee`, basket drawer, `/shop/checkout`) holds only SKUs and
quantities in the browser. Everything else is done by the Onshore Roasters ops
app (`NEXT_PUBLIC_ROASTERS_API`, default https://app.onshoreroasters.com):

- `GET /api/shop/catalog` — live prices for the three coffees
- `POST /api/shop/price` — total, delivery and VAT (yacht / VAT-number exemptions) as the form is filled
- `POST /api/shop/checkout` — creates the order in Onshore Roasters and returns the Stripe (Onshore Roasters' account) payment page
- `GET /api/shop/order/:token` — the summary shown on `/order/:token` after payment

Those endpoints answer CORS only for this site's origins (see
`lib/shop/partner-sites.ts` in the onshoreroasters repo). Each order is tagged
`utm_source=yachtshowcoffeeclub`; Onshore Roasters sends the customer's
confirmation, invoice and shipping emails, emails staff when a club order is
paid, and records the club's commission on it (Sales → Partner orders).

## Forms

`/invitation` and `/partners` post to `/api/enquiry`, which emails
`ENQUIRY_TO` over SMTP. Until SMTP is configured the form offers a one-click
email instead, so nothing is lost. See `.env.example`.

## Develop

```bash
npm install
npm run dev
```
