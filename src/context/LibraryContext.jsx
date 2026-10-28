import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { flashcards, getBook, quizQuestions } from '../data/catalog';
import {
  achievementCatalog,
  blankProfile,
  blankShelf,
  demoEmail,
  harshiniProfile,
  harshiniShelf,
  resolveEmail,
} from '../data/seed';
import { answerQuestion } from '../lib/assistant';
import { LIBRARY_TODAY, addDays, formatDate, prettifyName } from '../lib/format';

const KEY = 'quillora.v1';
const SESSION_FLAG = 'quillora.session';
const PENDING_EMAIL = 'quillora.pendingEmail';

const LibraryContext = createContext(null);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

function restoreSession(saved) {
  if (!saved?.session) return null;
  if (saved.session.remember) return saved.session;
  try {
    return sessionStorage.getItem(SESSION_FLAG) ? saved.session : null;
  } catch {
    return null;
  }
}

export function LibraryProvider({ children }) {
  const saved = useMemo(() => load(), []);
  const [profiles, setProfiles] = useState(() => saved?.profiles || { [demoEmail]: clone(harshiniProfile) });
  const [shelves, setShelves] = useState(() => saved?.shelves || { [demoEmail]: clone(harshiniShelf) });
  const [pending, setPending] = useState(() => saved?.pending || []);
  const [session, setSession] = useState(() => restoreSession(saved));
  const [lastBookId, setLastBookId] = useState(() => saved?.lastBookId || 'machine-learning');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const payload = { version: 1, profiles, shelves, pending, session, lastBookId };
    try {
      localStorage.setItem(KEY, JSON.stringify(payload));
    } catch {
      /* quota or private mode */
    }
  }, [profiles, shelves, pending, session, lastBookId]);

  function toast(message) {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((list) => [...list, { id, message }]);
    window.setTimeout(() => {
      setToasts((list) => list.filter((item) => item.id !== id));
    }, 3200);
  }

  function updateShelf(email, recipe) {
    setShelves((prev) => {
      const current = prev[email] || blankShelf();
      return { ...prev, [email]: recipe(current) };
    });
  }

  const email = session?.email || '';
  const profile = email ? profiles[email] || null : null;
  const shelf = email ? shelves[email] || blankShelf() : null;

  function signIn({ identifier, password, role, remember }) {
    if (!identifier.trim() || !password.trim()) {
      return { ok: false, error: 'Enter your email or register number and a password.' };
    }
    const resolved = resolveEmail(identifier, profiles);
    let nextProfile = profiles[resolved];
    if (!nextProfile) {
      const name = prettifyName(identifier);
      nextProfile = blankProfile({
        email: resolved,
        name: name.split(' ')[0],
        fullName: name,
        universityId: identifier.includes('@') ? '' : identifier.trim().toUpperCase(),
        verified: true,
        joined: formatDate(LIBRARY_TODAY),
      });
      setProfiles((prev) => ({ ...prev, [resolved]: nextProfile }));
      setShelves((prev) => ({ ...prev, [resolved]: prev[resolved] || blankShelf() }));
    }
    try {
      if (remember) sessionStorage.removeItem(SESSION_FLAG);
      else sessionStorage.setItem(SESSION_FLAG, '1');
    } catch {
      /* ignore */
    }
    setSession({ email: resolved, role: role === 'librarian' ? 'librarian' : 'user', remember: Boolean(remember) });
    return { ok: true, role: role === 'librarian' ? 'librarian' : 'user' };
  }

  function signOut() {
    try {
      sessionStorage.removeItem(SESSION_FLAG);
    } catch {
      /* ignore */
    }
    setSession(null);
  }

  function createAccount(form) {
    const universityId = form.universityId.trim();
    const local = universityId.toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (!form.name.trim() || !universityId || !form.department || !form.phone.trim()) {
      return { ok: false, error: 'Name, university ID, department, and phone are required.' };
    }
    if (form.phone.replace(/\D/g, '').length < 7) {
      return { ok: false, error: 'Enter a phone number the desk can actually dial.' };
    }
    const accountEmail = `${local}@quillora.edu`;
    const existing = Object.values(profiles).some(
      (item) => item.email === accountEmail || item.universityId.toLowerCase().replace(/[^a-z0-9]/g, '') === local,
    );
    if (existing) {
      return { ok: false, error: 'That university ID already has a Quillora account. Sign in instead.' };
    }
    const fullName = form.name.trim();
    const next = blankProfile({
      name: fullName.split(' ')[0],
      fullName,
      email: accountEmail,
      universityId: universityId.toUpperCase(),
      department: form.department,
      phone: form.phone.trim(),
      photo: form.photo || '',
      verified: false,
      joined: formatDate(LIBRARY_TODAY),
    });
    setProfiles((prev) => ({ ...prev, [accountEmail]: next }));
    setShelves((prev) => ({ ...prev, [accountEmail]: blankShelf() }));
    setPending((list) => [
      ...list,
      { email: accountEmail, name: fullName, department: next.department, universityId: next.universityId, submitted: LIBRARY_TODAY },
    ]);
    try {
      sessionStorage.setItem(PENDING_EMAIL, accountEmail);
    } catch {
      /* ignore */
    }
    return { ok: true, email: accountEmail, name: fullName };
  }

  function continuePending() {
    let pendingEmail = '';
    try {
      pendingEmail = sessionStorage.getItem(PENDING_EMAIL) || '';
    } catch {
      pendingEmail = '';
    }
    if (!pendingEmail || !profiles[pendingEmail]) return { ok: false };
    return signIn({ identifier: pendingEmail, password: 'pending', role: 'user', remember: true });
  }

  function approveAccount(accountEmail) {
    setProfiles((prev) => ({
      ...prev,
      [accountEmail]: { ...prev[accountEmail], verified: true },
    }));
    setPending((list) => list.filter((item) => item.email !== accountEmail));
    toast(`${profiles[accountEmail]?.fullName || 'Reader'} can borrow now.`);
  }

  function rememberBook(bookId) {
    setLastBookId(bookId);
  }

  function borrowBook(bookId) {
    if (!session) return;
    const book = getBook(bookId);
    if (!book) return;
    if (profile && profile.verified === false) {
      toast('Verification is still pending. You can reserve books until the desk approves your account.');
      return;
    }
    if (book.availability === 'Checked Out') {
      toast(`${book.title} is checked out. Reserve a copy and the desk will hold it.`);
      return;
    }
    const current = shelves[session.email] || blankShelf();
    if (current.loans.current.some((loan) => loan.bookId === bookId)) {
      toast(`${book.title} is already on your loans.`);
      return;
    }
    const due = addDays(LIBRARY_TODAY, 14);
    updateShelf(session.email, (currentShelf) => ({
      ...currentShelf,
      loans: {
        ...currentShelf.loans,
        current: [
          { id: `loan-${bookId}-${Date.now()}`, bookId, issued: LIBRARY_TODAY, due, status: 'Active' },
          ...currentShelf.loans.current,
        ],
      },
      dues: [{ bookId, due }, ...currentShelf.dues.filter((item) => item.bookId !== bookId)],
      booksBorrowed: currentShelf.booksBorrowed + 1,
      achievements: currentShelf.booksBorrowed + 1 >= 1
        ? Array.from(new Set([...currentShelf.achievements, 'first', ...(currentShelf.booksBorrowed + 1 >= 10 ? ['ten'] : [])]))
        : currentShelf.achievements,
    }));
    toast(`Borrowed ${book.title}. Due ${formatDate(due)}.`);
  }

  function renewLoan(loanId) {
    if (!session) return;
    const due = addDays(LIBRARY_TODAY, 14);
    updateShelf(session.email, (currentShelf) => ({
      ...currentShelf,
      loans: {
        ...currentShelf.loans,
        current: currentShelf.loans.current.map((loan) =>
          loan.id === loanId ? { ...loan, due, status: 'Active' } : loan,
        ),
      },
    }));
    toast(`Renewed. The new due date is ${formatDate(due)}.`);
  }

  function reserveBook(bookId) {
    if (!session) return;
    const book = getBook(bookId);
    if (!book) return;
    const current = shelves[session.email] || blankShelf();
    if (current.loans.reservations.some((item) => item.bookId === bookId)) {
      toast(`${book.title} is already on your reservations.`);
      return;
    }
    updateShelf(session.email, (currentShelf) => ({
      ...currentShelf,
      loans: {
        ...currentShelf.loans,
        reservations: [
          { id: `res-${bookId}-${Date.now()}`, bookId, reserved: LIBRARY_TODAY, status: 'Pending' },
          ...currentShelf.loans.reservations,
        ],
      },
    }));
    toast(`Reserved ${book.title}. The desk will hold a copy for you.`);
  }

  function cancelReservation(reservationId) {
    if (!session) return;
    updateShelf(session.email, (currentShelf) => ({
      ...currentShelf,
      loans: {
        ...currentShelf.loans,
        reservations: currentShelf.loans.reservations.filter((item) => item.id !== reservationId),
      },
    }));
    toast('Reservation cancelled.');
  }

  function updateProfile(patch) {
    if (!session) return;
    if (patch.photo && patch.photo.length > 500000) {
      toast('That photo is too large. Choose one under about 400KB.');
      return false;
    }
    setProfiles((prev) => ({
      ...prev,
      [session.email]: { ...prev[session.email], ...patch },
    }));
    toast('Profile saved.');
    return true;
  }

  function markNotifications(id) {
    if (!session) return;
    updateShelf(session.email, (currentShelf) => ({
      ...currentShelf,
      notifications: currentShelf.notifications.map((item) =>
        id === 'all' || item.id === id ? { ...item, unread: false } : item,
      ),
    }));
  }

  function sendChat(text) {
    if (!session) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = answerQuestion(trimmed, getBook(lastBookId));
    const stamp = Date.now();
    updateShelf(session.email, (currentShelf) => ({
      ...currentShelf,
      chat: [
        ...currentShelf.chat,
        { id: `u-${stamp}`, role: 'user', text: trimmed },
        { id: `a-${stamp}`, role: 'assistant', ...reply },
      ],
    }));
  }

  function reviewFlashcard(cardId) {
    if (!session) return;
    const current = shelves[session.email] || blankShelf();
    if (current.flashcardsSeen.includes(cardId)) return;
    const seen = [...current.flashcardsSeen, cardId];
    const completed = seen.length === flashcards.length;
    updateShelf(session.email, (currentShelf) => ({
      ...currentShelf,
      flashcardsSeen: seen,
      credits: currentShelf.credits + 5,
      creditLog: [
        { id: `fc-${cardId}`, label: 'Flashcard reviewed', amount: 5, date: LIBRARY_TODAY },
        ...currentShelf.creditLog,
      ],
      achievements: completed ? Array.from(new Set([...currentShelf.achievements, 'flash'])) : currentShelf.achievements,
      challengesCompleted: completed ? currentShelf.challengesCompleted + 1 : currentShelf.challengesCompleted,
    }));
  }

  function setQuizAnswer(questionId, optionIndex) {
    if (!session) return;
    updateShelf(session.email, (currentShelf) => ({
      ...currentShelf,
      quiz: {
        ...currentShelf.quiz,
        answers: { ...currentShelf.quiz.answers, [questionId]: optionIndex },
      },
    }));
  }

  function finishQuiz() {
    if (!session) return { correct: 0, gain: 0 };
    const current = shelves[session.email] || blankShelf();
    const correct = quizQuestions.filter((question) => current.quiz.answers[question.id] === question.answer).length;
    const gain = current.quiz.rewarded ? 0 : correct * 10;
    updateShelf(session.email, (currentShelf) => ({
      ...currentShelf,
      credits: currentShelf.credits + gain,
      challengesCompleted: currentShelf.quiz.rewarded ? currentShelf.challengesCompleted : currentShelf.challengesCompleted + 1,
      quiz: { ...currentShelf.quiz, score: correct, rewarded: true, completed: true },
      creditLog: gain
        ? [{ id: `quiz-${Date.now()}`, label: 'Reading quiz', amount: gain, date: LIBRARY_TODAY }, ...currentShelf.creditLog]
        : currentShelf.creditLog,
      achievements:
        correct === quizQuestions.length
          ? Array.from(new Set([...currentShelf.achievements, 'quiz']))
          : currentShelf.achievements,
    }));
    if (gain) toast(`Quiz complete. ${gain} credits added to your ledger.`);
    else toast('Quiz complete. Credits for this round were already awarded.');
    return { correct, gain };
  }

  function resetQuiz() {
    if (!session) return;
    updateShelf(session.email, (currentShelf) => ({
      ...currentShelf,
      quiz: { ...currentShelf.quiz, answers: {}, score: null, completed: false },
    }));
  }

  function requestReset(identifier) {
    if (!identifier.trim()) return { ok: false, error: 'Enter the email or register number on your account.' };
    return {
      ok: true,
      message: `If ${identifier.trim()} is on the register, a reset note is waiting in the university inbox. In this demo, any password will sign you in.`,
    };
  }

  const patronLoans = Object.entries(shelves).flatMap(([accountEmail, accountShelf]) =>
    accountShelf.loans.current.map((loan) => ({
      ...loan,
      email: accountEmail,
      patron: profiles[accountEmail]?.fullName || accountEmail,
    })),
  );

  const value = {
    session,
    profile,
    shelf,
    profiles,
    shelves,
    pending,
    patronLoans,
    lastBookId,
    achievementCatalog,
    signIn,
    signOut,
    createAccount,
    continuePending,
    approveAccount,
    rememberBook,
    borrowBook,
    renewLoan,
    reserveBook,
    cancelReservation,
    updateProfile,
    markNotifications,
    sendChat,
    reviewFlashcard,
    setQuizAnswer,
    finishQuiz,
    resetQuiz,
    requestReset,
    toast,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((item) => (
          <div key={item.id} className="toast" role="status">
            {item.message}
          </div>
        ))}
      </div>
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside LibraryProvider');
  return ctx;
}
