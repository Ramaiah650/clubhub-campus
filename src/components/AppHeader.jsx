import { Compass, Star, ClipboardList, User } from 'lucide-react';
import ThemePicker from './ThemePicker';

/** Compact top bar — nav + theme + counts */
function AppHeader({
  view,
  onViewChange,
  starredCount,
  applicationCount,
  themeId,
  onThemeChange,
}) {
  return (
    <header className="app-header">
      <button
        type="button"
        className="brand brand-btn"
        onClick={() => onViewChange('catalog')}
        aria-label="Campus Club home"
      >
        <span className="brand-mark" aria-hidden>
          <Compass size={20} strokeWidth={2.25} />
        </span>
        <div>
          <strong className="brand-name">Campus Club</strong>
          <span className="brand-sub">Campus club directory</span>
        </div>
      </button>

      <nav className="header-nav" aria-label="Primary">
        <button
          type="button"
          className={`nav-link${view === 'catalog' ? ' is-active' : ''}`}
          onClick={() => onViewChange('catalog')}
        >
          Clubs
        </button>
        <button
          type="button"
          className={`nav-link${view === 'applications' ? ' is-active' : ''}`}
          onClick={() => onViewChange('applications')}
        >
          <ClipboardList size={14} aria-hidden />
          Applications
          {applicationCount > 0 ? (
            <span className="nav-badge">{applicationCount}</span>
          ) : null}
        </button>
        <button
          type="button"
          className={`nav-link${view === 'profile' ? ' is-active' : ''}`}
          onClick={() => onViewChange('profile')}
        >
          <User size={14} aria-hidden />
          Profile
        </button>
      </nav>

      <div className="header-aside">
        <ThemePicker themeId={themeId} onThemeChange={onThemeChange} />
        <span className="starred-pill" title="Starred clubs">
          <Star size={14} />
          {starredCount} starred
        </span>
      </div>
    </header>
  );
}

export default AppHeader;
