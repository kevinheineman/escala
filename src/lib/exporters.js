// Turn the working scale into copy-pasteable artefacts: CSS custom properties,
// a Tailwind fontSize config, W3C design tokens, and a machine-readable spec.
import { MEASURE } from './typography.js';

export function toCss(scale) {
  const sizes = scale.map((s) => `  --text-${s.name}: ${s.css};`);
  const leads = scale.map((s) => `  --leading-${s.name}: ${s.lineHeight};`);
  return [
    ':root {',
    '  /* font sizes — fluid clamp(), interpolated across the viewport */',
    ...sizes,
    '',
    '  /* line-height pairing */',
    ...leads,
    '',
    '  /* optimal line length for body copy */',
    `  --measure: ${MEASURE.ideal}ch;`,
    '}',
  ].join('\n');
}

export function toTailwind(scale) {
  const entries = scale.map(
    (s) => `        '${s.name}': ['${s.css}', { lineHeight: '${s.lineHeight}' }],`,
  );
  return [
    '/** tailwind.config.js */',
    'export default {',
    '  theme: {',
    '    extend: {',
    '      fontSize: {',
    ...entries,
    '      },',
    '    },',
    '  },',
    '};',
  ].join('\n');
}

export function toTokens(scale) {
  const size = {};
  const lineHeight = {};
  scale.forEach((s) => {
    size[s.name] = { $type: 'dimension', $value: s.css };
    lineHeight[s.name] = { $type: 'number', $value: s.lineHeight };
  });
  // W3C draft dimension values are strings here because the fluid value is a
  // clamp() expression; the JSON-spec export carries the resolved px endpoints.
  return JSON.stringify({ font: { size, lineHeight } }, null, 2);
}

export function toJsonSpec(scale, cfg) {
  return JSON.stringify(
    {
      generatedBy: 'Escala',
      config: cfg,
      measure: MEASURE,
      steps: scale.map((s) => ({
        name: s.name,
        step: s.step,
        minPx: s.minPx,
        maxPx: s.maxPx,
        clamp: s.css,
        lineHeight: s.lineHeight,
      })),
    },
    null,
    2,
  );
}

export const EXPORTERS = [
  { id: 'css', label: 'CSS variables', fn: (scale) => toCss(scale) },
  { id: 'tailwind', label: 'Tailwind', fn: (scale) => toTailwind(scale) },
  { id: 'tokens', label: 'Design tokens', fn: (scale) => toTokens(scale) },
  { id: 'json', label: 'JSON spec', fn: (scale, cfg) => toJsonSpec(scale, cfg) },
];
