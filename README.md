# AgroPredict AI

AgroPredict AI is a full-stack final-year project for AI-based crop recommendation, price forecasting, farm management, Kisan AI chat, prediction history, and admin monitoring.

## Tech Stack

- React + Vite frontend
- Node.js backend
- SQLite database using Node's built-in `node:sqlite`
- Explainable crop suitability engine
- Local price forecasting engine

## Run Locally

Install requirements first. See `REQUIREMENTS.md`.

```bash
npm install
npm run dev
```

Frontend: `http://127.0.0.1:5173`

Backend API: `http://127.0.0.1:4000/api/health`

Database file: `server/data/agropredict.db`

## Useful Commands

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Share This Project

See `SHARE_INSTRUCTIONS.md`.

Do not share `node_modules`, `dist`, `.env.local`, or generated database files. The receiver should run `npm install` before running the project.

## Project Modules

- Farmer dashboard
- Farm CRUD
- Crop prediction based on soil, pH, water, season, climate, irrigation, region, and previous crop
- Price prediction and revenue forecast
- Kisan AI farming chat
- Prediction history
- Admin panel for backend database records and model logs
