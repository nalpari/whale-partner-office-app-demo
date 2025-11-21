"use client";

import { useState } from "react";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  required?: boolean;
  tooltip?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function RadioGroup({
  label,
  options,
  required = false,
  tooltip = false,
  defaultValue,
  onChange
}: RadioGroupProps) {
  const [selected, setSelected] = useState(defaultValue || options[0]?.value);

  const handleChange = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className="form-field-row">
      <div className="form-field-label">
        <span className="form-field-label-text">{label} </span>
        {required && <span className="form-field-label-required">*</span>}
      </div>
      <div className="form-field-input-wrapper">
        <div className="radio-group-container">
          {options.map((option) => (
            <label key={option.value} className="radio-group-item">
              <div className="radio-button-wrapper">
                <div className={selected === option.value ? "radio-visual-checked" : "radio-visual"}>
                  {selected === option.value && <div className="radio-dot"></div>}
                </div>
              </div>
              <div className={selected === option.value ? "radio-label-active" : "radio-label"}>
                {option.label}
              </div>
              <input
                type="radio"
                className="radio-input"
                value={option.value}
                checked={selected === option.value}
                onChange={() => handleChange(option.value)}
              />
            </label>
          ))}
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
