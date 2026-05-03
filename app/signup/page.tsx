"use client";

import { useState } from "react";
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

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.2),transparent_28rem),linear-gradient(135deg,#020617,#0f172a,#064e3b)] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <div className="inline-block bg-emerald-400/15 text-emerald-100 border border-emerald-300/20 p-4 rounded-2xl mb-6">
            <UserPlus size={40} />
          </div>
          <h1 className="text-5xl font-black mb-3">Create Account</h1>
          <p className="text-slate-300">
            Join the workspace as an admin or member and start tracking project work.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-950/65 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] space-y-6 border border-white/10 shadow-2xl"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User size={20} className="absolute left-4 top-3.5 text-slate-500" />
              <input
                type="text"
                name="name"
                placeholder="Priya Shah"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 focus:border-emerald-400 focus:outline-none transition text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-3.5 text-slate-500" />
              <input
                type="email"
                name="email"
                placeholder="priya@company.com"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 focus:border-emerald-400 focus:outline-none transition text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-3.5 text-slate-500" />
              <input
                type="password"
                name="password"
                placeholder="Minimum 8 characters"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 focus:border-emerald-400 focus:outline-none transition text-white placeholder-slate-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Shield size={16} />
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 focus:border-emerald-400 focus:outline-none transition text-white"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {message && (
            <div className={`flex items-center gap-3 p-4 rounded-xl ${messageType === "success" ? "bg-emerald-500/15 border border-emerald-400/30 text-emerald-200" : "bg-rose-500/15 border border-rose-400/30 text-rose-200"}`}>
              {messageType === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm">{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-300 text-slate-950 hover:bg-emerald-200 disabled:opacity-50 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-sm text-slate-400 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-200 hover:text-emerald-100 font-medium transition">
              Sign in instead
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
