# How To Share This Project

## Share These Files/Folders

Share the project folder with:

- `src/`
- `server/`
- `public/`
- `docs/`
- `package.json`
- `package-lock.json`
- `README.md`
- `REQUIREMENTS.md`
- `components.json`
- `index.html`
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `eslint.config.js`
- `jsconfig.json`
- `.gitignore`

## Do Not Share These Generated Folders/Files

These are created locally and can be regenerated:

- `node_modules/`
- `dist/`
- `.vite/`
- `.env`
- `.env.local`
- `server/data/*.db`
- `server/data/*.db-*`

## Best Sharing Method

Before zipping or copying, make sure the generated folders are not included.

Clean package structure:

```text
agro-predict-ai/
  src/
  server/
  public/
  docs/
  package.json
  package-lock.json
  README.md
  REQUIREMENTS.md
```

The receiver should run:

```bash
npm install
npm run dev
```

Then open:

```text
http://127.0.0.1:5173
```
