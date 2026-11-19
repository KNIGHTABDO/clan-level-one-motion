// Edit 08 shader v2 (after Fable's direction report, research/fable_direction08.md §6.2).
// One draw per frame. A/B = consecutive source frames (frame-blend), E1..E4 = earlier frames (temporal echo),
// M = body matte (mmode 1) or clean plate for a difference key (mmode 2), used by the spatial ghosts.
// Stack: stretch / blocks (screen space) -> lens xform -> defocus | dir+zoom blur (32 taps) | 1 tap, RGB split in every tap
//        -> temporal echo -> ghosts (screen blend) -> bloom (2 rings) -> local glow -> gamma -> exposure -> grade -> vignette -> grain.
// v1 bug fixed: delayRender is now taken in useLayoutEffect (synchronously at commit), so a frame is never captured before its draw.
import React, {useLayoutEffect, useRef} from 'react';
import {continueRender, delayRender} from 'remotion';

export type P08 = {
  mix: number; scale: number; center: [number, number]; warp: number; zb: number; dir: [number, number];
  shake: [number, number]; rot: number; expo: number; gamma: number; ca: number; split: [number, number];
  con: number; sat: number; lift: number; tint: [number, number, number]; bw: number;
  vig: number; bloom: number; echo: number; grain: number; seed: number;
  defocus: number; blocks: number; blockWhite: number;
  stretch: [number, number, number, number];   // x0, xFade, side (+1 right of x0 / -1 left), amount
  glow: [number, number, number, number];      // cx, cy, radius, amount (local exposure)
  gn: number; gstep: [number, number]; gop: number; gdecay: number; mmode: number;
  zbc: [number, number];                       // zoom-blur centre in uv (x<0 = use center)
};
export const P0: P08 = {
  mix: 0, scale: 1, center: [.5, .5], warp: 0, zb: 0, dir: [0, 0], shake: [0, 0], rot: 0, expo: 0, gamma: 1, ca: 0, split: [0, 0],
  con: 1, sat: 1, lift: 0, tint: [1, 1, 1], bw: 0, vig: 0, bloom: 0, echo: 0, grain: .04, seed: 0,
  defocus: 0, blocks: 0, blockWhite: 0, stretch: [0, 1, 1, 0], glow: [.5, .5, .1, 0],
  gn: 0, gstep: [.094, 0], gop: .6, gdecay: .72, mmode: 0, zbc: [-1, -1],
};

