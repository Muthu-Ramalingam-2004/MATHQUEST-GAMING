import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Zap, 
  Coins, 
  Flame, 
  Play, 
  Gamepad2, 
  Award, 
  Trophy, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  Target,
  Brain,
  ShieldAlert,
  Dumbbell,
  Star,
  TrendingUp,
  Calendar,
  ChevronRight,
  Lock
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { questionService } from "../services/questionService";
import { chaptersData } from "../data/chaptersData";
import { Avatar } from "../components/Avatar";

const BADGES = {
  "first-victory": { icon: "🏆", name: "First Victory", color: "from-amber-400 to-yellow-500" },
  "perfect-score": { icon: "🎯", name: "Perfect Score", color: "from-emerald-400 to-teal-500" },
  "math-starter":  { icon: "⚡", name: "Math Starter",  color: "from-purple-400 to-violet-500" },
  "streak-hero":   { icon: "🔥", name: "Streak Hero",   color: "from-orange-400 to-red-500" },
  "algebra-ace":   { icon: "💡", name: "Algebra Ace",   color: "from-blue-400 to-indigo-500" },
};

const GAME_MODES = [
  {
    id: "quick-quiz",
    name: "Quick Quiz",
    emoji: "⚡",
    desc: "Race against the clock! 15-second timed questions.",
    difficulty: "Medium",
    xpText: "20 XP / Q",
    gradientClass: "from-violet-600 to-purple-500",
    bgClass: "bg-purple-500/10",
    borderClass: "border-purple-500/20",
    textClass: "text-xp-purple",
    badgeClass: "bg-purple-500/15 text-xp-purple border-purple-500/20",
  },
  {
    id: "math-run",
    name: "Math Run",
    emoji: "🏃",
    desc: "Guide your avatar through obstacles by solving math.",
    difficulty: "Easy",
    xpText: "25 XP / Q",
    gradientClass: "from-orange-500 to-amber-500",
    bgClass: "bg-orange-500/10",
    borderClass: "border-orange-500/20",
    textClass: "text-coral",
    badgeClass: "bg-orange-500/15 text-coral border-orange-500/20",
  },
  {
    id: "math-puzzle",
    name: "Math Puzzle",
    emoji: "🧩",
    desc: "Deduce patterns, fill grids, and crack stage puzzles.",
    difficulty: "Medium",
    xpText: "30 XP / Q",
    gradientClass: "from-emerald-500 to-teal-500",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/20",
    textClass: "text-mint",
    badgeClass: "bg-emerald-500/15 text-mint border-emerald-500/20",
  },
  {
    id: "challenge",
    name: "Challenge",
    emoji: "🔥",
    desc: "Hard questions, numerical input, double XP multiplier!",
    difficulty: "Hard",
    xpText: "40+ XP / Q",
    gradientClass: "from-rose-600 to-red-500",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/20",
    textClass: "text-heart-red",
    badgeClass: "bg-rose-500/15 text-heart-red border-rose-500/20",
  },
  {
    id: "practice",
    name: "Practice",
    emoji: "📖",
    desc: "No timer, infinite lives. Learn at your own pace.",
    difficulty: "Any",
    xpText: "10 XP / Q",
    gradientClass: "from-sky-500 to-blue-500",
    bgClass: "bg-sky-500/10",
    borderClass: "border-sky-500/20",
    textClass: "text-sky-600",
    badgeClass: "bg-sky-500/15 text-sky-600 border-sky-500/20",
  },
];

const quotes = [
  "Mathematics is not about numbers, but about understanding. — W.P. Thurston",
  "Pure mathematics is the poetry of logical ideas. — Albert Einstein",
  "The art of proposing a question must be valued over solving it. — Georg Cantor",
  "Go deep enough into anything and you will find mathematics. — Dean Schlicter",
];

