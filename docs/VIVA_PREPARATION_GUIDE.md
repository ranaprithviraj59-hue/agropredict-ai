# AgroPredict AI Viva Preparation Guide

## 1. Project Overview

**Project title:** AgroPredict AI

**Project type:** Full-stack AI-based crop recommendation and farmer assistance system.

**Main objective:** Help farmers and students analyze crop suitability, market price trends, live weather, farm records, and farming doubts from one application.

**One-line explanation for viva:**
AgroPredict AI is a full-stack web application that recommends suitable crops using farm soil and climate parameters, estimates crop prices using live mandi data where available, and provides a multilingual Kisan AI assistant with OpenRouter, Hugging Face, and local fallback intelligence.

## 2. Problem Statement

Farmers often select crops based on habit or incomplete local advice. Crop success depends on soil type, pH, NPK values, season, water availability, irrigation method, previous crop, weather, and market price. These factors are usually checked separately, which makes decision-making slow and uncertain.

This project solves that by combining:

- Farm data entry
- Soil and region-based crop recommendation
- Live weather context
- Live mandi price lookup
- Price forecasting fallback
- Kisan AI chat assistant
- Admin monitoring
- Prediction history

## 3. Technology Stack

| Layer | Technology | Use |
| --- | --- | --- |
| Frontend | React | Component-based user interface |
| Build tool | Vite | Fast local development and build |
| Styling | Tailwind CSS + UI components | Responsive modern UI |
| Backend | Node.js HTTP server | REST API and business logic |
| Database | SQLite using Node built-in `node:sqlite` | Local persistent data storage |
| AI chat | OpenRouter API | Primary live AI model access |
| AI backup | Hugging Face Inference Providers | Secondary AI provider |
| Offline AI | Rule-based Kisan engine | Works without API keys |
| Weather data | Open-Meteo Forecast + Geocoding | Live weather and coordinate lookup |
| Market data | data.gov.in mandi API | Live Indian mandi prices |
| Testing | Node test runner | Backend unit/API tests |
| Quality | ESLint, TypeScript check, Vite build | Validation before deployment |

## 4. Main Features

### Dashboard

Shows summary cards, farm analytics, crop insights, and project-level telemetry. It gives a quick view of the system after login.

### My Farm

Allows the user to add and manage farms. A farm stores:

- Farm name
- City, district, state
- Soil type
- pH
- NPK values
- Water source
- Water availability
- Irrigation type
- Previous crop
- Latitude and longitude if available

### Crop Prediction

The crop prediction module ranks crops based on farm conditions and season. It considers:

- Soil type
- pH range
- Nitrogen, phosphorus, potassium
- Season
- Water availability
- Irrigation
- Previous crop
- Region profile
- Live weather where available

Output includes crop name, suitability score, confidence, reasoning, risk notes, and recommended action.

### Price Predictor

The price prediction module first tries to fetch live mandi data from data.gov.in using crop, state, and district. If live data is unavailable, it uses a fallback forecasting engine based on crop, season, market, and quantity.

Output includes:

- Estimated price per quintal
- Total estimated revenue
- Monthly trend
- Sell/hold advice
- Whether the source is live mandi data or fallback estimate

### Kisan AI Assistant

The chatbot helps with crop choice, soil, fertilizer, pest control, irrigation, mandi price, harvesting, and organic farming questions.

Provider order:

1. OpenRouter
2. Hugging Face
3. Local rule-based Kisan engine

It supports English, Hindi, and Gujarati. Chat history is saved in SQLite.

### Admin Panel

The admin panel shows backend database records and project activity such as farms, predictions, price predictions, chat logs, and crop knowledge count. It is protected using an admin key.

## 5. Backend API Endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/health` | GET | Backend health check |
| `/api/location-knowledge` | GET | State/district soil and region suggestions |
| `/api/farms` | GET | List farms |
| `/api/farms` | POST | Create farm |
| `/api/farms/:id` | PUT | Update farm |
| `/api/farms/:id` | DELETE | Delete farm |
| `/api/predictions/crop` | GET | List crop predictions |
| `/api/predictions/crop` | POST | Create crop prediction |
| `/api/predictions/price` | GET | List price predictions |
| `/api/predictions/price` | POST | Create price prediction |
| `/api/chat` | POST | Send Kisan AI message |
| `/api/chat/conversations` | GET | List saved chat conversations |
| `/api/chat/history/:id` | GET | Get chat history |
| `/api/admin/summary` | GET | Admin summary with admin key |

## 6. Database Design

Main SQLite tables:

| Table | Purpose |
| --- | --- |
| `farms` | Stores farm profile and location/soil details |
| `crop_predictions` | Stores crop recommendation results |
| `price_predictions` | Stores price forecast results |
| `chat_conversations` | Stores chat sessions |
| `chat_logs` | Stores user and assistant chat messages |
| `crop_knowledge` | Stores crop suitability knowledge |

## 7. How Crop Prediction Works

The crop engine compares farm data with crop knowledge. It gives higher scores when farm conditions match crop requirements.

Important scoring factors:

