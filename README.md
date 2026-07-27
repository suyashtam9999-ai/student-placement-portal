# Student Placement Preparation Portal

A full-stack web application (Node.js + Express + **MySQL**) that helps students prepare
for campus placements: curated study resources, timed mock tests, and a readiness
dashboard that combines both into one score.

## Features
- **Auth**: Register/Login with JWT + hashed passwords (bcrypt)
- **Profile**: Branch, skills, resume/GitHub/LinkedIn links, target companies
- **Resources**: Aptitude / Coding / Core CS / HR / Communication material, filterable, mark-as-complete
- **Mock Tests**: Timed MCQ tests per category, instant scoring, answer review
- **Dashboard**: Readiness score = 40% resource progress + 60% average test score

## Tech Stack
- Backend: Node.js, Express.js, **MySQL**, Sequelize (ORM)
- Auth: JSON Web Tokens (JWT), bcryptjs
- Frontend: Static HTML/CSS/JavaScript (no framework) served by Express

## Folder Structure
```
student-placement-portal/
├── config/db.js               # Sequelize (MySQL) connection
├── models/                    # Sequelize models
│   ├── User.js
│   ├── Resource.js
│   ├── Question.js
│   ├── TestResult.js
│   └── CompletedResource.js   # join table: which student completed which resource
├── middleware/authMiddleware.js
├── controllers/                # Route logic
│   ├── authController.js
│   ├── profileController.js
│   ├── resourceController.js
│   └── testController.js
├── routes/                     # API endpoints
│   ├── authRoutes.js
│   ├── profileRoutes.js
│   ├── resourceRoutes.js
│   └── testRoutes.js
├── utils/seedData.js           # Sample resources + MCQ questions
├── public/                     # Frontend (served statically by Express)
│   ├── css/style.css
│   ├── js/ (api.js, auth.js, dashboard.js, resources.js, mocktest.js, profile.js)
│   ├── index.html, login.html, register.html
│   ├── dashboard.html, resources.html, mock-test.html, profile.html
├── server.js                   # App entry point
├── package.json
└── .env.example
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+) installed
- MySQL Server installed and running (MySQL Workbench / XAMPP / WAMP all work fine)

### 2. Create the database
Open MySQL (via terminal `mysql -u root -p`, or MySQL Workbench) and run:
```sql
CREATE DATABASE placement_portal;
```
That's it — Sequelize will automatically create all the required tables inside it
when the server first starts (`sequelize.sync`).

### 3. Install dependencies
```bash
cd student-placement-portal
npm install
```

### 4. Configure environment variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Then edit `.env` with your real MySQL credentials:
```
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=placement_portal
DB_USER=root
DB_PASSWORD=your_mysql_root_password
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRES_IN=7d
```

### 5. Seed sample data (resources + mock test questions)
```bash
npm run seed
```

### 6. Run the app
```bash
npm start
```
Or, for auto-restart during development:
```bash
npm run dev
```

The app will be available at **http://localhost:5000**

### 7. Using the app
1. Open `http://localhost:5000` → click **Get Started** to register.
2. Log in → you'll land on the **Dashboard**.
3. Visit **Resources** to browse/mark study material complete.
4. Visit **Mock Tests** to attempt a timed test and see your score + review.
5. Visit **Profile** to fill in branch, skills, resume link, etc.
6. Your **Dashboard** readiness score updates automatically as you use the app.

## API Overview

| Method | Endpoint                        | Auth | Description                     |
|--------|----------------------------------|------|----------------------------------|
| POST   | /api/auth/register               | No   | Register a new student          |
| POST   | /api/auth/login                  | No   | Log in, returns JWT             |
| GET    | /api/profile/me                  | Yes  | Get logged-in user's profile    |
| PUT    | /api/profile/me                  | Yes  | Update profile fields           |
| GET    | /api/profile/dashboard           | Yes  | Get readiness stats             |
| GET    | /api/resources                   | Yes  | List resources (optional ?category=) |
| PUT    | /api/resources/:id/complete      | Yes  | Toggle resource completion      |
| POST   | /api/resources                   | Admin| Create a resource                |
| DELETE | /api/resources/:id               | Admin| Delete a resource                |
| GET    | /api/tests/questions              | Yes  | Get random questions by category |
| POST   | /api/tests/submit                | Yes  | Submit answers, get score + review |
| GET    | /api/tests/history                | Yes  | Get logged-in user's past results |

## Database Tables (auto-created by Sequelize)
- **Users** — student accounts and profile fields
- **Resources** — study material
- **Questions** — MCQ bank
- **TestResults** — one row per mock test attempt
- **CompletedResources** — join table linking Users ↔ Resources they've completed

## Possible Extensions (for report / future scope)
- Admin panel UI for managing resources and questions
- Company-wise placement drive tracker with application status
- Coding editor integration (Judge0 API) for live code execution
- Email notifications for upcoming drives
- Leaderboard comparing readiness scores across a batch
