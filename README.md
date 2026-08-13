# 🚀 Social Scheduler

A full-stack social media scheduling application that helps users create
AI-powered social media content, generate images, connect social
accounts, and schedule posts from a single dashboard.

🌐 **Live Demo:** [Social Scheduler](https://social-scheduler-two-snowy.vercel.app/)
## ✨ Features

-   🔐 **Authentication** --- User registration/login with persistent
    authentication.
-   📊 **Dashboard** --- Overview of posts, connected accounts, and
    activity.
-   🔗 **Social Account Management** --- Connect, sync, and disconnect
    supported accounts.
-   🤖 **AI Composer**
    -   Generate social media content from a prompt.
    -   Choose tones such as Professional, Creative, Funny, Minimalist,
        and Excited.
    -   Optionally generate AI images.
    -   Review recent generations.
    -   Schedule generated posts.
-   📅 **Post Scheduler**
    -   Select one or more platforms.
    -   Choose date and time.
    -   Prevent duplicate schedule submissions.
    -   Validate that every selected platform is connected before
        scheduling.
-   ☁️ **Cloudinary Media Storage** --- Persist generated/uploaded
    media.
-   🔄 **Account Sync** --- Synchronize connected social accounts with
    the backend.

## 🛠️ Tech Stack

### Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   React Router
-   Axios
-   Lucide React
-   React Hot Toast

### Backend

-   Node.js
-   Express
-   TypeScript
-   MongoDB
-   Mongoose
-   JWT
-   Axios

### AI & Media

-   Google Gemini API --- AI text/content generation
-   Pollinations AI / configured image-generation provider --- AI image
    generation
-   Cloudinary --- media storage

## 📁 Project Structure

``` text
Social-Schedular/
├── client/
│   └── src/
│       ├── api/
│       ├── assets/
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
│   ├── routes/
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

<img width="1875" height="1049" alt="AI Composer Page " src="https://github.com/user-attachments/assets/4dddeb38-28e4-45d8-9a17-0a641a66c50c" />

### 📅 Post Scheduler

<img width="1870" height="1042" alt="Scheduler Page " src="https://github.com/user-attachments/assets/32928111-b31a-4647-a374-a80a98bf8dde" />



## 🔄 Application Flow

``` text
User
 │
 ├── Login / Register
 │
 ├── Connect Social Accounts
 │
 ├── AI Composer
 │      ├── Enter prompt
 │      ├── Select tone
 │      ├── Generate content
 │      └── Optionally generate image
 │
 ├── Select platforms
 │      └── Verify connected accounts
 │
 └── Select date & time
        └── Schedule Post
              ├── Backend API
              ├── MongoDB
              └── Scheduling service
```

## 🔗 Connected Account Validation

Before scheduling, the application verifies that all selected platforms
are connected to the current user's account.

Example:

``` text
Instagram → Connected ✅
LinkedIn  → Not Connected ❌

Selected:
Instagram + LinkedIn

Result:
"Please connect: LinkedIn"
```

The schedule request is stopped until the missing account is connected.

## 🔑 Main API Areas

``` text
/api/auth/*
/api/accounts
/api/oauth/*
/api/posts
/api/posts/generate
/api/posts/generations
/api/activity
```

Exact OAuth routes and supported providers depend on the current backend
configuration.


## 🔮 Future Improvements

-   More social platforms
-   Calendar-based scheduling
-   Scheduled-post editing/cancellation
-   Analytics and performance tracking
-   Background job monitoring and retries
-   Richer media support
-   Team/workspace collaboration
-   Automated hashtag/content optimization

## 👨‍💻 Author

**Kartik Palan**

A full-stack AI-powered social media automation and scheduling project.
