// Edit 08 — SXB "flow edit" (MTRP prison-lab escape) on Woodkid "Run Boy Run" (file 8.6 s → 0). 24 fps, 1920x1080.
// Structure mirrors the Doctor Strange flow ref: held amber intro → darkness + light streaks → glitch → DROP 7.58 →
// beat-cut raid → eye punch-in through the pupil → escape → snare-build getaway → final hit on the skull mask → cold black + credit.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Warp08, P08, P0} from './Warp08';
import {warpCut} from './GlWarp';

export const FPS = 24, DUR_F = 835;
const W = 1920, H = 1080;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const mixf = (a: number, b: number, t: number) => a + (b - a) * t;
const span = (x: number, a: number, b: number) => clamp((x - a) / (b - a));
const io = (x: number) => {x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;};
const eout = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const hash = (i: number) => {const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s);};
const pulse = (t: number, at: number, a = .03, d = .3) => t < at - a ? 0 : t < at ? (t - at + a) / a : Math.exp(-(t - at) / d);

// extracted frame ranges (index = round(src*60)+1), see edits/08_shong_flow/tools/ranges.txt
const CL: Record<string, [number, number]> = {
  pod: [121, 300], face: [331, 480], aim: [61, 192], bow: [145, 282], storm: [361, 672], two: [1, 120], walk: [229, 372],
  shot: [145, 372], fire: [79, 204], eye: [181, 252], yardA: [169, 348], yardB: [559, 720], gate: [25, 744], road: [73, 276],
  leap: [478, 636], leapB: [889, 1038], hwyA: [85, 240], hwyB: [577, 660], hwyC: [709, 828], fin: [2125, 2235]};
const url = (clip: string, f: number) => staticFile(`s08/${clip}/${String(clamp(f, CL[clip][0], CL[clip][1])).padStart(5, '0')}.jpg`);

// monotone cubic time remap (Fritsch–Carlson): keys [tLocal, srcSec]
const mono = (k: number[][]) => {
  const n = k.length, x = k.map((p) => p[0]), y = k.map((p) => p[1]);
  const d = x.slice(0, -1).map((_, i) => (y[i + 1] - y[i]) / (x[i + 1] - x[i]));
  const m = x.map((_, i) => i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {m[i] = m[i + 1] = 0; continue;}
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) {const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i];}
  }
  return (t: number) => {
    if (t <= x[0]) return y[0] + m[0] * (t - x[0]);
    if (t >= x[n - 1]) return y[n - 1] + m[n - 1] * (t - x[n - 1]);
    let i = 0; while (t > x[i + 1]) i++;
    const h = x[i + 1] - x[i], s = (t - x[i]) / h, s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * y[i] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * y[i + 1] + (s3 - s2) * h * m[i + 1];
  };
};

type Grade = {con: number; sat: number; lift: number; tint: [number, number, number]; vig: number};
const G: Record<string, Grade> = {
  amber: {con: 1.12, sat: .8, lift: -.03, tint: [1.08, .97, .82], vig: .55},
  raid: {con: 1.22, sat: .88, lift: -.05, tint: [1.07, .98, .85], vig: .55},
  court: {con: 1.25, sat: .95, lift: -.05, tint: [1.06, 1.0, .9], vig: .5},
  eye: {con: 1.2, sat: .85, lift: -.05, tint: [1.05, .98, .88], vig: .6},
  night: {con: 1.08, sat: .85, lift: .015, tint: [.93, .99, 1.08], vig: .5},
  cold: {con: 1.15, sat: .85, lift: -.03, tint: [.86, .98, 1.12], vig: .5},
  sun: {con: 1.12, sat: 1.1, lift: -.03, tint: [1.07, 1.0, .88], vig: .45},
  teal: {con: 1.22, sat: .55, lift: -.05, tint: [.9, 1.02, 1.06], vig: .6},
};

type Shot = {t0: number; t1: number; clip: string; keys: number[][]; c: [number, number]; z: [number, number] | ((lt: number) => number);
  g: string; echo?: number; bloom?: (lt: number) => number; lock?: boolean};
