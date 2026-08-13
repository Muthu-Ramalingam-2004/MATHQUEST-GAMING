import React, { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Zap, 
  Coins, 
  Flame, 
  Play, 
  Gamepad2, 
  Award, 
  Trophy, 
  CheckCircle,
  ArrowRight,
  BrainCircuit,
  Star,
  TrendingUp,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useGame } from "../context/GameContext";

const FLOAT_SYMBOLS = [
  { text: "√x",          top: "8%",  left: "8%",  delay: "0s",   size: "text-4xl" },
  { text: "π",           top: "20%", left: "88%", delay: "1s",   size: "text-5xl" },
  { text: "∫",           top: "55%", left: "5%",  delay: "2s",   size: "text-5xl" },
  { text: "sin θ",       top: "70%", left: "87%", delay: "1.5s", size: "text-3xl" },
  { text: "∑",           top: "12%", left: "50%", delay: "0.5s", size: "text-5xl" },
  { text: "y = mx + c",  top: "40%", left: "88%", delay: "2.5s", size: "text-2xl" },
  { text: "x² + y² = z²",top: "80%", left: "15%", delay: "3s",   size: "text-2xl" },
  { text: "Δ",           top: "35%", left: "3%",  delay: "0.8s", size: "text-4xl" },
];

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "Syllabus Aligned",
    desc: "Complete CBSE & ICSE curriculum for Class 9 & 10 — Polynomials, Trigonometry, Geometry, Probability and more.",
    colorClass: "text-xp-purple",
    bgClass: "bg-purple-500/10",
  },
  {
    icon: Award,
    title: "Gamified Milestones",
    desc: "Level up with XP, collect Math Coins, unlock badges for accuracy milestones and maintain daily streaks.",
    colorClass: "text-coral",
    bgClass: "bg-orange-500/10",
  },
  {
    icon: CheckCircle,
    title: "Fail-Safe Learning",
    desc: "Every error comes with step-by-step breakdowns, worked examples, and concept hints — learning without fear.",
    colorClass: "text-mint",
    bgClass: "bg-emerald-500/10",
  },
];

const GAME_MODES_PREVIEW = [
  { name: "Quick Quiz",    tag: "Timed Action",     emoji: "⚡", color: "text-xp-purple", bg: "bg-purple-500/10 border-purple-500/20" },
  { name: "Math Run",      tag: "Visual Journey",   emoji: "🏃", color: "text-coral",     bg: "bg-orange-500/10 border-orange-500/20" },
  { name: "Math Puzzle",   tag: "Logic Grids",      emoji: "🧩", color: "text-mint",      bg: "bg-emerald-500/10 border-emerald-500/20" },
  { name: "Challenge",     tag: "Bonus 2× XP",      emoji: "🔥", color: "text-heart-red", bg: "bg-rose-500/10 border-rose-500/20" },
  { name: "Practice",      tag: "Stress Free",      emoji: "📖", color: "text-sky-600",   bg: "bg-sky-500/10 border-sky-500/20" },
  { name: "Syllabus Bank", tag: "Admin Panel",      emoji: "🏫", color: "text-xp-purple", bg: "bg-slate-100 dark:bg-slate-800/60 border-math-border" },
];

