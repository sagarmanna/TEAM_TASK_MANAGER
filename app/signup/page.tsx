"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle,
  Lock,
  Mail,
  Shield,
  User,
  UserPlus,
} from "lucide-react";

type SignupRole = "ADMIN" | "MEMBER";

const roleOptions: {
  value: SignupRole;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "MEMBER",
    title: "Member",
    description: "View assigned work and update task progress.",
    icon: <User size={20} />,
  },
  {
    value: "ADMIN",
    title: "Admin",
    description: "Create projects, manage people, and assign tasks.",
    icon: <Shield size={20} />,
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER" as SignupRole,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessageType("error");
        setMessage(data.message);
      } else {
        setMessageType("success");
        setMessage("Account created successfully. Redirecting to login...");
        setTimeout(() => router.push("/login"), 1200);
      }
    } catch {
      setMessageType("error");
      setMessage("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="workspace-bg flex min-h-screen items-center justify-center px-4 py-12 text-white sm:px-6">
      <div className="w-full max-w-xl">
        <section className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-cyan-100/30 bg-cyan-300 text-slate-950 shadow-[0_0_30px_rgba(103,232,249,0.28)]">
            <UserPlus size={30} />
          </div>

          <h1 className="mb-3 text-4xl font-black leading-tight sm:text-5xl">
            Create Account
          </h1>

          <p className="mx-auto max-w-xl text-base leading-7 text-slate-300">
            Choose a workspace role and create your account.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="glass-panel relative overflow-hidden rounded-xl p-6 sm:p-8"
        >
          <div className="hex-grid pointer-events-none absolute right-0 top-0 h-40 w-80 opacity-25" />
          <div className="space-y-5">
            <div>
              <label className="mb-2.5 block text-sm font-medium text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={20}
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Priya Shah"
                  onChange={handleChange}
                  className="h-14 w-full rounded-lg border border-white/10 bg-slate-950/70 pl-14 pr-5 text-white outline-none transition placeholder-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="priya@company.com"
                  onChange={handleChange}
                  className="h-14 w-full rounded-lg border border-white/10 bg-slate-950/70 pl-14 pr-5 text-white outline-none transition placeholder-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  onChange={handleChange}
                  className="h-14 w-full rounded-lg border border-white/10 bg-slate-950/70 pl-14 pr-5 text-white outline-none transition placeholder-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-slate-200">
                Workspace Role
              </label>
              <span className="text-xs font-medium text-slate-500">
                Select one
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {roleOptions.map((role) => {
                const active = form.role === role.value;

                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({ ...current, role: role.value }))
                    }
                    className={`rounded-lg border p-4 text-left shadow-lg shadow-black/5 transition-all duration-300 ${
                      active
                        ? "border-cyan-300/70 bg-cyan-400/12 text-cyan-50 shadow-cyan-950/20"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="flex items-center gap-3 font-semibold leading-6">
                      <span className={active ? "text-cyan-200" : "text-slate-400"}>
                        {role.icon}
                      </span>
                      {role.title}
                    </span>

                    <span className="mt-2 block text-sm leading-6 text-slate-400">
                      {role.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {message && (
            <div
              className={`mt-6 flex items-start gap-3 rounded-xl px-4 py-3.5 text-sm leading-6 ${
                messageType === "success"
                  ? "bg-emerald-500/15 border border-emerald-400/30 text-emerald-200"
                  : "bg-rose-500/15 border border-rose-400/30 text-rose-200"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle size={20} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-cyan-200 font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-white disabled:opacity-50"
          >
            <UserPlus size={20} />
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="mt-5 text-center text-sm leading-6 text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-cyan-200 transition hover:text-cyan-100"
            >
              Sign in instead
            </Link>
          </p>
        </form>

        <p className="mx-auto mt-6 max-w-xl rounded-lg border border-cyan-300/15 bg-cyan-400/10 px-5 py-4 text-center text-sm leading-6 text-cyan-50">
          Members update assigned tasks. Admins create projects, assign work,
          and manage the team.
        </p>
      </div>
    </div>
  );
}
