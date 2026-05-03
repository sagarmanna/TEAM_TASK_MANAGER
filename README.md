# 🚀 Team Task Manager

A full-stack team task management application with authentication, project management, task assignment, progress tracking, and **Admin/Member role-based access control**.

---

## 🌐 Live Demo

👉 https://teamtaskmanager-production-ee14.up.railway.app/

---

## 🎥 Demo Video

👉 https://drive.google.com/file/d/1C1LFnqvfjcoE_IWJ6QLlG_KRbbnzymG6/view?usp=sharing

---

## ✨ Features

* 🔐 JWT-based authentication (Signup/Login)
* 🛡️ Protected dashboard, projects, tasks, and REST API routes
* 👥 Admin and Member roles
* 📁 Project creation and progress tracking
* ✅ Task creation, assignment, due dates, and status updates
* 📊 Dashboard stats for total, completed, pending, and overdue tasks
* 🗄️ PostgreSQL database with Prisma relationships
* 🚀 Railway-ready build setup

---

## 🧑‍💻 Tech Stack

* **Frontend & Backend:** Next.js 16, React 19, TypeScript
* **Styling:** Tailwind CSS
* **API:** Next.js API Routes
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Auth:** JWT, bcryptjs

---

## ⚙️ Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-secret-key"
```

### 4️⃣ Setup database

```bash
npx prisma db push
```

### 5️⃣ Run the app

```bash
npm run dev
```

👉 Open: http://localhost:3000

---

## 👥 Roles & Permissions

### 🛠️ Admin

* Create projects
* Assign tasks to any team member
* Update any assigned workflow allowed by the API
* View dashboard, projects, users, and tasks

### 👤 Member

* View dashboard, projects, users, and tasks
* Create tasks assigned to themselves unless an admin assigns otherwise
* Update only their own task status

---

## 🔌 API Routes

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/dashboard

GET    /api/projects
POST   /api/projects

GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/[id]

GET    /api/users
```

---

## 🚀 Deployment (Railway)

1. Push this repository to GitHub
2. Create a new Railway project from the GitHub repo
3. Add a Railway PostgreSQL database
4. Set environment variables:

```env
DATABASE_URL=<Railway PostgreSQL connection URL>
JWT_SECRET=<long random secret>
```

5. Deploy the app
6. Run the Prisma schema push once:

```bash
npx prisma db push
```

### ⚙️ Railway Config

* **Build:** `npm run build`
* **Start:** `npm start`

---

## 🧪 Verification

```bash
npm run lint
npm run build
```
