import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, BookOpen, Target, Check } from "lucide-react";
import { useGame } from "../context/GameContext";
import { Avatar, availableAvatars } from "../components/Avatar";

export const ProfileSetup = () => {
  const { loginUser, updateUserProfile, user, showToast } = useGame();
  const navigate = useNavigate();

  // Prefill details
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("bear");
  const [selectedClass, setSelectedClass] = useState(10);
  const [dailyGoal, setDailyGoal] = useState(50); // XP goal
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tempName = localStorage.getItem("temp_username");
    if (tempName) {
      setNickname(tempName);
    }
  }, []);

  // Redirect if user is already logged in and fully onboarded
  useEffect(() => {
    if (user && user.lastPlayedDate) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleCompleteSetup = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      showToast("Please enter a nickname", "warning");
      return;
    }

    setLoading(true);

    const tempEmail = localStorage.getItem("temp_email");
    const tempPassword = localStorage.getItem("temp_password");

    if (tempEmail && tempPassword) {
      // Fullstack Register Mode
      const success = await loginUser(tempEmail, tempPassword, "register", nickname);
      if (success) {
        // Update other onboarding selections immediately
        await updateUserProfile({
          avatar: selectedAvatar,
          class: selectedClass,
          dailyGoal: dailyGoal
        });
        
        // Clean temporary storage keys
        localStorage.removeItem("temp_email");
        localStorage.removeItem("temp_username");
        localStorage.removeItem("temp_password");
        
        navigate("/dashboard");
      }
    } else {
      showToast("Registration session expired. Please sign up again.", "warning");
      navigate("/auth");
    }
    
    setLoading(false);
  };


  const goals = [
    { value: 30, label: "Casual (30 XP)", desc: "1 game / day" },
    { value: 50, label: "Regular (50 XP)", desc: "2 games / day" },
    { value: 100, label: "Serious (100 XP)", desc: "4 games / day" }
  ];

  return (
    <div className="min-h-screen bg-math-bg flex items-center justify-center p-6 md:p-12 relative transition-colors duration-300">
      
      {/* SHAPES */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-3xl bg-white dark:bg-math-card border border-math-border rounded-3xl p-8 md:p-12 relative z-10 shadow-xl">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest font-black text-xp-purple bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-200">
            Student Onboarding
          </span>
          <h2 className="font-display font-black text-3xl text-math-text mt-4">
            Initialize Your Avatar
          </h2>
          <p className="text-sm text-math-text-muted mt-2">
            Customize your profiles before stepping into the arena.
          </p>
        </div>

        <form onSubmit={handleCompleteSetup} className="space-y-8">
          {/* NICKNAME INPUT */}
          <div>
            <label className="block text-xs font-bold text-math-text-muted uppercase tracking-wider mb-3">
              1. Confirm Nickname
            </label>
            <input
              type="text"
              required
              maxLength={15}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Pythagoras99"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-2xl py-3.5 px-5 text-sm text-math-text placeholder-slate-450 focus:outline-none focus:border-xp-purple transition-all duration-200"
            />
          </div>

          {/* AVATAR LIST SELECTOR */}
          <div>
            <label className="block text-xs font-bold text-math-text-muted uppercase tracking-wider mb-3">
              2. Select Game Character
            </label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {availableAvatars.map((avKey) => (
                <button
                  key={avKey}
                  type="button"
                  onClick={() => setSelectedAvatar(avKey)}
                  className={`relative p-1 rounded-2xl transition-all duration-200 border-2 cursor-pointer ${
                    selectedAvatar === avKey
                      ? "border-xp-purple bg-purple-500/5 scale-105"
                      : "border-math-border hover:border-slate-350 bg-slate-50/50"
                  }`}
                >
                  <Avatar name={avKey} className="w-full aspect-square max-w-[64px]" />
                  {selectedAvatar === avKey && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-xp-purple flex items-center justify-center text-white border border-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* GRADE LEVEL CARD SELECTION */}
          <div>
            <label className="block text-xs font-bold text-math-text-muted uppercase tracking-wider mb-3">
              3. Choose Class Level
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedClass(9)}
                className={`p-5 rounded-2xl text-left border-2 transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  selectedClass === 9
                    ? "border-xp-purple bg-purple-500/5 text-xp-purple"
                    : "border-math-border hover:border-slate-300 bg-slate-50/30 text-math-text-muted"
                }`}
              >
                <div>
                  <h4 className="font-bold text-base text-math-text">CLASS 9</h4>
                  <p className="text-xs text-math-text-muted mt-1">Build Your Foundation</p>
                </div>
                <BookOpen className={`w-8 h-8 ${selectedClass === 9 ? "text-xp-purple" : "text-math-text-muted"}`} />
              </button>

              <button
                type="button"
                onClick={() => setSelectedClass(10)}
                className={`p-5 rounded-2xl text-left border-2 transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  selectedClass === 10
                    ? "border-xp-purple bg-purple-500/5 text-xp-purple"
                    : "border-math-border hover:border-slate-300 bg-slate-50/30 text-math-text-muted"
                }`}
              >
                <div>
                  <h4 className="font-bold text-base text-math-text">CLASS 10</h4>
                  <p className="text-xs text-math-text-muted mt-1">Master Your Maths</p>
                </div>
                <BookOpen className={`w-8 h-8 ${selectedClass === 10 ? "text-xp-purple" : "text-math-text-muted"}`} />
              </button>
            </div>
          </div>

          {/* GOAL SELECTION */}
          <div>
            <label className="block text-xs font-bold text-math-text-muted uppercase tracking-wider mb-3">
              4. Set Daily Learning Goal
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {goals.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setDailyGoal(g.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                    dailyGoal === g.value
                      ? "border-xp-purple bg-purple-500/5 text-xp-purple"
                      : "border-math-border hover:border-slate-300 text-math-text-muted"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-math-text">{g.label}</span>
                    <Target className={`w-4 h-4 ${dailyGoal === g.value ? "text-xp-purple" : "text-math-text-muted"}`} />
                  </div>
                  <span className="text-xs text-math-text-muted">{g.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-xp-purple hover:bg-xp-purple-dark text-white font-bold text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Registering student..." : "Let's Start Learning!"}</span>
          </button>

        </form>
      </div>
    </div>
  );
};
