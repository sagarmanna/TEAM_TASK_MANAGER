"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { FolderPlus, Search, Folder, CheckCircle2, Clock, Trash2 } from "lucide-react";

type Project = {
  id: string;
  name: string;
  description: string;
  tasks: {
    id: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
  }[];
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
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
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const isMember = currentUser?.role === "MEMBER";

  useEffect(() => {
    const token = localStorage.getItem('token');

    async function fetchProjects() {
      const res = await fetch("/api/projects", {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();

      setProjects(data);
      setLoading(false);
    }

    fetchProjects();
  }, [router]);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        project.name.toLowerCase().includes(search.toLowerCase())
      ),
    [projects, search]
  );

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem('token');
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ name: "", description: "" });
      // Reload projects
      const reloadRes = await fetch("/api/projects", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await reloadRes.json();
      setProjects(data);
      setMessage("Project created successfully.");
    } else {
      const data = await res.json();
      setMessage(data.message || "Project could not be created.");
    }
  }

  async function deleteProject(id: string) {
    const confirmed = window.confirm("Delete this project and all related tasks? This cannot be undone.");
    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem('token');
    const res = await fetch("/api/projects", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const reloadRes = await fetch("/api/projects", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await reloadRes.json();
      setProjects(data);
      setMessage("Project deleted successfully.");
    } else {
      const data = await res.json();
      setMessage(data.message || "Project could not be deleted.");
    }
  }

  function progress(project: Project) {
    if (project.tasks.length === 0) {
      return 0;
    }

    const done = project.tasks.filter(
      (task) => task.status === "DONE"
    ).length;

    return Math.round((done / project.tasks.length) * 100);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8 mb-10">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Projects
              </h1>
              <p className="text-slate-400 text-lg">
                {isMember
                  ? "View project progress for work assigned by your admin."
                  : "Create and manage your projects with real-time task tracking."}
              </p>
            </div>

            {!isMember && (
              <form
                onSubmit={createProject}
                className="bg-slate-950/50 border border-white/10 rounded-[1.5rem] p-6 grid md:grid-cols-2 gap-4 w-full xl:max-w-2xl shadow-xl"
              >
                <input
                  type="text"
                  placeholder="Customer portal redesign"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 focus:outline-none transition text-white placeholder-slate-500"
                  required
                />

                <input
                  type="text"
                  placeholder="Milestones, owners, and delivery tasks"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 focus:border-cyan-400 focus:outline-none transition text-white placeholder-slate-500"
                  required
                />

                <button className="bg-cyan-300 text-slate-950 hover:bg-cyan-200 px-5 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 md:col-span-2">
                  <FolderPlus size={20} />
                  Create
                </button>
                {message && (
                  <p className="text-sm text-slate-300 md:col-span-2">{message}</p>
                )}
              </form>
            )}
          </div>

          <div className="mb-8">
            <div className="relative max-w-md">
              <Search size={20} className="absolute left-4 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 focus:outline-none transition text-white placeholder-slate-500"
              />
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <Folder size={48} className="mx-auto text-slate-500 mb-4" />
              <p className="text-slate-400 text-lg">
                {isMember
                  ? "No projects are available yet. Ask an admin to create a project."
                  : "No projects found. Create one to get started!"}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const projectProgress = progress(project);

              return (
                <div
                  key={project.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white flex-1">{project.name}</h2>
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Folder size={24} />
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="bg-slate-700/30 p-4 rounded-xl mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 font-medium">Progress</span>
                      <span className="bg-blue-600/20 text-blue-400 text-sm px-2 py-1 rounded">{projectProgress}%</span>
                    </div>

                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: `${projectProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-700 pt-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{project.tasks.length} Tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>{project.tasks.filter(t => t.status === 'DONE').length} Done</span>
                    </div>
                  </div>
                  {!isMember && (
                    <button
                      type="button"
                      onClick={() => deleteProject(project.id)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-500/90 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
                    >
                      <Trash2 size={16} />
                      Delete Project
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
