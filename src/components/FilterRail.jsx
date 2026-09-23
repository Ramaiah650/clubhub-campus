import { Search, X } from 'lucide-react';
import Chip from './Chip';

/**
 * Left rail: search + interest filters
 * Concepts: Props, Lists & Keys, Search/Filter UI
 */
function FilterRail({
  interests,
  activeInterest,
  onInterestChange,
  query,
  onQueryChange,
  counts,
}) {
  return (
    <aside className="filter-rail" aria-label="Filters">
      <h2 className="rail-title">Find a club</h2>
      <p className="rail-hint">Filter by interest or search by name.</p>

      <label className="search-field">
        <Search size={16} aria-hidden />
        <input
          type="search"
          placeholder="Search clubs, tags…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search clubs"
        />
        {query ? (
          <button
            type="button"
            className="search-clear"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : null}
      </label>

      <div className="rail-section">
        <h3 className="rail-label">Interest</h3>
        <ul className="interest-list">
          {interests.map((item) => (
            <li key={item.id}>
              <Chip
                label={`${item.emoji} ${item.label} (${counts[item.id] ?? 0})`}
                tone="interest"
                active={activeInterest === item.id}
                onClick={() => onInterestChange(item.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default FilterRail;
