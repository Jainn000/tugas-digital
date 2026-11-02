import React from 'react';

export default function Logo({ variant = 'full', theme = 'light', className = '' }) {
  const isDark = theme === 'dark';

  if (variant === 'icon') {
    return (
      <div className={`relative inline-block ${className}`} style={{ width: 36, height: 36 }}>
        <svg viewBox="0 0 120 120" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="104" height="104" fill="#121212" />
          <rect x="4" y="4" width="104" height="104" fill="#FFE600" stroke="#121212" strokeWidth="4" />
          <rect x="4" y="4" width="18" height="18" fill="#121212" />
          <rect x="90" y="90" width="18" height="18" fill="#FF5C00" stroke="#121212" strokeWidth="2" />
          <rect x="24" y="24" width="18" height="64" fill="#121212" />
          <polygon points="42,52 68,24 88,24 58,56" fill="#38BDF8" stroke="#121212" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="50,52 86,88 66,88 38,60" fill="#A3E635" stroke="#121212" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="48,44 60,32 54,46 66,46 44,72 50,54 40,54" fill="#FF5C00" stroke="#121212" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Neubrutalist Emblem */}
      <div className="relative flex-shrink-0" style={{ width: 38, height: 38 }}>
        <svg viewBox="0 0 120 120" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="104" height="104" fill="#121212" />
          <rect x="4" y="4" width="104" height="104" fill="#FFE600" stroke="#121212" strokeWidth="4" />
          <rect x="4" y="4" width="18" height="18" fill="#121212" />
          <rect x="90" y="90" width="18" height="18" fill="#FF5C00" stroke="#121212" strokeWidth="2" />
          <rect x="24" y="24" width="18" height="64" fill="#121212" />
          <polygon points="42,52 68,24 88,24 58,56" fill="#38BDF8" stroke="#121212" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="50,52 86,88 66,88 38,60" fill="#A3E635" stroke="#121212" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="48,44 60,32 54,46 66,46 44,72 50,54 40,54" fill="#FF5C00" stroke="#121212" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Brand Typo & Badge */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black text-xl tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
            KINETIK
          </span>
          <span className="px-1 py-0.5 bg-[#A3E635] text-black text-[9px] font-black border border-black leading-none">
            PRO
          </span>
        </div>
        <span className={`text-[10px] font-bold tracking-tight mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>
          Event Production &amp; Organizer
        </span>
      </div>
    </div>
  );
}
