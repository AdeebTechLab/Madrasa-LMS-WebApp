# Sakinah Quranic LMS — MongoDB Edition

A complete Quran Madrasa Learning Management System with a serene emerald, cream, and gold interface. The project is designed to be easy to open in VS Code, run locally, deploy to **Vercel** (frontend), **Render** (API), and connect to **MongoDB Atlas** (database).

## Included roles and workflows

### Student portal

- Secure role-based login
- Daily **Sabaq**, **Sabqi**, and **Manzil** assignment view
- Arabic Quran lesson focus panel and optional recitation audio link
- Student practice note and optional recording-link submission
- Teacher feedback, Tajweed notes, score, and voice-feedback link
- 30-Juz visual progress map
- Daily reflection, adab reminder, and madrasa prayer schedule panels

### Teacher portal

- Assigned class groups and enrolled students
- Pending recitation review table
- Daily Quran assignment planner for Sabaq, Sabqi, and Manzil
- Teacher feedback composer with score, Tajweed feedback, and optional voice link
- Assignment and feedback updates are stored in MongoDB and shown to students

### Admin portal

- Live counts for students, teachers, courses, and pending admissions
- Admission-request review with PENDING, CONTACTED, APPROVED, and DECLINED statuses
- Current class overview, teacher, course, and schedule visibility

### Public website

- Quranic LMS home page
- Course catalog from MongoDB
- Admission form that creates a real admin-reviewable request
- Serene Islamic visual additions without changing the core emerald/cream/gold design direction

## Stack

| Area | Technology |
|---|---|
| Web app | Next.js 14, React, Tailwind CSS |
| API | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt password hashing, role-based route protection |
| Frontend hosting | Vercel |
| API hosting | Render |
| Database hosting | MongoDB Atlas |

## Project structure

```text
Sakinah-Quranic-LMS-MongoDB/
├── backend/                 # Express API and MongoDB models
│   ├── scripts/seed.js      # Demo data setup
│   └── src/
├── frontend/                # Next.js web application
├── .vscode/extensions.json  # Helpful VS Code extension recommendations
├── docker-compose.yml       # Local MongoDB container
├── render.yaml              # Render Blueprint for the backend
└── README.md
```

## Open and run locally in VS Code

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- Docker Desktop **or** a MongoDB Atlas connection string
- VS Code

### 1. Open the project

Extract the ZIP, then open the **Sakinah-Quranic-LMS-MongoDB** folder in VS Code.

```bash
code Sakinah-Quranic-LMS-MongoDB
```

### 2. Start local MongoDB with Docker

From the root folder:

```bash
docker compose up -d
```

This starts MongoDB at `mongodb://127.0.0.1:27017/sakinah_lms`.

### 3. Configure API environment variables

Create `backend/.env` by copying `backend/.env.example`.

**Windows PowerShell**

```powershell
Copy-Item backend/.env.example backend/.env
```

**macOS/Linux**

```bash
cp backend/.env.example backend/.env
```

Replace `JWT_SECRET` with a long random value before real deployment.

### 4. Configure frontend environment variables

Create `frontend/.env.local` by copying `frontend/.env.local.example`.

**Windows PowerShell**

```powershell
Copy-Item frontend/.env.local.example frontend/.env.local
```

**macOS/Linux**

```bash
cp frontend/.env.local.example frontend/.env.local
```

### 5. Install dependencies

From the root folder:

```bash
npm install
npm run install:all
```

### 6. Seed demo data

```bash
npm run seed
```

### 7. Start both applications

```bash
npm run dev
```

Open:

- Web app: `http://localhost:3000`
- API health check: `http://localhost:4000/api/health`

> Alternative: Run `npm run dev` separately inside `backend` and `frontend` in two VS Code terminals.

## Demo logins

| Role | Email | Password |
|---|---|---|
| Admin | `admin@sakinah.test` | `password123` |
| Teacher | `teacher@sakinah.test` | `password123` |
| Student | `student@sakinah.test` | `password123` |

Also seeded for teacher-review testing: `maryam@sakinah.test` / `password123`.

## Deploy the API on Render

1. Push this repository to GitHub.
2. Create a MongoDB Atlas database and obtain the application connection string.
3. In Render, create a new **Blueprint** and select the repository, or create a Web Service manually.
4. For a manual service, use:

   ```text
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   Health Check Path: /api/health
   ```

5. Set the following Render environment variables:

   ```text
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=a_long_random_secret
   FRONTEND_URL=https://your-vercel-project.vercel.app
   ```

6. After the first deployment, open the Render Shell and seed production demo data only if required:

   ```bash
   npm run seed
   ```

For a live madrasa, replace demo accounts and demo data before public launch.

## Deploy the frontend on Vercel

1. Import the same GitHub repository into Vercel.
2. Set the Vercel **Root Directory** to `frontend`.
3. Add this environment variable:

   ```text
   NEXT_PUBLIC_API_URL=https://your-render-api.onrender.com
   ```

4. Deploy.
5. Copy the Vercel production URL and update Render `FRONTEND_URL` with it. Redeploy the Render API after changing CORS settings.

## Production checklist

- [ ] Use a strong unique `JWT_SECRET`.
- [ ] Use a dedicated MongoDB Atlas database user with a strong password.
- [ ] Allow Render to connect in MongoDB Atlas Network Access settings.
- [ ] Set `FRONTEND_URL` to the exact Vercel production domain.
- [ ] Do not commit `.env`, `.env.local`, `node_modules`, or `.next`.
- [ ] Replace demo accounts and set a password-reset flow before launch.
- [ ] Ensure teacher feedback remains the final authority for Tajweed and Hifz assessment.

## API endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Logged in | Get current user |
| GET | `/api/public/courses` | Public | List published courses |
| POST | `/api/public/admissions` | Public | Submit admission request |
| GET | `/api/student/dashboard` | Student | Student dashboard data |
| POST | `/api/student/submit-recitation` | Student | Submit a recitation note/link |
| GET | `/api/teacher/dashboard` | Teacher | Teacher dashboard data |
| POST | `/api/teacher/assignments` | Teacher | Create daily Quran assignment |
| POST | `/api/teacher/feedback` | Teacher | Submit feedback for a recitation |
| GET | `/api/admin/dashboard` | Admin | Admin overview |
| PATCH | `/api/admin/admissions/:admissionId` | Admin | Update admission status |

## Important Quran-learning note

The interface can organize learning and make feedback visible, but qualified teachers remain responsible for recitation correction, Tajweed judgement, and Hifz approval.
