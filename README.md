# AgroPredict AI

AgroPredict AI is a full-stack final-year project for AI-based crop recommendation, price forecasting, farm management, Kisan AI chat, prediction history, and admin monitoring.

## Tech Stack

- React + Vite frontend
- Node.js backend
- SQLite database using Node's built-in `node:sqlite`
- Explainable crop suitability engine
- Live weather integration using Open-Meteo
- Live mandi price lookup using data.gov.in sample key or your own key
- Local fallback price forecasting engine

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

## Live Data

- Crop prediction uses live weather from Open-Meteo.
- If latitude/longitude are missing, backend geocodes city, district, and state first.
- Price prediction tries live mandi prices from data.gov.in.
- The public data.gov.in sample key is used for testing when `DATA_GOV_API_KEY` is empty.
- If no matching mandi record is found, the app clearly marks the result as a fallback estimate.

## Kisan AI Assistant

- Chat history is saved in SQLite and reloads from the latest conversation.
- AI provider order: OpenRouter, then Hugging Face Inference Providers, then local Kisan knowledge engine.
- Recommended Hugging Face model for the project: `openai/gpt-oss-120b:fastest`.
- Set `OPENROUTER_API_KEY` or `HF_TOKEN` in your environment for live LLM answers.

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
