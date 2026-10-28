import { useLibrary } from '../context/LibraryContext';
import { getBook } from '../data/catalog';
import { compactCount, dueLabel, formatDate } from '../lib/format';
import { Link } from '../lib/router';
import { BookCover, Flourish, Stars } from '../components/ui';
import { AppShell } from '../components/shell';

const recommended = ['clean-code', 'atomic-habits', 'deep-work', 'alchemist'];

export default function Dashboard() {
  const { profile, shelf, borrowBook } = useLibrary();
  const dues = shelf?.dues || [];

  return (
    <AppShell>
      <section className="welcome">
        <p className="welcome-kicker">Welcome Back,</p>
        <h1>{profile?.name || 'Reader'} !</h1>
        <Flourish />
        <p className="lede">“{profile?.bio || 'A reader today, a leader tomorrow.'}”</p>
      </section>
      <div className="dash-grid">
        <section className="card">
          <header className="card-head">
            <h2>Recommended Books</h2>
            <Link to="/search?q=Machine%20Learning">
              View All →
            </Link>
          </header>
          <div className="rec-grid">
            {recommended.map((id) => {
              const book = getBook(id);
              return (
                <article key={id} className="rec-card">
                  <Link to={`/book/${id}`} className="cover-link" aria-label={book.title}>
                    <BookCover book={book} size="lg" />
                  </Link>
                  <h3>{book.title}</h3>
                  <p className="muted">{book.author}</p>
                  <p className="rating-line">
                    <Stars value={book.rating} />
                    <span>
                      {book.rating} ({compactCount(book.ratingCount)})
                    </span>
                  </p>
                  <p className="blurb">{book.blurb}</p>
                  <button type="button" className="btn btn-primary btn-small" onClick={() => borrowBook(id)} data-testid={`borrow-${id}`}>
                    Borrow
                  </button>
                </article>
              );
            })}
          </div>
        </section>
        <section className="card">
          <header className="card-head">
            <h2>Your Dues</h2>
            <Link to="/borrowings">View All →</Link>
          </header>
          {dues.length === 0 ? (
            <p className="empty">No dues yet. Borrow a recommended book and it will land here.</p>
          ) : (
            <ul className="due-list">
              {dues.map((item) => {
                const book = getBook(item.bookId);
                return (
                  <li key={item.bookId}>
                    <BookCover book={book} size="sm" />
                    <div>
                      <strong>{book?.title}</strong>
                      <span>Due: {formatDate(item.due)}</span>
                    </div>
                    <em className={dueLabel(item.due).includes('overdue') ? 'due-pill is-late' : 'due-pill'}>{dueLabel(item.due)}</em>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
