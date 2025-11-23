import { useEffect } from "react";

const LETTER_CHOICES = Array.from({ length: 26 }, (_, idx) => String.fromCharCode(65 + idx));

export default function BlankTilePicker({ isOpen, onClose, onSelect, rackIndex }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      const key = event.key?.toUpperCase();
      if (key === "ESCAPE") {
        onClose?.();
        return;
      }
      if (/^[A-Z]$/.test(key)) {
        onSelect?.(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onSelect]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-label="Select letter for blank tile">
        <h3 className="modal__title">Choose a letter</h3>
        <p className="modal__subtitle">Assign a letter to your blank tile{typeof rackIndex === "number" ? ` (slot ${rackIndex + 1})` : ""}.</p>
        <div className="modal__grid">
          {LETTER_CHOICES.map((letter) => (
            <button
              key={letter}
              type="button"
              className="modal__choice"
              onClick={() => onSelect?.(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
        <button type="button" className="modal__close" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
