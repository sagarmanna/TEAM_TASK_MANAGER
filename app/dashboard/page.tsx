"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DashboardStats from "@/components/DashboardStats";
import TaskCard from "@/components/TaskCard";
import { CheckCircle2, AlertCircle, Timer, TrendingUp, Users, Calendar, Trash2 } from "lucide-react";

type DashboardData = {
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  };
  projectProgress: {
    id: string;
    name: string;
    progress: number;
  }[];
  recentTasks: {
    id: string;
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    dueDate: string;
    project: {
      name: string;
    };
    assignedTo: {
      name: string;
    } | null;
  }[];
  users: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MEMBER";
  }[];
};

const statusLabel = {
  TODO: "Pending",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MEMBER";
  } | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    async function loadDashboard() {
      const res = await fetch("/api/dashboard", {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const dashboard = await res.json();

      setData(dashboard);
      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  const isAdmin = currentUser?.role === "ADMIN";

  async function deleteMember(userId: string) {
    if (!isAdmin) {
      setMessage("Only admins can remove team members.");
      return;
    }

    const confirmed = window.confirm(
      "Remove this team member from the workspace?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ id: userId }),
    });

    if (res.ok) {
      setData((current) =>
        current
          ? {
              ...current,
              users: current.users.filter((user) => user.id !== userId),
            }
          : current
      );
      setMessage("Team member removed successfully.");
    } else {
      const data = await res.json();
      setMessage(data.message || "Could not remove team member.");
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="mx-auto w-full max-w-[118rem] flex-1 px-6 py-8 sm:px-8 lg:px-10">
          <div className="mb-10 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="mb-3 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-5xl font-black leading-none tracking-[-0.05em] text-transparent md:text-6xl">
                  Dashboard
                </h1>
                <p className="max-w-2xl text-lg leading-8 tracking-[0.01em] text-slate-400">
                  Live project progress, team workload and overdue tasks.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-950/80 px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200 shadow-sm shadow-cyan-500/10">
                Workspace analytics
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {data && (
            <>
              <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardStats
                  title="Total Tasks"
                  value={data.stats.totalTasks}
                  variant="blue"
                  icon={<TrendingUp size={24} />}
                />
                <DashboardStats
                  title="Completed"
                  value={data.stats.completedTasks}
                  variant="emerald"
                  icon={<CheckCircle2 size={24} />}
                />
                <DashboardStats
                  title="Pending"
                  value={data.stats.pendingTasks}
                  variant="amber"
                  icon={<Timer size={24} />}
                />
                <DashboardStats
                  title="Overdue"
                  value={data.stats.overdueTasks}
                  variant="rose"
                  icon={<AlertCircle size={24} />}
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(22rem,0.95fr)]">
                <div className="space-y-10">
                  <section className="rounded-[2rem] border border-white/10 bg-slate-900/85 p-7 shadow-2xl shadow-black/20 sm:p-8">
                    <div className="mb-7 flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-950/30">
                        <TrendingUp size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-[-0.03em]">Project Progress</h2>
                        <p className="mt-1 text-sm text-slate-400">Track active project completion and delivery momentum.</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {data.projectProgress.length === 0 && (
                        <p className="rounded-2xl border border-dashed border-white/10 bg-slate-950/35 py-8 text-center text-base tracking-[0.01em] text-slate-400">
                          No projects yet. Create one from the Projects page.
                        </p>
                      )}

                      {data.projectProgress.map((project) => (
                        <div key={project.id} className="rounded-[2rem] border border-slate-700/50 bg-slate-950/35 p-5">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
                            <span className="font-semibold text-lg text-white">{project.name}</span>
                            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-sm font-bold text-blue-300 shadow-sm shadow-blue-500/20">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[2rem] border border-white/10 bg-slate-900/85 p-7 shadow-2xl shadow-black/20 sm:p-8">
                    <div className="mb-7 flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-teal-600 text-white shadow-lg shadow-teal-950/30">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-[-0.03em]">Recent Tasks</h2>
                        <p className="mt-1 text-sm text-slate-400">See the latest activity and assignments across your team.</p>
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      {data.recentTasks.length === 0 && (
                        <p className="col-span-2 rounded-2xl border border-dashed border-white/10 bg-slate-950/35 py-8 text-center text-base tracking-[0.01em] text-slate-400">
                          No tasks yet. Create one from the Tasks page.
                        </p>
                      )}

                      {data.recentTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          title={task.title}
                          status={statusLabel[task.status]}
                          dueDate={new Date(task.dueDate).toLocaleDateString()}
                          projectName={task.project.name}
                          assignedTo={task.assignedTo?.name}
                        />
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-6">
                  <section className="rounded-[2rem] border border-white/10 bg-slate-900/85 p-7 shadow-2xl shadow-black/20 sm:p-8">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-cyan-600 text-white shadow-lg shadow-cyan-950/30">
                        <Users size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-[-0.03em]">Team Members</h2>
                        <p className="mt-1 text-sm text-slate-400">Your active workspace members and roles.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {message ? (
                        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
                          {message}
                        </div>
                      ) : null}
                      {data.users.length === 0 && (
                        <p className="rounded-2xl border border-dashed border-white/10 bg-slate-950/35 py-8 text-center text-slate-400">No users yet.</p>
                      )}

                      {data.users.map((user) => (
                        <div
                          key={user.id}
                          className="rounded-[1.75rem] border border-white/5 bg-slate-950/40 p-4 hover:border-cyan-300/20 transition"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-black tracking-[-0.01em]">{user.name}</p>
                              <p className="mt-1 text-sm leading-6 tracking-[0.01em] text-slate-400">
                                {user.email} - {user.role}
                              </p>
                            </div>
                            {isAdmin && user.id !== currentUser?.id ? (
                              <button
                                type="button"
                                onClick={() => deleteMember(user.id)}
                                className="inline-flex items-center gap-2 rounded-xl bg-rose-500/90 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
                              >
                                <Trash2 size={14} />
                                Remove
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
