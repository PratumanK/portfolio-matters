<div align="center">

# 📈 Portfolio Matters

**Institutional-Grade Equity Tracking, Concentration Risk Analytics & Automated Market Intelligence**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9.1-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.10-22C55E?style=flat-square&logo=chartdotjs&logoColor=white)](https://recharts.org/)
[![JWT](https://img.shields.io/badge/Auth-JWT-FB015B?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Cron](https://img.shields.io/badge/Cron-Node--Cron_4.2-FF6C37?style=flat-square&logo=clock&logoColor=white)](https://www.npmjs.com/package/node-cron)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

<br />

<p align="center">
  <b>Portfolio Matters</b> is an end-to-end full-stack equity intelligence and portfolio management platform. Engineered with a high-performance <b>Node.js / Express</b> micro-architecture, <b>MongoDB</b> aggregation pipelines, and a modern <b>React 19 / TypeScript</b> dark-finance dashboard, it delivers real-time valuation metrics, mathematical concentration scoring via the <b>Herfindahl–Hirschman Index (HHI)</b>, hypothetical sensitivity stress-testing, and automated price-alert watchdogs.
</p>

[Key Features](#-key-features) • [System Architecture](#-system-architecture) • [Technology Stack](#-technology-stack) • [Portfolio Analytics Engine](#-portfolio-analytics-engine) • [API Documentation](#-api-documentation) • [Getting Started](#-getting-started)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
  - [The Problem](#the-problem)
  - [The Solution](#the-solution)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Portfolio Analytics Engine](#-portfolio-analytics-engine)
  - [1. Weighted-Average Cost Basis (WACB)](#1-weighted-average-cost-basis-wacb)
  - [2. Herfindahl–Hirschman Index (HHI) Concentration Analysis](#2-herfindahlhirschman-index-hhi-concentration-analysis)
  - [3. Hypothetical Market Sensitivity Simulation](#3-hypothetical-market-sensitivity-simulation)
  - [4. Multi-Day Historical Snapshot Delta](#4-multi-day-historical-snapshot-delta)
- [Automated Background Cron Engine](#-automated-background-cron-engine)
- [API Documentation](#-api-documentation)
  - [Authentication](#authentication-routes)
  - [Stock Directory & Exploration](#stock-directory--exploration)
  - [Holdings Management](#holdings-management)
  - [Wishlist & Price Alerts](#wishlist--price-alerts)
  - [Summary & Analytics](#summary--analytics)
- [Database Schema Design](#-database-schema-design)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Configure Backend Environment](#2-configure-backend-environment)
  - [3. Install Backend Dependencies & Start](#3-install-backend-dependencies--start)
  - [4. Configure & Start Frontend](#4-configure--start-frontend)
- [Environment Variables](#-environment-variables)
- [Engineering Highlights](#-engineering-highlights)
- [Quality & Verification](#-quality--verification)
- [License & Disclaimer](#-license--disclaimer)

---

## 💡 Overview

### The Problem
Retail equity investors often suffer from poor portfolio hygiene and fragmented tools:
1. **Opaque Exposure & Sector Bias:** Capital slowly concentrates in correlated sectors (e.g., Tech or Financial Services) without the investor recognizing catastrophic downside risk.
2. **Inaccurate Cost Accounting:** Multiple buys and partial liquidations across different market cycles make calculating true weighted acquisition costs tedious and error-prone.
3. **Passive Drawdown Blindness:** Investors have no quantitative mechanism to stress-test their portfolios against hypothetical market swings before crashes occur.
4. **Missed Market Entries & Exits:** Lack of automated price-monitoring tools leaves investors checking quotes manually rather than reacting to defined trigger levels.

### The Solution
**Portfolio Matters** solves these challenges by combining institutional portfolio analytics with an intuitive financial user experience:
- Automatically tracks **Weighted-Average Acquisition Costs** upon every subsequent buy or partial sale.
- Applies the **Herfindahl–Hirschman Index (HHI)** to calculate mathematical concentration risk and portfolio diversification health scores ($0 - 100$).
- Models **Hypothetical Market Shocks** ($-50\%$ to $+50\%$) in real time without fabricating or risking capital.
- Runs an **Automated Nightly Price Watchdog** powered by Node-cron and Nodemailer to notify investors when target price conditions trigger.
- Indexes **2,300+ Active NSE Listed Securities** with instant search, sector filtering, and paginated discovery.

---

## ✨ Key Features

### 💼 Portfolio Management & Position Accounting
- **Weighted-Average Cost Basis (WACB):** Automatically recalculates average purchase prices when adding shares to an existing holding and handles position closures cleanly when quantity reaches zero.
- **Real-Time Valuation:** Derives invested capital, current market valuation, unrealized profit/loss, and ROI yield using MongoDB aggregations.
- **Buy & Sell Workflows:** Intuitive modals with interactive stock search and owned-shares validation.

### 📊 Quantitative Portfolio Analytics & Risk
- **Sector Diversification Modeling:** Computes live sector weighting percentages and visualizes them using interactive Recharts donut charts.
- **Herfindahl–Hirschman Index (HHI):** Rigorous concentration analysis classifying risk into *Low (Diversified)*, *Moderate*, or *High (Concentrated)*.
- **Hypothetical Sensitivity Stress-Testing:** Interactive slider and preset buttons ($-20\%$, $-10\%$, $+10\%$, $+20\%$) to test macro market swings.
- **Top Movers Facet:** Single-pass MongoDB `$facet` aggregation computing the highest-performing gainer and largest drawdown holding.
- **Multi-Day Snapshot Returns:** Period selector ($7\text{D}$, $14\text{D}$, $30\text{D}$, $90\text{D}$) measuring actual performance deltas against archived daily portfolio history.

### 🔍 2,300+ NSE Stock Explorer & Autocomplete
- **Live Search & Autocomplete:** Case-insensitive regex search queryable across 2,300+ NSE symbols and company names.
- **Paginated Browsing:** Scalable server-side pagination with page boundaries, limit controls, and total document counts.
- **Searchable Combobox:** Clean dropdown component allowing instantaneous lookup across the entire alphabet from A to Z.

### 🔔 Automated Watchdog & Price Alerts
- **Custom Price Conditions:** Configure alert thresholds with direction rules (`above` $\ge$ or `below` $\le$).
- **Automated Cron Scanner:** Scheduled daily cron checks live prices against active user alerts.
- **Email Delivery:** Direct dispatch of HTML alert emails via Nodemailer upon trigger conditions, updating alert state to prevent spam.

### 🛡️ Enterprise Security & UX
- **Stateless JWT Authentication:** 24-hour cryptographically signed tokens delivered via `Authorization: Bearer <token>`.
- **Bcrypt Encryption:** Passwords salted and hashed with 10 rounds before persistence.
- **Zod Request Validation:** Enforces strict input validation on registration and transactions.
- **Fintech Dark Design System:** Deep navy and charcoal palette (`#070b14`), color-coded returns (emerald for gains, rose for drawdowns), and strict Indian Rupee (`₹`) formatting.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React 19 + TypeScript + Vite)"]
        UI["Dark Fintech Dashboard"]
        State["AuthContext & LocalStorage Token"]
        Axios["Centralized Axios Client (JWT Interceptor)"]
        UI --> State
        State --> Axios
    end

    subgraph Server ["Backend Gateway (Express 5 + TypeScript)"]
        Router["Express Router (/auth, /api/*)"]
        AuthMid["authMiddleware (JWT Verification)"]
        ZodMid["validateMiddleware (Zod Schema Validation)"]
        
        subgraph Controllers ["Controllers & Services"]
            AuthCtrl["Auth Module\n(register, login)"]
            StockCtrl["Stock Module\n(search, pagination, details)"]
            HoldCtrl["Holdings Module\n(buy, sell, list)"]
            PortCtrl["Portfolio Analytics\n(summary, HHI, simulation, returns)"]
            WishCtrl["Wishlist & Alerts\n(watchlist, alert config)"]
        end
        
        Router --> AuthMid
        AuthMid --> ZodMid
        ZodMid --> AuthCtrl & StockCtrl & HoldCtrl & PortCtrl & WishCtrl
    end

    subgraph Automation ["Background Cron Engine (Node-Cron)"]
        CronStock["Stock Ingestion Cron\n(24 23 * * 1-5)"]
        CronSnap["Portfolio Snapshot Cron\n(55 10 * * 1-5)"]
        CronAlert["Price Alert Watchdog Cron\n(37 23 * * *)"]
    end

    subgraph Database ["Persistence Layer (MongoDB 9.1 via Mongoose)"]
        Users[("Users Collection\n(credentials, wishlist, alerts)")]
        Stocks[("Stocks Collection\n(2,300+ NSE symbols, CMP)")]
        Holdings[("Holdings Collection\n(userId, stockId, qty, avgPrice)")]
        Histories[("Histories Collection\n(daily portfolio valuations)")]
    end

    subgraph External ["External Services"]
        NSE["NSE India Market Feed\n(stock-nse-india provider)"]
        SMTP["Nodemailer SMTP Transporter\n(Price alert notification delivery)"]
    end

    Axios -- "HTTP / REST (Bearer Token)" --> Router
    
    AuthCtrl --> Users
    StockCtrl --> Stocks
    HoldCtrl --> Holdings & Stocks
    PortCtrl --> Holdings & Stocks & Histories
    WishCtrl --> Users & Stocks
    
    CronStock --> NSE
    CronStock -- "Bulk Write Upsert" --> Stocks
    CronSnap -- "Aggregate Total Value" --> Holdings & Stocks
    CronSnap -- "Archive Snapshots" --> Histories
    CronAlert -- "Match Price Triggers" --> Users & Stocks
    CronAlert --> SMTP
```

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | **React** | `19.2.8` | Declarative, component-driven user interface |
| **Frontend Language** | **TypeScript** | `5.9.3` / `6.0` | End-to-end type safety, strict compile checks |
| **Build & Tooling** | **Vite** | `8.3.0` | Ultra-fast HMR development server & production bundler |
| **Styling & CSS** | **Tailwind CSS** | `4.3.3` | Utility-first responsive styling & fintech dark theme |
| **Data Visualization** | **Recharts** | `3.10.1` | Responsive SVG Donut Charts, Bar Charts, & Stress Comparisons |
| **Icons** | **Lucide React** | `1.57.0` | Modern, clean vector iconography |
| **Client Routing** | **React Router** | `7.18.4` | Client-side routing, protected route boundaries |
| **Backend Framework** | **Express.js** | `5.2.1` | RESTful routing, middleware orchestration, and HTTP gateway |
| **Backend Runtime** | **Node.js** | `20+` / `24+` | Native ES modules (`"type": "module"`) execution |
| **Database** | **MongoDB** | `Mongoose 9.1.4` | Document store, compound indexing, and aggregation pipelines |
| **Authentication** | **JSON Web Tokens** | `9.0.3` | Cryptographically signed stateless session tokens (`HS256`) |
| **Password Hashing** | **Bcrypt** | `6.0.0` | Adaptive salted password hashing (10 salt rounds) |
| **Request Validation** | **Zod** | `3.25.76` | Type-inferred runtime schema validation |
| **Job Scheduling** | **Node-cron** | `4.2.1` | POSIX cron-syntax daemon for scheduled automated tasks |
| **Email Delivery** | **Nodemailer** | `8.0.1` | SMTP transport and templated email notification delivery |
| **Market Data** | **stock-nse-india** | `1.3.0` | Live National Stock Exchange (NSE) quotes and symbols |

---

## 📂 Project Structure

```
portfolio-matters/
├── src/                                   # Backend Source Code (Express + TypeScript)
│   ├── config/
│   │   ├── db.ts                          # Mongoose connection bootstrap & error handling
│   │   └── env.ts                         # Environment variable parser
│   ├── jobs/
│   │   ├── alertCheck.jobs.ts             # Nightly price alert cron daemon (37 23 * * *)
│   │   ├── snapshot.jobs.ts               # Weekday portfolio snapshot cron daemon (55 10 * * 1-5)
│   │   └── stockIngestion.jobs.ts         # Weekday NSE stock ingestion cron (24 23 * * 1-5)
│   ├── middlewares/
│   │   ├── auth.middleware.ts             # JWT extraction & signature verification middleware
│   │   └── validate.middleware.ts         # Generic Zod schema validation middleware
│   ├── models/
│   │   ├── history.ts                     # Snapshot schema (userId, totalValue, timestamps)
│   │   ├── holding.ts                     # Position schema (userId, stockId, quantity, avgBuyPrice)
│   │   ├── stock.ts                       # Equity schema (symbol, name, sector, currentPrice)
│   │   └── user.ts                        # User schema (userName, email, password, wishlist)
│   ├── modules/
│   │   ├── auth/                          # User registration, bcrypt hashing, JWT issuance
│   │   ├── holdings/                      # Buy position, sell position, and user holdings listing
│   │   ├── mail/                          # Nodemailer transport & alert HTML templates
│   │   ├── portfolio/                     # Aggregations: Summary, Sector, HHI Risk, Simulation
│   │   ├── stocks/                        # NSE ingestion service, transformer, search, pagination
│   │   └── wishlist/                      # Watchlist items & price alert rule management
│   ├── types/                             # TypeScript interfaces (Auth, Stock, Holding, History, User)
│   ├── validation/                        # Zod schemas (registerSchema, addHoldingSchema, etc.)
│   └── server.ts                          # Express server setup, route registration, cron runners
├── frontend/                              # Frontend Client (React 19 + Vite + Tailwind)
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts                  # Centralized Axios client with JWT interceptor & 401 handler
│   │   │   ├── auth.api.ts                # Register and login API calls
│   │   │   ├── holdings.api.ts            # Holdings fetch, add, and sell API calls
│   │   │   ├── portfolio.api.ts           # Summary, sector, top movers, returns, and simulation
│   │   │   ├── stocks.api.ts              # Paginated stock browsing and regex search
│   │   │   └── wishlist.api.ts            # Watchlist listing, toggle, and alert configuration
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   ├── PerformanceBarChart.tsx# Comparative performance bar visualization
│   │   │   │   ├── SectorPieChart.tsx     # Recharts donut chart with custom tooltips & legends
│   │   │   │   └── SimulationComparisonChart.tsx # Current vs. hypothetical valuation chart
│   │   │   └── common/
│   │   │       ├── AlertBanner.tsx        # Dismissible feedback alerts (success, error, warning)
│   │   │       ├── Badge.tsx              # Status, sector, and risk level badges
│   │   │       ├── Button.tsx             # Interactive button component with loading spinners
│   │   │       ├── EmptyState.tsx         # Clean empty data placeholder states
│   │   │       ├── Input.tsx              # Accessible form input with password show/hide
│   │   │       ├── LoadingSpinner.tsx     # Animated loading spinner & skeleton states
│   │   │       ├── Modal.tsx              # Accessible modal dialog with backdrop & ESC listener
│   │   │       ├── ProtectedRoute.tsx     # Route guard redirecting unauthenticated users
│   │   │       ├── StatCard.tsx           # Financial metric card with P&L color logic
│   │   │       └── StockSearchSelect.tsx  # Autocomplete searchable combobox for 2,300+ stocks
│   │   ├── context/
│   │   │   └── AuthContext.tsx            # Reactive session state, login/logout, token storage
│   │   ├── layouts/
│   │   │   ├── AppLayout.tsx              # Authenticated workspace: desktop sidebar & mobile drawer
│   │   │   └── PublicLayout.tsx           # Public navbar, brand typography, and footer
│   │   ├── pages/
│   │   │   ├── AnalyticsPage.tsx          # HHI concentration, sensitivity slider, period returns
│   │   │   ├── DashboardPage.tsx          # Core executive dashboard with live metrics & movers
│   │   │   ├── LandingPage.tsx            # Marketing overview & interactive component preview
│   │   │   ├── LoginPage.tsx              # User login (email or username)
│   │   │   ├── NotFoundPage.tsx           # 404 page
│   │   │   ├── PortfolioPage.tsx          # Real holdings table, buy/sell modals, P&L breakdown
│   │   │   ├── RegisterPage.tsx           # Account registration with client & server validation
│   │   │   ├── StocksPage.tsx             # Paginated stock explorer, instant search, watchlist
│   │   │   └── WishlistPage.tsx           # Saved stocks grid, active alert monitors, removal
│   │   ├── types/                         # Shared TypeScript types for API payloads and models
│   │   ├── utils/
│   │   │   └── formatters.ts              # INR (₹) currency, percentage, and date utilities
│   │   ├── App.tsx                        # Router tree with public and protected boundaries
│   │   ├── index.css                      # Tailwind CSS v4 styling & dark theme variables
│   │   └── main.tsx                       # React DOM entry point
│   ├── package.json                       # Frontend dependencies & scripts
│   └── vite.config.ts                     # Vite build configuration with API reverse proxy
├── package.json                           # Root backend dependencies & scripts
├── tsconfig.json                          # Backend TypeScript compiler configuration
└── README.md                              # Comprehensive project documentation
```

---

## 🧮 Portfolio Analytics Engine

Portfolio Matters performs institutional mathematical modeling directly on live and historical data.

### 1. Weighted-Average Cost Basis (WACB)
When an investor purchases additional shares of an already-owned stock at a different price, the application recalculates the true weighted-average acquisition price:

$$\text{New Avg Buy Price} = \frac{(Q_{\text{existing}} \times P_{\text{existing}}) + (Q_{\text{new}} \times P_{\text{buy}})}{Q_{\text{existing}} + Q_{\text{new}}}$$

When liquidating shares, the cost basis remains constant while $Q_{\text{existing}}$ decrements. If $Q_{\text{remaining}} = 0$, the position is permanently closed and purged from active holdings.

---

### 2. Herfindahl–Hirschman Index (HHI) Concentration Analysis
To evaluate whether a portfolio is dangerously concentrated in a single industry sector, the analytics engine calculates the normalized **Herfindahl–Hirschman Index (HHI)** across all sector allocations:

$$w_i = \frac{V_{\text{sector}_i}}{V_{\text{total}}}, \quad \text{HHI} = \sum_{i=1}^{n} (w_i)^2$$

Where $w_i$ represents the fractional weight of sector $i$. The application maps the resulting score into defined risk categories and generates a $0 - 100$ diversification score:

| HHI Value | Concentration Level | Portfolio Health Interpretation |
|---|---|---|
| $\text{HHI} < 0.15$ | **Low (Diversified)** | Healthy asset allocation across non-correlated sectors. |
| $0.15 \le \text{HHI} < 0.25$ | **Moderate** | Noticeable weighting in 1–2 dominant sectors; monitor exposure. |
| $\text{HHI} \ge 0.25$ | **High (Concentrated)** | Severe capital concentration; highly vulnerable to sector drawdowns. |

$$\text{Diversification Score} = (1 - \text{HHI}) \times 100$$

---

### 3. Hypothetical Market Sensitivity Simulation
Allows investors to stress-test their active holdings against hypothetical macroeconomic market shifts ($\Delta\% \in [-50\%, +50\%]$):

$$V_{\text{projected}} = V_{\text{current}} \times \left(1 + \frac{\Delta\%}{100}\right)$$

> [!NOTE]
> *Disclaimer: Simulations represent uniform hypothetical mathematical models across all active holdings for exploratory stress-testing. They do not constitute financial forecasting, automated advice, or price guarantees.*

---

### 4. Multi-Day Historical Snapshot Delta
Measures performance changes over selected historical windows ($d \in \{7, 14, 30, 90\}\text{ days}$) using snapshots archived by the daily cron:

$$\Delta V = V_{\text{today}} - V_{\text{past}(d)}, \quad \text{Return \%} = \frac{V_{\text{today}} - V_{\text{past}(d)}}{V_{\text{past}(d)}} \times 100$$

If insufficient snapshots exist in the database (e.g., a newly created account with fewer than $d + 1$ records), the system gracefully displays an informational state rather than fabricating misleading historical data.

---

## ⏰ Automated Background Cron Engine

The backend runs three distinct automated daemons managed by `node-cron`:

```
┌─────────────── Minute (0 - 59)
│ ┌───────────── Hour (0 - 23)
│ │ ┌─────────── Day of Month (1 - 31)
│ │ │ ┌───────── Month (1 - 12)
│ │ │ │ ┌─────── Day of Week (0 - 7, 1-5 = Mon-Fri)
│ │ │ │ │
* * * * *
```

| Daemon | Cron Schedule | Frequency | Operations & Data Pipeline |
|---|---|---|---|
| **NSE Stock Ingestion** | `24 23 * * 1-5` | 23:24 (Mon–Fri) | Fetches all NSE stock symbols, retrieves quotes, transforms fields, and performs an optimized `Stock.bulkWrite()` with `upsert: true`. |
| **Portfolio Valuation Snapshot** | `55 10 * * 1-5` | 10:55 (Mon–Fri) | Queries all distinct `userId`s with active holdings, executes a valuation aggregation (`quantity * currentPrice`), and records a timestamped `History` document. |
| **Price Alert Watchdog** | `37 23 * * *` | 23:37 (Daily) | Scans users with `wishlist.alertActive: true`. Compares current stock prices against target thresholds (`above` / `below`). If triggered, sends an HTML email via Nodemailer and marks `alertTriggered: true`. |

---

## 📡 API Documentation

All protected endpoints require the HTTP header:
```http
Authorization: Bearer <your_jwt_token>
```

### Authentication Routes

#### 1. Register User
- **Method:** `POST`
- **Route:** `/auth/register`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "userName": "investor_01",
    "email": "investor@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Validation:** `userName` (5–20 chars), `email` (valid email format), `password` (min 5 chars).
- **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "User Registered Succesfully"
  }
  ```

#### 2. Login User
- **Method:** `POST`
- **Route:** `/auth/login`
- **Auth:** Public
- **Request Body (Accepts either email or username):**
  ```json
  {
    "email": "investor@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "User Logged In Succesfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "670ecb291a45b812f0a1c901",
      "userName": "investor_01",
      "email": "investor@example.com"
    }
  }
  ```

---

### Stock Directory & Exploration

#### 3. Paginated Stock Listing
- **Method:** `GET`
- **Route:** `/api/stocks?page=1&limit=10`
- **Auth:** Protected
- **Success Response (`200 OK`):**
  ```json
  {
    "page": 1,
    "limit": 10,
    "total": 2335,
    "totalPages": 234,
    "data": [
      {
        "_id": "670ec152342b453a2b123401",
        "symbol": "INFY",
        "name": "Infosys Limited",
        "sector": "Information Technology",
        "currentPrice": 1845.50
      }
    ]
  }
  ```

#### 4. Regex Search by Company Name
- **Method:** `GET`
- **Route:** `/api/stocks/search?query=Tata`
- **Auth:** Protected
- **Success Response (`200 OK`):**
  ```json
  [
    {
      "_id": "670ec152342b453a2b123402",
      "symbol": "TATAMOTORS",
      "name": "Tata Motors Limited",
      "sector": "Automobile",
      "currentPrice": 965.25
    }
  ]
  ```

---

### Holdings Management

#### 5. List User Holdings
- **Method:** `GET`
- **Route:** `/api/holdings`
- **Auth:** Protected
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "670ec5221945f822a9010011",
        "userId": "670ecb291a45b812f0a1c901",
        "quantity": 10,
        "avgBuyPrice": 9000.00,
        "stockId": {
          "_id": "670ec152342b453a2b123403",
          "symbol": "BAJAJ-AUTO",
          "name": "Bajaj Auto Limited",
          "sector": "Automobile",
          "currentPrice": 9631.50
        }
      }
    ]
  }
  ```

#### 6. Add / Buy Holding
- **Method:** `POST`
- **Route:** `/api/holdings/add`
- **Auth:** Protected
- **Request Body:**
  ```json
  {
    "stockId": "670ec152342b453a2b123403",
    "quantity": 10,
    "buyPrice": 9000.00
  }
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "670ec5221945f822a9010011",
      "userId": "670ecb291a45b812f0a1c901",
      "stockId": "670ec152342b453a2b123403",
      "quantity": 10,
      "avgBuyPrice": 9000.00
    }
  }
  ```

#### 7. Sell / Liquidate Holding
- **Method:** `PUT`
- **Route:** `/api/holdings/sell`
- **Auth:** Protected
- **Request Body:**
  ```json
  {
    "stockId": "670ec152342b453a2b123403",
    "quantity": 5
  }
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "670ec5221945f822a9010011",
      "userId": "670ecb291a45b812f0a1c901",
      "stockId": "670ec152342b453a2b123403",
      "quantity": 5,
      "avgBuyPrice": 9000.00
    }
  }
  ```
  *(Returns `{"success": true, "data": {"message": "Position closed"}}` when quantity reaches 0).*

---

### Wishlist & Price Alerts

#### 8. Retrieve User Wishlist
- **Method:** `GET`
- **Route:** `/api/wishlist`
- **Auth:** Protected
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "670eca192b45e718b2010199",
        "alertActive": true,
        "alertTriggered": false,
        "alertPrice": 1850.00,
        "alertType": "above",
        "stock": {
          "_id": "670ec152342b453a2b123401",
          "symbol": "INFY",
          "name": "Infosys Limited",
          "currentPrice": 1845.50
        }
      }
    ]
  }
  ```

#### 9. Add Stock to Wishlist
- **Method:** `POST`
- **Route:** `/api/wishlist/:stockId`
- **Auth:** Protected
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [ ... ]
  }
  ```

#### 10. Remove Stock from Wishlist
- **Method:** `DELETE`
- **Route:** `/api/wishlist/:stockId`
- **Auth:** Protected
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [ ... ]
  }
  ```

#### 11. Configure Price Alert
- **Method:** `POST`
- **Route:** `/api/wishlist/alert`
- **Auth:** Protected
- **Request Body:**
  ```json
  {
    "stockId": "670ec152342b453a2b123401",
    "alertPrice": 1850.00,
    "alertType": "above"
  }
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "message": "Alert set successfully",
    "data": {
      "stock": "670ec152342b453a2b123401",
      "alertPrice": 1850.00,
      "alertType": "above",
      "alertActive": true,
      "alertTriggered": false
    }
  }
  ```

---

### Summary & Analytics

#### 12. Portfolio Overall Valuation Summary
- **Method:** `GET`
- **Route:** `/api/summary`
- **Auth:** Protected
- **Success Response (`200 OK`):**
  ```json
  {
    "totalInvested": 93250.00,
    "currentValue": 99759.50,
    "profitLoss": 6509.50,
    "profitLossPercentage": 6.98
  }
  ```

#### 13. Sector Allocation Breakdown
- **Method:** `GET`
- **Route:** `/api/summary/sector`
- **Auth:** Protected
- **Success Response (`200 OK`):**
  ```json
  [
    {
      "sector": "Automobile",
      "value": 96315.00,
      "percentage": 96.55
    },
    {
      "sector": "Pharmaceuticals",
      "value": 3444.50,
      "percentage": 3.45
    }
  ]
  ```

#### 14. Top Movers (Top Gainer & Top Loser)
- **Method:** `GET`
- **Route:** `/api/summary/topMovers`
- **Auth:** Protected
- **Success Response (`200 OK`):**
  ```json
  {
    "topGainer": {
      "_id": "670ec5221945f822a9010011",
      "quantity": 10,
      "avgBuyPrice": 9000.00,
      "investedAmount": 90000.00,
      "currentAmount": 96315.00,
      "profitLoss": 6315.00,
      "profitLossPercentage": 7.02,
      "stock": {
        "symbol": "BAJAJ-AUTO",
        "name": "Bajaj Auto Limited",
        "sector": "Automobile",
        "currentPrice": 9631.50
      }
    },
    "topLoser": {
      "_id": "670ec5221945f822a9010012",
      "quantity": 5,
      "avgBuyPrice": 650.00,
      "investedAmount": 3250.00,
      "currentAmount": 3444.50,
      "profitLoss": 194.50,
      "profitLossPercentage": 5.98,
      "stock": {
        "symbol": "AARTIPHARM",
        "name": "Aarti Pharmalabs Limited",
        "sector": "Pharmaceuticals",
        "currentPrice": 688.90
      }
    }
  }
  ```

#### 15. Historical Period Return
- **Method:** `GET`
- **Route:** `/api/summary/return?days=7`
- **Auth:** Protected
- **Success Response (`200 OK`):**
  ```json
  {
    "change": 1420.50,
    "changePercent": 1.44
  }
  ```

#### 16. Portfolio Stress-Test Simulation
- **Method:** `GET`
- **Route:** `/api/summary/simulation?marketChangePercent=10`
- **Auth:** Protected
- **Parameter Constraints:** `marketChangePercent` must be a number between `-50` and `50`.
- **Success Response (`200 OK`):**
  ```json
  {
    "totalValue": 99759.50,
    "marketChangePercent": 10,
    "projectedValue": 109735.45,
    "riskScore": 0.933,
    "riskLevel": "High (Concentrated)",
    "diversificationScore": 6.70
  }
  ```

---

## 🗄️ Database Schema Design

```mermaid
erDiagram
    USER ||--o{ HOLDING : owns
    USER ||--o{ HISTORY : records
    USER ||--o{ WISHLIST_ITEM : saves
    STOCK ||--o{ HOLDING : referenced_by
    STOCK ||--o{ WISHLIST_ITEM : monitored_in

    USER {
        ObjectId _id PK
        string userName "Unique, 5-20 chars"
        string email "Unique, valid email"
        string password "Bcrypt hashed"
        array wishlist "Subdocument array"
    }

    STOCK {
        ObjectId _id PK
        string symbol "Unique, Indexed, Uppercase"
        string name "Trimmed company name"
        string sector "Indexed sector classification"
        number currentPrice "Last market quote"
        date updatedAt "Timestamp"
    }

    HOLDING {
        ObjectId _id PK
        ObjectId userId FK "Indexed"
        ObjectId stockId FK "Ref Stock"
        number quantity "Positive integer >= 1"
        number avgBuyPrice "Weighted avg price >= 0"
        date updatedAt "Compound Index: userId + stockId"
    }

    HISTORY {
        ObjectId _id PK
        ObjectId userId FK "Indexed"
        number totalValue "Archived valuation"
        date createdAt "Timestamp"
    }

    WISHLIST_ITEM {
        ObjectId stock FK "Ref Stock"
        number alertPrice "Target trigger price"
        string alertType "'above' | 'below'"
        boolean alertActive "Monitoring status"
        boolean alertTriggered "Trigger status"
    }
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `v18.x` or higher (`v20+` recommended)
- **npm** `v9.x` or higher
- **MongoDB** instance (Local MongoDB on `mongodb://localhost:27017` or MongoDB Atlas URI)

---

### 1. Clone Repository
```bash
git clone https://github.com/your-username/portfolio-matters.git
cd portfolio-matters
```

---

### 2. Configure Backend Environment
Create a `.env` file in the project root:
```env
PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio_matters?retryWrites=true&w=majority
JWT_SECRET_KEY=your_cryptographically_secure_jwt_secret_key
EMAIL_USER=your_verified_sender_email@gmail.com
EMAIL_PASS=your_email_app_password
```

---

### 3. Install Backend Dependencies & Start

Open Terminal 1 (Project Root):
```bash
# Install backend dependencies
npm install

# Option A: Start in development mode with hot-reloading (via tsx)
npm run dev

# Option B: Compile TypeScript and run production server
npm run build
npm start
```
*Backend listens on `http://localhost:3001` and connects to MongoDB.*

---

### 4. Configure & Start Frontend

Open Terminal 2 (Inside `frontend/` directory):
```bash
cd frontend

# Install frontend dependencies
npm install

# Start Vite dev server with proxy to backend
npm run dev
```

*Vite will launch the development server on **`http://localhost:5173`**.*

> [!TIP]
> The Vite development server automatically proxies `/api` and `/auth` requests to `http://localhost:3001`, eliminating CORS friction during local development.

To build the frontend for production:
```bash
npm run build
npm run preview
```

---

## 🔐 Environment Variables

| Variable Name | Scope | Required | Description | Safe Example |
|---|---|---|---|---|
| `PORT` | Backend | Optional | Port on which the Express server listens (defaults to `3001`) | `3001` |
| `MONGO_URI` | Backend | **Yes** | MongoDB connection string (Local or MongoDB Atlas) | `mongodb+srv://db_user:password@cluster0.mongodb.net/portfolio` |
| `JWT_SECRET_KEY` | Backend | **Yes** | Secret cryptographic key used to sign and verify JWT session tokens | `a8f9c2d1e04b78a9c2...` |
| `EMAIL_USER` | Backend | **Yes** | Sender email address for Nodemailer price-alert dispatch | `notifications@example.com` |
| `EMAIL_PASS` | Backend | **Yes** | App-specific password or SMTP credentials for email delivery | `abcd efgh ijkl mnop` |
| `VITE_API_BASE_URL` | Frontend | Optional | Base URL for API requests. Leave blank to use the Vite proxy | `http://localhost:3001` |

---

## 🧠 Engineering Highlights

### 1. Robust Mongoose Pipeline Optimization
The portfolio analytics endpoints avoid fetching unindexed documents into Node.js memory. Instead, all calculations (WACB valuation, sector groupings, and P&L sums) execute natively in MongoDB via aggregation pipelines using `$lookup`, `$unwind`, `$addFields`, and `$group`. The top movers feature executes via `$facet` to calculate both the top gainer and top loser in a single atomic database pass.

### 2. Compound Indexing for Concurrency Integrity
In `src/models/holding.ts`, a compound unique index ensures complete data integrity:
```typescript
holdingSchema.index({ userId: 1, stockId: 1 }, { unique: true });
```
This guarantees an investor cannot accidentally create duplicate holding records for the same stock, enforcing clean updates to the weighted-average cost basis.

### 3. Graceful Browser GET Compatibility
Standard browser HTTP clients (`fetch` and `XMLHttpRequest`) automatically drop request bodies on `GET` requests according to W3C specifications. The analytics controllers (`getReturn` and `getSimulation`) implement fallback input parsing:
```typescript
const rawChange = req.query.marketChangePercent !== undefined 
  ? req.query.marketChangePercent 
  : req.body?.marketChangePercent;
```
This ensures 100% backward compatibility with automated test suites that pass JSON bodies while enabling standard browser query parameters natively.

### 4. Search Performance on 2,300+ Stocks
Rather than overloading the client with 2,300+ stock documents in a monolithic dropdown, the frontend combines an interactive search combobox with debounced server queries (`/api/stocks/search?query=...`) and indexed pagination (`/api/stocks?page=...&limit=...`).

---

## 🧪 Quality & Verification

The codebase has undergone strict compilation and verification:

```bash
# Verify Backend TypeScript compilation
npx tsc --noEmit
# Output: Clean compile (0 errors)

# Verify Backend Build
npm run build
# Output: Clean build to dist/

# Verify Frontend TypeScript & Production Build
cd frontend
npm run build
# Output: 2587 modules transformed, dist/index.html & assets generated (0 errors)
```

---

## ⚖️ License & Disclaimer

### Disclaimer
*Portfolio Matters is an analytical tracking and engineering demonstration application designed for portfolio visibility and educational purposes. It does not provide automated trading, direct brokerage execution, or registered financial investment advice. All hypothetical simulations are exploratory mathematical models.*

### License
This project is open-source and distributed under the [ISC License](https://opensource.org/licenses/ISC).
