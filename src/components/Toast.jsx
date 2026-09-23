import { CheckCircle2, X } from 'lucide-react';

/** Inline toast confirmation after join / profile save */
function Toast({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <CheckCircle2 size={18} aria-hidden />
      <span>{message}</span>
      <button type="button" className="toast-dismiss" onClick={onDismiss} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}

export default Toast;
