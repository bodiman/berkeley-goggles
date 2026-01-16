import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Crossed Swords Icon (Battle/Comparison) - Colorful like Clash Royale
export const CrossedSwordsIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left Sword */}
    <g transform="rotate(-45 32 32)">
      {/* Blade */}
      <path
        d="M32 8 L36 12 L36 38 L32 42 L28 38 L28 12 Z"
        fill="url(#bladeSilver)"
        stroke="#5a6988"
        strokeWidth="1"
      />
      {/* Blade shine */}
      <path
        d="M30 12 L30 36 L32 38 L32 12 Z"
        fill="rgba(255,255,255,0.4)"
      />
      {/* Guard */}
      <rect x="24" y="40" width="16" height="4" rx="1" fill="url(#goldGradient)" stroke="#8B6914" strokeWidth="0.5"/>
      {/* Handle */}
      <rect x="29" y="44" width="6" height="10" rx="1" fill="url(#handleBrown)" stroke="#4a3520" strokeWidth="0.5"/>
      {/* Pommel */}
      <circle cx="32" cy="56" r="3" fill="url(#goldGradient)" stroke="#8B6914" strokeWidth="0.5"/>
    </g>

    {/* Right Sword */}
    <g transform="rotate(45 32 32)">
      {/* Blade */}
      <path
        d="M32 8 L36 12 L36 38 L32 42 L28 38 L28 12 Z"
        fill="url(#bladeSilver)"
        stroke="#5a6988"
        strokeWidth="1"
      />
      {/* Blade shine */}
      <path
        d="M30 12 L30 36 L32 38 L32 12 Z"
        fill="rgba(255,255,255,0.4)"
      />
      {/* Guard */}
      <rect x="24" y="40" width="16" height="4" rx="1" fill="url(#goldGradient)" stroke="#8B6914" strokeWidth="0.5"/>
      {/* Handle */}
      <rect x="29" y="44" width="6" height="10" rx="1" fill="url(#handleBrown)" stroke="#4a3520" strokeWidth="0.5"/>
      {/* Pommel */}
      <circle cx="32" cy="56" r="3" fill="url(#goldGradient)" stroke="#8B6914" strokeWidth="0.5"/>
    </g>

    {/* Gradients */}
    <defs>
      <linearGradient id="bladeSilver" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a8b4c4"/>
        <stop offset="30%" stopColor="#e8eef5"/>
        <stop offset="50%" stopColor="#ffffff"/>
        <stop offset="70%" stopColor="#e8eef5"/>
        <stop offset="100%" stopColor="#a8b4c4"/>
      </linearGradient>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="50%" stopColor="#FFA500"/>
        <stop offset="100%" stopColor="#CD853F"/>
      </linearGradient>
      <linearGradient id="handleBrown" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#5c3d2e"/>
        <stop offset="50%" stopColor="#8B4513"/>
        <stop offset="100%" stopColor="#5c3d2e"/>
      </linearGradient>
    </defs>
  </svg>
);

