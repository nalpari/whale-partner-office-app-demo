"use client";

interface ServiceSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function ServiceSelect({ value = "서비스 바로가기", onChange }: ServiceSelectProps) {
  return (
    <div className="service-section">
      <div className="service-select" onClick={() => onChange?.(value)}>
        <div className="service-select-text">{value}</div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 10L12 15L7 10"
            stroke="#282F37"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
