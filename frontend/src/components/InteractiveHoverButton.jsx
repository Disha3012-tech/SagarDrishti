// Pill button with an expanding-fill hover effect: a small accent dot
// grows to cover the button and the label swaps for "label + arrow"
// sliding in from the right. Same interaction as the shadcn demo, built
// without lucide-react (inline SVG arrow) or the `cn` helper.
export default function InteractiveHoverButton({ text = 'Button', onClick, variant = 'primary', className = '' }) {
  return (
    <button type="button" onClick={onClick} className={`sd-ihbtn sd-ihbtn--${variant} ${className}`}>
      <span className="sd-ihbtn__fill" />
      <span className="sd-ihbtn__label sd-ihbtn__label--idle">{text}</span>
      <span className="sd-ihbtn__label sd-ihbtn__label--hover">
        {text}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
      <style>{`
        .sd-ihbtn {
          position: relative; display: inline-flex; align-items: center; justify-content: center;
          height: 44px; padding: 0 28px; border-radius: 999px; overflow: hidden;
          border: 1px solid var(--color-divider); background: var(--color-surface);
          cursor: pointer; font-size: 14px; font-weight: 600; color: var(--color-text);
        }
        .sd-ihbtn--secondary { background: transparent; }
        .sd-ihbtn__fill {
          position: absolute; left: 18%; top: 40%; width: 8px; height: 8px; border-radius: 999px;
          background: var(--color-accent); transform: scale(1);
          transition: all 380ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .sd-ihbtn:hover .sd-ihbtn__fill { left: 0; top: 0; width: 100%; height: 100%; transform: scale(1.6); }
        .sd-ihbtn__label { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 8px; transition: all 300ms ease; }
        .sd-ihbtn__label--idle { transform: translateX(2px); }
        .sd-ihbtn:hover .sd-ihbtn__label--idle { transform: translateX(24px); opacity: 0; }
        .sd-ihbtn__label--hover {
          position: absolute; inset: 0; display: inline-flex; align-items: center; justify-content: center;
          gap: 8px; color: #14172a; transform: translateX(24px); opacity: 0;
        }
        .sd-ihbtn:hover .sd-ihbtn__label--hover { transform: translateX(-2px); opacity: 1; }
      `}</style>
    </button>
  );
}