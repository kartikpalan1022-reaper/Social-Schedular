# 🚀 Social Scheduler

A full-stack AI-powered social media scheduling platform that lets users generate content, create AI images, connect social accounts, and schedule posts for automatic publishing.

🌐 **Live Demo:** https://social-scheduler-two-snowy.vercel.app/

## ✨ Features

- 🔐 **Authentication** — JWT-based registration and login
- 📊 **Dashboard** — Posts, accounts, and activity overview
- 🔗 **Social Accounts** — Connect, sync, and validate accounts
- 🤖 **AI Composer** — Generate content and AI images with multiple tones
- 📅 **Post Scheduler** — Schedule posts for one or multiple platforms
- ⏰ **Automated Publishing** — Cron-based background scheduling
- ☁️ **Cloudinary** — Upload and store media
- 🔄 **Account Sync** — Synchronize connected social accounts

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios

**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Axios

**AI & Media:** Google Gemini API, Pollinations AI, Cloudinary

**Scheduling & Publishing:** cron-job.org, Vercel, Zernio

## 📁 Project Structure

```text
Social-Schedular/
├── client/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/
│           ├── Dashboard.tsx
│           ├── Accounts.tsx
│           ├── Schedular.tsx
│           └── AIComposer.tsx
├── server/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── route/
│   ├── services/
│   │   └── schedulerService.ts
│   └── server.ts
└── README.md
```

## 🖼️ Screenshots

### 🔐 Login
<img width="1866" height="1038" alt="Login Screen" src="https://github.com/user-attachments/assets/a945ab77-e52e-4cc9-9c6b-fde5fa7529b2" />

### 📊 Dashboard
<img width="1867" height="1044" alt="Dashboard" src="https://github.com/user-attachments/assets/932a9623-97f2-4a21-8a75-5987068bd073" />

### 🔗 Connected Social Accounts
<img width="1862" height="1038" alt="Accounts Screen" src="https://github.com/user-attachments/assets/55f8d1b2-cc07-4b23-8fcf-38fa4350f715" />

### 🤖 AI Composer
<img width="1875" height="1049" alt="AI Composer Page" src="https://github.com/user-attachments/assets/4dddeb38-28e4-45d8-9a17-0a641a66c50c" />

### 📅 Post Scheduler
<img width="1870" height="1042" alt="Scheduler Page" src="https://github.com/user-attachments/assets/32928111-b31a-4647-a374-a80a98bf8dde" />

## 🔄 Application Flow

```text
User
 │
 ├── Login / Register
 ├── Connect Social Accounts
 ├── Generate AI Content / Image
 ├── Select Platforms
 ├── Select Date & Time
 └── Schedule Post
          │
          ▼
       MongoDB
          │
          ▼
    cron-job.org
    (every 1 minute)
          │
          ▼
POST /api/posts/process-scheduled
          │
          ▼
   Scheduler Service
          │
          ▼
        Zernio
          │
          ▼
    Social Platform
          │
          ▼
      Published ✅
```

## ⏰ Scheduled Post Processing

```text
scheduled → publishing → published ✅
                    └→ failed ❌
```

The scheduler atomically claims due posts, publishes them through Zernio, and updates their status in MongoDB.

The processing endpoint is protected using a cron secret:

```text
Authorization: Bearer <CRON_SECRET>
```

## 🔑 Main API Areas

```text
/api/auth/*
/api/accounts/*
/api/oauth/*
/api/posts/*
/api/posts/generate
/api/posts/generations
/api/posts/process-scheduled
/api/activity/*
```

## 🚀 Deployment

- **Frontend:** Vercel
- **Backend:** Vercel
- **Database:** MongoDB Atlas
- **Media:** Cloudinary
- **Scheduler:** cron-job.org
- **Publishing:** Zernio


## 🔮 Future Improvements

- More social platforms
- Calendar-based scheduling
- Post editing and cancellation
- Analytics and performance tracking
- Automatic retries
- Recurring posts
- Team/workspace collaboration
- Advanced AI content optimization

## 👨‍💻 Author

**Kartik Palan**

Full-stack AI-powered social media automation and scheduling project.