const SHOTS: Shot[] = [
  {t0: 0, t1: 2.70, clip: 'pod', keys: [[0, 2.4], [2.1, 4.1], [2.7, 4.95]], c: [.5, .5], z: [1.0, 1.14], g: 'amber'},
  {t0: 2.70, t1: 4.10, clip: 'face', keys: [[0, 5.6], [1.4, 7.4]], c: [.19, .32], z: [1.12, 1.3], g: 'amber', lock: true},
  {t0: 4.10, t1: 5.67, clip: 'aim', keys: [[0, 1.15], [.35, 1.6], [1.25, 2.45], [1.57, 3.1]], c: [.5, .45], z: [1.04, 1.16], g: 'amber'},
  {t0: 5.67, t1: 7.25, clip: 'bow', keys: [[0, 2.6], [1.0, 3.6], [1.5, 4.08], [1.55, 4.2], [1.58, 4.3]], c: [.625, .33], z: [1.0, 1.55], g: 'amber', lock: true},
  // DROP 7.58 — beat grid 0.4394
  {t0: 7.58, t1: 8.46, clip: 'storm', keys: [[0, 6.4], [.25, 6.6], [.88, 7.9]], c: [.5, .45], z: (lt) => 1.04 + .06 * lt + .3 * Math.exp(-lt / .12), g: 'raid'},
  {t0: 8.46, t1: 9.34, clip: 'storm', keys: [[0, 9.4], [.45, 9.95], [.88, 10.9]], c: [.55, .45], z: [1.05, 1.15], g: 'raid'},
  {t0: 9.34, t1: 10.22, clip: 'two', keys: [[0, .1], [.88, 1.6]], c: [.5, .4], z: [1.06, 1.2], g: 'raid'},
  {t0: 10.22, t1: 11.10, clip: 'walk', keys: [[0, 4.0], [.88, 5.9]], c: [.4, .45], z: [1.04, 1.14], g: 'raid'},
  {t0: 11.10, t1: 13.73, clip: 'shot', keys: [[0, 2.6], [1.0, 3.5], [1.75, 4.2], [1.95, 4.35], [2.63, 5.9]], c: [.42, .45], lock: true,
    z: (lt) => 1 + .35 * io(lt / 1.75) + (lt > 1.75 ? .22 * Math.exp(-(lt - 1.75) / .15) : 0), g: 'raid'},
  {t0: 13.73, t1: 14.37, clip: 'fire', keys: [[0, 1.5], [.64, 3.0]], c: [.5, .45], z: [1.08, 1.18], g: 'raid'},
  {t0: 14.37, t1: 15.2, clip: 'eye', keys: [[0, 3.25], [.83, 3.85]], c: [.174, .513], lock: true,
    z: (lt) => lt < .16 ? 1.3 + .3 * lt : lt < .25 ? 1.9 + .5 * (lt - .16) : 2.6 * Math.pow(3.2, io(span(lt, .25, .72))), g: 'eye'},
  {t0: 15.2, t1: 16.37, clip: 'yardA', keys: [[0, 3.0], [1.17, 5.4]], c: [.45, .5], z: [1.0, 1.18], g: 'night', bloom: (lt) => .5 + .5 * span(lt, .6, 1.17)},
  {t0: 16.37, t1: 17.69, clip: 'yardB', keys: [[0, 9.45], [.4, 10.2], [1.32, 11.9]], c: [.5, .5], z: [1.12, 1.02], g: 'court', echo: .3},
  {t0: 17.69, t1: 19.88, clip: 'gate', keys: [[0, .6], [1.5, 3.0], [2.19, 5.0]], c: [.45, .45], z: [1.0, 1.12], g: 'cold'},
  {t0: 19.88, t1: 21.64, clip: 'gate', keys: [[0, 5.6], [1.76, 12.2]], c: [.43, .42], z: (lt) => 1 + 1.3 * Math.pow(span(lt, 0, 1.76), 2.2), g: 'cold', echo: .25},
  // BUILD 21.64 (snare roll) → HIT 28.67
  {t0: 21.64, t1: 23.40, clip: 'road', keys: [[0, 1.3], [1.76, 4.4]], c: [.5, .55], z: [1.15, 1.0], g: 'sun'},
  {t0: 23.40, t1: 25.60, clip: 'leap', keys: [[0, 7.96], [.45, 8.2], [1.35, 8.6], [2.2, 10.5]], c: [.5, .6], z: [1.0, 1.12], g: 'sun'},
  {t0: 25.60, t1: 26.48, clip: 'hwyA', keys: [[0, 1.5], [.88, 3.9]], c: [.5, .5], z: [1.02, 1.12], g: 'sun'},
  {t0: 26.48, t1: 26.92, clip: 'hwyB', keys: [[0, 9.7], [.44, 10.9]], c: [.5, .5], z: [1.1, 1.0], g: 'sun'},
  {t0: 26.92, t1: 27.36, clip: 'leapB', keys: [[0, 15.0], [.44, 16.4]], c: [.5, .55], z: [1.02, 1.12], g: 'sun'},
  {t0: 27.36, t1: 27.80, clip: 'hwyC', keys: [[0, 12.0], [.44, 13.6]], c: [.5, .5], z: [1.1, 1.0], g: 'sun'},
  {t0: 27.80, t1: 28.67, clip: 'fin', keys: [[0, 35.5], [.87, 36.72]], c: [.3, .5], z: [1.0, 1.1], g: 'teal'},
  {t0: 28.67, t1: 30.25, clip: 'fin', keys: [[0, 36.72], [1.58, 37.1]], c: [.22, .55],
    z: (lt) => 1.12 + .25 * Math.exp(-lt / .1) + .33 * io(span(lt, .1, 1.58)), g: 'teal', lock: true, echo: .35, bloom: (lt) => span(lt, .9, 1.55)},
];

