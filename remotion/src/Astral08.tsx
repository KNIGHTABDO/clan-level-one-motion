// Edit 08 v2 — 1:1 clone of the Doctor Strange "astral push" flow edit, recast: Abdulsamad (Strange) × Shabib (Ancient One).
// Runs on the REF'S OWN AUDIO, so every time below is a ref timestamp (verified on frames, see edits/08_shong_flow/PLAN.md).
// 1920x1080 @ 23.976. Shots = Flow clips / Sol stills as jpg sequences in public/s08v2/<clip>/NNNNN.jpg, rendered through Warp08.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {Warp08, P08, P0} from './Warp08';

export const FPS2 = 24000 / 1001, DUR2 = 721;
const W = 1920, H = 1080;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const mixf = (a: number, b: number, t: number) => a + (b - a) * t;
const span = (x: number, a: number, b: number) => clamp((x - a) / (b - a));
const io = (x: number) => {x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;};
const eout = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const hash = (i: number) => {const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s);};
const pulse = (t: number, at: number, a = .03, d = .3) => t < at - a ? 0 : t < at ? (t - at + a) / a : Math.exp(-(t - at) / d);

// clip -> frame count (24 fps sequences; stills have 1)
export const CL2: Record<string, number> = {ots: 96, front: 1, hand: 1, wide: 95, fore: 1, fall: 1};
const url = (clip: string, i: number) => staticFile(`s08v2/${clip}/${String(clamp(Math.round(i), 1, CL2[clip])).padStart(5, '0')}.jpg`);

type Grade = {con: number; sat: number; lift: number; tint: [number, number, number]; vig: number};
const amber: Grade = {con: 1.18, sat: .78, lift: -.04, tint: [1.1, .96, .78], vig: .6};
const gold: Grade = {con: 1.3, sat: 1.05, lift: -.06, tint: [1.15, .95, .7], vig: .55};

type Shot = {
  t0: number; t1: number; clip: string;
  src: (lt: number) => number;               // source seconds at local time
  z: (lt: number) => number; c: [number, number];
  g?: Grade; echo?: number | ((lt: number) => number); echoLag?: number;
  fx?: (t: number, lt: number) => Partial<P08>;
};
const lin = (a: number, rate = 1) => (lt: number) => a + lt * rate;
const zr = (a: number, b: number, d: number) => (lt: number) => mixf(a, b, io(lt / d));
const shakeAt = (t: number, amp: number, f = 0) => [(hash(f * 3.1 + 1) - .5) * amp, (hash(f * 5.7 + 2) - .5) * amp] as [number, number];

