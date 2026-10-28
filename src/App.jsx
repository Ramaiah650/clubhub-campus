import { useEffect } from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Link, Navigate, Router, useRouter } from './lib/router';
import Assistant from './pages/Assistant';
import { About, Contact, Forgot, Login, Signup, Verify } from './pages/Auth';
import BookDetails from './pages/BookDetails';
import Borrowings from './pages/Borrowings';
import Challenges from './pages/Challenges';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Librarian from './pages/Librarian';
import Profile from './pages/Profile';
import Research from './pages/Research';
import SearchPage from './pages/Search';

const titles = {
  '/': 'Quillora',
  '/login': 'Sign in',
  '/signup': 'Create account',
  '/verify': 'Verification pending',
  '/forgot': 'Forgot password',
  '/about': 'About',
  '/contact': 'Contact',
  '/dashboard': 'Dashboard',
  '/borrowings': 'Borrowings',
  '/research': 'Research Explorer',
  '/search': 'Book search',
  '/assistant': 'AI Library Assistant',
  '/challenges': 'Reading Challenges',
  '/profile': 'Profile',
  '/librarian': 'Circulation desk',
};

function Screen() {
  const { path, search } = useRouter();
  const { session } = useLibrary();
  const book = path.match(/^\/book\/([^/]+)$/);

  useEffect(() => {
    const title = /^\/book\//.test(path) ? 'Book' : titles[path] || 'Quillora';
    document.title = `${title} · Quillora`;
    window.scrollTo(0, 0);
  }, [path]);

  const isPublic = ['/', '/login', '/signup', '/verify', '/forgot', '/about', '/contact'].includes(path) || Boolean(book && !session);

  if (!session && !isPublic && !book) {
    const next = encodeURIComponent(path + search);
    return <Navigate to={`/login?next=${next}`} />;
  }

  if (book) {
    if (!session) return <Navigate to={`/login?next=${encodeURIComponent(path)}`} />;
    return <BookDetails id={decodeURIComponent(book[1])} />;
  }

  switch (path) {
    case '/':
      return <Landing />;
    case '/login':
      return <Login />;
    case '/signup':
      return <Signup />;
    case '/verify':
      return <Verify />;
    case '/forgot':
      return <Forgot />;
    case '/about':
      return <About />;
    case '/contact':
      return <Contact />;
    case '/dashboard':
      return <Dashboard />;
    case '/borrowings':
      return <Borrowings />;
    case '/research':
      return <Research />;
    case '/search':
      return <SearchPage />;
    case '/assistant':
      return <Assistant />;
    case '/challenges':
      return <Challenges />;
    case '/profile':
      return <Profile />;
    case '/librarian':
      return session?.role === 'librarian' ? <Librarian /> : <Navigate to="/dashboard" />;
    default:
      return (
        <main className="missing card">
          <h1>This aisle does not exist</h1>
          <Link to="/">Return to Quillora</Link>
        </main>
      );
  }
}

export default function App() {
  return (
    <Router>
      <LibraryProvider>
        <Screen />
      </LibraryProvider>
    </Router>
  );
}
