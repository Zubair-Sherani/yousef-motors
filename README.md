# Yousef Motors

A statically generated used-car dealership website for **Yousef Motors**.

The site is built with Next.js, React, TypeScript, and Tailwind CSS. Inventory lives in a single JSON file. Individual vehicle pages are generated automatically. The production target is **GitHub + Cloudflare Pages**, which keeps hosting inexpensive and updates the site whenever the production branch changes.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- npm
- Local JSON inventory
- WebP vehicle images stored with the site
- Cloudflare Pages static export

There is no database and no traditional backend. The optional contact endpoint is a small Cloudflare Pages Function.

```text
Next.js
  → React + TypeScript
  → Tailwind CSS
  → Static Generation
  → Cloudflare Pages

Source Code
  → GitHub
  → Automatic Cloudflare deployment
```

## Project structure

```text
app/                         Pages and metadata
components/                  Shared UI
data/cars.json               Inventory
data/dealership.ts           Business details
lib/                         Vehicle helpers, forms, SEO
scripts/                     Inventory CLI
public/cars/                 Vehicle images
types/vehicle.ts             Vehicle types
functions/api/contact.js     Optional Cloudflare form function
```

## Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run build` writes a static site to `out/`. That folder is what Cloudflare Pages deploys.

`next start` is not used for production because this project is a static export.

## Dealership configuration

Edit `data/dealership.ts` for:

- company name
- address
- phone
- email
- business hours
- Google Maps URL
- social links
- dealer license information
- public site URL

The repository ships with obvious placeholders. Do not invent the real address, phone number, email, hours, license number, or financing terms. Replace the placeholders when those details are available.

Also set `NEXT_PUBLIC_SITE_URL` in Cloudflare so canonical URLs, Open Graph tags, and `sitemap.xml` use the production domain.

## Inventory

All vehicles are stored in `data/cars.json`. Next.js reads that file at build time and generates:

- `/inventory`
- `/inventory/[slug]`

Adding a car does **not** require creating a new React or Next.js page.

Each vehicle supports:

```text
id
slug
year
make
model
trim
price
mileage
vin
engine
transmission
drivetrain
exteriorColor
interiorColor
description
status
featured
images
```

`status` may be `available`, `pending`, or `sold`. Featured homepage vehicles must have `featured: true` and `status: "available"`.

## Add a vehicle

```bash
npm run add-car
```

The command asks for year, make, model, trim, price, mileage, VIN, engine, transmission, drivetrain, colors, featured flag, description, and an optional image folder. It validates the input, creates a URL-friendly slug, and appends the vehicle to `data/cars.json`.

Non-interactive example:

```bash
npm run add-car -- \
  --year 2017 \
  --make Honda \
  --model Civic \
  --trim LX \
  --price 12995 \
  --mileage 88000 \
  --vin NPCSAMPLE00000099 \
  --engine "1.5L 4 Cylinder" \
  --transmission Automatic \
  --drivetrain FWD \
  --exterior White \
  --interior Black \
  --featured no \
  --description "2017 Honda Civic LX listed by Yousef Motors." \
  --images ./incoming/civic
```

## Upload vehicle images

Store images like this:

```text
public/cars/2020-toyota-camry-se/front.webp
public/cars/2020-toyota-camry-se/rear.webp
public/cars/2020-toyota-camry-se/side.webp
public/cars/2020-toyota-camry-se/interior.webp
```

Use WebP. Keep the gallery files large enough for the detail page. The add-car command can also import a folder of `.webp`, `.jpg`, or `.png` files. It converts them to WebP and writes a smaller `-card.webp` version for inventory thumbnails so listing pages do not load the full-resolution files.

If you add images by hand:

1. Create `public/cars/{slug}/`
2. Add `front.webp`, `rear.webp`, and any other views
3. Add matching `front-card.webp` files at about 800px wide
4. Put the gallery paths, not the `-card` paths, in `data/cars.json`

After changing inventory or images, commit and push. Cloudflare rebuilds the site.

## Edit a vehicle

```bash
npm run edit-car
```

Or edit `data/cars.json` directly. Keep the `slug` stable if the vehicle URL should stay the same.

## Mark a vehicle sold

```bash
npm run mark-sold
```

This changes `status` to `sold` and turns off `featured`. The listing remains on the site and the URL continues to work.

## Delete a vehicle

```bash
npm run remove-car
```

This removes the vehicle from `data/cars.json` and deletes `public/cars/{slug}/`.

## List inventory

```bash
npm run list-cars
```

## Vehicle inquiries and Web3Forms

Vehicle listing pages use `components/VehicleInquiryForm.tsx`. The form receives the current vehicle as a prop, so every listing automatically includes that vehicle's year, make, model, trim, price, mileage, VIN, ID, and page URL. Customers only enter their name, email, phone, and message.