export const LandingPage = () => {
  const { user } = useGame();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-math-bg text-math-text overflow-x-hidden relative transition-colors duration-300">

      {/* ─── BACKGROUND FLOATING MATH SYMBOLS ─── */}
      {FLOAT_SYMBOLS.map((sym, idx) => (
        <div
          key={idx}
          className={`absolute ${sym.size} text-xp-purple/4 dark:text-white/4 font-serif font-black select-none pointer-events-none animate-float hidden md:block`}
          style={{ top: sym.top, left: sym.left, animationDelay: sym.delay }}
        >
          {sym.text}
        </div>
      ))}

      {/* ─── HEADER ─── */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-math-border relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-xp-purple to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-md">
            M
          </div>
          <span className="font-display font-black text-2xl tracking-tight bg-gradient-to-r from-xp-purple to-violet-500 bg-clip-text text-transparent">
            MATHQUEST
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-math-text-muted">
          <a href="#modes" className="hover:text-xp-purple transition-colors">Game Modes</a>
          <a href="#features" className="hover:text-xp-purple transition-colors">Features</a>
          <Link to="/admin" className="hover:text-xp-purple transition-colors">For Teachers</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              id="header-dashboard-link"
              className="px-5 py-2.5 rounded-xl bg-xp-purple hover:bg-xp-purple-dark text-white font-bold text-sm shadow-md transition-all duration-200 flex items-center gap-1.5"
            >
              Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                id="header-signin-link"
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-math-card hover:bg-slate-50 border border-math-border text-math-text font-bold text-sm transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="hidden sm:flex px-5 py-2.5 rounded-xl bg-xp-purple hover:bg-xp-purple-dark text-white font-bold text-sm shadow-md transition-all duration-200 items-center gap-1.5"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center relative z-10 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-xp-purple font-semibold text-xs border border-purple-300/40 mb-8 animate-pulse-slow">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Math Gaming Platform for Class 9 & 10</span>
        </div>

        <h1 className="font-display font-black text-5xl md:text-7xl xl:text-8xl leading-[1.05] tracking-tight mb-6 text-math-text max-w-5xl">
          Turn Maths Into a
          <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-xp-purple via-violet-500 to-purple-400 bg-clip-text text-transparent">
            {" "}Thrilling Game
          </span>
        </h1>

        <p className="text-math-text-muted text-lg md:text-xl font-medium max-w-2xl mb-10 leading-relaxed">
          Learn syllabus-aligned concepts, solve interactive challenges, earn XP &amp; levels, unlock badges, and master mathematics like never before.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            id="hero-start-btn"
            onClick={() => navigate(user ? "/dashboard" : "/auth")}
            className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-xp-purple hover:bg-xp-purple-dark text-white font-bold text-base shadow-lg shadow-purple-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            Start Learning Free
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#modes"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-math-card hover:bg-slate-50 dark:hover:bg-slate-800 text-math-text border border-math-border font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Gamepad2 className="w-5 h-5 text-xp-purple" />
            Explore Game Modes
          </a>
        </div>

        {/* Hero Preview Widget */}
        <div className="w-full max-w-4xl bg-white dark:bg-math-card border border-math-border rounded-3xl p-6 shadow-lg relative overflow-hidden">
          {/* Mac-style dots */}
          <div className="absolute top-4 left-5 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>

          <div className="flex items-center justify-center mb-5 mt-3">
            <span className="text-xs font-bold text-math-text-muted uppercase tracking-widest">
              Live Player Dashboard Preview
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-math-bg/50 p-4 rounded-2xl flex flex-col items-center border border-math-border/50 hover:scale-105 transition-transform duration-200">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-xp-purple mb-2">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[10px] text-math-text-muted font-bold uppercase">Player XP</span>
              <span className="text-xl font-black text-xp-purple">2,450</span>
            </div>

            <div className="bg-math-bg/50 p-4 rounded-2xl flex flex-col items-center border border-math-border/50 hover:scale-105 transition-transform duration-200">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-coral mb-2">
                <Coins className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[10px] text-math-text-muted font-bold uppercase">Math Coins</span>
              <span className="text-xl font-black text-coral">420</span>
            </div>

            <div className="bg-math-bg/50 p-4 rounded-2xl flex flex-col items-center border border-math-border/50 hover:scale-105 transition-transform duration-200">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-coral mb-2">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[10px] text-math-text-muted font-bold uppercase">Day Streak</span>
              <span className="text-xl font-black text-coral">7 Days 🔥</span>
            </div>

            <div className="bg-math-bg/50 p-4 rounded-2xl flex flex-col items-center border border-math-border/50 hover:scale-105 transition-transform duration-200">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-mint mb-2">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-math-text-muted font-bold uppercase">Grade Level</span>
              <span className="text-xl font-black text-mint">9th & 10th</span>
            </div>
          </div>

          {/* Mini XP bar */}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-math-text-muted">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-xp-purple fill-current" /> Level 8</span>
              <span>2,450 / 2,700 XP to Level 9</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-xp-purple to-violet-400 h-full rounded-full" style={{ width: "91%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY MATHQUEST ─── */}
      <section id="features" className="bg-white dark:bg-math-card border-y border-math-border py-20 relative z-10 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] uppercase tracking-widest font-black text-xp-purple bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-200/50">
              Why MathQuest?
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl mt-4 mb-4">
              Engineered for Real Learning
            </h2>
            <p className="text-math-text-muted max-w-xl mx-auto font-medium">
              We map school curricula into gaming frameworks that make students want to practice more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-math-bg/40 border border-math-border p-8 rounded-3xl hover:border-xp-purple/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl ${f.bgClass} flex items-center justify-center ${f.colorClass} mb-6`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-math-text-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-14 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "13", label: "Math Chapters", icon: "📚" },
              { value: "5",  label: "Game Modes",    icon: "🎮" },
              { value: "50+",label: "Questions",     icon: "❓" },
              { value: "∞",  label: "Practice Plays",icon: "♾️" },
            ].map((stat, i) => (
              <div key={i} className="bg-math-card border border-math-border rounded-2xl p-6">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="font-display font-black text-3xl text-math-text">{stat.value}</div>
                <div className="text-xs font-bold text-math-text-muted uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GAME MODES ─── */}
      <section id="modes" className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-14">
          <span className="text-[10px] uppercase tracking-widest font-black text-coral bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-200/50">
            Game Modes
          </span>
          <h2 className="font-display font-black text-3xl md:text-4xl mt-4 mb-4">
            Choose Your Style of Play
          </h2>
          <p className="text-math-text-muted max-w-xl mx-auto font-medium">
            Multiple interaction modes for different learning personalities and moods.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAME_MODES_PREVIEW.map((mode, i) => (
            <div
              key={i}
              className={`p-6 rounded-3xl border ${mode.bg} hover:-translate-y-1 hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{mode.emoji}</span>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded ${mode.bg} ${mode.color}`}>
                  {mode.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">{mode.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-white dark:bg-math-card border-t border-math-border py-20 text-center relative z-10 transition-colors">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          {/* Glow orb */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-xp-purple to-violet-400 flex items-center justify-center text-white shadow-xl mb-6 animate-float">
            <Sparkles className="w-10 h-10" />
          </div>

          <h2 className="font-display font-black text-4xl md:text-5xl mb-4">
            Ready to Level Up?
          </h2>
          <p className="text-math-text-muted text-lg max-w-md mb-10 leading-relaxed">
            Create your character, pick your grade, and start climbing the leaderboard today. It's completely free.
          </p>

          <button
            id="cta-start-btn"
            onClick={() => navigate(user ? "/dashboard" : "/auth")}
            className="group px-10 py-4 rounded-2xl bg-xp-purple hover:bg-xp-purple-dark text-white font-bold text-base shadow-lg shadow-purple-500/20 transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            Get Started Now
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-math-border py-10 relative z-10 bg-white dark:bg-math-card transition-colors">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-xp-purple to-violet-500 flex items-center justify-center text-white font-black text-sm">
              M
            </div>
            <span className="font-display font-black text-lg bg-gradient-to-r from-xp-purple to-violet-500 bg-clip-text text-transparent">
              MATHQUEST
            </span>
          </div>
          <p className="text-xs text-math-text-muted font-medium">
            © 2026 MathQuest Gaming. Learn Maths. Play. Level Up.
          </p>
          <div className="flex items-center gap-5 text-xs font-semibold text-math-text-muted">
            <Link to="/admin" className="hover:text-xp-purple transition-colors">Admin</Link>
            <Link to="/auth" className="hover:text-xp-purple transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};
