# Tahseena Reyaz — Portfolio (React + Vite)

A single-page portfolio built from Tahseena's resume.

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Render (free static site)

1. Push this folder to a GitHub repository.
2. On https://render.com choose **New → Static Site** and connect the repo.
3. Use these settings (they are also in `render.yaml`):
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Click **Create Static Site**. Render gives you a `.onrender.com` link.

## Editing content

All text lives in `src/data.js`. The photo is `public/tahseena.jpg`.
The contact form opens the visitor's email app (no backend required).
