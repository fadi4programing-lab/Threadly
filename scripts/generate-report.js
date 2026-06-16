const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generatePhaseReport(phaseNumber, title, content) {
  const doc = new PDFDocument({ margin: 50 });
  const outputPath = path.join(
    __dirname,
    "..",
    "reports",
    `phase-${phaseNumber}-${title.toLowerCase().replace(/\s+/g, "-")}.pdf`
  );

  doc.pipe(fs.createWriteStream(outputPath));

  // Title
  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .text(`Phase ${phaseNumber}: ${title}`, { align: "center" });

  doc.moveDown(0.5);

  // Subtitle
  doc
    .fontSize(12)
    .font("Helvetica")
    .text("Clothes Store Project", { align: "center" });

  doc.moveDown(0.5);

  // Date
  doc
    .fontSize(10)
    .text(`Generated: ${new Date().toLocaleDateString()}`, { align: "center" });

  doc.moveDown(1);

  // Divider
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1);

  // Content sections
  content.forEach((section) => {
    // Section title
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(section.title);

    doc.moveDown(0.3);

    // Section content
    doc.fontSize(11).font("Helvetica");

    if (Array.isArray(section.items)) {
      section.items.forEach((item) => {
        doc.text(`  •  ${item}`, { indent: 20 });
      });
    } else {
      doc.text(section.content, { indent: 20 });
    }

    doc.moveDown(0.8);
  });

  // Footer
  doc.moveDown(1);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Clothes Store - Phase Report", { align: "center" });

  doc.end();

  console.log(`Report generated: ${outputPath}`);
  return outputPath;
}

// Phase 1 Report
generatePhaseReport(1, "Setup", [
  {
    title: "Summary",
    content:
      "Initialized the monorepo project structure with Next.js frontend, Electron desktop placeholder, and Supabase configuration. The project is ready for development.",
  },
  {
    title: "Files Created",
    items: [
      "package.json (root monorepo)",
      "web/package.json (Next.js app)",
      "web/src/app/layout.tsx (root layout)",
      "web/src/app/page.tsx (homepage)",
      "web/src/middleware.ts (Supabase auth middleware)",
      "web/src/lib/supabase/client.ts (browser client)",
      "web/src/lib/supabase/server.ts (server client)",
      "web/src/lib/supabase/middleware.ts (session handler)",
      "web/.env.local.example (env template)",
      "desktop/package.json (Electron placeholder)",
      "desktop/src/main.ts (Electron placeholder)",
      "README.md (project documentation)",
    ],
  },
  {
    title: "Dependencies Installed",
    items: [
      "next@16.2.9 - React framework",
      "react@19.2.4 - UI library",
      "react-dom@19.2.4 - React DOM",
      "@supabase/supabase-js - Supabase client",
      "@supabase/ssr - Server-side rendering support",
      "idb - IndexedDB wrapper (for offline support)",
      "lucide-react - Icon library",
      "clsx - Class name utility",
      "date-fns - Date formatting",
      "tailwindcss - CSS framework",
      "typescript - Type safety",
      "pdfkit - PDF report generation",
    ],
  },
  {
    title: "Folder Structure Created",
    items: [
      "web/src/lib/supabase/ - Supabase client configs",
      "web/src/lib/hooks/ - Custom React hooks",
      "web/src/lib/offline/ - Offline support utilities",
      "web/src/components/ui/ - UI components",
      "web/src/components/product/ - Product components",
      "web/src/components/cart/ - Cart components",
      "web/src/components/admin/ - Admin components",
      "web/src/app/(auth)/ - Auth pages (login, register)",
      "web/src/app/(shop)/ - Shop pages (products, cart)",
      "web/src/app/(dashboard)/ - User dashboard",
      "web/src/app/admin/ - Admin panel",
      "web/src/app/api/ - API routes",
      "desktop/src/ - Electron source",
      "reports/ - Phase PDF reports",
      "scripts/ - Build scripts",
    ],
  },
  {
    title: "Key Decisions",
    items: [
      "Used Next.js 16 with App Router (latest stable)",
      "Supabase for database, auth, and storage",
      "Monorepo with npm workspaces",
      "TypeScript for type safety",
      "Tailwind CSS v4 for styling",
      "PDFKit for generating phase reports",
    ],
  },
  {
    title: "How to Run",
    content: "npm install && npm run dev",
  },
  {
    title: "Next Phase Preview",
    content:
      "Phase 2 will implement the backend: database schema in Supabase, API routes for products/categories/orders, authentication flow, and admin middleware.",
  },
]);

