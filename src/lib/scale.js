// Modular type scale with fluid clamp() interpolation. Framework-free, pure,
// unit-tested. Sizes are computed in px, then emitted as rem + vw so the result
// scales with the user's font-size preference (see fluid() below).
import { lineHeightFor } from './typography.js';

/** Assumed root font size. rem math below is relative to this. */
export const ROOT_PX = 16;

const UP = ['lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];
const DOWN = ['sm', 'xs', '2xs', '3xs', '4xs'];

/** Tailwind-style token name for a step offset from the base (0 = base). */
export function tokenName(step) {
  if (step === 0) return 'base';
  if (step > 0) return UP[step - 1] || `${step + 1}xl`;
  return DOWN[-step - 1] || `${-step}xs`;
}

const round = (n, d = 4) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

/** Size in px for a step of a modular scale. */
export const stepSize = (base, ratio, step) => base * Math.pow(ratio, step);

/**
 * Build a fluid value that grows linearly from `sMin` (px, at `minVw`) to
 * `sMax` (px, at `maxVw`), expressed as `clamp(minRem, <rem> + <vw>, maxRem)`.
 *
 * The lower/upper bounds are in rem and the preferred value keeps a rem term,
 * so text still responds to browser zoom and the user's default font size — a
 * size expressed purely in vw would not, which is the usual WCAG 1.4.4 trap.
 */
export function fluid(sMin, sMax, minVw, maxVw, root = ROOT_PX) {
  const lo = Math.min(sMin, sMax);
  const hi = Math.max(sMin, sMax);

  // No viewport range, or a step that doesn't change: emit a plain rem value.
  if (maxVw <= minVw || Math.abs(sMax - sMin) < 1e-4) {
    const rem = round(hi / root, 4);
    return { minRem: rem, maxRem: rem, interceptRem: rem, vw: 0, slope: 0, css: `${rem}rem`, fixed: true };
  }

  const slope = (sMax - sMin) / (maxVw - minVw); // px of size per px of viewport
  const interceptPx = sMin - slope * minVw;
  const vw = round(slope * 100, 4); // 1vw = viewport/100 px, so coefficient is slope*100
  const interceptRem = round(interceptPx / root, 4);
  const minRem = round(lo / root, 4);
  const maxRem = round(hi / root, 4);
  const sign = vw < 0 ? '-' : '+';
  const css = `clamp(${minRem}rem, ${interceptRem}rem ${sign} ${Math.abs(vw)}vw, ${maxRem}rem)`;
  return { minRem, maxRem, interceptRem, vw, slope, css, fixed: false };
}

/** Resolved px size at a given viewport width — mirrors the CSS clamp exactly. */
export function sizeAt(sMin, sMax, minVw, maxVw, vw) {
  if (maxVw <= minVw) return sMax;
  const slope = (sMax - sMin) / (maxVw - minVw);
  const pref = sMin + slope * (vw - minVw);
  const lo = Math.min(sMin, sMax);
  const hi = Math.max(sMin, sMax);
  return Math.min(hi, Math.max(lo, pref));
}

/** Build the full scale (largest step first) from a config object. */
export function buildScale(cfg) {
  const steps = [];
  for (let s = cfg.stepsUp; s >= -cfg.stepsDown; s--) {
    const sMin = stepSize(cfg.baseMin, cfg.ratioMin, s);
    const sMax = stepSize(cfg.baseMax, cfg.ratioMax, s);
    steps.push({
      step: s,
      name: tokenName(s),
      minPx: round(sMin, 2),
      maxPx: round(sMax, 2),
      lineHeight: lineHeightFor(sMax),
      ...fluid(sMin, sMax, cfg.minVw, cfg.maxVw),
    });
  }
  return steps;
}