type Cut = {t: number; k: 'pinch' | 'whip' | 'zoom'; d?: [number, number]; pre: number; post: number};
const CUTS: Cut[] = [
  {t: 2.70, k: 'zoom', pre: .3, post: .45}, {t: 4.10, k: 'whip', d: [1, 0], pre: .25, post: .4}, {t: 5.67, k: 'zoom', pre: .3, post: .45},
  {t: 7.58, k: 'zoom', pre: 0, post: .45}, {t: 8.46, k: 'whip', d: [1, 0], pre: .2, post: .3}, {t: 9.34, k: 'whip', d: [1, 0], pre: .2, post: .3},
  {t: 10.22, k: 'pinch', pre: .2, post: .3}, {t: 11.10, k: 'whip', d: [1, 0], pre: .2, post: .35}, {t: 13.73, k: 'whip', d: [-1, 0], pre: .2, post: .3},
  {t: 16.37, k: 'zoom', pre: .25, post: .4}, {t: 17.69, k: 'whip', d: [1, 0], pre: .25, post: .4}, {t: 19.88, k: 'zoom', pre: .25, post: .4},
  {t: 21.64, k: 'zoom', pre: .3, post: .45}, {t: 23.40, k: 'pinch', pre: .25, post: .35}, {t: 25.60, k: 'whip', d: [1, 0], pre: .2, post: .3},
  {t: 26.48, k: 'whip', d: [-1, 0], pre: .08, post: .12}, {t: 26.92, k: 'whip', d: [1, 0], pre: .08, post: .12}, {t: 27.36, k: 'whip', d: [-1, 0], pre: .08, post: .12},
  {t: 27.80, k: 'zoom', pre: .2, post: .3}, {t: 28.67, k: 'zoom', pre: .25, post: .45},
];

// global exposure: fades, flashes, pupil blackout, final white-out
const expoAt = (t: number) => {
  let e = -(1 - eout(span(t, 0, .53)));                                       // fade in from black
  e += .5 * pulse(t, 7.17, .03, .08) + .45 * pulse(t, 9.34, .01, .1);                                          // bow release spark
  e += 1.1 * pulse(t, 7.58, .01, .14) + .6 * pulse(t, 12.85, .01, .08);       // drop, gunshot
  e -= t > 14.37 ? span(t, 14.95, 15.06) * (1 - span(t, 15.2, 15.36)) : 0;     // through the pupil into black
  e += .9 * pulse(t, 16.37, .03, .12) + 1.0 * pulse(t, 28.67, .01, .12);      // white flash, final hit
  e += t > 29.5 ? 1.2 * io(span(t, 29.5, 30.2)) : 0;                          // white bloom out
  return e;
};

const Streaks: React.FC<{t: number; f: number}> = ({t, f}) => {
  const on = span(t, 7.25, 7.29) * (1 - span(t, 7.41, 7.45));
  const k = Math.floor(f / 2);
  return <AbsoluteFill style={{background: '#000'}}>
    {Array.from({length: 7}, (_, i) => {
      const h = hash(k * 13 + i), vis = hash(k * 7 + i * 3) > .35;
      if (!vis) return null;
      const y = 120 + hash(i * 5.1 + k * .37) * 840, w = 300 + h * 1300, x = hash(k * 3 + i * 11) * (W - w);
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: 2 + h * 7, opacity: on * (.35 + .65 * hash(f * 1.7 + i)),
        background: 'linear-gradient(90deg, rgba(255,190,110,0), rgba(255,220,170,.95) 50%, rgba(255,190,110,0))'}}/>;
    })}
  </AbsoluteFill>;
};

