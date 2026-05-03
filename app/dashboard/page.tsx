"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import DashboardStats from "@/components/DashboardStats";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Plus,
  Timer,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";

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
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    overdueTasks: number;
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

const badgeColor = {
  TODO: "border-amber-300/25 bg-amber-300/12 text-amber-100",
  IN_PROGRESS: "border-cyan-300/25 bg-cyan-300/12 text-cyan-100",
  DONE: "border-emerald-300/25 bg-emerald-300/12 text-emerald-100",
};

function getStoredUser() {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as {
      id: string;
      name: string;
      email: string;
      role: "ADMIN" | "MEMBER";
    };
  } catch {
    return null;
  }
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useState(getStoredUser);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function loadDashboard() {
      const res = await fetch("/api/dashboard", {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.status === 401) {
        router.push("/login");
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

    const confirmed = window.confirm("Remove this team member from the workspace?");
    if (!confirmed) return;

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
      const errData = await res.json();
      setMessage(errData.message || "Could not remove team member.");
    }
  }

  return (
    <div className="workspace-bg min-h-screen overflow-x-hidden text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="mx-auto w-full max-w-[118rem] flex-1 px-3 py-4 sm:px-5 lg:px-6">
          <div className="glass-panel relative overflow-hidden rounded-xl p-4 sm:p-5 lg:p-6">
            <div className="hex-grid pointer-events-none absolute right-0 top-0 h-44 w-96 opacity-45" />

            <div className="relative mb-3 flex flex-col gap-3 border-b border-cyan-100/10 pb-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-4xl font-black leading-none text-white sm:text-5xl">
                  Dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-6 text-slate-300">
                  Live project progress, team workload and overdue tasks.
                </p>
              </div>

              <div className="w-fit text-xs font-black uppercase tracking-wide text-cyan-200">
                Workspace Analytics
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-300" />
              </div>
            )}

            {data && (
              <>
                <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

                <div className="grid gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(21rem,0.92fr)]">
                  <div className="space-y-3">
                    <section className="glass-panel-soft rounded-xl p-3 sm:p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/12 text-blue-200">
                          <TrendingUp size={22} />
                        </div>
                        <div>
                          <h2 className="text-xl font-black leading-6">Project Progress</h2>
                          <p className="text-sm leading-5 text-slate-300">
                            {data.projectProgress.length === 0
                              ? "No active projects yet. Add one from Projects!"
                              : "Track active project completion and delivery momentum."}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {data.projectProgress.length === 0 && (
                          <div className="flex min-h-40 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-cyan-200/15 bg-slate-950/40 p-6 text-center">
                            <p className="max-w-md text-sm leading-6 text-slate-300">
                              No projects found yet. Create a project and its task progress will appear here automatically.
                            </p>
                            <a
                              href="/projects"
                              className="rounded-lg bg-slate-100 px-5 py-2 text-sm font-black text-slate-950 shadow-lg transition hover:bg-cyan-100"
                            >
                              Create Your First Project
                            </a>
                          </div>
                        )}

                        {data.projectProgress.map((project) => (
                          <div
                            key={project.id}
                            className="rounded-lg border border-white/10 bg-slate-950/45 p-4 transition hover:border-cyan-300/25 hover:bg-slate-950/65"
                          >
                            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0">
                                <span className="block truncate font-black leading-7 text-white sm:text-lg">
                                  {project.name}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                  {project.completedTasks} of {project.totalTasks} tasks completed
                                </span>
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                <span className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-black text-cyan-100">
                                  {project.progress}%
                                </span>
                                {project.overdueTasks > 0 ? (
                                  <span className="rounded-lg border border-rose-300/20 bg-rose-400/10 px-3 py-1 text-sm font-black text-rose-100">
                                    {project.overdueTasks} overdue
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                              {[
                                { label: "Total", value: project.totalTasks, color: "text-white" },
                                { label: "Done", value: project.completedTasks, color: "text-emerald-200" },
                                { label: "Progress", value: project.inProgressTasks, color: "text-cyan-200" },
                                { label: "Pending", value: project.pendingTasks, color: "text-amber-200" },
                              ].map((stat) => (
                                <div
                                  key={stat.label}
                                  className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2"
                                >
                                  <p className={`text-lg font-black leading-none ${stat.color}`}>
                                    {stat.value}
                                  </p>
                                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                    {stat.label}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="glass-panel-soft rounded-xl p-3 sm:p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-teal-300/20 bg-teal-500/12 text-teal-200">
                            <Calendar size={22} />
                          </div>
                          <div>
                            <h2 className="text-xl font-black leading-7">Recent Tasks</h2>
                            <p className="text-sm leading-5 text-slate-300">
                              {data.recentTasks.length === 0
                                ? "No activity yet. Create a task in Projects!"
                                : "Latest activity and assignments across your team."}
                            </p>
                          </div>
                        </div>
                        {isAdmin ? (
                          <a
                            href="/tasks"
                            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-slate-100 px-4 text-sm font-black text-slate-950 transition hover:bg-cyan-100"
                          >
                            <Plus size={16} />
                            Add Task
                          </a>
                        ) : null}
                      </div>

                      <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-200/75 text-slate-700">
                        {data.recentTasks.length === 0 ? (
                          <div className="relative p-4">
                            <div className="grid grid-cols-[2rem_1.4fr_0.8fr_0.7fr_0.7fr] gap-4 border-b border-slate-400/35 pb-3 text-sm">
                              <span className="h-4 w-4 rounded bg-slate-300" />
                              <span>Task Name</span>
                              <span>Assignee</span>
                              <span>Due Date</span>
                              <span>Status</span>
                            </div>
                            {[0, 1].map((row) => (
                              <div
                                key={row}
                                className="grid grid-cols-[2rem_1.4fr_0.8fr_0.7fr_0.7fr] gap-4 border-b border-slate-400/25 py-3"
                              >
                                <span className="h-4 w-4 rounded bg-slate-300" />
                                <span className="h-3 rounded-full bg-slate-300" />
                                <span className="h-3 rounded-full bg-slate-300" />
                                <span className="h-3 rounded-full bg-slate-300" />
                                <span className="h-5 rounded-full bg-slate-400/55" />
                              </div>
                            ))}
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 rounded-lg bg-slate-700/65 px-4 py-2 font-semibold text-white shadow-lg">
                              Inactive
                            </span>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[42rem] text-sm">
                              <thead className="border-b border-white/10 bg-slate-950/65 text-slate-300">
                                <tr>
                                  <th className="px-4 py-3 text-left font-semibold">Task Name</th>
                                  <th className="px-4 py-3 text-left font-semibold">Assignee</th>
                                  <th className="px-4 py-3 text-left font-semibold">Due Date</th>
                                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/8 bg-slate-950/35 text-slate-200">
                                {data.recentTasks.map((task) => (
                                  <tr key={task.id} className="transition hover:bg-white/[0.04]">
                                    <td className="px-4 py-3 font-semibold">{task.title}</td>
                                    <td className="px-4 py-3 text-slate-300">
                                      {task.assignedTo?.name || "Unassigned"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span
                                        className={`rounded-md border px-2.5 py-1 text-xs font-black ${badgeColor[task.status]}`}
                                      >
                                        {statusLabel[task.status]}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>

                  <section className="glass-panel-soft rounded-xl p-4">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-500/12 text-cyan-200">
                        <Users size={22} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black leading-7">Team Members</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          Your active workspace members and roles.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {message ? (
                        <div className="rounded-lg border border-cyan-400/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
                          {message}
                        </div>
                      ) : null}

                      {data.users.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-white/10 bg-slate-950/35 px-4 py-5 text-center text-sm leading-6 text-slate-400">
                          No users yet.
                        </p>
                      ) : null}

                      {data.users.map((user) => (
                        <div key={user.id} className="border-b border-white/10 py-3 last:border-b-0">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-cyan-300/20 text-xs font-black text-white">
                                {initials(user.name)}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-black leading-5">{user.name}</p>
                                <p className="mt-1 break-all text-sm leading-6 text-slate-400">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <span
                                className={`rounded-md border px-2 py-1 text-xs font-black uppercase ${
                                  user.role === "ADMIN"
                                    ? "border-amber-300/25 bg-amber-300/18 text-amber-100"
                                    : "border-emerald-300/25 bg-emerald-300/15 text-emerald-100"
                                }`}
                              >
                                {user.role}
                              </span>
                              {isAdmin && user.id !== currentUser?.id ? (
                                <button
                                  type="button"
                                  onClick={() => deleteMember(user.id)}
                                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-300/20 bg-rose-500/90 px-3 text-xs font-bold text-white shadow-lg shadow-rose-950/20 transition hover:bg-rose-400"
                                >
                                  <Trash2 size={14} />
                                  Remove
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
