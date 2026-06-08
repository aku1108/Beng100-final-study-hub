# BENG 100 Study Hub

A React + Vite study app for BENG 100 final exam review. It includes lecture formula sheets, source-style examples, hidden practice answers, local study progress tracking, and timed practice final versions.

## Features

- Dashboard with overall progress and final-heavy topic tracking
- Lecture hub for Weeks 1-10 / Lectures 1-20
- Searchable formula sheet
- Searchable practice bank with hidden answers
- Timed practice final mode with keyword-based scoring
- KaTeX rendering for math formulas
- Progress saved locally in the browser

## Project Structure

```text
.
├── README.md
├── vercel.json
└── beng100-vercel-app/
    ├── index.html
    ├── package.json
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── style.css
    └── ...
```

The app source is inside `beng100-vercel-app/`.

## Run Locally

```bash
cd beng100-vercel-app
npm install
npm run dev
```

Then open the local URL Vite prints, usually:

```text
http://localhost:5173/
```

## Build

```bash
cd beng100-vercel-app
npm run build
```

The production files are generated in:

```text
beng100-vercel-app/dist
```

## Deploy on Vercel

This repository includes `vercel.json` so Vercel can deploy the app even though the app is in the `beng100-vercel-app/` subfolder.

If Vercel still shows `404: NOT_FOUND` after pressing **Visit**, check these settings in the Vercel dashboard:

- **Root Directory**: leave it as the repository root, or set it to `beng100-vercel-app`
- If using repository root, keep the included `vercel.json`
- If setting Root Directory to `beng100-vercel-app`, Vercel should use:
  - Build Command: `npm run build`
  - Output Directory: `dist`

After changing settings, redeploy the project.

## Notes

The automatic final scoring is keyword/rubric based. Use the revealed solutions to check the full derivation and partial-credit details.
