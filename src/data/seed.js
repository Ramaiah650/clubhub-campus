import { LIBRARY_TODAY } from '../lib/format';

export const demoEmail = 'harshini@quillora.edu';
export const demoPassword = 'library';

export const harshiniProfile = {
  name: 'Harshini',
  fullName: 'Harshini Harshi',
  email: demoEmail,
  universityId: 'UNI-2024-0142',
  department: 'Computer Science and Engineering',
  phone: '+91 98765 43210',
  year: '3rd Year',
  location: 'Bengaluru, India',
  role: 'Student',
  bio: 'A reader today, a leader tomorrow.',
  joined: '12 Aug 2023',
  interests: ['Machine Learning', 'Web Development', 'Operating Systems', 'Databases', 'Algorithms'],
  readingGoal: 34,
  photo: '',
  verified: true,
  preferences: { dueReminders: true, challengeNotes: true },
};

const openingChat = [
  {
    id: 'u-seed',
    role: 'user',
    text: 'Suggest some books for learning operating systems for beginners.',
  },
  {
    id: 'a-seed',
    role: 'assistant',
    text: 'Here are some recommended books for learning Operating Systems for beginners:',
    books: ['os-concepts', 'modern-os', 'three-easy'],
    numbered: true,
  },
];

export const harshiniShelf = {
  loans: {
    current: [
      { id: 'loan-ds', bookId: 'data-structures', issued: '2026-10-10', due: '2026-10-24', status: 'Active' },
      { id: 'loan-os', bookId: 'os-concepts', issued: '2026-10-09', due: '2026-10-23', status: 'Active' },
      { id: 'loan-ml', bookId: 'machine-learning', issued: '2026-10-06', due: '2026-10-20', status: 'Overdue' },
    ],
    reservations: [
      { id: 'res-alc', bookId: 'alchemist', reserved: '2026-10-12', status: 'Ready for pickup' },
      { id: 'res-iki', bookId: 'ikigai', reserved: '2026-10-18', status: 'Pending' },
    ],
    past: [
      { id: 'past-cc', bookId: 'clean-code', issued: '2026-08-01', returned: '2026-08-20', status: 'Returned' },
      { id: 'past-ah', bookId: 'atomic-habits', issued: '2026-09-02', returned: '2026-09-22', status: 'Returned' },
    ],
  },
  dues: [
    { bookId: 'clean-code', due: '2026-11-05' },
    { bookId: 'atomic-habits', due: '2026-11-10' },
    { bookId: 'alchemist', due: '2026-11-18' },
    { bookId: 'ikigai', due: '2026-11-22' },
  ],
  chat: openingChat,
  credits: 420,
  creditLog: [
    { id: 'c1', label: 'Finished Atomic Habits', amount: 40, date: '2026-09-22' },
    { id: 'c2', label: 'Weekly flashcards', amount: 20, date: '2026-10-18' },
    { id: 'c3', label: 'Operating systems quiz', amount: 30, date: '2026-10-02' },
  ],
  flashcardsSeen: ['fc1', 'fc2'],
  quiz: { answers: {}, score: null, rewarded: false, completed: false },
  notifications: [
    { id: 'n1', title: 'Due soon', body: 'Clean Code is due on 5 Nov 2026.', unread: true },
    { id: 'n2', title: 'Hold ready', body: 'The Alchemist is ready for pickup at the circulation desk.', unread: true },
    { id: 'n3', title: 'Challenge', body: 'Two flashcards will finish this week’s reading streak.', unread: false },
  ],
  booksBorrowed: 12,
  booksRead: 24,
  challengesCompleted: 8,
  achievements: ['first', 'ten', 'night'],
  recentlyRead: [
    { bookId: 'machine-learning' },
    { bookId: 'web-dev' },
    { bookId: 'os-concepts' },
    { bookId: 'algorithms' },
  ],
  monthly: [2, 3, 4, 3, 5, 4, 6, 5, 3, 4, 6, 5],
};

export function blankProfile(over = {}) {
  const name = over.name || 'Reader';
  return {
    name,
    fullName: over.fullName || name,
    email: over.email || '',
    universityId: over.universityId || '',
    department: over.department || 'General Studies',
    phone: over.phone || '',
    year: over.year || '1st Year',
    location: over.location || 'Campus Library',
    role: 'Student',
    bio: 'A reader today, a leader tomorrow.',
    joined: over.joined || LIBRARY_TODAY,
    interests: over.interests || ['Reading'],
    readingGoal: 12,
    photo: over.photo || '',
    verified: over.verified !== false,
    preferences: { dueReminders: true, challengeNotes: true },
    ...over,
  };
}

export function blankShelf() {
  return {
    loans: { current: [], reservations: [], past: [] },
    dues: [],
    chat: openingChat.map((message) => ({ ...message, books: message.books ? [...message.books] : undefined })),
    credits: 40,
    creditLog: [{ id: 'welcome-cr', label: 'Welcome gift', amount: 40, date: LIBRARY_TODAY }],
    flashcardsSeen: [],
    quiz: { answers: {}, score: null, rewarded: false, completed: false },
    notifications: [
      {
        id: 'welcome',
        title: 'Welcome to Quillora',
        body: 'Your reading desk is ready. Borrow a recommended book to begin.',
        unread: true,
      },
    ],
    booksBorrowed: 0,
    booksRead: 0,
    challengesCompleted: 0,
    achievements: [],
    recentlyRead: [],
    monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  };
}

export function isHarshini(identifier) {
  const id = identifier.trim().toLowerCase().replace(/\s+/g, '');
  return ['harshini@quillora.edu', 'harshini', 'harshini.harshi@quillora.edu', 'uni-2024-0142', 'uni20240142'].includes(id);
}

export function resolveEmail(identifier, profiles) {
  if (isHarshini(identifier)) return demoEmail;
  const id = identifier.trim().toLowerCase();
  if (profiles[id]) return id;
  const needle = id.replace(/[^a-z0-9]/g, '');
  const byId = Object.values(profiles).find(
    (profile) => profile.universityId.toLowerCase().replace(/[^a-z0-9]/g, '') === needle,
  );
  if (byId) return byId.email;
  if (id.includes('@')) return id;
  const local = needle || 'reader';
  return `${local}@quillora.edu`;
}

export const achievementCatalog = [
  { id: 'first', title: 'First Light', detail: 'Borrowed your first book' },
  { id: 'ten', title: 'Ten Stacks', detail: 'Ten books borrowed' },
  { id: 'quiz', title: 'Quiz Quill', detail: 'Finished a reading quiz' },
  { id: 'flash', title: 'Flash of Insight', detail: 'Reviewed every flashcard' },
  { id: 'night', title: 'Night Oil', detail: 'Read five days in a row' },
];
