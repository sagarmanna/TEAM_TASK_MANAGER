"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Plus, Search, AlertCircle, Trash2 } from "lucide-react";

type Status = "TODO" | "IN_PROGRESS" | "DONE";

type Task = {
  id: string;
  title: string;
  status: Status;
  dueDate: string;
  project: {
    id: string;
    name: string;
  };
  assignedTo: {
    id: string;
    name: string;
  } | null;
};

type Project = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
};

const statusLabels = {
  TODO: "Pending",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const badgeColor = {
  TODO: "bg-red-500/20 text-red-400 border border-red-500/50",
  IN_PROGRESS: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50",
  DONE: "bg-green-500/20 text-green-400 border border-green-500/50",
};

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser] = useState<User | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    projectId: "",
    userId: "",
    dueDate: "",
    status: "TODO" as Status,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    async function fetchData() {
      const authHeaders: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        fetch("/api/tasks", {
          credentials: "include",
          headers: authHeaders,
        }),
        fetch("/api/projects", {
          credentials: "include",
          headers: authHeaders,
        }),
        fetch("/api/users", {
          credentials: "include",
          headers: authHeaders,
        }),
      ]);

      if ([tasksRes, projectsRes, usersRes].some((res) => res.status === 401)) {
        router.push('/login');
        return;
      }

      const [tasksData, projectsData, usersData] = await Promise.all([
        tasksRes.json(),
        projectsRes.json(),
        usersRes.json(),
      ]);

      setTasks(tasksData);
      setProjects(projectsData);
      setUsers(usersData);
      setForm((current) => ({
        ...current,
        projectId:
          current.projectId || projectsData[0]?.id || "",
      }));
      setLoading(false);
    }

    fetchData();
  }, [router]);

  const isMember = currentUser?.role === "MEMBER";

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesSearch = task.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "ALL" || task.status === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [tasks, search, statusFilter]
  );

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem('token');
    const taskData = {
      ...form,
      projectId: form.projectId || (projects.length > 0 ? projects[0].id : ""),
    };

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch("/api/tasks", {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(taskData),
    });

    if (res.ok) {
      setForm((current) => ({
        title: "",
        projectId: current.projectId || (projects.length > 0 ? projects[0].id : ""),
        userId: "",
        dueDate: "",
        status: "TODO",
      }));
      // Reload data
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        fetch("/api/tasks", {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch("/api/projects", {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch("/api/users", {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
      ]);
      const [tasksData, projectsData, usersData] = await Promise.all([
        tasksRes.json(),
        projectsRes.json(),
        usersRes.json(),
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setUsers(usersData);
      setMessage("Task created successfully.");
    } else {
      const data = await res.json();
      setMessage(data.message || "Task could not be created.");
    }
  }

  async function updateStatus(id: string, status: Status) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      // Reload tasks
      const tasksRes = await fetch("/api/tasks", {
        credentials: "include",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const tasksData = await tasksRes.json();
      setTasks(tasksData);
      setMessage("Task status updated.");
    } else {
      const data = await res.json();
      setMessage(data.message || "Task status could not be updated.");
    }
  }

  async function deleteTask(id: string) {
    const confirmed = window.confirm("Delete this task? This cannot be undone.");
    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem('token');
    const res = await fetch("/api/tasks", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const tasksRes = await fetch("/api/tasks", {
        credentials: "include",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const tasksData = await tasksRes.json();
      setTasks(tasksData);
      setMessage("Task deleted successfully.");
    } else {
      const data = await res.json();
      setMessage(data.message || "Task could not be deleted.");
    }
  }

  return (
    <div className="workspace-bg min-h-screen text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="mx-auto w-full max-w-[118rem] flex-1 px-3 py-4 sm:px-5 lg:px-6">
          <div className="glass-panel relative mb-4 overflow-hidden rounded-xl p-4 sm:p-5 lg:p-6">
            <div className="hex-grid pointer-events-none absolute right-0 top-0 h-40 w-96 opacity-35" />
            <h1 className="relative mb-2 text-4xl font-black leading-none text-white sm:text-5xl">
              {isMember ? "My Assigned Tasks" : "Tasks"}
            </h1>
            <p className="relative max-w-3xl text-base leading-6 text-slate-300">
              {isMember
                ? "View tasks assigned by an admin and update your progress."
                : "Create, assign and track tasks across your projects."}
            </p>
          </div>

          {!isMember && (
          <div className="glass-panel-soft mb-4 rounded-xl p-4 sm:p-5">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold leading-7">
              <Plus size={20} className="text-cyan-300" />
              Create New Task
            </h3>

            {projects.length === 0 ? (
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-100">
                Create a project first before creating tasks. Go to the Projects page to add one.
              </div>
            ) : null}

            <form
              onSubmit={createTask}
              className="grid gap-5 lg:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Task Title</label>
                <input
                  type="text"
                  placeholder="Finalize onboarding checklist"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition placeholder-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Project</label>
                <select
                  value={form.projectId}
                  onChange={(e) =>
                    setForm({ ...form, projectId: e.target.value })
                  }
                  className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
                  required
                >
                  {projects.length === 0 && (
                    <option value="">Create a project first</option>
                  )}
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Assign To</label>
                <select
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/70 px-4 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
                  required
                />
              </div>

              <button
                disabled={projects.length === 0}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-cyan-200 px-6 font-black text-slate-950 shadow-lg shadow-cyan-950/25 transition hover:bg-white disabled:opacity-50 lg:self-end"
              >
                <Plus size={18} />
                Create Task
              </button>
              {message && (
                <p className="text-sm text-slate-300 lg:col-span-2">{message}</p>
              )}
            </form>
          </div>
          )}

          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 md:max-w-md">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/55 pl-12 pr-4 text-white outline-none transition placeholder-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 rounded-lg border border-white/10 bg-slate-950/55 px-4 text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
            >
              <option value="ALL">All Status</option>
              <option value="TODO">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!loading && filteredTasks.length === 0 && (
            <div className="glass-panel-soft rounded-xl py-20 text-center">
              <AlertCircle size={48} className="mx-auto text-slate-500 mb-4" />
              <p className="text-slate-400 text-lg">
                {isMember
                  ? "No tasks assigned to you yet. Ask an admin to assign work."
                  : "No tasks found. Create one to get started!"}
              </p>
            </div>
          )}

          {!loading && filteredTasks.length > 0 && (
            <div className="glass-panel-soft overflow-hidden rounded-xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[58rem] text-sm">
                  <thead className="border-b border-white/10 bg-slate-950/80">
                    <tr>
                      <th className="px-5 py-4 text-left font-semibold text-slate-300">Task</th>
                      <th className="px-5 py-4 text-left font-semibold text-slate-300">Project</th>
                      <th className="px-5 py-4 text-left font-semibold text-slate-300">Assigned To</th>
                      <th className="px-5 py-4 text-left font-semibold text-slate-300">Due Date</th>
                      <th className="px-5 py-4 text-left font-semibold text-slate-300">Status</th>
                      <th className="px-5 py-4 text-left font-semibold text-slate-300">Update</th>
                      {!isMember && (
                        <th className="px-5 py-4 text-left font-semibold text-slate-300">Actions</th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">
                    {filteredTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="transition hover:bg-white/[0.04]"
                      >
                        <td className="max-w-[18rem] px-5 py-4 font-medium leading-6 text-white">{task.title}</td>
                        <td className="max-w-[14rem] px-5 py-4 leading-6 text-slate-400">{task.project.name}</td>
                        <td className="px-5 py-4 leading-6 text-slate-400">
                          {task.assignedTo?.name || <span className="text-slate-500">Unassigned</span>}
                        </td>
                        <td className="px-5 py-4 text-slate-400">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-semibold ${badgeColor[task.status]}`}
                          >
                            {statusLabels[task.status]}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              updateStatus(task.id, e.target.value as Status)
                            }
                            className="h-9 rounded-lg border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                          >
                            <option value="TODO">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                          </select>
                        </td>
                        {!isMember && (
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => deleteTask(task.id)}
                              className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-300/20 bg-rose-500/90 px-3 text-xs font-bold text-white shadow-lg shadow-rose-950/20 transition hover:bg-rose-400"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
