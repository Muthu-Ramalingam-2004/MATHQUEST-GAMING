import React, { useState } from "react";
import { 
  User, 
  Award, 
  Settings, 
  Volume2, 
  VolumeX, 
  LogOut,
  Zap,
  Coins,
  Flame,
  CheckCircle,
  Edit3,
  Save,
  X,
  Moon,
  Sun,
  Target
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { Avatar, availableAvatars } from "../components/Avatar";
import { ThemeToggle } from "../components/ThemeToggle";

const ALL_BADGES = [
  {
    id: "first-victory",
    icon: "🏆",
    name: "First Victory",
    desc: "Complete any game level with remaining hearts.",
    rarity: "Common",
    rarityClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
  },
  {
    id: "perfect-score",
    icon: "🎯",
    name: "Perfect Score",
    desc: "Finish a game session with 100% correct answers.",
    rarity: "Rare",
    rarityClass: "text-blue-500 bg-blue-500/10 border-blue-500/20"
  },
  {
    id: "math-starter",
    icon: "⚡",
    name: "Math Starter",
    desc: "Accumulate XP to reach student Level 2.",
    rarity: "Common",
    rarityClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
  },
  {
    id: "streak-hero",
    icon: "🔥",
    name: "Streak Hero",
    desc: "Complete math sessions for 7 consecutive days.",
    rarity: "Epic",
    rarityClass: "text-purple-500 bg-purple-500/10 border-purple-500/20"
  },
  {
    id: "algebra-ace",
    icon: "💡",
    name: "Algebra Ace",
    desc: "Achieve a perfect score in any Algebra chapter.",
    rarity: "Rare",
    rarityClass: "text-blue-500 bg-blue-500/10 border-blue-500/20"
  },
];

const DAILY_GOAL_OPTIONS = [
  { value: 30,  label: "Casual",  desc: "30 XP / day",   emoji: "😌" },
  { value: 50,  label: "Regular", desc: "50 XP / day",   emoji: "🎯" },
  { value: 100, label: "Serious", desc: "100 XP / day",  emoji: "💪" },
];

export const Profile = () => {
  const { user, updateUserProfile, logoutUser, calculateLevelInfo, showToast } = useGame();
  
  const [nickname, setNickname] = useState(user?.name || "");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "bear");
  const [selectedClass, setSelectedClass] = useState(user?.class || 10);
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoal || 50);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  const levelInfo = calculateLevelInfo(user.xp);
  const unlockedBadges = user.unlockedBadges || [];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      showToast("Nickname cannot be empty", "warning");
      return;
    }
    await updateUserProfile({
      name: nickname,
      avatar: selectedAvatar,
      class: Number(selectedClass),
      dailyGoal: Number(dailyGoal),
    });
    setIsEditing(false);
    showToast("Profile updated successfully! 🎉", "success");
  };

  const handleCancelEdit = () => {
    setNickname(user.name);
    setSelectedAvatar(user.avatar);
    setSelectedClass(user.class);
    setDailyGoal(user.dailyGoal || 50);
    setIsEditing(false);
  };

  const toggleSound = async () => {
    const nextVal = !user.soundEnabled;
    await updateUserProfile({ soundEnabled: nextVal });
    showToast(nextVal ? "Sound effects enabled! 🔊" : "Sound muted. 🔇", "info");
  };

  const handleResetData = () => {
    if (window.confirm("⚠️ This will permanently erase ALL progress, badges, XP, coins and streaks. This cannot be undone. Proceed?")) {
      logoutUser();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-12">

      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-3xl text-math-text">My Profile</h2>
          <p className="text-sm text-math-text-muted mt-1">
            Manage your avatar, class level, settings, and view achievement badges.
          </p>
        </div>

        {!isEditing ? (
          <button
            id="edit-profile-btn"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-math-border bg-math-card hover:bg-slate-50 dark:hover:bg-slate-800 text-math-text font-bold text-sm transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-xp-purple" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-math-border bg-math-card hover:bg-slate-50 dark:hover:bg-slate-800 text-math-text-muted font-bold text-sm transition-all cursor-pointer"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              id="save-profile-btn"
              onClick={handleSaveProfile}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-xp-purple hover:bg-xp-purple-dark text-white font-bold text-sm transition-all cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* ─── PROFILE HERO CARD ─── */}
      <section className="bg-math-card border border-math-border rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden transition-colors">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-xp-purple/5 to-transparent rounded-full -translate-y-16 translate-x-16 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative">
          {/* Avatar Section */}
          <div className="relative shrink-0">
            <Avatar name={isEditing ? selectedAvatar : user.avatar} className="w-24 h-24 border-4 border-xp-purple/30 shadow-lg" />
            {/* Level badge */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-tr from-xp-purple to-violet-500 text-white flex items-center justify-center text-sm font-black shadow-md border-2 border-white dark:border-math-card">
              {levelInfo.level}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                maxLength={20}
                placeholder="Your nickname"
                className="font-display font-black text-2xl text-math-text bg-slate-50 dark:bg-slate-900 border border-xp-purple/40 rounded-xl px-4 py-2 focus:outline-none focus:border-xp-purple w-full mb-2 transition-all"
              />
            ) : (
              <h3 className="font-display font-black text-2xl md:text-3xl text-math-text truncate">{user.name}</h3>
            )}
            <p className="text-sm text-math-text-muted font-medium mt-0.5">
              Class {user.class} • Level {levelInfo.level} Mathlete
            </p>

            {/* XP Progress */}
            <div className="mt-4 max-w-sm">
              <div className="flex justify-between text-[11px] font-bold text-math-text-muted mb-1.5">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-xp-purple fill-current" />
                  {levelInfo.progressXP} XP
                </span>
                <span>Next Level: {levelInfo.xpPerLevel - levelInfo.progressXP} XP</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-xp-purple to-violet-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${levelInfo.percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-4 shrink-0">
            <div className="text-center p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/10 border border-amber-200/50">
              <Coins className="w-5 h-5 text-amber-500 fill-current mx-auto mb-1" />
              <div className="font-black text-lg text-math-text">{user.coins}</div>
              <div className="text-[10px] font-bold text-math-text-muted uppercase">Coins</div>
            </div>
            {user.streak > 0 && (
              <div className="text-center p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/10 border border-orange-200/50">
                <Flame className="w-5 h-5 text-coral fill-current mx-auto mb-1 animate-wiggle" />
                <div className="font-black text-lg text-math-text">{user.streak}</div>
                <div className="text-[10px] font-bold text-math-text-muted uppercase">Day Streak</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── AVATAR SELECTOR (EDIT MODE) ─── */}
      {isEditing && (
        <section className="bg-math-card border border-math-border rounded-3xl p-6 shadow-sm animate-fade-in transition-colors">
          <h4 className="font-bold text-sm text-math-text mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-xp-purple" />
            Choose Game Character
          </h4>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {availableAvatars.map(avKey => (
              <button
                key={avKey}
                type="button"
                onClick={() => setSelectedAvatar(avKey)}
                className={`relative p-1.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${
                  selectedAvatar === avKey
                    ? "border-xp-purple bg-purple-500/5 scale-105"
                    : "border-math-border hover:border-slate-300"
                }`}
              >
                <Avatar name={avKey} className="w-full aspect-square max-w-[56px]" />
                {selectedAvatar === avKey && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-xp-purple flex items-center justify-center text-white border-2 border-white dark:border-math-card">
                    <CheckCircle className="w-3 h-3 fill-current" />
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Class selection in edit mode */}
          <div className="mt-6">
            <h4 className="font-bold text-sm text-math-text mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-coral" />
              Class Level
            </h4>
            <div className="grid grid-cols-2 gap-4 max-w-xs">
              {[9, 10].map(cls => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer font-bold text-center ${
                    selectedClass === cls
                      ? "border-xp-purple bg-purple-500/5 text-xp-purple"
                      : "border-math-border text-math-text-muted hover:border-slate-300"
                  }`}
                >
                  Class {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Daily goal in edit mode */}
          <div className="mt-6">
            <h4 className="font-bold text-sm text-math-text mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-mint" />
              Daily Learning Goal
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {DAILY_GOAL_OPTIONS.map(g => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setDailyGoal(g.value)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                    dailyGoal === g.value
                      ? "border-xp-purple bg-purple-500/5"
                      : "border-math-border hover:border-slate-300"
                  }`}
                >
                  <div className="text-xl mb-1">{g.emoji}</div>
                  <div className="font-bold text-xs text-math-text">{g.label}</div>
                  <div className="text-[11px] text-math-text-muted">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── BADGES COLLECTION ─── */}
      <section className="bg-math-card border border-math-border rounded-3xl p-6 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-bold text-lg text-math-text">Achievement Badges</h3>
            <p className="text-xs text-math-text-muted mt-0.5">{unlockedBadges.length} / {ALL_BADGES.length} Unlocked</p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-xp-purple">
            {Math.round((unlockedBadges.length / ALL_BADGES.length) * 100)}% Complete
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ALL_BADGES.map(badge => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-200 ${
                  isUnlocked
                    ? "bg-slate-50/80 dark:bg-slate-900/30 border-math-border hover:scale-105 hover:shadow-sm"
                    : "bg-slate-100/30 dark:bg-slate-900/10 border-math-border opacity-40 grayscale"
                }`}
              >
                <span className="text-4xl mb-3">{badge.icon}</span>
                <span className="font-bold text-xs text-math-text leading-tight mb-1">{badge.name}</span>
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                  isUnlocked ? badge.rarityClass : "text-math-text-muted bg-slate-100 dark:bg-slate-800 border-transparent"
                }`}>
                  {isUnlocked ? badge.rarity : "Locked"}
                </span>
                <p className="text-[10px] text-math-text-muted mt-2 leading-relaxed">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── SETTINGS ─── */}
      <section className="bg-math-card border border-math-border rounded-3xl p-6 shadow-sm transition-colors space-y-4">
        <h3 className="font-display font-bold text-base text-math-text flex items-center gap-2">
          <Settings className="w-5 h-5 text-xp-purple" />
          Preferences & Settings
        </h3>

        {/* Sound Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-math-border">
          <div className="flex items-center gap-3">
            {user.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-xp-purple" />
            ) : (
              <VolumeX className="w-5 h-5 text-math-text-muted" />
            )}
            <div>
              <span className="font-bold text-sm text-math-text block">Sound Effects</span>
              <span className="text-xs text-math-text-muted">{user.soundEnabled ? "Enabled" : "Muted"}</span>
            </div>
          </div>
          <button
            id="toggle-sound-btn"
            onClick={toggleSound}
            className={`relative w-12 h-6 rounded-full transition-all duration-200 cursor-pointer ${
              user.soundEnabled ? "bg-xp-purple" : "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
              user.soundEnabled ? "left-6" : "left-0.5"
            }`} />
          </button>
        </div>

        {/* Theme */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-math-border">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-indigo-500" />
            <div>
              <span className="font-bold text-sm text-math-text block">Theme</span>
              <span className="text-xs text-math-text-muted">Light / Dark mode</span>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Danger zone */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/10 border border-rose-200/50 dark:border-rose-900/30">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-rose-500" />
            <div>
              <span className="font-bold text-sm text-rose-800 dark:text-rose-300 block">Reset All Progress</span>
              <span className="text-xs text-rose-700/70 dark:text-rose-400/70">Permanently erase XP, coins, and badges</span>
            </div>
          </div>
          <button
            id="reset-data-btn"
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
          >
            Reset
          </button>
        </div>
      </section>

    </div>
  );
};