// Phase 2 Report
generatePhaseReport(2, "Backend", [
  {
    title: "Summary",
    content:
      "Built the complete backend with database schema, TypeScript types, and 12 API routes covering products, categories, orders, wishlist, reviews, authentication, and admin stats. Row Level Security (RLS) policies protect all data.",
  },
  {
    title: "Database Schema Created",
    items: [
      "categories - Product categories with name, slug, image",
      "products - Name, description, price, sale_price, images[], sizes[], colors[], stock, is_active, is_featured",
      "orders - User orders with items JSONB, total, status enum (pending/confirmed/shipped/delivered/cancelled)",
      "wishlist - User-product wishlist associations",
      "reviews - User reviews with rating (1-5) and comment",
      "profiles - Extends Supabase auth.users with full_name, phone, role (user/admin)",
    ],
  },
  {
    title: "Database Features",
    items: [
      "UUID primary keys for all tables",
      "Row Level Security (RLS) on all tables",
      "Auto-create profile on user signup (trigger)",
      "Auto-update updated_at timestamp (trigger)",
      "Indexes on foreign keys and frequently queried columns",
      "Order status enum for type safety",
    ],
  },
  {
    title: "API Routes Created",
    items: [
      "GET /api/products - List products (filter by category, search, featured, pagination)",
      "POST /api/products - Create product (admin only)",
      "GET /api/products/[id] - Get product detail",
      "PUT /api/products/[id] - Update product (admin only)",
      "DELETE /api/products/[id] - Delete product (admin only)",
      "GET /api/categories - List all categories",
      "POST /api/categories - Create category (admin only)",
      "GET /api/orders - List orders (users see own, admins see all)",
      "POST /api/orders - Create order (COD checkout)",
      "PUT /api/orders - Update order status (admin only)",
      "GET/POST/DELETE /api/wishlist - Manage wishlist",
      "GET/POST /api/reviews - List and create reviews",
      "POST /api/auth/register - User registration",
      "POST /api/auth/login - User login",
      "POST /api/auth/logout - User logout",
      "GET /api/auth/user - Get current user + profile",
      "GET /api/admin/stats - Dashboard stats (admin only)",
    ],
  },
  {
    title: "Security",
    items: [
      "RLS policies: users can only access their own data",
      "Admin role checks on all mutation routes",
      "Auth middleware protects all API routes",
      "Profile auto-created on signup with user metadata",
    ],
  },
  {
    title: "Files Created",
    items: [
      "supabase/migrations/001_initial_schema.sql",
      "src/lib/types.ts",
      "src/app/api/products/route.ts",
      "src/app/api/products/[id]/route.ts",
      "src/app/api/categories/route.ts",
      "src/app/api/orders/route.ts",
      "src/app/api/wishlist/route.ts",
      "src/app/api/reviews/route.ts",
      "src/app/api/auth/register/route.ts",
      "src/app/api/auth/login/route.ts",
      "src/app/api/auth/logout/route.ts",
      "src/app/api/auth/user/route.ts",
      "src/app/api/admin/stats/route.ts",
    ],
  },
  {
    title: "How to Use",
    items: [
      "1. Create a Supabase project at supabase.com",
      "2. Run the SQL migration in Supabase SQL Editor",
      "3. Copy URL and Anon Key to web/.env.local",
      "4. Run 'npm run dev' to start the server",
    ],
  },
  {
    title: "How to Run",
    content: "npm run dev",
  },
  {
    title: "Next Phase Preview",
    content:
      "Phase 3 will build the frontend: UI components (buttons, cards, modals), product listing with filters, product detail page, shopping cart, checkout flow, and user dashboard.",
  },
]);

