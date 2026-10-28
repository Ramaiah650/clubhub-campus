import { BookOpen, Bookmark, Clock, Download } from 'lucide-react';
import { useState } from 'react';
import { AppShell } from '../components/shell';
import { BookCover, Empty, Flourish } from '../components/ui';
import { useLibrary } from '../context/LibraryContext';
import { getBook } from '../data/catalog';
import { formatDate, slugStatus } from '../lib/format';

const tabs = [
  { id: 'current', label: 'Currently Borrowed', icon: BookOpen },
  { id: 'reservations', label: 'Reservation History', icon: Bookmark },
  { id: 'past', label: 'Past Borrowings', icon: Clock },
];

export default function Borrowings() {
  const { shelf, renewLoan, cancelReservation } = useLibrary();
  const [tab, setTab] = useState('current');
  const loans = shelf?.loans || { current: [], reservations: [], past: [] };
  const rows = loans[tab] || [];
  const overdue = loans.current.filter((loan) => loan.status === 'Overdue').length;

  function exportCsv() {
    const header = ['Title', 'Author', 'Date', 'Due or Returned', 'Status'];
    const lines = rows.map((row) => {
      const book = getBook(row.bookId);
      const second = row.due || row.returned || row.reserved || '';
      return [book?.title, book?.author, row.issued || row.reserved || '', second, row.status]
        .map((cell) => `"${String(cell || '').replaceAll('"', '""')}"`)
        .join(',');
    });
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quillora-${tab}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell>
      <section className="page-head">
        <h1>My Borrowings</h1>
        <Flourish />
        <p>Track your borrowed books, renew or return them.</p>
      </section>
      <section className="card">
        <div className="tab-row">
          <div className="tabs" role="tablist">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? 'is-on' : ''} onClick={() => setTab(item.id)}>
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
          </div>
          <button type="button" className="btn btn-line" onClick={exportCsv}>
            <Download size={16} /> Export
          </button>
        </div>
        {rows.length === 0 ? (
          <Empty>{tab === 'reservations' ? 'No reservations yet.' : tab === 'past' ? 'Nothing returned yet.' : 'Nothing on loan. Borrow from the dashboard or the search desk.'}</Empty>
        ) : (
          <div className="table-wrap">
            <table className="sheet">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>{tab === 'reservations' ? 'Reserved' : tab === 'past' ? 'Issued' : 'Issue Date'}</th>
                  <th>{tab === 'past' ? 'Returned' : tab === 'reservations' ? 'Hold' : 'Due Date'}</th>
                  <th>Status</th>
                  {tab !== 'past' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const book = getBook(row.bookId);
                  return (
                    <tr key={row.id}>
                      <td>
                        <div className="book-cell">
                          <BookCover book={book} size="sm" />
                          <div>
                            <strong>{book?.shortTitle || book?.title}</strong>
                            <span>{book?.author}</span>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(row.issued || row.reserved)}</td>
                      <td>{formatDate(row.due || row.returned) || '—'}</td>
                      <td>
                        <span className={`status status-${slugStatus(row.status)}`}>{row.status}</span>
                      </td>
                      {tab !== 'past' && (
                        <td>
                          {tab === 'current' ? (
                            <button type="button" className="btn btn-primary btn-small" onClick={() => renewLoan(row.id)}>
                              ↻ Renew
                            </button>
                          ) : (
                            <button type="button" className="btn btn-line btn-small" onClick={() => cancelReservation(row.id)}>
                              Cancel
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="summary">
          <h2>Loan Summary</h2>
          <Flourish />
          <div className="summary-grid">
            <article>
              <strong>{loans.current.length}</strong>
              <span>Currently Borrowed</span>
            </article>
            <article className="is-alert">
              <strong>{overdue}</strong>
              <span>Overdue</span>
            </article>
            <article>
              <strong>{loans.current.length + loans.past.length}</strong>
              <span>Total Borrowed</span>
            </article>
            <article>
              <strong>0</strong>
              <span>Fines Pending</span>
            </article>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
