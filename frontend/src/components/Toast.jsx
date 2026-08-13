import React from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";
import { useGame } from "../context/GameContext";

const TOAST_STYLES = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300/70 dark:border-emerald-800/50",
    text: "text-emerald-900 dark:text-emerald-200",
    bar: "bg-emerald-500",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-300/70 dark:border-amber-800/50",
    text: "text-amber-900 dark:text-amber-200",
    bar: "bg-amber-500",
    icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  },
  error: {
    bg: "bg-rose-50 dark:bg-rose-950/30 border-rose-300/70 dark:border-rose-800/50",
    text: "text-rose-900 dark:text-rose-200",
    bar: "bg-rose-500",
    icon: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
  },
  info: {
    bg: "bg-violet-50 dark:bg-violet-950/30 border-violet-300/70 dark:border-violet-800/50",
    text: "text-violet-900 dark:text-violet-200",
    bar: "bg-xp-purple",
    icon: <Info className="w-5 h-5 text-xp-purple shrink-0" />,
  },
};

export const Toast = () => {
  const { activeToast, showToast } = useGame();

  if (!activeToast) return null;

  const { message, type } = activeToast;
  const style = TOAST_STYLES[type] || TOAST_STYLES.info;

  return (
    <div className="fixed bottom-6 right-4 left-4 md:left-auto md:w-[360px] z-[100] animate-slide-up pointer-events-none">
      <div
        className={`relative flex items-start gap-3 p-4 pr-10 rounded-2xl border shadow-2xl backdrop-blur-md overflow-hidden pointer-events-auto ${style.bg} ${style.text}`}
      >
        {/* Progress bar that depletes */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200/30 dark:bg-slate-800/30">
          <div
            className={`h-full ${style.bar} origin-left`}
            style={{ animation: "progress-fill 3.5s linear forwards", "--target-width": "0%" }}
          />
        </div>

        {style.icon}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug">{message}</p>
        </div>

        <button
          onClick={() => showToast(null)}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>
    </div>
  );
};
