import { X, Clock, MapPin, Users, Star, UserPlus, Check } from 'lucide-react';
import Chip from './Chip';

/**
 * Split-panel detail view — Props, Lists, Conditional rendering, Join CTA
 */
function DetailPane({ club, isStarred, hasApplied, onClose, onToggleStar, onJoin }) {
  if (!club) return null;

  return (
    <aside className="detail-pane" aria-label={`${club.name} details`}>
      <div className="detail-toolbar">
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close details">
          <X size={18} />
        </button>
        <button
          type="button"
          className={`star-btn${isStarred ? ' is-on' : ''}`}
          onClick={() => onToggleStar(club.id)}
        >
          <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
          {isStarred ? 'Starred' : 'Star'}
        </button>
      </div>

      <div className="detail-hero" style={{ borderColor: club.accent }}>
        <Chip label={club.interestLabel} tone="interest" />
        <h2>{club.name}</h2>
        <p className="detail-blurb">{club.blurb}</p>
      </div>

      <div className="join-cta">
        {hasApplied ? (
          <p className="join-applied" role="status">
            <Check size={16} aria-hidden />
            Application submitted — see My applications
          </p>
        ) : (
          <button type="button" className="btn-coral btn-join" onClick={() => onJoin(club)}>
            <UserPlus size={18} aria-hidden />
            Join now
          </button>
        )}
      </div>

      <p className="detail-about">{club.about}</p>

      <dl className="detail-facts">
        <div>
          <dt>
            <Clock size={14} /> When
          </dt>
          <dd>{club.when}</dd>
        </div>
        <div>
          <dt>
            <MapPin size={14} /> Where
          </dt>
          <dd>{club.where}</dd>
        </div>
        <div>
          <dt>
            <Users size={14} /> Members
          </dt>
          <dd>{club.members}</dd>
        </div>
      </dl>

      <section className="detail-block">
        <h3>Tags</h3>
        <ul className="tile-tags">
          {club.tags.map((tag) => (
            <li key={tag}>
              <Chip label={tag} tone="tag" />
            </li>
          ))}
        </ul>
      </section>

      <section className="detail-block">
        <h3>Leads</h3>
        <ul className="lead-list">
          {club.leads.map((person) => (
            <li key={person.name}>
              <span className="lead-avatar" style={{ background: club.accent }}>
                {person.name.charAt(0)}
              </span>
              <div>
                <strong>{person.name}</strong>
                <span>{person.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {club.nextUp?.length > 0 && (
        <section className="detail-block">
          <h3>Coming up</h3>
          <ul className="event-list">
            {club.nextUp.map((ev) => (
              <li key={ev.title}>
                <strong>{ev.title}</strong>
                <span>{ev.when}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="detail-note">{club.note}</p>
    </aside>
  );
}

export default DetailPane;
