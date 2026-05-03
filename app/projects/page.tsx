"use client";

import React, { useEffect, useMemo, useState } from "react";
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

function calculateProgress(project: Project) {
  if (project.tasks.length === 0) {
    return 0;
  }

  const done = project.tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  return Math.round((done / project.tasks.length) * 100);
}

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
      credentials: "include",
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
        credentials: "include",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await reloadRes.json();
      setProjects(data);
      setMessage("Project created successfully.");
    } else {
      const errData = await res.json();
      setMessage(errData.message || "Project could not be created.");
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const reloadRes = await fetch("/api/projects", {
        credentials: "include",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await reloadRes.json();
      setProjects(data);
      setMessage("Project deleted successfully.");
    } else {
      const errData = await res.json();
      setMessage(errData.message || "Project could not be deleted.");
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
            <div className="relative flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-black leading-none text-white sm:text-5xl">
                Projects
              </h1>
              <p className="max-w-3xl text-base leading-6 text-slate-300">
                {isMember
                  ? "View project progress for work assigned by your admin."
                  : "Create and manage your projects with real-time task tracking."}
              </p>
            </div>

            {!isMember && (
              <form
                onSubmit={createProject}
                className="glass-panel-soft grid w-full gap-3 rounded-xl p-4 md:grid-cols-2 xl:max-w-2xl"
              >
                <input
                  type="text"
                  placeholder="Customer portal redesign"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="h-11 rounded-lg border border-white/10 bg-slate-950/65 px-4 text-white outline-none transition placeholder-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
                  required
                />

                <input
                  type="text"
                  placeholder="Milestones, owners, and delivery tasks"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="h-11 rounded-lg border border-white/10 bg-slate-950/65 px-4 text-white outline-none transition placeholder-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
                  required
                />

                <button className="flex h-11 items-center justify-center gap-2 rounded-lg bg-cyan-200 px-5 font-black text-slate-950 shadow-lg shadow-cyan-950/25 transition hover:bg-white md:col-span-2">
                  <FolderPlus size={20} />
                  Create
                </button>
                {message && (
                  <p className="text-sm text-slate-300 md:col-span-2">{message}</p>
                )}
              </form>
            )}
            </div>
          </div>

          <div className="mb-4">
            <div className="relative max-w-md">
              <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/55 pl-12 pr-4 text-white outline-none transition placeholder-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
              />
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!loading && filteredProjects.length === 0 && (
            <div className="glass-panel-soft rounded-xl py-20 text-center">
              <Folder size={48} className="mx-auto text-slate-500 mb-4" />
              <p className="text-slate-400 text-lg">
                {isMember
                  ? "No projects are available yet. Ask an admin to create a project."
                  : "No projects found. Create one to get started!"}
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => {
              const projectProgress = calculateProgress(project);

              return (
                <div
                  key={project.id}
                  className="glass-panel-soft rounded-xl p-5 transition hover:border-cyan-300/30 hover:bg-slate-900/70"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h2 className="min-w-0 flex-1 break-words text-xl font-bold leading-7 text-white sm:text-2xl">{project.name}</h2>
                    <div className="shrink-0 rounded-lg border border-cyan-300/20 bg-cyan-400/15 p-2 text-cyan-200">
                      <Folder size={24} />
                    </div>
                  </div>

                  <p className="mb-6 min-h-12 text-sm leading-6 text-slate-400">
                    {project.description}
                  </p>

                  <div className="mb-6 rounded-lg border border-white/10 bg-slate-950/45 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-slate-300 font-medium">Progress</span>
                      <span className="rounded bg-cyan-300/15 px-2 py-1 text-sm font-bold text-cyan-100">{projectProgress}%</span>
                    </div>

                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: `${projectProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-sm text-slate-400">
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
                        className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-rose-300/20 bg-rose-500/90 px-4 text-xs font-bold text-white shadow-lg shadow-rose-950/20 transition hover:bg-rose-400"
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
