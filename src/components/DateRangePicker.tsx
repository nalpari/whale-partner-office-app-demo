"use client";

import { useState } from "react";

interface DateRangePickerProps {
  label?: string;
  startDate?: string;
  endDate?: string;
  hasNoEndDate?: boolean;
  required?: boolean;
  tooltip?: boolean;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  onNoEndDateChange?: (checked: boolean) => void;
}

export default function DateRangePicker({
  label,
  startDate = "",
  endDate = "",
  hasNoEndDate = false,
  required = false,
  tooltip = false,
  onStartDateChange,
  onEndDateChange,
  onNoEndDateChange,
}: DateRangePickerProps) {
  const [noEndDate, setNoEndDate] = useState(hasNoEndDate);

  const handleNoEndDateChange = (checked: boolean) => {
    setNoEndDate(checked);
    onNoEndDateChange?.(checked);
    if (checked) {
      onEndDateChange?.("");
    }
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
        <div className="date-range-container">
          <div className="input-field">
            <input
              type="date"
              className="datepicker-native"
              value={startDate}
              onChange={(e) => onStartDateChange?.(e.target.value)}
            />
            <svg
              className="form-field-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.66667 4.5V7.83333M16.3333 4.5V7.83333M5.5 11.1667H20.5M9.66667 14.5H9.675M13 14.5H13.0083M16.3333 14.5H16.3417M9.66667 17.8333H9.675M13 17.8333H13.0083M16.3333 17.8333H16.3417M7.16667 6.16667H18.8333C19.7538 6.16667 20.5 6.91286 20.5 7.83333V19.5C20.5 20.4205 19.7538 21.1667 18.8333 21.1667H7.16667C6.24619 21.1667 5.5 20.4205 5.5 19.5V7.83333C5.5 6.91286 6.24619 6.16667 7.16667 6.16667Z"
                stroke="#999999"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="date-range-separator">~</span>
          {!noEndDate ? (
            <div className="input-field">
              <input
                type="date"
                className="datepicker-native"
                value={endDate}
                onChange={(e) => onEndDateChange?.(e.target.value)}
              />
              <svg
                className="form-field-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.66667 4.5V7.83333M16.3333 4.5V7.83333M5.5 11.1667H20.5M9.66667 14.5H9.675M13 14.5H13.0083M16.3333 14.5H16.3417M9.66667 17.8333H9.675M13 17.8333H13.0083M16.3333 17.8333H16.3417M7.16667 6.16667H18.8333C19.7538 6.16667 20.5 6.91286 20.5 7.83333V19.5C20.5 20.4205 19.7538 21.1667 18.8333 21.1667H7.16667C6.24619 21.1667 5.5 20.4205 5.5 19.5V7.83333C5.5 6.91286 6.24619 6.16667 7.16667 6.16667Z"
                  stroke="#999999"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <div className="date-range-no-end">종료일 없음</div>
          )}
          <label className="checkbox-container checkbox-inline">
            <div className="checkbox-wrapper">
              <div className={noEndDate ? "checkbox-visual-checked" : "checkbox-visual"}>
                {noEndDate && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
            <span className={noEndDate ? "checkbox-label-active" : "checkbox-label"}>종료일 없음</span>
            <input
              type="checkbox"
              className="checkbox-input"
              checked={noEndDate}
              onChange={(e) => handleNoEndDateChange(e.target.checked)}
            />
          </label>
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
