// Edit 09 shot 5 (ref 8.4-11.7, the dunk): IAA heli swoops in from top right over the cheering agent arena (Flow Omni 1.2
// live take, s05v), IAA (upper, ref Lakers path) + SWAT (lower, ref Hornets path) emblems rise with white glow, dark LOVE top-left.
// v2 (smoothness pass): one shader draw, C1 paths, all blur = velocity x shutter. In: diagonal down-left settle (8.4-8.6).
// Out: accelerating push + radial blur (11.45-11.7).
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Warp08, P0, P08} from './Warp08';
import {SHUT, mono, vel, ei, eo, span, clamp, spring} from './motion';

const W = 1920, H = 1080;
export const S5A = 8.4, S5B = 11.7;
const S5N = 120;
const s5url = (i: number) => staticFile(`iaa/s05v/${String(clamp(Math.round(i), 1, S5N)).padStart(5, '0')}.jpg`);
// footage time: heli breaks the frame edge at source frame ~21, settles by ~45; play slightly fast through the swoop
const s5fr = (t: number) => 19 + Math.round((t - S5A) * 30);   // 1 source frame per output frame (Flow 24 fps at 1.25x): swoop lands ~9.23 like the ref
// camera: incoming diagonal (picture travels down-left and settles, ref 8.4-8.55), slow drift, accelerating push into the cut
const s5k = (t: number) => 1 - eo(span(t, S5A, 8.62), 3);
const s5off = (t: number): [number, number] => { const k = s5k(t); return [-.06 * k, .05 * k]; };   // uv offset: picture starts up-right, travels down-left
const s5S = (t: number) => (1.07 + .035 * span(t, S5A, S5B)) * (1 + .09 * s5k(t)) * (1 + .45 * ei(span(t, 11.45, S5B), 2.6));
const Plate: React.FC<{t: number; f: number}> = ({t, f}) => {
  const i0 = s5fr(t), off = s5off(t), S = s5S(t);
  const inK = 1 + 1.4 * (1 - span(t, S5A, 8.5));      // shutter wide open on the incoming whip
  const p: Partial<P08> = {
    ...P0, mix: 0, scale: S, center: [.45, .44], shake: [off[0] - .01 * span(t, S5A, S5B), off[1] - .03],
    dir: [vel(x => s5off(x)[0], t) * SHUT * inK, vel(x => s5off(x)[1], t) * SHUT * inK],
    zb: Math.abs(vel(x => Math.log(s5S(x)), t)) * SHUT * (1 + 2 * ei(span(t, 11.5, S5B), 2)),
    expo: .35 * Math.pow(1 - span(t, S5A, 8.52), 2) + .5 * ei(span(t, 11.55, S5B), 2),
    gamma: .98, con: 1.1, sat: 1.12, lift: .012, tint: [.97, .98, 1.08], vig: .38, bloom: .3, grain: .045, seed: f % 13,
    ca: .0012 + .006 * (1 - span(t, S5A, 8.55)) + .006 * ei(span(t, 11.5, S5B), 2),
  };
  return <Warp08 a={s5url(i0 + 1)} b={s5url(i0 + 2)} p={p} width={W} height={H}/>;
};

// emblems: [t, cx, cy] measured on the ref, C1 through the points; spring scale-in, blur along the velocity
const UP = [[8.85, .93, .52], [9.0, .93, .38], [9.15, .91, .28], [9.3, .83, .27], [9.45, .82, .2], [9.6, .85, .06], [9.75, .87, -.2]];
const LO = [[8.55, .93, .86], [8.85, .82, .72], [9.0, .77, .66], [9.3, .73, .62], [9.6, .73, .52], [9.75, .73, .45], [9.9, .73, .3], [10.05, .74, .02]];
const Emb: React.FC<{t: number; k: number[][]; src: string; d: number; ar: number; id: string}> = ({t, k, src, d, ar, id}) => {
  if (t < k[0][0] || t > k[k.length - 1][0]) return null;
  const x = mono(t, k, 1) * W, y = mono(t, k, 2) * H, sc = .55 + .45 * spring(t - k[0][0], .5, 12), hh = d * H * sc, ww = hh * ar;
  const vx = Math.abs(vel(u => mono(u, k, 1), t)) * W * SHUT, vy = Math.abs(vel(u => mono(u, k, 2), t)) * H * SHUT;
  return <>
    <svg width={0} height={0} style={{position: 'absolute'}}><filter id={id} x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation={`${(vx / 2.2 + .3).toFixed(2)} ${(vy / 2.2 + .3).toFixed(2)}`}/></filter></svg>
    <Img src={staticFile(src)} style={{position: 'absolute', left: x - ww / 2, top: y - hh / 2, width: ww, height: hh, opacity: span(t, k[0][0], k[0][0] + .06),
      filter: `url(#${id}) saturate(1.2) brightness(1.1) drop-shadow(0 0 3px rgba(255,255,255,.95)) drop-shadow(0 0 14px rgba(235,240,255,.85)) drop-shadow(0 0 32px rgba(200,210,255,.5))`}}/>
  </>;
};

export const Shot5: React.FC<{t: number; f?: number}> = ({t, f = 0}) => {
  if (t < S5A || t >= S5B) return null;
  const lt = t - S5A, S = s5S(t), off = s5off(t);
  const oL = span(t, 8.7, 8.95) * (1 - span(t, 11.4, 11.6)) * .78;
  // overlays ride the camera (incoming offset + push), so nothing slides against the plate
  const cam = `translate(${-off[0] * W * S}px, ${-off[1] * H * S}px) scale(${S / 1.07})`;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#05060c'}}>
    <Plate t={t} f={f}/>
    <AbsoluteFill style={{transformOrigin: '45% 44%', transform: cam}}>
      {oL > 0 && <div style={{position: 'absolute', left: W * (.095 + .006 * lt), top: H * (.04 - .004 * lt), fontSize: 290, fontFamily: 'Cormorant Garamond', fontWeight: 700,
        lineHeight: 1, letterSpacing: '-0.02em', opacity: oL, color: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text',
        background: 'linear-gradient(180deg, #7f93b8 0%, #2c3a5c 34%, #0d1324 55%, #3e4f78 74%, #161d33 100%)',
        filter: 'drop-shadow(0 0 1px rgba(190,210,255,.5)) drop-shadow(0 3px 8px rgba(0,0,0,.6))'}}>LOVE</div>}
      <Emb t={t} k={LO} src="iaa/swat.png" d={.34} ar={691 / 835} id="s5lo"/>
      <Emb t={t} k={UP} src="iaa/emblem.png" d={.32} ar={1111 / 1244} id="s5up"/>
    </AbsoluteFill>
  </AbsoluteFill>;
};