// Phase 3 Report
generatePhaseReport(3, "Frontend", [
  {
    title: "Summary",
    content:
      "Built the complete frontend with reusable UI components, product browsing, shopping cart, checkout flow, authentication pages, and user dashboard. The app supports online/offline detection and blocks checkout when offline.",
  },
  {
    title: "UI Components Created",
    items: [
      "Button - 5 variants (primary/secondary/outline/ghost/danger), 3 sizes",
      "Input - With label, error state, proper styling",
      "Modal - Overlay, escape key close, 3 sizes",
      "Badge - 4 variants (default/success/warning/danger)",
      "Skeleton - Loading placeholder with animation",
    ],
  },
  {
    title: "Layout Components",
    items: [
      "Navbar - Sticky header with logo, nav links, online/offline indicator, cart badge",
      "Footer - 4-column grid with links",
      "CartDrawer - Slide-in drawer with item management",
      "Shop layout - Wraps pages with Navbar + Footer + CartDrawer",
    ],
  },
  {
    title: "Pages Built",
    items: [
      "Homepage - Hero section with CTA buttons",
      "/products - Product grid with search, category filters, pagination",
      "/products/[id] - Product detail with images, sizes, colors, reviews",
      "/checkout - Order summary + address form + COD confirmation",
      "/login - Email/password login form",
      "/register - Full registration form (name, email, phone, password)",
      "/dashboard - User profile with logout",
      "/dashboard/orders - Order history with status badges",
      "/dashboard/wishlist - Wishlist grid with remove button",
    ],
  },
  {
    title: "Custom Hooks",
    items: [
      "useCart - Cart state with localStorage persistence, add/remove/update/clear",
      "useOnlineStatus - Browser online/offline detection",
    ],
  },
  {
    title: "Key Features",
    items: [
      "Online/offline detection with visual indicator in navbar",
      "Cart persisted to localStorage (survives page refresh)",
      "Checkout blocked when offline with clear message",
      "Product search and category filtering",
      "Size and color selection on product detail",
      "Review display with star ratings",
      "Order status badges (pending/confirmed/shipped/delivered/cancelled)",
      "Responsive design (mobile + desktop)",
    ],
  },
  {
    title: "Files Created",
    items: [
      "src/components/ui/ (Button, Input, Modal, Badge, Skeleton, index)",
      "src/components/Navbar.tsx",
      "src/components/Footer.tsx",
      "src/components/product/ProductCard.tsx",
      "src/components/cart/CartDrawer.tsx",
      "src/lib/hooks/useCart.tsx",
      "src/lib/hooks/useOnlineStatus.ts",
      "src/app/(shop)/layout.tsx",
      "src/app/(shop)/products/page.tsx",
      "src/app/(shop)/products/[id]/page.tsx",
      "src/app/(shop)/checkout/page.tsx",
      "src/app/(auth)/login/page.tsx",
      "src/app/(auth)/register/page.tsx",
      "src/app/(dashboard)/layout.tsx",
      "src/app/(dashboard)/page.tsx",
      "src/app/(dashboard)/orders/page.tsx",
      "src/app/(dashboard)/wishlist/page.tsx",
    ],
  },
  {
    title: "How to Run",
    content: "npm run dev",
  },
  {
    title: "Next Phase Preview",
    content:
      "Phase 4 will build the admin panel: dashboard with stats, product management (CRUD with image upload), order management (status updates), and user management.",
  },
]);

module.exports = { generatePhaseReport };

// Phase 4 Report
generatePhaseReport(4, "Admin Panel", [
  {
    title: "Summary",
    content:
      "Built the admin panel with sidebar navigation, dashboard with stats, product management (list/create/edit/delete), order management with status updates, and user management placeholder.",
  },
  {
    title: "Admin Pages Created",
    items: [
      "/admin - Dashboard with stats cards (products, orders, users, revenue)",
      "/admin/products - Product list table with edit/delete actions",
      "/admin/products/new - Create new product form",
      "/admin/products/[id] - Edit existing product form",
      "/admin/orders - Order list with status dropdown updates",
      "/admin/users - User management (placeholder for Supabase dashboard)",
    ],
  },
  {
    title: "Admin Layout",
    items: [
      "Sidebar with navigation links",
      "Active state highlighting",
      "Back to Store link",
      "Responsive design",
    ],
  },
  {
    title: "Product Management",
    items: [
      "List all products in a table with image, price, stock, status",
      "Create new product with all fields",
      "Edit existing product",
      "Delete product with confirmation",
      "Category selection dropdown",
      "Image URL input (comma-separated)",
      "Size and color input (comma-separated)",
      "Active and Featured toggles",
    ],
  },
  {
    title: "Order Management",
    items: [
      "List all orders with date, status, address, phone, items, total",
      "Status dropdown to update order status",
      "Real-time status update without page reload",
      "Status badges with color coding",
    ],
  },
  {
    title: "Files Created",
    items: [
      "src/app/admin/layout.tsx",
      "src/app/admin/page.tsx",
      "src/app/admin/products/page.tsx",
      "src/app/admin/products/[id]/page.tsx",
      "src/app/admin/orders/page.tsx",
      "src/app/admin/users/page.tsx",
    ],
  },
  {
    title: "How to Run",
    content: "npm run dev",
  },
  {
    title: "Next Phase Preview",
    content:
      "Phase 5 will implement offline support: Service Worker for caching, IndexedDB for local data storage, online/offline detection, and sync queue for offline actions.",
  },
]);

