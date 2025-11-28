"use client";

import { useState } from "react";

interface BusinessPartnerSearchFilterProps {
  onSearch?: (filters: BusinessPartnerSearchFilters) => void;
  onReset?: () => void;
  onClose?: () => void;
}

export interface BusinessPartnerSearchFilters {
  headquarters: string;
  franchise: string;
  representativeName: string;
  operationStatus: string;
  serviceType: string;
  startDate: string;
  endDate: string;
}

export default function BusinessPartnerSearchFilter({
  onSearch,
  onReset,
  onClose,
}: BusinessPartnerSearchFilterProps) {
  const [filters, setFilters] = useState<BusinessPartnerSearchFilters>({
    headquarters: "",
    franchise: "",
    representativeName: "",
    operationStatus: "",
    serviceType: "",
    startDate: "",
    endDate: "",
  });

  const handleReset = () => {
    const resetFilters: BusinessPartnerSearchFilters = {
      headquarters: "",
      franchise: "",
      representativeName: "",
      operationStatus: "",
      serviceType: "",
      startDate: "",
      endDate: "",
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
          <span className="filter-label-text">대표자명</span>
        </div>
        <div className="filter-input">
          <input
            type="text"
            value={filters.representativeName}
            onChange={(e) =>
              setFilters({ ...filters, representativeName: e.target.value })
            }
            className="filter-input-field"
            placeholder=""
          />
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">운영여부</span>
        </div>
        <div className="filter-button-group">
          <button
            className={`filter-button ${filters.operationStatus === '' ? 'filter-button-active' : ''}`}
            type="button"
            onClick={() => setFilters({ ...filters, operationStatus: '' })}
          >
            전체
          </button>
          <button
            className={`filter-button ${filters.operationStatus === 'CONSULTING' ? 'filter-button-active' : ''}`}
            type="button"
            onClick={() => setFilters({ ...filters, operationStatus: 'CONSULTING' })}
          >
            상담중
          </button>
          <button
            className={`filter-button ${filters.operationStatus === 'OPERATING' ? 'filter-button-active' : ''}`}
            type="button"
            onClick={() => setFilters({ ...filters, operationStatus: 'OPERATING' })}
          >
            운영
          </button>
          <button
            className={`filter-button ${filters.operationStatus === 'TERMINATED' ? 'filter-button-active' : ''}`}
            type="button"
            onClick={() => setFilters({ ...filters, operationStatus: 'TERMINATED' })}
          >
            종료
          </button>
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">서비스</span>
        </div>
        <button className="filter-input-select" type="button">
          <div className="filter-input-text">
            {filters.serviceType || "전체"}
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="filter-row">
        <div className="filter-label">
          <span className="filter-label-text">등록일</span>
        </div>
        <div className="filter-date-group">
          <button className="filter-input-date" type="button">
            <div className="filter-input-text">
              {filters.startDate || "날짜 선택"}
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.66667 4.5V7.83333M16.3333 4.5V7.83333M5.5 11.1667H20.5M9.66667 14.5H9.675M13 14.5H13.0083M16.3333 14.5H16.3417M9.66667 17.8333H9.675M13 17.8333H13.0083M16.3333 17.8333H16.3417M7.16667 6.16667H18.8333C19.7538 6.16667 20.5 6.91286 20.5 7.83333V19.5C20.5 20.4205 19.7538 21.1667 18.8333 21.1667H7.16667C6.24619 21.1667 5.5 20.4205 5.5 19.5V7.83333C5.5 6.91286 6.24619 6.16667 7.16667 6.16667Z" stroke="#999999" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="filter-input-date" type="button">
            <div className="filter-input-text">
              {filters.endDate || "날짜 선택"}
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
