import { BookOpen, Compass, History, Lightbulb, Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FocusFrame } from '../components/shell';
import { Brand, Empty, Flourish, Modal } from '../components/ui';
import { accessTypes, papers as allPapers, publicationTypes, subjectAreas, topics } from '../data/catalog';
import { compactCount } from '../lib/format';
import { Link } from '../lib/router';

const emptyFacets = {
  types: [],
  subjects: [],
  access: [],
  yearFrom: 2021,
  yearTo: 2024,
  topic: 'Machine Learning',
};

function toggle(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function Research() {
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState(emptyFacets);
  const [applied, setApplied] = useState(emptyFacets);
  const [sort, setSort] = useState('relevance');
  const [active, setActive] = useState(null);
  const [reading, setReading] = useState(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allPapers.filter((paper) => {
      if (paper.year < applied.yearFrom || paper.year > applied.yearTo) return false;
      if (applied.types.length && !applied.types.includes(paper.type)) return false;
      if (applied.subjects.length && !applied.subjects.includes(paper.subject) && !paper.tags.some((tag) => applied.subjects.includes(tag))) return false;
      if (applied.access.length && !applied.access.includes(paper.access)) return false;
      if (applied.topic && paper.topic !== applied.topic && !paper.tags.includes(applied.topic) && paper.subject !== applied.topic) return false;
      if (q && ![paper.title, paper.authors, paper.abstract, paper.venue, paper.tags.join(' ')].join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === 'year') list = [...list].sort((a, b) => b.year - a.year);
    if (sort === 'citations') list = [...list].sort((a, b) => b.citations - a.citations);
    return list;
  }, [applied, query, sort]);

  const headingCount =
    applied.topic === 'Machine Learning' &&
    !query &&
    applied.types.length === 0 &&
    applied.subjects.length === 0 &&
    applied.access.length === 0
      ? '1,240'
      : String(visible.length);

  function applyTopic(name) {
    const next = { ...emptyFacets, topic: name, yearFrom: draft.yearFrom, yearTo: draft.yearTo };
    setDraft(next);
    setApplied(next);
  }

  return (
    <FocusFrame center={<Brand light compact />}>
      <div className="research">
        <header className="page-head light">
          <h1>Research Explorer</h1>
          <Flourish />
          <p className="motto-inline">Discover. Learn. Explore. Grow.</p>
          <p>Explore research papers, academic resources, concepts and get AI-powered insights.</p>
        </header>
        <form
          className="research-search"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search research papers, topics, authors, journals or ask a question..."
            aria-label="Search research papers"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        <div className="quick-actions">
          <Link to="/assistant" className="quick">
            <Sparkles size={18} /> AI Research Assistant
          </Link>
          <a href="#featured-topics" className="quick">
            <Compass size={18} /> Topic Explorer
          </a>
          <button
            type="button"
            className="quick"
            onClick={() => {
              const next = { ...applied, types: ['Journal Articles'] };
              setApplied(next);
              setDraft(next);
            }}
          >
            <BookOpen size={18} /> Research Library
          </button>
          <Link to="/profile?tab=reading" className="quick">
            <History size={18} /> Reading History
          </Link>
          <button
            type="button"
            className="quick"
            onClick={() => applyTopic(topics[Math.floor(Math.random() * topics.length)].name)}
          >
            <Lightbulb size={18} /> Suggested Topics
          </button>
        </div>
        <div className="research-layout">
          <aside className="facet-card">
            <h2>Filters</h2>
            <fieldset>
              <legend>Publication Type</legend>
              {publicationTypes.map((item) => (
                <label key={item.id}>
                  <input
                    type="checkbox"
                    checked={draft.types.includes(item.id)}
                    onChange={() => setDraft((current) => ({ ...current, types: toggle(current.types, item.id) }))}
                  />
                  <span>{item.id}</span>
                  <em>{item.count}</em>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Subject Area</legend>
              {subjectAreas.map((item) => (
                <label key={item.id}>
                  <input
                    type="checkbox"
                    checked={draft.subjects.includes(item.id)}
                    onChange={() => setDraft((current) => ({ ...current, subjects: toggle(current.subjects, item.id) }))}
                  />
                  <span>{item.id}</span>
                  <em>{item.count}</em>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Publication Year</legend>
              <div className="year-row">
                <input
                  type="number"
                  min="1990"
                  max="2026"
                  value={draft.yearFrom}
                  aria-label="From year"
                  onChange={(event) => setDraft((current) => ({ ...current, yearFrom: Number(event.target.value) }))}
                />
                <span>to</span>
                <input
                  type="number"
                  min="1990"
                  max="2026"
                  value={draft.yearTo}
                  aria-label="To year"
                  onChange={(event) => setDraft((current) => ({ ...current, yearTo: Number(event.target.value) }))}
                />
              </div>
            </fieldset>
            <fieldset>
              <legend>Access Type</legend>
              {accessTypes.map((item) => (
                <label key={item.id}>
                  <input
                    type="checkbox"
                    checked={draft.access.includes(item.id)}
                    onChange={() => setDraft((current) => ({ ...current, access: toggle(current.access, item.id) }))}
                  />
                  <span>{item.id}</span>
                  <em>{item.count}</em>
                </label>
              ))}
            </fieldset>
            <div className="facet-actions">
              <button type="button" className="btn btn-primary" onClick={() => setApplied(draft)}>
                Apply Filters
              </button>
              <button
                type="button"
                className="btn btn-line"
                onClick={() => {
                  setDraft(emptyFacets);
                  setApplied(emptyFacets);
                  setQuery('');
                }}
              >
                Reset
              </button>
            </div>
          </aside>
          <div className="research-main">
            <section id="featured-topics">
              <header className="card-head">
                <h2>Featured Topics</h2>
                <button type="button" className="text-link" onClick={() => applyTopic('')}>
                  View All →
                </button>
              </header>
              <div className="topic-row">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className={`topic tint-${topic.tint} ${applied.topic === topic.name ? 'is-on' : ''}`}
                    onClick={() => applyTopic(topic.name)}
                  >
                    <span />
                    <strong>{topic.name}</strong>
                  </button>
                ))}
              </div>
            </section>
            <section className="card paper-card">
              <header className="card-head">
                <h2>
                  Showing {headingCount} research papers{applied.topic ? ` for “${applied.topic}”` : ''}
                </h2>
                <label className="sort">
                  Sort by
                  <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort papers">
                    <option value="relevance">Relevance</option>
                    <option value="year">Year</option>
                    <option value="citations">Citations</option>
                  </select>
                </label>
              </header>
              {visible.length === 0 ? (
                <Empty>No sample papers in this slice. Reset a filter or widen the years.</Empty>
              ) : (
                <div className="paper-list">
                  {visible.map((paper) => (
                    <article key={paper.id} className="paper">
                      <div className={`paper-badge badge-${paper.badge.toLowerCase()}`}>{paper.badge}</div>
                      <div>
                        <h3>{paper.title}</h3>
                        <p className="muted">
                          {paper.authors} · {paper.year} · {paper.venue}
                        </p>
                        <p>{paper.abstract}</p>
                        <div className="tags">
                          {paper.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="paper-side">
                        <button type="button" className="btn btn-line btn-small" onClick={() => setActive(paper)}>
                          View Details
                        </button>
                        <button type="button" className="btn btn-primary btn-small" onClick={() => setReading(paper)}>
                          Read Paper
                        </button>
                        <span>Citations: {compactCount(paper.citations)}</span>
                        <span className="pdf">PDF</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      {active && (
        <Modal title={active.title} onClose={() => setActive(null)} wide>
          <h2>{active.title}</h2>
          <p className="muted">
            {active.authors} · {active.year} · {active.venue}
          </p>
          <dl className="meta-grid">
            <div>
              <dt>Type</dt>
              <dd>{active.type}</dd>
            </div>
            <div>
              <dt>Subject</dt>
              <dd>{active.subject}</dd>
            </div>
            <div>
              <dt>Access</dt>
              <dd>{active.access}</dd>
            </div>
            <div>
              <dt>Citations</dt>
              <dd>{compactCount(active.citations)}</dd>
            </div>
          </dl>
          <p>{active.abstract}</p>
          <div className="modal-actions">
            <button type="button" className="btn btn-line" onClick={() => setActive(null)}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setReading(active);
                setActive(null);
              }}
            >
              Read Paper
            </button>
          </div>
        </Modal>
      )}
      {reading && (
        <Modal title={reading.title} onClose={() => setReading(null)} wide>
          <article className="reader">
            <p className="paper-badge">{reading.badge}</p>
            <h2>{reading.title}</h2>
            <p className="muted">
              {reading.authors} · {reading.venue} · {reading.year}
            </p>
            <h3>Abstract</h3>
            <p>{reading.abstract}</p>
            <h3>Introduction</h3>
            <p>
              {reading.title} looks at {reading.subject.toLowerCase()} from the university library’s point of view: what a student can apply, what a librarian should catalog, and which claims still need a second dataset.
            </p>
            <h3>Discussion</h3>
            <p>
              The authors argue the useful result is not a leaderboard number. It is a method a reader can repeat with the collection already on the shelf. Access for this copy is {reading.access.toLowerCase()}.
            </p>
            <h3>How to cite</h3>
            <p>
              {reading.authors} ({reading.year}). {reading.title}. {reading.venue}.
            </p>
          </article>
          <div className="modal-actions">
            <button type="button" className="btn btn-primary" onClick={() => setReading(null)}>
              Close reader
            </button>
          </div>
        </Modal>
      )}
    </FocusFrame>
  );
}
