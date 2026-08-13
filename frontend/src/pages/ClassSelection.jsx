import React from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { BookOpen, Award, ArrowRight, Zap, Target } from "lucide-react";
import { useGame } from "../context/GameContext";
import { chaptersData } from "../data/chaptersData";

export const ClassSelection = () => {
  const { user } = useGame();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeMode = searchParams.get("mode") || "practice";

  if (!user) return null;

  const getClassStats = (classNum) => {
    const chapters = chaptersData[classNum];
    const completedMap = user.completedChapters || {};
    
    let completedCount = 0;
    let totalAccuracy = 0;
    let playedCount = 0;

    chapters.forEach(ch => {
      const stats = completedMap[ch.id];
      if (stats) {
        playedCount += 1;
        totalAccuracy += stats.accuracy;
        if (stats.completedQuestions > 0) {
          completedCount += 1;
        }
      }
    });

    const averageAccuracy = playedCount > 0 ? Math.round(totalAccuracy / playedCount) : 0;

    return {
      totalChapters: chapters.length,
      completedCount,
      averageAccuracy
    };
  };

  const stats9 = getClassStats(9);
  const stats10 = getClassStats(10);

  const handleSelectClass = (classNum) => {
    navigate(`/chapters?class=${classNum}&mode=${activeMode}`);
  };

  const getModeLabel = (mode) => {
    switch (mode) {
      case "quick-quiz": return "Quick Quiz";
      case "math-run": return "Math Run";
      case "math-puzzle": return "Math Puzzle";
      case "challenge": return "Challenge Mode";
      case "practice": return "Practice Sandbox";
      default: return "Gameplay";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="text-center md:text-left">
        <span className="text-[10px] font-extrabold text-xp-purple uppercase tracking-widest bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-200">
          Mode Selected: {getModeLabel(activeMode)}
        </span>
        <h2 className="font-display font-black text-3xl md:text-4xl text-math-text mt-4">
          Select Syllabus Class
        </h2>
        <p className="text-sm text-math-text-muted mt-2 max-w-xl">
          Choose a mathematics grade course. Each contains specific syllabus chapters aligned to standard curriculum.
        </p>
      </div>

      {/* CARDS CONTAINER */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* CLASS 9 CARD */}
        <div 
          onClick={() => handleSelectClass(9)}
          className={`bg-math-card border rounded-3xl p-8 hover:-translate-y-1 hover:shadow-lg hover:border-xp-purple/30 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
            user.class === 9 ? "border-xp-purple/40 shadow-sm" : "border-math-border shadow-sm"
          }`}
        >
          {user.class === 9 && (
            <span className="absolute top-4 right-4 bg-xp-purple text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
              Default Grade
            </span>
          )}

          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-xp-purple to-violet-500 flex items-center justify-center text-white mb-6 shadow-sm group-hover:scale-105 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>

            <h3 className="font-display font-black text-2xl text-math-text">
              Class 9 Mathematics
            </h3>
            <p className="text-math-text-muted text-sm mt-2 leading-relaxed">
              "Build Your Foundation." Master real numbers, algebraic operations, Cartesian plotting, triangles, and geometry rules.
            </p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {["Number Systems", "Algebra", "Mensuration", "Geometry"].map((topic, i) => (
                <span key={i} className="text-[10px] font-bold text-math-text-muted bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-math-border/50">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-math-border flex items-center justify-between text-xs font-bold">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-math-text-muted text-[10px] uppercase font-semibold">Completions</span>
                <span className="text-math-text">{stats9.completedCount} / {stats9.totalChapters} Ch</span>
              </div>
              <div className="flex flex-col">
                <span className="text-math-text-muted text-[10px] uppercase font-semibold">Avg Accuracy</span>
                <span className="text-math-text">{stats9.averageAccuracy}%</span>
              </div>
            </div>
            <span className="text-xp-purple group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
              Select Chapters
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* CLASS 10 CARD */}
        <div 
          onClick={() => handleSelectClass(10)}
          className={`bg-math-card border rounded-3xl p-8 hover:-translate-y-1 hover:shadow-lg hover:border-xp-purple/30 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
            user.class === 10 ? "border-xp-purple/40 shadow-sm" : "border-math-border shadow-sm"
          }`}
        >
          {user.class === 10 && (
            <span className="absolute top-4 right-4 bg-xp-purple text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
              Default Grade
            </span>
          )}

          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-xp-purple to-violet-500 flex items-center justify-center text-white mb-6 shadow-sm group-hover:scale-105 transition-transform">
              <Award className="w-7 h-7" />
            </div>

            <h3 className="font-display font-black text-2xl text-math-text">
              Class 10 Mathematics
            </h3>
            <p className="text-math-text-muted text-sm mt-2 leading-relaxed">
              "Master Your Maths." Dive deep into trigonometry ratios, quadratic roots, AP series, section formula, and solid shapes.
            </p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {["Real Numbers", "Trigonometry", "AP Series", "Coordinate Geometry"].map((topic, i) => (
                <span key={i} className="text-[10px] font-bold text-math-text-muted bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-math-border/50">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-math-border flex items-center justify-between text-xs font-bold">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-math-text-muted text-[10px] uppercase font-semibold">Completions</span>
                <span className="text-math-text">{stats10.completedCount} / {stats10.totalChapters} Ch</span>
              </div>
              <div className="flex flex-col">
                <span className="text-math-text-muted text-[10px] uppercase font-semibold">Avg Accuracy</span>
                <span className="text-math-text">{stats10.averageAccuracy}%</span>
              </div>
            </div>
            <span className="text-xp-purple group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
              Select Chapters
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-math-border text-xs text-math-text-muted leading-relaxed max-w-3xl flex items-start gap-3">
        <Target className="w-5 h-5 text-xp-purple shrink-0" />
        <div>
          <span className="font-bold block text-math-text mb-1">Curriculum Notice</span>
          MathQuest standardizes chapters on the national NCERT blueprint. If you are preparing for alternate school boards (such as ICSE), these chapters still map perfectly to your base mathematical foundations.
        </div>
      </div>
    </div>
  );
};
