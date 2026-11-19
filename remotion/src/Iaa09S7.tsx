// Edit 09 shot 7 (ref 13.8-18.367, the jersey wall): IAA hall of honour. Plank wall with framed agent jerseys
// (AL QURASHI 01 hero + 8 roster frames). In: hard cut onto a perspective-tilted close view panning right, flattening by 14.3.
// 14.6-15.6 pull back to the full wall; torn "LOVE ME" strip flies in from the left (16.1-17.5) and settles tilted.
// Out: 17.97-18.367 tunnel/fisheye pull-back (SVG displacement), hard cut to the trophy. Times measured on the ref at 1/30 s.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {TUNNEL_MAP, TUNNEL_S} from './Iaa09S7map';
import {SHUT, mono, vel, eo, ss} from './motion';

const W = 1920, H = 1080;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
const sm = (x: number) => x * x * (3 - 2 * x);
export const S7A = 13.8, S7B = 551 / 30;

// camera: [t, centre x, centre y (world = far-view frame units), log zoom]
const L = Math.log;
const CAM = [[13.8, .392, .51, L(2.15)], [14.2, .47, .5, L(2.15)], [14.6, .493, .5, L(2.12)], [15.6, .5, .5, L(1.0)],
  [17.97, .5, .5, L(1.035)], [18.367, .5, .5, L(.3)]];
// v2: one C1 curve (monotone cubic) through every key: already moving at the cut, decelerates, never stops at a key
const CAMC = CAM.slice(0, 5);
const camx = (t: number) => mono(t, CAMC, 1);
const cam = (t: number) => {
  if (t < 17.97) return {x: camx(t), y: mono(t, CAMC, 2), z: Math.exp(mono(t, CAMC, 3))};
  const u = span(t, 17.97, S7B), e = u * u * (1.6 - .6 * u);         // accelerating pull into the tunnel
  return {x: .5, y: .5, z: Math.exp(L(1.035) + (L(.3) - L(1.035)) * e)};
};
// 3D tilt on the cut: wall turned (left side near), rolled CCW; flattens by 14.3
// one decaying curve: fastest at the cut, settles exactly flat (cubic out)
const tiltK = (t: number) => 1 - eo(span(t, 13.8, 14.36), 3);

// frames: [src, x, y, h (world H units), rot deg]
type Fr = [string, number, number, number, number];
const CORE: Fr[] = [
  ['j1', .34, .1, .26, -.6], ['j2', .66, .1, .26, .5], ['j3', .06, .33, .26, .4], ['j4', .25, .62, .26, -.4],
  ['j5', .79, .48, .26, .3], ['j6', .6, .93, .26, -.5], ['j7', .88, .9, .26, .6], ['j8', .07, .88, .26, .2], ['j2', 1.05, .24, .26, -.3],
];
// outer ring for the tunnel pull-back: deterministic jittered grid outside the core
const OUTER: Fr[] = (() => {
  const o: Fr[] = []; let k = 0;
  for (let gy = -.85; gy < 1.95; gy += .38) for (let gx = -.85; gx < 1.95; gx += .27) {
    k++;
    const r1 = Math.sin(k * 12.9898) * 43758.5453, r2 = Math.sin(k * 78.233) * 12345.678;
    const jx = (r1 - Math.floor(r1) - .5) * .08, jy = (r2 - Math.floor(r2) - .5) * .08;
    const x = gx + jx, y = gy + jy;
    if (x > -.12 && x < 1.12 && y > -.12 && y < 1.12) continue;
    o.push([`j${1 + (k * 5) % 8}`, x, y, .26, (r1 - Math.floor(r1) - .5) * 1.4]);
  }
  return o;
})();
const AR: Record<string, number> = {hero_a: 917 / 920};

const Frame: React.FC<{f: Fr}> = ({f: [src, x, y, h, r]}) => {
  const hh = h * H, ww = hh * (AR[src] ?? 365 / 440);
  return <div style={{position: 'absolute', left: x * W - ww / 2, top: y * H - hh / 2, width: ww, height: hh, transform: `rotate(${r}deg)`,
    boxShadow: '0 14px 26px rgba(0,0,0,.75), 0 3px 6px rgba(0,0,0,.6)'}}>
    <Img src={staticFile(`iaa/s07/${src}.png`)} style={{width: ww, height: hh, display: 'block'}}/>
    {/* glass sheen */}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 62%, rgba(255,255,255,.05) 74%, rgba(255,255,255,0) 86%)'}}/>
  </div>;
};

