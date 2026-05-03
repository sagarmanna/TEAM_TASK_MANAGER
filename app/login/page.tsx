"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle,
  Lock,
  LogIn,
  Mail,
  Shield,
  UserRound,
} from "lucide-react";

type LoginRole = "ADMIN" | "MEMBER";

const roleOptions: {
  value: LoginRole;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "ADMIN",
    title: "Admin Login",
    description:
      "Create projects, assign tasks, and manage workflow access.",
    icon: <Shield size={20} />,
  },
  {
    value: "MEMBER",
    title: "Member Login",
    description:
      "View projects and update assigned task progress.",
    icon: <UserRound size={20} />,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    expectedRole: "ADMIN" as LoginRole,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageType("error");
        setMessage(data.message);
      } else if (data.user.role !== form.expectedRole) {
        setMessageType("error");
        setMessage(
          `This account is a ${data.user.role.toLowerCase()} account. Select the correct login type or use another email.`
        );
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessageType("success");
        setMessage("Login successful.");
        router.replace("/dashboard");
        router.refresh();
      }
    } catch {
      setMessageType("error");
      setMessage("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="workspace-bg flex min-h-screen items-center justify-center px-4 py-12 text-white sm:px-6">
      <div className="w-full max-w-2xl">
        <section className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-cyan-100/30 bg-cyan-300 text-slate-950 shadow-[0_0_30px_rgba(103,232,249,0.28)]">
            <LogIn size={30} />
          </div>

          <h1 className="mb-3 text-4xl font-extrabold leading-tight sm:text-5xl">
            Welcome Back
          </h1>

          <p className="mx-auto max-w-lg text-base leading-7 text-slate-300">
            Choose your access level and sign in to your workspace.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="glass-panel relative space-y-8 overflow-hidden rounded-xl p-6 sm:p-8"
        >
          <div className="hex-grid pointer-events-none absolute right-0 top-0 h-40 w-80 opacity-25" />
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-slate-200">
                Login Type
              </label>
              <span className="text-xs font-medium text-slate-500">
                Select one
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {roleOptions.map((role) => {
                const active = form.expectedRole === role.value;

                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        expectedRole: role.value,
                      }))
                    }
                    className={`relative rounded-lg border p-5 text-left shadow-lg shadow-black/5 transition-all duration-300 ${
                      active
                        ? "border-cyan-300/70 bg-cyan-400/12 text-cyan-50 shadow-cyan-950/20"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="mb-3 flex items-center gap-3 font-semibold leading-6">
                      <span className={active ? "text-cyan-200" : "text-slate-400"}>
                        {role.icon}
                      </span>
                      {role.title}
                    </span>

                    <span className="block text-sm leading-6 text-slate-400">
                      {role.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2.5 block text-sm font-medium text-slate-300">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="priya@company.com"
                  onChange={handleChange}
                  className="h-14 w-full rounded-lg border border-white/10 bg-slate-950/70 pl-12 pr-4 text-white outline-none transition placeholder-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
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
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  onChange={handleChange}
                  className="h-14 w-full rounded-lg border border-white/10 bg-slate-950/70 pl-12 pr-4 text-white outline-none transition placeholder-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
                  required
                />
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`flex items-start gap-3 rounded-xl px-4 py-3.5 text-sm leading-6 ${
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
            className="flex h-14 w-full items-center justify-center rounded-lg bg-cyan-200 font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-white disabled:opacity-50"
          >
            <span className="inline-flex items-center justify-center gap-3">
              <LogIn size={20} />
              {loading ? "Signing in..." : "Sign In"}
            </span>
          </button>

          <p className="text-center text-sm leading-6 text-slate-400">
            No account?{" "}
            <Link
              href="/signup"
              className="font-medium text-cyan-200 transition hover:text-cyan-100"
            >
              Create Admin or Member account
            </Link>
          </p>
        </form>

        <p className="mx-auto mt-6 max-w-xl rounded-lg border border-cyan-300/15 bg-cyan-400/10 px-5 py-4 text-center text-sm leading-6 text-cyan-50">
          Admins manage projects and assignments. Members update their assigned
          task progress.
        </p>
      </div>
    </div>
  );
}
