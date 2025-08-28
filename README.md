# FaithPing — Static PWA (POC)

A zero-backend **PWA** that shows a **daily scripture popup**, works **offline**, and deploys on **GitHub Pages**.  
All data is local (`verses.json` + `localStorage`).

## Features
- Deterministic verse-of-the-day, daily at your chosen time (default 07:00)

- Modal popup, Share/Copy, Favorites, Export/Import favorites, manual "New Verse" button

- Offline-first caching (Service Worker), installable PWA
- No external dependencies

## Run locally
Just open `index.html` using a simple HTTP server to enable service worker:
```bash
# Python 3
python -m http.server 8080
# or Node
npx http-server -p 8080
```

## Icons (no binaries in git)
Icons are stored as base64 text and generated at build time.

Local dev:
```bash
node scripts/make-icons.js
```
Then serve the folder (e.g., npx http-server -p 8080).
