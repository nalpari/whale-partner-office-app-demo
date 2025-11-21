"use client";

import { useState } from "react";

interface CardAction {
  label: string;
  onClick?: () => void;
}

interface DataRow {
  label: string;
  values: string[];
}

interface CollapsibleCardProps {
  title: string;
  actions: CardAction[];
  data: DataRow[];
  defaultOpen?: boolean;
}

export default function CollapsibleCard({
  title,
  actions,
  data,
  defaultOpen = true,
}: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="collapsible-card">
      <div className="collapsible-card-header">
        <div className="collapsible-card-title-wrapper">
          <div className="collapsible-card-title">{title}</div>
          <button
            className="collapsible-card-toggle"
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
        </div>
        {isOpen && (
          <div className="collapsible-card-actions">
            <div className="collapsible-card-actions-wrapper">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className={
                    index === actions.length - 1
                      ? "collapsible-card-action-last"
                      : "collapsible-card-action"
                  }
                  onClick={action.onClick}
                  type="button"
                >
                  <div className="collapsible-card-action-label">
                    {action.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="collapsible-card-body">
          <div className="collapsible-card-rows">
            {data.map((row, index) => (
              <div
                key={index}
                className={
                  index === 0
                    ? "collapsible-card-row-first"
                    : index === data.length - 1
                    ? "collapsible-card-row-last"
                    : "collapsible-card-row"
                }
              >
                <div className="collapsible-card-row-label">{row.label}</div>
                <div className="collapsible-card-row-values">
                  {row.values.map((value, valueIndex) => (
                    <div key={valueIndex} className="collapsible-card-row-value">
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
