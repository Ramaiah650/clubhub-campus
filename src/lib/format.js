/** Catalog clock so the sample due dates match the Quillora screens. */
export const LIBRARY_TODAY = '2026-11-02';

export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function addDays(iso, days) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysUntil(iso, today = LIBRARY_TODAY) {
  const due = Date.parse(`${iso}T00:00:00Z`);
  const now = Date.parse(`${today}T00:00:00Z`);
  return Math.round((due - now) / 86400000);
}

export function dueLabel(iso) {
  const n = daysUntil(iso);
  if (Number.isNaN(n)) return '';
  if (n < 0) return `${Math.abs(n)} days overdue`;
  if (n === 0) return 'Due today';
  if (n === 1) return '1 day left';
  return `${n} days left`;
}

export function compactCount(n) {
  if (n >= 1000) {
    const value = n / 1000;
    const text = value >= 10 ? value.toFixed(0) : value.toFixed(1);
    return `${text.replace(/\.0$/, '')}k`;
  }
  return String(n);
}

export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function slugStatus(status) {
  return String(status || '')
    .toLowerCase()
    .replace(/[^a-z]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function levelFor(credits) {
  if (credits >= 800) return 5;
  if (credits >= 560) return 4;
  if (credits >= 360) return 3;
  if (credits >= 180) return 2;
  return 1;
}

export const LEVEL_TITLES = ['', 'Page Turner', 'Shelf Wanderer', 'Ink Scholar', 'Archivist', 'Keeper of Wings'];

export function prettifyName(identifier) {
  const local = identifier.split('@')[0].replace(/[._-]+/g, ' ').trim();
  if (!local) return 'Reader';
  return local.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
