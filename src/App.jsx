import { useCallback, useEffect, useMemo, useState } from 'react';
import Toolbar from './components/Toolbar.jsx';
import Controls from './components/Controls.jsx';
import Specimen from './components/Specimen.jsx';
import Checks from './components/Checks.jsx';
import ExportPanel from './components/ExportPanel.jsx';
import Icon from './components/Icon.jsx';
import { buildScale } from './lib/scale.js';
import { runChecks } from './lib/typography.js';
import { DEFAULT_CFG, LIMITS, SAMPLES } from './lib/presets.js';
import { encodeConfig, decodeConfig } from './lib/url.js';

const clampNum = (v, [lo, hi]) => Math.min(hi, Math.max(lo, v));

// Smallest finite value each field may hold while the user is mid-edit; below
// it (or empty / NaN) we fall back to the default so the preview never breaks.
const MIN_OK = {
  minVw: 1,
  maxVw: 1,
  baseMin: 1,
  baseMax: 1,
  ratioMin: 0.001,
  ratioMax: 0.001,
  stepsUp: 1,
  stepsDown: 0,
};

/** Replace empty/invalid fields with defaults — no clamping. For live preview. */
function coerce(cfg) {
  const c = { ...cfg };
  for (const k of Object.keys(LIMITS)) {
    const v = Number(c[k]);
    c[k] = Number.isFinite(v) && v >= MIN_OK[k] ? v : DEFAULT_CFG[k];
  }
  if (c.maxVw <= c.minVw) c.maxVw = c.minVw + 100;
  return c;
}

/** Clamp every field to its allowed range and round step counts. For commit. */
function sanitize(cfg) {
  const c = coerce(cfg);
  for (const k of Object.keys(LIMITS)) {
    c[k] = clampNum(c[k], LIMITS[k]);
    if (k.startsWith('steps')) c[k] = Math.round(c[k]);
  }
  if (c.maxVw <= c.minVw) c.maxVw = c.minVw + 100;
  return c;
}

function initialConfig() {
  if (typeof window !== 'undefined') {
    const fromUrl = decodeConfig(window.location.hash);
    if (fromUrl) return sanitize(fromUrl);
  }
  return { ...DEFAULT_CFG };
}

export default function App() {
  const [cfg, setCfg] = useState(initialConfig);
  const [theme, setTheme] = useState('light');
  const [shareLabel, setShareLabel] = useState('Share');
  const [simVw, setSimVw] = useState(() => {
    const c = coerce(cfg);
    return Math.round((c.minVw + c.maxVw) / 2);
  });

  const safe = useMemo(() => coerce(cfg), [cfg]);
  const scale = useMemo(() => buildScale(safe), [safe]);
  const checks = useMemo(() => runChecks(scale, safe), [scale, safe]);

  // Theme: hydrate from storage / system once, then reflect to <html>.
  useEffect(() => {
    const stored = localStorage.getItem('escala-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(stored || (prefersDark ? 'dark' : 'light'));
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('escala-theme', theme);
  }, [theme]);

  // Mirror the (sanitized) config into the URL hash so any scale is a link.
  useEffect(() => {
    window.history.replaceState(null, '', `#${encodeConfig(safe)}`);
  }, [safe]);

  // Keep the preview width within the configured viewport range.
  useEffect(() => {
    setSimVw((v) => clampNum(v, [safe.minVw, safe.maxVw]));
  }, [safe.minVw, safe.maxVw]);

  const patch = useCallback((p) => setCfg((c) => ({ ...c, ...p })), []);
  const commit = useCallback(() => setCfg((c) => sanitize(c)), []);
  const reset = useCallback(() => setCfg({ ...DEFAULT_CFG }), []);
  const loadSample = useCallback((i) => {
    const s = SAMPLES[i];
    if (s) setCfg(sanitize(s.cfg));
  }, []);

  const share = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareLabel('Link copied');
    } catch {
      setShareLabel('Copy failed');
    }
    setTimeout(() => setShareLabel('Share'), 1600);
  }, []);

  return (
    <>
      <a className="skip-link" href="#specimen">
        Skip to specimen
      </a>

      <header className="site-header">
        <div className="brand">
          <img className="brand__mark" src="/favicon.svg" alt="" width="36" height="36" />
          <div>
            <h1 className="brand__name">Escala</h1>
            <p className="brand__tag">Type that scales, verified.</p>
          </div>
        </div>
        <a
          className="btn btn--ghost"
          href="https://github.com/kevinheineman/escala"
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="github" /> <span className="hide-sm">View source</span>
        </a>
      </header>

      <main className="app">
        <Toolbar
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          samples={SAMPLES}
          onSample={loadSample}
          onReset={reset}
          onShare={share}
          shareLabel={shareLabel}
        />

        <div className="layout">
          <aside className="layout__aside">
            <Controls cfg={cfg} onPatch={patch} onCommit={commit} />
            <Checks checks={checks} />
          </aside>

          <section className="layout__main">
            <Specimen scale={scale} cfg={safe} simVw={simVw} onSimVw={setSimVw} />
            <ExportPanel scale={scale} cfg={safe} />
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <p>
          Built by{' '}
          <a href="https://www.kevinheineman.com/" target="_blank" rel="noreferrer">
            Kevin Heineman
          </a>
          . Fluid sizing follows the{' '}
          <a href="https://utopia.fyi/" target="_blank" rel="noreferrer">
            Utopia
          </a>{' '}
          rem-plus-vw clamp() method; checks reference{' '}
          <a
            href="https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html"
            target="_blank"
            rel="noreferrer"
          >
            WCAG 1.4.4
          </a>{' '}
          and{' '}
          <a
            href="https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html"
            target="_blank"
            rel="noreferrer"
          >
            1.4.12
          </a>
          .
        </p>
        <p className="site-footer__credit">
          A companion to{' '}
          <a href="https://get-contraste.vercel.app/" target="_blank" rel="noreferrer">
            Contraste
          </a>{' '}
          — accessible color, verified.
        </p>
      </footer>
    </>
  );
}
