# IEEE BUBT Student Branch Website

A modern Next.js 14 web experience for the IEEE Bangladesh University of Business & Technology (BUBT) Student Branch. The site highlights events, volunteers, galleries, and contact information while integrating MongoDB for structured content storage and Cloudinary for media hosting.

## Features

- ⚡️ **App Router + TypeScript** powered by Next.js 14
- 🎨 Tailwind CSS design system inspired by IEEE brand
- 🗂️ MongoDB (Mongoose) models for events, team members, and gallery items
- ☁️ Cloudinary utilities for secure image management and upload signatures
- 🔄 RESTful API routes with Zod validation for CRUD operations
- 📸 Responsive components: hero, events grid, team cards, gallery, newsletter CTA
- ✅ ESLint + Prettier configuration for consistent formatting

## Getting Started

### 1. Prerequisites

- Node.js 18.18 or later
- npm 9+ (bundled with Node.js)
- A MongoDB Atlas cluster (or locally accessible MongoDB instance)
- Cloudinary account

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file at the project root and copy the template values:

```bash
copy .env.example .env.local
```

Update the placeholders with your actual credentials:

```dotenv
MONGODB_URI="your mongodb connection string"
MONGODB_DB="ieee-bubt-sb"
CLOUDINARY_CLOUD_NAME="your cloudinary cloud name"
CLOUDINARY_API_KEY="your api key"
CLOUDINARY_API_SECRET="your api secret"
NEXT_PUBLIC_BASE_URL="https://your-domain.example"
```

### 4. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to view the site locally. The server reloads automatically on file changes.

## Project Structure

```text
src/
  app/              # App Router routes & layout
    api/            # REST API endpoints for events, team, gallery
  components/       # Reusable UI components
  lib/              # Database & Cloudinary helpers, server actions
  models/           # Mongoose models
  styles/           # Tailwind global stylesheet
  utils/            # Metadata, validation schemas, helpers
```

## API Overview

Base path: `/api`

- `GET /api/events` — list events
- `POST /api/events` — create event
- `GET /api/events/:id` — fetch single event
- `PATCH /api/events/:id` — update event
- `DELETE /api/events/:id` — remove event

Equivalent CRUD endpoints exist for `/api/team` and `/api/gallery`.

> All write routes expect JSON payloads validated with Zod. Ensure the request body matches the schemas in `src/utils/validators.ts`.

## Database Seeding (optional)

A `scripts/seed.ts` placeholder is available for custom seeding logic. Implement your preferred data bootstrap process there and run:

```bash
npm run seed
```

## Cloudinary Integration

- `src/lib/cloudinary.ts` configures the SDK and exposes a helper for generating unsigned upload signatures.
- Use the `/api/gallery` routes to persist Cloudinary public IDs and URLs in MongoDB.

## Linting & Formatting

```bash
npm run lint
```

Prettier is configured via `.prettierrc`. Tailwind takes care of most utility-class styling.

## Deployment

1. Provision environment variables on your hosting provider (Vercel recommended).
2. Ensure MongoDB network access allows your deployment.
3. Deploy with `vercel` or your platform of choice.

## Next Steps

- Replace placeholder imagery and copy with real IEEE BUBT assets.
- Build an authenticated admin dashboard (NextAuth, Clerk, etc.) for managing content.
- Set up ISR or On-Demand Revalidation when content changes.
- Integrate analytics (e.g., Vercel Analytics or Google Analytics 4).

---

Maintained with ❤️ for the IEEE BUBT Student Branch community.
