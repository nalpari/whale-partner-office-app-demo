"use client";

import { useState, ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  actionButton?: ReactNode;
}

export default function FormSection({
  title,
  children,
  collapsible = true,
  defaultOpen = true,
  actionButton,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="form-section-title-wrapper">
          <div className="form-section-title">{title}</div>
          {collapsible && (
            <button
              className="form-section-toggle"
              onClick={() => setIsOpen(!isOpen)}
              type="button"
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block" }}
              >
                <rect
                  x="0"
                  y="0"
                  width="44"
                  height="44"
                  rx="0"
                  ry="6"
                  fill="#474F5C"
                />
                <rect
                  x="0"
                  y="0"
                  width="1"
                  height="44"
                  fill="#69727F"
                />
                <path
                  d="M17 24.5L22 19.5L27 24.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: isOpen ? "none" : "rotate(180deg)",
                    transformOrigin: "center",
                    transition: "transform 0.2s",
                  }}
                />
              </svg>
            </button>
          )}
        </div>
        {isOpen && actionButton && (
          <div className="form-section-actions">{actionButton}</div>
        )}
      </div>
      {isOpen && (
        <div className="form-section-body">
          <div className="form-section-content">{children}</div>
        </div>
      )}
    </div>
  );
}
