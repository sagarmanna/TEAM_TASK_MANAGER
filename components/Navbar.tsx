"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Home,
  FolderOpen,
  CheckSquare,
  Layers3,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // important if using cookies
      });
    } catch (err) {
      console.error("Logout failed", err);
    }

    // Clear client storage safely
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-200/10 bg-[#070a1a]/90 shadow-2xl shadow-black/25 backdrop-blur-2xl">
      <div className="mx-auto flex min-h-[4rem] w-full max-w-[120rem] flex-col gap-3 px-4 py-2.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Link
          href="/dashboard"
          className="group flex min-w-0 items-center gap-3 sm:gap-4"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-100/30 bg-cyan-300 text-slate-950 shadow-[0_0_26px_rgba(103,232,249,0.28)] transition group-hover:scale-105">
            <Layers3 size={24} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-black leading-tight text-white sm:text-2xl">
              Team Task Manager
            </h1>

            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan-300/90">
              Workspace Control
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 lg:justify-end">
          <Link
            href="/dashboard"
            className="group flex h-10 items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-200/25 hover:bg-cyan-300/10 sm:px-4"
          >
            <Home size={18} className="text-slate-400 group-hover:text-cyan-300" />
            Dashboard
          </Link>

          <Link
            href="/projects"
            className="group flex h-10 items-center gap-2 rounded-lg border border-transparent px-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-200/20 hover:bg-white/[0.05] hover:text-white sm:px-4"
          >
            <FolderOpen size={18} className="text-slate-400 group-hover:text-cyan-300" />
            Projects
          </Link>

          <Link
            href="/tasks"
            className="group flex h-10 items-center gap-2 rounded-lg border border-transparent px-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-200/20 hover:bg-white/[0.05] hover:text-white sm:px-4"
          >
            <CheckSquare size={18} className="text-slate-400 group-hover:text-cyan-300" />
            Tasks
          </Link>

          <div className="hidden h-7 w-px bg-white/10 lg:block" />

          <button
            onClick={logout}
            className="group flex h-10 items-center gap-2 rounded-lg border border-rose-200/25 bg-rose-500/90 px-4 text-sm font-bold text-white shadow-lg shadow-rose-950/30 transition hover:bg-rose-400 sm:ml-1"
          >
            <LogOut size={18} className="transition group-hover:-translate-x-0.5" />
            Logout
          </button>

        </nav>
      </div>
    </header>
  );
}