The email subject looks like:

```text
New Vehicle Inquiry: 2017 Toyota Camry SE
```

The customer's email is sent as the Web3Forms `replyto` address so Reply in the inbox goes to the customer.

### Create a Web3Forms access key

1. Open [https://web3forms.com](https://web3forms.com).
2. Create an access key with the dealership inbox as the destination email.
3. Copy the access key. Restrict it to your domain in the Web3Forms dashboard.

To change the destination email later, update the email attached to that access key in the Web3Forms dashboard. You do not need to change the website code.

### Local environment variable

Create `.env.local` in the project root:

```text
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your-access-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env.local` is listed in `.gitignore` and must never be committed.

Restart `npm run dev` after changing the key. Next.js inlines `NEXT_PUBLIC_` values at build time.

### Cloudflare environment variable

Because this site is a static export, Cloudflare must have the key **before the production build**.

1. Open the Cloudflare Pages project.
2. Go to **Settings → Environment variables**.
3. Add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` for Production (and Preview if you want form tests on preview URLs).
4. Add `NEXT_PUBLIC_SITE_URL` with the live domain, such as `https://your-domain.com`.
5. Redeploy so the new values are baked into the static JavaScript.

An optional Cloudflare Function remains at `functions/api/contact.js` if you later want the key off the client. The default vehicle inquiry form posts directly to Web3Forms.

### Test an inquiry

1. Run `npm run dev`.
2. Open two different inventory pages.
3. Submit a message from each page.
4. Confirm the inbox shows two subjects, each naming the correct vehicle.
5. Confirm Reply addresses the customer email you entered.

Use an invalid email or leave Name/Message empty to confirm the browser blocks those submissions. A missing or incorrect access key should show:

```text
Sorry, we couldn't send your inquiry. Please try again.
```

A successful send shows:

```text
Thank you! Your inquiry has been sent. We'll get back to you soon.
```

## Deploy to Cloudflare Pages

This site is a **static HTML export**. Do not use the regular Next.js or OpenNext Worker preset. That path runs `npx opennextjs-cloudflare build` and fails looking for `.next/standalone/.next/server/pages-manifest.json`.

Use these exact build settings:

| Setting | Value |
| --- | --- |
| Framework preset | **Next.js (Static HTML Export)** |
| Production branch | `main` |
| Build command | `npx next build` |
| Build directory | `out` |
| Node version | `20` or later |

If an existing Cloudflare project is already using OpenNext:

1. Open the project → **Settings** → **Build configuration**.
2. Change the framework preset to **Next.js (Static HTML Export)**.
3. Set the build command to `npx next build`.
4. Set the build output directory to `out`.
5. Save and **Retry deployment**.

If the project was created as a Worker instead of Pages, create a new **Pages** project, import `yousef-motors`, and use the static export settings above.

1. Create a GitHub repository.
2. Push this project to the production branch, usually `main`.

```bash
git init
git add .
git commit -m "Add Yousef Motors dealership website"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

3. In Cloudflare, open **Workers & Pages**.
4. Create a Pages project and import the GitHub repository.
5. Use the **Next.js (Static HTML Export)** preset:

   | Setting | Value |
   | --- | --- |
   | Production branch | `main` |
   | Build command | `npx next build` |
   | Build directory | `out` |
   | Node version | `20` or later |

6. Add environment variables:

   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com`
   - `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` = your Web3Forms access key

7. Deploy.

Every push to the production branch rebuilds and publishes the site. Pull requests receive preview deployments.

## Custom domain

1. In the Cloudflare Pages project, open **Custom domains**.
2. Add the domain.
3. If the domain is already on Cloudflare, the DNS record is created for you.
4. If the domain is elsewhere, add the CNAME Cloudflare displays.
5. Update `NEXT_PUBLIC_SITE_URL` and `data/dealership.ts` so SEO tags use the real domain.

## Automatic deployments

Cloudflare watches the connected GitHub repository. A push to `main` builds the static export from `data/cars.json` and `public/cars/`. That is the normal way to publish inventory changes: edit the data or run a CLI command, commit, and push.

## Local inventory images

The sample vehicles use generated WebP plates so the site can be developed without stock photos. Replace those files with real vehicle photography before launch. Keep the same filenames or update the `images` array for that vehicle.

To regenerate the sample art:

```bash
npm run generate-sample-images
```

## Notes

- Next.js Image Optimization is disabled because static Cloudflare exports have no image optimizer. Source files are already WebP. `next/image` is still used for dimensions, lazy loading, and fetch priority.
- Unknown vehicle slugs return the 404 page. Only slugs present in `data/cars.json` are generated.
- Do not add a database, AWS, Docker, or an admin app unless inventory volume requires it. Cloudflare R2 is a later option if the image library becomes large.
