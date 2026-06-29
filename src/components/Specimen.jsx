import { sizeAt } from '../lib/scale.js';
import { MEASURE } from '../lib/typography.js';
import { SPECIMEN } from '../lib/presets.js';

function sampleFor(step) {
  if (step > 0) return SPECIMEN.heading;
  if (step === 0) return SPECIMEN.body;
  return SPECIMEN.sentence;
}

export default function Specimen({ scale, cfg, simVw, onSimVw }) {
  return (
    <section className="panel" id="specimen" aria-label="Type scale preview">
      <div className="panel__head">
        <h2 className="panel__title">Specimen</h2>
        <span className="panel__count">{scale.length} steps</span>
      </div>

      <div className="vp">
        <label className="vp__label" htmlFor="vp">
          Preview width
        </label>
        <input
          id="vp"
          className="slider"
          type="range"
          min={cfg.minVw}
          max={cfg.maxVw}
          value={simVw}
          onChange={(e) => onSimVw(Number(e.target.value))}
        />
        <output className="vp__value mono" htmlFor="vp">
          {simVw}px
        </output>
      </div>

      <ul className="specimen">
        {scale.map((s) => {
          const px = sizeAt(s.minPx, s.maxPx, cfg.minVw, cfg.maxVw, simVw);
          // Cap the rendered size so a dramatic scale can't blow out the panel;
          // the meta line still reports the true computed px.
          const shown = Math.min(px, 112);
          const isBody = s.step <= 0;
          return (
            <li className="specimen__row" key={s.name}>
              <div className="specimen__meta">
                <span className="specimen__name mono">{s.name}</span>
                <span className="specimen__px mono">{px.toFixed(1)}px</span>
                <span className="specimen__lh mono">{s.lineHeight} lh</span>
                <code className="specimen__clamp mono">{s.css}</code>
              </div>
              <p
                className="specimen__sample"
                style={{
                  fontSize: `${shown}px`,
                  lineHeight: s.lineHeight,
                  maxWidth: isBody ? `${MEASURE.ideal}ch` : undefined,
                }}
              >
                {sampleFor(s.step)}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