const Glitch: React.FC<{t: number; f: number}> = ({t, f}) => {
  if (t < 7.45 || t >= 7.58) return null;
  const src = url('storm', Math.round(6.4 * 60) + 1), src2 = url('bow', Math.round(4.2 * 60) + 1);
  return <AbsoluteFill style={{background: '#000'}}>
    {Array.from({length: 16}, (_, i) => {
      const r = (n: number) => hash(f * 31 + i * 7 + n);
      const w = 80 + r(1) * 520, h = 20 + r(2) * 140, x = r(3) * (W - w), y = r(4) * (H - h), dx = (r(5) - .5) * 160;
      const tint = ['rgba(0,255,255,.22)', 'rgba(255,0,180,.22)', 'rgba(255,255,255,0)'][i % 3];
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden',
        backgroundImage: `linear-gradient(${tint}, ${tint}), url(${r(6) > .3 ? src : src2})`, backgroundSize: `auto, ${W}px ${H}px`,
        backgroundPosition: `0 0, ${-x + dx}px ${-y}px`, opacity: .9}}/>;
    })}
  </AbsoluteFill>;
};

export const Flow08: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const shot = SHOTS.find((s) => t >= s.t0 && t < s.t1);
  let layer: React.ReactNode = null;
  if (shot) {
    const lt = t - shot.t0, src = mono(shot.keys)(lt), fr = src * 60, i0 = Math.floor(fr);
    const zs = typeof shot.z === 'function' ? shot.z(lt) : mixf(shot.z[0], shot.z[1], io(lt / (shot.t1 - shot.t0)));
    const g = G[shot.g];
    const cut = CUTS.find((c) => t >= c.t - c.pre && t < c.t + c.post);
    const wc = cut ? warpCut(t < cut.t ? (t - cut.t) / cut.pre : (t - cut.t) / cut.post, cut.k, cut.d ?? [1, 0], cut.t) : null;
    const bw = shot.clip === 'fin' && t >= 28.67 ? 1 - span(t, 28.8, 29.05) : t >= 12.85 && t < 12.93 ? 1 : 0;
    // centre-lock: drift the subject toward frame centre as far as the zoom allows without exposing mirrored edges
    const lk = (e: number) => shot.lock && Math.abs(e - .5) > .01 ? clamp((zs - 1) * Math.min(e, 1 - e) / Math.abs(.5 - e)) * (e - .5) / zs : 0;
    const p: P08 = {
      ...P0,
      mix: fr - i0, scale: zs * (wc?.scale ?? 1), center: shot.c, warp: wc?.warp ?? 0, zb: wc?.zoomBlur ?? 0, dir: wc?.dir ?? [0, 0],
      shake: [(wc?.shake[0] ?? 0) + lk(shot.c[0]), (wc?.shake[1] ?? 0) + lk(shot.c[1])], rot: 0, expo: (wc?.expo ?? 0) + expoAt(t), ca: wc?.ca ?? 0,
      con: g.con, sat: g.sat, lift: g.lift, tint: g.tint, bw, vig: g.vig, bloom: shot.bloom ? shot.bloom(lt) : .15, echo: shot.echo ?? 0,
      grain: .045, seed: f % 13,
    };
    const echoF = Math.round((src - .12) * 60) + 1;
    layer = <Warp08 a={url(shot.clip, i0 + 1)} b={url(shot.clip, i0 + 2)} c={shot.echo ? url(shot.clip, echoF) : undefined} p={p} width={W} height={H}/>;
  }
  const white = t > 29.6 && t < 30.25 ? io(span(t, 29.75, 30.2)) : 0;
  const toBlack = t >= 30.25 ? 1 : 0;
  const card = span(t, 30.8, 31.4) * (1 - span(t, 34.0, 34.75));
  return <AbsoluteFill style={{background: '#000'}}>
    {layer}
    {t >= 7.25 && t < 7.45 && <Streaks t={t} f={f}/>}
    <Glitch t={t} f={f}/>
    <AbsoluteFill style={{background: '#33ffff', mixBlendMode: 'screen', opacity: .55 * pulse(t, 8.73, .01, .05)}}/>
    <AbsoluteFill style={{background: '#ff40d0', mixBlendMode: 'screen', opacity: .5 * pulse(t, 8.84, .01, .05)}}/>
    <AbsoluteFill style={{background: '#fff', opacity: white}}/>
    {toBlack > 0 && <AbsoluteFill style={{background: '#000'}}/>}
    {t < 30.25 && <div style={{position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center', fontFamily: 'Teko', fontWeight: 400, fontSize: 26,
      letterSpacing: '0.9em', color: 'rgba(255,255,255,.22)', transform: 'skewX(-12deg)', paddingLeft: '0.9em'}}>TOWN</div>}
    {card > 0 && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: 'Teko', fontWeight: 400, fontSize: 82, letterSpacing: '0.3em', paddingLeft: '0.3em', color: '#fff', opacity: card,
        transform: `scale(${1 + .03 * span(t, 30.8, 34.75)})`}}>© 2026 TOWN COPYRIGHT RESERVED</div>
    </AbsoluteFill>}
    <Audio src={staticFile('s08/mix.wav')}/>
  </AbsoluteFill>;
};
