import { ArrowRight } from 'lucide-react';
import { QuillMark } from '../components/ui';
import { useRouter } from '../lib/router';

function Spread({ className = '', children }) {
  return (
    <div className={`spread ${className}`}>
      <div className="spread-pages">{children}</div>
    </div>
  );
}

function Motif({ kind }) {
  if (kind === 'bulb') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="26" r="14" fill="none" stroke="#6b3a1e" strokeWidth="2" />
        <path d="M26 40h12M28 46h8M30 50h4" stroke="#6b3a1e" strokeWidth="2" />
      </svg>
    );
  }
  if (kind === 'castle') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M10 54V28h8v8h6V20h8v16h6v-8h8v34" fill="none" stroke="#6b3a1e" strokeWidth="2" />
        <rect x="28" y="40" width="8" height="14" fill="#6b3a1e" />
      </svg>
    );
  }
  if (kind === 'tree') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 10 L48 34 H40 L50 48 H14 L24 34 H16 Z" fill="none" stroke="#6b3a1e" strokeWidth="2" />
        <path d="M32 48 v8" stroke="#6b3a1e" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 16 h16 a6 6 0 0 1 6 6 v28 H18 a6 6 0 0 0 -6 6z" fill="none" stroke="#6b3a1e" strokeWidth="2" />
      <path d="M36 16 h16 a6 6 0 0 1 6 6 v28 H42 a6 6 0 0 0 -6 6z" fill="none" stroke="#6b3a1e" strokeWidth="2" />
    </svg>
  );
}

const words = [
  ['Discover', 'bulb'],
  ['Learn', 'book'],
  ['Imagine', 'castle'],
  ['Grow', 'tree'],
];

export default function Landing() {
  const { navigate } = useRouter();
  return (
    <div className="landing">
      <h1 className="sr-only">Quillora — Where Knowledge Finds Its Wings.</h1>
      <div className="collage">
        <article className="panel panel-hall">
          <div className="mini-sun" />
          <div className="mini-arches">
            <span />
            <span />
            <span />
          </div>
          <div className="float-book">
            <QuillTome />
          </div>
        </article>
        <article className="panel panel-tome">
          <QuillTome large />
        </article>
        <article className="panel panel-spread">
          <Spread>
            {words.map(([label, kind]) => (
              <div key={label} className="motif">
                <Motif kind={kind} />
                <span>{label}</span>
              </div>
            ))}
          </Spread>
        </article>
        <article className="panel panel-spread is-tilt">
          <Spread>
            {words.map(([label, kind]) => (
              <div key={label} className="motif">
                <Motif kind={kind} />
                <span>{label}</span>
              </div>
            ))}
          </Spread>
        </article>
        <article className="panel panel-glow">
          <Spread className="is-glowing">
            <div className="motif wide">
              <Motif kind="castle" />
              <span>Imagine</span>
            </div>
            <div className="rays" />
          </Spread>
        </article>
        <article className="panel panel-brand">
          <button type="button" className="brand-panel" onClick={() => navigate('/login')}>
            <QuillMark size={42} />
            <strong>QUILLORA</strong>
            <em>Where Knowledge Finds Its Wings.</em>
            <span>Discover · Learn · Imagine · Grow</span>
          </button>
        </article>
      </div>
      <div className="landing-cta">
        <button type="button" className="btn btn-primary" onClick={() => navigate('/login')} data-testid="enter-library">
          Sign in <ArrowRight size={16} />
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/signup')}>
          Create an account
        </button>
      </div>
    </div>
  );
}

function QuillTome({ large = false }) {
  return (
    <div className={large ? 'quill-tome is-large' : 'quill-tome'}>
      <QuillMark size={large ? 54 : 36} />
      <strong>QUILLORA</strong>
      <em>Where Knowledge Finds Its Wings.</em>
    </div>
  );
}
