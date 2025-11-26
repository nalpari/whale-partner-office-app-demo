"use client";

interface TextareaProps {
  label?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  tooltip?: boolean;
  onChange?: (value: string) => void;
}

export default function Textarea({
  label,
  value = "",
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  tooltip = false,
  onChange,
}: TextareaProps) {
  return (
    <div className="form-field-row">
      {label && (
        <div className="form-field-label">
          <span className="form-field-label-text">{label} </span>
          {required && <span className="form-field-label-required">*</span>}
        </div>
      )}
      <div className="form-field-input-wrapper">
        <div className={disabled ? "textarea-field-disabled" : "textarea-field"}>
          <textarea
            className="textarea-native"
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            onChange={(e) => onChange?.(e.target.value)}
          />
        </div>
        {tooltip && (
          <div className="form-field-tooltip">
            <div className="form-field-tooltip-icon">
              <span className="form-field-tooltip-text">!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
