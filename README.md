# Team Task Manager

A full-stack team task management app with authentication, project management, task assignment, progress tracking, and Admin/Member role-based access control.

## Features

- Signup and login with JWT authentication
- Protected dashboard, projects, tasks, and REST API routes
- Admin and Member roles
- Project creation and progress tracking
- Task creation, assignment, due dates, and status updates
- Dashboard stats for total, completed, pending, and overdue tasks
- PostgreSQL database with Prisma relationships
- Railway-ready build setup

## Tech Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS
- Next.js API routes
- Prisma ORM
- PostgreSQL
- JWT and bcryptjs

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="replace-with-a-secure-secret"
```

3. Push the Prisma schema:

```bash
npx prisma db push
```

4. Start the app:

```bash
npm run dev
```

Open http://localhost:3000.

## Roles

Admin:

- Create projects
- Assign tasks to any team member
- Update any assigned workflow allowed by the API
- View dashboard, projects, users, and tasks

Member:

- View dashboard, projects, users, and tasks
- Create tasks assigned to themselves unless an admin assigns otherwise
- Update only their own task status

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/dashboard`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/[id]`
- `GET /api/users`

## Railway Deployment

1. Push this repository to GitHub.
2. Create a new Railway project from the GitHub repo.
3. Add a Railway PostgreSQL database.
4. Set these environment variables in Railway:

```env
DATABASE_URL=<Railway PostgreSQL connection URL>
JWT_SECRET=<long random secret>
```

5. Deploy the app.
6. Run the Prisma schema push once from Railway shell or locally against the Railway database:

```bash
npx prisma db push
```

Railway should use:

- Build command: `npm run build`
- Start command: `npm start`

## Submission

- Live URL: publish the Railway production URL after deployment
- GitHub repo: include the repository URL used for Railway deployment
- Demo video: record a 2 to 5 minute walkthrough showing signup, login, project creation, task assignment, status update, dashboard stats, and role restrictions

## Verification

This project currently passes:

```bash
npm run lint
npm run build
```
