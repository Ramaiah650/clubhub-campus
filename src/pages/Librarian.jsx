import { AppShell } from '../components/shell';
import { Flourish } from '../components/ui';
import { useLibrary } from '../context/LibraryContext';
import { getBook } from '../data/catalog';
import { formatDate } from '../lib/format';

export default function Librarian() {
  const { pending, approveAccount, patronLoans, session, profile } = useLibrary();
  const overdue = patronLoans.filter((loan) => loan.status === 'Overdue');
  const holds = patronLoans.length;

  return (
    <AppShell>
      <header className="page-head">
        <div>
          <h1>Circulation Desk</h1>
          <Flourish />
          <p>
            Signed in as {profile?.fullName || session?.email}. Approve new readers and watch the loans that need a hand.
          </p>
        </div>
      </header>
      <div className="stat-row">
        <article>
          <strong>{pending.length}</strong>
          <span>Pending approvals</span>
        </article>
        <article>
          <strong>{patronLoans.length}</strong>
          <span>Active loans</span>
        </article>
        <article>
          <strong>{overdue.length}</strong>
          <span>Overdue</span>
        </article>
        <article>
          <strong>{holds}</strong>
          <span>Copies out</span>
        </article>
      </div>
      <div className="split-2">
        <section className="card">
          <h2>Awaiting verification</h2>
          {pending.length === 0 ? (
            <p className="empty">No accounts are waiting. New signups land here.</p>
          ) : (
            <ul className="plain-list">
              {pending.map((account) => (
                <li key={account.email}>
                  <div>
                    <strong>{account.name}</strong>
                    <span>
                      {account.universityId} · {account.department}
                    </span>
                    <span>{account.email}</span>
                  </div>
                  <button type="button" className="btn btn-primary btn-small" onClick={() => approveAccount(account.email)}>
                    Approve
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card">
          <h2>Overdue loans</h2>
          {overdue.length === 0 ? (
            <p className="empty">Nothing is overdue.</p>
          ) : (
            <div className="table-wrap">
              <table className="sheet">
                <thead>
                  <tr>
                    <th>Patron</th>
                    <th>Book</th>
                    <th>Due</th>
                  </tr>
                </thead>
                <tbody>
                  {overdue.map((loan) => (
                    <tr key={loan.id}>
                      <td>{loan.patron}</td>
                      <td>{getBook(loan.bookId)?.title}</td>
                      <td>{formatDate(loan.due)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