const SHOTS: Shot[] = [
  // 1. OTS onto Abdulsamad shouting "But I... see... through... YOU" — slow push
  {t0: 0, t1: 2.711, clip: 'ots', src: lin(.25), z: zr(1.0, 1.03, 2.71), c: [.62, .42]},
  // 2. Shabib front, hand on the chest, calm half-smile
  {t0: 2.711, t1: 3.378, clip: 'front', src: lin(0), z: zr(1.03, 1.08, .67), c: [.4, .45]},
  // 3. CU palm shove (motion blur in on the hit, then held pressure)
  {t0: 3.378, t1: 3.80, clip: 'hand', src: lin(0), z: (lt) => 1.06 + .12 * Math.exp(-lt / .07), c: [.45, .55],
    fx: (t, lt) => ({dir: [-.05 * Math.exp(-lt / .05), 0], shake: shakeAt(t, .012 * Math.exp(-lt / .12), Math.round(t * 24))})},
  // 4a. dark wide, the shove lands (burst at the chest 3.997), 4.08 near-black
  {t0: 3.80, t1: 4.13, clip: 'wide', src: lin(.25, 1.27), z: zr(1.30, 1.27, .33), c: [.48, .52],
    fx: (t) => ({expo: -.6 + .35 * pulse(t, 3.997, .02, .05) - .15 * span(t, 4.04, 4.08)})},
  // 4b. lit wide, astral body blasted out to the right — slow-mo with echo trails
  {t0: 4.13, t1: 5.497, clip: 'wide', src: lin(.88, .52), z: zr(1.24, 1.30, 1.37), c: [.5, .52], echo: .45, echoLag: .3, g: amber},
  // 5a. chromatic smear whip right (5.497 → 5.66)
  {t0: 5.497, t1: 5.663, clip: 'wide', src: lin(1.59, .52), z: (lt) => 1.30 + .1 * lt, c: [.5, .52], echo: .4,
    fx: (t, lt) => ({dir: [.28 * Math.sin(Math.PI * span(lt, 0, .166)), 0], ca: .012, expo: .15})},
  // 5b. back on the wide for 2 frames, then the blurred handheld two-shot (DROP 5.65)
  {t0: 5.663, t1: 5.747, clip: 'wide', src: lin(1.68, .52), z: lin(1.28, 0), c: [.5, .52], echo: .55, echoLag: .3},
  {t0: 5.747, t1: 6.506, clip: 'wide', src: lin(2.0, 1.0), z: zr(1.45, 1.55, .76), c: [.55, .12], echo: .7, echoLag: .18,
    fx: (t) => ({shake: shakeAt(t, .02, Math.round(t * 24)), dir: [.012, 0]})},
  // 6. forehead push, slow push-in
  {t0: 6.506, t1: 7.07, clip: 'fore', src: lin(0), z: zr(1.03, 1.1, .56), c: [.48, .45],
    fx: (t) => ({shake: shakeAt(t, .004, Math.round(t * 24))})},
  // 7. overhead fall into the light: bright, pulls away + rolls
  {t0: 7.07, t1: 7.17, clip: 'fall', src: lin(0), z: (lt) => 1.25 - 1.2 * lt, c: [.5, .55], fx: (t, lt) => ({expo: .35 - 2 * lt, rot: .05 + .4 * lt})},
  // 7b. darkness, tilted, falling (lights slide past)
  {t0: 7.17, t1: 7.55, clip: 'fall', src: lin(0), z: (lt) => 2.2 + 1.4 * lt, c: [.47, .62], fx: (t, lt) => ({expo: -.82, rot: .55 + .5 * lt, dir: [0, .03]})},
];

// ---------- procedural layers ----------
const Title: React.FC<{t: number}> = ({t}) => {
  if (t < .8 || t >= 3.47 || (t >= 2.16 && t < 2.24)) return null;
  const words = ['BUT', 'I', 'SEE', 'THROUGH', 'YOU.'], at = [.8, .88, 1.52, 2.24, 2.78];
  const n = at.filter((a) => t >= a).length;
  const op = 1 - span(t, 3.38, 3.47);
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', top: -36}}>
    <div style={{fontFamily: 'Teko', fontWeight: 400, fontSize: 64, color: '#f4f6ff', letterSpacing: '0.62em', paddingLeft: '0.62em', whiteSpace: 'pre',
      transform: 'skewX(-14deg)', opacity: op,
      textShadow: '0 0 6px rgba(220,230,255,.9), 0 0 18px rgba(170,190,255,.55), 0 0 2px #fff, 0 0 40px rgba(0,0,0,.95), 0 0 70px rgba(0,0,0,.9)'}}>
      {words.slice(0, n).join('  ')}
    </div>
  </AbsoluteFill>;
};

// chest burst on the shove + astral glow
const Burst: React.FC<{t: number}> = ({t}) => {
  const a = .35 * pulse(t, 3.997, .03, .06) + .25 * pulse(t, 4.15, .01, .25);
  if (a < .01) return null;
  return <AbsoluteFill style={{background: `radial-gradient(circle at 56% 47%, rgba(255,235,190,${a}) 0%, rgba(255,170,70,${.6 * a}) 9%, rgba(0,0,0,0) 30%)`, mixBlendMode: 'screen'}}/>;
};

