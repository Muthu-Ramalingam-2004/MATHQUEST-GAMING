import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User, ArrowRight, ArrowLeft, Gamepad2, Eye, EyeOff } from "lucide-react";
import { useGame } from "../context/GameContext";

export const AuthPages = () => {
  const { loginUser, user, showToast } = useGame();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'signup' | 'forgot'
  
  // Form states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (activeTab === "login") {
      if (!email || !password) {
        showToast("Please fill in all fields", "warning");
        setLoading(false);
        return;
      }
      const success = await loginUser(email, password, "login");
      if (success) {
        navigate("/dashboard");
      }
    } else if (activeTab === "signup") {
      if (!email || !username || !password) {
        showToast("Please fill in all fields", "warning");
        setLoading(false);
        return;
      }
      // Save details temporarily for avatar select onboarding
      localStorage.setItem("temp_email", email);
      localStorage.setItem("temp_username", username);
      localStorage.setItem("temp_password", password);
      navigate("/setup");
    } else {
      if (!email) {
        showToast("Please enter your email", "warning");
        setLoading(false);
        return;
      }
      showToast("Verification code sent! Check your inbox.", "success");
      setActiveTab("login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-math-bg flex items-center justify-center p-6 md:p-12 relative transition-colors duration-300">
      
      {/* DECORATIVE MATH PATTERNS */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* AUTH CONTAINER CARD */}
      <div className="w-full max-w-4xl bg-white dark:bg-math-card border border-math-border rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row relative z-10">
        
        {/* LEFT COLUMN: BRAND HIGHLIGHT */}
        <div className="w-full md:w-1/2 bg-gradient-to-tr from-xp-purple to-xp-purple-dark p-8 md:p-12 flex flex-col justify-between text-white relative">
          <div className="absolute inset-0 bg-slate-900/10 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-xp-purple font-black text-lg shadow-sm">
                M
              </span>
              <span className="font-display font-black text-xl tracking-tight text-white animate-pulse-slow">
                MATHQUEST
              </span>
            </div>
            
            <h2 className="font-display font-black text-3xl md:text-4xl leading-tight mb-4">
              Learn Maths. <br />
              Play. Level Up.
            </h2>
            
            <p className="text-purple-100 text-sm font-medium leading-relaxed mb-6">
              Create an account to track your daily progress, unlock rewards, and climb the student leaderboards.
            </p>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-amber-300">
                ⭐
              </div>
              <span className="text-xs font-semibold text-purple-100">Syllabus-aligned math levels</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-orange-300">
                🎮
              </div>
              <span className="text-xs font-semibold text-purple-100">5 engaging game modes</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORMS */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white dark:bg-math-card flex flex-col justify-center">
          
          {/* TAB HEADER (for Login/Signup) */}
          {activeTab !== "forgot" && (
            <div className="flex bg-slate-50 dark:bg-slate-900/60 border border-math-border p-1 rounded-2xl mb-8">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === "login"
                    ? "bg-white dark:bg-math-card text-xp-purple border border-math-border shadow-sm"
                    : "text-math-text-muted hover:text-math-text"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === "signup"
                    ? "bg-white dark:bg-math-card text-xp-purple border border-math-border shadow-sm"
                    : "text-math-text-muted hover:text-math-text"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* BACK TO LOGIN FOR FORGOT STATE */}
          {activeTab === "forgot" && (
            <button
              onClick={() => setActiveTab("login")}
              className="flex items-center gap-1.5 text-xs font-semibold text-math-text-muted hover:text-math-text mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          )}

          {/* FORM TITLE */}
          <h3 className="font-display font-bold text-2xl text-math-text mb-1">
            {activeTab === "login" && "Welcome Back!"}
            {activeTab === "signup" && "Create Student Profile"}
            {activeTab === "forgot" && "Recover Account"}
          </h3>
          <p className="text-xs text-math-text-muted mb-6">
            {activeTab === "login" && "Enter your credentials to enter the arena."}
            {activeTab === "signup" && "Let's set up your profile and get playing."}
            {activeTab === "forgot" && "We will send instructions to reset your password."}
          </p>

          {/* FORM BODY */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field (Signup & Forgot) or Username for Login */}
            {activeTab === "login" ? (
              <div>
                <label className="block text-xs font-bold text-math-text-muted uppercase tracking-wider mb-2">
                  Email Address / Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-math-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@mathquest.com"
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-math-border rounded-2xl py-3.5 pl-11 pr-4 text-sm text-math-text placeholder-slate-400 focus:outline-none focus:border-xp-purple transition-all duration-200"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-math-text-muted uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-math-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@mathquest.com"
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-math-border rounded-2xl py-3.5 pl-11 pr-4 text-sm text-math-text placeholder-slate-400 focus:outline-none focus:border-xp-purple transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Nickname / Username Field (Signup Only) */}
            {activeTab === "signup" && (
              <div>
                <label className="block text-xs font-bold text-math-text-muted uppercase tracking-wider mb-2">
                  Nickname / Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-math-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter nickname..."
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-math-border rounded-2xl py-3.5 pl-11 pr-4 text-sm text-math-text placeholder-slate-400 focus:outline-none focus:border-xp-purple transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Password Field (Login & Signup) */}
            {activeTab !== "forgot" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-math-text-muted uppercase tracking-wider">
                    Password
                  </label>
                  {activeTab === "login" && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("forgot")}
                      className="text-xs text-xp-purple hover:underline font-bold cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-math-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-math-border rounded-2xl py-3.5 pl-11 pr-11 text-sm text-math-text placeholder-slate-400 focus:outline-none focus:border-xp-purple transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-math-text-muted hover:text-math-text cursor-pointer focus:outline-none transition-colors duration-150"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-xp-purple hover:bg-xp-purple-dark text-white font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
            >
              <span>
                {loading ? "Please wait..." : activeTab === "login" ? "Enter Arena" : activeTab === "signup" ? "Next: Select Avatar" : "Reset Password"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* DEMO BYPASS BANNER */}
          {activeTab === "login" && (
            <div className="mt-8 pt-6 border-t border-math-border text-center">
              <button
                onClick={async () => {
                  setLoading(true);
                  const success = await loginUser("student@mathquest.com", "password123");
                  if (success) {
                    navigate("/dashboard");
                  }
                  setLoading(false);
                }}
                className="text-xs text-math-text-muted hover:text-xp-purple font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-xp-purple" />
                Quick Play (Demo Account)
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
