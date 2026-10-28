import { books, getBook } from '../data/catalog';

export const suggestedQuestions = [
  { id: 'summarize', label: 'Summarize this book', icon: 'book' },
  { id: 'dbms', label: 'Which books are available on DBMS?', icon: 'search' },
  { id: 'compare', label: 'Compare these two books', icon: 'scale' },
  { id: 'plan', label: 'Create a study plan for OS', icon: 'plan' },
  { id: 'papers', label: 'Find research papers on AI', icon: 'file' },
];

function titled(query) {
  return books.find((item) => query.includes(item.title.toLowerCase()));
}

export function answerQuestion(text, lastBook) {
  const q = text.toLowerCase();

  if (q.includes('summar')) {
    const book = titled(q) || lastBook || getBook('machine-learning');
    return {
      text: `${book.title} by ${book.author} (${book.year}). ${book.description} Readers rate it ${book.rating} out of 5. Shelf: ${book.location}.`,
      books: [book.id],
    };
  }

  if (q.includes('study plan') || (q.includes('plan') && /\bos\b|operating/.test(q))) {
    return {
      text: [
        'A four-week plan for Operating Systems:',
        'Week 1 — Processes, threads, and CPU scheduling. Read Operating System Concepts, chapters 3–5, and try the end-of-chapter questions.',
        'Week 2 — Memory: paging, virtual memory, and thrashing. Read the memory dialogue in Three Easy Pieces beside the textbook.',
        'Week 3 — File systems and I/O. Use Tanenbaum’s case studies so the abstractions meet a real kernel.',
        'Week 4 — Concurrency. Write a one-page note on a race you can explain out loud. Borrow a second title if the first stays dense.',
        'Keep one print copy and one reference beside it.',
      ].join('\n'),
      books: ['os-concepts', 'modern-os', 'three-easy'],
    };
  }

  if (q.includes('operating system') || q.includes('beginner')) {
    return {
      text: 'Here are some recommended books for learning Operating Systems for beginners:',
      books: ['os-concepts', 'modern-os', 'three-easy'],
      numbered: true,
    };
  }

  if (q.includes('dbms') || q.includes('database')) {
    const hits = books.filter(
      (item) =>
        /database|data structure/i.test(`${item.title} ${item.subjects.join(' ')}`) &&
        item.availability === 'Available',
    );
    return {
      text: 'These database and data-structure titles are on the shelf and available to borrow:',
      books: (hits.length ? hits : [getBook('dbms')]).map((item) => item.id),
    };
  }

  if (q.includes('compare')) {
    return {
      text: [
        'Comparing two operating-system classics:',
        'Operating System Concepts (Silberschatz, Galvin, Gagne) is the broad university textbook. Processes, memory, storage, and protection each get a full chapter and a problem set.',
        'Modern Operating Systems (Tanenbaum) is more narrative. MINIX and other real systems show up beside the theory, which helps when a chapter starts to feel abstract.',
        'Start with Silberschatz if you are following a course. Read Tanenbaum beside it when you want to see how a kernel actually behaves.',
      ].join('\n'),
      books: ['os-concepts', 'modern-os'],
    };
  }

  if (q.includes('paper') || q.includes('research') || (q.includes('artificial intelligence') && q.includes('find'))) {
    return {
      text: 'I pulled highly cited papers on artificial intelligence from the Research Explorer. Open one for the abstract, or continue in the explorer to filter by year and access.',
      papers: ['survey-ml', 'ai-ethics', 'deep-real'],
    };
  }

  if (q.includes('habit')) {
    const book = getBook('atomic-habits');
    return { text: `${book.title} by ${book.author}. ${book.description}`, books: [book.id] };
  }

  const hits = books
    .filter((item) =>
      [item.title, item.author, item.description, item.subjects.join(' ')].join(' ').toLowerCase().includes(q),
    )
    .slice(0, 3);

  if (hits.length) {
    return {
      text: `Here is what the Quillora shelves hold for “${text.trim()}”.`,
      books: hits.map((item) => item.id),
    };
  }

  return {
    text: 'I can find a book, compare two titles, sketch a study plan, or point you at research papers. Try a suggested question, or name a subject such as databases, machine learning, or fiction.',
    books: ['machine-learning', 'clean-code', 'atomic-habits'],
  };
}
