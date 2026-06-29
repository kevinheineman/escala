import { describe, it, expect } from 'vitest';
import { stepSize, tokenName, fluid, sizeAt, buildScale } from './scale.js';
import { DEFAULT_CFG } from './presets.js';

describe('stepSize', () => {
  it('is the base at step 0 and scales by the ratio', () => {
    expect(stepSize(16, 1.2, 0)).toBeCloseTo(16, 10);
    expect(stepSize(16, 1.2, 1)).toBeCloseTo(19.2, 10);
    expect(stepSize(16, 2, 3)).toBeCloseTo(128, 10);
  });

  it('goes below the base for negative steps', () => {
    expect(stepSize(16, 2, -1)).toBeCloseTo(8, 10);
  });
});

describe('tokenName', () => {
  it('names steps Tailwind-style around the base', () => {
    expect(tokenName(0)).toBe('base');
    expect(tokenName(1)).toBe('lg');
    expect(tokenName(2)).toBe('xl');
    expect(tokenName(3)).toBe('2xl');
    expect(tokenName(-1)).toBe('sm');
    expect(tokenName(-2)).toBe('xs');
  });
});

describe('fluid', () => {
  it('produces a clamp() with rem bounds and a vw term', () => {
    const f = fluid(16, 18, 320, 1280);
    expect(f.fixed).toBe(false);
    expect(f.minRem).toBe(1);
    expect(f.maxRem).toBe(1.125);
    expect(f.vw).toBeCloseTo(0.2083, 3);
    expect(f.css).toContain('clamp(');
    expect(f.css).toContain('vw');
    expect(f.css).toContain('rem');
  });

  it('collapses to a plain rem when the step does not change', () => {
    const f = fluid(16, 16, 320, 1280);
    expect(f.fixed).toBe(true);
    expect(f.css).toBe('1rem');
  });

  it('always keeps a rem lower bound (zoom-safety guarantee)', () => {
    const f = fluid(40, 96, 360, 1440);
    expect(f.css).toMatch(/^clamp\(\d/); // first arg is a rem number, never a bare vw
    expect(f.minRem).toBeGreaterThan(0);
  });
});

describe('sizeAt', () => {
  it('hits the endpoints and interpolates the middle', () => {
    expect(sizeAt(16, 18, 320, 1280, 320)).toBeCloseTo(16, 6);
    expect(sizeAt(16, 18, 320, 1280, 1280)).toBeCloseTo(18, 6);
    expect(sizeAt(16, 18, 320, 1280, 800)).toBeCloseTo(17, 6);
  });

  it('clamps outside the viewport range', () => {
    expect(sizeAt(16, 18, 320, 1280, 200)).toBeCloseTo(16, 6);
    expect(sizeAt(16, 18, 320, 1280, 2000)).toBeCloseTo(18, 6);
  });
});

describe('buildScale', () => {
  it('returns stepsUp + stepsDown + 1 steps, largest first', () => {
    const scale = buildScale(DEFAULT_CFG);
    expect(scale).toHaveLength(DEFAULT_CFG.stepsUp + DEFAULT_CFG.stepsDown + 1);
    expect(scale[0].step).toBe(DEFAULT_CFG.stepsUp);
    expect(scale[scale.length - 1].step).toBe(-DEFAULT_CFG.stepsDown);
  });

  it('anchors the base step at the configured base sizes', () => {
    const base = buildScale(DEFAULT_CFG).find((s) => s.step === 0);
    expect(base.name).toBe('base');
    expect(base.minPx).toBe(16);
    expect(base.maxPx).toBe(18);
    expect(base.lineHeight).toBe(1.5);
  });
});
