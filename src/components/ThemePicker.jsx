import { Palette } from 'lucide-react';
import { THEMES } from '../data/themes';

/** Theme selector — Props + Lists */
function ThemePicker({ themeId, onThemeChange }) {
  return (
    <div className="theme-picker" role="group" aria-label="Theme">
      <span className="theme-picker-label">
        <Palette size={14} aria-hidden /> Theme
      </span>
      <div className="theme-swatches">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`theme-swatch${themeId === t.id ? ' is-active' : ''}`}
            style={{ '--swatch': t.swatch }}
            onClick={() => onThemeChange(t.id)}
            title={t.label}
            aria-label={`${t.label}${t.kind === 'dark' ? ' (dark)' : ''}`}
            aria-pressed={themeId === t.id}
          >
            <span className="theme-swatch-dot" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemePicker;
