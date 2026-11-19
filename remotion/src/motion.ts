// Shared motion maths for edit 09 (after the "no smoothness" review): C1 curves, real easing, velocity-derived blur.
// Rules: no per-segment smoothstep chains (they stop at every key), no linear paths (velocity jumps at every key).
// Camera/sprite blur = velocity x shutter (180 deg at 30 fps = 1/60 s).
export const SHUT = .5 / 30;
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const eo = (x: number, p = 3) => 1 - Math.pow(1 - clamp(x, 0, 1), p);     // out (decelerate)
export const ei = (x: number, p = 2.5) => Math.pow(clamp(x, 0, 1), p);           // in (accelerate)
export const eio = (x: number, p = 3) => { x = clamp(x, 0, 1); return x < .5 ? Math.pow(2 * x, p) / 2 : 1 - Math.pow(2 - 2 * x, p) / 2; };
export const ss = (x: number) => { x = clamp(x, 0, 1); return x * x * x * (x * (6 * x - 15) + 10); };   // smootherstep (C2 ends)

// Monotone cubic Hermite (Fritsch-Carlson). keys = [t, v0, v1, ...]; column c. C1, never overshoots,
// slope 0 exactly at local extrema (so sway keys belong on the peaks), smooth through every other key.
type K = number[][];
const tanCache = new WeakMap<K, number[][]>();
const tangents = (k: K) => {
  let m = tanCache.get(k);
  if (m) return m;
  const n = k.length, cols = k[0].length;
  m = [];
  for (let c = 1; c < cols; c++) {
    const d: number[] = [], tg: number[] = new Array(n).fill(0);
    for (let i = 0; i < n - 1; i++) d.push((k[i + 1][c] - k[i][c]) / (k[i + 1][0] - k[i][0]));
    tg[0] = d[0]; tg[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) {
      if (d[i - 1] * d[i] <= 0) tg[i] = 0;
      else {
        const h0 = k[i][0] - k[i - 1][0], h1 = k[i + 1][0] - k[i][0];
        const w1 = 2 * h1 + h0, w2 = h1 + 2 * h0;
        tg[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);   // weighted harmonic mean
      }
    }
    m[c] = tg;
  }
  tanCache.set(k, m);
  return m;
};
export const mono = (t: number, k: K, c = 1) => {
  const n = k.length;
  if (t <= k[0][0]) return k[0][c];
  if (t >= k[n - 1][0]) return k[n - 1][c];
  let i = 0;
  while (t > k[i + 1][0]) i++;
  const m = tangents(k)[c], h = k[i + 1][0] - k[i][0], u = (t - k[i][0]) / h, u2 = u * u, u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * k[i][c] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * k[i + 1][c] + (u3 - u2) * h * m[i + 1];
};
// derivative (per second) of any curve
export const vel = (f: (t: number) => number, t: number, h = 1 / 240) => (f(t + h) - f(t - h)) / (2 * h);

// spring step response (critically under-damped overshoot) for entries: 0 -> 1 with one soft overshoot
export const spring = (x: number, zeta = .55, w = 11) => {
  if (x <= 0) return 0;
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * x) * (Math.cos(wd * x) + zeta * w / wd * Math.sin(wd * x));
};