// Phase 5 Report
generatePhaseReport(5, "Offline Support", [
  {
    title: "Summary",
    content:
      "Implemented complete offline support with Service Worker for caching, IndexedDB for local data storage, sync queue for offline actions, and online/offline detection with visual indicators.",
  },
  {
    title: "Service Worker",
    items: [
      "Caches static assets (HTML, CSS, JS) on install",
      "Network-first strategy for pages (fallback to cache)",
      "Skips API calls and admin pages (always fresh)",
      "Automatic cache cleanup on activation",
      "Offline page fallback for navigation requests",
    ],
  },
  {
    title: "IndexedDB Database",
    items: [
      "products - Cache product data for offline browsing",
      "categories - Cache category data",
      "cart - Persist cart items offline",
      "wishlist - Persist wishlist items offline",
      "sync-queue - Queue actions for when back online",
    ],
  },
  {
    title: "Offline Features",
    items: [
      "Browse products offline (from IndexedDB cache)",
      "View product details offline",
      "Add to cart offline (persisted to IndexedDB)",
      "Wishlist items persisted offline",
      "Visual offline banner on product pages",
      "Checkout blocked when offline with clear message",
      "Auto-sync when back online",
    ],
  },
  {
    title: "Sync Queue",
    items: [
      "Queue API actions when offline",
      "Process queue automatically when back online",
      "Support for POST, PUT, DELETE methods",
      "Retry failed requests",
      "Clean up completed items",
    ],
  },
  {
    title: "Files Created",
    items: [
      "public/sw.js - Service Worker",
      "src/lib/offline/db.ts - IndexedDB helper",
      "src/lib/offline/sw.ts - SW registration",
      "src/lib/hooks/useSyncQueue.ts - Sync queue hook",
      "src/lib/hooks/useOfflineProducts.ts - Offline data fetching",
      "src/lib/hooks/index.ts - Hooks barrel export",
      "src/components/ServiceWorkerRegistrar.tsx",
    ],
  },
  {
    title: "Files Updated",
    items: [
      "src/app/layout.tsx - Added SW registration",
      "src/app/(shop)/products/page.tsx - Offline caching",
      "src/app/(shop)/products/[id]/page.tsx - Offline caching",
    ],
  },
  {
    title: "How to Run",
    content: "npm run dev",
  },
  {
    title: "Next Phase Preview",
    content:
      "Phase 6 will build the Electron desktop app: wrap the Next.js app, configure electron-builder, and create installers for Windows, Mac, and Linux.",
  },
]);

// Phase 6 Report
generatePhaseReport(6, "Electron Desktop App", [
  {
    title: "Summary",
    content:
      "Built the Electron desktop app that wraps the Next.js web app. Configured electron-builder for packaging into Windows (.exe), Mac (.dmg), and Linux (.AppImage) installers. Added IPC bridge for native features.",
  },
  {
    title: "Electron Setup",
    items: [
      "Main process (main.ts) - Window management, security, lifecycle",
      "Preload script (preload.ts) - Secure IPC bridge with contextIsolation",
      "TypeScript configuration for Electron",
      "electron-builder configuration for all platforms",
    ],
  },
  {
    title: "Desktop Features",
    items: [
      "Native window controls (minimize, maximize, close)",
      "Hidden title bar for modern look",
      "External links open in default browser",
      "Security: contextIsolation, nodeIntegration disabled",
      "Security: webSecurity enabled, no remote access",
      "Window remembers size and position",
    ],
  },
  {
    title: "Build Targets",
    items: [
      "Windows: NSIS installer (.exe) with custom install directory",
      "Mac: DMG installer (.dmg) for x64 and arm64",
      "Linux: AppImage (.AppImage) for x64",
      "Desktop and Start Menu shortcuts",
    ],
  },
  {
    title: "IPC API Exposed",
    items: [
      "electronAPI.getVersion() - Get app version",
      "electronAPI.getPlatform() - Get OS platform",
      "electronAPI.minimize/maximize/close() - Window controls",
      "electronAPI.readFile/writeFile() - File system access",
      "electronAPI.showNotification() - Native notifications",
    ],
  },
  {
    title: "Files Created",
    items: [
      "desktop/package.json - Electron project config",
      "desktop/tsconfig.json - TypeScript config",
      "desktop/src/main.ts - Main process",
      "desktop/src/preload.ts - Preload script",
      "desktop/src/types.ts - Type definitions",
      "desktop/assets/ - App icons directory",
    ],
  },
  {
    title: "How to Build",
    items: [
      "1. First build the web app: cd web && npm run build",
      "2. Copy web/.next to desktop/dist/",
      "3. Install Electron: cd desktop && npm install",
      "4. Build for your platform:",
      "   - Windows: npm run build:win",
      "   - Mac: npm run build:mac",
      "   - Linux: npm run build:linux",
    ],
  },
  {
    title: "Note",
    content:
      "Electron binary download was skipped due to network timeout. Run 'cd desktop && npx electron install' to download it before building.",
  },
  {
    title: "Next Phase Preview",
    content:
      "Phase 7 will deploy the web app to Vercel: push to GitHub, connect to Vercel, configure environment variables, and test the live deployment.",
  },
]);
