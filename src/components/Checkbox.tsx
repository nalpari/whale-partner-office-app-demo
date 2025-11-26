"use client";

interface CheckboxProps {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Checkbox({
  label,
  checked = false,
  disabled = false,
  onChange,
}: CheckboxProps) {
  return (
    <label className={`checkbox-container ${disabled ? "checkbox-disabled" : ""}`}>
      <div className="checkbox-wrapper">
        <div className={checked ? "checkbox-visual-checked" : "checkbox-visual"}>
          {checked && (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
      <span className={checked ? "checkbox-label-active" : "checkbox-label"}>{label}</span>
      <input
        type="checkbox"
        className="checkbox-input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </label>
  );
}
