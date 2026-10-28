import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FocusFrame } from '../components/shell';
import { BookCover, Empty, Stars } from '../components/ui';
import { useLibrary } from '../context/LibraryContext';
import { books } from '../data/catalog';
import { compactCount } from '../lib/format';
import { Link, useQuery, useRouter } from '../lib/router';

const resourceTypes = ['Book', 'E-book', 'Research Paper'];

export default function SearchPage() {
  const query = useQuery();
  const { replace } = useRouter();
  const { reserveBook, shelf } = useLibrary();
  const text = query.get('q') || '';
  const [categories, setCategories] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [types, setTypes] = useState([]);
  const [author, setAuthor] = useState('All');
  const [year, setYear] = useState('All');
  const [more, setMore] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(0);

  const categoryOptions = useMemo(() => {
    const counts = new Map();
    books.forEach((book) => {
      book.subjects.forEach((subject) => counts.set(subject, (counts.get(subject) || 0) + 1));
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const authors = useMemo(() => ['All', ...Array.from(new Set(books.map((book) => book.author))).sort()], []);
  const years = useMemo(
    () => ['All', ...Array.from(new Set(books.map((book) => String(book.year)))).sort((a, b) => b - a)],
    [],
  );

  const results = useMemo(() => {
    const q = text.trim().toLowerCase();
    return books.filter((book) => {
      const haystack = [book.title, book.author, book.description, book.blurb, book.category, book.subjects.join(' '), book.year]
        .join(' ')
        .toLowerCase();
      if (q && !haystack.includes(q)) return false;
      if (categories.length && !book.subjects.some((subject) => categories.includes(subject)) && !categories.includes(book.category)) return false;
      if (availability.length && !availability.includes(book.availability)) return false;
      if (author !== 'All' && book.author !== author) return false;
      if (year !== 'All' && String(book.year) !== year) return false;
      if (book.rating < minRating) return false;
      if (types.length) {
        const wantsPaper = types.includes('Research Paper');
        const wantsBook = types.includes('Book');
        const wantsEbook = types.includes('E-book');
        if (wantsPaper && !wantsBook && !wantsEbook) return false;
        if (wantsBook && book.formats.includes('Book')) return true;
        if (wantsEbook && book.formats.includes('E-book')) return true;
        if (!wantsBook && !wantsEbook) return true;
        return false;
      }
      return true;
    });
  }, [text, categories, availability, types, author, year, minRating]);

  const pageSize = 5;
  const pages = Math.max(1, Math.ceil(results.length / pageSize));
  const safePage = Math.min(page, pages - 1);
  const slice = results.slice(safePage * pageSize, safePage * pageSize + pageSize);

  function commit(next) {
    setPage(0);
    replace(`/search?q=${encodeURIComponent(next)}`);
  }

  function toggle(list, setList, value) {
    setPage(0);
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  return (
    <FocusFrame
      center={
        <form
          className="search-pill focus-search"
          onSubmit={(event) => {
            event.preventDefault();
            commit(text);
          }}
        >
          <SearchIcon size={18} />
          <input
            value={text}
            onChange={(event) => commit(event.target.value)}
            aria-label="Search books"
            placeholder="Search for books, authors, subjects..."
            autoFocus
          />
        </form>
      }
    >
      <div className="search-layout">
        <aside className="facet-card">
          <h2>Categories</h2>
          <fieldset>
            {categoryOptions.map(([name, count]) => (
              <label key={name}>
                <input type="checkbox" checked={categories.includes(name)} onChange={() => toggle(categories, setCategories, name)} />
                <span>{name}</span>
                <em>{count}</em>
              </label>
            ))}
          </fieldset>
          <h2>Availability</h2>
          <fieldset>
            {['Available', 'Checked Out', 'Reserved'].map((name) => (
              <label key={name}>
                <input type="checkbox" checked={availability.includes(name)} onChange={() => toggle(availability, setAvailability, name)} />
                <span>{name}</span>
                <em>{books.filter((book) => book.availability === name).length}</em>
              </label>
            ))}
          </fieldset>
          <h2>Resource Type</h2>
          <fieldset>
            {resourceTypes.map((name) => (
              <label key={name}>
                <input type="checkbox" checked={types.includes(name)} onChange={() => toggle(types, setTypes, name)} />
                <span>{name}</span>
              </label>
            ))}
          </fieldset>
        </aside>
        <section className="card results-card">
          <div className="filter-bar">
            <label>
              Category
              <select
                value={categories[0] || 'All'}
                onChange={(event) => {
                  setPage(0);
                  setCategories(event.target.value === 'All' ? [] : [event.target.value]);
                }}
              >
                <option>All</option>
                {categoryOptions.map(([name]) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <label>
              Author
              <select
                value={author}
                onChange={(event) => {
                  setPage(0);
                  setAuthor(event.target.value);
                }}
              >
                {authors.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <label>
              Availability
              <select
                value={availability[0] || 'All'}
                onChange={(event) => {
                  setPage(0);
                  setAvailability(event.target.value === 'All' ? [] : [event.target.value]);
                }}
              >
                <option>All</option>
                <option>Available</option>
                <option>Checked Out</option>
                <option>Reserved</option>
              </select>
            </label>
            <label>
              Year
              <select
                value={year}
                onChange={(event) => {
                  setPage(0);
                  setYear(event.target.value);
                }}
              >
                {years.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <button type="button" className="btn btn-line btn-small" onClick={() => setMore((value) => !value)}>
              <SlidersHorizontal size={14} /> More Filters
            </button>
          </div>
          {more && (
            <label className="more-filter">
              Minimum rating
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(event) => {
                  setPage(0);
                  setMinRating(Number(event.target.value));
                }}
              />
              <span>{minRating.toFixed(1)}</span>
            </label>
          )}
          <h2 className="results-title">
            Showing {results.length} result{results.length === 1 ? '' : 's'}
            {text.trim() ? ` for “${text.trim()}”` : ''}
          </h2>
          {slice.length === 0 ? (
            <Empty>No books match those filters. Clear a category or try another subject.</Empty>
          ) : (
            <div className="result-list">
              {slice.map((book) => {
                const reserved = shelf?.loans.reservations.some((item) => item.bookId === book.id);
                return (
                  <article key={book.id} className="result">
                    <BookCover book={book} size="sm" />
                    <div>
                      <h3>
                        <Link to={`/book/${book.id}`}>{book.title}</Link>
                      </h3>
                      <p className="muted">
                        {book.author} · {book.year}
                      </p>
                      <p className="rating-line">
                        <Stars value={book.rating} />
                        <span>
                          {book.rating} ({compactCount(book.ratingCount)})
                        </span>
                      </p>
                      <p className={`avail avail-${book.availability.toLowerCase().replace(/\s+/g, '-')}`}>{book.availability}</p>
                    </div>
                    <div className="result-actions">
                      <button type="button" className="btn btn-primary btn-small" onClick={() => reserveBook(book.id)} disabled={reserved}>
                        {reserved ? 'Reserved' : 'Reserve'}
                      </button>
                      <Link to={`/book/${book.id}`} className="btn btn-line btn-small">
                        View Details
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          <div className="pager" role="navigation" aria-label="Results pages">
            {Array.from({ length: pages }, (_, index) => (
              <button key={index} type="button" className={index === safePage ? 'is-on' : ''} onClick={() => setPage(index)} aria-label={`Page ${index + 1}`}>
                {index + 1}
              </button>
            ))}
          </div>
        </section>
      </div>
    </FocusFrame>
  );
}
