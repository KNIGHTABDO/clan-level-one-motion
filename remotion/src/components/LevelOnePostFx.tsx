import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {LEVEL_ONE_THEME} from '../utils/levelOneTheme';
import {getImpulseShake, getStrikeChroma} from '../utils/levelOneMotion';

interface LevelOnePostFxProps {
  children: React.ReactNode;
}

export const LevelOnePostFx: React.FC<LevelOnePostFxProps> = ({children}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // Screen shake on brand stamp impact (F152)
  const shake = getImpulseShake(frame, 152, 11);

  // Transient 3-frame chromatic aberration spike (F152 - F154)
  const chroma = getStrikeChroma(frame, 152, 3.5);

  // Ignition Flash (F150: 1-frame flash, F151: hard black snap)
  const isFlashFrame = frame === 150;
  const isBlackSnap = frame === 151;

  // Anamorphic horizontal streak (F150 - F153)
  const streakActive = frame >= 150 && frame <= 153;
  const streakOpacity = streakActive ? (1 - (frame - 150) / 4) : 0;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {/* Shaken World Container */}
      <AbsoluteFill
        style={{
          transform: `translate3d(${shake.x}px, ${shake.y}px, 0) rotate(${shake.rot}deg)`,
          transformOrigin: '50% 50%',
          willChange: 'transform',
        }}
      >
        {children}

        {/* Transient 3-frame Chromatic Aberration fringe (Rule 2) */}
        {chroma > 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              boxShadow: `inset ${chroma}px 0 0 rgba(236, 89, 22, 0.4), inset -${chroma}px 0 0 rgba(39, 221, 192, 0.4)`,
              mixBlendMode: 'screen',
            }}
          />
        )}
      </AbsoluteFill>

      {/* Frame 150: Ignition Flash + Radial Burst */}
      {isFlashFrame && (
        <AbsoluteFill
          style={{
            backgroundColor: '#FFFFFF',
            mixBlendMode: 'screen',
            opacity: 0.88,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 50%, rgba(236,89,22,0.65) 0%, rgba(255,138,76,0.3) 40%, transparent 75%)',
            }}
          />
        </AbsoluteFill>
      )}

      {/* Frame 151: Hard Black Snap (1 frame) */}
      {isBlackSnap && (
        <AbsoluteFill
          style={{
            backgroundColor: LEVEL_ONE_THEME.colors.void,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Anamorphic Horizontal Streak (F150 - F153) */}
      {streakOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: height / 2 - 1,
            left: 0,
            width: width,
            height: 2.5,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(236,89,22,0.2) 20%, #FCFEFE 50%, rgba(236,89,22,0.2) 80%, transparent 100%)',
            boxShadow: LEVEL_ONE_THEME.glows.orangeCore,
            opacity: streakOpacity,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
