export const LEVEL_ONE_THEME = {
  colors: {
    void: '#0A0A0A',
    slate: '#2B2D31',
    slateLight: '#43464D',
    white: '#FCFEFE',
    orange: '#EC5916',
    orangeHot: '#FF8A4C',
    cyan: '#27DDC0',
    cyanHot: '#88FFE9',
  },
  glows: {
    orangeCore: '0 0 8px #FF8A4C, 0 0 28px rgba(236, 89, 22, 0.45), 0 0 60px rgba(236, 89, 22, 0.18)',
    cyanCore: '0 0 8px #88FFE9, 0 0 24px rgba(39, 221, 192, 0.50), 0 0 54px rgba(39, 221, 192, 0.16)',
    whiteText: '0 0 14px rgba(252, 254, 254, 0.45), 0 2px 10px rgba(0, 0, 0, 0.95)',
    seamGlow: '0 0 4px #FCFEFE, 0 0 18px #FF8A4C, 0 0 48px rgba(236, 89, 22, 0.55)',
  },
  fonts: {
    heroLatin: '"Monument Extended", "Anton", "Inter", sans-serif',
    heroArabic: '"DIN Next LT Arabic", "Cairo", sans-serif',
    editorialArabic: '"IBM Plex Sans Arabic", "Cairo", sans-serif',
    telemetry: '"Berkeley Mono", "JetBrains Mono", "Share Tech Mono", monospace',
  },
  timings: {
    fps: 60,
    totalFrames: 270, // 4.50s
    p1ColdEnd: 72,   // 1.20s
    p2RevealEnd: 150,// 2.50s
    impactFrame: 152,// 2.53s
    p3BrandEnd: 228, // 3.80s
    p4OutroEnd: 270, // 4.50s
  },
} as const;
