"use client";

import { useState } from "react";

interface TimePickerProps {
  startPeriod?: "오전" | "오후";
  startHour?: number;
  startMinute?: number;
  endPeriod?: "오전" | "오후";
  endHour?: number;
  endMinute?: number;
  onTimeChange?: (
    startPeriod: "오전" | "오후",
    startHour: number,
    startMinute: number,
    endPeriod: "오전" | "오후",
    endHour: number,
    endMinute: number
  ) => void;
}

export default function TimePicker({
  startPeriod = "오후",
  startHour = 4,
  startMinute = 30,
  endPeriod = "오후",
  endHour = 5,
  endMinute = 30,
  onTimeChange,
}: TimePickerProps) {
  const [hour, setHour] = useState(6);
  const [minute, setMinute] = useState(30);

  const incrementHour = () => {
    setHour((prev) => (prev >= 12 ? 1 : prev + 1));
  };

  const decrementHour = () => {
    setHour((prev) => (prev <= 1 ? 12 : prev - 1));
  };

  const incrementMinute = () => {
    setMinute((prev) => (prev >= 59 ? 0 : prev + 1));
  };

  const decrementMinute = () => {
    setMinute((prev) => (prev <= 0 ? 59 : prev - 1));
  };

  const formatTime = (h: number, m: number) => {
    return `${h}   :   ${m.toString().padStart(2, "0")}`;
  };

  const getPrevTime = (h: number, m: number) => {
    if (h === 1 && m === 0) return { h: 12, m: 59 };
    if (m === 0) return { h: h - 1, m: 59 };
    return { h, m: m - 1 };
  };

  const getNextTime = (h: number, m: number) => {
    if (h === 12 && m === 59) return { h: 1, m: 0 };
    if (m === 59) return { h: h + 1, m: 0 };
    return { h, m: m + 1 };
  };

  const prevTime = getPrevTime(hour, minute);
  const nextTime = getNextTime(hour, minute);

  return (
    <div className="time-picker-wrapper">
      <div className="time-picker-controls-section">
        <div className="time-picker-nav-controls">
          <button type="button" className="time-nav-btn" onClick={incrementHour}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="27"
                height="27"
                rx="13.5"
                fill="white"
              />
              <rect
                x="0.5"
                y="0.5"
                width="27"
                height="27"
                rx="13.5"
                stroke="#EBEBEB"
              />
              <path
                d="M18 16L14 12L10 16"
                stroke="#CCCCCC"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button type="button" className="time-nav-btn" onClick={decrementHour}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="27"
                height="27"
                rx="13.5"
                fill="white"
              />
              <rect
                x="0.5"
                y="0.5"
                width="27"
                height="27"
                rx="13.5"
                stroke="#EBEBEB"
              />
              <path
                d="M18 12L14 16L10 12"
                stroke="#CCCCCC"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="time-picker-display-column">
          <div className="time-picker-value-inactive">
            {formatTime(prevTime.h, prevTime.m)}
          </div>
          <div className="time-picker-value-active">
            {formatTime(hour, minute)}
          </div>
          <div className="time-picker-value-inactive">
            {formatTime(nextTime.h, nextTime.m)}
          </div>
        </div>

        <div className="time-picker-nav-controls">
          <button type="button" className="time-nav-btn" onClick={incrementMinute}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="27"
                height="27"
                rx="13.5"
                fill="white"
              />
              <rect
                x="0.5"
                y="0.5"
                width="27"
                height="27"
                rx="13.5"
                stroke="#EBEBEB"
              />
              <path
                d="M18 16L14 12L10 16"
                stroke="#CCCCCC"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button type="button" className="time-nav-btn" onClick={decrementMinute}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="27"
                height="27"
                rx="13.5"
                fill="white"
              />
              <rect
                x="0.5"
                y="0.5"
                width="27"
                height="27"
                rx="13.5"
                stroke="#EBEBEB"
              />
              <path
                d="M18 12L14 16L10 12"
                stroke="#CCCCCC"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="time-picker-range-section">
        <div className="time-picker-range-box">
          <div className="time-picker-range-text">
            {startPeriod} {startHour}:{startMinute.toString().padStart(2, "0")}
          </div>
        </div>
        <div className="time-picker-range-label">부터</div>
        <div className="time-picker-range-box">
          <div className="time-picker-range-text">
            {endPeriod} {endHour}:{endMinute.toString().padStart(2, "0")}
          </div>
        </div>
        <div className="time-picker-range-label">까지</div>
      </div>
    </div>
  );
}
