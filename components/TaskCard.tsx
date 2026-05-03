import {
  AlertCircle,
  CheckCircle,
  Clock,
  FolderKanban,
  UserRound,
} from "lucide-react";

type Props = {
  title: string;
  status: string;
  dueDate: string;
  projectName?: string;
  assignedTo?: string;
};

export default function TaskCard({
  title,
  status,
  dueDate,
  projectName,
  assignedTo,
}: Props) {
  const getStatusIcon = () => {
    if (status === "Done") {
      return <CheckCircle size={18} className="text-emerald-400" />;
    }

    if (status === "In Progress") {
      return <Clock size={18} className="text-amber-400" />;
    }

    return <AlertCircle size={18} className="text-rose-400" />;
  };

  const badgeColor = () => {
    if (status === "Done") {
      return "bg-emerald-500/15 text-emerald-200 border border-emerald-400/30";
    }

    if (status === "In Progress") {
      return "bg-amber-500/15 text-amber-200 border border-amber-400/30";
    }

    return "bg-rose-500/15 text-rose-200 border border-rose-400/30";
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-5 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-slate-950/75 hover:shadow-xl sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="min-w-0 flex-1 text-lg font-semibold leading-7 text-white">
          {title}
        </h3>

        <div className="flex shrink-0 items-center gap-2">
          {getStatusIcon()}
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeColor()}`}>
            {status}
          </span>
        </div>
      </div>

      {projectName && (
        <p className="mb-2 flex items-center gap-2 text-sm leading-6 text-slate-400">
          <FolderKanban size={14} />
          {projectName}
        </p>
      )}

      {assignedTo && (
        <p className="mb-2 flex items-center gap-2 text-sm leading-6 text-slate-400">
          <UserRound size={14} />
          {assignedTo}
        </p>
      )}

      <div className="mt-4 flex items-center border-t border-white/10 pt-4 text-sm leading-6 text-slate-400">
        <Clock size={14} className="mr-2" />
        Due: {new Date(dueDate).toLocaleDateString()}
      </div>
    </div>
  );
}
