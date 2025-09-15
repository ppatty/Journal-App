# Journal Companion

A modern journaling companion that brings together daily logging, rich media capture, smart reminders, mood and sentiment insights, and profile preferences in a single responsive experience.

## Features

- **Daily log dashboard** – browse recent entries, review contextual AI prompts, explore connected moments, and jump into a rich quote spotlight or linked photo gallery.
- **AI companion follow-up** – chat with a context-aware assistant that suggests prompts, creates reminders, and highlights next steps directly from your journal.
- **Entry creation** – capture text, quotes, images, or audio with tag management, sentiment sliders, AI-generated tag suggestions, NLP entity detection, and live voice-to-text simulation.
- **Search & filters** – quickly locate entries by keyword, mood, tag, date range, or media attachments with one-tap AI quick filters.
- **Personalized insights** – view curved mood trend visualisations, tag frequency, media mix, and an automatically generated highlights timeline with AI-authored summaries.
- **Profile & preferences** – manage reminder settings, privacy controls, companion tones, and review focus areas in a tailored settings hub.

## Getting started

```bash
npm install
npm run dev
```

The development server runs on [http://localhost:5173](http://localhost:5173). To create a production build run `npm run build` and preview it locally with `npm run preview`.

## Project structure

```
├── index.html
├── package.json
├── public
│   └── favicon.svg
└── src
    ├── App.jsx
    ├── components
    │   ├── AiCompanionPanel.jsx
    │   ├── DailyLogView.jsx
    │   ├── EntryCard.jsx
    │   ├── EntryDetail.jsx
    │   ├── MobileNav.jsx
    │   ├── MoodTrendChart.jsx
    │   ├── InsightsView.jsx
    │   ├── NewEntryForm.jsx
    │   ├── PhotoGalleryPanel.jsx
    │   ├── ProfileView.jsx
    │   ├── QuoteSpotlight.jsx
    │   └── SearchAndFilter.jsx
    ├── data
    │   ├── initialEntries.js
    │   ├── smartReminders.js
    │   └── userProfile.js
    ├── styles
    │   └── index.css
    ├── utils
    │   ├── analytics.js
    │   ├── constants.js
    │   └── formatters.js
    └── main.jsx
```

All UI is written in React (Vite) with modular components and handcrafted styling—no external UI frameworks required.
