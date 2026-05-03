"use client";

import { useEffect, useMemo, useState } from "react";
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
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch("/api/projects", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch("/api/users", {
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
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      // Reload tasks
      const tasksRes = await fetch("/api/tasks", {
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
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const tasksRes = await fetch("/api/tasks", {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <div className="mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              {isMember ? "My Assigned Tasks" : "Tasks"}
            </h1>
            <p className="text-slate-400 text-lg">
              {isMember
                ? "View tasks assigned by an admin and update your progress."
                : "Create, assign and track tasks across your projects."}
            </p>
          </div>

          {!isMember && (
          <div className="bg-slate-950/50 border border-white/10 rounded-[1.75rem] p-6 md:p-8 mb-10 shadow-xl">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <Plus size={20} className="text-blue-400" />
              Create New Task
            </h3>

            {projects.length === 0 ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-100">
                Create a project first before creating tasks. Go to the Projects page to add one.
              </div>
            ) : null}

            <form
              onSubmit={createTask}
              className="grid lg:grid-cols-2 gap-6"
            >
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Task Title</label>
                <input
                  type="text"
                  placeholder="Finalize onboarding checklist"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 focus:outline-none transition text-white placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Project</label>
                <select
                  value={form.projectId}
                  onChange={(e) =>
                    setForm({ ...form, projectId: e.target.value })
                  }
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 focus:outline-none transition text-white"
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
                <label className="text-sm text-slate-400 mb-2 block">Assign To</label>
                <select
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 focus:outline-none transition text-white"
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
                <label className="text-sm text-slate-400 mb-2 block">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 focus:outline-none transition text-white"
                  required
                />
              </div>

              <button
                disabled={projects.length === 0}
                className="bg-cyan-300 text-slate-950 hover:bg-cyan-200 disabled:opacity-50 px-6 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 h-fit lg:self-end"
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

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 md:max-w-md">
              <Search size={18} className="absolute left-4 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 focus:border-blue-500 focus:outline-none transition text-white placeholder-slate-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition text-white"
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
            <div className="text-center py-20">
              <AlertCircle size={48} className="mx-auto text-slate-500 mb-4" />
              <p className="text-slate-400 text-lg">
                {isMember
                  ? "No tasks assigned to you yet. Ask an admin to assign work."
                  : "No tasks found. Create one to get started!"}
              </p>
            </div>
          )}

          {!loading && filteredTasks.length > 0 && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Task</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Project</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Assigned To</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Due Date</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-semibold">Update</th>
                      {!isMember && (
                        <th className="px-6 py-4 text-left text-slate-300 font-semibold">Actions</th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-700">
                    {filteredTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="hover:bg-slate-700/30 transition"
                      >
                        <td className="px-6 py-4 font-medium text-white">{task.title}</td>
                        <td className="px-6 py-4 text-slate-400">{task.project.name}</td>
                        <td className="px-6 py-4 text-slate-400">
                          {task.assignedTo?.name || <span className="text-slate-500">Unassigned</span>}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-semibold ${badgeColor[task.status]}`}
                          >
                            {statusLabels[task.status]}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              updateStatus(task.id, e.target.value as Status)
                            }
                            className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 transition text-white"
                          >
                            <option value="TODO">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                          </select>
                        </td>
                        {!isMember && (
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => deleteTask(task.id)}
                              className="inline-flex items-center gap-2 rounded-lg bg-rose-500/90 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
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
