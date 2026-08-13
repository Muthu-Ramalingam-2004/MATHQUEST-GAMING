import React, { useState, useEffect } from "react";
import { Trophy, Award, Search, ArrowUp, Zap } from "lucide-react";
import { useGame } from "../context/GameContext";
import { gameService } from "../services/gameService";
import { storageService } from "../services/storageService";
import { Avatar } from "../components/Avatar";

export const Leaderboard = () => {
  const { user, offlineMode } = useGame();
  const [board, setBoard] = useState([]);
  const [activeTab, setActiveTab] = useState("weekly");

  useEffect(() => {
    const fetchBoard = async () => {
      if (offlineMode) {
        setBoard(storageService.getLeaderboard());
      } else {
        try {
          const data = await gameService.getLeaderboard();
          setBoard(data);
        } catch (err) {
          // Fallback to storage
          setBoard(storageService.getLeaderboard());
        }
      }
    };

    if (user) {
      fetchBoard();
    }
  }, [user, offlineMode]);

  if (!user) return null;

  const getFilteredBoard = () => {
    if (activeTab === "weekly") {
      return board.map(item => ({
        ...item,
        xp: item.isMock ? Math.floor(item.xp * 0.25) : Math.floor(item.xp * 0.3)
      })).sort((a, b) => b.xp - a.xp).map((item, index) => ({ ...item, rank: index + 1 }));
    }
    if (activeTab === "monthly") {
      return board.map(item => ({
        ...item,
        xp: item.isMock ? Math.floor(item.xp * 0.7) : Math.floor(item.xp * 0.8)
      })).sort((a, b) => b.xp - a.xp).map((item, index) => ({ ...item, rank: index + 1 }));
    }
    return board;
  };

  const filteredBoard = getFilteredBoard();

  const myIndex = filteredBoard.findIndex(item => !item.isMock);
  const myRank = myIndex !== -1 ? filteredBoard[myIndex].rank : 99;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-3xl text-math-text">
            Leaderboard Arena
          </h2>
          <p className="text-sm text-math-text-muted mt-1">
            Compete with students globally. Stack XP in any game mode to climb.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-white dark:bg-math-card border border-math-border p-1.5 rounded-2xl shadow-sm">
          {["weekly", "monthly", "all-time"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-bold text-xs capitalize transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? "bg-slate-900 dark:bg-slate-800 text-white shadow-sm"
                  : "text-math-text-muted hover:text-math-text"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* TOP PODIUM */}
      <section className="grid grid-cols-3 gap-4 max-w-xl mx-auto pt-6 pb-2">
        {/* Rank 2 */}
        {filteredBoard[1] && (
          <div className="flex flex-col items-center justify-end text-center pb-4">
            <div className="relative">
              <Avatar name={filteredBoard[1].avatar} className="w-14 h-14 border-4 border-slate-200 dark:border-slate-800" />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center border border-white dark:border-slate-800">
                2
              </span>
            </div>
            <span className="font-bold text-xs mt-3 truncate max-w-full text-math-text block">
              {filteredBoard[1].name}
            </span>
            <span className="text-[10px] text-math-text-muted font-extrabold block">
              {filteredBoard[1].xp} XP
            </span>
          </div>
        )}

        {/* Rank 1 */}
        {filteredBoard[0] && (
          <div className="flex flex-col items-center justify-end text-center pb-8 scale-110">
            <div className="relative">
              <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 text-lg animate-bounce-slow">👑</div>
              <Avatar name={filteredBoard[0].avatar} className="w-18 h-18 border-4 border-amber-300" />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-300 text-amber-950 font-black text-xs flex items-center justify-center border border-white dark:border-slate-800">
                1
              </span>
            </div>
            <span className="font-bold text-xs mt-3 truncate max-w-full text-math-text block">
              {filteredBoard[0].name}
            </span>
            <span className="text-[10px] text-coral font-extrabold block">
              {filteredBoard[0].xp} XP
            </span>
          </div>
        )}

        {/* Rank 3 */}
        {filteredBoard[2] && (
          <div className="flex flex-col items-center justify-end text-center pb-4">
            <div className="relative">
              <Avatar name={filteredBoard[2].avatar} className="w-14 h-14 border-4 border-orange-200" />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-300 text-orange-950 font-black text-xs flex items-center justify-center border border-white dark:border-slate-800">
                3
              </span>
            </div>
            <span className="font-bold text-xs mt-3 truncate max-w-full text-math-text block">
              {filteredBoard[2].name}
            </span>
            <span className="text-[10px] text-math-text-muted font-extrabold block">
              {filteredBoard[2].xp} XP
            </span>
          </div>
        )}
      </section>

      {/* DETAILED LEADERBOARD LIST */}
      <section className="bg-math-card border border-math-border rounded-3xl overflow-hidden shadow-sm transition-colors">
        <div className="divide-y divide-math-border">
          {filteredBoard.map((row) => {
            const isMe = !row.isMock;
            return (
              <div 
                key={row.name} 
                className={`p-4 flex items-center justify-between transition-colors ${
                  isMe 
                    ? "bg-purple-500/5 dark:bg-purple-950/10 border-y border-purple-200/50" 
                    : "hover:bg-slate-50/50 dark:hover:bg-slate-800/10"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className={`w-6 text-center font-black text-sm ${
                    row.rank === 1 ? "text-amber-500" : row.rank === 2 ? "text-slate-400" : row.rank === 3 ? "text-orange-500" : "text-math-text-muted"
                  }`}>
                    #{row.rank}
                  </span>
                  
                  <Avatar name={row.avatar} className="w-8 h-8" />
                  
                  <div className="min-w-0">
                    <span className={`font-bold text-sm block truncate text-math-text ${isMe ? "text-xp-purple dark:text-purple-300 font-extrabold" : ""}`}>
                      {row.name} {isMe && "(You)"}
                    </span>
                    <span className="text-[9px] font-bold text-math-text-muted uppercase tracking-widest block">
                      Level {row.level} Mathlete
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {row.rank <= 3 && (
                    <span className="text-[10px] text-mint font-bold flex items-center gap-0.5">
                      Up
                    </span>
                  )}
                  
                  <span className="font-display font-black text-sm text-math-text">
                    {row.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MY STANDING BANNER */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-math-border text-xs text-math-text-muted leading-relaxed flex items-start gap-3 max-w-3xl">
        <Trophy className="w-5 h-5 text-amber-400 shrink-0 animate-bounce-short" />
        <div>
          <span className="font-bold block text-math-text mb-1">Your Standing Status</span>
          You are placed at **Rank #{myRank}** overall in this cohort. Stack up more XP in **Quick Quiz** or complete **Daily Challenges** to close the gap and secure your top-3 podium standing!
        </div>
      </div>

    </div>
  );
};
