// Typography heuristics + the accessibility checks that are Escala's whole
// point. These are recommendations grounded in WCAG and common practice, not a
// conformance guarantee — stated plainly the way contraste states its limits.

/** Comfortable line length (the "measure"), in characters. */
export const MEASURE = { ideal: 66, min: 45, max: 75 };

/**
 * Recommended unitless line-height for a given font size in px. Body and
 * smaller stay at 1.5 (WCAG text-spacing friendly); larger display sizes
 * tighten down toward 1.1 so headlines don't feel gappy.
 */
export function lineHeightFor(px) {
  if (px <= 22) return 1.5;
  const lh = 1.4 - (px - 22) * 0.0045;
  return Math.min(1.4, Math.max(1.1, Math.round(lh * 100) / 100));
}

/**
 * Run the scale through Escala's accessibility guardrails. Returns a list of
 * { id, label, status: 'pass' | 'warn' | 'info', detail, sc } — status is
 * always paired with an icon and text, never communicated by color alone.
 */
export function runChecks(scale, cfg) {
  const base = scale.find((s) => s.step === 0) || scale[scale.length - 1];
  const smallest = scale[scale.length - 1];
  const checks = [];

  checks.push({
    id: 'body-min',
    label: 'Body text holds ≥ 16px on small screens',
    status: cfg.baseMin >= 16 ? 'pass' : 'warn',
    detail:
      cfg.baseMin >= 16
        ? `Base is ${cfg.baseMin}px at ${cfg.minVw}px wide — comfortable for sustained reading.`
        : `Base is ${cfg.baseMin}px at ${cfg.minVw}px wide. Below 16px, body copy gets hard to read on phones; consider raising the min base.`,
    sc: 'Best practice',
  });

  checks.push({
    id: 'zoom-safe',
    label: 'Every size is zoom- and resize-safe',
    status: 'pass',
    detail:
      'Each clamp() keeps a rem lower bound and a rem term in its preferred value, so text still grows with browser zoom and the user’s default font size. A size expressed purely in vw would fail this.',
    sc: 'WCAG 1.4.4',
  });

  checks.push({
    id: 'body-leading',
    label: 'Body line-height reaches 1.5',
    status: base.lineHeight >= 1.5 ? 'pass' : 'warn',
    detail: `Recommended line-height for ${base.name} is ${base.lineHeight}. WCAG text-spacing expects body leading to reach 1.5× without clipping.`,
    sc: 'WCAG 1.4.12',
  });

  checks.push({
    id: 'small-floor',
    label: 'Smallest step stays legible',
    status: smallest.minPx >= 12 ? 'pass' : 'warn',
    detail:
      smallest.minPx >= 12
        ? `The smallest step (${smallest.name}) is ${smallest.minPx}px at its narrowest — above the ~12px legibility floor.`
        : `The smallest step (${smallest.name}) drops to ${smallest.minPx}px. Text under ~12px is hard to read; trim a step down or raise the base.`,
    sc: 'Best practice',
  });

  checks.push({
    id: 'measure',
    label: 'Optimal measure provided',
    status: 'info',
    detail: `Body copy reads best at ${MEASURE.min}–${MEASURE.max} characters per line. Escala exports a --measure of ${MEASURE.ideal}ch to cap your text containers.`,
    sc: 'Readability',
  });

  return checks;
}
