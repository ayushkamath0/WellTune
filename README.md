# 🧠 WellTune

WellTune is a social health app inspired by Spotify's discovery model.
Instead of music, users discover health routines and habits that match their lifestyle, goals, and activity level... all automatically moderated by AI to stay focused on wellness.

## 🚀 Idea Overview

Most health apps are either:

- **solo and boring**, or
- **social but noisy and off-topic**

WellTune combines personal health tracking with smart social discovery.

**Users:**
- answer a short health survey
- upload routines & habits that work for them
- discover other people's routines based on shared goals
- choose what health data is public or private

Everything stays on-topic because AI moderates all content automatically.

## ✨ Core Features

### 📝 Health Survey (Onboarding)

Users answer a short survey about:
- activity level (sedentary / neutral / active)
- goals (fat loss, mental health, strength, etc.)
- habits & lifestyle

Results are stored and used for recommendations

### 👤 User Profiles

Profile shows:
- username & bio
- health progress charts
- uploaded routines

**Privacy toggle:**
- charts & routines can be public or private

### 📊 Health Charts

Automatically generated charts based on user activity & habits

**Examples:**
- consistency over time
- activity level trends

Charts update as users log habits

### 🔁 Routines & Habits

Users can:
- upload routines (workouts, sleep routines, mental health habits, etc.)
- tag them (e.g. home-workout, beginner, mental-health)

Other users can:
- like or dislike routines
- save routines to try later

### 🎧 Smart Recommendations (Spotify-style)

Users are recommended routines based on:
- shared tags
- similar activity levels
- liked/disliked routines

Simple scoring system (no heavy ML needed for MVP)

### 🤖 AI Auto-Moderation

Every post is checked by AI before going public:
- must be health-related
- must align with wellness goals
- AI flags off-topic or unsafe content

Stores approval + confidence score

## 🛠 Tech Stack (Simple by Design)

### Frontend
- React / Next.js

### Backend
- Node.js (Express) or Python (FastAPI)

### Database
- PostgreSQL
  - users
  - surveys
  - routines
  - habits
  - likes
  - tags
  - health metrics

### AI
- OpenAI API
  - content moderation
  - tag validation
  - topic checking

### Optional (Later)
- Redis (caching)
- Advanced recommendation models

## 🗄 Database Design (High Level)

- `users` – account & profile data
- `health_surveys` – onboarding survey results (JSONB)
- `routines` – user-created routines
- `habits` – steps inside routines
- `tags` – routine categorization
- `likes` – user feedback
- `health_metrics` – time-based data for charts

All handled in one PostgreSQL database for simplicity.

## 🔒 Privacy & Safety

- No medical diagnosis or treatment advice
- User-controlled privacy settings
- Sensitive health data separated from public profiles
- AI moderation prevents off-topic or harmful content

## 🎯 Project Goals

- Make health improvement social but focused
- Reduce noise and misinformation
- Encourage consistency through community discovery
- Keep the tech stack simple and scalable

## 🧩 Future Ideas

- Weekly "Health Wrapped"
- Streaks & consistency badges
- Group challenges
- Advanced personalized recommendations

## 📌 Status

🚧 **Early-stage concept / MVP**
