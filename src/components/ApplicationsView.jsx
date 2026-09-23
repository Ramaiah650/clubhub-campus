import { ClipboardList, Trash2, Calendar } from 'lucide-react';
import Chip from './Chip';

/**
 * My applications — Lists, Conditional empty state, Props
 */
function ApplicationsView({ applications, onWithdraw, onOpenClub }) {
  if (!applications.length) {
    return (
      <div className="panel-view">
        <div className="catalog-head">
          <div>
            <h1>My applications</h1>
            <p className="catalog-sub">Clubs you have joined or applied to appear here.</p>
          </div>
        </div>
        <div className="no-matches" role="status">
          <div className="no-matches-glyph" aria-hidden>
            <ClipboardList size={36} />
          </div>
          <h3>No applications yet</h3>
          <p>Open a club and tap <strong>Join now</strong> to apply.</p>
        </div>
      </div>
    );
  }

  const sorted = [...applications].sort(
    (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
  );

  return (
    <div className="panel-view">
      <div className="catalog-head">
        <div>
          <h1>My applications</h1>
          <p className="catalog-sub">
            Tracking <strong>{applications.length}</strong>{' '}
            {applications.length === 1 ? 'application' : 'applications'}
          </p>
        </div>
      </div>

      <ul className="app-list">
        {sorted.map((app) => {
          const dateLabel = new Date(app.appliedAt).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          });
          return (
            <li key={app.id} className="app-card">
              <div className="app-card-main">
                <button
                  type="button"
                  className="app-card-name"
                  onClick={() => onOpenClub?.(app.clubId)}
                >
                  {app.clubName}
                </button>
                <div className="app-card-meta">
                  <Chip label={app.interestLabel || app.interest || 'Club'} tone="interest" />
                  <Chip label={app.status} tone="neutral" />
                  <span className="app-date">
                    <Calendar size={13} aria-hidden /> {dateLabel}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn-ghost danger"
                onClick={() => onWithdraw(app.id)}
                aria-label={`Withdraw application to ${app.clubName}`}
              >
                <Trash2 size={15} />
                Withdraw
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ApplicationsView;
