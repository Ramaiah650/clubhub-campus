import { Link } from '../lib/router';
import { QuillMark } from './ui';

export function AiFab() {
  return (
    <Link to="/assistant" className="ai-fab" aria-label="Open the AI Library Assistant" data-testid="ai-fab">
      <QuillMark size={28} />
      <span>AI</span>
    </Link>
  );
}