// light streaks sliding past while falling (7.17–7.92)
const FallLights: React.FC<{t: number; f: number}> = ({t, f}) => {
  if (t < 7.17 || t >= 7.92) return null;
  const k = f;
  const haze = .55 * pulse(t, 7.587, .04, .06);
  return <AbsoluteFill>
    {Array.from({length: 6}, (_, i) => {
      const ph = (t * (1.6 + hash(i) * 1.4) + hash(i * 9)) % 1;
      const x = 380 + hash(i * 3.3) * 1100 - 500 * ph, y = 1080 * (1.1 - 1.3 * ph);
      const w = 6 + hash(i * 7) * 22, h = 50 + hash(i * 5) * 260;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: w,
        transform: 'rotate(28deg)', filter: 'blur(3px)', opacity: .6 + .4 * hash(k + i),
        background: 'linear-gradient(rgba(255,240,215,0), rgba(255,240,215,.95), rgba(255,240,215,0))'}}/>;
    })}
    {t > 7.75 && Array.from({length: 7}, (_, i) => <div key={'r' + i} style={{position: 'absolute', left: 1040 + hash(i * 2.2) * 420 + (t - 7.75) * 900, top: 380 + hash(i * 4.1) * 330,
      width: 70 + hash(i) * 120, height: 16 + hash(i * 3) * 18, borderRadius: 4, background: 'rgba(255,250,240,.9)', filter: 'blur(2px)'}}/>)}
    <AbsoluteFill style={{background: `rgba(255,236,200,${haze})`}}/>
  </AbsoluteFill>;
};

// blue/white pixel-streak flash into the tunnel (7.92–8.0)
const PixelRush: React.FC<{t: number; f: number}> = ({t, f}) => {
  if (t < 7.92 || t >= 8.003) return null;
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 0% 50%, #fbe6d8 0%, #4a3a5a 35%, #0b0a12 70%)'}}>
    {Array.from({length: 40}, (_, i) => {
      const r = (n: number) => hash(f * 17 + i * 13 + n);
      const y = r(1) * H, w = 40 + r(2) * 260, x = 300 + r(3) * 1500;
      const c = ['#3aa8ff', '#ffffff', '#ff6a40', '#c9d6ff'][i % 4];
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: 8 + r(4) * 40, background: c, opacity: .5 + .5 * r(5)}}/>;
    })}
    <div style={{position: 'absolute', left: -200, top: 380, width: 1500, height: 60, borderRadius: 60, background: '#3aa8ff', filter: 'blur(14px)', transform: 'rotate(-6deg)'}}/>
  </AbsoluteFill>;
};

// golden ring tunnel with the glowing tumbling figure (8.0–8.72)
const Tunnel: React.FC<{t: number}> = ({t}) => {
  if (t < 8.0 || t >= 8.72) return null;
  const lt = t - 8.0, cx = 330, cy = 560;
  return <AbsoluteFill style={{background: '#0a0603', overflow: 'hidden'}}>
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <defs><filter id="tg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter></defs>
      {Array.from({length: 12}, (_, i) => {
        const ph = (i / 12 + lt * .9) % 1, r = 60 * Math.pow(28, ph);
        const op = Math.sin(Math.PI * ph) * (.55 + .45 * hash(i));
        const sw = 6 + 30 * ph;
        return <g key={i} transform={`rotate(${lt * 40 + i * 31} ${cx} ${cy})`} opacity={op}>
          <ellipse cx={cx} cy={cy} rx={r} ry={r * .92} fill="none" stroke="#ffb028" strokeWidth={sw * 2.2} filter="url(#tg)" strokeDasharray={`${r * 2.6} ${r * .7}`}/>
          <ellipse cx={cx} cy={cy} rx={r} ry={r * .92} fill="none" stroke="#fff1c8" strokeWidth={sw * .35} strokeDasharray={`${r * 2.6} ${r * .7}`}/>
        </g>;
      })}
      {Array.from({length: 46}, (_, i) => {
        const ph = (hash(i * 3) + lt * (1.2 + hash(i))) % 1, a = hash(i * 7) * Math.PI * 2, r0 = 80 + 1500 * ph * ph;
        const x = cx + Math.cos(a) * r0, y = cy + Math.sin(a) * r0 * .9, l = 30 + 90 * ph;
        return <line key={'s' + i} x1={x} y1={y} x2={x + Math.cos(a) * l} y2={y + Math.sin(a) * l * .9}
          stroke={i % 5 === 0 ? '#59ffb0' : '#ffd27a'} strokeWidth={1.5 + 2 * ph} opacity={.25 + .5 * ph}/>;
      })}
    </svg>
    <Img src={staticFile('s08v2/figure.png')} style={{position: 'absolute', left: 560 + 260 * lt, top: 330 - 60 * lt, width: 640 - 120 * lt,
      transform: `rotate(${-18 + 70 * lt}deg)`, filter: 'drop-shadow(0 0 18px rgba(255,170,40,.95)) drop-shadow(0 0 50px rgba(255,120,20,.8)) brightness(1.3)'}}/>
    <AbsoluteFill style={{background: `rgba(255,190,80,${.35 * pulse(t, 8.253, .02, .1)})`, mixBlendMode: 'screen'}}/>
  </AbsoluteFill>;
};

