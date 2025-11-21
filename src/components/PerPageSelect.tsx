"use client";

import { useState } from "react";

interface PerPageSelectProps {
  value: number;
  onChange?: (value: number) => void;
}

export default function PerPageSelect({ value, onChange }: PerPageSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="per-page-select">
      <div className="per-page-value">{value}</div>
      <button 
        className="per-page-toggle"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
