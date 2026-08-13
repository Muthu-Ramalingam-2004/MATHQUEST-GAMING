import React from "react";

const avatars = {
  bear: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#f59e0b" />
      {/* Ears */}
      <circle cx="20" cy="20" r="12" fill="#d97706" />
      <circle cx="80" cy="20" r="12" fill="#d97706" />
      <circle cx="20" cy="20" r="6" fill="#fef3c7" />
      <circle cx="80" cy="20" r="6" fill="#fef3c7" />
      {/* Eyes */}
      <circle cx="38" cy="40" r="4" fill="#0f172a" />
      <circle cx="62" cy="40" r="4" fill="#0f172a" />
      {/* Muzzle */}
      <ellipse cx="50" cy="55" rx="14" ry="10" fill="#fef3c7" />
      <polygon points="50,52 45,47 55,47" fill="#0f172a" />
      {/* Smile */}
      <path d="M 45 56 Q 50 60 55 56" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  wizard: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#6d28d9" />
      {/* Beard */}
      <path d="M 25 55 Q 50 85 75 55 Q 50 65 25 55" fill="#f1f5f9" />
      {/* Face */}
      <circle cx="50" cy="45" r="18" fill="#fed7aa" />
      {/* Hat */}
      <polygon points="50,10 20,40 80,40" fill="#4c1d95" />
      <rect x="18" y="38" width="64" height="4" rx="2" fill="#fbbf24" />
      <polygon points="50,15 48,22 52,22" fill="#fbbf24" />
      {/* Eyes */}
      <circle cx="44" cy="45" r="2.5" fill="#0f172a" />
      <circle cx="56" cy="45" r="2.5" fill="#0f172a" />
      {/* Nose */}
      <circle cx="50" cy="49" r="2.5" fill="#f97316" />
    </svg>
  ),
  robot: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#475569" />
      {/* Head Box */}
      <rect x="25" y="30" width="50" height="40" rx="8" fill="#94a3b8" stroke="#334155" strokeWidth="3" />
      {/* Ears */}
      <rect x="20" y="42" width="5" height="15" rx="2" fill="#cbd5e1" />
      <rect x="75" y="42" width="5" height="15" rx="2" fill="#cbd5e1" />
      {/* Eyes Screen */}
      <rect x="32" y="38" width="36" height="14" rx="4" fill="#0f172a" />
      <circle cx="41" cy="45" r="3.5" fill="#06b6d4" className="animate-pulse" />
      <circle cx="59" cy="45" r="3.5" fill="#06b6d4" className="animate-pulse" />
      {/* Antenna */}
      <line x1="50" y1="30" x2="50" y2="18" stroke="#cbd5e1" strokeWidth="3" />
      <circle cx="50" cy="16" r="4" fill="#ef4444" className="animate-ping" style={{ transformOrigin: "50px 16px" }} />
      <circle cx="50" cy="16" r="4" fill="#ef4444" />
      {/* Mouth */}
      <rect x="40" y="58" width="20" height="4" rx="2" fill="#334155" />
    </svg>
  ),
  astronaut: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#1e1b4b" />
      {/* Suit Collar */}
      <rect x="30" y="70" width="40" height="20" rx="6" fill="#e2e8f0" />
      <rect x="45" y="70" width="10" height="20" fill="#3b82f6" />
      {/* Helmet */}
      <circle cx="50" cy="46" r="26" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      {/* Visor */}
      <ellipse cx="50" cy="44" rx="20" ry="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
      {/* Reflections in Visor */}
      <ellipse cx="44" cy="38" rx="6" ry="3" fill="#ffffff" opacity="0.4" transform="rotate(-15 44 38)" />
      <circle cx="58" cy="48" r="2" fill="#a855f7" opacity="0.6" />
    </svg>
  ),
  cat: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#f97316" />
      {/* Ears */}
      <polygon points="18,35 30,10 44,28" fill="#ea580c" />
      <polygon points="82,35 70,10 56,28" fill="#ea580c" />
      <polygon points="22,32 30,16 40,28" fill="#ffedd5" />
      <polygon points="78,32 70,16 60,28" fill="#ffedd5" />
      {/* Eyes */}
      <ellipse cx="36" cy="45" rx="6" ry="8" fill="#10b981" />
      <ellipse cx="64" cy="45" rx="6" ry="8" fill="#10b981" />
      {/* Pupils */}
      <rect x="35" y="39" width="2" height="12" rx="1" fill="#0f172a" />
      <rect x="63" y="39" width="2" height="12" rx="1" fill="#0f172a" />
      {/* Nose/Muzzle */}
      <polygon points="50,56 46,52 54,52" fill="#fda4af" />
      <path d="M 46 59 Q 50 63 50 59 Q 50 63 54 59" stroke="#9a3412" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Whiskers */}
      <line x1="26" y1="56" x2="10" y2="54" stroke="#ffedd5" strokeWidth="2" />
      <line x1="26" y1="62" x2="8" y2="62" stroke="#ffedd5" strokeWidth="2" />
      <line x1="74" y1="56" x2="90" y2="54" stroke="#ffedd5" strokeWidth="2" />
      <line x1="74" y1="62" x2="92" y2="62" stroke="#ffedd5" strokeWidth="2" />
    </svg>
  ),
  ninja: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#1e293b" />
      {/* Eye Cutout */}
      <rect x="22" y="35" width="56" height="20" rx="10" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
      {/* Eyes */}
      <g transform="translate(0, 0)">
        <polygon points="28,42 38,47 48,43" fill="#0f172a" />
        <circle cx="37" cy="48" r="3" fill="#ef4444" />
        <circle cx="38" cy="47" r="1" fill="#ffffff" />
      </g>
      <g transform="translate(15, 0)">
        <polygon points="47,43 57,47 67,42" fill="#0f172a" />
        <circle cx="57" cy="48" r="3" fill="#ef4444" />
        <circle cx="56" cy="47" r="1" fill="#ffffff" />
      </g>
      {/* Headband Ties */}
      <path d="M 80 45 L 94 40 L 92 48 Z" fill="#0f172a" />
      <path d="M 80 45 L 92 52 L 86 58 Z" fill="#0f172a" />
    </svg>
  ),
  unicorn: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#f472b6" />
      {/* Mane */}
      <path d="M 22 25 Q 35 10 50 25 Q 30 35 22 25" fill="#60a5fa" />
      <path d="M 18 38 Q 28 20 44 32 Q 24 50 18 38" fill="#fbbf24" />
      {/* Head */}
      <path d="M 28 65 C 28 35 70 30 75 50 C 78 58 72 70 60 70 C 45 70 32 75 28 65 Z" fill="#f8fafc" />
      {/* Horn */}
      <polygon points="62,10 52,32 66,28" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      <line x1="58" y1="18" x2="62" y2="24" stroke="#d97706" strokeWidth="1" />
      {/* Eye */}
      <circle cx="55" cy="48" r="3.5" fill="#475569" />
      <circle cx="56.5" cy="46.5" r="1" fill="#ffffff" />
      <path d="M 52 43 Q 55 41 58 43" stroke="#475569" strokeWidth="1.5" fill="none" />
      {/* Muzzle */}
      <ellipse cx="68" cy="58" rx="7" ry="9" fill="#fdbaf8" transform="rotate(-15 68 58)" />
      <circle cx="67" cy="56" r="1.5" fill="#475569" />
    </svg>
  ),
  monster: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="#10b981" />
      {/* Horns */}
      <polygon points="25,25 15,5 35,15" fill="#047857" />
      <polygon points="75,25 85,5 65,15" fill="#047857" />
      {/* Big Single Eye */}
      <circle cx="50" cy="42" r="15" fill="#f8fafc" stroke="#047857" strokeWidth="2" />
      <circle cx="50" cy="42" r="6" fill="#8b5cf6" />
      <circle cx="52" cy="40" r="2.5" fill="#ffffff" />
      {/* Mouth & Fangs */}
      <path d="M 35 62 Q 50 75 65 62" stroke="#047857" strokeWidth="3" fill="none" strokeLinecap="round" />
      <polygon points="40,63 43,68 46,63" fill="#f8fafc" />
      <polygon points="60,63 57,68 54,63" fill="#f8fafc" />
    </svg>
  )
};

export const Avatar = ({ name, className = "w-12 h-12" }) => {
  const avatarSvg = avatars[name] || avatars.bear;
  return (
    <div className={`inline-block rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-200 ${className}`}>
      {avatarSvg}
    </div>
  );
};

export const availableAvatars = Object.keys(avatars);
