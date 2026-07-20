# AgroPredict AI Requirements

## Required Software

Install these before running the project:

1. **Node.js 24 or newer**
   - Download: https://nodejs.org/
   - This project uses Node's built-in SQLite support, so Node 24+ is required.

2. **npm**
   - npm is installed automatically with Node.js.

3. **Modern browser**
   - Chrome, Edge, or Firefox.

## Check Installation

Open a terminal in the project folder and run:

```bash
node -v
npm -v
```

Expected:

```text
node v24.x.x or newer
npm version shown
```

## First-Time Setup

```bash
npm install
```

## Run Project

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

Backend health check:

```text
http://127.0.0.1:4000/api/health
```

## Admin Access

Admin login page:

```text
http://127.0.0.1:5173/AdminLogin
```

Demo admin key:

```text
admin123
```

To use a different backend admin key:

```bash
set ADMIN_KEY=your_key_here
npm run dev
```

On PowerShell:

```powershell
$env:ADMIN_KEY="your_key_here"
npm run dev
```

## Live Data Setup

Live weather works automatically when a farm has latitude and longitude.
If latitude and longitude are missing, the backend uses the farm city, district, and state to find coordinates first.
Coordinates are still more accurate than text lookup, especially for villages with duplicate names.

Weather source:

```text
Open-Meteo Forecast + Geocoding APIs
```

Live mandi prices use the public data.gov.in sample key by default for testing.
The sample key is rate-limited and returns a maximum of 10 records.

For better limits, use your own data.gov.in API key:

```powershell
$env:DATA_GOV_API_KEY="your_data_gov_api_key"
npm run dev
```

If the API returns no matching mandi record, the Price Predictor still runs and the result is marked as a fallback estimate.

## Kisan AI Setup

The assistant works without keys using the local agriculture knowledge engine.
For stronger live AI answers, use one of these:

```powershell
$env:OPENROUTER_API_KEY="your_openrouter_key"
npm run dev
```

Or use Hugging Face Inference Providers:

```powershell
$env:HF_TOKEN="your_hugging_face_token"
$env:HUGGINGFACE_MODEL="openai/gpt-oss-120b:fastest"
npm run dev
```

Recommended order for this project:

```text
OpenRouter for easiest multi-model fallback, Hugging Face for open-model presentation value, local engine for offline demo.
```

## Database

The SQLite database is created automatically here:

```text
server/data/agropredict.db
```

Do not share the generated `.db` file unless you intentionally want to share demo data.

## Verification Commands

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

All should pass before final submission.