// Treasure Chest Icon (Matches) - Colorful like Clash Royale
export const ChestIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Chest Base */}
    <path
      d="M8 30 L8 52 Q8 56 12 56 L52 56 Q56 56 56 52 L56 30 Z"
      fill="url(#chestWood)"
      stroke="#5c3d2e"
      strokeWidth="1.5"
    />
    {/* Chest Lid */}
    <path
      d="M6 30 Q6 18 32 14 Q58 18 58 30 L58 32 L6 32 Z"
      fill="url(#chestLid)"
      stroke="#5c3d2e"
      strokeWidth="1.5"
    />
    {/* Wood grain lines */}
    <path d="M12 34 L12 52" stroke="#4a3520" strokeWidth="0.5" opacity="0.5"/>
    <path d="M22 34 L22 52" stroke="#4a3520" strokeWidth="0.5" opacity="0.5"/>
    <path d="M42 34 L42 52" stroke="#4a3520" strokeWidth="0.5" opacity="0.5"/>
    <path d="M52 34 L52 52" stroke="#4a3520" strokeWidth="0.5" opacity="0.5"/>
    {/* Metal Band */}
    <rect x="6" y="28" width="52" height="6" fill="url(#metalBand)" stroke="#5a6988" strokeWidth="1"/>
    {/* Side Bands */}
    <rect x="10" y="34" width="4" height="20" rx="1" fill="url(#metalBand)" stroke="#5a6988" strokeWidth="0.5"/>
    <rect x="50" y="34" width="4" height="20" rx="1" fill="url(#metalBand)" stroke="#5a6988" strokeWidth="0.5"/>
    {/* Lock */}
    <rect x="26" y="36" width="12" height="14" rx="2" fill="url(#goldGradient2)" stroke="#8B6914" strokeWidth="1"/>
    <circle cx="32" cy="43" r="3" fill="#5c3d2e" stroke="#3d2817" strokeWidth="0.5"/>
    {/* Gems on lid */}
    <circle cx="20" cy="24" r="3" fill="#e74c3c" stroke="#c0392b" strokeWidth="0.5"/>
    <circle cx="32" cy="20" r="4" fill="#3498db" stroke="#2980b9" strokeWidth="0.5"/>
    <circle cx="44" cy="24" r="3" fill="#2ecc71" stroke="#27ae60" strokeWidth="0.5"/>

    <defs>
      <linearGradient id="chestWood" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#A0522D"/>
        <stop offset="50%" stopColor="#8B4513"/>
        <stop offset="100%" stopColor="#654321"/>
      </linearGradient>
      <linearGradient id="chestLid" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#CD853F"/>
        <stop offset="100%" stopColor="#8B4513"/>
      </linearGradient>
      <linearGradient id="metalBand" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#c0c0c0"/>
        <stop offset="50%" stopColor="#808080"/>
        <stop offset="100%" stopColor="#606060"/>
      </linearGradient>
      <linearGradient id="goldGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="50%" stopColor="#DAA520"/>
        <stop offset="100%" stopColor="#B8860B"/>
      </linearGradient>
    </defs>
  </svg>
);

// Shield with Swords Icon (League) - Colorful like Clash Royale
export const LeagueShieldIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Left Sword behind shield */}
    <g transform="translate(-8, 0) rotate(-30 32 40)">
      <path d="M32 4 L35 7 L35 28 L32 31 L29 28 L29 7 Z" fill="url(#bladeSilver3)" stroke="#5a6988" strokeWidth="0.5"/>
      <rect x="27" y="30" width="10" height="3" rx="1" fill="url(#goldGradient3)"/>
      <rect x="30" y="33" width="4" height="8" rx="1" fill="#8B4513"/>
    </g>

    {/* Right Sword behind shield */}
    <g transform="translate(8, 0) rotate(30 32 40)">
      <path d="M32 4 L35 7 L35 28 L32 31 L29 28 L29 7 Z" fill="url(#bladeSilver3)" stroke="#5a6988" strokeWidth="0.5"/>
      <rect x="27" y="30" width="10" height="3" rx="1" fill="url(#goldGradient3)"/>
      <rect x="30" y="33" width="4" height="8" rx="1" fill="#8B4513"/>
    </g>

    {/* Shield */}
    <path
      d="M32 8 L52 16 L52 34 Q52 52 32 58 Q12 52 12 34 L12 16 Z"
      fill="url(#shieldBlue)"
      stroke="#1a3a5c"
      strokeWidth="2"
    />
    {/* Shield inner border */}
    <path
      d="M32 12 L48 19 L48 33 Q48 48 32 54 Q16 48 16 33 L16 19 Z"
      fill="none"
      stroke="url(#goldGradient3)"
      strokeWidth="2"
    />
    {/* Shield emblem - crossed swords */}
    <g transform="translate(32 34) scale(0.4)">
      <path d="M0 -30 L4 -26 L4 0 L0 4 L-4 0 L-4 -26 Z" fill="#e8eef5" stroke="#5a6988" strokeWidth="1" transform="rotate(-45)"/>
      <path d="M0 -30 L4 -26 L4 0 L0 4 L-4 0 L-4 -26 Z" fill="#e8eef5" stroke="#5a6988" strokeWidth="1" transform="rotate(45)"/>
    </g>
    {/* Shield shine */}
    <path
      d="M18 20 Q24 24 24 32 Q24 40 22 44"
      fill="none"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="3"
      strokeLinecap="round"
    />

    <defs>
      <linearGradient id="bladeSilver3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a8b4c4"/>
        <stop offset="50%" stopColor="#e8eef5"/>
        <stop offset="100%" stopColor="#a8b4c4"/>
      </linearGradient>
      <linearGradient id="goldGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="50%" stopColor="#FFA500"/>
        <stop offset="100%" stopColor="#CD853F"/>
      </linearGradient>
      <linearGradient id="shieldBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a90d9"/>
        <stop offset="50%" stopColor="#2563eb"/>
        <stop offset="100%" stopColor="#1e40af"/>
      </linearGradient>
    </defs>
  </svg>
);

