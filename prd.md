# Product Requirements Document (PRD): Income & Expense Tracker SaaS

## 1. Project Overview
A web-based SaaS application designed to help users track their monthly income and expenses. The application is built using **Vue 3** for the frontend and **Express** for the backend API.

## 2. Core Features
1. **Dashboard**: Visual representation of total income, total expenses, and current balance for the month.
2. **Transaction Management**: 
   - Add new income/expense.
   - Categorize transactions (e.g., Food, Transport, Salary).
   - View history of transactions.
3. **Monthly Summary**: Calculate total income and expenses per month.

## 3. Tech Stack
- **Frontend**: Vue 3 (Composition API), Vite, plain CSS or scoped CSS for styling (Tailwind if configured).
- **Backend**: Node.js, Express.js.
- **Database**: In-memory array or simple file-based DB (JSON) for MVP (can be upgraded to SQLite/PostgreSQL later).

## 4. Development Steps
### Step 1: Backend Setup (Express API)
- [x] Create an Express server entry point (`server.js`).
- [x] Setup simple API routes (`/api/transactions`).
- [x] Implement backend controllers to handle `GET`, `POST`, `DELETE`.
- [x] Ensure CORS is configured if running on different ports in dev.

### Step 2: Frontend Layout & Routing
- [x] Ensure Vite proxy is configured to forward `/api` requests to Express.
- [x] Create basic layout (Header, Main Content area).
- [x] Set up the main components: `Dashboard.vue`, `TransactionForm.vue`, `TransactionList.vue`.

### Step 3: State & Logic
- [x] Connect Vue to Express using `fetch` or `axios`.
- [x] Manage reactive state for transactions.
- [x] Compute monthly summaries (income, expense, balance).

### Step 4: Styling & Polish
- [x] Apply modern, premium CSS styling (vibrant indigo/emerald/rose accents, high-contrast dark Vercel/Linear-inspired theme).
- [x] Make the UI flat, crisp, and clean, ensuring it is NOT bubbly (reduced border-radius to 8px for cards, crisp borders, solid backgrounds).
- [x] Add smooth transitions, tab filtering, search functionality, and hover micro-interactions (e.g. reveal delete button).
- [x] Ensure the app is fully mobile-responsive with a sidebar toggle overlay.

