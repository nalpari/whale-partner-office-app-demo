"use client";

interface StoreSelectProps {
  value: string;
  onChange?: (value: string) => void;
}

export default function StoreSelect({ value, onChange }: StoreSelectProps) {
  return (
    <div className="store-select-wrapper">
      <div className="store-select-container">
        <div className="store-select-label">{value}</div>
        <button className="store-select-button" type="button">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="white"/>
            <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#EBEBEB"/>
            <path d="M21 13.5L16 18.5L11 13.5" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
