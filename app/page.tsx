import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  FolderKanban,
  Layers3,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

export const dynamic = "force-dynamic";

const features = [
  {
    title: "Admin controls",
    body: "Create projects and assign work to every team member.",
    icon: <ShieldCheck size={18} />,
  },
  {
    title: "Member workflow",
    body: "Members update only their assigned task progress.",
    icon: <UsersRound size={18} />,
  },
  {
    title: "Live dashboard",
    body: "Track status, progress, and overdue delivery risks.",
    icon: <CalendarClock size={18} />,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

async function getHomeSnapshot() {
  try {
    const now = new Date();
    const [totalTasks, completedTasks, overdueTasks, activeProject, recentTasks, users] =
      await Promise.all([
        prisma.task.count(),
        prisma.task.count({ where: { status: "DONE" } }),
        prisma.task.count({ where: { dueDate: { lt: now }, status: { not: "DONE" } } }),
        prisma.project.findFirst({ include: { tasks: true }, orderBy: { name: "asc" } }),
        prisma.task.findMany({
          take: 3,
          orderBy: { dueDate: "asc" },
          include: { assignedTo: { select: { name: true } } },
        }),
        prisma.user.findMany({ take: 3, orderBy: { name: "asc" }, select: { name: true } }),
      ]);

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      completionRate: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
      projectName: activeProject?.name ?? "No active project",
      recentTasks,
      users,
    };
  } catch {
    return {
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      completionRate: 0,
      projectName: "No active project",
      recentTasks: [],
      users: [],
    };
  }
}

export default async function HomePage() {
  const snapshot = await getHomeSnapshot();
  const pendingTasks = Math.max(snapshot.totalTasks - snapshot.completedTasks, 0);

  return (
    <main className="workspace-bg min-h-screen overflow-hidden text-white">
      <header className="border-b border-cyan-100/10 bg-[#070a1a]/90 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[4rem] w-full max-w-[120rem] items-center justify-between px-4 py-2.5 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-100/30 bg-cyan-300 text-slate-950 shadow-[0_0_26px_rgba(103,232,249,0.28)]">
              <Layers3 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black leading-tight sm:text-2xl">Team Task Manager</h1>
              <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-300/90">
                Workspace Control
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden h-10 items-center rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-bold text-white transition hover:border-cyan-200/25 hover:bg-cyan-300/10 sm:flex"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex h-10 items-center gap-2 rounded-lg bg-rose-500 px-4 text-sm font-black text-white shadow-lg shadow-rose-950/30 transition hover:bg-rose-400"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[120rem] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-cyan-100/10 bg-[#070d1d]/70 lg:block">
          <p className="border-b border-white/10 px-3 py-2 text-[11px] font-medium uppercase text-slate-400/90">
            Navigation
          </p>
          <div className="space-y-1 p-2">
            {["Dashboard", "Projects", "Tasks"].map((item, index) => (
              <div
                key={item}
                className={`flex items-center gap-3 border-l-2 p-3 ${
                  index === 0 ? "border-cyan-300 bg-cyan-300/13" : "border-transparent"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-900/70 text-cyan-200">
                  <FolderKanban size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold">{item}</p>
                  <p className="text-xs text-slate-500">
                    {index === 0 ? "Overview & analytics" : index === 1 ? "Manage all projects" : "Track daily tasks"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="glass-panel relative overflow-hidden rounded-xl p-4 sm:p-6 lg:p-7">
          <div className="hex-grid pointer-events-none absolute right-0 top-0 h-52 w-[34rem] opacity-45" />

          <div className="relative mb-5 flex flex-col gap-5 border-b border-cyan-100/10 pb-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-cyan-100">
                <Sparkles size={14} />
                Workspace Analytics
              </div>
              <h2 className="text-5xl font-black leading-none sm:text-6xl lg:text-7xl">
                Dashboard
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Manage projects, owners, deadlines, and delivery risks from one compact control room.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-100 px-6 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
              >
                Create Workspace
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/login"
                className="flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-6 text-sm font-black text-white transition hover:border-cyan-300/25 hover:bg-cyan-300/10"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(21rem,0.9fr)]">
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Total Tasks", value: snapshot.totalTasks, tone: "text-blue-200" },
                  { label: "Completed", value: snapshot.completedTasks, tone: "text-emerald-200" },
                  { label: "Pending", value: pendingTasks, tone: "text-amber-200" },
                ].map((stat) => (
                  <div key={stat.label} className="glass-panel-soft rounded-xl p-4">
                    <CheckCircle2 className={stat.tone} size={22} />
                    <p className="mt-4 text-4xl font-black leading-none">{stat.value}</p>
                    <p className="mt-2 text-xs font-bold uppercase text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              <section className="glass-panel-soft rounded-xl p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/12 text-blue-200">
                    <FolderKanban size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Project Progress</h3>
                    <p className="text-sm text-slate-300">{snapshot.projectName}</p>
                  </div>
                </div>

                <div className="relative flex min-h-40 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-slate-200/80">
                  <div className="absolute inset-x-16 top-1/2 h-4 -translate-y-1/2 rotate-[-28deg] rounded bg-slate-400/45" />
                  <span className="relative rounded-lg bg-slate-700/65 px-4 py-2 font-semibold text-white shadow-lg">
                    {snapshot.completionRate}% On Track
                  </span>
                </div>
              </section>
            </div>

            <div className="space-y-3">
              <section className="glass-panel-soft rounded-xl p-4">
                <h3 className="mb-3 text-xl font-black">Team Members</h3>
                <div className="space-y-3">
                  {snapshot.users.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-white/10 px-4 py-5 text-center text-sm text-slate-400">
                      No members yet.
                    </p>
                  ) : (
                    snapshot.users.map((user) => (
                      <div key={user.name} className="flex items-center gap-3 border-b border-white/10 pb-3 last:border-b-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-cyan-300/20 text-xs font-black">
                          {initials(user.name)}
                        </div>
                        <p className="font-bold">{user.name}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="glass-panel-soft rounded-xl p-4">
                <h3 className="mb-3 text-xl font-black">System Alerts</h3>
                <div className="rounded-lg border border-rose-300/20 bg-rose-400/10 p-4">
                  <p className="text-4xl font-black text-rose-200">{snapshot.overdueTasks}</p>
                  <p className="mt-2 text-xs font-bold uppercase text-slate-400">Overdue Tasks</p>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="glass-panel-soft rounded-xl p-4">
                <div className="mb-3 text-cyan-200">{feature.icon}</div>
                <h3 className="text-sm font-black uppercase tracking-wide">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
