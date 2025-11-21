"use client";

interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      className="toggle-wrapper"
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
    >
      <div className={`toggle-track ${checked ? 'toggle-track-on' : 'toggle-track-off'}`}>
        <div className={`toggle-thumb ${checked ? 'toggle-thumb-on' : 'toggle-thumb-off'}`} />
      </div>
    </button>
  );
}
