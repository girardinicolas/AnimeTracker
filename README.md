# 🏯 AnimeTracker

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Dexie](https://img.shields.io/badge/Dexie.js-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://dexie.org/)

AnimeTracker è una web app moderna, veloce e "passionale" progettata per tenere traccia dei tuoi progressi negli anime. Caratterizzata da un design premium dark-rose e animazioni fluide, offre un'esperienza utente raffinata sia su desktop che su mobile.

![Anime Tracker Logo](/public/logo.png)

## 🌐 Accesso Rapido & Mobile

Non è necessario scaricare nulla sul tuo PC! AnimeTracker è una **PWA (Progressive Web App)** accessibile cliccando il link qui sotto:

🚀 **[Vai all'App Online](https://kaleidoscopic-mermaid-bde0d1.netlify.app/)**

1. **Apri il Link**: Accedi all'URL sopra dal tuo browser.
2. **Installa su Mobile**: 
   - **Android**: Clicca sui tre puntini e seleziona "Installa App".
   - **iOS**: Clicca sul tasto "Condividi" e seleziona "Aggiungi alla Home".
3. **Usa Offline**: Una volta installata, l'app funzionerà anche senza connessione internet grazie alla memorizzazione locale.

## ✨ Caratteristiche Principali

- **🚀 Performance Estreme**: Sviluppata con Vite e React per un caricamento istantaneo.
- **📱 PWA Ready**: Installala sul tuo cellulare come un'app nativa e usala offline.
- **🎨 Design "Passionate"**: Interfaccia dark con accenti rose-red, glassmorphism e micro-interazioni curate.
- **🪄 Magic Fetch**: Recupera automaticamente le copertine ufficiali e il numero di episodi tramite l'integrazione con l'API di MyAnimeList (Jikan).
- **🎡 Lucky Spin**: Non sai cosa guardare? Gira la ruota e lascia che il destino scelga per te tra i tuoi anime "Da Vedere".
- **🌍 Multi-lingua**: Supporto completo per Italiano e Inglese con selettore dedicato.
- **📊 Offline First**: I tuoi dati sono salvati localmente nel browser utilizzando IndexedDB (grazie a Dexie.js), garantendo privacy e velocità.
- **📅 Season Tracking**: Tieni traccia non solo degli episodi, ma anche della stagione specifica che stai guardando.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Dexie.js](https://dexie.org/) (IndexedDB)
- **API**: [Jikan API](https://jikan.moe/) (Unofficial MyAnimeList API)

## 📦 Installazione Locale

1. Clona il repository:
   ```bash
   git clone https://github.com/girardinicolas/AnimeTracker.git
   ```

2. Entra nella cartella:
   ```bash
   cd AnimeTracker
   ```

3. Installa le dipendenze:
   ```bash
   npm install
   ```

4. Avvia l'ambiente di sviluppo:
   ```bash
   npm run dev
   ```

## 🚀 Deployment

L'app è configurata per essere ospitata su **Netlify** o **Vercel** con deployment automatico ad ogni push sul ramo `main`.

## ✍️ Autore

Sviluppato con passione da **NicolasGirardiJD**.

---
*Creato per i veri fan degli anime che desiderano un tracker elegante e potente.*
