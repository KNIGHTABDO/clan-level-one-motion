import {spring} from 'remotion';

export const clamp = (v: number, min = 0, max = 1): number => Math.min(max, Math.max(min, v));

export const span = (v: number, a: number, b: number): number => clamp((v - a) / (b - a), 0, 1);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

// Cubic bezier / easing models
export const expoOut = (t: number): number => {
  const c = clamp(t, 0, 1);
  return c === 1 ? 1 : 1 - Math.pow(2, -10 * c);
};

export const whipSnap = (t: number): number => {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

export const ignitionIn = (t: number, p = 3): number => {
  return Math.pow(clamp(t, 0, 1), p);
};

export const smootherStep = (t: number): number => {
  const x = clamp(t, 0, 1);
  return x * x * x * (x * (6 * x - 15) + 10);
};

export const exponentialDecay = (frame: number, decayRate = 0.38): number => {
  return Math.exp(-decayRate * Math.max(0, frame));
};

// Screen shake impulse strictly obeying Anti-Slop Rule 1
// Max duration: 8-12 frames (133-200ms)
// Max translation: ±12px decaying via e^(-0.38*frame)
// Max rotation: ±0.7 deg
export const getImpulseShake = (frame: number, impactFrame: number, maxAmp = 11) => {
  const elapsed = frame - impactFrame;
  if (elapsed < 0 || elapsed > 12) return {x: 0, y: 0, rot: 0};
  const decay = exponentialDecay(elapsed, 0.38);
  const sign = elapsed % 2 === 0 ? 1 : -1;
  const dampY = Math.sin(elapsed * 1.7) * maxAmp * decay;
  const dampX = sign * (maxAmp * 0.35) * decay;
  const dampRot = sign * 0.65 * decay;
  return {x: dampX, y: dampY, rot: dampRot};
};

// Chromatic Aberration strictly obeying Anti-Slop Rule 2
// Max 3 frames spike on brand impact, snapping to 0
export const getStrikeChroma = (frame: number, impactFrame: number, maxPx = 3.5): number => {
  const elapsed = frame - impactFrame;
  if (elapsed < 0 || elapsed > 3) return 0;
  if (elapsed === 0) return maxPx;
  if (elapsed === 1) return maxPx * 0.55;
  if (elapsed === 2) return maxPx * 0.2;
  return 0;
};

// Calibrated Remotion Spring configurations (60 fps)
export const L1_SPRINGS = {
  HEAVY_STAMP: {
    mass: 0.85,
    stiffness: 280,
    damping: 26,
    overshootClamping: false,
  },
  TACTICAL_SNAP: {
    mass: 0.50,
    stiffness: 380,
    damping: 32,
    overshootClamping: true,
  },
  BALLISTIC_STRIKE: {
    mass: 0.60,
    stiffness: 450,
    damping: 24,
    overshootClamping: false,
  },
  EDITORIAL_SETTLE: {
    mass: 1.20,
    stiffness: 160,
    damping: 28,
    overshootClamping: true,
  },
} as const;

export type L1SpringConfig = {
  mass?: number;
  stiffness?: number;
  damping?: number;
  overshootClamping?: boolean;
};

export const computeSpring = (
  frame: number,
  delayFrame: number,
  fps = 60,
  config: L1SpringConfig = L1_SPRINGS.TACTICAL_SNAP
): number => {
  if (frame < delayFrame) return 0;
  return spring({
    frame: frame - delayFrame,
    fps,
    config,
  });
};