const FRAG = `precision highp float;
uniform sampler2D A; uniform sampler2D B; uniform sampler2D E1; uniform sampler2D E2; uniform sampler2D E3; uniform sampler2D E4; uniform sampler2D M;
uniform vec2 res, dir, shake, ctr, split, gstep, zbc; uniform vec3 tint; uniform vec4 stretch, glow;
uniform float mixv, warp, scale, zb, rot, expo, gam, ca, con, sat, lift, bw, vig, bloom, echo, grain, seed, taps,
  defocus, blocks, blockW, gn, gop, gdecay, mmode;
varying vec2 vUv;
const vec3 LUM = vec3(0.299, 0.587, 0.114);
vec2 mirror(vec2 u){ return 1.0 - abs(mod(u, 2.0) - 1.0); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + seed) * 43758.5453); }
vec2 xform(vec2 s){
  vec2 p = s - ctr; float ar = res.x/res.y; p.x *= ar;
  p *= 1.0 + warp * dot(p,p);
  float c = cos(rot), sn = sin(rot); p = mat2(c,-sn,sn,c) * p;
  p /= scale; p.x /= ar;
  return p + ctr + shake;
}
vec3 base(vec2 u){ u = mirror(u); return mix(texture2D(A,u).rgb, texture2D(B,u).rgb, mixv); }
vec3 tapc(vec2 u){
  vec3 c = abs(split.x) + abs(split.y) > 0.00001 ? vec3(base(u + split).r, base(u).g, base(u - split).b) : base(u);
  if (ca > 0.001) { vec2 d = (u - ctr) * ca; c = vec3(base(u + d).r, c.g, base(u - d).b); }
  return c;
}
void main(){
  vec2 s = vec2(vUv.x, 1.0 - vUv.y); float ar = res.x/res.y;
  float sdim = 1.0, wblock = 0.0;
  if (stretch.w > 0.0 && (s.x - stretch.x) * stretch.z > 0.0) {
    float t = clamp((s.x - stretch.x) / (stretch.y - stretch.x), 0.0, 1.0);
    sdim = 1.0 - smoothstep(0.0, 1.0, t) * stretch.w;
    s.x = mix(s.x, stretch.x, stretch.w);
  }
  if (blocks > 0.0) {
    vec2 cell = floor(vec2(vUv.x, 1.0 - vUv.y) * vec2(24.0, 14.0));
    if (hash(cell) < blocks) { if (blockW > 0.5) wblock = 1.0; else s.x = cell.x / 24.0 - 0.06 * hash(cell + 3.1); }
  }
  vec2 uv = xform(s);
  vec3 col;
  if (defocus > 0.0) {
    vec3 acc = vec3(0.0); float tot = 0.0;
    for (int i = 0; i < 24; i++) {
      float fi = float(i); float r = sqrt((fi + 0.5) / 24.0) * defocus; float a = fi * 2.39996;
      vec3 c = tapc(uv + vec2(cos(a) * r / ar, sin(a) * r));
      float w = 1.0 + 6.0 * max(dot(c, LUM) - 0.6, 0.0);
      acc += c * w; tot += w;
    }
    col = acc / tot;
  } else if (taps > 1.5) {
    vec3 acc = vec3(0.0); float tot = 0.0;
    for (int i = 0; i < 32; i++) {
      float t = float(i) / 31.0; float w = 1.0 - 0.6 * t;
      vec2 u = uv + dir * (t - 0.5);
      vec2 zc = zbc.x < -0.5 ? ctr : zbc;
      u = zc + (u - zc) * (1.0 - zb * t);
      acc += tapc(u) * w; tot += w;
    }
    col = acc / tot;
  } else { col = tapc(uv); }
  if (echo > 0.0) {
    vec2 m = mirror(uv);
    col = mix(col, max(col, texture2D(E1, m).rgb), 0.50 * echo);
    col = mix(col, max(col, texture2D(E2, m).rgb), 0.35 * echo);
    col = mix(col, max(col, texture2D(E3, m).rgb), 0.22 * echo);
    col = mix(col, max(col, texture2D(E4, m).rgb), 0.12 * echo);
  }
  if (gn > 0.5) {
    for (int k = 1; k <= 6; k++) {
      float fk = float(k); if (fk > gn) break;
      vec2 uk = xform(s - gstep * fk); float bx = 0.006 * fk;
      vec3 c = (base(uk) + base(uk + vec2(bx, 0.0)) + base(uk - vec2(bx, 0.0))) / 3.0;
      float msk = 1.0;
      if (mmode > 1.5) msk = smoothstep(0.06, 0.2, length(base(uk) - texture2D(M, mirror(uk)).rgb));
      else if (mmode > 0.5) msk = texture2D(M, mirror(uk)).r;
      vec3 g = mix(vec3(dot(c, LUM)), vec3(1.0), 0.35) * 1.15;
      float a = gop * pow(gdecay, fk - 1.0) * msk;
      col = 1.0 - (1.0 - col) * (1.0 - clamp(g * a, 0.0, 1.0));
    }
  }
  if (bloom > 0.0) {
    vec3 b = vec3(0.0);
    for (int i = 0; i < 24; i++) {
      float fi = float(i); float a = fi * 0.5236 + (fi >= 12.0 ? 0.26 : 0.0); float r = fi < 12.0 ? 0.02 : 0.06;
      b += max(base(uv + vec2(cos(a) * r / ar, sin(a) * r)) - 0.6, 0.0);
    }
    col += b / 24.0 * 3.0 * bloom;
  }
  if (glow.w > 0.0) { float d = length((s - glow.xy) * vec2(ar, 1.0)); col *= 1.0 + 2.0 * glow.w * (1.0 - smoothstep(0.0, glow.z, d)); }
  col = pow(max(col, 0.0), vec3(gam));
  col = expo >= 0.0 ? col * (1.0 + 2.0 * expo) + vec3(expo * expo * 0.6) : col * (1.0 + expo);
  col = (col - 0.5) * con + 0.5;
  col = col + lift * (1.0 - col);
  float l = dot(col, LUM);
  col = mix(vec3(l), col, sat * (1.0 - 0.5 * smoothstep(0.7, 1.0, l))) * tint;
  col = mix(col, vec3(smoothstep(0.05, 0.95, l)), bw);
  vec2 q = vUv - 0.5; col *= 1.0 - vig * smoothstep(0.25, 0.85, length(q * vec2(1.0, 0.8)) * 1.25);
  col *= sdim;
  col = mix(col, vec3(0.96, 0.95, 0.92), wblock);
  col += (hash(vUv * res) - 0.5) * grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;
const VERT = `attribute vec2 p; varying vec2 vUv; void main(){ vUv = p*0.5+0.5; gl_Position = vec4(p,0.0,1.0); }`;
const cache = new Map<string, Promise<HTMLImageElement>>();
const loadImg = (src: string) => {
  if (!cache.has(src)) {
    if (cache.size > 48) cache.delete(cache.keys().next().value as string);
    cache.set(src, new Promise((ok, bad) => { const i = new Image(); i.onload = () => i.decode().then(() => ok(i), () => ok(i)); i.onerror = bad; i.src = src; }));
  }
  return cache.get(src)!;
};
const SAMP = ['A', 'B', 'E1', 'E2', 'E3', 'E4', 'M'];

export const Warp08: React.FC<{a: string; b: string; c?: string; e?: string[]; m?: string; p: Partial<P08>; width: number; height: number}> = ({a, b, c, e, m, p: pp, width, height}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{gl: WebGLRenderingContext; prog: WebGLProgram; t: WebGLTexture[]} | null>(null);
  const p: P08 = {...P0, ...pp};
  const ech = e ?? (c ? [c, c, c, c] : []);
  const key = JSON.stringify([a, b, ech, m, p, width, height]);
  useLayoutEffect(() => {
    // taken synchronously at commit: the renderer cannot screenshot this frame until the draw below has finished
    const handle = delayRender('warp08');
    let alive = true, done = false;
    const fin = () => { if (!done) { done = true; continueRender(handle); } };
    (async () => {
      const cv = ref.current!;
      if (!glRef.current) {
        const gl = cv.getContext('webgl', {preserveDrawingBuffer: true})!;
        const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader'); return s; };
        const prog = gl.createProgram()!; gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link');
        gl.useProgram(prog);
        const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const tex = () => { const t = gl.createTexture()!; gl.bindTexture(gl.TEXTURE_2D, t); [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE)); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); return t; };
        glRef.current = {gl, prog, t: SAMP.map(tex)};
      }
      const {gl, prog, t} = glRef.current;
      const srcs = [a, b, ech[0] ?? a, ech[1] ?? a, ech[2] ?? a, ech[3] ?? a, m ?? a];
      const imgs = await Promise.all(srcs.map(loadImg));
      if (!alive) return;
      imgs.forEach((img, i) => { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t[i]); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); });
      const U = (n: string) => gl.getUniformLocation(prog, n);
      SAMP.forEach((n, i) => gl.uniform1i(U(n), i));
      gl.uniform2f(U('res'), width, height);
      const f1: [string, number][] = [['mixv', p.mix], ['warp', p.warp], ['scale', p.scale], ['zb', p.zb], ['rot', p.rot], ['expo', p.expo], ['gam', p.gamma], ['ca', p.ca],
        ['con', p.con], ['sat', p.sat], ['lift', p.lift], ['bw', p.bw], ['vig', p.vig], ['bloom', p.bloom], ['echo', ech.length ? p.echo : 0], ['grain', p.grain], ['seed', p.seed],
        ['defocus', p.defocus], ['blocks', p.blocks], ['blockW', p.blockWhite], ['gn', p.gn], ['gop', p.gop], ['gdecay', p.gdecay], ['mmode', m ? p.mmode : 0]];
      f1.forEach(([n, v]) => gl.uniform1f(U(n), v));
      const blur = Math.abs(p.zb) > 0.002 || Math.hypot(p.dir[0], p.dir[1]) > 0.002;
      gl.uniform1f(U('taps'), blur ? 32 : 1);
      const v2: [string, [number, number]][] = [['dir', p.dir], ['shake', p.shake], ['ctr', p.center], ['split', p.split], ['gstep', p.gstep], ['zbc', p.zbc]];
      v2.forEach(([n, v]) => gl.uniform2f(U(n), v[0], v[1]));
      gl.uniform3f(U('tint'), p.tint[0], p.tint[1], p.tint[2]);
      gl.uniform4f(U('stretch'), ...p.stretch); gl.uniform4f(U('glow'), ...p.glow);
      gl.viewport(0, 0, width, height); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.finish();
      fin();
    })().catch((err) => { console.error(err); fin(); });
    return () => { alive = false; fin(); };
  }, [key]);
  return <canvas ref={ref} width={width} height={height} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}/>;
};
