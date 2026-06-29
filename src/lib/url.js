// Encode the scale config in the URL hash so any scale is a shareable link.
// Format: `#s=<base64url of compact JSON>`. Mirrors contraste's url.js.

function toBase64Url(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const ORDER = [
  'minVw',
  'maxVw',
  'baseMin',
  'baseMax',
  'ratioMin',
  'ratioMax',
  'stepsUp',
  'stepsDown',
];

/** Serialize a config to a hash fragment (without the leading `#`). */
export function encodeConfig(cfg) {
  const compact = { v: 1, c: ORDER.map((k) => cfg[k]) };
  return `s=${toBase64Url(JSON.stringify(compact))}`;
}

/** Parse a config out of a hash fragment, or `null` if absent/invalid. */
export function decodeConfig(hash) {
  try {
    const m = (hash || '').replace(/^#/, '').match(/(?:^|&)s=([^&]+)/);
    if (!m) return null;
    const data = JSON.parse(fromBase64Url(m[1]));
    if (!data || !Array.isArray(data.c) || data.c.length < ORDER.length) return null;
    const nums = data.c.map(Number);
    if (nums.some((n) => !Number.isFinite(n))) return null;
    const cfg = {};
    ORDER.forEach((k, i) => {
      cfg[k] = k.startsWith('steps') ? Math.round(nums[i]) : nums[i];
    });
    return cfg;
  } catch {
    return null;
  }
}