- Soil compatibility
- Season compatibility
- pH suitability
- NPK matching
- Water requirement matching
- Weather suitability
- Region suitability

Example answer:
If a farm has alluvial soil, canal irrigation, high water availability, and Kharif season, rice may rank high because rice prefers water-rich Kharif conditions.

## 8. How Price Prediction Works

The price engine uses two modes:

1. **Live mode:** Uses data.gov.in mandi API and takes modal price from matching records.
2. **Fallback mode:** Uses internal price logic when live mandi data is unavailable.

The output clearly marks:

- `Live mandi price from data.gov.in`
- or `Fallback estimate`

This honesty is important because live public data may not always have records for every crop and district.

## 9. How Kisan AI Works

The AI assistant uses a provider chain:

1. If `OPENROUTER_API_KEY` is available, it calls OpenRouter.
2. If OpenRouter fails or is unavailable, it calls Hugging Face.
3. If both fail, it uses the local rule-based Kisan engine.

The prompt restricts the assistant to Indian agriculture topics. It also forces selected language:

- English
- Hindi using Devanagari
- Gujarati using Gujarati script

## 10. External APIs Used

### Open-Meteo

Used for live weather and geocoding. It helps convert city/district/state into coordinates and then fetches weather values.

### data.gov.in Mandi API

Used for live Indian mandi price records. The sample key is used for testing, but a personal key gives better limits.

### OpenRouter

Used as primary AI provider for Kisan AI. It can route requests to available models and return the actual model used.

### Hugging Face

Used as backup AI provider through Hugging Face Inference Providers.

## 11. Testing Performed

Commands used:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Test coverage includes:

- Crop prediction ranking
- Price prediction fallback
- Live mandi service behavior using mock fetch
- Open-Meteo weather service behavior using mock fetch
- API routes
- Kisan AI fallback behavior
- Hugging Face service request format

## 12. Limitations

- Live mandi data depends on public API availability and matching records.
- The sample data.gov.in key is rate-limited.
- AI answers depend on OpenRouter or Hugging Face API limits.
- Prediction is advisory, not a replacement for soil lab reports or agricultural expert consultation.
- Village-level data can be ambiguous, so latitude and longitude are more accurate than text lookup.

## 13. Future Scope

- Add real ML model training with historical crop yield datasets.
- Add pest image detection using computer vision.
- Add SMS/WhatsApp alerts for farmers.
- Add multilingual voice assistant.
- Add government scheme recommendation.
- Add deployment with cloud database and authentication.
- Add mobile app version.

## 14. Faculty Viva Questions and Answers

### Q1. What is your project about?

AgroPredict AI is a full-stack crop recommendation and farmer assistance system. It recommends crops based on farm soil, water, season, pH, NPK, region, and weather. It also predicts crop price trends, stores farm and prediction history, and provides a multilingual Kisan AI assistant.

### Q2. Why did you choose this project?

Agriculture decisions require many factors, but farmers often do not have one simple system to combine soil, water, weather, and market data. This project demonstrates how software and AI can support better farming decisions.

### Q3. Is this a real AI project?

Yes. It uses AI in two ways. First, the crop recommendation engine is an explainable AI-style scoring engine that ranks crops from multiple farm parameters. Second, the Kisan AI assistant uses live LLM providers such as OpenRouter and Hugging Face, with a local fallback knowledge engine.

### Q4. Which AI model did you use?

The primary AI provider is OpenRouter using `openrouter/auto`, which can route to an available model such as Gemini Flash Lite. Hugging Face is configured as backup with `openai/gpt-oss-120b:fastest`. A local rule-based Kisan engine works if external APIs are unavailable.

### Q5. Why did you not use only one AI API?

Using multiple providers improves reliability. If OpenRouter fails due to rate limits or network issues, Hugging Face is tried. If both fail, the local Kisan engine still answers basic agriculture questions.

### Q6. How does crop prediction work?

The system compares farm inputs with crop knowledge. It checks soil type, pH, NPK, water availability, season, irrigation, previous crop, and weather. Each crop receives a suitability score and the highest-scoring crops are recommended.

### Q7. What is the role of live weather?

Live weather gives current temperature, rainfall, humidity, and wind context. The crop engine can adjust notes and suitability based on weather risk.

### Q8. What is the role of soil type?

Soil type strongly affects crop suitability. For example, alluvial or loamy soil with good water can support rice, wheat, maize, and vegetables depending on season. Black cotton soil supports cotton and soybean.

### Q9. How do you know the district/region soil?

The project contains location knowledge for Indian states and district suggestions. It also accepts manual soil inputs from the user because real farm soil can vary within the same district.

### Q10. Why does the app ask for city, district, and state?

These values help fetch location-specific weather and mandi prices. If coordinates are missing, the backend geocodes the text location.

### Q11. What happens if current location does not work?

The user can enter city, district, state, and farm details manually. The backend can still use text-based geocoding.

### Q12. How does price prediction work?

The backend first calls the data.gov.in mandi API. If a matching crop/state/district record is found, it uses live modal price. If no record is found, it calculates a fallback forecast and clearly marks it as fallback.

### Q13. Are all prices real?

