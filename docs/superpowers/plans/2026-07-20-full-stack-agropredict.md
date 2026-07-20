# Full-Stack AgroPredict Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real local backend, database, explainable crop prediction engine, price forecasting, chat, admin views, and tests.

**Architecture:** React calls `/api/*` endpoints through a small API client. Node.js serves Express-like HTTP routes using the built-in `http` module and persists data with `node:sqlite`. Prediction logic is separated from routing so it can be unit tested and explained during viva.

**Tech Stack:** React, Vite, Tailwind, Node.js 24, `node:sqlite`, built-in `node:test`.

## Global Constraints

- Keep the existing visual style close to the current app.
- Keep the app fully local and independent from external app-builder platforms.
- Use a real local database file at `server/data/agropredict.db`.
- Use deterministic local prediction and price logic so the app works offline.
- Add tests before production logic for new backend/model behavior.

---

### Task 1: Backend Prediction Core

**Files:**
- Create: `server/data/cropKnowledge.js`
- Create: `server/services/cropEngine.js`
- Create: `server/services/priceEngine.js`
- Test: `server/tests/cropEngine.test.js`
- Test: `server/tests/priceEngine.test.js`

**Interfaces:**
- Produces: `predictCrops(farm, season, cropKnowledge)` returns `{ predictions, recommendation_notes }`.
- Produces: `predictPrice({ crop, market, season, quantity })` returns structured price forecast.

- [x] Write failing tests for crop ranking and price forecast.
- [x] Run tests and verify failures before implementation.
- [x] Implement crop and price engines.
- [x] Run tests and verify pass.

### Task 2: SQLite Database and API Server

**Files:**
- Create: `server/db.js`
- Create: `server/routes.js`
- Create: `server/index.js`
- Test: `server/tests/api.test.js`

**Interfaces:**
- Consumes: `predictCrops`, `predictPrice`.
- Produces: REST endpoints under `/api`.

- [x] Write failing API tests for farm CRUD, crop prediction, price prediction, chat, and admin summary.
- [x] Implement database schema, seed data, and route handlers.
- [x] Run API tests and verify pass.

### Task 3: Frontend API Migration

**Files:**
- Create: `src/api/agroApi.js`
- Modify: `src/App.jsx`
- Modify: `src/lib/AuthContext.jsx`
- Modify: existing pages that use the old external app SDK.
- Modify: `vite.config.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: backend `/api/*` routes.
- Produces: local backend-driven frontend behavior.

- [x] Replace external SDK calls with `agroApi`.
- [x] Add Vite proxy to local backend.
- [x] Add scripts for backend, frontend, full dev, and tests.
- [x] Run lint/typecheck/build.

### Task 4: Admin Panel

**Files:**
- Create: `src/pages/AdminPanel.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/layout/Sidebar.jsx`

**Interfaces:**
- Consumes: `agroApi.admin()`.
- Produces: `/AdminPanel` route with stats and backend data tables.

- [x] Add admin route and sidebar item.
- [x] Render database stats and recent logs.
- [x] Verify admin loads from API.

### Task 5: End-to-End Verification

**Files:**
- Modify as needed based on verification.

**Interfaces:**
- Consumes: all tasks.
- Produces: working local app and final verification report.

- [x] Run `npm test`.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
- [x] Start backend and frontend.
- [x] Smoke test local URLs.