// Profile Icon - Knight Helmet Style
export const ProfileIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Helmet Main */}
    <path
      d="M12 36 L12 28 Q12 8 32 8 Q52 8 52 28 L52 36 Q52 44 46 48 L42 48 L42 52 L22 52 L22 48 L18 48 Q12 44 12 36 Z"
      fill="url(#helmetSilver)"
      stroke="#5a6988"
      strokeWidth="2"
    />
    {/* Helmet top ridge */}
    <path
      d="M28 8 Q32 4 36 8"
      fill="none"
      stroke="url(#helmetGold)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Helmet crest/plume */}
    <path
      d="M32 6 Q38 2 40 8 Q42 14 38 18 L32 12 L26 18 Q22 14 24 8 Q26 2 32 6"
      fill="url(#plumeRed)"
      stroke="#8B0000"
      strokeWidth="0.5"
    />
    {/* Face guard / Visor */}
    <path
      d="M18 30 L46 30 L46 40 Q46 44 42 46 L22 46 Q18 44 18 40 Z"
      fill="url(#visorDark)"
      stroke="#3d4557"
      strokeWidth="1"
    />
    {/* Visor slits */}
    <rect x="22" y="34" width="20" height="2" rx="1" fill="#1a1a2e"/>
    <rect x="22" y="38" width="20" height="2" rx="1" fill="#1a1a2e"/>
    {/* Gold trim around visor */}
    <path
      d="M16 28 L48 28"
      stroke="url(#helmetGold)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Side rivets */}
    <circle cx="16" cy="32" r="2" fill="url(#helmetGold)" stroke="#8B6914" strokeWidth="0.5"/>
    <circle cx="48" cy="32" r="2" fill="url(#helmetGold)" stroke="#8B6914" strokeWidth="0.5"/>
    {/* Chin guard */}
    <path
      d="M22 52 L22 56 Q22 60 32 60 Q42 60 42 56 L42 52"
      fill="url(#helmetSilver)"
      stroke="#5a6988"
      strokeWidth="1"
    />
    {/* Shine effect */}
    <path
      d="M20 16 Q24 14 26 20"
      fill="none"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="2"
      strokeLinecap="round"
    />

    <defs>
      <linearGradient id="helmetSilver" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c0c8d4"/>
        <stop offset="30%" stopColor="#e8eef5"/>
        <stop offset="50%" stopColor="#f8fafc"/>
        <stop offset="70%" stopColor="#e8eef5"/>
        <stop offset="100%" stopColor="#a8b4c4"/>
      </linearGradient>
      <linearGradient id="helmetGold" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="50%" stopColor="#FFA500"/>
        <stop offset="100%" stopColor="#CD853F"/>
      </linearGradient>
      <linearGradient id="visorDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4a5568"/>
        <stop offset="100%" stopColor="#2d3748"/>
      </linearGradient>
      <linearGradient id="plumeRed" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#c0392b"/>
        <stop offset="50%" stopColor="#e74c3c"/>
        <stop offset="100%" stopColor="#ff6b6b"/>
      </linearGradient>
    </defs>
  </svg>
);
