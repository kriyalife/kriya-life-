// SVG Data URLs for exact KRIYA Life Science products uploaded by user

export const VITAMIN_C_FACEWASH_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#FFF5EE"/>
      <stop offset="50%" stop-color="#FDE8D7"/>
      <stop offset="100%" stop-color="#F5D0B5"/>
    </radialGradient>

    <!-- Tube Body Gradient -->
    <linearGradient id="tubeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF7A00"/>
      <stop offset="25%" stop-color="#FFA033"/>
      <stop offset="60%" stop-color="#FF8000"/>
      <stop offset="100%" stop-color="#D95B00"/>
    </linearGradient>

    <!-- Tube Gel Texture Highlight -->
    <linearGradient id="gelHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.4"/>
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.15"/>
    </linearGradient>

    <!-- Label Gradient -->
    <linearGradient id="labelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="85%" stop-color="#FAFAFA"/>
      <stop offset="100%" stop-color="#F0F0F0"/>
    </linearGradient>

    <!-- Vitamin C Ring Gradient -->
    <linearGradient id="cRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFB300"/>
      <stop offset="50%" stop-color="#FF6F00"/>
      <stop offset="100%" stop-color="#E65100"/>
    </linearGradient>

    <!-- Cap Metallic/Matte Dark Gradient -->
    <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1A1A1A"/>
      <stop offset="40%" stop-color="#333333"/>
      <stop offset="70%" stop-color="#222222"/>
      <stop offset="100%" stop-color="#0A0A0A"/>
    </linearGradient>

    <!-- Drop Shadow -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="20" flood-color="#8B3A00" flood-opacity="0.25"/>
    </filter>

    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="800" height="800" fill="url(#bgGrad)" />

  <!-- Background Orange Slice (Right Bottom) -->
  <g transform="translate(560, 500)" opacity="0.95">
    <circle cx="100" cy="100" r="110" fill="#FF8C00"/>
    <circle cx="100" cy="100" r="102" fill="#FFF8F0"/>
    <circle cx="100" cy="100" r="92" fill="#FFA500"/>
    <!-- Orange Segments -->
    <path d="M100 100 L100 10 A90 90 0 0 1 163 36 Z" fill="#FF7F00" opacity="0.9"/>
    <path d="M100 100 L163 36 A90 90 0 0 1 190 100 Z" fill="#FF8A00" opacity="0.9"/>
    <path d="M100 100 L190 100 A90 90 0 0 1 163 164 Z" fill="#FF7F00" opacity="0.9"/>
    <path d="M100 100 L163 164 A90 90 0 0 1 100 190 Z" fill="#FF8A00" opacity="0.9"/>
    <path d="M100 100 L100 190 A90 90 0 0 1 37 164 Z" fill="#FF7F00" opacity="0.9"/>
    <path d="M100 100 L37 164 A90 90 0 0 1 10 100 Z" fill="#FF8A00" opacity="0.9"/>
    <path d="M100 100 L10 100 A90 90 0 0 1 37 36 Z" fill="#FF7F00" opacity="0.9"/>
    <path d="M100 100 L37 36 A90 90 0 0 1 100 10 Z" fill="#FF8A00" opacity="0.9"/>
    <circle cx="100" cy="100" r="14" fill="#FFF8F0"/>
  </g>

  <!-- Background Small Orange Wedge (Left Bottom) -->
  <g transform="translate(120, 620) rotate(-25)" opacity="0.95">
    <path d="M 0,0 A 90,90 0 0,1 120,60 L 0,0 Z" fill="#FF7F00"/>
    <path d="M 5,5 A 82,82 0 0,1 112,54 L 5,5 Z" fill="#FFF5EA"/>
    <path d="M 10,10 A 74,74 0 0,1 104,48 L 10,10 Z" fill="#FFA500"/>
  </g>

  <!-- Water Splash Accents -->
  <g opacity="0.4" fill="#FFFFFF">
    <circle cx="230" cy="480" r="8"/>
    <circle cx="210" cy="520" r="12"/>
    <circle cx="250" cy="560" r="5"/>
    <circle cx="580" cy="420" r="9"/>
    <circle cx="610" cy="380" r="14"/>
    <circle cx="560" cy="350" r="6"/>
  </g>

  <!-- Ground Contact Shadow -->
  <ellipse cx="400" cy="710" rx="140" ry="22" fill="#6B2900" opacity="0.25" filter="blur(10px)"/>

  <!-- TUBE MAIN CONTAINER -->
  <g filter="url(#shadow)">
    <!-- Sealed Crimp Top -->
    <path d="M 280,100 L 520,100 Q 525,100 525,110 L 525,120 Q 525,125 520,125 L 280,125 Q 275,125 275,120 L 275,110 Q 275,100 280,100 Z" fill="#E65100"/>
    <!-- Crimp Lines -->
    <path d="M 290,100 L 290,125 M 310,100 L 310,125 M 330,100 L 330,125 M 350,100 L 350,125 M 370,100 L 370,125 M 390,100 L 390,125 M 410,100 L 410,125 M 430,100 L 430,125 M 450,100 L 450,125 M 470,100 L 470,125 M 490,100 L 490,125 M 510,100 L 510,125" stroke="#BF3600" stroke-width="2"/>

    <!-- Tube Body -->
    <path d="M 275,125 Q 285,380 325,590 L 475,590 Q 515,380 525,125 Z" fill="url(#tubeGrad)"/>
    <!-- Tube Gloss / Sheen overlay -->
    <path d="M 275,125 Q 285,380 325,590 L 475,590 Q 515,380 525,125 Z" fill="url(#gelHighlight)"/>

    <!-- WHITE LABEL STICKER -->
    <g id="whiteLabel">
      <path d="M 312,210 Q 315,380 338,550 L 462,550 Q 485,380 488,210 Q 400,200 312,210 Z" fill="url(#labelGrad)" filter="url(#softShadow)"/>
      <path d="M 312,210 Q 315,380 338,550 L 462,550 Q 485,380 488,210 Q 400,200 312,210 Z" stroke="#E2E2E2" stroke-width="1" fill="none"/>

      <!-- LOGO ON LABEL -->
      <!-- 'KRÍYA' -->
      <text x="400" y="272" font-family="'Times New Roman', Georgia, serif" font-size="34" font-weight="bold" fill="#1B3B2B" text-anchor="middle" letter-spacing="4">KRÍYA</text>
      <!-- Leaf over 'I' in logo -->
      <path d="M 406,242 Q 416,230 412,248 Q 402,254 406,242 Z" fill="#558B2F"/>
      <!-- TM symbol -->
      <circle cx="452" cy="254" r="5" stroke="#1B3B2B" stroke-width="0.8" fill="none"/>
      <text x="452" y="256" font-family="sans-serif" font-size="4.5" font-weight="bold" fill="#1B3B2B" text-anchor="middle">TM</text>

      <!-- LIFE SCIENCE Line -->
      <line x1="340" y1="288" x2="368" y2="288" stroke="#1B3B2B" stroke-width="1.2"/>
      <text x="400" y="291" font-family="sans-serif" font-size="10" font-weight="bold" fill="#558B2F" text-anchor="middle" letter-spacing="3.5">LIFE SCIENCE</text>
      <line x1="432" y1="288" x2="460" y2="288" stroke="#1B3B2B" stroke-width="1.2"/>

      <text x="400" y="304" font-family="sans-serif" font-size="6.5" font-weight="600" fill="#2E4A3B" text-anchor="middle" letter-spacing="1">SCIENCE BEHIND NATURAL BEAUTY</text>

      <!-- VITAMIN C EMBLEM -->
      <g transform="translate(400, 375)">
        <!-- Splash ring -->
        <circle cx="0" cy="0" r="42" stroke="url(#cRingGrad)" stroke-width="7" stroke-dasharray="180 20" fill="none"/>
        <circle cx="0" cy="0" r="32" stroke="#FFE082" stroke-width="2" fill="none" opacity="0.6"/>
        
        <text x="0" y="-2" font-family="sans-serif" font-size="32" font-weight="900" fill="#E65100" text-anchor="middle">C</text>
        <text x="0" y="16" font-family="sans-serif" font-size="8" font-weight="800" fill="#D84315" text-anchor="middle" letter-spacing="1">VITAMIN</text>
        
        <!-- Green leaf sprig beside C -->
        <path d="M 28,-12 Q 48,-25 42,-5 Q 26,0 28,-12 Z" fill="#4CAF50"/>
        <path d="M 32,2 Q 52,0 48,18 Q 30,16 32,2 Z" fill="#388E3C"/>
      </g>

      <!-- PRODUCT TITLE: FACE WASH -->
      <text x="400" y="452" font-family="'Times New Roman', Georgia, serif" font-size="28" font-weight="bold" fill="#BF3600" text-anchor="middle" letter-spacing="1">FACE WASH</text>

      <!-- CAPSULE BADGE: Simply Natural Glowing -->
      <rect x="335" y="470" width="130" height="22" rx="11" fill="#D84315"/>
      <text x="400" y="485" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">Simply Natural Glowing</text>

      <!-- NET VOL -->
      <text x="400" y="525" font-family="sans-serif" font-size="10" font-weight="600" fill="#333333" text-anchor="middle">Net. Vol. 100ml</text>
    </g>

    <!-- TUBE BASE / CAP -->
    <path d="M 325,590 L 475,590 L 460,670 Q 400,682 340,670 Z" fill="url(#capGrad)"/>
    <!-- Flip Cap Groove -->
    <ellipse cx="400" cy="630" rx="35" ry="8" stroke="#444444" stroke-width="1.5" fill="none"/>
  </g>
