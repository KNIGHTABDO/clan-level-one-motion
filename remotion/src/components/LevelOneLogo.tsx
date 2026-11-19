import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {LEVEL_ONE_THEME} from '../utils/levelOneTheme';
import {
  computeSpring,
  L1_SPRINGS,
  span,
  whipSnap,
  expoOut,
  clamp,
} from '../utils/levelOneMotion';

interface LevelOneLogoProps {
  scaleDrift?: number;
}

export const LevelOneLogo: React.FC<LevelOneLogoProps> = ({scaleDrift = 1.0}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // Active from F151 onwards
  if (frame < 151) return null;

  const isVertical = height > width;

  // Spring slam at Frame 152 (HEAVY_STAMP: 0.85 mass, 280 stiff, 26 damp)
  // Scale from 1.45 down to 1.00
  const slamSpring = computeSpring(frame, 152, fps, L1_SPRINGS.HEAVY_STAMP);
  const logoScale = (1.45 - slamSpring * 0.45) * scaleDrift;
  const logoOpacity = clamp(span(frame, 151, 154), 0, 1);

  // Play Button Ignition (F160 - F182)
  const playIgniteT = expoOut(span(frame, 160, 172));
  const playGlow = playIgniteT;

  // Cyan Ring Shockwave from Play Button (F160 - F180)
  const ringT = span(frame, 160, 180);
  const ringScale = 0.8 + expoOut(ringT) * 2.2;
  const ringOpacity = (1 - ringT) * 0.85;

  // Lightning Bolt Discharge (F164 - F188)
  const boltT = whipSnap(span(frame, 164, 182));
  const boltDashoffset = (1 - boltT) * 160;
  // White flash during initial 3 frames of discharge (F164-F167)
  const isBoltFlash = frame >= 164 && frame <= 167;
  const boltColor = isBoltFlash ? LEVEL_ONE_THEME.colors.white : LEVEL_ONE_THEME.colors.orange;

  // Dual-pass glow calculation
  const logoDropFilter =
    frame >= 152
      ? `drop-shadow(0 0 12px rgba(255, 138, 76, ${0.45 * (1 - span(frame, 152, 170) * 0.5)})) drop-shadow(0 0 35px rgba(236, 89, 22, 0.22))`
      : 'none';

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${logoScale})`,
        opacity: logoOpacity,
        filter: logoDropFilter,
        pointerEvents: 'none',
      }}
    >
      {/* Expanding Cyan Shockwave from Play Button center */}
      {ringOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '55%',
            left: '37%',
            width: 80,
            height: 80,
            marginLeft: -40,
            marginTop: -40,
            borderRadius: '50%',
            border: `2px solid ${LEVEL_ONE_THEME.colors.cyan}`,
            boxShadow: LEVEL_ONE_THEME.glows.cyanCore,
            transform: `scale(${ringScale})`,
            opacity: ringOpacity,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Official Master Vector Emblem */}
      <svg
        width={isVertical ? 480 : 560}
        height={isVertical ? 320 : 370}
        viewBox="0 0 440 290"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{overflow: 'visible'}}
      >
        <defs>
          {/* Top-Left Fiery Orange Specular Rim */}
          <linearGradient id="l1-front-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor={LEVEL_ONE_THEME.colors.white} />
            <stop offset="100%" stopColor="#E2E6E8" />
          </linearGradient>

          {/* 3D Isometric Extrusion Depth Gradient */}
          <linearGradient id="l1-depth-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={LEVEL_ONE_THEME.colors.slateLight} />
            <stop offset="100%" stopColor={LEVEL_ONE_THEME.colors.slate} />
          </linearGradient>

          {/* Lightning Glow Gradient */}
          <linearGradient id="l1-bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={LEVEL_ONE_THEME.colors.orangeHot} />
            <stop offset="100%" stopColor={LEVEL_ONE_THEME.colors.orange} />
          </linearGradient>
        </defs>

        {/* ---------------- 3D EXTRUSION BACKING (SLATE DEPTH) ---------------- */}
        <g transform="translate(6, 9)" opacity="0.95">
          {/* Upper row: LEVEL */}
          <text
            x="40"
            y="110"
            fontFamily={LEVEL_ONE_THEME.fonts.heroLatin}
            fontSize="92"
            fontWeight="900"
            fill="url(#l1-depth-grad)"
            letterSpacing="0.08em"
          >
            level
          </text>

          {/* Lower row: ONE */}
          <text
            x="40"
            y="215"
            fontFamily={LEVEL_ONE_THEME.fonts.heroLatin}
            fontSize="108"
            fontWeight="900"
            fill="url(#l1-depth-grad)"
            letterSpacing="0.06em"
          >
            one
          </text>
        </g>

        {/* ---------------- FRONT FACES (MONUMENTAL WHITE) ---------------- */}
        {/* Upper row: level */}
        <text
          x="40"
          y="110"
          fontFamily={LEVEL_ONE_THEME.fonts.heroLatin}
          fontSize="92"
          fontWeight="900"
          fill="url(#l1-front-grad)"
          letterSpacing="0.08em"
          stroke={LEVEL_ONE_THEME.colors.white}
          strokeWidth="0.5"
        >
          level
        </text>

        {/* Lower row: one */}
        <text
          x="40"
          y="215"
          fontFamily={LEVEL_ONE_THEME.fonts.heroLatin}
          fontSize="108"
          fontWeight="900"
          fill="url(#l1-front-grad)"
          letterSpacing="0.06em"
          stroke={LEVEL_ONE_THEME.colors.white}
          strokeWidth="0.5"
        >
          one
        </text>

        {/* ---------------- PLAY BUTTON (▶) IN 'o' ---------------- */}
        {/* Counter of 'o' is approximately at x=105, y=178 */}
        <g transform="translate(86, 154)">
          {/* Dark inner backing cutout */}
          <rect x="0" y="0" width="46" height="46" rx="8" fill={LEVEL_ONE_THEME.colors.void} />

          {/* Right-Facing Play Triangle */}
          <path
            d="M 12 8 L 36 23 L 12 38 Z"
            fill={playIgniteT > 0.5 ? LEVEL_ONE_THEME.colors.white : LEVEL_ONE_THEME.colors.orange}
            stroke={LEVEL_ONE_THEME.colors.orangeHot}
            strokeWidth="1.5"
            style={{
              filter:
                playGlow > 0
                  ? `drop-shadow(0 0 6px ${LEVEL_ONE_THEME.colors.orangeHot}) drop-shadow(0 0 16px ${LEVEL_ONE_THEME.colors.orange})`
                  : 'none',
              transform: `scale(${0.7 + playIgniteT * 0.3})`,
              transformOrigin: '20px 23px',
            }}
          />
        </g>

        {/* ---------------- KINETIC LIGHTNING BOLT (⚡) ON 'n' ---------------- */}
        {/* Attached to bottom-right leg of 'n' at x=280, y=210 */}
        <g transform="translate(254, 185)">
          {/* Outer glow stroke */}
          <path
            d="M 28 32 L 20 62 L 40 58 L 16 102"
            fill="none"
            stroke={LEVEL_ONE_THEME.colors.cyan}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="miter"
            strokeDasharray="160"
            strokeDashoffset={boltDashoffset}
            opacity={boltT > 0 ? 0.35 : 0}
          />

          {/* Core lightning bolt discharge */}
          <path
            d="M 28 32 L 20 62 L 40 58 L 16 102"
            fill="none"
            stroke={boltColor}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="miter"
            strokeDasharray="160"
            strokeDashoffset={boltDashoffset}
            style={{
              filter: `drop-shadow(0 0 6px ${LEVEL_ONE_THEME.colors.orangeHot}) drop-shadow(0 0 20px ${LEVEL_ONE_THEME.colors.orange})`,
            }}
          />

          {/* Hot white discharge tip */}
          {boltT > 0.1 && (
            <circle
              cx="16"
              cy="102"
              r={boltT * 4.5}
              fill={LEVEL_ONE_THEME.colors.white}
              style={{
                filter: `drop-shadow(0 0 8px ${LEVEL_ONE_THEME.colors.cyanHot})`,
              }}
            />
          )}
        </g>
      </svg>
    </div>
  );
};
