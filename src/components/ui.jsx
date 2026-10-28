import { useEffect } from 'react';

export function QuillMark({ size = 54 }) {
  return (
    <svg className="quill" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M48 8c-1 7-6 14-14 22 7-.4 14-3 20-8-3 7-9 14-16 20 5 .4 11-2 15-7-7 5-15 8-24 7 3-7 9-13 16-17-9 2-16 8-22 15 7-2 13-7 17-14-7 5-13 12-15 22 7-6 13-15 15-26 1-7 3-13 8-14z"
        fill="#f6edd4"
      />
      <path d="M14 52c7-2 13-8 16-15" fill="none" stroke="#e2c36a" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 56l6-1.5 1.6 4.2-6 1.6z" fill="#e2c36a" />
    </svg>
  );
}

export function Brand({ stacked = false, light = false, compact = false }) {
  return (
    <div className={`brand ${stacked ? 'is-stacked' : ''} ${light ? 'is-light' : ''} ${compact ? 'is-compact' : ''}`}>
      <QuillMark size={compact ? 36 : stacked ? 62 : 48} />
      <div>
        <strong>QUILLORA</strong>
        <em>Where Knowledge Finds Its Wings.</em>
        {stacked && <span className="motto">Discover · Learn · Imagine · Grow</span>}
      </div>
    </div>
  );
}

export function Flourish() {
  return (
    <div className="flourish" aria-hidden="true">
      <span />
      <i>✦</i>
      <span />
    </div>
  );
}

export function BookCover({ book, size = 'md' }) {
  if (!book) return <span className={`cover size-${size} is-missing`} aria-hidden="true" />;
  return (
    <div
      className={`cover size-${size} c-${book.id}`}
      style={{ background: book.bg, color: book.ink, '--band': book.band }}
      aria-hidden="true"
    >
      <span className="cover-spine" />
      <span className="cover-band" />
      <strong>{book.coverTitle}</strong>
      <em>{book.coverAuthor}</em>
    </div>
  );
}

export function Portrait({ src, name, size = 72 }) {
  if (src) {
    return <img className="portrait" src={src} alt="" width={size} height={size} />;
  }
  return (
    <svg className="portrait" width={size} height={size} viewBox="0 0 80 80" role="img" aria-label={name || 'Reader'}>
      <circle cx="40" cy="40" r="40" fill="#6a2430" />
      <circle cx="40" cy="36" r="15" fill="#f0c7a4" />
      <path d="M16 72c5-16 14-22 24-22s19 6 24 22" fill="#f0c7a4" />
      <path d="M20 40c2-18 10-26 20-26 12 0 18 8 20 22-8 5-12 2-20 2s-14 3-20 2z" fill="#24140f" />
      <path d="M22 68c6-9 13-12 18-12s13 4 18 14" fill="#7a2940" />
      <circle cx="34" cy="36" r="1.3" fill="#3a2418" />
      <circle cx="46" cy="36" r="1.3" fill="#3a2418" />
    </svg>
  );
}

export function Stars({ value }) {
  const full = Math.round(Number(value) || 0);
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < full ? 'is-on' : ''}>
          ★
        </span>
      ))}
    </span>
  );
}

export function QrMark({ value }) {
  let hash = 0;
  for (const char of value) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  const cells = [];
  for (let i = 0; i < 121; i += 1) {
    const row = Math.floor(i / 11);
    const col = i % 11;
    const finder = (row < 4 && col < 4) || (row < 4 && col > 6) || (row > 6 && col < 4);
    const on = finder ? row === 0 || col === 0 || row === 3 || col === 3 || row === 10 || col === 10 || (row % 7 > 1 && col % 7 > 1) : ((hash >> (i % 24)) ^ i * 13) & 4;
    cells.push(Boolean(on));
  }
  return (
    <div className="qr" aria-hidden="true">
      {cells.map((on, index) => (
        <i key={index} className={on ? 'is-on' : ''} />
      ))}
    </div>
  );
}

export function LibraryBackdrop() {
  return (
    <div className="library-bg" aria-hidden="true">
      <div className="library-sky" />
      <div className="library-sun" />
      <div className="library-arches">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="library-floor" />
    </div>
  );
}

export function CampusHero() {
  return (
    <div className="campus-hero">
      <div className="sun" />
      <div className="foliage" />
      <svg className="campus-svg" viewBox="0 0 800 640" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="winGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe7b8" />
            <stop offset="1" stopColor="#e07a32" />
          </linearGradient>
        </defs>
        <ellipse cx="70" cy="430" rx="78" ry="96" fill="#173018" />
        <ellipse cx="40" cy="470" rx="50" ry="70" fill="#102410" />
        <ellipse cx="760" cy="450" rx="90" ry="110" fill="#173018" />
        <ellipse cx="400" cy="610" rx="460" ry="46" fill="#1a0c08" />
        <rect x="214" y="230" width="78" height="300" fill="#241410" />
        <polygon points="214,230 253,150 292,230" fill="#2a1612" />
        <polygon points="236,158 253,108 270,158" fill="#1a0d0a" />
        <rect x="292" y="330" width="230" height="210" fill="#2c1814" />
        <polygon points="292,330 407,250 522,330" fill="#3a2018" />
        <circle cx="407" cy="390" r="30" fill="url(#winGlow)" />
        <circle cx="407" cy="390" r="12" fill="#2c1814" />
        <path d="M382 540 v-48 a25 25 0 0 1 50 0 v48" fill="#120806" />
        <rect x="522" y="250" width="70" height="280" fill="#241410" />
        <polygon points="522,250 557,176 592,250" fill="#2a1612" />
        <rect x="548" y="286" width="16" height="78" fill="#7a1e2a" />
        {Array.from({ length: 4 }, (_, index) => (
          <path
            key={`c${index}`}
            d={`M${318 + index * 46} 450 v42 h18 v-42 a9 9 0 0 0 -18 0z`}
            fill="url(#winGlow)"
          />
        ))}
        {Array.from({ length: 3 }, (_, index) => (
          <rect key={`t${index}`} x={232 + (index % 2) * 28} y={270 + index * 48} width="14" height="28" rx="7" fill="url(#winGlow)" />
        ))}
        <rect x="300" y="560" width="210" height="14" fill="#3a2418" />
      </svg>
      <div className="hero-copy">
        <Brand light />
        <blockquote>
          “Books are keys,
          <br />
          Libraries are wings,
          <br />
          And knowledge sets us free.”
        </blockquote>
      </div>
      <div className="hero-books" aria-hidden="true">
        <span className="stack-book one" />
        <span className="stack-book two" />
        <span className="stack-book three" />
      </div>
      <p className="hall-plaque">Central Library</p>
    </div>
  );
}

export function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-back" onMouseDown={onClose}>
      <div
        className={`modal ${wide ? 'is-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function Empty({ children }) {
  return <p className="empty">{children}</p>;
}
