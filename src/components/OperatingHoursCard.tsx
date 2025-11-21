"use client";

import { useState } from "react";
import OperatingHours from "./OperatingHours";

export default function OperatingHoursCard() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="operating-hours-card-wrapper">
      <div className="operating-hours-card-header">
        <div className="operating-hours-card-title-wrapper">
          <div className="operating-hours-card-title">운영 시간 정보</div>
          <button
            className="operating-hours-card-toggle"
            onClick={() => setIsOpen(!isOpen)}
            type="button"
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-inside-2" fill="white">
                <path d="M0 0H38C41.3137 0 44 2.68629 44 6V44H0V0Z"/>
              </mask>
              <path d="M0 0H38C41.3137 0 44 2.68629 44 6V44H0V0Z" fill="#474F5C"/>
              <path d="M0 0H44H0ZM44 44H0H44ZM-1 44V0H1V44H-1ZM44 0V44V0Z" fill="#69727F" mask="url(#path-1-inside-2)"/>
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
            <OperatingHours title="평일 오픈 시간" hasBreakTime={true} defaultOperating={true} defaultBreakTime={true} />
            <OperatingHours title="토요일 오픈 시간" hasBreakTime={true} defaultOperating={true} defaultBreakTime={true} />
            <OperatingHours title="일요일 오픈 시간" hasBreakTime={true} defaultOperating={true} defaultBreakTime={true} />
            
            <div className="holiday-section">
              <div className="holiday-label">정기 휴일</div>
              <button type="button" className="holiday-btn">
                <div className="holiday-btn-text">휴일관리로 이동</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
