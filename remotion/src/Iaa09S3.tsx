// Edit 09, talking head S3 (ref 33.3-38.05 "HARD To Be HUNGRY"): native Omni take D, teal bokeh grade, Arabic neon kinetic words.
// Comp t 0 = ref 33.30. 0-.45 diagonal blue slab wipe from the right; take D starts at OFF.
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Warp08, P0, P08} from './Warp08';

const W = 1920, H = 1080, FPS = 30;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
const eout = (x: number) => 1 - Math.pow(1 - x, 3);
const eio = (x: number) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

export const S3_FRAMES = 147;
const OFF = 14 / FPS;                    // take D t=0 lands on comp frame 14
const TN = 120;                          // take frames (24 fps)
const turl = (i: number) => staticFile(`iaa/s3comp/${String(clamp(Math.round(i), 1, TN)).padStart(5, '0')}.jpg`);

// ---------- words (take-D seconds from the envelope; comp t = take t + OFF) ----------
type Wd = {txt: string; at: number; size: number; style: 'white' | 'red' | 'gold' | 'cyan'; line: number};
type Grp = {words: Wd[]; out: number};
const GROUPS: Grp[] = [
  {out: 1.80, words: [
    {txt: 'الكل', at: .04, size: 74, style: 'white', line: 0},
    {txt: 'يدّعي', at: .32, size: 74, style: 'white', line: 0},
    {txt: 'القوة', at: .68, size: 158, style: 'red', line: 1},
  ]},
  {out: 3.30, words: [
    {txt: 'بس', at: 2.12, size: 74, style: 'white', line: 0},
    {txt: 'الميدان', at: 2.28, size: 126, style: 'red', line: 1},
    {txt: 'ما يعترف', at: 2.90, size: 84, style: 'cyan', line: 2},
  ]},
  {out: 9, words: [
    {txt: 'إلا', at: 3.46, size: 74, style: 'white', line: 0},
    {txt: 'بالرجال', at: 3.68, size: 152, style: 'gold', line: 1},
  ]},
];
const NEONC = {
  white: {c: '#ffffff', g: 'rgba(200,230,255,.9)', s: 'rgba(120,180,255,.55)'},
  red: {c: '#ffe1e3', g: '#ff2238', s: 'rgba(255,0,30,.75)'},
  gold: {c: '#fff7cf', g: '#ffc21a', s: 'rgba(255,150,0,.75)'},
  cyan: {c: 'rgba(0,0,0,0)', g: '#3ee8ff', s: 'rgba(0,200,255,.7)'},
};
const FLICK = [1, .25, .9, .45, 1];      // first frames of a word: neon tube striking
const Word: React.FC<{w: Wd; t: number; outA: number}> = ({w, t, outA}) => {
  const lt = t - (w.at + OFF);
  if (lt < 0) return null;
  const fi = Math.floor(lt * FPS), fl = fi < FLICK.length ? FLICK[fi] : 1;
  const pop = 1 + .16 * (1 - eout(span(lt, 0, .16)));
  const n = NEONC[w.style], big = w.size > 120;
  const hum = big ? .93 + .07 * Math.sin(t * 37 + w.at * 9) : 1;   // slight neon hum
  return <span style={{display: 'inline-block', marginLeft: 22, fontSize: w.size, lineHeight: big ? .95 : 1.05,
    transform: `scale(${pop})`, transformOrigin: '100% 60%', opacity: fl * outA * hum,
    color: n.c, WebkitTextStroke: w.style === 'cyan' ? `3px ${n.g}` : big ? `2px ${n.g}` : undefined,
    textShadow: `0 0 4px ${n.g}, 0 0 14px ${n.g}, 0 0 34px ${n.s}, 0 0 70px ${n.s}`}}>{w.txt}</span>;
};
const Captions: React.FC<{t: number}> = ({t}) => <>{GROUPS.map((g, gi) => {
  const first = g.words[0].at + OFF;
  if (t < first) return null;
  const tout = g.out + OFF, outA = 1 - span(t, tout, tout + .22);
  if (outA <= 0) return null;
  const lines = [0, 1, 2].map(l => g.words.filter(w => w.line === l)).filter(l => l.length);
  return <div key={gi} dir="rtl" style={{position: 'absolute', left: W * .035, top: H * .30, fontFamily: 'Cairo', fontWeight: 900,
    textAlign: 'right', whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
    {lines.map((l, li) => <div key={li} style={{marginTop: li ? -18 : 0}}>{l.map((w, wi) => <Word key={wi} w={w} t={t} outA={outA}/>)}</div>)}
  </div>;
})}</>;

// ---------- picture ----------
const Talk: React.FC<{t: number; f: number; blur?: number; dx?: number; zoom?: number}> = ({t, f, blur = 0, dx = 0, zoom = 0}) => {
  const tt = Math.max(0, t - OFF), fr = tt * 24, i0 = Math.floor(fr);
  const lt = t / (S3_FRAMES / FPS);
  // punch-in on the big words
  const hits = [.68, 2.28, 3.68].map(a => a + OFF), punch = hits.reduce((s, h) => s + (t > h ? .022 * Math.exp(-(t - h) * 7) : 0), 0);
  const p: Partial<P08> = {
    ...P0, mix: fr - i0,
    scale: 1.03 + .04 * eio(lt) + punch + zoom, center: [.5, .3],
    expo: .13, gamma: 1.0, con: 1.1, sat: 1.06, lift: .012, tint: [.97, 1.0, 1.04],
    vig: .45, bloom: .3, grain: .05, seed: f % 13, ca: .0012 + blur * .1,
    glow: [.57, .4, .2, .1], defocus: blur,
  };
  return <AbsoluteFill style={{transform: `translateX(${dx * W}px)`}}>
    <Warp08 a={turl(i0 + 1)} b={turl(i0 + 2)} p={p} width={W} height={H}/>
  </AbsoluteFill>;
};

// ---------- 0-OFF: flat navy slab sweeps right->left over the outgoing shot; the new shot slides in defocused behind it,
// hard cut to sharp at OFF (ref 33.20-33.77, measured at 1/30 s) ----------
const kf = (t: number, k: number[][]) => { if (t <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (t <= k[i][0]) {
  const u = (t - k[i - 1][0]) / (k[i][0] - k[i - 1][0]); return k[i - 1][1] + (k[i][1] - k[i - 1][1]) * u; } return k[k.length - 1][1]; };
const LEAD = [[0, .58], [.1, .47], [.2, .36], [.27, .05], [.33, -.4]];      // slab left edge at mid-height (fraction of W)
const TRAIL = [[0, 1.25], [.23, .93], [.3, .62], [.37, .42], [.47, .3]];     // slab right edge = reveal edge of the new shot
const SK = .1;                                                              // lean: top edge sits SK*W right of the bottom
const Wipe: React.FC<{t: number; f: number}> = ({t, f}) => {
  const sl = 1 - .04 * eio(t / OFF);   // outgoing shot keeps drifting left under the slab
  if (t >= OFF) return null;
  const L = kf(t, LEAD), R = kf(t, TRAIL);
  const ex = (x: number, y: number) => (x + SK * (.5 - y)) * W;
  const reveal = `polygon(${ex(R, 0)}px 0, ${W * 2}px 0, ${W * 2}px ${H}px, ${ex(R, 1)}px ${H}px)`;
  const slab = `polygon(${ex(L, 0)}px 0, ${ex(R, 0)}px 0, ${ex(R, 1)}px ${H}px, ${ex(L, 1)}px ${H}px)`;
  const rim = `polygon(${ex(L, 0) - 5}px 0, ${ex(L, 0) + 3}px 0, ${ex(L, 1) + 3}px ${H}px, ${ex(L, 1) - 5}px ${H}px)`;
  const u = t / OFF;
  return <>
    <AbsoluteFill style={{background: '#000'}}><Img src={staticFile('iaa/s3_under.jpg')} style={{width: W, height: H, transform: `translateX(${-(1 - sl) * W}px) scale(1.03)`}}/></AbsoluteFill>
    <AbsoluteFill style={{clipPath: reveal, WebkitClipPath: reveal}}>
      <Talk t={t} f={f} blur={.042 - .008 * u} dx={.2 - .09 * eout(u)} zoom={.16}/>
    </AbsoluteFill>
    <AbsoluteFill style={{clipPath: slab, WebkitClipPath: slab, background: 'linear-gradient(90deg, #082a4b 0%, #0b3055 60%, #0a2c4e 100%)'}}/>
    <AbsoluteFill style={{clipPath: rim, WebkitClipPath: rim, background: 'rgba(120,170,215,.55)', filter: 'blur(1px)'}}/>
  </>;
};

export const Iaa09S3: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    {t >= OFF ? <Talk t={t} f={f}/> : <Wipe t={t} f={f}/>}
    <Captions t={t}/>
    <Audio src={staticFile('iaa/bed.mp3')} startFrom={Math.round(33.3 * FPS)} volume={.38}/>
    <Sequence from={14}><Audio src={staticFile('iaa/s3talk.wav')}/></Sequence>
  </AbsoluteFill>;
};
