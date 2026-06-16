# Clothes Store

A clothes web store that works online and offline. Browse products offline (read-only), buy/pay only when online with Cash on Delivery (COD).

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Offline:** Service Worker + IndexedDB
- **Desktop:** Electron (Phase 6)
- **Hosting:** Vercel (Phase 7)

## Project Structure

```
clothes-store/
├── web/              # Next.js app
├── desktop/          # Electron app
├── reports/          # Phase PDF reports
├── scripts/          # Build/utility scripts
└── package.json      # Monorepo root
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Phase Reports

After each phase, a PDF report is generated in the `/reports` folder explaining what was done.
