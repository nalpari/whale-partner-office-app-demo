"use client";

import { useState } from "react";
import InfoTooltip from "./InfoTooltip";
import RadioGroup from "./RadioGroup";

export default function StoreInfoCard() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="store-info-card">
      <div className="store-info-card-header">
        <div className="store-info-card-title-wrapper">
          <div className="store-info-card-title">점포 Header 정보</div>
          <button
            className="store-info-card-toggle"
            onClick={() => setIsOpen(!isOpen)}
            type="button"
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-inside-1" fill="white">
                <path d="M0 0H38C41.3137 0 44 2.68629 44 6V44H0V0Z"/>
              </mask>
              <path d="M0 0H38C41.3137 0 44 2.68629 44 6V44H0V0Z" fill="#474F5C"/>
              <path d="M0 0H44H0ZM44 44H0H44ZM-1 44V0H1V44H-1ZM44 0V44V0Z" fill="#69727F" mask="url(#path-1-inside-1)"/>
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
          <div className="store-info-card-actions">
            <button className="store-info-card-save-btn" type="button">
              <div className="store-info-card-save-label">저장</div>
            </button>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="store-info-card-body">
          <div className="store-info-form">
            <div className="store-info-field">
              <div className="store-info-field-label">
                <span className="store-info-label-text">본사 선택 </span>
                <span className="store-info-label-required">*</span>
              </div>
              <div className="store-info-input-wrapper">
                <div className="store-info-input-select">
                  <div className="store-info-input-text">힘이나는 커피생활</div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="store-info-field">
              <div className="store-info-field-label">
                <span className="store-info-label-text">가맹점 선택 </span>
                <span className="store-info-label-required">*</span>
              </div>
              <div className="store-info-input-wrapper">
                <div className="store-info-input-select">
                  <div className="store-info-input-text">힘이나는 커피생활</div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <InfoTooltip />
              </div>
            </div>

            <div className="store-info-field">
              <div className="store-info-field-label">
                <span className="store-info-label-text">점포명 </span>
                <span className="store-info-label-required">*</span>
              </div>
              <div className="store-info-input-wrapper">
                <div className="store-info-input">
                  <div className="store-info-input-text">힘이나는커피생활  을지로3가점</div>
                </div>
              </div>
            </div>

            <div className="store-info-field-last">
              <div className="store-info-field-label">
                <span className="store-info-label-text">계약 상태 </span>
                <span className="store-info-label-required">*</span>
              </div>
              <div className="store-info-input-wrapper">
                <div className="store-info-radio-group">
                  <label className="store-info-radio-item">
                    <div className="store-radio-visual-checked">
                      <div className="store-radio-dot"></div>
                    </div>
                    <div className="store-radio-label-active">작성중</div>
                    <input type="radio" className="store-radio-input" defaultChecked />
                  </label>
                  <label className="store-info-radio-item">
                    <div className="store-radio-visual">
                    </div>
                    <div className="store-radio-label">진행중</div>
                    <input type="radio" className="store-radio-input" />
                  </label>
                  <label className="store-info-radio-item">
                    <div className="store-radio-visual">
                    </div>
                    <div className="store-radio-label">계약완료</div>
                    <input type="radio" className="store-radio-input" />
                  </label>
                </div>
                <InfoTooltip />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
