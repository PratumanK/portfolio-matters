# Portfolio Matters — Frontend Application

A dark-themed stock portfolio analysis dashboard engineered with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Recharts**, **Lucide React**, and **Axios**.

---

## 1. Quick Start Guide

### Step 1: Start the Backend (Project Root)

From the project root (`c:\portfolio-matters`):

```bash
# Install backend dependencies (if not already installed)
npm install

# Start backend server in development mode (listens on port 3001)
npm run dev

# Or build and start production backend
npm run build
npm start
```

### Step 2: Start the Frontend (`frontend/` Directory)

Open a new terminal and navigate to `frontend/`:

```bash
cd frontend

# Install frontend dependencies (if not already installed)
npm install

# Start Vite development server (listens on port 5173 with proxy to backend)
npm run dev

# Or build for production
npm run build
npm run preview
```

Open your browser at `http://localhost:5173`.

---

## 2. Environment Variables

### Frontend (`frontend/.env`)

```env
# Optional in development (Vite dev server proxies /api and /auth to http://localhost:3001)
# For direct cross-origin access in production, specify your backend URL:
VITE_API_BASE_URL=
```

A documented template is provided in `frontend/.env.example`.

---

## 3. Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite 8 (with Tailwind CSS v4 Vite plugin)
- **Styling:** Tailwind CSS (custom dark financial color scheme, deep navy `#070b14` and `#0b101d`)
- **Routing:** React Router v7 (`react-router-dom`)
- **HTTP Client:** Axios (centralized client with JWT request interceptor and 401 handling)
- **Charts & Visualization:** Recharts (Sector Allocation Pie Chart, Simulation Comparison Chart)
- **Iconography:** Lucide React

---

## 4. Application Architecture

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/                # Centralized Axios client & services
│   │   ├── client.ts       # Axios instance, token interceptor, error parser
│   │   ├── auth.api.ts     # Login & Register endpoints
│   │   ├── stocks.api.ts   # Stock search and pagination endpoints
│   │   ├── wishlist.api.ts # Wishlist and price alert endpoints
│   │   ├── holdings.api.ts # Add and sell holdings endpoints
│   │   └── portfolio.api.ts# Summary, sector, top movers, returns, simulation
│   ├── components/
│   │   ├── charts/         # SectorPieChart, SimulationComparisonChart, PerformanceBarChart
│   │   └── common/         # StatCard, Modal, Button, Input, Badge, EmptyState, LoadingSpinner, AlertBanner, ProtectedRoute
│   ├── context/
│   │   └── AuthContext.tsx # Reactive auth state, localStorage JWT management, user session
│   ├── layouts/
│   │   ├── AppLayout.tsx   # Authenticated layout with desktop sidebar and responsive mobile drawer
│   │   └── PublicLayout.tsx# Public landing layout with navigation and footer
│   ├── pages/
│   │   ├── LandingPage.tsx # Public marketing & UI component preview
│   │   ├── LoginPage.tsx   # Login page (accepts username or email)
│   │   ├── RegisterPage.tsx# Registration with schema validation
│   │   ├── DashboardPage.tsx# Main dashboard with live summary cards, sector pie, top movers, quick watchlist
│   │   ├── PortfolioPage.tsx# Holdings buy/sell forms, valuation summary, API status report
│   │   ├── StocksPage.tsx  # Stock search, pagination, wishlist toggle, price alert modal
│   │   ├── WishlistPage.tsx# Saved stocks list, alert rules, trigger status, remove actions
│   │   ├── AnalyticsPage.tsx# Simulation stress-test slider, HHI risk metrics, historical returns, sector allocation
│   │   └── NotFoundPage.tsx# 404 page
│   ├── types/
│   │   └── index.ts        # TypeScript definitions matching backend models & schemas
│   ├── utils/
│   │   └── formatters.ts   # Currency (₹ INR), percentages, numbers, and dates
│   ├── App.tsx             # Root router configuration
│   ├── index.css           # Tailwind CSS imports and dark theme setup
│   └── main.tsx            # DOM entry point
├── package.json            # Independent frontend dependencies and scripts
└── vite.config.ts          # Vite configuration with Tailwind CSS & API proxying
```

---

## 5. Endpoints Integrated

| Module | Method & Route | Backend Controller | Description |
|---|---|---|---|
| **Auth** | `POST /auth/register` | `registerUser` | User registration (userName, email, password) |
| **Auth** | `POST /auth/login` | `loginUser` | User login, returns JWT token & user object |
| **Stocks** | `GET /api/stocks` | `getPages` | Paginated stock listings (`page`, `limit`) |
| **Stocks** | `GET /api/stocks/search` | `searchStocks` | Case-insensitive search by company name (`query`) |
| **Wishlist** | `GET /api/wishlist` | `showWishlist` | User's saved stocks and alert statuses |
| **Wishlist** | `POST /api/wishlist/:stockId` | `addToWishlist` | Add stock to wishlist |
| **Wishlist** | `DELETE /api/wishlist/:stockId` | `removeFromWishlist` | Remove stock from wishlist |
| **Wishlist** | `POST /api/wishlist/alert` | `setPrice` | Set price alert (`stockId`, `alertPrice`, `alertType`) |
| **Holdings** | `POST /api/holdings/add` | `buyHolding` | Buy holding (`stockId`, `quantity`, `buyPrice`) |
| **Holdings** | `PUT /api/holdings/sell` | `sellHolding` | Sell holding (`stockId`, `quantity`) |
| **Summary** | `GET /api/summary` | `getPortfolioSummary` | Total invested, current valuation, net P&L |
| **Summary** | `GET /api/summary/sector` | `getSectorSummary` | Sector allocation breakdown and percentages |
| **Summary** | `GET /api/summary/topMovers` | `getTopMovers` | Top gainer and top loser holdings |
| **Summary** | `GET /api/summary/return` | `getReturn` | Period returns from snapshot history (`days`) |
| **Summary** | `GET /api/summary/simulation`| `getSimulation` | Hypothetical market simulation (`marketChangePercent`) |

---

## 6. Backend Integration Analysis & Minor Fixes

1. **Browser GET Compatibility for Analytics (`portfolio.controller.ts`)**:
   - `GET /api/summary/return` and `GET /api/summary/simulation` were reading input parameters exclusively from `req.body`. Standard browser environments (fetch / XMLHttpRequest) drop the payload on GET requests.
   - **Fix Applied:** Enabled fallback reading from query parameters (`req.query.days ?? req.body?.days` and `req.query.marketChangePercent ?? req.body?.marketChangePercent`). This ensures 100% backward compatibility with existing tests/tools while enabling native browser requests.
2. **Backend Root `tsconfig.json`**:
   - Added `"include": ["src/**/*"]` to prevent the root backend TypeScript compiler from attempting to compile the nested frontend directory.
3. **Holdings Retrieval Limitation**:
   - The backend exposes routes to add (`POST /api/holdings/add`) and sell (`PUT /api/holdings/sell`), which successfully update portfolio valuation. However, there is no `GET /api/holdings` endpoint for listing individual holding positions.
   - Per prompt rules, **no fake data was fabricated**. The UI clearly explains this backend limitation, shows live summary metrics, and documents the recommended smallest backend addition.
4. **Stock Filter Route**:
   - `GET /api/stocks/filter` in `stock.routes.ts` is routed to `getStockBySymbol` which expects `req.params.symbol`, but no path parameter is defined on `/filter`. Stock exploration uses the fully functional pagination and search endpoints instead.
