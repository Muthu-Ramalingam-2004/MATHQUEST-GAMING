import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  HelpCircle, 
  Sparkles, 
  AlertCircle, 
  Check, 
  X, 
  ArrowRight,
  Flame,
  Zap,
  RotateCcw,
  Volume2,
  ChevronRight,
  Home
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { chaptersData } from "../data/chaptersData";
import { Avatar } from "../components/Avatar";

export const Gameplay = () => {
  const { 
    user, 
    gameSession, 
    submitAnswer, 
    nextQuestion, 
    forceQuitGame, 
    showToast 
  } = useGame();
  
  const navigate = useNavigate();

  // States
  const [selectedOption, setSelectedOption] = useState(null);
  const [numericValue, setNumericValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [showingHint, setShowingHint] = useState(false);
  const [sessionResults, setSessionResults] = useState(null);
  
  // Feedback states
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Redirect if no game active
  useEffect(() => {
    if (!gameSession) {
      navigate("/dashboard");
    } else if (gameSession.questions && gameSession.questions.length > 0 && gameSession.questions[gameSession.currentIndex]) {
      const currentQ = gameSession.questions[gameSession.currentIndex];
      const limit = currentQ?.timeLimit || currentQ?.time_limit || 30;
      setTimeLeft(gameSession.mode === "practice" || gameSession.mode === "math-puzzle" ? 99999 : limit);
      startTimeRef.current = Date.now();
      
      setSelectedOption(null);
      setNumericValue("");
      setShowingHint(false);
      setIsAnswered(false);
      setFeedback(null);
    }
  }, [gameSession?.currentIndex, gameSession]);

  // Timer loop
  useEffect(() => {
    if (!gameSession || isAnswered) return;
    if (gameSession.mode === "practice" || gameSession.mode === "math-puzzle") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameSession?.currentIndex, isAnswered]);

  // Safely handle missing gameSession or questions
  if (!gameSession || !gameSession.questions || gameSession.questions.length === 0 || !gameSession.questions[gameSession.currentIndex]) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-math-card border border-math-border rounded-3xl text-center space-y-6 shadow-sm animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display font-black text-xl text-math-text">No Questions Found</h3>
          <p className="text-xs text-math-text-muted font-semibold leading-relaxed">
            We couldn't load any questions for this topic chapter right now. Please select another topic chapter or try again.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate("/chapters")}
            className="flex-1 py-3 rounded-2xl bg-xp-purple hover:bg-xp-purple-dark text-white font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Syllabus
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = gameSession.questions[gameSession.currentIndex];
  const questionCount = gameSession.questions.length;
  const progressPercent = Math.floor((gameSession.currentIndex / questionCount) * 100);

  const getOptions = (question) => {
    if (!question || question.options === null || question.options === undefined) return [];
    if (Array.isArray(question.options)) return question.options;
    if (typeof question.options === "string") {
      try {
        const parsed = JSON.parse(question.options);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const currentOptions = getOptions(currentQuestion);

  const handleTimeOut = async () => {
    setIsAnswered(true);
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const result = await submitAnswer(null, true, timeSpent);
    setFeedback({
      isCorrect: false,
      correctAnswer: result.correctAnswer,
      explanation: result.explanation,
      xpReward: 0,
      coinsReward: 0,
      isTimedOut: true
    });
  };

  const handleAnswerSubmit = async (value) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    clearInterval(timerRef.current);

    const answer = value !== undefined ? value : (currentQuestion.type === "numerical" ? numericValue : selectedOption);
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    const result = await submitAnswer(answer, false, timeSpent);
    setFeedback({
      isCorrect: result.isCorrect,
      correctAnswer: result.correctAnswer,
      explanation: result.explanation,
      xpReward: result.xpReward,
      coinsReward: result.coinsReward,
      isTimedOut: false
    });
  };

  const handleNext = () => {
    const results = nextQuestion();
    if (typeof results === "object" && results !== null) {
      setSessionResults(results);
      localStorage.setItem("last_session_result", JSON.stringify(results));
      navigate("/results");
    }
  };

  const handleAbort = () => {
    if (window.confirm("Are you sure you want to quit? You will lose XP progress for this session.")) {
      forceQuitGame();
      navigate("/dashboard");
    }
  };

  const handleKeypadPress = (key) => {
    if (isAnswered) return;
    if (key === "backspace") {
      setNumericValue(prev => prev.slice(0, -1));
    } else if (key === "-") {
      setNumericValue(prev => prev.startsWith("-") ? prev.slice(1) : "-" + prev);
    } else if (key === ".") {
      if (!numericValue.includes(".")) {
        setNumericValue(prev => prev + ".");
      }
    } else {
      setNumericValue(prev => prev + key);
    }
  };

  const getChapterName = () => {
    if (!gameSession?.chapterId) return "MathQuest Lesson";
    const classVal = gameSession?.class || user?.class || user?.class_grade || 9;
    const chapters = chaptersData[classVal] || chaptersData[9] || chaptersData[10] || [];
    const found = chapters.find(c => c.id === gameSession.chapterId);
    return found?.name || "MathQuest Lesson";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative pb-10">
      
      {/* --- TOP HUD CONSOLE --- */}
      <section className="bg-math-card border border-math-border rounded-3xl p-5 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAbort}
              className="text-xs font-bold text-math-text-muted hover:text-rose-500 cursor-pointer flex items-center gap-1"
            >
              <Home className="w-4 h-4" /> Quit
            </button>
            <span className="w-1.5 h-1.5 rounded-full bg-math-border"></span>
            <span className="text-xs font-bold text-math-text-muted animate-pulse-slow">
              {getChapterName()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-xp-purple flex items-center gap-0.5">
              <Zap className="w-3.5 h-3.5 fill-current" />
              +{gameSession.xpEarned} XP
            </span>
            
            {gameSession.maxLives < 99 && (
              <div className="flex items-center gap-0.5">
                {[1, 2, 3].map((heartIndex) => {
                  const isActive = heartIndex <= gameSession.lives;
                  return (
                    <Heart 
                      key={heartIndex} 
                      className={`w-5 h-5 ${isActive ? "text-heart-red fill-current animate-wiggle" : "text-slate-200 dark:text-slate-800"}`}
                      style={{ animationDelay: `${heartIndex * 0.1}s` }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ProgressBar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-extrabold text-math-text-muted uppercase tracking-wider">
            <span>Progress: {gameSession.currentIndex + 1} / {questionCount}</span>
            {gameSession.mode !== "practice" && gameSession.mode !== "math-puzzle" && (
              <span className={timeLeft <= 5 ? "text-rose-500 animate-pulse" : ""}>
                Timer: {timeLeft}s
              </span>
            )}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-xp-purple to-violet-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent + (100 / questionCount)}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* --- MATH RUN TRACK VISUALIZER --- */}
      {gameSession.mode === "math-run" && (
        <section className="bg-slate-50 dark:bg-slate-900 border border-math-border rounded-3xl p-4 shadow-inner flex items-center justify-between overflow-x-auto">
          <span className="text-[10px] font-black text-coral uppercase tracking-widest block pr-2">
            Path:
          </span>
          <div className="flex-1 flex items-center justify-around px-4 relative">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-math-border"></div>

            {gameSession.questions.map((_, idx) => {
              const isActive = gameSession.currentIndex === idx;
              const isPassed = gameSession.currentIndex > idx;
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-500 ${
                      isActive 
                        ? "bg-coral border-orange-200 text-white scale-125 shadow-neon-orange" 
                        : isPassed 
                        ? "bg-white border-coral text-coral" 
                        : "bg-slate-100 dark:bg-slate-850 border-math-border text-math-text-muted"
                    }`}
                  >
                    {isActive ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Avatar name={user?.avatar || "bear"} className="w-full h-full" />
                      </div>
                    ) : (
                      idx + 1
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* --- CENTRAL CONSOLE: THE MATHEMATICS QUESTION CARD --- */}
      <section className="bg-math-card border border-math-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6 transition-colors">
        
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-math-border text-[10px] font-bold uppercase tracking-wider text-math-text-muted">
            Difficulty: {currentQuestion.difficulty || "Medium"}
          </span>
          
          {gameSession.mode === "math-puzzle" && (
            <span className="text-mint font-bold text-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Stage Puzzle
            </span>
          )}
        </div>

        {/* Question Text */}
        <div className="py-4 text-center md:px-10">
          <h3 className="font-display font-bold text-xl md:text-2xl leading-relaxed text-math-text">
            {currentQuestion.question}
          </h3>
        </div>

        {/* OPTIONS CONTAINER */}
        <div className="py-2">
          {(currentQuestion.type === "mcq" || currentQuestion.type === "boolean") && (
            <div className="grid md:grid-cols-2 gap-4">
              {currentOptions.map((option, idx) => {
                const isSelected = selectedOption === String(idx);
                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => setSelectedOption(String(idx))}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                      isAnswered
                        ? isSelected
                          ? "border-math-border bg-slate-50 dark:bg-slate-900"
                          : "border-math-border opacity-50"
                        : isSelected
                        ? "border-xp-purple bg-purple-500/5 text-xp-purple scale-[1.01]"
                        : "border-math-border hover:border-xp-purple/50 hover:bg-purple-500/5 text-math-text"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                      isSelected 
                        ? "bg-xp-purple border-xp-purple text-white" 
                        : "bg-slate-50 dark:bg-slate-900 border-math-border text-math-text-muted"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Numerical Input with Keypad */}
          {currentQuestion.type === "numerical" && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  disabled={isAnswered}
                  value={numericValue}
                  placeholder="Tap keys to write answer..."
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border-2 border-math-border rounded-2xl py-4 px-6 text-center font-display font-black text-2xl text-math-text placeholder-slate-400 focus:outline-none focus:border-xp-purple transition-colors shadow-inner animate-pulse-slow"
                />
                {numericValue && !isAnswered && (
                  <button 
                    onClick={() => setNumericValue("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-math-text-muted cursor-pointer font-bold text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* TOUCH KEYPAD */}
              {!isAnswered && (
                <div className="grid grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-math-border">
                  {["1", "2", "3", "backspace", "4", "5", "6", "-", "7", "8", "9", ".", "0"].map((key) => {
                    const isBack = key === "backspace";
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleKeypadPress(key)}
                        className={`py-3.5 rounded-xl font-bold text-sm transition-all duration-150 cursor-pointer active:scale-95 flex items-center justify-center ${
                          isBack 
                            ? "bg-rose-500/10 hover:bg-rose-500/20 text-heart-red" 
                            : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-math-border text-math-text"
                        }`}
                        style={{ gridColumn: key === "0" ? "span 2" : "auto" }}
                      >
                        {isBack ? "⌫" : key}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        {!isAnswered && (
          <div className="flex gap-4 border-t border-math-border pt-6">
            {gameSession.mode !== "challenge" && (
              <button
                onClick={() => setShowingHint(!showingHint)}
                className={`px-5 py-3 rounded-2xl border border-math-border hover:bg-slate-50 font-bold text-sm text-math-text-muted transition-colors cursor-pointer flex items-center gap-1.5`}
              >
                <HelpCircle className="w-4 h-4 text-xp-purple" />
                {showingHint ? "Hide Hint" : "Get Hint"}
              </button>
            )}

            <button
              onClick={() => handleAnswerSubmit()}
              disabled={currentQuestion.type === "numerical" ? !numericValue : selectedOption === null}
              className="flex-1 py-4 rounded-2xl bg-xp-purple hover:bg-xp-purple-dark disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              Submit Answer
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* HINT DIALOG POPUP */}
        {showingHint && !isAnswered && (
          <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-xs font-semibold text-math-text-muted leading-relaxed flex items-start gap-2.5 animate-scale-up">
            <Sparkles className="w-5 h-5 text-xp-purple shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-xp-purple mb-1">Concept Hint</span>
              {currentQuestion.hint || "Think carefully about the core formulas for this topic."}
            </div>
          </div>
        )}
      </section>

      {/* --- ANSWER FEEDBACK POPUP DIALOG --- */}
      {isAnswered && feedback && (
        <section className={`rounded-3xl p-6 md:p-8 border-2 shadow-sm animate-scale-up space-y-4 ${
          feedback.isCorrect
            ? "bg-emerald-50 border-emerald-250 dark:bg-emerald-950/20 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200"
            : "bg-rose-50 border-rose-250 dark:bg-rose-950/20 dark:border-rose-900/40 text-rose-800 dark:text-rose-200"
        }`}>
          <div className="flex items-center justify-between border-b border-current/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                feedback.isCorrect ? "bg-mint" : "bg-heart-red"
              }`}>
                {feedback.isCorrect ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4 stroke-[3]" />}
              </div>
              <h4 className="font-display font-black text-lg">
                {feedback.isCorrect 
                  ? "Correct! Brilliant Math!" 
                  : feedback.isTimedOut ? "Time is Up!" : "Incorrect Attempt"
                }
              </h4>
            </div>

            <div className="flex gap-2">
              {feedback.isCorrect && (
                <>
                  <span className="px-2.5 py-1 rounded bg-emerald-55/15 font-bold text-xs text-mint">
                    +{feedback.xpReward} XP
                  </span>
                  <span className="px-2.5 py-1 rounded bg-amber-55/15 font-bold text-xs text-coral">
                    +{feedback.coinsReward} Coins
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="text-xs font-semibold leading-relaxed space-y-3">
            {!feedback.isCorrect && (
              <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <span className="font-extrabold uppercase block text-[9px] tracking-wider text-heart-red mb-0.5">Correct Solution:</span>
                <span className="font-bold text-sm text-math-text">
                  {currentQuestion.type === "mcq" || currentQuestion.type === "boolean"
                    ? currentOptions[Number(feedback.correctAnswer)] || feedback.correctAnswer
                    : feedback.correctAnswer
                  }
                </span>
              </div>
            )}

            <div>
              <span className="font-extrabold uppercase block text-[9px] tracking-wider text-math-text-muted mb-1">Step-by-step Explanation:</span>
              <p className="text-math-text-muted font-semibold">
                {feedback.explanation || "Review the formula to solve similar questions next time."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleNext}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                feedback.isCorrect 
                  ? "bg-mint hover:bg-emerald-600 shadow-emerald-500/10" 
                  : "bg-heart-red hover:bg-red-650 shadow-rose-500/10"
              }`}
            >
              <span>{gameSession.currentIndex + 1 >= questionCount ? "Finish Level" : "Continue"}</span>
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </section>
      )}

    </div>
  );
};
