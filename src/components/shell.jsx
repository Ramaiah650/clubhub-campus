import { Bell, BookOpen, Compass, Home, LogOut, Search, Trophy, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Link, useRouter } from '../lib/router';
import { AiFab } from './AiFab';
import { Brand, LibraryBackdrop, Portrait } from './ui';

const userNav = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/borrowings', label: 'Borrowings', icon: BookOpen },
  { to: '/research', label: 'Research Explorer', icon: Compass },
  { to: '/challenges', label: 'Reading Challenges', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User },
];

const librarianNav = [
  { to: '/librarian', label: 'Desk', icon: Home },
  { to: '/borrowings', label: 'Borrowings', icon: BookOpen },
  { to: '/research', label: 'Research Explorer', icon: Compass },
  { to: '/challenges', label: 'Reading Challenges', icon: Trophy },
];

export function Notifications() {
  const { shelf, markNotifications } = useLibrary();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const notes = shelf?.notifications || [];
  const unread = notes.filter((item) => item.unread).length;

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div className="bell-wrap" ref={ref}>
      <button type="button" className="icon-btn" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} onClick={() => setOpen((value) => !value)}>
        <Bell size={18} />
        {unread > 0 && <span className="count-badge">{unread}</span>}
      </button>
      {open && (
        <div className="pop">
          <header>
            <strong>Desk notes</strong>
            <button type="button" onClick={() => markNotifications('all')}>
              Mark all read
            </button>
          </header>
          {notes.length === 0 && <p>No notes yet.</p>}
          {notes.map((note) => (
            <button key={note.id} type="button" className={note.unread ? 'note is-unread' : 'note'} onClick={() => markNotifications(note.id)}>
              <strong>{note.title}</strong>
              <span>{note.body}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function UserChip() {
  const { profile, session } = useLibrary();
  const librarian = session?.role === 'librarian';
  const label = librarian ? 'Librarian' : profile?.role || 'Student';
  return (
    <Link to={librarian ? '/librarian' : '/profile'} className="user-chip">
      <Portrait src={profile?.photo} name={profile?.fullName} size={36} />
      <span>{label}</span>
    </Link>
  );
}

function Sidebar() {
  const { path, navigate } = useRouter();
  const { session, signOut } = useLibrary();
  const items = session?.role === 'librarian' ? librarianNav : userNav;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Brand stacked light />
      </div>
      <nav className="side-nav" aria-label="Library">
        {items.map((item) => {
          const Icon = item.icon;
          const active = path === item.to;
          return (
            <Link key={item.to} to={item.to} className={active ? 'nav-link is-active' : 'nav-link'} aria-current={active ? 'page' : undefined}>
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        className="nav-link sign-out"
        onClick={() => {
          signOut();
          navigate('/login');
        }}
      >
        <LogOut size={18} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
}

export function TopBar() {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');

  function openSearch(event) {
    event.preventDefault();
    const q = query.trim() || 'Machine Learning';
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="topbar">
      <form className="search-pill" onSubmit={openSearch} onClick={openSearch}>
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for books, authors, subjects..."
          aria-label="Search for books, authors, subjects"
          data-testid="open-search"
          readOnly
        />
      </form>
      <div className="bar-actions">
        <Notifications />
        <UserChip />
      </div>
    </header>
  );
}

export function AppShell({ children }) {
  const { profile } = useLibrary();
  return (
    <div className="shell">
      <Sidebar />
      <div className="shell-main">
        <LibraryBackdrop />
        <TopBar />
        {profile && profile.verified === false && (
          <p className="pending-banner">Verification is pending. You can explore and reserve; borrowing opens when a librarian approves the account.</p>
        )}
        <div className="shell-content">{children}</div>
      </div>
      <AiFab />
    </div>
  );
}

export function FocusFrame({ children, center, fab = true }) {
  return (
    <div className="focus">
      <LibraryBackdrop />
      <header className="focus-bar">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <div className="focus-center">{center}</div>
        <div className="bar-actions">
          <Notifications />
          <UserChip />
        </div>
      </header>
      <div className="focus-body">{children}</div>
      {fab && <AiFab />}
    </div>
  );
}
