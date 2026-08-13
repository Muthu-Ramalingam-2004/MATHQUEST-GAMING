import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { ArrowLeft, Play, Lock, Info, Star, Dumbbell, Trophy } from "lucide-react";
import { useGame } from "../context/GameContext";
import { chaptersData } from "../data/chaptersData";
import { questionService } from "../services/questionService";

const DynamicIcon = ({ name, className }) => {
  const IconComponent = Icons[name] || Icons.BookOpen;
  return <IconComponent className={className} />;
};

export const ChapterSelection = () => {
  const { user, startNewGame, showToast } = useGame();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const classId = Number(searchParams.get("class") || user?.class || 10);
  const activeMode = searchParams.get("mode") || "practice";
  const [instructionModal, setInstructionModal] = useState(null);

  if (!user) return null;

  const chapters = chaptersData[classId] || [];

  const getLockLevel = (chapterId) => {
    switch (chapterId) {
      case "coord-geom-9": return 2;
      case "geometry-9": return 3;
      case "mensuration-9": return 4;
      case "stats-prob-9": return 4;
      case "trig-10": return 2;
      case "coord-geom-10": return 3;
      case "geometry-10": return 4;
      case "mensuration-10": return 5;
      case "stats-prob-10": return 5;
      default: return 1;
    }
  };

  const getModeDetails = (mode) => {
    switch (mode) {
      case "quick-quiz":
        return {
          title: "Quick Quiz",
          icon: <Icons.Zap className="w-5 h-5 text-xp-purple fill-current" />,
          rules: [
            "You have exactly 15 seconds to solve each question.",
            "Choose carefully: incorrect or timed-out answers deduct 1 Heart/Life.",
            "Game ends if you solve all 5 questions or lose all 3 Hearts."
          ],
          rewardText: "Gain 20 XP + 5 Coins per correct answer!"
        };
      case "math-run":
        return {
          title: "Math Run",
          icon: <Icons.Play className="w-5 h-5 text-coral fill-current" />,
          rules: [
            "Your avatar starts on a visual path to reach the checkpoint.",
            "Correct answers advance your avatar forward.",
            "Incorrect answers cost 1 heart and trigger a stumble animation.",
            "Goal is to reach the checkpoint with hearts remaining."
          ],
          rewardText: "Gain 25 XP + 5 Coins per milestone!"
        };
      case "math-puzzle":
        return {
          title: "Math Puzzle",
          icon: <Icons.Brain className="w-5 h-5 text-mint" />,
          rules: [
            "Deduce missing symbols, grid values, or sequence numbers.",
            "Take your time, no timer countdown.",
            "Solve 3 puzzles to clear the level.",
            "Infinite lives, making errors is safe."
          ],
          rewardText: "Gain 30 XP + 5 Coins per solved puzzle!"
        };
      case "challenge":
        return {
          title: "Challenge Mode",
          icon: <Trophy className="w-5 h-5 text-coral" />,
          rules: [
            "High difficulty algebra, geometry or coordinate proofs.",
            "Direct numerical keyboard entry (no MCQ options).",
            "40-second timer per question. Zero hints available.",
            "Deducts 1 heart on incorrect attempts. Double XP rewards!"
          ],
          rewardText: "Gain 40+ XP + 10 Coins per correct challenge!"
        };
      case "practice":
      default:
        return {
          title: "Practice Sandbox",
          icon: <Dumbbell className="w-5 h-5 text-xp-purple" />,
          rules: [
            "Stress-free environment. Infinite lives/hearts.",
            "Unlimited questions from the chapter.",
            "Hints and step-by-step explanations are instantly available.",
            "Perfect for understanding core formulas."
          ],
          rewardText: "Gain 10 XP per question solved!"
        };
    }
  };

  const modeDetails = getModeDetails(activeMode);

  const handleLaunchGame = (chapter) => {
    const lockLevel = getLockLevel(chapter.id);
    if (user.level < lockLevel) {
      showToast(`This chapter is locked! Reach Level ${lockLevel} to unlock.`, "warning");
      return;
    }
    setInstructionModal(chapter);
  };

  const executeLaunch = async () => {
    if (!instructionModal) return;
    const started = await startNewGame(classId, instructionModal.id, activeMode);
    if (started) {
      setInstructionModal(null);
      navigate("/game");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-math-border pb-6">
        <div className="flex items-start gap-4">
          <Link
            to={`/class-select?mode=${activeMode}`}
            className="p-2.5 rounded-xl bg-math-card border border-math-border hover:bg-slate-50 text-math-text-muted transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-math-text-muted uppercase tracking-widest">
                Class {classId} Syllabus
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-355"></span>
              <span className="text-xs font-bold text-xp-purple uppercase tracking-widest flex items-center gap-1">
                {modeDetails.title} Mode
              </span>
            </div>
            
            <h2 className="font-display font-black text-3xl text-math-text mt-1.5">
              Select a Topic Chapter
            </h2>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-math-card text-xs font-bold text-math-text border border-math-border">
            Cohort Level {user.level}
          </span>
        </div>
      </div>

      {/* ROADMAP GRID LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => {
          const lockLevel = getLockLevel(chapter.id);
          const isLocked = user.level < lockLevel;
          const completedStats = user.completedChapters?.[chapter.id];
          
          return (
            <div 
              key={chapter.id}
              onClick={() => handleLaunchGame(chapter)}
              className={`bg-math-card border rounded-3xl p-6 transition-all duration-300 shadow-sm flex flex-col justify-between relative group ${
                isLocked 
                  ? "border-math-border/50 opacity-55 cursor-not-allowed select-none" 
                  : "border-math-border hover:-translate-y-0.5 hover:shadow-md hover:border-xp-purple/30 cursor-pointer"
              }`}
            >
              
              {/* LOCK BANNER */}
              {isLocked && (
                <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/10 backdrop-blur-[1px] rounded-3xl flex flex-col items-center justify-center z-10">
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg border border-slate-700">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold text-math-text mt-2 bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-math-border shadow-sm">
                    Unlocks at Level {lockLevel}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${chapter.color} flex items-center justify-center text-white shadow-sm`}>
                    <DynamicIcon name={chapter.icon} className="w-5 h-5" />
                  </div>
                  
                  {/* Completion Stars */}
                  {!isLocked && completedStats && (
                    <div className="flex gap-0.5 text-amber-450">
                      <Star className="w-4 h-4 fill-current" />
                      {completedStats.accuracy >= 80 && <Star className="w-4 h-4 fill-current" />}
                      {completedStats.accuracy === 100 && <Star className="w-4 h-4 fill-current" />}
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-base text-math-text group-hover:text-xp-purple transition-colors">
                  {chapter.name}
                </h3>
                <p className="text-xs text-math-text-muted mt-1.5 leading-relaxed">
                  {chapter.description}
                </p>
              </div>

              {/* Progress metrics */}
              <div className="mt-6 pt-4 border-t border-math-border flex items-center justify-between text-[11px] font-bold text-math-text-muted">
                <span>XP Pool: {chapter.xpReward} XP</span>
                {!isLocked && completedStats ? (
                  <span className="text-mint font-bold">
                    Solved {completedStats.completedQuestions} • {completedStats.accuracy}% Accuracy
                  </span>
                ) : (
                  <span className="text-math-text-muted group-hover:text-xp-purple transition-colors flex items-center gap-1">
                    Start
                    <Play className="w-3.5 h-3.5 fill-current text-xp-purple" />
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* --- INSTRUCTIONS MODAL --- */}
      {instructionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-math-card border border-math-border rounded-3xl overflow-hidden shadow-xl p-6 md:p-8 animate-scale-up space-y-6">
            
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-math-border pb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xp-purple">
                {modeDetails.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold text-math-text-muted uppercase tracking-widest">
                  Level Instructions
                </span>
                <h3 className="font-display font-black text-xl text-math-text">
                  {instructionModal.name} ({modeDetails.title})
                </h3>
              </div>
            </div>

            {/* Rules list */}
            <div className="space-y-3.5 py-2">
              {modeDetails.rules.map((rule, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-relaxed text-math-text-muted font-semibold">
                  <div className="w-5 h-5 rounded-full bg-purple-500/10 text-xp-purple font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <p>{rule}</p>
                </div>
              ))}
            </div>

            {/* Rewards Callout */}
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs font-bold text-xp-purple flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 text-purple-500" />
              <div>
                <span className="block mb-0.5">Stakes & Rewards</span>
                {modeDetails.rewardText}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-4 border-t border-math-border pt-6">
              <button
                onClick={() => setInstructionModal(null)}
                className="flex-1 py-3 rounded-2xl border border-math-border hover:bg-slate-50 font-bold text-sm text-math-text-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeLaunch}
                className="flex-1 py-3 rounded-2xl bg-xp-purple hover:bg-xp-purple-dark text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                Start Game
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
