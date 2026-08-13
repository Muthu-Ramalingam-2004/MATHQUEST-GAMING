import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Trophy, 
  Clock, 
  Zap, 
  Coins, 
  RotateCcw, 
  LayoutDashboard, 
  Sparkles, 
  Frown,
  CheckCircle,
  XCircle,
  Star,
  Flame,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { useGame } from "../context/GameContext";

const BADGE_INFO = {
  "first-victory": { icon: "🏆", name: "First Victory" },
  "perfect-score": { icon: "🎯", name: "Perfect Score" },
  "math-starter":  { icon: "⚡", name: "Math Starter" },
  "streak-hero":   { icon: "🔥", name: "Streak Hero" },
  "algebra-ace":   { icon: "💡", name: "Algebra Ace" },
};

const Confetti = () => {
  const pieces = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: ["#7c3aed", "#f97316", "#10b981", "#fbbf24", "#a855f7", "#06b6d4"][i % 6],
    delay: `${Math.random() * 1.5}s`,
    size: `${8 + Math.random() * 8}px`,
    duration: `${1.5 + Math.random()}s`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute top-0 rounded-sm animate-float"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
};

export const Results = () => {
  const { user } = useGame();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("last_session_result");
    if (cached) {
      setResults(JSON.parse(cached));
    }

    // Show details after a slight delay for dramatic effect
    const timer = setTimeout(() => setShowDetails(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-math-bg">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-xp-purple border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-math-text-muted font-medium">Calculating rewards…</p>
        </div>
      </div>
    );
  }

  const {
    score,
    totalQuestions,
    accuracy,
    xpEarned,
    coinsEarned,
    timeTaken,
    survived,
    didLevelUp,
    newLevel,
    newBadges = []
  } = results;

  const getAccuracyGrade = () => {
    if (accuracy >= 100) return { grade: "S", color: "text-amber-400", label: "Perfect!" };
    if (accuracy >= 80)  return { grade: "A", color: "text-emerald-400", label: "Excellent!" };
    if (accuracy >= 60)  return { grade: "B", color: "text-blue-400",    label: "Good" };
    if (accuracy >= 40)  return { grade: "C", color: "text-orange-400",  label: "Average" };
    return                      { grade: "F", color: "text-rose-400",    label: "Keep Trying!" };
  };

  const grade = getAccuracyGrade();

  return (
    <div className="min-h-screen bg-math-bg flex flex-col justify-center py-10 px-4 relative transition-colors duration-300">

      <div className="max-w-3xl mx-auto w-full space-y-6">

        {/* ─── RESULT HERO CARD ─── */}
        <section className={`relative bg-math-card border-2 rounded-3xl p-8 md:p-12 shadow-lg text-center space-y-6 overflow-hidden transition-colors animate-scale-up ${
          survived
            ? "border-emerald-300/40 dark:border-emerald-800/30"
            : "border-rose-300/40 dark:border-rose-800/30"
        }`}>

          {survived && <Confetti />}

          {/* Trophy / Frown */}
          <div className="relative flex flex-col items-center">
            {survived ? (
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-xp-purple to-violet-400 flex items-center justify-center text-white shadow-xl animate-bounce-slow">
                  <Trophy className="w-12 h-12 fill-current" />
                </div>
                <div className="absolute -top-3 -right-3 text-3xl animate-wiggle">✨</div>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-math-text-muted">
                <Frown className="w-12 h-12" />
              </div>
            )}

            <h1 className={`font-display font-black text-4xl md:text-5xl mt-5 ${
              survived ? "text-math-text" : "text-rose-500"
            }`}>
              {survived ? "LEVEL CLEARED! 🎉" : "GAME OVER!"}
            </h1>
            <p className="text-math-text-muted text-sm font-medium mt-2 max-w-md">
              {survived
                ? "Brilliant work! You completed this session with full rewards."
                : "You lost all hearts. Practice makes perfect — keep going!"}
            </p>
          </div>

          {/* Accuracy Circle + Grade */}
          <div className={`transition-all duration-500 ${showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">

              {/* SVG Circle */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                  <circle cx="80" cy="80" r="68" stroke="#e2e8f0" strokeWidth="10" fill="transparent" className="dark:stroke-slate-800" />
                  <circle
                    cx="80" cy="80" r="68"
                    stroke={survived ? "#10b981" : "#ef4444"}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray="427"
                    strokeDashoffset={427 - (427 * accuracy) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="font-display font-black text-4xl text-math-text">{accuracy}%</span>
                  <span className="text-[11px] font-bold text-math-text-muted uppercase tracking-wider">Accuracy</span>
                </div>
              </div>

              {/* Grade badge */}
              <div className="text-center">
                <div className={`text-7xl font-display font-black ${grade.color} mb-1`}>
                  {grade.grade}
                </div>
                <span className="font-bold text-lg text-math-text">{grade.label}</span>
                <div className="flex items-center justify-center gap-3 mt-3 text-xs font-bold text-math-text-muted">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-mint" />
                    {score} Correct
                  </span>
                  <span className="text-math-border">·</span>
                  <span className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-heart-red" />
                    {totalQuestions - score} Wrong
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Grid */}
          <div className={`grid grid-cols-3 gap-4 max-w-sm mx-auto border-t border-math-border pt-6 transition-all duration-700 ${showDetails ? "opacity-100" : "opacity-0"}`}>
            <div className="bg-purple-50 dark:bg-purple-950/10 border border-purple-200/50 p-4 rounded-2xl flex flex-col items-center">
              <Zap className="w-5 h-5 text-xp-purple fill-current mb-2" />
              <span className="text-[10px] font-bold text-math-text-muted uppercase">XP Won</span>
              <span className="font-black text-xl text-xp-purple">+{xpEarned}</span>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-200/50 p-4 rounded-2xl flex flex-col items-center">
              <Coins className="w-5 h-5 text-amber-500 fill-current mb-2" />
              <span className="text-[10px] font-bold text-math-text-muted uppercase">Coins</span>
              <span className="font-black text-xl text-amber-500">+{coinsEarned}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/30 border border-math-border p-4 rounded-2xl flex flex-col items-center">
              <Clock className="w-5 h-5 text-math-text-muted mb-2" />
              <span className="text-[10px] font-bold text-math-text-muted uppercase">Time</span>
              <span className="font-black text-xl text-math-text">{timeTaken}s</span>
            </div>
          </div>
        </section>

        {/* ─── LEVEL UP ANNOUNCEMENT ─── */}
        {didLevelUp && (
          <section className="bg-gradient-to-r from-xp-purple to-xp-purple-dark text-white rounded-3xl p-6 md:p-8 shadow-lg text-center space-y-4 animate-scale-up border border-purple-400/20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "radial-gradient(circle at 30% 50%, white 0%, transparent 60%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)"
            }} />
            <div className="relative flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
                <Sparkles className="w-7 h-7 text-yellow-300 fill-current" />
              </div>
              <h2 className="font-display font-black text-3xl">LEVEL UP! 🚀</h2>
              <p className="text-purple-100 text-sm max-w-xs leading-relaxed">
                You're now <strong>Level {newLevel}</strong>! New challenges and harder chapters have been unlocked in your learning path.
              </p>
            </div>
          </section>
        )}

        {/* ─── NEW BADGES ─── */}
        {newBadges && newBadges.length > 0 && (
          <section className="space-y-4 animate-slide-up">
            <h3 className="font-display font-black text-xl text-math-text text-center">
              🎖 New Achievement{newBadges.length > 1 ? "s" : ""} Unlocked!
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {newBadges.map(badgeId => {
                const badge = BADGE_INFO[badgeId] || { icon: "⭐", name: badgeId };
                return (
                  <div
                    key={badgeId}
                    className="bg-math-card border-2 border-purple-500/30 rounded-3xl p-6 text-center flex flex-col items-center w-40 shadow-md animate-scale-up"
                  >
                    <span className="text-5xl mb-3">{badge.icon}</span>
                    <span className="font-bold text-sm text-math-text">{badge.name}</span>
                    <span className="text-[10px] text-xp-purple uppercase font-bold mt-1.5 bg-purple-500/10 px-2 py-0.5 rounded-full">
                      NEW! 🎉
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── NAV BUTTONS ─── */}
        <section className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <button
            id="play-again-btn"
            onClick={() => navigate("/class-select")}
            className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-white dark:bg-math-card border border-math-border hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm text-math-text transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-xp-purple" />
            Play Another Chapter
          </button>

          <button
            id="back-dashboard-btn"
            onClick={() => navigate("/dashboard")}
            className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-xp-purple hover:bg-xp-purple-dark text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back to Dashboard
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>

      </div>
    </div>
  );
};
