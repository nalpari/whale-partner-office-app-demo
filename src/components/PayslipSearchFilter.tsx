"use client";

import { useState } from "react";

interface PayslipSearchFilterProps {
  onSearch?: (filters: PayslipSearchFilters) => void;
  onReset?: () => void;
  onClose?: () => void;
}

export interface PayslipSearchFilters {
  headquarters: string;
  franchise: string;
  store: string;
  workStatus: string;
  employeeName: string;
  employeeClassification: string;
  payDateStart: string;
  payDateEnd: string;
}

export default function PayslipSearchFilter({
  onSearch,
  onReset,
  onClose,
}: PayslipSearchFilterProps) {
  const [filters, setFilters] = useState<PayslipSearchFilters>({
    headquarters: "",
    franchise: "",
    store: "",
    workStatus: "",
    employeeName: "",
    employeeClassification: "",
    payDateStart: "",
    payDateEnd: "",
  });

  const handleReset = () => {
    const resetFilters: PayslipSearchFilters = {
      headquarters: "",
      franchise: "",
      store: "",
      workStatus: "",
      employeeName: "",
      employeeClassification: "",
      payDateStart: "",
      payDateEnd: "",
    };
    setFilters(resetFilters);
    onReset?.();
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className="search-filter">
      {/* Row 1: 본사, 가맹점, 점포 */}
      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">본사</span><span className="filter-label-required"> *</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.headquarters || "선택"}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">가맹점</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.franchise || "선택"}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">점포</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.store || "선택"}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Row 2: 근무여부, 직원명, 직원 분류 */}
      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">근무여부</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.workStatus || "선택"}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">직원명</span>
        </div>
        <div className="filter-input">
          <input
            type="text"
            value={filters.employeeName}
            onChange={(e) =>
              setFilters({ ...filters, employeeName: e.target.value })
            }
            className="filter-input-field"
            placeholder=""
          />
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">직원 분류</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.employeeClassification || "선택"}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Row 3: 급여일 */}
      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">급여일</span>
        </div>
        <div className="filter-date-group">
          <button className="filter-input-date" type="button">
            <div className="filter-input-text">
              {filters.payDateStart || "날짜 선택"}
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.66667 4.5V7.83333M16.3333 4.5V7.83333M5.5 11.1667H20.5M9.66667 14.5H9.675M13 14.5H13.0083M16.3333 14.5H16.3417M9.66667 17.8333H9.675M13 17.8333H13.0083M16.3333 17.8333H16.3417M7.16667 6.16667H18.8333C19.7538 6.16667 20.5 6.91286 20.5 7.83333V19.5C20.5 20.4205 19.7538 21.1667 18.8333 21.1667H7.16667C6.24619 21.1667 5.5 20.4205 5.5 19.5V7.83333C5.5 6.91286 6.24619 6.16667 7.16667 6.16667Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="filter-input-date" type="button">
            <div className="filter-input-text">
              {filters.payDateEnd || "날짜 선택"}
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.66667 4.5V7.83333M16.3333 4.5V7.83333M5.5 11.1667H20.5M9.66667 14.5H9.675M13 14.5H13.0083M16.3333 14.5H16.3417M9.66667 17.8333H9.675M13 17.8333H13.0083M16.3333 17.8333H16.3417M7.16667 6.16667H18.8333C19.7538 6.16667 20.5 6.91286 20.5 7.83333V19.5C20.5 20.4205 19.7538 21.1667 18.8333 21.1667H7.16667C6.24619 21.1667 5.5 20.4205 5.5 19.5V7.83333C5.5 6.91286 6.24619 6.16667 7.16667 6.16667Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="filter-actions">
        <div className="filter-actions-buttons">
          <button className="filter-btn-gray" type="button" onClick={handleClose}>
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
