"use client";

interface RadioProps {
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
}

export default function Radio({ label, checked, onChange, name }: RadioProps) {
  return (
    <label className="radio-item">
      <div className="radio-button">
        <input
          type="radio"
          className="radio-input"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          name={name}
        />
        <div className={`radio-visual ${checked ? 'radio-visual-checked' : ''}`}>
          {checked && <div className="radio-dot" />}
        </div>
      </div>
      <span className={`radio-label ${checked ? 'radio-label-active' : ''}`}>
        {label}
      </span>
    </label>
  );
}
