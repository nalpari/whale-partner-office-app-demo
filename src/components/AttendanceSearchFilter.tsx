"use client";

import { useState } from "react";

interface AttendanceSearchFilterProps {
  onSearch?: (filters: AttendanceSearchFilters) => void;
  onReset?: () => void;
  onClose?: () => void;
}

export interface AttendanceSearchFilters {
  headquarters: string;
  franchise: string;
  store: string;
  workStatus: string;
  employeeName: string;
  workDay: "weekday" | "saturday" | "holiday" | "";
  employeeClassification: string;
  contractType: string;
}

export default function AttendanceSearchFilter({
  onSearch,
  onReset,
  onClose,
}: AttendanceSearchFilterProps) {
  const [filters, setFilters] = useState<AttendanceSearchFilters>({
    headquarters: "",
    franchise: "",
    store: "",
    workStatus: "",
    employeeName: "",
    workDay: "",
    employeeClassification: "",
    contractType: "",
  });

  const handleReset = () => {
    const resetFilters: AttendanceSearchFilters = {
      headquarters: "",
      franchise: "",
      store: "",
      workStatus: "",
      employeeName: "",
      workDay: "",
      employeeClassification: "",
      contractType: "",
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

  const handleWorkDayChange = (day: "weekday" | "saturday" | "holiday") => {
    setFilters({ ...filters, workDay: filters.workDay === day ? "" : day });
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
            {filters.headquarters || "주식회사 마름인"}
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
            {filters.franchise || "을지로3가"}
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
            {filters.store || "을지로3가"}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Row 2: 근무여부, 직원명, 근무요일 */}
      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">근무여부</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.workStatus || "근무"}
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
            placeholder="홍길동"
          />
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">근무요일</span>
        </div>
        <div className="filter-toggle-group">
          <button
            type="button"
            className={`filter-toggle-btn ${filters.workDay === "weekday" ? "filter-toggle-btn-active" : ""}`}
            onClick={() => handleWorkDayChange("weekday")}
          >
            평일
          </button>
          <button
            type="button"
            className={`filter-toggle-btn ${filters.workDay === "saturday" ? "filter-toggle-btn-active" : ""}`}
            onClick={() => handleWorkDayChange("saturday")}
          >
            토요일
          </button>
          <button
            type="button"
            className={`filter-toggle-btn ${filters.workDay === "holiday" ? "filter-toggle-btn-active" : ""}`}
            onClick={() => handleWorkDayChange("holiday")}
          >
            휴요일
          </button>
        </div>
      </div>

      {/* Row 3: 직원 분류, 계약 분류 */}
      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">직원 분류</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.employeeClassification || "본사 정직원"}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">계약 분류</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.contractType || "선택"}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
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
