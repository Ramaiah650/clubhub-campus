import { useState } from 'react';
import { AppShell } from '../components/shell';
import { BookCover, Flourish, Modal, Portrait } from '../components/ui';
import { useLibrary } from '../context/LibraryContext';
import { departments, getBook, years } from '../data/catalog';
import { achievementCatalog } from '../data/seed';
import { formatDate } from '../lib/format';
import { useQuery } from '../lib/router';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'borrowing', label: 'Borrowing History' },
  { id: 'reading', label: 'Reading History' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'settings', label: 'Settings' },
];

export default function Profile() {
  const query = useQuery();
  const initial = tabs.some((tab) => tab.id === query.get('tab')) ? query.get('tab') : 'overview';
  const [tab, setTab] = useState(initial);
  const [editing, setEditing] = useState(false);
  const { profile, shelf } = useLibrary();
  const goal = profile?.readingGoal || 1;
  const read = shelf?.booksRead || 0;
  const percent = Math.min(100, Math.round((read / goal) * 100));
  const months = shelf?.monthly || [];

  if (!profile || !shelf) return null;

  return (
    <AppShell>
      <header className="page-head">
        <div>
          <h1>My Profile</h1>
          <Flourish />
          <p>Manage your account, track your reading journey and explore your achievements.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
          Edit Profile
        </button>
      </header>
      <section className="card profile-card">
        <div className="identity">
          <Portrait src={profile.photo} name={profile.fullName} size={96} />
          <div>
            <h2>{profile.fullName}</h2>
            <p className="muted">
              {profile.role} · {profile.year} · {profile.department}
            </p>
            <p className="contact-line">
              <span>{profile.email}</span>
              <span>{profile.universityId}</span>
              <span>{profile.phone}</span>
              <span>{profile.location}</span>
            </p>
          </div>
          <blockquote>“{profile.bio}”</blockquote>
        </div>
        <div className="stat-row">
          <article>
            <strong>{shelf.booksBorrowed}</strong>
            <span>Books borrowed</span>
          </article>
          <article>
            <strong>{shelf.booksRead}</strong>
            <span>Books read</span>
          </article>
          <article>
            <strong>{shelf.credits}</strong>
            <span>Credits earned</span>
          </article>
          <article>
            <strong>{shelf.challengesCompleted}</strong>
            <span>Challenges completed</span>
          </article>
        </div>
        <div className="tabs" role="tablist">
          {tabs.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? 'is-on' : ''} onClick={() => setTab(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        {tab === 'overview' && (
          <div className="overview">
            <section>
              <h3>About Me</h3>
              <dl className="meta-grid">
                <div>
                  <dt>Name</dt>
                  <dd>{profile.fullName}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{profile.role}</dd>
                </div>
                <div>
                  <dt>Year</dt>
                  <dd>{profile.year}</dd>
                </div>
                <div>
                  <dt>Department</dt>
                  <dd>{profile.department}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{profile.email}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{profile.phone || '—'}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{profile.location}</dd>
                </div>
                <div>
                  <dt>Joined</dt>
                  <dd>{profile.joined}</dd>
                </div>
              </dl>
              <h3>Interests</h3>
              <div className="tags">
                {profile.interests.map((interest) => (
                  <span key={interest}>{interest}</span>
                ))}
              </div>
            </section>
            <section>
              <h3>Reading Progress</h3>
              <div className="progress-row">
                <div className="ring" style={{ '--p': percent }}>
                  <div>
                    <strong>{percent}%</strong>
                    <span>of the goal</span>
                  </div>
                </div>
                <div className="bars" aria-label="Books finished by month">
                  {months.map((value, index) => (
                    <div key={index}>
                      <span style={{ height: `${Math.max(4, value * 12)}px` }} />
                      <em>{'JFMAMJJASOND'[index]}</em>
                    </div>
                  ))}
                </div>
              </div>
              <h3>Recently Read</h3>
              <div className="recent-row">
                {shelf.recentlyRead.length === 0 && <p className="empty">Your finished books will gather here.</p>}
                {shelf.recentlyRead.map((item) => {
                  const book = getBook(item.bookId);
                  return (
                    <div key={item.bookId}>
                      <BookCover book={book} size="sm" />
                      <span>{book?.title}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
        {tab === 'borrowing' && <LoanTables shelf={shelf} />}
        {tab === 'reading' && (
          <ul className="plain-list">
            {shelf.recentlyRead.map((item) => {
              const book = getBook(item.bookId);
              return (
                <li key={item.bookId}>
                  <BookCover book={book} size="sm" />
                  <div>
                    <strong>{book?.title}</strong>
                    <span>{book?.author}</span>
                  </div>
                </li>
              );
            })}
            {shelf.loans.past.map((loan) => {
              const book = getBook(loan.bookId);
              return (
                <li key={loan.id}>
                  <BookCover book={book} size="sm" />
                  <div>
                    <strong>{book?.title}</strong>
                    <span>Returned {formatDate(loan.returned)}</span>
                  </div>
                </li>
              );
            })}
            {shelf.recentlyRead.length === 0 && shelf.loans.past.length === 0 && <li>No reading history yet.</li>}
          </ul>
        )}
        {tab === 'achievements' && (
          <div className="badge-grid">
            {achievementCatalog.map((item) => {
              const earned = shelf.achievements.includes(item.id);
              return (
                <article key={item.id} className={earned ? 'is-earned' : ''}>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                  <em>{earned ? 'Earned' : 'Locked'}</em>
                </article>
              );
            })}
          </div>
        )}
        {tab === 'settings' && (
          <form
            className="settings"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              updateProfile({
                preferences: {
                  dueReminders: data.get('dueReminders') === 'on',
                  challengeNotes: data.get('challengeNotes') === 'on',
                },
              });
            }}
          >
            <label className="check">
              <input type="checkbox" name="dueReminders" defaultChecked={profile.preferences?.dueReminders} />
              Email me when a book is due
            </label>
            <label className="check">
              <input type="checkbox" name="challengeNotes" defaultChecked={profile.preferences?.challengeNotes} />
              Remind me about unfinished flashcards
            </label>
            <button type="submit" className="btn btn-primary">
              Save settings
            </button>
          </form>
        )}
      </section>
      {editing && <EditProfile profile={profile} onClose={() => setEditing(false)} />}
    </AppShell>
  );
}

function LoanTables({ shelf }) {
  const rows = [
    ...shelf.loans.current.map((loan) => ({ ...loan, when: loan.issued })),
    ...shelf.loans.past.map((loan) => ({ ...loan, when: loan.issued })),
  ];
  if (rows.length === 0) return <p className="empty">No loans yet.</p>;
  return (
    <div className="table-wrap">
      <table className="sheet">
        <thead>
          <tr>
            <th>Book</th>
            <th>Issued</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const book = getBook(row.bookId);
            return (
              <tr key={row.id}>
                <td>{book?.title}</td>
                <td>{formatDate(row.when)}</td>
                <td>{row.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EditProfile({ profile, onClose }) {
  const { updateProfile } = useLibrary();
  const [photo, setPhoto] = useState(profile.photo || '');
  const [interests, setInterests] = useState(profile.interests.join(', '));

  function onPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result || ''));
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fullName = String(data.get('fullName') || '').trim();
    const saved = updateProfile({
      fullName,
      name: fullName.split(' ')[0] || profile.name,
      email: String(data.get('email') || '').trim(),
      universityId: String(data.get('universityId') || '').trim(),
      department: String(data.get('department') || ''),
      phone: String(data.get('phone') || '').trim(),
      year: String(data.get('year') || ''),
      location: String(data.get('location') || '').trim(),
      bio: String(data.get('bio') || '').trim(),
      readingGoal: Math.max(1, Number(data.get('readingGoal')) || profile.readingGoal),
      interests: interests
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      photo,
    });
    if (saved !== false) onClose();
  }

  return (
    <Modal title="Edit Profile" onClose={onClose} wide>
      <form className="edit-form" onSubmit={submit}>
        <h2>Edit Profile</h2>
        <p className="muted">Keep the desk’s copy of you up to date.</p>
        <label className="photo-field">
          <span className="photo-placeholder">{photo ? <img src={photo} alt="" /> : <Portrait name={profile.fullName} size={56} />}</span>
          <span>
            <strong>Profile photo</strong>
            <em>PNG or JPG</em>
          </span>
          <input type="file" accept="image/png,image/jpeg" onChange={onPhoto} />
        </label>
        <div className="form-grid">
          <label>
            Full name
            <input name="fullName" defaultValue={profile.fullName} required />
          </label>
          <label>
            Email
            <input name="email" type="email" defaultValue={profile.email} required />
          </label>
          <label>
            University ID
            <input name="universityId" defaultValue={profile.universityId} />
          </label>
          <label>
            Department
            <select name="department" defaultValue={profile.department}>
              {departments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Phone
            <input name="phone" defaultValue={profile.phone} />
          </label>
          <label>
            Year
            <select name="year" defaultValue={profile.year}>
              {years.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Location
            <input name="location" defaultValue={profile.location} />
          </label>
          <label>
            Reading goal
            <input name="readingGoal" type="number" min="1" defaultValue={profile.readingGoal} />
          </label>
        </div>
        <label>
          Quote
          <input name="bio" defaultValue={profile.bio} />
        </label>
        <label>
          Interests
          <input value={interests} onChange={(event) => setInterests(event.target.value)} />
        </label>
        <div className="modal-actions">
          <button type="button" className="btn btn-line" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
