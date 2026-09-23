import { Users, MapPin, Star, ArrowRight } from 'lucide-react';
import Chip from './Chip';

/**
 * Club list tile — Props, Lists (tags), Conditional rendering (starred)
 */
function OrgTile({ club, isStarred, isSelected, onSelect, onToggleStar }) {
  return (
    <article
      className={`org-tile${isSelected ? ' is-selected' : ''}`}
      style={{ '--tile-accent': club.accent }}
    >
      <div className="tile-accent" aria-hidden />
      <div className="tile-main">
        <div className="tile-top">
          <Chip label={club.interestLabel} tone="interest" />
          <button
            type="button"
            className={`star-btn${isStarred ? ' is-on' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(club.id);
            }}
            aria-label={isStarred ? 'Unstar club' : 'Star club'}
            title={isStarred ? 'Unstar' : 'Star'}
          >
            <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
          </button>
        </div>

        <h3 className="tile-name">{club.name}</h3>
        <p className="tile-blurb">{club.blurb}</p>

        <ul className="tile-tags">
          {club.tags.slice(0, 3).map((tag) => (
            <li key={tag}>
              <Chip label={tag} tone="tag" />
            </li>
          ))}
        </ul>

        <div className="tile-meta">
          <span>
            <Users size={13} /> {club.members}
          </span>
          <span>
            <MapPin size={13} /> {club.where.split('·')[0].trim()}
          </span>
        </div>

        <button type="button" className="tile-open" onClick={() => onSelect(club)}>
          Open details
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

export default OrgTile;
