"use client";

import { useState } from "react";

interface EmployeeSearchFilterProps {
  onSearch?: (filters: EmployeeSearchFilters) => void;
  onReset?: () => void;
  onClose?: () => void;
}

export interface EmployeeSearchFilters {
  headquarters: string;
  franchise: string;
  store: string;
  employmentStatus: string;
  employeeName: string;
  employeeClassification: string;
  contractClassification: string;
  adminPermission: string;
  membershipStatus: string;
  hireDateStart: string;
  hireDateEnd: string;
  healthCheckExpiryStart: string;
  healthCheckExpiryEnd: string;
}

export default function EmployeeSearchFilter({
  onSearch,
  onReset,
  onClose,
}: EmployeeSearchFilterProps) {
  const [filters, setFilters] = useState<EmployeeSearchFilters>({
    headquarters: "주식회사 따름인",
    franchise: "을지로3가",
    store: "",
    employmentStatus: "근무",
    employeeName: "홍길동",
    employeeClassification: "본사 정직원",
    contractClassification: "",
    adminPermission: "",
    membershipStatus: "",
    hireDateStart: "2020/05/05",
    hireDateEnd: "2020/05/05",
    healthCheckExpiryStart: "2020/05/05",
    healthCheckExpiryEnd: "2020/05/05",
  });

  const handleReset = () => {
    const resetFilters: EmployeeSearchFilters = {
      headquarters: "",
      franchise: "",
      store: "",
      employmentStatus: "",
      employeeName: "",
      employeeClassification: "",
      contractClassification: "",
      adminPermission: "",
      membershipStatus: "",
      hireDateStart: "",
      hireDateEnd: "",
      healthCheckExpiryStart: "",
      healthCheckExpiryEnd: "",
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
      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">본사</span>
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

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">근무여부</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.employmentStatus || "선택"}
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

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">계약 분류</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.contractClassification || "선택"}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">관리자 권한</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.adminPermission || "선택"}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">직원 회원 상태</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.membershipStatus || "선택"}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">입사일</span>
        </div>
        <div className="filter-date-group">
          <button className="filter-input-date" type="button">
            <div className="filter-input-text">
              {filters.hireDateStart || "날짜 선택"}
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.66667 4.5V7.83333M16.3333 4.5V7.83333M5.5 11.1667H20.5M9.66667 14.5H9.675M13 14.5H13.0083M16.3333 14.5H16.3417M9.66667 17.8333H9.675M13 17.8333H13.0083M16.3333 17.8333H16.3417M7.16667 6.16667H18.8333C19.7538 6.16667 20.5 6.91286 20.5 7.83333V19.5C20.5 20.4205 19.7538 21.1667 18.8333 21.1667H7.16667C6.24619 21.1667 5.5 20.4205 5.5 19.5V7.83333C5.5 6.91286 6.24619 6.16667 7.16667 6.16667Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="filter-input-date" type="button">
            <div className="filter-input-text">
              {filters.hireDateEnd || "날짜 선택"}
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.66667 4.5V7.83333M16.3333 4.5V7.83333M5.5 11.1667H20.5M9.66667 14.5H9.675M13 14.5H13.0083M16.3333 14.5H16.3417M9.66667 17.8333H9.675M13 17.8333H13.0083M16.3333 17.8333H16.3417M7.16667 6.16667H18.8333C19.7538 6.16667 20.5 6.91286 20.5 7.83333V19.5C20.5 20.4205 19.7538 21.1667 18.8333 21.1667H7.16667C6.24619 21.1667 5.5 20.4205 5.5 19.5V7.83333C5.5 6.91286 6.24619 6.16667 7.16667 6.16667Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">건강진단 만료일</span>
        </div>
        <div className="filter-date-group">
          <button className="filter-input-date" type="button">
            <div className="filter-input-text">
              {filters.healthCheckExpiryStart || "날짜 선택"}
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.66667 4.5V7.83333M16.3333 4.5V7.83333M5.5 11.1667H20.5M9.66667 14.5H9.675M13 14.5H13.0083M16.3333 14.5H16.3417M9.66667 17.8333H9.675M13 17.8333H13.0083M16.3333 17.8333H16.3417M7.16667 6.16667H18.8333C19.7538 6.16667 20.5 6.91286 20.5 7.83333V19.5C20.5 20.4205 19.7538 21.1667 18.8333 21.1667H7.16667C6.24619 21.1667 5.5 20.4205 5.5 19.5V7.83333C5.5 6.91286 6.24619 6.16667 7.16667 6.16667Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="filter-input-date" type="button">
            <div className="filter-input-text">
              {filters.healthCheckExpiryEnd || "날짜 선택"}
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

