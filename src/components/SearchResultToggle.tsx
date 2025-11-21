"use client";

import { useState } from "react";
import SearchFilter from "./SearchFilter";

interface SearchResultToggleProps {
  count: number;
}

export default function SearchResultToggle({ count }: SearchResultToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="search-result-toggle">
      <div className="search-result-header">
        <div className="search-result-info">
          <div className="flex items-center gap-3">
            <div className="search-result-label">검색결과</div>
            <div className="search-result-count">{count}건</div>
          </div>
          <div className="search-result-actions ml-auto">
            <button
              className={`search-result-toggle-btn transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              type="button"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="white"/>
                <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#EBEBEB"/>
                <path d="M11 13.5L16 18.5L21 13.5" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isExpanded && <SearchFilter />}
    </div>
  );
}
