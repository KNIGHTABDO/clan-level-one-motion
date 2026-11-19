import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {LEVEL_ONE_THEME} from '../utils/levelOneTheme';
import {computeSpring, L1_SPRINGS, clamp, span} from '../utils/levelOneMotion';

export const LevelOneTelemetry: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  const isVertical = height > width;
  const padTop = isVertical ? 150 : 70;
  const padBottom = isVertical ? 160 : 70;
  const padSide = isVertical ? 70 : 90;

  // Staggered entry from F8 to F24
  const sTopLeft = computeSpring(frame, 8, fps, L1_SPRINGS.TACTICAL_SNAP);
  const sTopRight = computeSpring(frame, 12, fps, L1_SPRINGS.TACTICAL_SNAP);
  const sBottom = computeSpring(frame, 16, fps, L1_SPRINGS.TACTICAL_SNAP);
  const sBrackets = computeSpring(frame, 6, fps, L1_SPRINGS.TACTICAL_SNAP);

  // Exit transition at phase 4 hand-off (F228-F236)
  const fadeOut = 1 - span(frame, 230, 238);

  // Blinking REC dot (cyan #27DDC0), 1.5 Hz pulse
  const recBlink = Math.sin((frame / fps) * Math.PI * 3) > 0;

  if (frame < 6 || fadeOut <= 0) return null;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity: fadeOut,
        fontFamily: LEVEL_ONE_THEME.fonts.telemetry,
        fontSize: isVertical ? 13 : 14,
        letterSpacing: '0.16em',
        color: LEVEL_ONE_THEME.colors.white,
      }}
    >
      {/* Corner Brackets */}
      <div
        style={{
          position: 'absolute',
          top: padTop - 20,
          left: padSide - 20,
          width: 24,
          height: 24,
          borderTop: `1.5px solid ${LEVEL_ONE_THEME.colors.slateLight}`,
          borderLeft: `1.5px solid ${LEVEL_ONE_THEME.colors.slateLight}`,
          opacity: sBrackets * 0.65,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: padTop - 20,
          right: padSide - 20,
          width: 24,
          height: 24,
          borderTop: `1.5px solid ${LEVEL_ONE_THEME.colors.slateLight}`,
          borderRight: `1.5px solid ${LEVEL_ONE_THEME.colors.slateLight}`,
          opacity: sBrackets * 0.65,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: padBottom - 20,
          left: padSide - 20,
          width: 24,
          height: 24,
          borderBottom: `1.5px solid ${LEVEL_ONE_THEME.colors.slateLight}`,
          borderLeft: `1.5px solid ${LEVEL_ONE_THEME.colors.slateLight}`,
          opacity: sBrackets * 0.65,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: padBottom - 20,
          right: padSide - 20,
          width: 24,
          height: 24,
          borderBottom: `1.5px solid ${LEVEL_ONE_THEME.colors.slateLight}`,
          borderRight: `1.5px solid ${LEVEL_ONE_THEME.colors.slateLight}`,
          opacity: sBrackets * 0.65,
        }}
      />

      {/* Top Left: Riyadh Coordinates */}
      <div
        style={{
          position: 'absolute',
          top: padTop,
          left: padSide,
          opacity: sTopLeft * 0.65,
          transform: `translateY(${(1 - sTopLeft) * -8}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: LEVEL_ONE_THEME.colors.orange,
            boxShadow: LEVEL_ONE_THEME.glows.orangeCore,
          }}
        />
        <span>RIYADH // 24.7136° N, 46.6753° E</span>
      </div>

      {/* Top Right: Founding / Villa */}
      <div
        style={{
          position: 'absolute',
          top: padTop,
          right: padSide,
          opacity: sTopRight * 0.65,
          transform: `translateY(${(1 - sTopRight) * -8}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textAlign: 'right',
        }}
      >
        <span>EST. 2021 // MT.RP → VILLA L1</span>
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: LEVEL_ONE_THEME.colors.cyan,
            boxShadow: LEVEL_ONE_THEME.glows.cyanCore,
          }}
        />
      </div>

      {/* Bottom Center: Live REC & Clan Unit Status */}
      <div
        style={{
          position: 'absolute',
          bottom: padBottom,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
          opacity: sBottom * 0.75,
          transform: `translateY(${(1 - sBottom) * 8}px)`,
        }}
      >
        <span style={{color: LEVEL_ONE_THEME.colors.slateLight}}>SYS:READY</span>
        <span style={{color: LEVEL_ONE_THEME.colors.slateLight}}>|</span>
        <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: recBlink ? LEVEL_ONE_THEME.colors.cyan : 'transparent',
              boxShadow: recBlink ? LEVEL_ONE_THEME.glows.cyanCore : 'none',
              transition: 'background-color 0.1s ease',
            }}
          />
          <span style={{color: recBlink ? LEVEL_ONE_THEME.colors.white : LEVEL_ONE_THEME.colors.slateLight}}>
            REC
          </span>
        </div>
        <span style={{color: LEVEL_ONE_THEME.colors.white}}>[04.22.2026]</span>
        <span style={{color: LEVEL_ONE_THEME.colors.slateLight}}>//</span>
        <span style={{color: LEVEL_ONE_THEME.colors.orange}}>UNIT 46</span>
      </div>
    </AbsoluteFill>
  );
};
