/** Conditional empty state when filters return nothing */
function NoMatches({ query, interestLabel, onClear }) {
  return (
    <div className="no-matches" role="status">
      <div className="no-matches-glyph" aria-hidden>
        ⌕
      </div>
      <h3>No clubs match</h3>
      <p>
        {query
          ? `Nothing found for “${query}”`
          : `No clubs under ${interestLabel || 'this filter'} right now.`}
      </p>
      <button type="button" className="btn-coral" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}

export default NoMatches;
