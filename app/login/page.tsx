"use client";

import { useState } from "react";
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_30rem),linear-gradient(135deg,#020617,#0f172a,#0f766e)] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-cyan-400/15 text-cyan-100 border border-cyan-300/20 p-5 rounded-2xl mb-6 shadow-md">
            <LogIn size={40} />
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight mb-3">
            Welcome Back
          </h1>

          <p className="text-slate-300">
            Choose Admin or Member access, then sign in with your
            workspace account.
          </p>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-950/65 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] space-y-6 border border-white/10 shadow-2xl"
        >
          
          {/* ROLE SELECT */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Login Type
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
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
                    className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                      active
                        ? "border-cyan-300/60 bg-gradient-to-br from-cyan-400/10 to-cyan-200/5 text-cyan-50 shadow-lg shadow-cyan-900/40 scale-[1.02]"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="flex items-center gap-3 font-semibold tracking-wide">
                      {role.icon}
                      {role.title}
                    </span>

                    <span className="mt-2 block text-sm leading-relaxed text-slate-400 tracking-wide">
                      {role.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-3.5 text-slate-500"
              />
              <input
                type="email"
                name="email"
                placeholder="priya@company.com"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900/80 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-3.5 text-slate-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Minimum 8 characters"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900/80 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          {/* MESSAGE */}
          {message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl ${
                messageType === "success"
                  ? "bg-emerald-500/15 border border-emerald-400/30 text-emerald-200"
                  : "bg-rose-500/15 border border-rose-400/30 text-rose-200"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-300 text-slate-950 hover:bg-cyan-200 py-3.5 rounded-xl font-semibold tracking-wide transition flex items-center justify-center shadow-lg shadow-cyan-900/30 disabled:opacity-50"
          >
            <span className="inline-flex items-center justify-center gap-3">
              <LogIn size={20} />
              {loading ? "Signing in..." : "Sign In"}
            </span>
          </button>

          {/* FOOTER */}
          <p className="text-sm text-slate-400 text-center">
            No account?{" "}
            <Link
              href="/signup"
              className="text-cyan-200 hover:text-cyan-100 font-medium transition"
            >
              Create Admin or Member account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}