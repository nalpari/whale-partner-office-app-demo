"use client";

import { useState } from "react";

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  label?: string;
  options: CheckboxOption[];
  values?: string[];
  required?: boolean;
  tooltip?: boolean;
  onChange?: (values: string[]) => void;
}

export default function CheckboxGroup({
  label,
  options,
  values = [],
  required = false,
  tooltip = false,
  onChange,
}: CheckboxGroupProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(values);

  const handleChange = (value: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  return (
    <div className="form-field-row">
      {label && (
        <div className="form-field-label">
          <span className="form-field-label-text">{label} </span>
          {required && <span className="form-field-label-required">*</span>}
        </div>
      )}
      <div className="form-field-input-wrapper">
        <div className="checkbox-group-container">
          {options.map((option) => {
            const isChecked = selectedValues.includes(option.value);
            return (
              <label key={option.value} className="checkbox-container">
                <div className="checkbox-wrapper">
                  <div className={isChecked ? "checkbox-visual-checked" : "checkbox-visual"}>
                    {isChecked && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
                <span className={isChecked ? "checkbox-label-active" : "checkbox-label"}>
                  {option.label}
                </span>
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={isChecked}
                  onChange={(e) => handleChange(option.value, e.target.checked)}
                />
              </label>
            );
          })}
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
