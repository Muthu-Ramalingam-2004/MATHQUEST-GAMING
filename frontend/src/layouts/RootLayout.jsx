import React from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  BarChart2, 
  Trophy, 
  User, 
  ShieldAlert,
  LogOut,
  Flame,
  Zap,
  Coins,
  Menu,
  X
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { Avatar } from "../components/Avatar";
import { ThemeToggle } from "../components/ThemeToggle";

export const RootLayout = () => {
  const { user, loading, logoutUser, calculateLevelInfo } = useGame();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Auth Guard: Redirect to landing page if user is not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-math-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-xp-purple border-t-transparent rounded-full animate-spin"></div>
          <p className="text-math-text-muted font-medium">Entering MathQuest...</p>
        </div>
      </div>
    );
  }

  const levelInfo = calculateLevelInfo(user.xp);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Syllabus", path: "/class-select", icon: BookOpen },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Progress", path: "/progress", icon: BarChart2 },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Admin", path: "/admin", icon: ShieldAlert }
  ];

  return (
    <div className="min-h-screen bg-math-bg text-math-text flex flex-col lg:flex-row transition-colors duration-300">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-math-card border-r border-math-border fixed h-screen z-20 transition-colors">
        {/* Brand Header */}
        <div className="p-6 border-b border-math-border flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-xp-purple to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
              M
            </span>
            <span className="font-display font-black text-xl tracking-tight bg-gradient-to-r from-xp-purple to-violet-500 bg-clip-text text-transparent">
              MATHQUEST
            </span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-xp-purple/10 text-xp-purple dark:bg-xp-purple/20 dark:text-purple-300"
                    : "text-math-text-muted hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-math-text"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-xp-purple dark:text-purple-300" : "text-math-text-muted"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-math-border">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30 mb-2 border border-math-border/50">
            <Avatar name={user.avatar} className="w-10 h-10 border border-xp-purple/30" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-xs text-math-text-muted">Level {user.level}</p>
            </div>
          </div>
          <button
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-math-border hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-455 font-bold text-xs text-math-text-muted transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* --- MOBILE TOP HEADER --- */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-math-card border-b border-math-border sticky top-0 z-20 transition-colors">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-xp-purple to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
            M
          </span>
          <span className="font-display font-black text-lg tracking-tight bg-gradient-to-r from-xp-purple to-violet-500 bg-clip-text text-transparent">
            MATHQUEST
          </span>
        </Link>

        {/* Stats and Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-math-text cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[69px] bg-slate-900/40 backdrop-blur-sm z-30 flex justify-end">
          <nav className="w-64 bg-math-card h-full p-6 shadow-2xl flex flex-col justify-between border-l border-math-border transition-colors">
            <div className="space-y-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-xp-purple/10 text-xp-purple dark:bg-xp-purple/20 dark:text-purple-300"
                        : "text-math-text-muted hover:bg-slate-100 dark:hover:bg-slate-850"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="border-t border-math-border pt-4">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30 mb-4 border border-math-border/50">
                <Avatar name={user.avatar} className="w-10 h-10 border border-xp-purple/30" />
                <div>
                  <p className="font-bold text-sm">{user.name}</p>
                  <p className="text-xs text-math-text-muted font-medium">Level {user.level}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutUser();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-math-border hover:bg-rose-50 text-math-text-muted font-bold text-xs cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* --- CONTENT CONTAINER WITH GLOBAL STATS HEADER --- */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* TOPBAR STATS BAR (Desktop) */}
        <section className="bg-math-card/90 backdrop-blur-md border-b border-math-border px-6 py-3 sticky top-0 z-10 hidden md:flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-math-text-muted uppercase tracking-widest">
              Standard {user.class} Math
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Level / XP Progress */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/20 text-xp-purple font-black text-sm border border-purple-100 dark:border-purple-900/50">
                <Zap className="w-4 h-4 fill-current animate-pulse-slow" />
                <span>LVL {user.level}</span>
              </div>
              <div className="w-32 bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                <div 
                  className="bg-gradient-to-r from-xp-purple to-violet-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${levelInfo.percentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-math-text-muted whitespace-nowrap">
                {levelInfo.progressXP} / {levelInfo.xpPerLevel} XP
              </span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 text-coral font-bold text-sm border border-amber-100 dark:border-amber-900/50">
              <Coins className="w-4 h-4 fill-current" />
              <span>{user.coins}</span>
            </div>

            {/* Streaks */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/20 text-coral font-bold text-sm border border-orange-100 dark:border-orange-900/50">
              <Flame className="w-4 h-4 fill-current animate-wiggle" />
              <span>{user.streak} DAYS</span>
            </div>
          </div>
        </section>

        {/* MOBILE TOPBAR QUICK STATS */}
        <section className="md:hidden flex items-center justify-around py-2.5 px-4 bg-math-card border-b border-math-border text-xs font-bold text-math-text-muted transition-colors">
          <div className="flex items-center gap-1 text-xp-purple">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>LVL {user.level} ({levelInfo.percentage}%)</span>
          </div>
          <div className="flex items-center gap-1 text-coral">
            <Coins className="w-3.5 h-3.5 fill-current" />
            <span>{user.coins} COINS</span>
          </div>
          <div className="flex items-center gap-1 text-coral">
            <Flame className="w-3.5 h-3.5 fill-current animate-wiggle" />
            <span>{user.streak} DAYS</span>
          </div>
        </section>

        {/* Main Routed Outlet */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full pb-20 lg:pb-8">
          <Outlet />
        </main>
        
        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-math-card/95 backdrop-blur-lg border-t border-math-border px-4 py-2 flex items-center justify-around z-20 shadow-lg transition-colors">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-bold tracking-tight transition-all duration-205 cursor-pointer ${
                  isActive
                    ? "text-xp-purple"
                    : "text-math-text-muted hover:text-math-text"
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-xp-purple" : "text-math-text-muted"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
