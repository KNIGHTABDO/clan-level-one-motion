// Edit 09: IAA "The Commander Returns" (1:1 clone of "THE NBA GREATS"). 1920x1080 @ 30 fps.
// Pilot = shots 1-3 (0-5.033 s). Timings are the measured ref times in edits/09_iaa_comeback/PLAN.md.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Shot5} from './Iaa09S5';
import {Shot6} from './Iaa09S6';
import {Shot7} from './Iaa09S7';
import {Warp08, P0, P08} from './Warp08';
import {SHUT, mono, vel, ei, eo, spring} from './motion';

export const FPS9 = 30, W = 1920, H = 1080;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
const io = (x: number) => x * x * (3 - 2 * x);
const ein = (x: number) => x * x * x;
const eout = (x: number) => 1 - Math.pow(1 - x, 3);
const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
// keyframes [[t,v],...] on one C1 monotone cubic (v2: no per-key stops, no velocity jumps)
const kf = (t: number, k: [number, number][]) => mono(t, k);
const rgb = (c: [number, number, number]) => `rgb(${c.map(Math.round).join(',')})`;
const mixc = (a: number[], b: number[], x: number) => a.map((v, i) => lerp(v, b[i], x)) as [number, number, number];

// ---------- shot 1: neon-bordered tinted frames flying into a black void ----------
// One tilted floor of frames scrolling toward camera (ref: frames never land; they enter small at the top, grow and keep sliding).
// row r sits at screen y = S(t) - r*ROWGAP; c = column (-2..2); d = pop-in time; col = neon colour.
const NEON = {red: '#ff3346', pink: '#ff4fd2', yel: '#ffe02e', grn: '#58ff4f', blu: '#4f7cff', org: '#ff9426', pur: '#a066ff', cya: '#38d4ff'};
type Fr = {img: string; r: number; c: number; d: number; col: string; rz: number; ry: number};
const FRAMES: Fr[] = [
  {img: 'f03', r: 0, c: -1, d: .05, col: NEON.red, rz: -6, ry: 14},
  {img: 'f07', r: 0, c: 0, d: .11, col: NEON.pink, rz: 2, ry: 0},
  {img: 'f02', r: 0, c: 1, d: .17, col: NEON.org, rz: 7, ry: -16},
  {img: 'f09', r: 0, c: 2, d: .22, col: NEON.blu, rz: -4, ry: -24},
  {img: 'f10', r: 0, c: -2, d: .20, col: NEON.cya, rz: 5, ry: 22},
  {img: 'f04', r: 1, c: -1, d: .26, col: NEON.grn, rz: 4, ry: 10},
  {img: 'f01', r: 1, c: 0, d: .30, col: NEON.pur, rz: -2, ry: 0},
  {img: 'f05', r: 1, c: 1, d: .28, col: NEON.yel, rz: -5, ry: -12},
  {img: 'f13', r: 1, c: -2, d: .34, col: NEON.pink, rz: 6, ry: 20},
  {img: 'f14', r: 1, c: 2, d: .36, col: NEON.red, rz: -6, ry: -20},
  {img: 'f06', r: 2, c: -1, d: .40, col: NEON.blu, rz: 3, ry: 10},
  {img: 'f11', r: 2, c: 0, d: .44, col: NEON.grn, rz: -1, ry: 0},
  {img: 'f12', r: 2, c: 1, d: .42, col: NEON.yel, rz: 4, ry: -10},
  {img: 'f08', r: 2, c: 2, d: .48, col: NEON.org, rz: -3, ry: -18},
];
const ROWGAP = .30;
const SCR: [number, number][] = [[0, -.15], [.3, .55], [.6, .93], [.9, 1.05], [1.4, 1.11]];
const scrollAt = (t: number) => mono(t, SCR);
const Frames: React.FC<{t: number}> = ({t}) => {
  if (t > 1.16) return null;
  const tilt = ein(span(t, .74, 1.30)) * 1.15;          // camera tilts up: floor slides down and out under the clouds
  const S = scrollAt(t) + tilt;
  const fade = 1 - span(t, 1.0, 1.15);
  return <AbsoluteFill style={{opacity: fade, transform: `rotate(${-1.5 + 2.5 * span(t, 0, 1.2)}deg)`}}>
    {FRAMES.map((fr, i) => {
      const pop = span(t, fr.d, fr.d + .07);
      if (pop <= 0) return null;
      const y = S - fr.r * ROWGAP + (fr.r % 2 ? .04 : 0);
      if (y < -.4 || y > 1.6) return null;
      const k = .52 + .62 * clamp(y, -.2, 1.4);           // perspective: lower = closer = bigger
      const fw = .34 * W * k * (1 + 1.3 * ein(span(t, .78, 1.12))), fh = fw * 9 / 16;   // camera nears the floor under the clouds
      const x = .5 + fr.c * .37 * k + (fr.r % 2 ? -.06 : .03) * k;
      const jit = Math.sin(t * 2.3 + i * 1.7) * 1.5;
      return <div key={i} style={{position: 'absolute', left: x * W - fw / 2, top: y * H - fh / 2, width: fw, height: fh,
        transform: `perspective(1100px) rotateX(${38 + 6 * (1 - pop)}deg) rotateY(${fr.ry}deg) rotateZ(${fr.rz + jit}deg) scale(${.75 + .25 * spring(t - fr.d, .55, 14)})`,
        opacity: pop}}>
        <div style={{position: 'absolute', inset: 0, transform: 'translate(0, 8px)', background: fr.col, opacity: .4, borderRadius: 6}}/>
        <div style={{position: 'absolute', inset: 0, borderRadius: 5, overflow: 'hidden', border: `3px solid ${fr.col}`,
          boxShadow: `0 0 22px ${fr.col}, 0 0 6px ${fr.col}, inset 0 0 26px ${fr.col}`, background: '#000'}}>
          <Img src={staticFile(`iaa/frames/${fr.img}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.45) brightness(1.45)'}}/>
          <div style={{position: 'absolute', inset: 0, background: fr.col, mixBlendMode: 'multiply', opacity: .85}}/>
          <div style={{position: 'absolute', inset: 0, background: fr.col, mixBlendMode: 'screen', opacity: .2}}/>
        </div>
      </div>;
    })}
  </AbsoluteFill>;
};

// ---------- shot 2: sky, cloud wipe, spinning IAA emblem, white wash ----------
const SKY: [number, number[], number[]][] = [   // t, top colour, bottom colour
  [.70, [4, 10, 60], [0, 0, 0]],
  [.85, [12, 40, 210], [4, 20, 90]],
  [1.0, [10, 110, 255], [20, 140, 255]],
  [1.2, [20, 150, 255], [60, 170, 255]],
  [1.27, [80, 180, 250], [110, 200, 255]],
  [1.34, [130, 215, 255], [150, 230, 255]],
  [1.40, [150, 240, 255], [150, 240, 255]],
];
const skyAt = (t: number) => {
  const ch = (j: number, c: number) => mono(t, SKY.map(r => [r[0], (j === 1 ? r[1] : r[2])[c]]));
  return [[0, 1, 2].map(c => ch(1, c)), [0, 1, 2].map(c => ch(2, c))] as [number, number, number][];
};
const Sky: React.FC<{t: number}> = ({t}) => {
  if (t < .70 || t > 1.75) return null;
  const [top, bot] = skyAt(t);
  // early on only the top of the void turns blue (the camera has not tilted yet)
  const reach = kf(t, [[.70, 18], [.85, 35], [1.0, 70], [1.2, 100]]);
  return <AbsoluteFill style={{background: `linear-gradient(180deg, ${rgb(top)} 0%, ${rgb(bot)} ${reach}%, ${t < 1.12 ? 'rgba(0,0,0,0)' : rgb(bot)} ${t < 1.12 ? Math.min(reach + 25, (cloudTop(t) + .32) * 100) : 100}%)`,
    opacity: span(t, .70, .80)}}/>;
};
// one opaque cumulus band (cloudband.png: fluffy top, shaded underside). top edge measured on ref frames:
// .70 .06 | .80 .06 | .90 .10 | .97 .18 | 1.03 .20 | 1.10 .27 | 1.17 .50 | 1.23 .60 | 1.30 .72 | 1.37 .85
const cloudTop = (t: number) => kf(t, [[.5, .12], [.70, .09], [.80, .08], [.90, .10], [.97, .16], [1.03, .19], [1.10, .25], [1.17, .41], [1.23, .51], [1.30, .56], [1.37, .70], [1.46, .92]]);
const Clouds: React.FC<{t: number}> = ({t}) => {
  if (t < .50 || t > 1.48) return null;
  const a = span(t, .50, .62) * (1 - span(t, 1.34, 1.47));
  const top = cloudTop(t) * H, bh = kf(t, [[.5, .5], [.70, .52], [.9, .62], [1.03, .72], [1.10, .80], [1.2, .86]]) * H;
  const merge = eout(span(t, .50, .78));                     // two puffs slide in from the sides and merge
  const bw = 1.9 * W, drift = -t * 70;
  const layer = (side: number) => {
    const m = side < 0 ? 'linear-gradient(90deg, #000 62%, transparent 76%)' : 'linear-gradient(90deg, transparent 24%, #000 38%)';
    return <AbsoluteFill style={{transform: `translateX(${side * (1 - merge) * .6 * W}px)`, WebkitMaskImage: m, maskImage: m}}>
      <Img src={staticFile('iaa/cloudband.png')} style={{position: 'absolute', left: W / 2 - bw / 2 + drift + (side > 0 ? 410 : 0), top, width: bw, height: bh,
        transform: side > 0 ? 'scaleX(-1)' : undefined, filter: `blur(${8 + 6 * (1 - merge)}px) brightness(1.26) contrast(1.04)`}}/>
    </AbsoluteFill>;
  };
  return <AbsoluteFill style={{opacity: a}}>{layer(-1)}{layer(1)}</AbsoluteFill>;
};
const Emblem: React.FC<{t: number}> = ({t}) => {
  if (t < .58 || t > 1.72) return null;
  // vertical extent measured: .73 -> 0..0.3, 1.2 -> .05..0.6, 1.4 -> .1..0.75 (centred in x)
  const h = kf(t, [[.58, .34], [.73, .40], [1.03, .44], [1.17, .56], [1.30, .61], [1.4, .64], [1.7, .92]]) * H;
  const cy = kf(t, [[.58, -.16], [.73, .10], [1.03, .13], [1.17, .33], [1.30, .39], [1.4, .42], [1.7, .46]]) * H;
  // Y spin measured at 1/30 s: frontal .667, edge-on .733, frontal (back) ~.87, edge-on 1.067, frontal 1.2; clockwise lean from ~1.2
  const ry = mono(t, [[.58, -40], [.667, 0], [.733, 90], [.87, 180], [1.067, 270], [1.25, 360]] as [number, number][]);
  const back = ry > 90 && ry < 270;
  const rz = kf(t, [[1.17, 0], [1.33, 7], [1.72, 11]]);
  const white = span(t, 1.40, 1.62);
  const w = h * 1111 / 1244;
  return <AbsoluteFill style={{perspective: 1400}}>
    <Img src={staticFile('iaa/emblem.png')} style={{position: 'absolute', left: W / 2 - w / 2, top: cy - h / 2, width: w, height: h,
      transform: `rotateZ(${rz}deg) rotateY(${ry}deg)${back ? ' scaleX(-1)' : ''}`,
      filter: `drop-shadow(0 0 18px rgba(255,140,220,.75)) drop-shadow(0 0 40px rgba(110,230,255,.6)) brightness(${1 + 2.2 * white})`,
      opacity: 1 - .75 * span(t, 1.55, 1.72)}}/>
  </AbsoluteFill>;
};
// white wash: 1.37 -> full white 1.53 -> holds to 1.70 -> shot 3 fades in from white by 1.84 (still lifted till ~2.2)
const whiteAt = (t: number) => kf(t, [[1.34, 0], [1.53, 1], [1.66, 1], [1.80, .28], [2.2, 0]]);

// ---------- shot 3: Abdulsamad from behind, arms wide; LOVE, rising badges, bokeh ----------
const S3N = 111, S3T0 = 1.66;
const s3url = (i: number) => staticFile(`iaa/s03/${String(clamp(Math.round(i), 1, S3N)).padStart(5, '0')}.jpg`);
// camera into the 3->4 cut (ref 4.55-5.033): accelerating tilt-up (content drops ~.09 H) + push, blur = velocity x shutter
const s3ty = (t: number) => -.09 * ei(span(t, 4.55, 5.033), 2.6);
const s3push = (t: number) => 1 + .085 * ei(span(t, 4.6, 5.033), 3);
const s3boost = (t: number) => 1 + 2.2 * ei(span(t, 4.8, 5.033), 2);   // shutter opens up on the whip (stylised)
const s3base = (t: number) => { const lt = t - S3T0, zin = 1 - span(t, 1.66, 1.88); return 1.04 + .06 * lt / 3.33 + .10 * eout(zin); };
const s3S = (t: number) => s3base(t) * s3push(t);
const Shot3: React.FC<{t: number; f: number}> = ({t, f}) => {
  if (t < S3T0 || t >= 5.033) return null;
  const lt = t - S3T0, fr = lt * 24, i0 = Math.floor(fr);
  const zin = 1 - span(t, 1.66, 1.88);                        // radial zoom blur settling
  const bo = s3boost(t), S = s3S(t);
  const zbv = Math.abs(vel(x => Math.log(s3S(x)), t)) * SHUT * bo;
  const p: Partial<P08> = {
    ...P0, mix: fr - i0,
    scale: S, center: [.5, .45], shake: [0, s3ty(t)],
    zb: Math.max(.14 * zin * zin, zbv), dir: [0, vel(s3ty, t) * SHUT * bo],
    expo: 1.1 * zin + .35 * (1 - span(t, 1.84, 2.36)) + .25 * ei(span(t, 4.85, 5.033), 2),
    gamma: 1, con: 1.16, sat: 1.05, lift: .015, tint: [.86, 1.03, 1.12],
    vig: .32, bloom: .35, grain: .045, seed: f % 13, ca: .0015 + .006 * zin + .004 * ei(span(t, 4.8, 5.033), 2),
    glow: [.5, .52, .22, .18],
  };
  return <Warp08 a={s3url(i0 + 1)} b={s3url(i0 + 2)} p={p} width={W} height={H}/>;
};
// screen overlays (LOVE, badges, bokeh) ride the same camera: drop + push + vertical shutter blur
const S3Cam: React.FC<{t: number; blend?: 'screen'; defs?: boolean; children: React.ReactNode}> = ({t, blend, defs, children}) => {
  if (t < S3T0 || t >= 5.033) return null;
  const S = s3S(t), dy = -s3ty(t) * S * H, vy = Math.abs(vel(s3ty, t)) * S * H * SHUT * s3boost(t);
  // same wrapper (transform + filter + blend) on every frame of the shot, so compositing never changes mid-shot
  return <AbsoluteFill style={{transformOrigin: '50% 45%', transform: `translateY(${dy}px) scale(${s3push(t)})`, filter: 'url(#s3vb)', mixBlendMode: blend}}>
    {defs && <svg width={0} height={0} style={{position: 'absolute'}}><filter id="s3vb" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation={`0 ${(vy / 2.2).toFixed(2)}`}/></filter></svg>}
    {children}
  </AbsoluteFill>;
};
const Love: React.FC<{t: number}> = ({t}) => {
  if (t < S3T0 || t >= 5.033) return null;
  const lt = t - S3T0;
  return <div style={{position: 'absolute', left: -18 + 14 * lt / 3.3, top: -70 + 6 * lt / 3.3, fontFamily: 'Cormorant Garamond', fontWeight: 700,
    fontSize: 430, lineHeight: 1, letterSpacing: '-0.03em', transform: `scale(${1 + .015 * lt})`, transformOrigin: '0 0',
    background: 'linear-gradient(180deg, #f4fbff 0%, #bfe3f5 22%, #4f8cab 44%, #12324a 52%, #6fb2cf 60%, #e8f8ff 78%, #7fb6cf 100%)',
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', opacity: .9,
    filter: 'drop-shadow(0 4px 10px rgba(0,20,40,.55)) drop-shadow(0 0 2px rgba(220,245,255,.6))'}}>LOVE</div>;
};
// badges float up the right side one after another (ref 2.0-3.8)
const BADGES: {src: string; t0: number; x: number; h: number; ar: number; life: number}[] = [
  {src: 'iaa/ssf.png', t0: 1.80, x: .77, h: .23, ar: 767 / 811, life: 1.9},
  {src: 'iaa/emblem.png', t0: 2.25, x: .76, h: .25, ar: 1111 / 1244, life: 1.6},
  {src: 'iaa/swat.png', t0: 2.70, x: .78, h: .23, ar: 691 / 835, life: 1.4},
];
const badgeY = (lt: number, life: number) => .86 - .91 * (.45 * (lt / life) + .55 * Math.pow(lt / life, 1.9));
const Badges: React.FC<{t: number}> = ({t}) => <>{BADGES.map((b, i) => {
  const lt = t - b.t0, life = b.life;
  if (lt < 0 || lt > life) return null;
  const y = badgeY(lt, life) * H, sc = .55 + .45 * spring(lt, .5, 13), h = b.h * H * sc, w = h * b.ar;
  const vy = Math.abs(vel(x => badgeY(x, life), lt)) * H * SHUT;
  const o = span(lt, 0, .12) * (1 - span(lt, life - .3, life));
  const fid = `bvb${i}`;
  return <React.Fragment key={i}>
    <svg width={0} height={0} style={{position: 'absolute'}}><filter id={fid} x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation={`0 ${(vy / 2.2).toFixed(2)}`}/></filter></svg>
    <Img src={staticFile(b.src)} style={{position: 'absolute', left: b.x * W - w / 2 + Math.sin(lt * 2.2 + i) * 12, top: y - h / 2, width: w, height: h,
      opacity: o, transform: `rotate(${Math.sin(lt * 1.9 + i * 2) * 6}deg)`,
      filter: `url(#${fid}) saturate(1.45) brightness(1.12) drop-shadow(0 0 18px rgba(255,170,230,.7)) drop-shadow(0 6px 10px rgba(0,0,0,.45))`}}/>
  </React.Fragment>;
})}</>;
const BOKEH = Array.from({length: 16}, (_, i) => ({x: ((i * 0.6180339) % 1), y: .08 + ((i * 0.3819) % 1) * .42, r: 7 + (i * 7) % 9, s: .4 + (i % 5) * .15}));
const Bokeh: React.FC<{t: number}> = ({t}) => {
  if (t < 1.9 || t >= 5.033) return null;
  const a = span(t, 1.9, 2.4);
  return <>{BOKEH.map((b, i) => <div key={i} style={{position: 'absolute', left: (b.x * W + t * 18 * b.s) % W, top: b.y * H - t * 10 * b.s, width: b.r * 2, height: b.r * 2,
    borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,150,255,.95) 0%, rgba(90,120,255,.7) 55%, rgba(90,120,255,0) 72%)',
    opacity: a * (.55 + .35 * Math.sin(t * 3 + i))}}/>)}</>;
};

// ---------- shot 4 (5.033-8.4): Abdulsamad frontal in colour vs B/W agent crowd; SSF badge floats up; dark LOVE / ME ----------
// measured at 1/30 s (research sheets): hard cut onto a ~4x zoom-blurred torso crop, settles to medium by 5.133, then keeps
// zooming out (fast to ~5.9, near-hold to 7.7, second pull-out to 8.4). Subject centre sways .42-.56 W. Scale rel. to the 8.36 frame:
const S4Z: [number, number][] = [[5.033, 3.0], [5.066, 2.3], [5.1, 1.95], [5.133, 1.86], [5.3, 1.63], [5.45, 1.49], [5.6, 1.37], [5.75, 1.28], [5.9, 1.22], [6.2, 1.2], [6.5, 1.19], [7.1, 1.18], [7.7, 1.16], [8.0, 1.08], [8.2, 1.03], [8.4, .99]];
const S4X: [number, number][] = [[5.133, .5], [5.45, .5], [5.75, .55], [6.05, .51], [6.35, .45], [6.6, .42], [6.95, .44], [7.15, .43], [7.4, .49], [7.7, .52], [8.0, .5], [8.4, .49]];
const S4N = 120;
const s4url = (i: number) => staticFile(`iaa/s04v/${String(clamp(Math.round(i), 1, S4N)).padStart(5, '0')}.jpg`);
const S4LZ = S4Z.filter(([k]) => k <= 7.7).map(([k, v]) => [k, Math.log(v)]);
const s4ref = (t: number) => t <= 7.7 ? Math.exp(mono(t, S4LZ)) : 1.16 + (.99 - 1.16) * ei(span(t, 7.7, 8.4), 2.2);
const s4S = (t: number) => 1.03 + .8 * (s4ref(t) - .99);      // ref scale mapped onto the tighter Flow framing
// subject screen x: ref sway with keys on its extrema (5.75 / 6.6 / 7.7), C1 through them
const S4SW = [[5.033, .5], [5.75, .55], [6.6, .42], [7.7, .52], [8.4, .435]];
const s4qx = (t: number) => .47 + (mono(t, S4SW) - .485) * .7;
const S4F: [number, number] = [.44, .6];                                    // chest of the subject in the Flow frame (uv)
const s4sh = (t: number): [number, number] => [S4F[0] - s4qx(t), 0];
const S4EMB: [number, number][][] = [  // [t, cx], [t, cy], [t, diameter (H)] measured on the ref
  [[5.06, 1.02], [5.15, .93], [5.3, .92], [5.45, .89], [5.6, .86], [5.9, .85], [6.05, .83], [6.2, .75], [6.35, .71], [6.5, .69], [6.8, .68], [6.95, .69], [7.1, .71], [7.25, .75], [7.45, .77]],
  [[5.06, 1.08], [5.15, .85], [5.3, .75], [5.45, .65], [5.6, .62], [5.9, .58], [6.05, .55], [6.2, .55], [6.35, .53], [6.5, .49], [6.8, .45], [6.95, .38], [7.1, .25], [7.25, .03], [7.45, -.2]],
  [[5.06, .34], [5.3, .35], [5.6, .32], [5.9, .30], [6.2, .28], [6.5, .27], [6.8, .26], [7.1, .25], [7.45, .25]],
];
const S4EMBK = S4EMB[0].map(([k, x], j) => [k, x, S4EMB[1][j][1]]), S4EMBD = S4EMB[2];
const Shot4: React.FC<{t: number; f: number}> = ({t, f}) => {
  if (t < 5.033 || t >= 8.4) return null;
  const lt = t - 5.033, i0 = Math.round(lt * 30);
  const S = s4S(t), boostIn = 1 + 1.5 * (1 - span(t, 5.033, 5.15)), boostOut = 1 + 1.8 * ei(span(t, 8.1, 8.4), 2);
  const zb = Math.abs(vel(x => Math.log(s4S(x)), t)) * SHUT * boostIn * boostOut;
  const vx = vel(x => s4sh(x)[0], t) * SHUT;
  const flash = 1 - span(t, 5.033, 5.2);
  const p: Partial<P08> = {
    ...P0, mix: 0, scale: S, center: [s4qx(t), S4F[1]], shake: s4sh(t), zbc: S4F,
    zb, dir: [vx, 0],
    expo: .55 * flash * flash + .12 * ei(span(t, 8.2, 8.4), 2), gamma: 1.02, con: 1.12, sat: 1.12, lift: .01, tint: [.95, 1.0, 1.06],
    vig: .4, bloom: .22, grain: .045, seed: f % 13, ca: .0012 + .008 * flash,
  };
  // SSF badge: C1 path through the measured ref points, spring entry, velocity blur along its travel
  const ex = mono(t, S4EMBK, 1) * W, ey = mono(t, S4EMBK, 2) * H, ed = mono(t, S4EMBD, 1) * H * (.6 + .4 * spring(t - 5.06, .5, 12));
  const evx = Math.abs(vel(x => mono(x, S4EMBK, 1), t)) * W * SHUT, evy = Math.abs(vel(x => mono(x, S4EMBK, 2), t)) * H * SHUT;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#05080d'}}>
    <Warp08 a={s4url(i0 + 1)} b={s4url(i0 + 2)} p={p} width={W} height={H}/>
    <S4Words t={t}/>
    <svg width={0} height={0} style={{position: 'absolute'}}><filter id="s4eb" x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation={`${(evx / 2.2 + .4).toFixed(2)} ${(evy / 2.2 + .4).toFixed(2)}`}/></filter></svg>
    {t >= 5.06 && t < 7.45 && <Img src={staticFile('iaa/ssf.png')} style={{position: 'absolute', left: ex - ed * .946 / 2, top: ey - ed / 2, width: ed * .946, height: ed,
      opacity: span(t, 5.06, 5.12), filter: `url(#s4eb) saturate(1.25) brightness(1.08) drop-shadow(0 0 3px rgba(235,245,255,.95)) drop-shadow(0 0 16px rgba(150,170,255,.8)) drop-shadow(0 0 34px rgba(110,120,255,.45))`}}/>}
  </AbsoluteFill>;
};
// dark smoked-steel serif LOVE (top-left) and ME (lower right), barely above the crowd (ref 5.4-7.9)
const S4Words: React.FC<{t: number}> = ({t}) => {
  const st = (o: number): React.CSSProperties => ({position: 'absolute', fontFamily: 'Cormorant Garamond', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em',
    background: 'linear-gradient(180deg, #8d9aa6 0%, #39444f 30%, #10161d 52%, #4a5865 70%, #1a2128 100%)',
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', opacity: o,
    filter: 'drop-shadow(0 0 1px rgba(200,220,235,.55)) drop-shadow(0 3px 8px rgba(0,0,0,.6))'});
  const oL = span(t, 5.35, 5.9) * (1 - span(t, 7.6, 8.1)) * .8, oM = span(t, 6.3, 6.8) * (1 - span(t, 7.6, 8.0)) * .75;
  return <>
    {oL > 0 && <div style={{...st(oL), left: W * (-.005 + .012 * (t - 5)), top: H * (.13 - .01 * (t - 5)), fontSize: 250 * (1 - .06 * ei(span(t, 7.7, 8.4), 2))}}>LOVE</div>}
    {oM > 0 && <div style={{...st(oM), left: W * (.635 + .01 * (t - 6)), top: H * (.70 + .012 * (t - 6)), fontSize: 230}}>ME</div>}
  </>;
};

export const Iaa09: React.FC<{f0?: number}> = ({f0 = 0}) => {
  const f = useCurrentFrame() + f0, t = f / FPS9;
  const wa = whiteAt(t);
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Sky t={t}/>
    <Frames t={t}/>
    {t < 1.13 && <Emblem t={t}/>}
    <Clouds t={t}/>
    {t >= 1.13 && <Emblem t={t}/>}
    <Shot3 t={t} f={f}/>
    <S3Cam t={t} defs><Love t={t}/><Badges t={t}/></S3Cam>
    <S3Cam t={t} blend="screen"><Bokeh t={t}/></S3Cam>
    <Shot4 t={t} f={f}/>
    <Shot5 t={t} f={f}/>
    <Shot6 t={t} f={f}/>
    <Shot7 t={t}/>
    {wa > 0 && <AbsoluteFill style={{background: '#fff', opacity: wa}}/>}
    {/* emblem ghost stays visible through the white (ref 1.64-1.67) */}
    {t > 1.53 && t < 1.72 && <AbsoluteFill style={{opacity: .10, filter: 'grayscale(1) brightness(1.6)'}}><Emblem t={t}/></AbsoluteFill>}
    <Audio src={staticFile('iaa/bed.mp3')} startFrom={f0}/>
    <Sequence from={Math.round(2.1 * FPS9) - f0}><Audio src={staticFile('iaa/A1.wav')}/></Sequence>
  </AbsoluteFill>;
};
