import { RATIOS } from '../lib/presets.js';

function NumberField({ id, label, suffix, value, min, max, step = 1, onChange, onCommit }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="num">
        <input
          id={id}
          className="num__input"
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onCommit}
        />
        {suffix && <span className="num__suffix">{suffix}</span>}
      </div>
    </div>
  );
}

function RatioField({ id, label, value, onChange }) {
  const known = RATIOS.some((r) => r.value === Number(value));
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="select" value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {!known && <option value={value}>Custom · {value}</option>}
        {RATIOS.map((r) => (
          <option key={r.id} value={r.value}>
            {r.name} · {r.value}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Controls({ cfg, onPatch, onCommit }) {
  const set = (k) => (v) => onPatch({ [k]: v === '' ? '' : Number(v) });
  const setRatio = (k) => (v) => onPatch({ [k]: v });

  return (
    <div className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Scale</h2>
      </div>

      <div className="controls">
        <p className="controls__legend">Narrow viewport</p>
        <div className="controls__grid">
          <NumberField id="minVw" label="Width" suffix="px" value={cfg.minVw} min={200} max={1200} onChange={set('minVw')} onCommit={onCommit} />
          <NumberField id="baseMin" label="Base" suffix="px" value={cfg.baseMin} min={8} max={48} step={0.5} onChange={set('baseMin')} onCommit={onCommit} />
        </div>
        <RatioField id="ratioMin" label="Ratio" value={cfg.ratioMin} onChange={setRatio('ratioMin')} />

        <p className="controls__legend">Wide viewport</p>
        <div className="controls__grid">
          <NumberField id="maxVw" label="Width" suffix="px" value={cfg.maxVw} min={600} max={2560} onChange={set('maxVw')} onCommit={onCommit} />
          <NumberField id="baseMax" label="Base" suffix="px" value={cfg.baseMax} min={8} max={64} step={0.5} onChange={set('baseMax')} onCommit={onCommit} />
        </div>
        <RatioField id="ratioMax" label="Ratio" value={cfg.ratioMax} onChange={setRatio('ratioMax')} />

        <p className="controls__legend">Steps</p>
        <div className="controls__grid">
          <NumberField id="stepsUp" label="Up" value={cfg.stepsUp} min={1} max={10} onChange={set('stepsUp')} onCommit={onCommit} />
          <NumberField id="stepsDown" label="Down" value={cfg.stepsDown} min={0} max={5} onChange={set('stepsDown')} onCommit={onCommit} />
        </div>
      </div>
    </div>
  );
}
