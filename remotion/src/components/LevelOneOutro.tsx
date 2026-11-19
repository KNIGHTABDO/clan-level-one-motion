import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {LEVEL_ONE_THEME} from '../utils/levelOneTheme';
import {clamp, expoOut, span} from '../utils/levelOneMotion';

export const LevelOneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // Active from F235 to F270
  if (frame < 235) return null;

  const isVertical = height > width;

  // Cut-in reveal from F236
  const cutT = expoOut(span(frame, 236, 242));
  const sceneOpacity = clamp(cutT, 0, 1);

  // Unhurried camera push (scale: 1.00 -> 1.03)
  const driftProgress = span(frame, 236, 270);
  const cameraScale = 1.0 + driftProgress * 0.035;

  // Subtitle reveal (F238 onwards)
  const subT = expoOut(span(frame, 238, 250));
  const subTranslateY = (1 - subT) * 16;
  const subOpacity = clamp(subT, 0, 1);

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        opacity: sceneOpacity,
        pointerEvents: 'none',
      }}
    >
      {/* Cinematic Cold Open Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: '50% 50%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(255, 107, 0, 0.18) 0%, rgba(15, 16, 20, 0.95) 60%, #070708 100%)',
          }}
        />

        {/* Cinematic Darkness & Vignette Gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.2) 60%, rgba(10,10,10,0.92) 100%)',
          }}
        />
      </div>

      {/* Chapter Telemetry Stamp */}
      <div
        style={{
          position: 'absolute',
          top: isVertical ? 180 : 90,
          left: isVertical ? 70 : 90,
          fontFamily: LEVEL_ONE_THEME.fonts.telemetry,
          fontSize: isVertical ? 13 : 15,
          color: LEVEL_ONE_THEME.colors.slateLight,
          letterSpacing: '0.18em',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            backgroundColor: LEVEL_ONE_THEME.colors.orange,
            boxShadow: LEVEL_ONE_THEME.glows.orangeCore,
          }}
        />
        <span>ACT I // THE FOUNDATION</span>
        <span style={{color: LEVEL_ONE_THEME.colors.white}}>04.22.2026</span>
      </div>

      {/* Streamer Spoken Dialogue Subtitle Lockup (Section 4.1 Tier 4) */}
      <div
        style={{
          position: 'absolute',
          bottom: isVertical ? 220 : 120,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: isVertical ? 40 : 120,
          paddingRight: isVertical ? 40 : 120,
          transform: `translateY(${subTranslateY}px)`,
          opacity: subOpacity,
        }}
      >
        {/* Subtle dark backdrop pill scrim */}
        <div
          style={{
            backgroundColor: 'rgba(10, 10, 10, 0.75)',
            border: `1px solid ${LEVEL_ONE_THEME.colors.slate}`,
            borderRadius: 6,
            padding: isVertical ? '14px 24px' : '16px 36px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {/* Spoken Arabic Quote */}
          <div
            style={{
              fontFamily: LEVEL_ONE_THEME.fonts.editorialArabic,
              fontSize: isVertical ? 24 : 28,
              fontWeight: 600,
              color: LEVEL_ONE_THEME.colors.white,
              direction: 'rtl',
              textAlign: 'center',
              letterSpacing: '0em',
              textShadow: LEVEL_ONE_THEME.glows.whiteText,
              lineHeight: 1.4,
            }}
          >
            "إذا تبي تبدأ، تقدر تبدأ بأي وقت.. بس إذا تبي تنجح، لازم تشتغل."
          </div>

          {/* Speaker Attribution */}
          <div
            style={{
              fontFamily: LEVEL_ONE_THEME.fonts.telemetry,
              fontSize: isVertical ? 12 : 13,
              color: LEVEL_ONE_THEME.colors.orange,
              letterSpacing: '0.14em',
              direction: 'rtl',
            }}
          >
            — أبو سعود // ABU SAUD (FOUNDER)
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
