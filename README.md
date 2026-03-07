# 🧠 WellTune
WellTune is a wellness‑first social health application that helps users discover, track, and share healthy routines and playlists, designed as a positive alternative to traditional social media and gamified fitness apps. 
---

## 🚀 Idea Overview
Most apps are either:
- solo and boring, or  
- social but competitive, distracting, or off‑topic.

WellTune combines structured health tracking with a social, playlist‑based discovery model inspired by Spotify, but for wellness routines instead of music.
Users:
- complete an onboarding survey about goals and experience level  
- browse and follow playlists made of multiple routines  
- execute routines and log completion + mood  
- connect with others through comments and follows without numeric leaderboards or public scores.
The core goal is to keep interactions focused on real health improvements, not points, streaks, or comparison.

---

## ✨ Core Features

### 📝 Health Survey (Onboarding)
Users answer a short survey about:
- health goals and areas of focus  
- experience level with fitness/wellness  
- basic lifestyle preferences.

Survey responses are stored in the database and used to personalize recommended playlists and routines.

---

### 👤 User Profiles
Each user has a profile that includes:
- username and basic account info  
- stated health goals and experience level  
- playlists they created and routines they contributed to  
- activity history derived from completed playlists.

Profiles are designed to highlight progress and shared routines rather than competitive scores.

---

### 📊 Health Charts & Logs
Every time a user completes a playlist, the system logs:
- which playlist was completed  
- which user completed it  
- when it was completed  
- mood or basic feedback (where applicable).

These logs support simple charts (for example, consistency over time) and provide data for analytics and recommendations.

---

### 🔁 Routines & Playlists
WellTune organizes wellness content as **playlists** composed of multiple **routines** (steps). Users can:
- browse curated playlists (for example, a “Morning Energy Boost” playlist combining yoga, meditation, and nutrition)  
- follow playlists and creators  
- execute routines in the order defined by the playlist  
- create and update their own playlists and routines. 

Under the hood, playlists and routines are linked via an ordered join table so each playlist can sequence multiple routines. 

---

### 💬 Social Layer (No Scores)
WellTune includes a light social layer designed to be supportive, not competitive. Users can: 
- follow other users  
- comment on playlists  
- discover popular content through likes and trends rather than leaderboards. 

The system deliberately avoids numeric rankings and public performance scores to reduce unhealthy comparison and anxiety. 

---

### 🎧 Smart Recommendations (Spotify‑Style)
The backend integrates analytics and machine‑learning components to power recommendations such as: 
- playlists aligned with the user’s goals and experience  
- trending or highly engaged playlists  
- content from creators the user follows or similar users. 

These recommendation signals are computed from activity logs, follows, and content metadata, then surfaced to the frontend as personalized feeds. 

---

### 🤖 AI Auto‑Moderation & Analytics
WellTune incorporates AI‑driven analytics components to keep content healthy and on‑topic: 
- a content moderation model to detect harmful or inappropriate content  
- recommendation and effectiveness models to estimate which playlists are helpful over time  
- trending and ranking detection to identify popular, high‑quality routines. 

These components run behind the scenes and return moderation decisions and ranking signals to the backend, which then filters and orders content before sending it to the UI. 

---

## 🛠 Tech Stack (Simple by Design)

### Frontend
- React  
- HTML  
- Tailwind CSS  
- TypeScript  

The frontend runs in the browser and handles authentication, onboarding survey flows, playlist browsing, routine execution views, and social interactions (comments, follows). 

---

### Backend
- Node.js (Express)

The backend exposes RESTful endpoints for: 
- authentication and user profiles  
- playlist and routine management  
- comments and follows  
- activity logging and analytics integration. 

---

### Database
- PostgreSQL

Core tables include: 
- `users` – account and profile data (goals, experience level, expert flag)  
- `routines` – individual wellness routines created by users  
- `playlists` – named collections of routines  
- `playlistroutines` – many‑to‑many relationship with explicit ordering of routines inside playlists  
- `comments` – social comments attached to playlists  
- `follows` – user‑to‑user follow relationships  
- `useractivitylogs` – records of playlist completions over time. 

All structured data lives in a single PostgreSQL database for simplicity. 

---

### AI / Analytics
- External analytics and ML services for:
  - content moderation  
  - recommendations  
  - effectiveness estimation  
  - trending and ranking detection. 

The backend forwards summarized activity and content data to these services and combines their outputs with database queries. 

---

## 🔒 Privacy & Safety
WellTune is designed around **wellness, not performance**: 
- no numeric leaderboards or public scoring of users  
- focus on routines, playlists, and personal progress  
- moderation of harmful or off‑topic content through AI models  
- social features (comments, follows) without competitive ranking. 

The intent is to reduce pressure, avoid toxic comparison, and keep user attention on real health benefits rather than app‑driven metrics. 

---

## 🎯 Project Goals
- Provide a structured but non‑competitive way to manage physical and mental health routines.  
- Create a welcoming community where users share routines and support each other.  
- Offer a healthier alternative to traditional social media and gamified fitness apps.  
- Use analytics and moderation to keep content relevant, safe, and wellness‑aligned.  
- Keep the architecture full‑stack but understandable for a semester‑long project (React + Node.js + PostgreSQL + analytics/ML components). 

---

## 🧩 Future Ideas
Beyond the implemented MVP, future extensions could include: 
- richer “health summary” or weekly wrap‑up views based on activity logs  
- more advanced recommendation models using sequence or similarity learning  
- badges or streaks carefully designed to avoid unhealthy competition  
- deeper analytics for routine effectiveness over longer time horizons. 

---

## 📌 Status
🚧 Early‑stage concept and implemented MVP as part of the CSCI 4560 semester project at Middle Tennessee State University. The current system includes the core architecture (React frontend, Node.js backend, PostgreSQL database) and primary workflows (onboarding survey, playlist browsing, routine execution, social interactions, and logging for analytics). 
