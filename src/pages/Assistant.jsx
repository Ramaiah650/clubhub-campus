import { BookOpen, CalendarRange, FileText, Scale, Search, Send } from 'lucide-react';
import { useState } from 'react';
import { FocusFrame } from '../components/shell';
import { BookCover, Stars } from '../components/ui';
import { useLibrary } from '../context/LibraryContext';
import { getBook, getPaper } from '../data/catalog';
import { suggestedQuestions } from '../lib/assistant';
import { compactCount } from '../lib/format';
import { Link } from '../lib/router';

const icons = {
  book: BookOpen,
  search: Search,
  scale: Scale,
  plan: CalendarRange,
  file: FileText,
};

export default function Assistant() {
  const { shelf, sendChat } = useLibrary();
  const [draft, setDraft] = useState('');
  const messages = shelf?.chat || [];

  function submit(text) {
    const value = (text ?? draft).trim();
    if (!value) return;
    sendChat(value);
    setDraft('');
  }

  return (
    <FocusFrame fab={false}>
      <section className="card assistant">
        <header className="assistant-head">
          <div className="assistant-mark" aria-hidden="true">
            <BookOpen size={22} />
          </div>
          <div>
            <h1>AI Library Assistant</h1>
            <p>Ask questions, find books, get summaries and more.</p>
          </div>
        </header>
        <div className="assistant-grid">
          <div className="thread">
            {messages.map((message) => (
              <article key={message.id} className={`bubble bubble-${message.role}`}>
                <p>{message.text}</p>
                {message.books?.length > 0 && (
                  <div className="ai-books">
                    {message.books.map((id, index) => {
                      const book = getBook(id);
                      if (!book) return null;
                      return (
                        <div key={id} className="ai-book">
                          <BookCover book={book} size="sm" />
                          <div>
                            <strong>
                              {message.numbered ? `${index + 1}. ` : ''}
                              {book.title}
                            </strong>
                            <span>{book.author}</span>
                            <span className="blurb">{book.blurb}</span>
                            <span className="rating-line">
                              <Stars value={book.rating} /> {book.rating} ({compactCount(book.ratingCount)})
                            </span>
                          </div>
                          <Link to={`/book/${book.id}`} className="btn btn-line btn-small">
                            View Details
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
                {message.papers?.length > 0 && (
                  <ul className="ai-papers">
                    {message.papers.map((id) => {
                      const paper = getPaper(id);
                      if (!paper) return null;
                      return (
                        <li key={id}>
                          <Link to="/research">{paper.title}</Link>
                          <span>
                            {paper.authors} · {paper.year}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </article>
            ))}
          </div>
          <aside className="suggest">
            <h2>Suggested Questions</h2>
            {suggestedQuestions.map((item) => {
              const Icon = icons[item.icon] || BookOpen;
              return (
                <button key={item.id} type="button" onClick={() => submit(item.label)}>
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </aside>
        </div>
        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask anything about books, topics, or your studies..."
            aria-label="Message the library assistant"
            data-testid="assistant-input"
          />
          <button type="submit" className="btn btn-primary" aria-label="Send">
            <Send size={16} />
          </button>
        </form>
      </section>
    </FocusFrame>
  );
}
