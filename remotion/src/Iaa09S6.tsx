// Edit 09 shot 6 (ref 11.7-13.8, the last shot): SSF return decree. B/W hall of roaring agents, Abdulsamad arms raised in
// colour, red flares as the colour pop; red SSF emblem rises bottom-right -> top (ref Bulls path, measured at 1/30 s).
// v2 (smoothness pass): one Warp08 draw, no echo copies. In: zoom burst decelerating (cubic out) 11.7-11.88, blur = velocity.
// Beat punch 12.62: push that starts at full speed and settles (a hit), then slow drift. Emblem on a C1 path, blur from its velocity.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Warp08, P0, P08} from './Warp08';
import {SHUT, mono, vel, eo, ei, span, clamp, spring} from './motion';

const W = 1920, H = 1080;
export const S6A = 11.7, S6B = 13.8;
const CTR: [number, number] = [.32, .62];

// scale: burst settle, slow creep, beat punch, slow relax. Pan: picture drifts left, C1 from rest.
const s6S = (t: number) => (1.10 + .22 * (1 - eo(span(t, S6A, 11.88), 3)) + .03 * span(t, 11.88, 12.62)
  + .09 * eo(span(t, 12.62, 12.78), 2.5) - .04 * eo(span(t, 12.78, S6B), 1.6));
const s6px = (t: number) => -.024 * ei(span(t, S6A, S6B), 1.4);
const boost = (t: number) => 1 + 9 * Math.pow(1 - span(t, S6A, 11.86), 2) + (t >= 12.62 ? 11 * Math.pow(1 - span(t, 12.62, 12.76), 2) : 0);

const EMB = [[11.73, .75, .86], [11.767, .73, .8], [11.833, .69, .76], [11.9, .73, .6], [11.967, .77, .55], [12.034, .8, .5],
  [12.1, .74, .5], [12.234, .75, .49], [12.367, .79, .48], [12.434, .8, .46], [12.5, .74, .4], [12.634, .77, .35],
  [12.7, .83, .3], [12.767, .74, .2], [12.834, .83, .17], [12.9, .69, .06], [12.967, .8, -.06], [13.04, .76, -.26]];
const FLARES = [[.142, .158], [.372, .207], [.1, .345], [.73, .221], [.889, .394]];

export const Shot6: React.FC<{t: number; f?: number}> = ({t, f = 0}) => {
  if (t < S6A || t >= S6B) return null;
  const S = s6S(t), px = s6px(t), b = boost(t);
  const zb = Math.min(.5, Math.abs(vel(x => Math.log(s6S(x)), t)) * SHUT * b);
  const url = staticFile('iaa/s06/pop.jpg');
  const p: Partial<P08> = {...P0, mix: 0, scale: S, center: CTR, shake: [-px / S, 0], zb,
    dir: [-vel(s6px, t) / S * SHUT * 3, 0], expo: .14 + .25 * Math.pow(1 - span(t, S6A, 11.8), 2), con: 1.06, gamma: .98,
    ca: .001 + .5 * zb * .02, bloom: .18, grain: .045, seed: f % 13};
  // overlays ride the same camera: s = (uv - ctr) * S + ctr + px
  const cam = `translateX(${px * W}px) scale(${S})`;
  const ex = mono(t, EMB, 1) * W, ey = mono(t, EMB, 2) * H, d = .33 * H * (.55 + .45 * spring(t - 11.73, .5, 13));
  const vx = Math.abs(vel(u => mono(u, EMB, 1), t)) * W * SHUT, vy = Math.abs(vel(u => mono(u, EMB, 2), t)) * H * SHUT;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#0b0b0d'}}>
    <Warp08 a={url} b={url} p={p} width={W} height={H}/>
    <AbsoluteFill style={{transformOrigin: `${CTR[0] * 100}% ${CTR[1] * 100}%`, transform: cam, filter: zb > .01 ? `blur(${(zb * 26).toFixed(2)}px)` : undefined}}>
      {FLARES.map(([fx, fy], i) => <div key={i} style={{position: 'absolute', left: fx * W - 130, top: fy * H - 130, width: 260, height: 260, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,60,50,.55) 0%, rgba(255,20,20,.18) 40%, rgba(255,0,0,0) 70%)', mixBlendMode: 'screen',
        opacity: .7 + .3 * Math.sin(t * 9 + i * 2.3)}}/>)}
    </AbsoluteFill>
    {t >= 11.73 && t < 13.04 && <>
      <svg width={0} height={0} style={{position: 'absolute'}}><filter id="s6eb" x="-30%" y="-40%" width="160%" height="180%">
        <feGaussianBlur stdDeviation={`${(vx / 2.2 + .3 + zb * 8).toFixed(2)} ${(vy / 2.2 + .3 + zb * 8).toFixed(2)}`}/></filter></svg>
      <Img src={staticFile('iaa/ssf.png')} style={{position: 'absolute', left: ex - d * .946 / 2, top: ey - d / 2, width: d * .946, height: d,
        opacity: span(t, 11.73, 11.78),
        filter: `url(#s6eb) grayscale(1) sepia(1) saturate(9) hue-rotate(-38deg) brightness(1.05) drop-shadow(0 0 3px rgba(255,255,255,.95)) drop-shadow(0 0 14px rgba(255,235,240,.8)) drop-shadow(0 0 30px rgba(255,90,120,.45))`}}/>
    </>}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 75% at 45% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,.42) 100%)'}}/>
  </AbsoluteFill>;
};
