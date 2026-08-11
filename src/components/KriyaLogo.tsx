import React from 'react';

interface KriyaLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'icon' | 'minimal';
  colorMode?: 'dark' | 'light' | 'emerald';
}

export const KriyaLogo: React.FC<KriyaLogoProps> = ({
  className = 'h-11',
  variant = 'full',
  colorMode = 'dark'
}) => {
  // Brand Color Palette from official KRÍYA Life Science identity photo
  const textDark = colorMode === 'light' ? '#FFFFFF' : '#0B281B';
  const leafGreen = colorMode === 'light' ? '#A3D178' : '#558321';
  const subtitleGreen = colorMode === 'light' ? '#A3D178' : '#558321';
  const lineDark = colorMode === 'light' ? 'rgba(255, 255, 255, 0.5)' : '#0B281B';

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 540 142"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-w-full overflow-visible"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
      >
        {/* === LETTER K === */}
        {/* Vertical Stem with Serifs */}
        <path
          d="M 58 34 L 72 34 L 72 98 L 58 98 Z 
             M 50 30 L 80 30 L 80 34 L 50 34 Z 
             M 50 98 L 80 98 L 80 102 L 50 102 Z"
          fill={textDark}
        />
        {/* Upper Diagonal Arm */}
        <path
          d="M 70 66 L 128 32 L 142 32 L 84 72 Z"
          fill={textDark}
        />
        {/* Green Leaf on K (lower-left diagonal accent) */}
        <g>
          <path
            d="M 72 70 C 50 82 48 98 88 102 C 122 102 128 84 72 70 Z"
            fill={leafGreen}
          />
          {/* Leaf vein stroke */}
          <path
            d="M 72 70 C 85 86 102 96 122 99"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* === LETTER R === */}
        {/* Stem with Serifs */}
        <path
          d="M 162 34 L 176 34 L 176 98 L 162 98 Z
             M 154 30 L 184 30 L 184 34 L 154 34 Z
             M 154 98 L 176 98 L 176 102 L 154 102 Z"
          fill={textDark}
        />
        {/* Loop and Leg */}
        <path
          d="M 176 34 L 210 34 C 232 34 242 45 242 58 C 242 70 230 78 210 78 L 176 78 Z
             M 176 42 L 176 70 L 208 70 C 222 70 228 64 228 56 C 228 48 222 42 208 42 Z"
          fill={textDark}
        />
        <path
          d="M 194 74 L 232 98 L 246 98 L 206 72 Z
             M 226 98 L 248 98 L 248 102 L 226 102 Z"
          fill={textDark}
        />

        {/* === LETTER Í === */}
        {/* Vertical Stem with Serifs */}
        <path
          d="M 270 48 L 284 48 L 284 98 L 270 98 Z
             M 262 44 L 292 44 L 292 48 L 262 48 Z
             M 262 98 L 292 98 L 292 102 L 262 102 Z"
          fill={textDark}
        />
        {/* Green Leaf Accent above Í */}
        <g>
          <path
            d="M 271 42 C 271 42 268 22 282 16 C 290 12 296 16 296 16 C 296 16 294 30 282 37 C 277 39 271 42 271 42 Z"
            fill={leafGreen}
          />
          <path
            d="M 272 40 C 280 28 288 20 293 17"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* === LETTER Y === */}
        {/* Left Curved Arm */}
        <path
          d="M 310 32 C 328 32 344 50 344 70 L 344 98 L 332 98 L 332 70 C 332 58 322 42 308 42 Z"
          fill={textDark}
        />
        {/* Right Curved Arm */}
        <path
          d="M 388 32 C 370 32 354 50 354 70 L 354 98 L 366 98 L 366 70 C 366 58 376 42 390 42 Z"
          fill={textDark}
        />
        {/* Center Stem base serif */}
        <path
          d="M 326 98 L 372 98 L 372 102 L 326 102 Z"
          fill={textDark}
        />
        {/* Green Circle Dot floating inside Y */}
        <circle cx="349" cy="46" r="8" fill={leafGreen} />

        {/* === LETTER A === */}
        <path
          d="M 424 30 L 436 30 L 468 98 L 452 98 L 444 82 L 414 82 L 408 98 L 394 98 Z M 428 48 L 418 72 L 438 72 Z"
          fill={textDark}
        />
        {/* Serifs at base of A */}
        <path d="M 388 98 L 412 98 L 412 102 L 388 102 Z" fill={textDark} />
        <path d="M 446 98 L 472 98 L 472 102 L 446 102 Z" fill={textDark} />

        {/* === TRADEMARK ™ === */}
        <g>
          <circle cx="474" cy="38" r="9" stroke={textDark} strokeWidth="1.3" fill="none" />
          <text x="474" y="41" fill={textDark} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">TM</text>
        </g>

        {variant === 'full' && (
          <>
            {/* === SUBTITLE LINE & TEXT "LIFE SCIENCE" === */}
            {/* Left Horizontal Line */}
            <line x1="38" y1="124" x2="118" y2="124" stroke={lineDark} strokeWidth="2" />

            {/* "LIFE SCIENCE" Text */}
            <text
              x="256"
              y="129"
              fill={subtitleGreen}
              fontSize="16"
              fontWeight="800"
              letterSpacing="8.5"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            >
              LIFE SCIENCE
            </text>

            {/* Right Horizontal Line */}
            <line x1="394" y1="124" x2="474" y2="124" stroke={lineDark} strokeWidth="2" />
          </>
        )}
      </svg>
    </div>
  );
};


