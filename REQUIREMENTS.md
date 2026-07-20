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
