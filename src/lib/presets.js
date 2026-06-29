// Ratios, defaults, sample scales, and specimen copy. No framework imports.

/** Named modular-scale ratios, smallest to largest. */
export const RATIOS = [
  { id: 'minor-second', name: 'Minor second', value: 1.067 },
  { id: 'major-second', name: 'Major second', value: 1.125 },
  { id: 'minor-third', name: 'Minor third', value: 1.2 },
  { id: 'major-third', name: 'Major third', value: 1.25 },
  { id: 'perfect-fourth', name: 'Perfect fourth', value: 1.333 },
  { id: 'augmented-fourth', name: 'Augmented fourth', value: 1.414 },
  { id: 'perfect-fifth', name: 'Perfect fifth', value: 1.5 },
  { id: 'golden-ratio', name: 'Golden ratio', value: 1.618 },
];

/**
 * The scale is fluid: it interpolates between a "min" context (a narrow
 * viewport with a smaller base + gentler ratio) and a "max" context (a wide
 * viewport with a larger base + more dramatic ratio). This is the Utopia model.
 */
export const DEFAULT_CFG = {
  minVw: 320,
  maxVw: 1280,
  baseMin: 16,
  baseMax: 18,
  ratioMin: 1.2,
  ratioMax: 1.25,
  stepsUp: 6,
  // One down-step keeps the default scale's smallest size above the ~12px
  // legibility floor, so the out-of-the-box scale passes every check. Adding
  // more down-steps (or loading a sample) is what surfaces the warnings.
  stepsDown: 1,
};

/** Inclusive [min, max] bounds used to sanitize user input. */
export const LIMITS = {
  minVw: [200, 1200],
  maxVw: [600, 2560],
  baseMin: [8, 48],
  baseMax: [8, 64],
  ratioMin: [1, 2],
  ratioMax: [1, 2],
  stepsUp: [1, 10],
  stepsDown: [0, 5],
};

/** One-click starting points. */
export const SAMPLES = [
  {
    id: 'ui',
    name: 'Compact UI',
    cfg: { minVw: 320, maxVw: 1280, baseMin: 14, baseMax: 16, ratioMin: 1.2, ratioMax: 1.2, stepsUp: 5, stepsDown: 1 },
  },
  {
    id: 'editorial',
    name: 'Editorial',
    cfg: { minVw: 360, maxVw: 1440, baseMin: 18, baseMax: 21, ratioMin: 1.2, ratioMax: 1.333, stepsUp: 6, stepsDown: 2 },
  },
  {
    id: 'marketing',
    name: 'Marketing hero',
    cfg: { minVw: 360, maxVw: 1440, baseMin: 16, baseMax: 20, ratioMin: 1.25, ratioMax: 1.5, stepsUp: 7, stepsDown: 2 },
  },
];

/** Sample text for the live specimen. */
export const SPECIMEN = {
  word: 'Ag',
  heading: 'The quick brown fox',
  sentence: 'Sphinx of black quartz, judge my vow.',
  body:
    'Good typography is mostly invisible. A well-tuned scale gives every level a clear job, so a reader moves from headline to body without friction — and it should hold up whether the page is 320 or 1440 pixels wide.',
};
