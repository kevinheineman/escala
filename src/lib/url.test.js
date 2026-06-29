import { describe, it, expect } from 'vitest';
import { encodeConfig, decodeConfig } from './url.js';
import { DEFAULT_CFG } from './presets.js';

describe('config url round-trip', () => {
  it('encodes and decodes back to the same config', () => {
    const encoded = encodeConfig(DEFAULT_CFG);
    expect(encoded.startsWith('s=')).toBe(true);
    expect(decodeConfig(encoded)).toEqual(DEFAULT_CFG);
  });

  it('tolerates a leading hash', () => {
    expect(decodeConfig(`#${encodeConfig(DEFAULT_CFG)}`)).toEqual(DEFAULT_CFG);
  });

  it('returns null for absent or malformed input', () => {
    expect(decodeConfig('')).toBeNull();
    expect(decodeConfig('#x=1')).toBeNull();
    expect(decodeConfig('#s=not_valid_base64!!')).toBeNull();
  });
});
