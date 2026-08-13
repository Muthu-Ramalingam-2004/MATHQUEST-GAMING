import React, { useState, useEffect } from "react";
import { Plus, Trash, Edit, RefreshCw, Filter, BookOpen, AlertTriangle } from "lucide-react";
import { useGame } from "../context/GameContext";
import { gameService } from "../services/gameService";
import { questionService } from "../services/questionService";
import { chaptersData } from "../data/chaptersData";

export const AdminDashboard = () => {
  const { showToast, offlineMode } = useGame();
  const [questions, setQuestions] = useState([]);
  const [filterClass, setFilterClass] = useState(10);
  const [filterChapter, setFilterChapter] = useState("all");
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formClass, setFormClass] = useState(10);
  const [formChapter, setFormChapter] = useState("");
  const [formType, setFormType] = useState("mcq"); // 'mcq' | 'numerical' | 'boolean'
  const [formDifficulty, setFormDifficulty] = useState("Medium");
  const [formQuestion, setFormQuestion] = useState("");
  const [formOptions, setFormOptions] = useState(["", "", "", ""]);
  const [formCorrectAnswer, setFormCorrectAnswer] = useState("");
  const [formExplanation, setFormExplanation] = useState("");
  const [formHint, setFormHint] = useState("");
  const [formXp, setFormXp] = useState(30);
  const [formTimeLimit, setFormTimeLimit] = useState(30);

  // Sync questions from service
  const fetchQuestions = async () => {
    if (offlineMode) {
      setQuestions(questionService.getAllQuestions());
    } else {
      try {
        const result = await gameService.getQuestions(filterClass);
        setQuestions(result);
      } catch (err) {
        setQuestions(questionService.getAllQuestions());
      }
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filterClass, offlineMode]);

  const activeClassChapters = chaptersData[formClass] || [];

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormClass(10);
    setFormChapter(chaptersData[10][0].id);
    setFormType("mcq");
    setFormDifficulty("Medium");
    setFormQuestion("");
    setFormOptions(["", "", "", ""]);
    setFormCorrectAnswer("0");
    setFormExplanation("");
    setFormHint("");
    setFormXp(30);
    setFormTimeLimit(30);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditingId(q.id);
    setFormClass(q.class_grade || q.class || 10);
    setFormChapter(q.chapter_id || q.chapterId);
    setFormType(q.type);
    setFormDifficulty(q.difficulty);
    setFormQuestion(q.question);
    
    if (q.type === "mcq" && q.options) {
      setFormOptions(q.options);
      setFormCorrectAnswer(q.correct_answer || q.correctAnswer);
    } else if (q.type === "boolean" && q.options) {
      setFormOptions(q.options);
      setFormCorrectAnswer(q.correct_answer || q.correctAnswer);
    } else {
      setFormOptions(["", "", "", ""]);
      setFormCorrectAnswer(q.correct_answer || q.correctAnswer);
    }

    setFormExplanation(q.explanation);
    setFormHint(q.hint || "");
    setFormXp(q.xp_reward || q.xpReward || 30);
    setFormTimeLimit(q.time_limit || q.timeLimit || 30);
    setIsFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formQuestion.trim() || !formCorrectAnswer.trim() || !formExplanation.trim()) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    let finalOptions = null;
    if (formType === "mcq") {
      if (formOptions.some(opt => !opt.trim())) {
        showToast("Please fill in all MCQ options", "warning");
        return;
      }
      finalOptions = formOptions;
    } else if (formType === "boolean") {
      finalOptions = ["True", "False"];
    }

    const payload = {
      classGrade: Number(formClass),
      chapterId: formChapter,
      type: formType,
      difficulty: formDifficulty,
      question: formQuestion,
      options: finalOptions,
      correctAnswer: formCorrectAnswer,
      explanation: formExplanation,
      hint: formHint,
      xpReward: Number(formXp),
      timeLimit: Number(formTimeLimit)
    };

    if (offlineMode) {
      if (editingId) {
        questionService.updateQuestion({ ...payload, id: editingId, class: formClass });
        showToast("Question updated (Offline)!", "success");
      } else {
        questionService.addQuestion({ ...payload, class: formClass });
        showToast("Question created (Offline)!", "success");
      }
    } else {
      try {
        if (editingId) {
          await gameService.adminUpdateQuestion(editingId, payload);
          showToast("Question updated on backend!", "success");
        } else {
          await gameService.adminCreateQuestion(payload);
          showToast("Question added to backend bank!", "success");
        }
      } catch (err) {
        showToast(err.message || "Failed to save question.", "error");
      }
    }

    setIsFormOpen(false);
    fetchQuestions();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      if (offlineMode) {
        questionService.deleteQuestion(id);
        showToast("Question deleted locally", "info");
      } else {
        try {
          await gameService.adminDeleteQuestion(id);
          showToast("Question deleted from backend bank", "info");
        } catch (err) {
          showToast("Failed to delete question.", "error");
        }
      }
      fetchQuestions();
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm("Restore default questions? This will clear custom additions.")) {
      if (offlineMode) {
        questionService.resetToDefault();
      } else {
        showToast("Defaults restore only supported in Offline mode.", "warning");
        return;
      }
      fetchQuestions();
      showToast("Question bank restored to defaults.", "info");
    }
  };

  const filteredQuestions = questions.filter(q => {
    const qChapter = q.chapter_id || q.chapterId;
    return filterChapter === "all" || qChapter === filterChapter;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* TITLE BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-3xl text-math-text">
            Curriculum Question Bank
          </h2>
          <p className="text-sm text-math-text-muted mt-1 font-semibold">
            Teacher workspace to create and edit curriculum database entries.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl border border-math-border hover:bg-slate-50 font-bold text-xs text-math-text-muted cursor-pointer flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Restore Defaults
          </button>
          
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-xp-purple hover:bg-xp-purple-dark text-white font-bold text-xs cursor-pointer shadow-sm flex items-center gap-1.5 transition-transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>
      </div>

      {/* FILTER SEARCH TOOLBAR */}
      <section className="bg-math-card border border-math-border rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-center gap-4 transition-colors">
        <div className="flex items-center gap-2 text-xs font-extrabold text-math-text-muted uppercase w-full md:w-auto">
          <Filter className="w-4 h-4 text-xp-purple" />
          <span>Filters:</span>
        </div>

        <select
          value={filterClass}
          onChange={(e) => {
            setFilterClass(Number(e.target.value));
            setFilterChapter("all");
          }}
          className="bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2.5 px-4 text-xs font-bold text-math-text w-full md:w-44 focus:outline-none cursor-pointer"
        >
          <option value={9}>Class 9 Syllabus</option>
          <option value={10}>Class 10 Syllabus</option>
        </select>

        <select
          value={filterChapter}
          onChange={(e) => setFilterChapter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2.5 px-4 text-xs font-bold text-math-text w-full md:w-56 focus:outline-none cursor-pointer"
        >
          <option value="all">All Chapters</option>
          {chaptersData[filterClass]?.map(ch => (
            <option key={ch.id} value={ch.id}>{ch.name}</option>
          ))}
        </select>

        <span className="text-xs text-math-text-muted font-bold ml-auto hidden md:block">
          Found {filteredQuestions.length} Questions
        </span>
      </section>

      {/* QUESTIONS DATA TABLE */}
      <section className="bg-math-card border border-math-border rounded-3xl overflow-hidden shadow-sm transition-colors">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center text-math-text-muted space-y-2">
            <BookOpen className="w-12 h-12 mx-auto stroke-slate-300" />
            <p className="font-bold text-sm">No Questions Seeded</p>
            <p className="text-xs">Select another chapter filter or click "Add Question".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-math-border font-extrabold text-math-text-muted uppercase tracking-wider">
                  <th className="py-4 px-6">Question Text</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Difficulty</th>
                  <th className="py-4 px-6">XP / Timer</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-math-border">
                {filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors font-semibold">
                    <td className="py-4 px-6 max-w-sm truncate text-math-text font-bold">
                      {q.question}
                    </td>
                    <td className="py-4 px-6 capitalize text-math-text-muted">
                      {q.type === "mcq" ? "MCQ" : q.type === "boolean" ? "True/False" : "Numerical"}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.difficulty === "Easy" 
                          ? "bg-emerald-500/10 text-mint" 
                          : q.difficulty === "Hard" 
                          ? "bg-rose-500/10 text-heart-red" 
                          : "bg-amber-500/10 text-coral"
                      }`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-math-text-muted">
                      {(q.xp_reward || q.xpReward)} XP • {(q.time_limit || q.timeLimit)}s
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(q)}
                          className="p-1.5 rounded-lg border border-math-border hover:bg-slate-100 text-math-text-muted cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-950/20 hover:bg-rose-50 text-heart-red cursor-pointer"
                          title="Delete"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* --- ADD / EDIT DRAWER OVERLAY --- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="w-full max-w-lg bg-math-card h-screen p-6 md:p-8 shadow-2xl flex flex-col justify-between border-l border-math-border overflow-y-auto transition-colors">
            
            <form onSubmit={handleSave} className="space-y-6 flex-1 pb-8 font-bold">
              <div className="border-b border-math-border pb-4 flex justify-between items-center">
                <h3 className="font-display font-black text-xl text-math-text">
                  {editingId ? "Edit Curriculum Question" : "Create Curriculum Question"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs font-bold text-math-text-muted hover:text-math-text cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Class & Chapter */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-math-text-muted uppercase mb-2">Class Grade</label>
                  <select
                    value={formClass}
                    onChange={(e) => {
                      const c = Number(e.target.value);
                      setFormClass(c);
                      setFormChapter(chaptersData[c][0].id);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2.5 px-3 text-xs font-bold text-math-text"
                  >
                    <option value={9}>Class 9</option>
                    <option value={10}>Class 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-math-text-muted uppercase mb-2">Chapter Topic</label>
                  <select
                    value={formChapter}
                    onChange={(e) => setFormChapter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2.5 px-3 text-xs font-bold text-math-text"
                  >
                    {activeClassChapters.map(ch => (
                      <option key={ch.id} value={ch.id}>{ch.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Difficulty & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-math-text-muted uppercase mb-2">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2.5 px-3 text-xs font-bold text-math-text"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-math-text-muted uppercase mb-2">Input Mode Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2.5 px-3 text-xs font-bold text-math-text"
                  >
                    <option value="mcq">MCQ (Multiple Choice)</option>
                    <option value="numerical">Numerical Input</option>
                    <option value="boolean">True/False</option>
                  </select>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-[10px] font-bold text-math-text-muted uppercase mb-2">Question Text</label>
                <textarea
                  required
                  rows={2}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. Find the value of x in 2x - 4 = 10."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2 px-3 text-xs text-math-text focus:outline-none"
                />
              </div>

              {/* MCQ Choices */}
              {formType === "mcq" && (
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-math-text-muted uppercase">MCQ Choices</label>
                  {formOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-math-text-muted w-4">{String.fromCharCode(65 + idx)}</span>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => {
                          const updated = [...formOptions];
                          updated[idx] = e.target.value;
                          setFormOptions(updated);
                        }}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2 px-3 text-xs text-math-text"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Correct Answer */}
              <div>
                <label className="block text-[10px] font-bold text-math-text-muted uppercase mb-2">Correct Answer</label>
                {formType === "mcq" && (
                  <select
                    value={formCorrectAnswer}
                    onChange={(e) => setFormCorrectAnswer(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2.5 px-3 text-xs font-bold text-math-text"
                  >
                    <option value="0">A</option>
                    <option value="1">B</option>
                    <option value="2">C</option>
                    <option value="3">D</option>
                  </select>
                )}
                {formType === "boolean" && (
                  <select
                    value={formCorrectAnswer}
                    onChange={(e) => setFormCorrectAnswer(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2.5 px-3 text-xs font-bold text-math-text"
                  >
                    <option value="0">True (Option A)</option>
                    <option value="1">False (Option B)</option>
                  </select>
                )}
                {formType === "numerical" && (
                  <input
                    type="text"
                    required
                    value={formCorrectAnswer}
                    onChange={(e) => setFormCorrectAnswer(e.target.value)}
                    placeholder="Enter correct numerical text answer (e.g. 7 or 1/2)"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2.5 px-3 text-xs text-math-text"
                  />
                )}
              </div>

              {/* Hint & Explanation */}
              <div>
                <label className="block text-[10px] font-bold text-math-text-muted uppercase mb-2">Concept Hint (Optional)</label>
                <input
                  type="text"
                  value={formHint}
                  onChange={(e) => setFormHint(e.target.value)}
                  placeholder="e.g. Isolate the variable x on one side."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2.5 px-3 text-xs text-math-text"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-math-text-muted uppercase mb-2">Step breakdown Explanation</label>
                <textarea
                  required
                  rows={2}
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="e.g. Adding 4 to both sides: 2x = 14. Dividing by 2 yields x = 7."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2 px-3 text-xs text-math-text focus:outline-none"
                />
              </div>

              {/* XP & Time Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-math-text-muted uppercase mb-2">XP Reward</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={formXp}
                    onChange={(e) => setFormXp(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2.5 px-3 text-xs text-math-text"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-math-text-muted uppercase mb-2">Timer limit (s)</label>
                  <input
                    type="number"
                    min={10}
                    max={120}
                    value={formTimeLimit}
                    onChange={(e) => setFormTimeLimit(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-math-border rounded-xl py-2.5 px-3 text-xs text-math-text"
                  />
                </div>
              </div>
            </form>

            <div className="flex gap-4 border-t border-math-border pt-6">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 py-3.5 rounded-xl border border-math-border font-bold text-xs text-math-text-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-3.5 rounded-xl bg-xp-purple text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Save Question
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
