import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {LEVEL_ONE_THEME} from '../utils/levelOneTheme';

export const LevelOneBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // 24fps seed update: Math.floor(frame / 2.5) for 60fps timeline
  const grainSeed = (Math.floor(frame / 2.5) % 100) + 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: LEVEL_ONE_THEME.colors.void,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Dynamic Font Loader stylesheet */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;900&family=IBM+Plex+Sans+Arabic:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Share+Tech+Mono&family=Anton&family=Inter:wght@700;900&display=swap');
      `}</style>

      {/* SVG Definitions for grain and effects */}
      <svg
        width="0"
        height="0"
        style={{position: 'absolute', width: 0, height: 0}}
        aria-hidden="true"
      >
        <defs>
          <filter id="l1-film-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.82"
              numOctaves={3}
              seed={grainSeed}
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.045 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Precision Engineering Background Micro-Grid */}
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0.22,
        }}
      >
        <defs>
          <pattern
            id="l1-grid-pattern"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke={LEVEL_ONE_THEME.colors.slate}
              strokeWidth="0.75"
              strokeOpacity="0.35"
            />
            {/* Fine coordinate dot at grid intersections */}
            <circle
              cx="64"
              cy="64"
              r="1"
              fill={LEVEL_ONE_THEME.colors.slateLight}
              fillOpacity="0.4"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#l1-grid-pattern)" />

        {/* Central 240x240 Focal Zone Crosshair Marks */}
        <g stroke={LEVEL_ONE_THEME.colors.slateLight} strokeWidth="1" strokeOpacity="0.45">
          {/* Center Crosshair */}
          <line x1={width / 2 - 16} y1={height / 2} x2={width / 2 + 16} y2={height / 2} />
          <line x1={width / 2} y1={height / 2 - 16} x2={width / 2} y2={height / 2 + 16} />
          {/* 240px Focal Circle Guide (ultra faint) */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r="120"
            fill="none"
            strokeDasharray="4 6"
            strokeOpacity="0.18"
          />
        </g>
      </svg>

      {/* 24fps Film Grain Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'url(#l1-film-grain)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* Vignette - radial falloff to pure void */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(10,10,10,0.0) 45%, rgba(10,10,10,0.85) 90%, rgba(10,10,10,1.0) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
