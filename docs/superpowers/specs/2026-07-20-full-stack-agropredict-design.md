# Full-Stack AgroPredict Design

## Goal

Convert the project into a professional local full-stack AI crop prediction system for final-year college demonstration.

## Architecture

The React/Vite frontend keeps its current visual style and page structure, but all data access moves to a local REST API. A Node.js backend serves farms, crop predictions, price forecasts, chat responses, admin summaries, and database-backed logs. SQLite is stored at `server/data/agropredict.db`, initialized automatically with schema and seed crop knowledge.

## Core Features

- Farm management with create, read, update, and delete APIs.
- Explainable crop prediction using soil type, pH, region, climate zone, season, water availability, irrigation, previous crop, and farm size.
- Prediction output includes suitability score, score breakdown, reasons, risks, irrigation advice, fertilizer advice, expected yield, duration, investment level, market demand, and notes.
- Price prediction estimates current, 1 month, 3 month, and 6 month commodity prices, price range, total revenue, sell recommendation, market factors, and monthly forecast.
- Kisan AI chat uses a local agriculture knowledge responder with multilingual awareness and logs chats.
- Admin panel exposes real backend data: stats, farms, prediction logs, price logs, chat logs, and crop knowledge.

## Data Model

SQLite tables:

- `farms`: user-entered farm profile.
- `crop_predictions`: saved crop prediction requests and outputs.
- `price_predictions`: saved price forecast requests and outputs.
- `chat_logs`: farmer questions and assistant answers.
- `crop_knowledge`: seed crop suitability data used by the prediction engine.

## Testing

Use Node's built-in test runner. Model tests verify explainable crop ranking and price forecasting. API tests verify farms, predictions, prices, chat, and admin endpoints. Frontend checks include lint, typecheck, build, and a running app smoke check.

## Demo Value

The student can explain the system as a full-stack AI crop prediction platform with a transparent recommendation engine, real database persistence, admin monitoring, and optional future ML dataset training.
