import Icon from './Icon.jsx';

const ICON = { pass: 'check', warn: 'alert', info: 'info' };
const WORD = { pass: 'Pass', warn: 'Check', info: 'Info' };

export default function Checks({ checks }) {
  return (
    <section className="panel" aria-label="Accessibility checks">
      <div className="panel__head">
        <h2 className="panel__title">Accessibility</h2>
      </div>
      <ul className="checks">
        {checks.map((c) => (
          <li className={`check check--${c.status}`} key={c.id}>
            <span className="check__icon" aria-hidden="true">
              <Icon name={ICON[c.status]} />
            </span>
            <div className="check__body">
              <div className="check__head">
                <span className="check__label">{c.label}</span>
                <span className="check__status">{WORD[c.status]}</span>
                <span className="check__sc mono">{c.sc}</span>
              </div>
              <p className="check__detail">{c.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
