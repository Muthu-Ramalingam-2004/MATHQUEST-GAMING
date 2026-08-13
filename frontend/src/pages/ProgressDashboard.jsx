import React from "react";
import { 
  BarChart2, 
  Award, 
  HelpCircle, 
  TrendingUp, 
  CheckCircle, 
  Percent, 
  Zap, 
  Flame,
  BookOpen
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { chaptersData } from "../data/chaptersData";

export const ProgressDashboard = () => {
  const { user, calculateLevelInfo } = useGame();

  if (!user) return null;

  const levelInfo = calculateLevelInfo(user.xp);

  // Compute stats
  const completedMap = user.completedChapters || {};
  const completedChapterIds = Object.keys(completedMap);
  const totalChaptersCount = chaptersData[9].length + chaptersData[10].length;
  
  let totalCorrectQuestions = 0;
  let highestAccuracy = 0;
  let cumulativeAccuracy = 0;
  let totalLevelsPlayed = 0;

  completedChapterIds.forEach(id => {
    const stats = completedMap[id];
    if (stats) {
      totalCorrectQuestions += stats.completedQuestions;
      highestAccuracy = Math.max(highestAccuracy, stats.accuracy);
      cumulativeAccuracy += stats.accuracy;
      totalLevelsPlayed += stats.timesPlayed;
    }
  });

  const averageAccuracy = completedChapterIds.length > 0 
    ? Math.round(cumulativeAccuracy / completedChapterIds.length) 
    : 0;

  const syllabusProgressPercent = Math.min(100, Math.floor((completedChapterIds.length / totalChaptersCount) * 100));

  // Mock weekly active log
  const weeklyLog = [
    { day: "Mon", active: true, xp: 60 },
    { day: "Tue", active: true, xp: 80 },
    { day: "Wed", active: false, xp: 0 },
    { day: "Thu", active: true, xp: 120 },
    { day: "Fri", active: true, xp: 90 },
    { day: "Sat", active: false, xp: 0 },
    { day: "Sun", active: true, xp: levelInfo.progressXP }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER TITLE */}
      <div>
        <h2 className="font-display font-black text-3xl text-math-text">
          Progress & Metrics
        </h2>
        <p className="text-sm text-math-text-muted mt-1">
          Review your cumulative math stats, accuracy percentiles, and weekly study consistency.
        </p>
      </div>

      {/* OVERALL STATISTICS CHIPS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-math-card border border-math-border rounded-3xl p-6 shadow-sm">
          <span className="text-[10px] text-math-text-muted font-bold uppercase block tracking-wider mb-2">Questions Solved</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-3xl text-math-text">{totalCorrectQuestions}</span>
            <span className="text-xs font-bold text-mint">Correct</span>
          </div>
        </div>

        <div className="bg-math-card border border-math-border rounded-3xl p-6 shadow-sm">
          <span className="text-[10px] text-math-text-muted font-bold uppercase block tracking-wider mb-2">Average Accuracy</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-3xl text-math-text">{averageAccuracy}%</span>
            <span className="text-xs font-bold text-xp-purple">Target: 80%</span>
          </div>
        </div>

        <div className="bg-math-card border border-math-border rounded-3xl p-6 shadow-sm">
          <span className="text-[10px] text-math-text-muted font-bold uppercase block tracking-wider mb-2">Syllabus Covered</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-3xl text-math-text">{completedChapterIds.length}</span>
            <span className="text-xs font-semibold text-math-text-muted">/ {totalChaptersCount} Chapters</span>
          </div>
        </div>

        <div className="bg-math-card border border-math-border rounded-3xl p-6 shadow-sm">
          <span className="text-[10px] text-math-text-muted font-bold uppercase block tracking-wider mb-2">Levels Completed</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-3xl text-math-text">{totalLevelsPlayed}</span>
            <span className="text-xs font-bold text-coral">Lessons</span>
          </div>
        </div>
      </section>

      {/* CHARTS CONTAINER GRID */}
      <section className="grid lg:grid-cols-3 gap-8">
        
        {/* Weekly active log */}
        <div className="lg:col-span-2 bg-math-card border border-math-border rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-math-text">
              Weekly Activity Log (XP Stacked)
            </h3>
            <span className="text-xs text-math-text-muted font-bold uppercase tracking-wider">Mon - Sun</span>
          </div>

          <div className="flex items-end justify-between px-2 pt-6 h-40">
            {weeklyLog.map((log, idx) => {
              const maxXP = 150;
              const barHeight = log.xp > 0 ? Math.min(100, Math.floor((log.xp / maxXP) * 100)) : 4;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="w-full max-w-[28px] relative flex flex-col justify-end h-32 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-math-border/50">
                    <div 
                      className={`w-full rounded-t-md transition-all duration-700 ${
                        log.active 
                          ? "bg-gradient-to-t from-xp-purple to-violet-400 group-hover:from-purple-400" 
                          : "bg-slate-200 dark:bg-slate-800"
                      }`}
                      style={{ height: `${barHeight}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-math-text-muted">{log.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Circular Syllabus progress card */}
        <div className="bg-math-card border border-math-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-math-text">
              Syllabus Completion Rate
            </h3>

            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" stroke="#e2e8f0" strokeWidth="8" fill="transparent" className="dark:stroke-slate-800" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="50" 
                  stroke="#10b981" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="314" 
                  strokeDashoffset={314 - (314 * syllabusProgressPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-750"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display font-black text-2xl text-math-text">
                  {syllabusProgressPercent}%
                </span>
                <span className="text-[9px] text-math-text-muted font-bold uppercase">
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-math-text-muted leading-relaxed mt-4 border-t border-math-border pt-3">
            📘 Class {user.class} has {chaptersData[user.class].length} chapters. Unlock harder syllabus categories by maintaining your level XP gains.
          </div>
        </div>

      </section>

      {/* CHAPTER-WISE PERFORMANCE LIST */}
      <section className="space-y-4">
        <h3 className="font-display font-black text-lg text-math-text">
          Chapter-wise Performance
        </h3>

        <div className="bg-math-card border border-math-border rounded-3xl overflow-hidden shadow-sm">
          <div className="divide-y divide-math-border">
            {chaptersData[user.class].map((chapter) => {
              const stats = completedMap[chapter.id];
              const progress = stats ? stats.accuracy : 0;
              const questionsSolved = stats ? stats.completedQuestions : 0;
              
              return (
                <div key={chapter.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${chapter.color}`}></span>
                    <div>
                      <span className="font-bold text-sm text-math-text block">{chapter.name}</span>
                      <span className="text-[10px] text-math-text-muted uppercase font-bold tracking-wider">
                        {stats ? `Completed ${stats.timesPlayed} sessions` : "Unplayed"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col text-left sm:text-right">
                      <span className="text-[10px] text-math-text-muted font-bold uppercase">Questions Solved</span>
                      <span className="text-xs font-bold text-math-text">{questionsSolved} Correct</span>
                    </div>

                    <div className="flex flex-col text-left sm:text-right w-24">
                      <span className="text-[10px] text-math-text-muted font-bold uppercase">High Accuracy</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden shrink-0">
                          <div className="bg-mint h-full rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="text-xs font-black text-mint">{progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