If the result says live mandi data, it is from data.gov.in. If data is unavailable, the app marks the result as fallback estimate. This distinction is shown to avoid misleading the user.

### Q14. Which database did you use?

SQLite using Node's built-in `node:sqlite`. It stores farms, predictions, price forecasts, chat conversations, chat logs, and crop knowledge.

### Q15. Why SQLite?

SQLite is simple, local, lightweight, and suitable for a final-year project demo. It avoids complex database setup while still giving real persistent storage.

### Q16. What is the backend technology?

The backend is a Node.js HTTP server with REST API routes. It handles database operations, prediction logic, live API calls, chat AI calls, and admin summary.

### Q17. What is the frontend technology?

The frontend is built with React and Vite. It uses reusable components, pages, forms, charts, and responsive UI styling.

### Q18. What is Vite?

Vite is a modern frontend build tool. It provides fast development server and optimized production build.

### Q19. What is the admin panel used for?

The admin panel helps view project data and activity, such as number of farms, crop predictions, price predictions, chat logs, and crop knowledge records.

### Q20. How is admin protected?

Admin summary requires an admin key sent in the request header. The demo key is `admin123`, and it can be changed using the `ADMIN_KEY` environment variable.

### Q21. Is there authentication for farmers?

In the current version, it is a local/demo project without full user authentication. Future scope includes proper login and role-based access.

### Q22. How does multilingual chat work?

The UI sends a language code to the backend. The AI prompt forces the model to reply only in selected language. The local fallback also has Hindi and Gujarati responses.

### Q23. Why did the response sometimes come in English earlier?

The reason was fallback logic and old backend process. The project was fixed by adding stronger language prompts, conversation language filtering, and Gujarati fallback responses.

### Q24. What if OpenRouter limit is finished?

The system will try Hugging Face. If that also fails, it uses the local Kisan engine, so the app still works for demo.

### Q25. What if live mandi API fails?

The price predictor uses fallback estimate and marks the source as fallback.

### Q26. What if Open-Meteo fails?

Crop prediction still runs using farm data, but weather context may be missing.

### Q27. How did you test the project?

I tested backend services, API routes, crop ranking, price fallback, live service mocks, AI service mocks, linting, type checking, and production build.

### Q28. What are the main modules in your code?

Main modules are frontend pages, API client, backend routes, database layer, crop engine, price engine, live data service, Kisan AI service, OpenRouter service, Hugging Face service, and admin summary.

### Q29. What is the difference between crop prediction and price prediction?

Crop prediction recommends what to grow. Price prediction estimates expected selling price and revenue for a selected crop.

### Q30. Is your crop prediction machine learning?

It is an explainable AI-style rule/scoring engine, not a trained black-box ML model. This is useful for a college project because every recommendation can be explained. Future scope can add trained ML models using historical yield datasets.

### Q31. Why is explainability important?

Farmers and faculty need to understand why a crop is recommended. A score with reasons is more trustworthy than an unexplained answer.

### Q32. How is chat history saved?

The backend creates a conversation record and stores user messages and assistant answers in `chat_logs`, linked by `conversation_id`.

### Q33. What are environment variables?

Environment variables store configuration like API keys and admin key. They keep secrets out of GitHub.

### Q34. Did you upload API keys to GitHub?

No. `.env` is ignored by `.gitignore`. Only `.env.example` is committed so users know what variables to set.

### Q35. What is the biggest strength of this project?

It combines multiple practical farming tools into one working full-stack system: crop recommendation, price forecast, live APIs, multilingual AI chat, storage, history, and admin monitoring.

### Q36. What is the biggest limitation?

Prediction quality depends on available farm data and public API quality. The project gives advisory recommendations, not guaranteed agricultural decisions.

### Q37. How can this project be deployed?

The frontend can be deployed on a static hosting platform, and the backend can run on a Node-compatible server. For production, SQLite can be replaced with PostgreSQL and environment variables should be configured securely.

### Q38. What did you personally learn?

Full-stack development, REST API design, database design, AI prompt integration, fallback design, API handling, testing, and how to make a user-facing agriculture application.

### Q39. Why use fallback systems?

Fallbacks make the app reliable. Live APIs and AI providers may fail due to network or limits, but the project should still work during demo.

### Q40. How would you explain the project architecture?

React frontend sends requests to Node backend. The backend reads/writes SQLite, calls prediction engines, calls live weather/mandi APIs, calls AI providers when needed, and returns structured results to the UI.

## 15. Short Demo Flow

1. Open dashboard.
2. Add farm in My Farm with state, district, soil, pH, NPK, water, and season data.
3. Run Predict Crops and explain scoring.
4. Open Price Predictor and show live/fallback source label.
5. Open Kisan AI and ask in English, Hindi, or Gujarati.
6. Open Prediction History.
7. Open Admin Panel and show stored records.

## 16. Important Commands

```bash
npm install
npm run dev
npm test
npm run lint
npm run typecheck
npm run build
```

## 17. GitHub Repository

Latest pushed repository:

```text
https://github.com/ranaprithviraj59-hue/agropredict-ai
```

