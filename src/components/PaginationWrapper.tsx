"use client";

import Pagination from "./Pagination";

interface PaginationWrapperProps {
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

/**
 * 페이징을 위한 공통 래퍼 컴포넌트
 * pagination-wrapper와 Pagination 컴포넌트를 함께 제공합니다.
 */
export default function PaginationWrapper({
  totalPages,
  currentPage,
  onPageChange,
  className = "",
}: PaginationWrapperProps) {
  // totalPages가 0이면 렌더링하지 않음
  if (totalPages === 0) {
    return null;
  }

  return (
    <div className={`pagination-wrapper ${className}`}>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}

