import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {LEVEL_ONE_THEME} from '../utils/levelOneTheme';
import {clamp, expoOut, ignitionIn, span, whipSnap} from '../utils/levelOneMotion';

export const LevelOneTypography: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const isVertical = height > width;
  const seamWidth = isVertical ? 720 : 1080;

  // Active window: F12 to F151
  if (frame < 12 || frame > 152) return null;

  // Phase 1: Horizon Seam Ignition (F12 - F42)
  const seamIgnitionT = whipSnap(span(frame, 12, 40));
  const seamScaleX = seamIgnitionT;

  // Faint pre-echo whisper (F40 - F72)
  const whisperOpacity = span(frame, 40, 50) * (1 - span(frame, 68, 74)) * 0.22;

  // Phase 2: Seam Split into Dual Rails (F72 - F94)
  const splitT = expoOut(span(frame, 72, 94));
  const railSeparation = splitT * (isVertical ? 92 : 120);
  const railOpacity = (1 - splitT * 0.75) * (frame >= 72 ? 1 : 0);

  // English Reveal (F74 - F108)
  const enT = expoOut(span(frame, 74, 108));
  const enTranslateY = (1 - enT) * 105; // emerges upward from seam
  const enTracking = 0.16 - enT * 0.10; // 0.16em -> 0.06em

  // Arabic Reveal (F80 - F114)
  const arT = expoOut(span(frame, 80, 114));
  const arTranslateY = -(1 - arT) * 105; // emerges downward from seam

  // Tagline RTL Clip Wipe (F108 - F138)
  const tagT = expoOut(span(frame, 108, 138));
  // RTL wipe: left edge moves from 100% to 0%
  const tagClipLeft = (1 - tagT) * 100;

  // Compression Inhale (F144 - F150)
  const inhaleT = ignitionIn(span(frame, 144, 150), 3);
  const overallScale = (1 + 0.03 * (frame / 144)) * (1 - inhaleT * 0.12);
  const overallOpacity = 1 - span(frame, 148, 151);

  // Compression flare at center (F147 - F150)
  const flareT = span(frame, 146, 150);
  const flareHeight = flareT * (isVertical ? 240 : 180);
  const flareOpacity = Math.sin(flareT * Math.PI) * 0.9;

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        opacity: overallOpacity,
        transform: `scale(${overallScale})`,
      }}
    >
      {/* Center Group */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Pre-Echo Whisper (من جمعة ستة .. إلى إمبراطورية) */}
        {frame < 74 && (
          <div
            style={{
              position: 'absolute',
              top: -54,
              fontFamily: LEVEL_ONE_THEME.fonts.editorialArabic,
              fontSize: isVertical ? 20 : 24,
              color: LEVEL_ONE_THEME.colors.white,
              opacity: whisperOpacity,
              letterSpacing: '0em',
              direction: 'rtl',
              textShadow: LEVEL_ONE_THEME.glows.whiteText,
            }}
          >
            من جمعة ستة .. إلى إمبراطورية
          </div>
        )}

        {/* Top Rail (Fractured Horizon Seam) */}
        <div
          style={{
            position: 'absolute',
            width: seamWidth,
            height: 1.5,
            backgroundColor: LEVEL_ONE_THEME.colors.white,
            boxShadow: LEVEL_ONE_THEME.glows.seamGlow,
            transform: `scaleX(${seamScaleX}) translateY(${-railSeparation}px)`,
            opacity: frame < 72 ? 1 : railOpacity,
          }}
        />

        {/* Latin Typography Container (Masked) */}
        <div
          style={{
            overflow: 'hidden',
            paddingBottom: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            height: isVertical ? 100 : 130,
            transform: `translateY(${frame < 72 ? 0 : -railSeparation * 0.55}px)`,
          }}
        >
          <h1
            style={{
              margin: 0,
              padding: 0,
              fontFamily: LEVEL_ONE_THEME.fonts.heroLatin,
              fontSize: isVertical ? 84 : 112,
              fontWeight: 900,
              color: LEVEL_ONE_THEME.colors.white,
              letterSpacing: `${enTracking}em`,
              textTransform: 'uppercase',
              lineHeight: 1.0,
              transform: `translateY(${enTranslateY}%)`,
              textShadow: LEVEL_ONE_THEME.glows.whiteText,
              willChange: 'transform',
            }}
          >
            LEVEL ONE
          </h1>
        </div>

        {/* Center Seam / Bottom Rail */}
        <div
          style={{
            position: 'absolute',
            width: seamWidth,
            height: 1.5,
            backgroundColor: LEVEL_ONE_THEME.colors.white,
            boxShadow: LEVEL_ONE_THEME.glows.seamGlow,
            transform: `scaleX(${seamScaleX}) translateY(${railSeparation}px)`,
            opacity: frame < 72 ? 1 : railOpacity,
          }}
        />

        {/* Arabic Typography Container (Masked) */}
        <div
          style={{
            overflow: 'hidden',
            paddingTop: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            height: isVertical ? 100 : 130,
            transform: `translateY(${frame < 72 ? 0 : railSeparation * 0.55}px)`,
          }}
        >
          <h2
            style={{
              margin: 0,
              padding: 0,
              fontFamily: LEVEL_ONE_THEME.fonts.heroArabic,
              fontSize: isVertical ? 96 : 128, // Optical scale 1.15x
              fontWeight: 900,
              color: LEVEL_ONE_THEME.colors.white,
              letterSpacing: '0em', // Strictly 0em for connected Arabic
              direction: 'rtl',
              lineHeight: 1.0,
              transform: `translateY(${arTranslateY}%)`,
              textShadow: LEVEL_ONE_THEME.glows.whiteText,
              willChange: 'transform',
            }}
          >
            كلان لفل ون
          </h2>
        </div>

        {/* Editorial Tagline Reveal (RTL Clip Mask) */}
        {frame >= 106 && (
          <div
            style={{
              marginTop: isVertical ? 42 : 36,
              fontFamily: LEVEL_ONE_THEME.fonts.editorialArabic,
              fontSize: isVertical ? 26 : 32,
              fontWeight: 600,
              direction: 'rtl',
              color: LEVEL_ONE_THEME.colors.white,
              clipPath: `inset(0 0 0 ${tagClipLeft}%)`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              letterSpacing: '0em',
              textShadow: LEVEL_ONE_THEME.glows.whiteText,
            }}
          >
            <span>نفس الاسماء .. بس</span>
            <span
              style={{
                color: LEVEL_ONE_THEME.colors.orange,
                fontWeight: 700,
                textShadow: LEVEL_ONE_THEME.glows.orangeCore,
              }}
            >
              الهدف أكبر
            </span>
            <span style={{fontSize: isVertical ? 22 : 26}}>☝🏼🧡</span>
          </div>
        )}

        {/* Inhale Center Compression Flare (F146 - F150) */}
        {flareOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              width: 3,
              height: flareHeight,
              backgroundColor: LEVEL_ONE_THEME.colors.white,
              boxShadow: LEVEL_ONE_THEME.glows.seamGlow,
              opacity: flareOpacity,
              borderRadius: 2,
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