export const Dashboard = () => {
  const { user, calculateLevelInfo, startNewGame, showToast, offlineMode } = useGame();
  const navigate = useNavigate();
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [activeMode, setActiveMode] = useState("quick-quiz");

  useEffect(() => {
    if (user) {
      const challenge = questionService.getDailyChallenge(user.class);
      setDailyChallenge(challenge);
    }
  }, [user]);

  if (!user) return null;

  const levelInfo = calculateLevelInfo(user.xp);
  const activeQuote = quotes[new Date().getDate() % quotes.length];

  // Determine continue chapter
  const getContinueChapter = () => {
    const userClass = user.class || 10;
    const chapters = chaptersData[userClass] || chaptersData[10];
    const completedKeys = Object.keys(user.completedChapters || {});
    if (chapters && completedKeys.length > 0) {
      const lastKey = completedKeys[completedKeys.length - 1];
      const found = chapters.find(c => c.id === lastKey);
      if (found) return found;
    }
    return chapters
      ? chapters[0]
      : { id: "num-sys-9", name: "Number Systems", color: "from-purple-500 to-violet-600" };
  };

  const continueChapter = getContinueChapter();
  const continueProgress = user.completedChapters?.[continueChapter.id]?.accuracy || 0;
  const goalProgress = Math.min(100, Math.floor((levelInfo.progressXP / (user.dailyGoal || 50)) * 100));

  const playDailyChallenge = async () => {
    if (!dailyChallenge) return;
    const started = await startNewGame(user.class, dailyChallenge.chapterId, "challenge", [dailyChallenge]);
    if (started) {
      showToast("Daily Challenge Active! 2× XP multiplier is ON! 🔥", "info");
      navigate("/game");
    }
  };

  const handleModePlay = () => {
    navigate(`/class-select?mode=${activeMode}`);
  };

  const unlockedBadges = user.unlockedBadges || [];
  const badgeEntries = Object.entries(BADGES);

  return (
    <div className="space-y-8 animate-fade-in pb-4">

      {/* ─── OFFLINE WARNING ─── */}
      {offlineMode && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 text-sm font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 animate-pulse-slow" />
          <span>Offline Mode Active — All progress saves locally to your browser storage.</span>
        </div>
      )}

      {/* ─── ROW 1: HERO WELCOME + STATS ─── */}
      <section className="grid lg:grid-cols-3 gap-6">

        {/* Welcome Card */}
        <div className="lg:col-span-2 relative bg-math-card border border-math-border rounded-3xl p-7 shadow-sm overflow-hidden transition-colors">
          {/* Decorative background math symbol */}
          <div className="absolute -right-4 -bottom-6 text-[120px] font-serif italic select-none pointer-events-none text-slate-100 dark:text-white/5 leading-none">
            ∑
          </div>

          <div className="relative flex items-start gap-5">
            <div className="relative shrink-0">
              <Avatar name={user.avatar} className="w-16 h-16 border-2 border-xp-purple/30 shadow-sm" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-xp-purple text-white flex items-center justify-center text-[10px] font-black shadow">
                {levelInfo.level}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display font-black text-2xl text-math-text truncate">
                  Hey, {user.name}! 👋
                </h2>
                {user.streak > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-coral text-[11px] font-bold shrink-0">
                    <Flame className="w-3 h-3 fill-current animate-wiggle" /> {user.streak}d
                  </span>
                )}
              </div>
              <p className="text-xs text-math-text-muted font-medium">
                Class {user.class} Student · Level {levelInfo.level} Mathlete
              </p>

              {/* XP Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-math-text-muted">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-xp-purple fill-current" />
                    {levelInfo.progressXP} XP
                  </span>
                  <span>Level {levelInfo.level + 1} in {levelInfo.xpPerLevel - levelInfo.progressXP} XP</span>
                </div>
                <div className="relative w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-xp-purple to-violet-500 rounded-full transition-all duration-700"
                    style={{ width: `${levelInfo.percentage}%` }}
                  />
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 animate-shimmer opacity-30 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Quote */}
          <p className="relative mt-5 text-xs text-math-text-muted italic leading-relaxed max-w-lg border-t border-math-border pt-4">
            "{activeQuote}"
          </p>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          {/* Daily Goal Card */}
          <div className="bg-math-card border border-math-border rounded-3xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-math-text-muted uppercase tracking-wider">Daily Goal</span>
              <Target className="w-4 h-4 text-xp-purple animate-pulse-slow" />
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-black text-3xl text-math-text">{levelInfo.progressXP}</span>
              <span className="text-sm text-math-text-muted font-semibold">/ {user.dailyGoal || 50} XP</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-xp-purple to-violet-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-math-text-muted font-medium mt-2">
              {goalProgress >= 100
                ? "🎉 Goal reached! Keep going!"
                : `🎯 ${Math.max(0, (user.dailyGoal || 50) - levelInfo.progressXP)} XP left to complete today's goal`}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-900/30 rounded-2xl p-4 flex flex-col items-center">
              <Coins className="w-5 h-5 text-amber-500 fill-current mb-1" />
              <span className="font-black text-xl text-math-text">{user.coins}</span>
              <span className="text-[10px] font-bold text-math-text-muted uppercase">Coins</span>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/10 border border-purple-200/60 dark:border-purple-900/30 rounded-2xl p-4 flex flex-col items-center">
              <Star className="w-5 h-5 text-xp-purple fill-current mb-1" />
              <span className="font-black text-xl text-math-text">{user.xp}</span>
              <span className="text-[10px] font-bold text-math-text-muted uppercase">Total XP</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROW 2: ACTION CARDS ─── */}
      <section className="grid md:grid-cols-2 gap-5">

        {/* Continue Learning */}
        <div className="bg-math-card border border-math-border rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${continueChapter.color} flex items-center justify-center text-white shadow-md shrink-0`}>
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-math-text-muted uppercase tracking-widest">Continue Learning</p>
            <h3 className="font-bold text-base text-math-text truncate mt-0.5">{continueChapter.name}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-mint h-full rounded-full" style={{ width: `${continueProgress}%` }} />
              </div>
              <span className="text-[11px] font-bold text-mint shrink-0">{continueProgress}%</span>
            </div>
          </div>
          <button
            onClick={() => navigate(`/chapters?play=${continueChapter.id}`)}
            id="resume-chapter-btn"
            className="px-4 py-2.5 rounded-xl bg-xp-purple hover:bg-xp-purple-dark text-white text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
          >
            Resume <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Challenge */}
        {dailyChallenge ? (
          <div className="relative bg-gradient-to-br from-orange-500/8 via-coral/5 to-transparent border border-orange-300/30 rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="absolute top-3 right-4 text-[10px] font-black text-coral uppercase tracking-widest animate-pulse-slow">
              2× XP BONUS
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shrink-0">
              <Sparkles className="w-7 h-7 animate-spin-slow" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-coral uppercase tracking-widest">Daily Challenge</p>
              <h3 className="font-bold text-base text-math-text mt-0.5">
                {chaptersData[user.class]?.find(c => c.id === dailyChallenge.chapterId)?.name || "Today's Math"}
              </h3>
              <p className="text-xs text-math-text-muted mt-0.5">Double XP + Bonus Coins Active</p>
            </div>
            <button
              onClick={playDailyChallenge}
              id="daily-challenge-btn"
              className="px-4 py-2.5 rounded-xl bg-coral hover:bg-orange-600 text-white text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
            >
              Play <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-math-border rounded-3xl p-6 flex items-center justify-center text-math-text-muted text-sm">
            Daily Challenge resetting in a moment…
          </div>
        )}
      </section>

      {/* ─── ROW 3: GAME MODE SELECTOR ─── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-xl text-math-text">Choose Game Mode</h3>
            <p className="text-xs text-math-text-muted mt-0.5">Select a mode, then pick your chapter to start</p>
          </div>
          <button
            id="start-selected-mode-btn"
            onClick={handleModePlay}
            className="px-5 py-2.5 rounded-xl bg-xp-purple hover:bg-xp-purple-dark text-white font-bold text-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            Play Now
          </button>
        </div>

        {/* Mode Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {GAME_MODES.map((mode, idx) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                id={`mode-btn-${mode.id}`}
                onClick={() => setActiveMode(mode.id)}
                className={`relative flex flex-col items-center text-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 animate-fade-in stagger-${idx + 1} ${
                  isActive
                    ? `${mode.bgClass} ${mode.borderClass} ${mode.textClass} shadow-md -translate-y-0.5`
                    : "bg-math-card border-math-border text-math-text-muted hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  </div>
                )}
                <span className="text-3xl mb-2">{mode.emoji}</span>
                <span className="font-bold text-xs leading-tight">{mode.name}</span>
                <span className={`text-[10px] font-bold mt-2 px-2 py-0.5 rounded-full border ${
                  isActive ? mode.badgeClass : "bg-slate-100 dark:bg-slate-800 text-math-text-muted border-transparent"
                }`}>
                  {mode.xpText}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Mode Detail */}
        {(() => {
          const mode = GAME_MODES.find(m => m.id === activeMode);
          return (
            <div className={`p-5 rounded-2xl ${mode.bgClass} border ${mode.borderClass} flex items-center gap-4 animate-fade-in`}>
              <span className="text-4xl shrink-0">{mode.emoji}</span>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm ${mode.textClass}`}>{mode.name}</h4>
                <p className="text-xs text-math-text-muted mt-0.5">{mode.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${mode.badgeClass}`}>
                  Difficulty: {mode.difficulty}
                </span>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ─── ROW 4: BADGES + LEADERBOARD PREVIEW ─── */}
      <section className="grid lg:grid-cols-3 gap-6">

        {/* Achievements */}
        <div className="lg:col-span-2 bg-math-card border border-math-border rounded-3xl p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-base text-math-text">Achievement Badges</h3>
              <p className="text-xs text-math-text-muted mt-0.5">{unlockedBadges.length} / {badgeEntries.length} Unlocked</p>
            </div>
            <Link to="/profile" className="text-xs font-bold text-xp-purple flex items-center gap-1 hover:underline">
              All Badges <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {badgeEntries.map(([id, badge]) => {
              const isUnlocked = unlockedBadges.includes(id);
              return (
                <div
                  key={id}
                  className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-200 ${
                    isUnlocked
                      ? "bg-slate-50/80 dark:bg-slate-900/30 border-math-border hover:scale-105"
                      : "bg-slate-100/40 dark:bg-slate-900/10 border-math-border opacity-40 grayscale"
                  }`}
                >
                  <span className="text-3xl mb-2">{badge.icon}</span>
                  <span className="text-[11px] font-bold text-math-text leading-tight">{badge.name}</span>
                  <span className={`text-[9px] font-bold uppercase mt-1 ${isUnlocked ? "text-mint" : "text-math-text-muted"}`}>
                    {isUnlocked ? "✓ Earned" : "Locked"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mini Leaderboard */}
        <div className="bg-math-card border border-math-border rounded-3xl p-6 shadow-sm flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-base text-math-text">Top Ranks</h3>
            <Link to="/leaderboard" className="text-xs font-bold text-xp-purple flex items-center gap-1 hover:underline">
              Full Board <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 flex-1">
            {[
              { name: "Aryabhata_Pro", avatar: "wizard", xp: 4850, rank: 1, isMe: false },
              { name: "NewtonForce",   avatar: "robot",  xp: 3900, rank: 2, isMe: false },
              { name: user.name,       avatar: user.avatar, xp: user.xp, rank: "—", isMe: true },
            ].map((leader, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  leader.isMe
                    ? "bg-purple-500/5 border-purple-500/20"
                    : "bg-slate-50/50 dark:bg-slate-800/20 border-math-border"
                }`}
              >
                <span className="font-black text-xs text-math-text-muted w-5 text-center">
                  {leader.isMe ? "You" : `#${leader.rank}`}
                </span>
                <Avatar name={leader.avatar} className="w-8 h-8 shrink-0" />
                <span className={`font-bold text-xs truncate flex-1 ${leader.isMe ? "text-xp-purple" : "text-math-text"}`}>
                  {leader.name}
                </span>
                <span className="font-bold text-xs text-math-text-muted shrink-0">{leader.xp} XP</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-math-border">
            <p className="text-[11px] text-math-text-muted leading-relaxed">
              🏆 Earn XP in <strong>Quick Quiz</strong> or <strong>Daily Challenges</strong> to climb the leaderboard!
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