</svg>
`)}`;

export const OLIVE_SOUFFLE_CREAM_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <!-- Background Soft Studio Gradient -->
    <radialGradient id="bgGrad2" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="#F7F9F6"/>
      <stop offset="100%" stop-color="#EBF0E8"/>
    </radialGradient>

    <!-- Silver Metallic Cap Gradient -->
    <linearGradient id="silverCap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8E9296"/>
      <stop offset="20%" stop-color="#DCDEE1"/>
      <stop offset="50%" stop-color="#FFFFFF"/>
      <stop offset="75%" stop-color="#B0B5B9"/>
      <stop offset="100%" stop-color="#73777A"/>
    </linearGradient>

    <!-- Frosted Green Glass Jar Gradient -->
    <linearGradient id="frostedGlass" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#A2BBA1"/>
      <stop offset="20%" stop-color="#C5DBC3"/>
      <stop offset="50%" stop-color="#E2EFE0"/>
      <stop offset="80%" stop-color="#B8CFB6"/>
      <stop offset="100%" stop-color="#8F9B8D"/>
    </linearGradient>

    <!-- Cream Inside Glass Shader -->
    <linearGradient id="creamInner" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E8F2E6" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#BACFBA" stop-opacity="0.95"/>
    </linearGradient>

    <!-- Marble Texture Gradient -->
    <linearGradient id="marbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#F2F4F2"/>
      <stop offset="100%" stop-color="#E1E5E1"/>
    </linearGradient>

    <!-- Shadow Filters -->
    <filter id="jarShadow" x="-30%" y="-20%" width="160%" height="150%">
      <feDropShadow dx="0" dy="20" stdDeviation="16" flood-color="#2D402B" flood-opacity="0.2"/>
    </filter>

    <filter id="podiumShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="30" stdDeviation="25" flood-color="#1B281A" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="800" height="800" fill="url(#bgGrad2)"/>

  <!-- Soft White Draped Silk Folds in Background -->
  <path d="M 0,0 Q 200,150 400,50 Q 600,200 800,0 L 800,300 Q 500,250 0,350 Z" fill="#FFFFFF" opacity="0.6"/>

  <!-- MARBLE PODIUM STAND -->
  <g filter="url(#podiumShadow)">
    <!-- Base Ellipse Thickness -->
    <path d="M 150,560 C 150,510 650,510 650,560 L 650,590 C 650,640 150,640 150,590 Z" fill="#D3D8D3"/>
    <!-- Top Surface Disc -->
    <ellipse cx="400" cy="560" rx="250" ry="50" fill="url(#marbleGrad)" stroke="#E5EAE5" stroke-width="2"/>
    <!-- Subtle Marble Veins -->
    <path d="M 220,550 Q 300,570 380,545 T 520,570" stroke="#C2C9C2" stroke-width="2" fill="none" opacity="0.5"/>
    <path d="M 310,535 Q 360,555 420,538" stroke="#CBD2CB" stroke-width="1.5" fill="none" opacity="0.6"/>
  </g>

  <!-- FRESH OLIVES & BRANCH ON PODIUM (Right foreground) -->
  <g id="olives" transform="translate(580, 520)">
    <!-- Branch Stem -->
    <path d="M -30,-40 Q 10,0 50,20" stroke="#3E2723" stroke-width="3" fill="none"/>
    
    <!-- Olive Leaves -->
    <path d="M 0,-10 Q -30,-30 -10,-50 Q 10,-30 0,-10 Z" fill="#556B2F"/>
    <path d="M 20,5 Q 40,-20 50,-35 Q 45,-5 20,5 Z" fill="#6B8E23"/>
    <path d="M 35,15 Q 70,0 75,-15 Q 60,15 35,15 Z" fill="#3B5323"/>

    <!-- Olive 1 (Plump Green) -->
    <ellipse cx="0" cy="20" rx="22" ry="16" fill="#6B8E23" transform="rotate(-20 0 20)"/>
    <ellipse cx="-4" cy="15" rx="14" ry="7" fill="#8FA83B" opacity="0.8" transform="rotate(-20 0 20)"/>
    <ellipse cx="-6" cy="12" rx="5" ry="2" fill="#FFFFFF" opacity="0.6"/>

    <!-- Olive 2 (Beside) -->
    <ellipse cx="40" cy="28" rx="20" ry="15" fill="#556B2F" transform="rotate(15 40 28)"/>
    <ellipse cx="36" cy="24" rx="12" ry="6" fill="#76913C" opacity="0.8" transform="rotate(15 40 28)"/>
    <ellipse cx="34" cy="22" rx="4" ry="2" fill="#FFFFFF" opacity="0.6"/>
  </g>

  <!-- Left Background Olive Leaf Sprig -->
  <g transform="translate(100, 300) rotate(-45)">
    <path d="M 0,0 Q 80,40 160,20" stroke="#4A3B32" stroke-width="2.5" fill="none"/>
    <path d="M 40,20 Q 20,-10 5,-25 Q 35,-10 40,20 Z" fill="#556B2F"/>
    <path d="M 80,30 Q 70,0 60,-20 Q 85,5 80,30 Z" fill="#6B8E23"/>
    <path d="M 120,25 Q 120,-5 110,-25 Q 130,0 120,25 Z" fill="#3B5323"/>
  </g>

  <!-- MAIN FROSTED GLASS JAR & SILVER CAP -->
  <g filter="url(#jarShadow)">

    <!-- FROSTED GLASS BODY -->
    <g id="glassBody">
      <!-- Outer Glass Contour -->
      <path d="M 250,330 L 550,330 Q 565,330 565,345 L 565,490 Q 565,515 540,515 L 260,515 Q 235,515 235,490 L 235,345 Q 235,330 250,330 Z" fill="url(#frostedGlass)"/>
      <!-- Inner Cream Volume -->
      <path d="M 252,342 L 548,342 Q 553,342 553,352 L 553,482 Q 553,502 533,502 L 267,502 Q 247,502 247,482 L 247,352 Q 247,342 252,342 Z" fill="url(#creamInner)"/>
      <!-- Frosted Matte Overlay Sheen -->
      <path d="M 235,345 Q 400,320 565,345 L 565,490 Q 400,530 235,490 Z" fill="#FFFFFF" opacity="0.25"/>

      <!-- PRINTED LOGO ON GLASS -->
      <g transform="translate(400, 420)">
        <text x="0" y="0" font-family="'Times New Roman', Georgia, serif" font-size="42" font-weight="bold" fill="#1B3B2B" text-anchor="middle" letter-spacing="6">KRÍYA</text>
        <!-- Leaf over I -->
        <path d="M 7,-35 Q 18,-48 14,-30 Q 3,-22 7,-35 Z" fill="#4CAF50"/>
        
        <text x="0" y="24" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1B3B2B" text-anchor="middle" letter-spacing="5">- LIFE SCIENCE -</text>
      </g>
    </g>

    <!-- METALLIC SILVER CAP -->
    <g id="silverCapGroup">
      <!-- Cap Base Lip -->
      <path d="M 238,330 L 562,330 Q 570,330 570,320 L 570,240 Q 570,225 555,225 L 245,225 Q 230,225 230,240 L 230,320 Q 230,330 238,330 Z" fill="url(#silverCap)"/>
      <!-- Top Bevel Highlight -->
      <ellipse cx="400" cy="225" rx="160" ry="12" fill="#FFFFFF" opacity="0.6"/>
      <!-- Bottom Rim Shadow line -->
      <path d="M 230,320 Q 400,332 570,320" stroke="#5D6266" stroke-width="2" fill="none"/>
    </g>

  </g>
</svg>
`)}`;
