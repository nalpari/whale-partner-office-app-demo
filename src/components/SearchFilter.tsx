"use client";

import { useState } from "react";

export default function SearchFilter() {
  const [selectedCompany, setSelectedCompany] = useState("주식회사 따름인");
  const [templateName, setTemplateName] = useState("표준 가맹 계약서");
  const [operationStatus, setOperationStatus] = useState("all");
  const [startDate, setStartDate] = useState("2025.05.08");
  const [endDate, setEndDate] = useState("2025.05.16");

  const handleReset = () => {
    setSelectedCompany("");
    setTemplateName("");
    setOperationStatus("all");
    setStartDate("");
    setEndDate("");
  };

  const handleSearch = () => {
    console.log("검색");
  };

  return (
    <div className="search-filter">
      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">본사</span>
          <span className="filter-label-required">*</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">{selectedCompany}</div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">계약서 템플릿명</span>
        </div>
        <div className="filter-input">
          <input 
            type="text" 
            value={templateName} 
            onChange={(e) => setTemplateName(e.target.value)}
            className="filter-input-field"
          />
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">운영여부</span>
        </div>
        <div className="filter-radio-group">
          <label className="filter-radio-item">
            <div className="radio-button">
              <input
                type="radio"
                name="operationStatus"
                value="all"
                checked={operationStatus === "all"}
                onChange={(e) => setOperationStatus(e.target.value)}
                className="radio-input"
              />
              <div className={`radio-visual ${operationStatus === "all" ? "radio-visual-checked" : ""}`}>
                {operationStatus === "all" && <div className="radio-dot" />}
              </div>
            </div>
            <span className={`radio-label ${operationStatus === "all" ? "radio-label-active" : ""}`}>전체</span>
          </label>
          <label className="filter-radio-item">
            <div className="radio-button">
              <input
                type="radio"
                name="operationStatus"
                value="operating"
                checked={operationStatus === "operating"}
                onChange={(e) => setOperationStatus(e.target.value)}
                className="radio-input"
              />
              <div className={`radio-visual ${operationStatus === "operating" ? "radio-visual-checked" : ""}`}>
                {operationStatus === "operating" && <div className="radio-dot" />}
              </div>
            </div>
            <span className={`radio-label ${operationStatus === "operating" ? "radio-label-active" : ""}`}>운영</span>
          </label>
          <label className="filter-radio-item">
            <div className="radio-button">
              <input
                type="radio"
                name="operationStatus"
                value="not-operating"
                checked={operationStatus === "not-operating"}
                onChange={(e) => setOperationStatus(e.target.value)}
                className="radio-input"
              />
              <div className={`radio-visual ${operationStatus === "not-operating" ? "radio-visual-checked" : ""}`}>
                {operationStatus === "not-operating" && <div className="radio-dot" />}
              </div>
            </div>
            <span className={`radio-label ${operationStatus === "not-operating" ? "radio-label-active" : ""}`}>미운영</span>
          </label>
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">등록일</span>
        </div>
        <div className="filter-date-group">
          <button className="filter-input-date" type="button">
            <div className="filter-input-text">{startDate}</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.66667 4.5V7.83333M16.3333 4.5V7.83333M5.5 11.1667H20.5M9.66667 14.5H9.675M13 14.5H13.0083M16.3333 14.5H16.3417M9.66667 17.8333H9.675M13 17.8333H13.0083M16.3333 17.8333H16.3417M7.16667 6.16667H18.8333C19.7538 6.16667 20.5 6.91286 20.5 7.83333V19.5C20.5 20.4205 19.7538 21.1667 18.8333 21.1667H7.16667C6.24619 21.1667 5.5 20.4205 5.5 19.5V7.83333C5.5 6.91286 6.24619 6.16667 7.16667 6.16667Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="filter-input-date" type="button">
            <div className="filter-input-text">{endDate}</div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.66667 4.5V7.83333M16.3333 4.5V7.83333M5.5 11.1667H20.5M9.66667 14.5H9.675M13 14.5H13.0083M16.3333 14.5H16.3417M9.66667 17.8333H9.675M13 17.8333H13.0083M16.3333 17.8333H16.3417M7.16667 6.16667H18.8333C19.7538 6.16667 20.5 6.91286 20.5 7.83333V19.5C20.5 20.4205 19.7538 21.1667 18.8333 21.1667H7.16667C6.24619 21.1667 5.5 20.4205 5.5 19.5V7.83333C5.5 6.91286 6.24619 6.16667 7.16667 6.16667Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="filter-actions">
        <div className="filter-actions-buttons">
          <button className="filter-btn-gray" type="button">
            닫기
          </button>
          <button className="filter-btn-gray" type="button" onClick={handleReset}>
            초기화
          </button>
          <button className="filter-btn-primary" type="button" onClick={handleSearch}>
            검색
          </button>
        </div>
      </div>
    </div>
  );
}
