"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderKanban,
  CheckSquare,
  ChevronRight,
  BarChart3,
  ClipboardList,
  Settings,
  Layers3,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    desc: "Overview & analytics",
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban,
    desc: "Manage all projects",
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    desc: "Track daily tasks",
  },
];

type TaskSummary = {
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

export default function Sidebar() {
  const pathname = usePathname();
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0 });
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function loadStats() {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          fetch("/api/tasks", {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch("/api/projects", {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        if (!tasksRes.ok || !projectsRes.ok) return;

        const tasks = await tasksRes.json();
        const projects = await projectsRes.json();

        setTaskStats({
          total: tasks.length,
          completed: tasks.filter((t: TaskSummary) => t.status === "DONE").length,
        });
        setProjectCount(projects.length);
      } catch {
        // ignore fetch errors in sidebar
      }
    }
    loadStats();
  }, []);

  const completionRate = taskStats.total > 0
    ? Math.round((taskStats.completed / taskStats.total) * 100)
    : 0;

  const projectStatusLabel = projectCount > 0 ? "Active Phase" : "No Projects";

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-cyan-200/10 bg-[#070d1d]/92 md:block xl:w-[19rem]">
      <div className="flex h-full flex-col overflow-y-auto">
        <div>
          <p className="border-b border-white/10 px-3 py-2 text-[11px] font-medium uppercase text-slate-400/90">
            Navigation
          </p>
          <div className="space-y-1 p-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-none border-l-2 p-3 transition-all duration-300 ${
                    active ? "border-cyan-300 bg-cyan-300/13 shadow-[inset_-22px_0_45px_rgba(34,211,238,0.1)]" : "border-transparent hover:border-cyan-300/40 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all ${
                    active ? "border-cyan-300/25 bg-cyan-300/15 text-cyan-200" : "border-white/8 bg-slate-900/70 text-slate-500 group-hover:text-slate-300"
                  }`}>
                    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-sm font-bold leading-5 ${active ? "text-white" : "text-slate-300"}`}>
                      {item.name}
                    </h4>
                    <p className="truncate text-xs leading-5 text-slate-500">{item.desc}</p>
                  </div>
                  <ChevronRight size={14} className={active ? "text-cyan-400" : "opacity-0"} />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mx-3 my-7 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/25 p-6 text-center">
          <div>
            <div className="mx-auto mb-4 flex h-20 w-24 items-center justify-center rounded-[1.5rem] border border-slate-500/20 bg-slate-800/45 text-slate-400">
              <Layers3 size={34} />
            </div>
            <p className="text-sm font-black text-white">{projectStatusLabel}</p>
            <p className="mx-auto mt-1 max-w-40 text-xs leading-5 text-slate-400">
              {projectCount > 0 ? `${projectCount} projects in workspace` : "No projects set up yet."}
            </p>
            {projectCount === 0 ? (
              <Link
                href="/projects"
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-4 text-sm font-bold text-white transition hover:border-cyan-300/35 hover:bg-cyan-300/10"
              >
                <FolderKanban size={15} />
                Add Project
              </Link>
            ) : null}
          </div>
        </div>

        <div className="space-y-5 border-t border-white/10 p-4">
          <div>
            <p className="mb-4 text-[11px] font-medium uppercase text-slate-400">Project Status</p>
            <div className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div>
                <p className="text-4xl font-black leading-none text-white">{taskStats.completed}</p>
                <p className="mt-2 text-sm uppercase text-slate-300">Completed</p>
              </div>
              <div className="relative grid h-16 w-16 place-items-center rounded-full border-[10px] border-cyan-300/35 text-xs font-black text-white shadow-[0_0_24px_rgba(34,211,238,0.18)]">
                {completionRate}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-white/10 pt-5">
            <div>
              <p className="text-4xl font-black leading-none text-white">{Math.max(taskStats.total - taskStats.completed, 0)}</p>
              <p className="mt-2 text-sm uppercase text-slate-300">Open Tasks</p>
            </div>
            <div className="relative grid h-16 w-16 place-items-center rounded-full border-[10px] border-rose-300/30 text-xs font-black text-white shadow-[0_0_24px_rgba(251,113,133,0.14)]">
              {taskStats.total ? 100 - completionRate : 0}%
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-slate-500">
            {[BarChart3, ClipboardList, Settings].map((Icon, index) => (
              <div key={index} className="flex h-9 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03]">
                <Icon size={17} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
