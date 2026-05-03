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
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-400/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-6 py-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="group flex items-center gap-4"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-950/40 transition group-hover:scale-105">
            <Layers3
              size={28}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-3xl font-black leading-none tracking-tight text-white">
              Team Task Manager
            </h1>

            <p className="mt-1 text-xs uppercase tracking-[0.42em] text-cyan-300/90">
              Workspace Control
            </p>
          </div>
        </Link>

        {/* Right Menu */}
        <nav className="flex flex-wrap items-center gap-2 lg:gap-3">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            <Home
              size={18}
              className="text-slate-400 group-hover:text-cyan-300"
            />
            Dashboard
          </Link>

          <Link
            href="/projects"
            className="group flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            <FolderOpen
              size={18}
              className="text-slate-400 group-hover:text-cyan-300"
            />
            Projects
          </Link>

          <Link
            href="/tasks"
            className="group flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            <CheckSquare
              size={18}
              className="text-slate-400 group-hover:text-cyan-300"
            />
            Tasks
          </Link>

          {/* Divider */}
          <div className="hidden h-7 w-px bg-white/10 lg:block" />

          {/* Logout */}
          <button
            onClick={logout}
            className="group ml-1 flex items-center gap-2 rounded-2xl border border-rose-400/20 bg-gradient-to-r from-rose-500 to-pink-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-950/40 transition-all duration-300 hover:scale-105 hover:shadow-rose-500/20"
          >
            <LogOut
              size={18}
              className="transition group-hover:-translate-x-0.5"
            />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}