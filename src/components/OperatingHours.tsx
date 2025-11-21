"use client";

import { useState } from "react";
import Toggle from "./Toggle";

interface OperatingHoursProps {
  title: string;
  hasBreakTime?: boolean;
  defaultOperating?: boolean;
  defaultBreakTime?: boolean;
}

export default function OperatingHours({ 
  title, 
  hasBreakTime = true,
  defaultOperating = true,
  defaultBreakTime = true 
}: OperatingHoursProps) {
  const [isOperating, setIsOperating] = useState(defaultOperating);
  const [hasBreak, setHasBreak] = useState(defaultBreakTime);

  return (
    <div className="operating-hours-section">
      <div className="operating-hours-label">{title}</div>
      <div className="operating-hours-body">
        <div className="operating-hours-card">
          <div className="operating-hours-row">
            <div className="operating-hours-header">
              <div className="operating-hours-header-label">운영</div>
              <Toggle checked={isOperating} onChange={setIsOperating} />
            </div>
          </div>
          
          {isOperating ? (
          <div className="operating-hours-time-section">
            <div className="operating-hours-period-row">
              <div className="operating-hours-period-cell-primary">오전</div>
              <div className="operating-hours-period-cell">오후</div>
            </div>
            
            <div className="operating-hours-picker-row">
              <div className="operating-hours-picker-container">
                <div className="operating-hours-picker-time-controls">
                  <div className="operating-hours-picker-controls">
                    <button type="button" className="time-control-btn">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                        <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                        <path d="M18 16L14 12L10 16" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button type="button" className="time-control-btn">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                        <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                        <path d="M18 12L14 16L10 12" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="time-display-column">
                    <div className="time-display-inactive">5   :   29</div>
                    <div className="time-display-active">6   :   30</div>
                    <div className="time-display-inactive">7   :   31</div>
                  </div>
                  
                  <div className="operating-hours-picker-controls">
                    <button type="button" className="time-control-btn">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                        <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                        <path d="M18 16L14 12L10 16" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button type="button" className="time-control-btn">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                        <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                        <path d="M18 12L14 16L10 12" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="time-range-display">
                  <div className="time-range-box">
                    <div className="time-range-text">오전 6:30</div>
                  </div>
                  <div className="time-range-separator">부터</div>
                  <div className="time-range-box">
                    <div className="time-range-text">오후 5:30</div>
                  </div>
                  <div className="time-range-separator">까지</div>
                </div>
              </div>
            </div>
          </div>
          ) : (
            <div className="operating-hours-time-section">
              <div className="operating-hours-period-row">
                <div className="operating-hours-period-cell">오전</div>
                <div className="operating-hours-period-cell">오후</div>
              </div>
              
              <div className="operating-hours-picker-row">
                <div className="operating-hours-picker-container-disabled">
                  <div className="operating-hours-picker-time-controls">
                    <div className="operating-hours-picker-controls">
                      <button type="button" className="time-control-btn">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                          <path d="M18 16L14 12L10 16" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button type="button" className="time-control-btn">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                          <path d="M18 12L14 16L10 12" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="time-display-column">
                      <div className="time-display-inactive">5   :   29</div>
                      <div className="time-display-inactive">6   :   30</div>
                      <div className="time-display-inactive">7   :   31</div>
                    </div>
                    
                    <div className="operating-hours-picker-controls">
                      <button type="button" className="time-control-btn">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                          <path d="M18 16L14 12L10 16" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button type="button" className="time-control-btn">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                          <path d="M18 12L14 16L10 12" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="time-range-display">
                    <div className="time-range-box-disabled"></div>
                    <div className="time-range-separator-disabled">부터</div>
                    <div className="time-range-box-disabled"></div>
                    <div className="time-range-separator-disabled">까지</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {hasBreakTime && (
          <div className="operating-hours-card">
            <div className="operating-hours-row-break">
              <div className="operating-hours-header">
                <div className="operating-hours-header-label">Break time</div>
                <Toggle checked={hasBreak} onChange={setHasBreak} />
              </div>
            </div>
            
            {hasBreak ? (
            <div className="operating-hours-time-section">
              <div className="operating-hours-period-row">
                <div className="operating-hours-period-cell">오전</div>
                <div className="operating-hours-period-cell-primary">오후</div>
              </div>
              
              <div className="operating-hours-picker-row">
                <div className="operating-hours-picker-container">
                  <div className="operating-hours-picker-time-controls">
                    <div className="operating-hours-picker-controls">
                      <button type="button" className="time-control-btn">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                          <path d="M18 16L14 12L10 16" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button type="button" className="time-control-btn">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                          <path d="M18 12L14 16L10 12" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="time-display-column">
                      <div className="time-display-inactive">5   :   29</div>
                      <div className="time-display-active">6   :   30</div>
                      <div className="time-display-inactive">7   :   31</div>
                    </div>
                    
                    <div className="operating-hours-picker-controls">
                      <button type="button" className="time-control-btn">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                          <path d="M18 16L14 12L10 16" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button type="button" className="time-control-btn">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                          <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                          <path d="M18 12L14 16L10 12" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="time-range-display">
                    <div className="time-range-box">
                      <div className="time-range-text">오후 4:30</div>
                    </div>
                    <div className="time-range-separator">부터</div>
                    <div className="time-range-box">
                      <div className="time-range-text">오후 5:30</div>
                    </div>
                    <div className="time-range-separator">까지</div>
                  </div>
                </div>
              </div>
            </div>
            ) : (
              <div className="operating-hours-time-section">
                <div className="operating-hours-period-row">
                  <div className="operating-hours-period-cell">오전</div>
                  <div className="operating-hours-period-cell">오후</div>
                </div>
                
                <div className="operating-hours-picker-row">
                  <div className="operating-hours-picker-container-disabled">
                    <div className="operating-hours-picker-time-controls">
                      <div className="operating-hours-picker-controls">
                        <button type="button" className="time-control-btn">
                          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                            <path d="M18 16L14 12L10 16" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button type="button" className="time-control-btn">
                          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                            <path d="M18 12L14 16L10 12" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="time-display-column">
                        <div className="time-display-inactive">5   :   29</div>
                        <div className="time-display-inactive">6   :   30</div>
                        <div className="time-display-inactive">7   :   31</div>
                      </div>
                      
                      <div className="operating-hours-picker-controls">
                        <button type="button" className="time-control-btn">
                          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                            <path d="M18 16L14 12L10 16" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button type="button" className="time-control-btn">
                          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white"/>
                            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#EBEBEB"/>
                            <path d="M18 12L14 16L10 12" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="time-range-display">
                      <div className="time-range-box-disabled"></div>
                      <div className="time-range-separator-disabled">부터</div>
                      <div className="time-range-box-disabled"></div>
                      <div className="time-range-separator-disabled">까지</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