const expoAt = (t: number) => {
  let e = -(1 - eout(span(t, .12, .42)));                 // fade in from black
  e += .25 * pulse(t, 2.711, .01, .08);                   // "YOU" slam
  e += .9 * pulse(t, 4.13, .01, .07);                     // lit blast frame
  e += .6 * pulse(t, 7.07, .01, .05);                     // fall flash
  return e;
};

export const Astral08: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS2;
  const shot = SHOTS.find((s) => t >= s.t0 && t < s.t1);
  let layer: React.ReactNode = null;
  if (shot) {
    const lt = t - shot.t0, src = shot.src(lt), fr = src * 24, i0 = Math.floor(fr);
    const g = shot.g ?? amber, fx = shot.fx ? shot.fx(t, lt) : {};
    const echo = typeof shot.echo === 'function' ? shot.echo(lt) : shot.echo ?? 0;
    const p: P08 = {
      ...P0,
      mix: fr - i0, scale: shot.z(lt), center: shot.c, warp: 0, zb: 0, dir: [0, 0], shake: [0, 0], rot: 0, expo: 0, ca: 0,
      con: g.con, sat: g.sat, lift: g.lift, tint: g.tint, bw: 0, vig: g.vig, bloom: .25, echo, grain: .05, seed: f % 13,
      ...fx,
    };
    p.expo = (fx.expo ?? 0) + expoAt(t);
    const c = echo > 0 && CL2[shot.clip] > 1 ? url(shot.clip, (src - (shot.echoLag ?? .25)) * 24 + 1) : undefined;
    layer = <Warp08 a={url(shot.clip, i0 + 1)} b={url(shot.clip, i0 + 2)} c={c} p={p} width={W} height={H}/>;
  }
  const end = t >= 8.72;
  const card = span(t, 24.6, 25.3) * (1 - span(t, 27.0, 29.0));
  return <AbsoluteFill style={{background: '#000'}}>
    {layer}
    <Burst t={t}/>
    <FallLights t={t} f={f}/>
    <PixelRush t={t} f={f}/>
    <Tunnel t={t}/>
    <Title t={t}/>
    {t < 24.55 && <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, textAlign: 'center', fontFamily: 'Teko', fontWeight: 400, fontSize: 22,
      letterSpacing: '0.75em', paddingLeft: '0.75em', color: 'rgba(255,255,255,.2)', transform: 'skewX(-12deg)'}}>© 2026 TOWN COPYRIGHT RESERVED</div>}
    {end && t < 24.57 && <AbsoluteFill style={{background: '#000'}}/>}
    {card > 0 && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: 'Teko', fontWeight: 400, fontSize: 60, letterSpacing: '0.35em', paddingLeft: '0.35em', color: '#fff', opacity: card}}>© 2026 TOWN COPYRIGHT RESERVED</div>
    </AbsoluteFill>}
    <Audio src={staticFile('s08/ref_audio.wav')}/>
  </AbsoluteFill>;
};
