"use client";

import { useState } from "react";
import Radio from "./Radio";
import Badge from "./Badge";

interface MenuComponentItemProps {
  componentNumber: number;
  showDragHandle?: boolean;
}

export default function MenuComponentItem({ 
  componentNumber, 
  showDragHandle = true 
}: MenuComponentItemProps) {
  const [temperature, setTemperature] = useState("HOT");

  return (
    <div className="menu-component-list">
      <div className="menu-component-item">
        <div className="menu-component-header">
          <div className="menu-component-title">컴포넌트 메뉴 #{componentNumber}</div>
          {showDragHandle && (
            <div className="menu-component-drag">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.46973 11.1414C7.76257 10.8488 8.23743 10.8488 8.53027 11.1414C8.8231 11.4342 8.82298 11.9091 8.53027 12.202L6.53027 14.202C6.25567 14.4766 5.82095 14.494 5.52637 14.2537L5.46973 14.202L3.46973 12.202C3.17702 11.9091 3.17689 11.4342 3.46973 11.1414C3.76257 10.8488 4.23743 10.8488 4.53027 11.1414L6 12.6111L7.46973 11.1414ZM12 9.49786H2V7.99786H12V9.49786ZM10 6.49884H0V4.99884H10V6.49884ZM5.5957 0.117981C5.88214 -0.0656767 6.26532 -0.0347792 6.51953 0.209778L8.51953 2.13361C8.81789 2.42079 8.82716 2.8957 8.54004 3.19415C8.25299 3.49193 7.77882 3.50112 7.48047 3.21466L6 1.78888L4.51953 3.21466C4.22118 3.50112 3.74701 3.49193 3.45996 3.19415C3.17284 2.8957 3.18211 2.42079 3.48047 2.13361L5.48047 0.209778L5.5957 0.117981Z" fill="#4E637E"/>
              </svg>
            </div>
          )}
          <button className="menu-component-more" type="button">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="10" r="2" fill="#4F4F4F"/>
              <circle cx="16" cy="16" r="2" fill="#4F4F4F"/>
              <circle cx="16" cy="22" r="2" fill="#4F4F4F"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="menu-component-search">
        <button className="btn-search" type="button">메뉴 찿기</button>
        <div className="menu-component-input-disabled">
          <span className="menu-component-input-text">아이스아메리카노</span>
        </div>
      </div>

      <div className="menu-component-code">
        <span className="menu-component-code-text">SCM20251001</span>
        <Badge label="운영" variant="active" />
      </div>

      <div className="menu-component-field">
        <label className="menu-component-field-label">
          <span className="menu-component-field-label-text">수량</span>
          <span className="menu-component-field-label-required"> *</span>
        </label>
        <div className="menu-component-input">
          <input 
            type="text" 
            className="menu-component-input-field" 
            defaultValue="1" 
            style={{ textAlign: 'right' }}
          />
        </div>
      </div>

      <div className="menu-component-field">
        <label className="menu-component-field-label-text">온도분류</label>
        <div className="menu-component-radio-group">
          <Radio 
            label="HOT" 
            checked={temperature === "HOT"} 
            onChange={() => setTemperature("HOT")}
            name={`temperature-${componentNumber}`}
          />
          <Radio 
            label="COLD" 
            checked={temperature === "COLD"} 
            onChange={() => setTemperature("COLD")}
            name={`temperature-${componentNumber}`}
          />
          <Radio 
            label="ICED" 
            checked={temperature === "ICED"} 
            onChange={() => setTemperature("ICED")}
            name={`temperature-${componentNumber}`}
          />
        </div>
      </div>
    </div>
  );
}
