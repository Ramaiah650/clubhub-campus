import { useEffect, useState } from 'react';
import { FocusFrame } from '../components/shell';
import { BookCover, Modal, QrMark, Stars } from '../components/ui';
import { useLibrary } from '../context/LibraryContext';
import { books, getBook } from '../data/catalog';
import { compactCount } from '../lib/format';
import { Link } from '../lib/router';

const tabs = ['Description', 'Table of Contents', 'Reviews', 'Similar Books'];

export default function BookDetails({ id }) {
  const book = getBook(id);
  const { borrowBook, reserveBook, rememberBook, shelf } = useLibrary();
  const [tab, setTab] = useState('Description');
  const [shelfOpen, setShelfOpen] = useState(false);

  useEffect(() => {
    if (book) rememberBook(book.id);
  }, [book, rememberBook]);

  if (!book) {
    return (
      <FocusFrame>
        <section className="card">
          <h1>That book is not on the shelf</h1>
          <Link to="/search?q=">Back to search</Link>
        </section>
      </FocusFrame>
    );
  }

  const borrowed = shelf?.loans.current.some((loan) => loan.bookId === book.id);
  const reserved = shelf?.loans.reservations.some((item) => item.bookId === book.id);
  const similar = books.filter((item) => item.id !== book.id && item.subjects.some((subject) => book.subjects.includes(subject))).slice(0, 4);

  return (
    <FocusFrame>
      <article className="card detail">
        <div className="detail-top">
          <BookCover book={book} size="xl" />
          <div>
            <h1>{book.title}</h1>
            <p className="muted">{book.author}</p>
            <p className="rating-line">
              <Stars value={book.rating} />
              <span>
                {book.rating} ({compactCount(book.ratingCount)} ratings)
              </span>
            </p>
            {borrowed && <p className="avail avail-available">This title is already on your loans.</p>}
            <div className="detail-actions">
              <button type="button" className="btn btn-line" onClick={() => reserveBook(book.id)} disabled={reserved}>
                {reserved ? 'Reserved' : 'Reserve Book'}
              </button>
              <button type="button" className="btn btn-primary" onClick={() => borrowBook(book.id)} disabled={borrowed || book.availability === 'Checked Out'}>
                {borrowed ? 'Borrowed' : book.availability === 'Checked Out' ? 'Checked Out' : 'Borrow Book'}
              </button>
              <button type="button" className="btn btn-line" onClick={() => setShelfOpen(true)}>
                View Shelf Location
              </button>
            </div>
            <dl className="meta-grid">
              <div>
                <dt>Published</dt>
                <dd>{book.year}</dd>
              </div>
              <div>
                <dt>Publisher</dt>
                <dd>{book.publisher}</dd>
              </div>
              <div>
                <dt>ISBN</dt>
                <dd>{book.isbn}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{book.category}</dd>
              </div>
              <div>
                <dt>Available copies</dt>
                <dd>
                  {book.availability === 'Available' ? book.copies : 0} · {book.availability}
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{book.location}</dd>
              </div>
            </dl>
          </div>
          <div className="qr-card">
            <QrMark value={book.isbn || book.id} />
            <p>Scan to locate the book</p>
          </div>
        </div>
        <div className="tabs" role="tablist">
          {tabs.map((item) => (
            <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'is-on' : ''} onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </div>
        {tab === 'Description' && (
          <div className="detail-copy">
            <p>{book.description}</p>
            <h2>Key Features</h2>
            <ul>
              {book.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        {tab === 'Table of Contents' && (
          <ol className="contents">
            {book.contents.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        )}
        {tab === 'Reviews' && (
          <div className="reviews">
            {book.reviews.length === 0 && <p className="empty">No reader notes yet. They appear after a book comes home.</p>}
            {book.reviews.map((review) => (
              <article key={review.name}>
                <strong>{review.name}</strong>
                <Stars value={review.stars} />
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        )}
        {tab === 'Similar Books' && (
          <div className="similar">
            {similar.map((item) => (
              <Link key={item.id} to={`/book/${item.id}`} className="similar-card">
                <BookCover book={item} size="md" />
                <strong>{item.title}</strong>
                <span>{item.author}</span>
              </Link>
            ))}
          </div>
        )}
      </article>
      {shelfOpen && (
        <Modal title="Shelf location" onClose={() => setShelfOpen(false)}>
          <h2>Shelf location</h2>
          <p>{book.location}</p>
          <div className="floorplan" aria-hidden="true">
            <span>A</span>
            <span>B</span>
            <span className="is-here">C</span>
            <span>D</span>
          </div>
          <p className="muted">You are at the circulation desk. Follow the gold rail to the marked block.</p>
          <button type="button" className="btn btn-primary" onClick={() => setShelfOpen(false)}>
            Close
          </button>
        </Modal>
      )}
    </FocusFrame>
  );
}
