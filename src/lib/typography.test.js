import { describe, it, expect } from 'vitest';
import { lineHeightFor, runChecks, MEASURE } from './typography.js';
import { buildScale } from './scale.js';
import { DEFAULT_CFG } from './presets.js';

describe('lineHeightFor', () => {
  it('keeps body and smaller at 1.5', () => {
    expect(lineHeightFor(12)).toBe(1.5);
    expect(lineHeightFor(16)).toBe(1.5);
    expect(lineHeightFor(22)).toBe(1.5);
  });

  it('tightens larger sizes but never below 1.1', () => {
    expect(lineHeightFor(48)).toBe(1.28);
    expect(lineHeightFor(48)).toBeLessThan(1.5);
    expect(lineHeightFor(200)).toBe(1.1);
  });
});

describe('runChecks', () => {
  it('passes the body-size and zoom-safety checks at the defaults', () => {
    const checks = runChecks(buildScale(DEFAULT_CFG), DEFAULT_CFG);
    const by = (id) => checks.find((c) => c.id === id);
    expect(by('body-min').status).toBe('pass');
    expect(by('zoom-safe').status).toBe('pass');
    expect(by('body-leading').status).toBe('pass');
  });

  it('warns when the min base drops below 16px', () => {
    const cfg = { ...DEFAULT_CFG, baseMin: 14 };
    const checks = runChecks(buildScale(cfg), cfg);
    expect(checks.find((c) => c.id === 'body-min').status).toBe('warn');
  });

  it('exposes the measure as info', () => {
    const checks = runChecks(buildScale(DEFAULT_CFG), DEFAULT_CFG);
    const m = checks.find((c) => c.id === 'measure');
    expect(m.status).toBe('info');
    expect(m.detail).toContain(`${MEASURE.ideal}ch`);
  });
});