const World: React.FC<{t: number}> = ({t}) => {
  const c = cam(t), k = tiltK(t), ry = 18 * k, rz = -6 * k;
  // pan blur = screen velocity x shutter (horizontal), plus a little for the tilt swing
  const vx = Math.abs(vel(camx, t)) * c.z * W * SHUT + Math.abs(vel(tiltK, t)) * 18 * 6 * SHUT;
  return <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 50%', filter: vx > .4 ? 'url(#s7pb)' : undefined}}>
    <svg width={0} height={0} style={{position: 'absolute'}}><filter id="s7pb" x="-5%" y="0%" width="110%" height="100%"><feGaussianBlur stdDeviation={`${(vx / 2.2).toFixed(2)} 0`}/></filter></svg>
    <AbsoluteFill style={{transform: `rotateY(${ry}deg) rotateZ(${rz}deg)`, transformOrigin: '50% 50%'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0',
        transform: `translate(${W * (.5 - c.x * c.z)}px, ${H * (.5 - c.y * c.z)}px) scale(${c.z})`}}>
        <Img src={staticFile('iaa/s07/planks.jpg')} style={{position: 'absolute', left: -W, top: -H, width: 3 * W, height: 3 * H,
          filter: 'saturate(.5) brightness(.6) contrast(1.12)'}}/>
        {/* warm downlight pools on the wall, world-locked */}
        {[[.5, .2], [.12, .2], [.88, .2], [.3, .62], [.72, .62]].map(([lx, ly], i) => <div key={i} style={{position: 'absolute',
          left: (lx - .3) * W, top: (ly - .3) * H, width: .6 * W, height: .6 * H, borderRadius: '50%', mixBlendMode: 'screen',
          background: 'radial-gradient(ellipse, rgba(255,205,150,.16) 0%, rgba(255,190,130,.06) 45%, rgba(0,0,0,0) 70%)'}}/>)}
        {OUTER.map((f, i) => <Frame key={'o' + i} f={f}/>)}
        {CORE.map((f, i) => <Frame key={'c' + i} f={f}/>)}
        <Frame f={['hero_a', .5, .5, .3, 0]}/>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// torn paper: [t, x, y, width (W), rotZ, rotY, rotX]
const PAP = [[16.1, -.17, .42, .22, -28, 78, 0], [16.3, -.05, .48, .25, -4, 64, 10], [16.5, .11, .54, .27, 13, 50, 12],
  [16.8, .29, .58, .26, -2, 33, 6], [17.0, .37, .56, .25, -15, 22, 3], [17.2, .44, .52, .235, -24, 14, 0],
  [17.5, .48, .48, .225, -29, 9, 0], [17.97, .5, .465, .215, -31, 6, 0]];
const Paper: React.FC<{t: number}> = ({t}) => {
  if (t < 16.1 || t > 18.15) return null;
  const tt = Math.min(t, 17.97), q = (c: number) => mono(tt, PAP, c);
  const fl = Math.sin(5.1 * Math.max(0, t - 17.5)) * .004 * ss(span(t, 17.5, 17.85));   // settled float, faded in (no jump)
  const sp = Math.hypot(vel(u => mono(Math.min(u, 17.97), PAP, 1), tt) * W, vel(u => mono(Math.min(u, 17.97), PAP, 2), tt) * H);
  const mb = clamp(sp * SHUT / 2.2, 0, 9);
  const burn = span(t, 17.97, 18.12);                                            // dies into the tunnel
  const w = q(3) * W * (1 - .55 * burn), h = w * 548 / 1509, x = q(1) * W, y = (q(2) + fl) * H;
  return <AbsoluteFill style={{perspective: 1100}}>
    <Img src={staticFile('iaa/s07/paper_a.png')} style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h,
      opacity: 1 - burn * burn, transform: `rotateZ(${q(4)}deg) rotateY(${q(5)}deg) rotateX(${q(6)}deg)`,
      filter: `sepia(.32) saturate(1.25) brightness(${.97 - .8 * burn}) blur(${.3 + mb + burn * 3}px) drop-shadow(0 10px 14px rgba(0,0,0,.7))`}}/>
  </AbsoluteFill>;
};

export const Shot7: React.FC<{t: number}> = ({t}) => {
  if (t < S7A || t >= S7B) return null;
  const tun = span(t, 17.97, S7B), ts = tun * tun * (1.5 - .5 * tun);
  return <AbsoluteFill style={{overflow: 'hidden', background: '#070605'}}>
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <filter id="s7tun" filterUnits="userSpaceOnUse" x={0} y={0} width={W} height={H} colorInterpolationFilters="sRGB">
        <feImage href={TUNNEL_MAP} x={0} y={0} width={W} height={H} preserveAspectRatio="none" result="m"/>
        <feDisplacementMap in="SourceGraphic" in2="m" scale={TUNNEL_S * ts} xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </svg>
    <AbsoluteFill style={{filter: tun > 0 ? `url(#s7tun) blur(${ts * 1.6}px)` : undefined}}>
      <World t={t}/>
    </AbsoluteFill>
    <Paper t={t}/>
    {/* heavy hall-of-fame vignette (screen space), darker as the tunnel recedes */}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 62% 66% at 50% 47%, rgba(0,0,0,0) 30%, rgba(0,0,0,.55) 72%, rgba(0,0,0,.93) 100%)'}}/>
    {ts > 0 && <AbsoluteFill style={{background: '#000', opacity: .3 * ts}}/>}
  </AbsoluteFill>;
};
