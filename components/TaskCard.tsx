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
    <div className="bg-slate-950/45 border border-white/10 rounded-2xl p-6 hover:border-cyan-300/30 hover:shadow-lg transition">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-white flex-1 line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${badgeColor()}`}>
            {status}
          </span>
        </div>
      </div>

      {projectName && (
        <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
          <FolderKanban size={14} />
          {projectName}
        </p>
      )}

      {assignedTo && (
        <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
          <UserRound size={14} />
          {assignedTo}
        </p>
      )}

      <div className="flex items-center text-slate-400 text-sm mt-4 pt-4 border-t border-white/10">
        <Clock size={14} className="mr-2" />
        Due: {new Date(dueDate).toLocaleDateString()}
      </div>
    </div>
  );
}
