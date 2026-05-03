import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  FolderKanban,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

const previewTasks = [
  {
    title: "Finalize Railway deployment",
    owner: "Admin",
    status: "Done",
    due: "Today",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Assign QA checklist",
    owner: "Priya Shah",
    status: "In progress",
    due: "May 08",
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Review overdue tasks",
    owner: "Marcus Lee",
    status: "Pending",
    due: "May 12",
    color: "bg-sky-100 text-sky-700",
  },
];

const features = [
  {
    title: "Admin controls",
    body: "Create projects and assign work to every team member.",
    icon: <ShieldCheck size={20} />,
  },
  {
    title: "Member workflow",
    body: "Members can update only their assigned task progress.",
    icon: <UsersRound size={20} />,
  },
  {
    title: "Live dashboard",
    body: "Track status, progress, and overdue delivery risks.",
    icon: <CalendarClock size={20} />,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef2ff] text-slate-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-cyan-300/50 blur-3xl" />
        <div className="absolute right-0 top-0 h-[34rem] w-[34rem] rounded-full bg-indigo-300/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 rounded-full bg-emerald-200/60 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-8 sm:px-8 lg:px-10">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-2xl shadow-indigo-200/70 backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex min-h-[42rem] flex-col justify-between p-7 sm:p-10 lg:p-12">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                  <FolderKanban size={25} />
                </div>
                <div>
                  <p className="text-2xl font-black tracking-tight text-indigo-700">
                    Tasky
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Team task manager
                  </p>
                </div>
              </div>

              <div className="mt-16 max-w-xl">
                <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
                  <Sparkles size={16} />
                  Railway-ready full-stack project workspace
                </p>

                <h1 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
                  Manage projects, owners, and deadlines in one place.
                </h1>

                <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
                  A realistic project workspace with signup, login, Admin and
                  Member access, task assignments, overdue tracking, and
                  database-backed REST APIs.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/signup"
                    className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                  >
                    Create Workspace
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/login"
                    className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-800 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="font-black tracking-tight text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative isolate overflow-hidden bg-[#8d8af7] p-6 sm:p-10 lg:p-12">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/25 blur-3xl" />
            <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

            <div className="relative flex h-full min-h-[42rem] flex-col justify-between rounded-[1.75rem] border border-white/30 bg-white/16 p-6 text-white shadow-2xl shadow-indigo-900/20 backdrop-blur-md sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white/70">
                      Operations snapshot
                    </p>
                    <h2 className="mt-1 text-3xl font-black tracking-tight">
                      Sprint Delivery
                    </h2>
                  </div>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-indigo-700">
                    72% on track
                  </span>
                </div>

                <div className="mt-8 rounded-[1.5rem] bg-white p-5 text-slate-950 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-sm font-bold text-slate-400">
                        Project
                      </p>
                      <h3 className="text-xl font-black">Website Launch</h3>
                    </div>
                    <div className="flex -space-x-2">
                      {["P", "M", "A"].map((name) => (
                        <span
                          key={name}
                          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-sm font-black text-indigo-700"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {previewTasks.map((task) => (
                      <div
                        key={task.title}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-black tracking-tight">
                              {task.title}
                            </h4>
                            <p className="mt-1 text-sm text-slate-500">
                              Assigned to {task.owner}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${task.color}`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-400">
                          Due {task.due}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["18", "Tasks"],
                  ["07", "Done"],
                  ["03", "Overdue"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-3xl bg-white/18 p-5 text-center ring-1 ring-white/20"
                  >
                    <p className="text-3xl font-black">{value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm font-semibold leading-6 text-white/80">
                <CheckCircle2 size={18} />
                Built for Admin and Member workflows with real database records.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
