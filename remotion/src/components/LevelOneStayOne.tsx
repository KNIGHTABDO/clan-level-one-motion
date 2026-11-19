import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {LEVEL_ONE_THEME} from '../utils/levelOneTheme';
import {computeSpring, L1_SPRINGS, clamp, span} from '../utils/levelOneMotion';

interface LevelOneStayOneProps {
  scaleDrift?: number;
}

export const LevelOneStayOne: React.FC<LevelOneStayOneProps> = ({scaleDrift = 1.0}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // Active from F180 onwards
  if (frame < 180) return null;

  const isVertical = height > width;

  // Snaps into place at F182 via TACTICAL_SNAP
  const snap = computeSpring(frame, 182, fps, L1_SPRINGS.TACTICAL_SNAP);
  const opacity = clamp(span(frame, 181, 185), 0, 1);
  const translateY = (1 - snap) * 28;
  const badgeScale = (0.92 + snap * 0.08) * scaleDrift;

  // Dual horizontal speed dashes extend outward
  const dashWidth = snap * (isVertical ? 42 : 56);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateY(${translateY}px) scale(${badgeScale})`,
        opacity,
        pointerEvents: 'none',
        marginTop: isVertical ? 24 : 18,
      }}
    >
      {/* Hand Sign Row: Speed Dashes + Index Finger (☝️) + Speed Dashes */}
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        {/* Left Speed Dashes */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end'}}>
          <div
            style={{
              width: dashWidth,
              height: 2,
              backgroundColor: LEVEL_ONE_THEME.colors.orange,
              boxShadow: LEVEL_ONE_THEME.glows.orangeCore,
            }}
          />
          <div
            style={{
              width: dashWidth * 0.65,
              height: 1.5,
              backgroundColor: LEVEL_ONE_THEME.colors.slateLight,
            }}
          />
        </div>

        {/* Index Finger Glyph SVG */}
        <svg
          width="34"
          height="46"
          viewBox="0 0 34 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fist / Palm Base */}
          <rect
            x="7"
            y="18"
            width="20"
            height="24"
            rx="5"
            fill={LEVEL_ONE_THEME.colors.slate}
            stroke={LEVEL_ONE_THEME.colors.white}
            strokeWidth="1.5"
          />
          {/* Folded fingers accents */}
          <line x1="12" y1="24" x2="22" y2="24" stroke={LEVEL_ONE_THEME.colors.slateLight} strokeWidth="1.5" />
          <line x1="12" y1="30" x2="22" y2="30" stroke={LEVEL_ONE_THEME.colors.slateLight} strokeWidth="1.5" />
          <line x1="12" y1="36" x2="22" y2="36" stroke={LEVEL_ONE_THEME.colors.slateLight} strokeWidth="1.5" />

          {/* Upward Pointing Index Finger */}
          <rect
            x="13"
            y="2"
            width="8"
            height="22"
            rx="4"
            fill={LEVEL_ONE_THEME.colors.white}
            stroke={LEVEL_ONE_THEME.colors.orangeHot}
            strokeWidth="1.5"
            style={{
              filter: `drop-shadow(0 0 6px ${LEVEL_ONE_THEME.colors.orange})`,
            }}
          />
        </svg>

        {/* Right Speed Dashes */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start'}}>
          <div
            style={{
              width: dashWidth,
              height: 2,
              backgroundColor: LEVEL_ONE_THEME.colors.orange,
              boxShadow: LEVEL_ONE_THEME.glows.orangeCore,
            }}
          />
          <div
            style={{
              width: dashWidth * 0.65,
              height: 1.5,
              backgroundColor: LEVEL_ONE_THEME.colors.slateLight,
            }}
          />
        </div>
      </div>

      {/* #STAYONE Typographic Badge */}
      <div
        style={{
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: LEVEL_ONE_THEME.fonts.heroLatin,
          fontSize: isVertical ? 24 : 28,
          fontWeight: 900,
          letterSpacing: '0.22em',
          color: LEVEL_ONE_THEME.colors.white,
          textShadow: LEVEL_ONE_THEME.glows.whiteText,
        }}
      >
        <span style={{color: LEVEL_ONE_THEME.colors.orange}}>#</span>
        <span>STAYONE</span>
        <span style={{color: LEVEL_ONE_THEME.colors.cyan}}>//</span>
        <span
          style={{
            fontFamily: LEVEL_ONE_THEME.fonts.telemetry,
            fontSize: isVertical ? 14 : 16,
            color: LEVEL_ONE_THEME.colors.slateLight,
            letterSpacing: '0.12em',
          }}
        >
          04.22.2026
        </span>
      </div>
    </div>
  );
};
