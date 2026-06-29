import { describe, it, expect } from 'vitest';
import { toCss, toTailwind, toTokens, toJsonSpec, EXPORTERS } from './exporters.js';
import { buildScale } from './scale.js';
import { DEFAULT_CFG } from './presets.js';

const scale = buildScale(DEFAULT_CFG);

describe('toCss', () => {
  it('emits custom properties for sizes, leading, and measure', () => {
    const css = toCss(scale);
    expect(css).toContain(':root {');
    expect(css).toContain('--text-base:');
    expect(css).toContain('--leading-base:');
    expect(css).toContain('--measure: 66ch;');
  });
});

describe('toTailwind', () => {
  it('emits a fontSize map with [size, { lineHeight }] tuples', () => {
    const tw = toTailwind(scale);
    expect(tw).toContain('fontSize:');
    expect(tw).toContain("'base': ['clamp(");
    expect(tw).toContain('lineHeight:');
  });
});

describe('toTokens', () => {
  it('emits valid W3C-style tokens', () => {
    const tokens = JSON.parse(toTokens(scale));
    expect(tokens.font.size.base.$type).toBe('dimension');
    expect(typeof tokens.font.size.base.$value).toBe('string');
    expect(tokens.font.lineHeight.base.$value).toBe(1.5);
  });
});

describe('toJsonSpec', () => {
  it('is a machine-readable, diffable spec', () => {
    const spec = JSON.parse(toJsonSpec(scale, DEFAULT_CFG));
    expect(spec.generatedBy).toBe('Escala');
    expect(spec.steps).toHaveLength(scale.length);
    expect(spec.steps[0]).toHaveProperty('clamp');
    expect(spec.steps[0]).toHaveProperty('lineHeight');
  });
});

describe('EXPORTERS', () => {
  it('every exporter returns a non-empty string', () => {
    for (const e of EXPORTERS) {
      const out = e.fn(scale, DEFAULT_CFG);
      expect(typeof out).toBe('string');
      expect(out.length).toBeGreaterThan(0);
    }
  });
});
