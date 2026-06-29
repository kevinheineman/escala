import Icon from './Icon.jsx';

export default function Toolbar({ theme, onToggleTheme, samples, onSample, onReset, onShare, shareLabel }) {
  return (
    <div className="toolbar">
      <div className="toolbar__group">
        <div className="field">
          <label className="field__label" htmlFor="sample">
            Start from
          </label>
          <select
            id="sample"
            className="select"
            value=""
            onChange={(e) => {
              if (e.target.value !== '') onSample(Number(e.target.value));
            }}
          >
            <option value="">Sample scales…</option>
            {samples.map((s, i) => (
              <option key={s.id} value={i}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          <Icon name="refresh" /> <span className="hide-sm">Reset</span>
        </button>
      </div>

      <div className="toolbar__group">
        <button type="button" className="btn btn--primary" onClick={onShare}>
          <Icon name="link" /> {shareLabel}
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
      </div>
    </div>
  );
}
