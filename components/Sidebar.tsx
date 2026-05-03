import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderKanban,
  CheckSquare,
  ChevronRight,
  BarChart3,
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
          completed: tasks.filter((t: any) => t.status === "DONE").length,
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
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 border-r border-white/5 bg-slate-950 md:block">
      {/* Tightened layout with consistent spacing */}
      <div className="flex h-full flex-col px-6 py-10 space-y-10">
        
        {/* Navigation Section */}
        <div>
          <p className="mb-6 px-2 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500/60">
            Navigation
          </p>
          <div className="space-y-4">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-5 rounded-[22px] p-4 transition-all duration-300 ${
                    active ? "bg-white/5 border border-white/10 shadow-lg" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
                    active ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-900 text-slate-500"
                  }`}>
                    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-sm font-bold tracking-tight ${active ? "text-white" : "text-slate-300"}`}>
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-600 truncate">{item.desc}</p>
                  </div>
                  <ChevronRight size={14} className={active ? "text-cyan-400" : "opacity-0"} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Combined Data Group - Sits right after Navigation */}
        <div className="space-y-4">
          {/* Segmented Weekly Progress Card */}
          <div className="rounded-[26px] border border-white/5 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/5">
                   <BarChart3 size={16} className="text-cyan-400" />
                   <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400/30 animate-[spin_4s_linear_infinite]" />
                </div>
                <div>
                  <span className="block text-[9px] font-black uppercase tracking-widest text-slate-500/80">Weekly Progress</span>
                  <span className="text-xl font-black text-white leading-none">{completionRate}%</span>
                </div>
              </div>
            </div>

            <div className="h-1.5 w-full rounded-full bg-slate-800/60 overflow-hidden">
               <div 
                 className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                 style={{ width: `${completionRate}%` }}
               />
            </div>
            
            <div className="mt-3 flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-tight">
              <span>{taskStats.completed} completed</span>
              <span>{taskStats.total} total</span>
            </div>
          </div>

          {/* Overall Project Status Card */}
          <div className="rounded-[22px] border border-white/5 bg-slate-900/30 p-4 flex items-center justify-between">
            <div className="min-w-0">
              <span className="block text-[8px] font-black text-slate-600 uppercase tracking-wider mb-0.5">Project Status:</span>
              <span className="text-xs font-bold text-slate-200 truncate">{projectStatusLabel}</span>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1">
              <div className="text-right leading-none">
                <p className="text-[6px] font-black text-cyan-500 uppercase">Active</p>
                <p className="text-[6px] font-black text-cyan-500 uppercase">Projects</p>
              </div>
              <span className="text-sm font-black text-cyan-400">{projectCount}</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
