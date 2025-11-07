This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## MongoDB setup (local development)

This project now uses MongoDB for server-side data storage. Follow these steps to configure it locally:

1. Create a MongoDB cluster (e.g. MongoDB Atlas) or run a local MongoDB instance.
2. Copy `.env.example` to `.env.local` (or use `.env` for local development) and fill in `MONGODB_URI` and `MONGODB_DB`.

Example:

```env
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority"
# Super Mall

Super Mall is a small e-commerce demo built with Next.js (App Router), React, Tailwind CSS and Firebase (Auth, Firestore and Storage). It includes both a public storefront and an admin area for managing categories, floors, offers, and shops.

This README explains how to get the project running locally, which environment variables you need, an overview of the code layout, and a few troubleshooting tips.

## Built with
- Next.js (App Router)
- React
- Tailwind CSS
- Firebase (Authentication, Firestore, Storage)
- Lucide Icons

## Quick start

Requirements: Node.js (v16+ recommended), npm (or pnpm/yarn).

1. Install dependencies

```powershell
npm install
```

2. Create a `.env.local` file at the repository root and add the Firebase configuration and any other env variables (see below).

3. Run the dev server

```powershell
npm run dev
# opens at http://localhost:3000
```

4. Build for production

```powershell
npm run build
npm run start
```

## Environment variables

Create a `.env.local` file and provide your Firebase config values. Example keys used by this project (prefix with NEXT_PUBLIC_ for client access):

```
NEXT_PUBLIC_FIREBASE_API_KEY=yourApiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourProject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourProjectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourProject.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=yourAppId

# Optional (if used elsewhere)
NEXT_PUBLIC_SOME_OTHER_KEY=...
```

Note: Keep any sensitive server-only keys out of client code. This project only requires the public Firebase config on the client; server-side credentials (if any) should be configured in your deployment environment.

## Firebase setup (short)
1. Create a Firebase project in the Firebase Console.
2. Enable Email/Password Authentication (or other providers you need).
3. Create a Firestore database (in test or production mode depending on your needs).
4. Create a Storage bucket for images.
5. Register a Web App in Firebase and copy the config values into `.env.local`.

If you want seed data (categories, floors, offers), you can either use the admin UI included in the app or write a small script to populate Firestore.

## Project structure (important parts)

- `app/` — Next.js App Router pages and layouts. Key routes:
	- `app/page.jsx` — homepage
	- `app/store/*` — store pages
	- `app/category/[id]/page.jsx` — individual category pages (route needs `id` param)
	- `app/floor/[id]/page.jsx` — floor pages
	- `app/(auth)/*` — auth routes (login, signup, forgot password)
	- `app/admin/*` — admin dashboard and CRUD pages
- `app/components/Header.jsx` — top navigation and category dropdown
- `contexts/AuthContext.jsx` — authentication provider and helper hooks
- `lib/firestore/` — Firestore helpers split by domain (categories, floors, offers, shop)
- `public/` — static assets
- `globals.css` — Tailwind entry

This project uses server-side helpers named like `read_server.jsx` for data fetching from Firestore on the server and `read.jsx` for client-side helpers.

## How categories & routing work

- Categories are read from Firestore and each category object is expected to contain an `id` (document id) and a `name`.
- The header dropdown links to `/category/[id]` where `[id]` is the category's `id` value.

If clicking a category link doesn't navigate to the category page, check these:
- Ensure `app/category/[id]/page.jsx` exists and exports a React component.
- Confirm the category objects returned by `getCategories()` include the `id` property used in the link (not an internal field like `_id` or `docId`).
- Look at the browser console and Next.js server output for navigation or runtime errors.

## Common commands

```powershell
npm install        # install deps
npm run dev        # dev server
npm run build      # build for production
npm run start      # run production build
```

## Troubleshooting tips

- Category clicks not navigating: inspect `app/components/Header.jsx` and the data returned by `lib/firestore/categories/read_server.jsx`. The dropdown uses `<Link href={`/category/${cat.id}`}>` — missing/incorrect `id` is the most common cause.
- Firebase permission / rules errors: check Firestore and Storage rules in the Firebase Console. During development you may use permissive rules, but protect production data.
- Styling issues: Tailwind is configured in `postcss.config.mjs` and `globals.css`. If CSS isn't applied, ensure PostCSS/Tailwind dependencies are installed and `globals.css` is imported in `app/layout.jsx`.

## Contributing

If you'd like to contribute, please open issues or PRs. Small, focused PRs are easiest to review. Typical contribution areas:
- Fixing UI or routing bugs
- Improving type-safety/tests
- Adding seed scripts for initial data

## Next steps / TODOs
- Add automated tests (unit + integration) for header/navigation
- Add a seed script for Firestore to populate categories, floors and offers
- Add CI workflow for linting and builds

---

If you'd like, I can also:
- Fix the header category navigation bug you reported (I can inspect `Header.jsx` and the category read helper and submit a patch), or
- Add a small seed script and instructions to populate Firestore with example categories and floors.

Tell me which of the above you'd like me to do next.
