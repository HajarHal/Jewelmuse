# Jewel Muse

Luxury accessories storefront — **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.
Orders are stored in a **Google Sheet** (no database to manage). New orders trigger
**email + WhatsApp notifications**, and `/admin` is **password-protected**.

Flow: customer browses → fills the order form → order appended to your Google Sheet →
you get an email/WhatsApp alert → you see it in `/admin` and call to confirm.
Payment on delivery.

---

## Produits : plusieurs photos & vidéo par produit / Multiple photos & video

La galerie produit se fait défiler (swipe au doigt sur mobile, flèches sur ordinateur)
et accepte plusieurs photos **et une vidéo**. Plusieurs produits utilisent désormais
de **vraies photos** du produit, et le *Coffret Montre & Perles* inclut une **vidéo de
déballage** (`coffret-unboxing.mp4`).

- **Ajouter des photos** : déposez les fichiers dans `public/products/` puis
  ajoutez des entrées `{ type: "image", url: "/products/mon-image.jpg" }`.
- **Ajouter une vidéo** : déposez un `.mp4` dans `public/products/` puis ajoutez
  `{ type: "video", url: "/products/ma-video.mp4", poster: "/products/une-image.jpg" }`.
  Le `poster` (facultatif) est l'image affichée avant la lecture.

> ⚠️ Les produits suivants utilisent encore des images générées (IA) qui portent le
> filigrane « photio », et la montre y affiche la marque « NAIDU » : **Parure Cygne,
> Montre Perle Royale, Collier Maille Rectangle, Collier Pendentif Carré, Coffret
> Signature**. Pour les remplacer par de vraies photos, déposez les nouveaux fichiers
> dans `public/products/` et mettez à jour le tableau `media` du produit dans
> `lib/products.ts`.

---

## Pages

| Page | Path |
|------|------|
| Home | `/` |
| Collection | `/products` |
| Product detail + order form | `/products/[slug]` |
| Order confirmation | `/order/success` |
| Admin (password-protected) | `/admin/orders` |
| Order API | `POST /api/orders` |

The catalog lives in `lib/products.ts` (edit it to change products). Images are
self-contained SVGs in `public/products/` — replace with real photos anytime.

---

## Run locally

```bash
npm install
cp .env.example .env.local      # fill in values (see below)
npm run dev                     # http://localhost:3000
```

The storefront and order form work immediately. Until you connect the Google Sheet,
submitted orders are just logged to your terminal, and `/admin` shows a "connect your
sheet" notice. To go fully live, follow the deploy steps below.

---

## ✦ Exact deploy steps

### Step 1 — Create the Google Sheet (orders storage)

1. Go to <https://sheets.google.com> and create a **new blank spreadsheet**. Name it
   e.g. *Jewel Muse Orders*.
2. In the menu: **Extensions ▸ Apps Script**. A code editor opens.
3. Delete whatever is in `Code.gs`, then open `google-apps-script/Code.gs` from this
   project, copy **all** of it, and paste it in.
4. Near the top, change this line to a long random string of your own:
   ```js
   var SECRET = "CHANGE_ME_TO_A_LONG_RANDOM_STRING";
   ```
   Keep this value — you'll reuse it as `SHEET_SECRET`.
5. Click **Deploy ▸ New deployment**. Choose type **Web app**.
   - **Description:** anything
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*
   - Click **Deploy**, authorize the permissions when prompted (it's your own script).
6. Copy the **Web app URL** (it ends in `/exec`). This is your `SHEET_WEBAPP_URL`.

> Test it: open the URL with `?action=list&secret=YOUR_SECRET` appended in your browser —
> you should see `{"ok":true,"orders":[]}`.

### Step 2 — (Optional) Email alerts via Resend

1. Sign up free at <https://resend.com> and create an **API key**.
2. Note your key (`RESEND_API_KEY`) and the email you want alerts sent to (`OWNER_EMAIL`).
   Leave these blank to skip email.

### Step 3 — (Optional) WhatsApp alerts via CallMeBot

1. Follow <https://www.callmebot.com/blog/free-api-whatsapp-messages/>: add their number
   to your contacts and send the activation message; you'll receive an **API key**.
2. Use your number in international format (e.g. `212600000000`) as `WHATSAPP_PHONE`
   and the key as `CALLMEBOT_APIKEY`. Leave blank to skip WhatsApp.

### Step 4 — Push the code to GitHub

```bash
git init
git add .
git commit -m "Jewel Muse storefront"
# create an empty repo on github.com, then:
git remote add origin https://github.com/USERNAME/jewel-muse.git
git branch -M main
git push -u origin main
```

### Step 5 — Deploy on Vercel

1. Go to <https://vercel.com>, sign in with GitHub, click **Add New ▸ Project**, and
   import your repo. Framework auto-detects as **Next.js** — keep defaults.
2. Before deploying, open **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `SHEET_WEBAPP_URL` | the `/exec` URL from Step 1 |
   | `SHEET_SECRET` | the same secret you set in the script |
   | `ADMIN_USER` | e.g. `admin` |
   | `ADMIN_PASSWORD` | a strong password |
   | `RESEND_API_KEY` | from Step 2 (optional) |
   | `OWNER_EMAIL` | your email (optional) |
   | `EMAIL_FROM` | optional |
   | `WHATSAPP_PHONE` | from Step 3 (optional) |
   | `CALLMEBOT_APIKEY` | from Step 3 (optional) |

3. Click **Deploy**. After ~1 minute you'll get a live URL like
   `https://jewel-muse.vercel.app`.

### Step 6 — Verify

- Visit the site, place a test order.
- Check your Google Sheet — a new row should appear.
- Check your email/WhatsApp for the alert (if configured).
- Visit `/admin/orders` — the browser asks for your `ADMIN_USER` / `ADMIN_PASSWORD`,
  then shows the order. Change its status with the dropdown.

You're live. 🎉

> **Custom domain:** in Vercel ▸ your project ▸ **Settings ▸ Domains**, add your domain
> and follow the DNS instructions.
>
> **Changed env vars later?** Redeploy (Vercel ▸ Deployments ▸ ⋯ ▸ Redeploy) so they take effect.

---

## Editing products

Edit the `products` array in `lib/products.ts` (name, price, colors, etc.). To use a real
photo, drop it in `public/products/` and point that product's `imageUrl` at it
(e.g. `/products/lina.jpg`), or use a hosted Cloudinary URL.

## Order statuses

`pending → confirmed → shipped → delivered`, plus `cancelled` and `returned`.
New orders start as `pending`; change status from `/admin/orders`.

## Design system

Ivory `#F8F3EC` · ink `#1F1B18` · champagne gold `#D6B56D`. Fonts: Cormorant Garamond
(display) + Jost (body). Tokens in `tailwind.config.ts`.

## Security note

`/admin` is protected by HTTP Basic Auth (`middleware.ts`). It refuses access unless
`ADMIN_PASSWORD` is set, so never deploy without it. The `SHEET_SECRET` keeps your
Apps Script endpoint from being written to by strangers — keep it private.
