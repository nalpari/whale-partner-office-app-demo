"use client";

interface InputProps {
  label?: string;
  type?: "text" | "number" | "email" | "tel" | "password";
  value?: string | number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  suffix?: string;
  tooltip?: boolean;
  onChange?: (value: string) => void;
}

export default function Input({
  label,
  type = "text",
  value = "",
  placeholder,
  required = false,
  disabled = false,
  error,
  suffix,
  tooltip = false,
  onChange,
}: InputProps) {
  return (
    <div className="form-field-row">
      {label && (
        <div className="form-field-label">
          <span className="form-field-label-text">{label} </span>
          {required && <span className="form-field-label-required">*</span>}
        </div>
      )}
      <div className="form-field-input-wrapper">
        <div className={disabled ? "input-field-disabled" : error ? "input-field-error" : "input-field"}>
          <input
            type={type}
            className="input-native"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
          />
          {suffix && <span className="input-suffix">{suffix}</span>}
        </div>
        {tooltip && (
          <div className="form-field-tooltip">
            <div className="form-field-tooltip-icon">
              <span className="form-field-tooltip-text">!</span>
            </div>
          </div>
        )}
      </div>
      {error && <div className="input-error-message">{error}</div>}
    </div>
  );
}
