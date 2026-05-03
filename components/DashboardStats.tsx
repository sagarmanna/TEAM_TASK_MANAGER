import React from "react";

type Props = {
  title: string;
  value: string | number;
  variant?: "blue" | "emerald" | "amber" | "rose";
  icon?: React.ReactNode;
};

export default function DashboardStats({
  title,
  value,
  variant = "blue",
  icon,
}: Props) {
  const variants = {
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
      glow: "from-blue-500/20",
      wave: "stroke-blue-400/50",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      glow: "from-emerald-500/20",
      wave: "stroke-emerald-400/50",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      glow: "from-amber-500/20",
      wave: "stroke-amber-400/50",
    },
    rose: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/20",
      glow: "from-rose-500/20",
      wave: "stroke-rose-400/50",
    },
  };

  const style = variants[variant];

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/5 bg-slate-900/40 p-7 backdrop-blur-xl transition-all duration-300 hover:border-white/10 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-black/50">
      
      {/* 1. Corner Glow Effect */}
      <div className={`absolute -right-10 -top-10 h-32 w-32 bg-gradient-to-br ${style.glow} to-transparent blur-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-60`} />

      <div className="relative z-10">
        <div className="mb-10 flex items-start justify-between">
          {/* 2. Icon Container with Glass Effect */}
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${style.border} ${style.bg} ${style.text} shadow-lg shadow-black/20`}>
            {icon ? React.cloneElement(icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { size: 24, strokeWidth: 2 }) : null}
          </div>

          {/* 3. Fluid Wave Sparkline (SVG) */}
          <div className="h-12 w-24">
            <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
              <path
                d="M0 30 Q 25 10, 50 30 T 100 20"
                fill="none"
                className={`${style.wave} transition-all duration-500 group-hover:stroke-current`}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-1">
          {/* 4. Stats Content */}
          <h2 className="text-5xl font-bold tracking-tight text-white transition-transform duration-300 group-hover:scale-[1.02]">
            {value}
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500 transition-colors group-hover:text-slate-400">
            {title}
          </p>
        </div>
      </div>

      {/* 5. Animated Bottom Accent Line */}
      <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r ${style.text.replace('text-', 'from-')} to-transparent transition-all duration-700 ease-out group-hover:w-full`} />
    </div>
  );
}
