"use client";

import { useState } from "react";
import ContractWorkingHours from "./ContractWorkingHours";
import DatePicker from "./DatePicker";

interface WeekdaysState {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
}

interface WeekdayToggleProps {
  days: WeekdaysState;
  onChange: (days: WeekdaysState) => void;
}

type ScheduleType = "every" | "biweekly";

interface BiweeklyScheduleSelectorProps {
  value: ScheduleType;
  onChange: (value: ScheduleType) => void;
  dayType: "saturday" | "sunday";
}

function BiweeklyScheduleSelector({
  value,
  onChange,
  dayType,
}: BiweeklyScheduleSelectorProps) {
  const dayLabel = dayType === "saturday" ? "토요일" : "일요일";
  const options: { key: ScheduleType; label: string }[] = [
    { key: "every", label: `매주 ${dayLabel}` },
    { key: "biweekly", label: `${dayLabel} 격주` },
  ];

  return (
    <div className="biweekly-schedule-container">
      <div className="biweekly-schedule-options">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`biweekly-schedule-btn ${value === option.key ? "biweekly-schedule-btn-active" : ""}`}
            onClick={() => onChange(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface FirstWorkdaySelectorProps {
  value: string;
  onChange: (date: string) => void;
}

function FirstWorkdaySelector({ value, onChange }: FirstWorkdaySelectorProps) {
  return (
    <div className="first-workday-container">
      <DatePicker
        value={value}
        placeholder="날짜 선택"
        onChange={onChange}
      />
      <div className="first-workday-hint-text">
        ※ 설정한 날짜를 격주 근무 시작일로 인식합니다.
      </div>
    </div>
  );
}

function WeekdayToggle({ days, onChange }: WeekdayToggleProps) {
  const weekdays: { key: keyof WeekdaysState; label: string }[] = [
    { key: "mon", label: "월" },
    { key: "tue", label: "화" },
    { key: "wed", label: "수" },
    { key: "thu", label: "목" },
    { key: "fri", label: "금" },
  ];

  const handleToggle = (key: keyof WeekdaysState) => {
    onChange({ ...days, [key]: !days[key] });
  };

  return (
    <div className="weekday-toggle-container">
      {weekdays.map((day) => (
        <button
          key={day.key}
          type="button"
          className={`weekday-toggle-btn ${days[day.key] ? "weekday-toggle-btn-active" : ""}`}
          onClick={() => handleToggle(day.key)}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
}

export default function ContractWorkingHoursCard() {
  const [isOpen, setIsOpen] = useState(true);
  const [weekdays, setWeekdays] = useState({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
  });
  const [saturdaySchedule, setSaturdaySchedule] = useState<ScheduleType>("every");
  const [saturdayFirstWorkDate, setSaturdayFirstWorkDate] = useState("");
  const [sundaySchedule, setSundaySchedule] = useState<ScheduleType>("every");
  const [sundayFirstWorkDate, setSundayFirstWorkDate] = useState("");

  return (
    <div className="operating-hours-card-wrapper">
      <div className="operating-hours-card-header">
        <div className="operating-hours-card-title-wrapper">
          <div className="operating-hours-card-title">계약 근무 시간</div>
          <button
            className="operating-hours-card-toggle"
            onClick={() => setIsOpen(!isOpen)}
            type="button"
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-inside-contract" fill="white">
                <path d="M0 0H38C41.3137 0 44 2.68629 44 6V44H0V0Z"/>
              </mask>
              <path d="M0 0H38C41.3137 0 44 2.68629 44 6V44H0V0Z" fill="#474F5C"/>
              <path d="M0 0H44H0ZM44 44H0H44ZM-1 44V0H1V44H-1ZM44 0V44V0Z" fill="#69727F" mask="url(#path-1-inside-contract)"/>
              <path
                d="M17 24.5L22 19.5L27 24.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isOpen ? "none" : "rotate(180deg)",
                  transformOrigin: "center",
                  transition: "transform 0.2s",
                }}
              />
            </svg>
          </button>
        </div>
        {isOpen && (
          <div className="operating-hours-card-actions">
            <button className="operating-hours-card-save-btn" type="button">
              <div className="operating-hours-card-save-label">저장</div>
            </button>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="operating-hours-card-body">
          <div className="operating-hours-content">
            <ContractWorkingHours
              title="평일 근무 시간"
              hasBreakTime={true}
              defaultOperating={true}
              defaultBreakTime={true}
              weekdaySelector={
                <div className="operating-hours-section weekday-section">
                  <div className="operating-hours-label">평일 근무 요일</div>
                  <div className="operating-hours-body">
                    <div className="weekday-toggle-wrapper">
                      <WeekdayToggle days={weekdays} onChange={setWeekdays} />
                    </div>
                  </div>
                </div>
              }
            />
            <ContractWorkingHours
              title="토요일 근무 시간"
              hasBreakTime={true}
              defaultOperating={false}
              defaultBreakTime={false}
              additionalSection={
                <>
                  <div className="operating-hours-section biweekly-section">
                    <div className="operating-hours-label">토요일 격주 근무 여부</div>
                    <div className="operating-hours-body">
                      <BiweeklyScheduleSelector
                        value={saturdaySchedule}
                        onChange={setSaturdaySchedule}
                        dayType="saturday"
                      />
                    </div>
                  </div>
                  <div className="operating-hours-section first-workday-section">
                    <div className="operating-hours-label">토요일 첫 근무일</div>
                    <div className="operating-hours-body">
                      <FirstWorkdaySelector
                        value={saturdayFirstWorkDate}
                        onChange={setSaturdayFirstWorkDate}
                      />
                    </div>
                  </div>
                </>
              }
            />
            <ContractWorkingHours
              title="일요일 근무 시간"
              hasBreakTime={true}
              defaultOperating={false}
              defaultBreakTime={false}
              additionalSection={
                <>
                  <div className="operating-hours-section biweekly-section">
                    <div className="operating-hours-label">일요일 격주 근무 여부</div>
                    <div className="operating-hours-body">
                      <BiweeklyScheduleSelector
                        value={sundaySchedule}
                        onChange={setSundaySchedule}
                        dayType="sunday"
                      />
                    </div>
                  </div>
                  <div className="operating-hours-section first-workday-section">
                    <div className="operating-hours-label">일요일 첫 근무일</div>
                    <div className="operating-hours-body">
                      <FirstWorkdaySelector
                        value={sundayFirstWorkDate}
                        onChange={setSundayFirstWorkDate}
                      />
                    </div>
                  </div>
                </>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
