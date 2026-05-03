import React from "react";

type Props = {
  title: string;
  value: string | number;
  variant?: "blue" | "emerald" | "amber" | "rose";
  icon?: React.ReactElement<{ size?: number; strokeWidth?: number }>;
};

type StatIconProps = {
  size?: number;
  strokeWidth?: number;
};

export default function DashboardStats({
  title,
  value,
  variant = "blue",
  icon,
}: Props) {
  const variants = {
    blue: {
      bg: "bg-blue-500/12",
      text: "text-blue-300",
      border: "border-blue-300/20",
      glow: "from-blue-400/25",
      wave: "stroke-blue-300/60",
    },
    emerald: {
      bg: "bg-emerald-500/12",
      text: "text-emerald-300",
      border: "border-emerald-300/20",
      glow: "from-emerald-400/25",
      wave: "stroke-emerald-300/60",
    },
    amber: {
      bg: "bg-amber-500/12",
      text: "text-amber-300",
      border: "border-amber-300/20",
      glow: "from-amber-400/25",
      wave: "stroke-amber-300/60",
    },
    rose: {
      bg: "bg-rose-500/12",
      text: "text-rose-300",
      border: "border-rose-300/20",
      glow: "from-rose-400/25",
      wave: "stroke-rose-300/60",
    },
  };

  const style = variants[variant];

  return (
    <div className="group relative min-h-[7rem] overflow-hidden rounded-xl border border-slate-400/20 bg-slate-950/36 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-200/30 hover:bg-slate-900/55">
      <div className={`absolute -right-10 -top-10 h-32 w-32 bg-gradient-to-br ${style.glow} to-transparent blur-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-60`} />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${style.border} ${style.bg} ${style.text} shadow-lg shadow-black/20`}>
            {icon
              ? React.cloneElement(icon as React.ReactElement<StatIconProps>, {
                  size: 22,
                  strokeWidth: 2,
                })
              : null}
          </div>

          <div className="hidden h-10 w-28 sm:block">
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
          <h2 className="text-3xl font-black leading-none text-white sm:text-4xl">
            {value}
          </h2>
          <p className="text-xs font-bold uppercase leading-5 text-slate-400">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
