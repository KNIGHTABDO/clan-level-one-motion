import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {LevelOneBackground} from './components/LevelOneBackground';
import {LevelOneTelemetry} from './components/LevelOneTelemetry';
import {LevelOneTypography} from './components/LevelOneTypography';
import {LevelOneLogo} from './components/LevelOneLogo';
import {LevelOneStayOne} from './components/LevelOneStayOne';
import {LevelOnePostFx} from './components/LevelOnePostFx';
import {LevelOneOutro} from './components/LevelOneOutro';
import {LEVEL_ONE_THEME} from './utils/levelOneTheme';
import {clamp, ignitionIn, span} from './utils/levelOneMotion';

export interface LevelOneDemoProps {
  audioTrack?: 'redrum' | 'titan';
}

export const LevelOneDemo: React.FC<LevelOneDemoProps> = ({audioTrack = 'redrum'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // Phase 3 Brand Stamp Camera Inertia Drift (F152 - F228: 1.00 -> 1.025)
  const driftProgress = span(frame, 152, 228);
  const stampDrift = 1.0 + driftProgress * 0.025;

  // Phase 4 Velocity Hand-Off (F228 - F236)
  // Scale-punch along downward-right vector inherited from the lightning bolt
  const handOffT = ignitionIn(span(frame, 228, 236), 2.5);
  const handOffOpacity = 1 - handOffT;
  const handOffScale = stampDrift + handOffT * 0.22;
  const handOffX = handOffT * 48; // Vector translation X
  const handOffY = handOffT * 96; // Vector translation Y

  // Determine which audio asset to serve
  const audioFile = audioTrack === 'titan' ? 'audio/titan.mp3' : 'audio/redrum.mp3';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: LEVEL_ONE_THEME.colors.void,
        overflow: 'hidden',
      }}
    >
      {/* Master Audio Track */}
      <Audio src={staticFile(audioFile)} />

      {/* Camera Recoil, Chromatic Shock & Flash Pipeline */}
      <LevelOnePostFx>
        {/* Background Obsidian Void, 24fps Grain, Engineering Grid */}
        <LevelOneBackground />

        {/* Riyadh Telemetry HUD & Status Chrome */}
        <LevelOneTelemetry />

        {/* Phase 1 & 2: Horizon Seam, Bilingual Reveals, Compression Inhale */}
        <LevelOneTypography />

        {/* Phase 3: Stacked Isometric Logo + #StayOne ☝️ Brand Stamp */}
        {frame >= 151 && frame < 238 && (
          <AbsoluteFill
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              opacity: handOffOpacity,
              transform: `translate3d(${handOffX}px, ${handOffY}px, 0)`,
            }}
          >
            <LevelOneLogo scaleDrift={handOffScale} />
            <LevelOneStayOne scaleDrift={handOffScale} />
          </AbsoluteFill>
        )}

        {/* Phase 4: Velocity Hand-Off & Dialogue Cold Open Scene */}
        <LevelOneOutro />
      </LevelOnePostFx>
    </AbsoluteFill>
  );
};
