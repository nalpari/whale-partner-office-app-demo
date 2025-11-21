"use client";

import { useState } from "react";
import Toggle from "./Toggle";
import Badge from "./Badge";
import Radio from "./Radio";

interface OptionSetItemProps {
  setNumber: number;
  backgroundColor?: string;
}

export default function OptionSetItem({ setNumber, backgroundColor = "#F5F5F5" }: OptionSetItemProps) {
  const [isActive, setIsActive] = useState(true);
  const [isRequired, setIsRequired] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [optionsActive, setOptionsActive] = useState([true, true]);
  const [quantityInput, setQuantityInput] = useState([true, true]);
  const [defaultOption, setDefaultOption] = useState([true, false]);

  return (
    <div className="option-set-section">
      <div className="option-set-header" style={{ background: backgroundColor }}>
        <span className="option-set-title">옵션 SET 0{setNumber}</span>
        <Toggle checked={isActive} onChange={setIsActive} />
      </div>

      <div className="option-set-name-field">
        <label className="option-set-label">
          <span className="option-set-label-text">옵션 SET명 </span>
          <span className="option-set-label-required">*</span>
        </label>
        <input type="text" className="option-set-input" />
      </div>

      <div className="option-set-toggles">
        <div className="option-set-toggle-item">
          <span className="option-set-toggle-label">필수선택</span>
          <Toggle checked={isRequired} onChange={setIsRequired} />
        </div>
        <div className="option-set-toggle-item">
          <span className="option-set-toggle-label">다중선택</span>
          <Toggle checked={isMultiple} onChange={setIsMultiple} />
        </div>
      </div>

      <div className="option-set-order-field">
        <label className="option-set-label-text">노출순서</label>
        <div className="option-set-input">
          <input 
            type="text" 
            className="option-set-input-field" 
            defaultValue="10" 
            style={{ textAlign: 'right' }}
          />
        </div>
      </div>

      {[1, 2].map((optionNum, index) => (
        <div key={optionNum} className="option-item-wrapper">
          <div className="option-item-header">
            <span className="option-item-title">옵션 0{optionNum}</span>
            {index === 0 && (
              <div className="option-item-drag">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.46973 11.1414C7.76257 10.8487 8.23743 10.8487 8.53027 11.1414C8.8231 11.4342 8.82298 11.909 8.53027 12.2019L6.53027 14.2019C6.25567 14.4765 5.82095 14.494 5.52637 14.2537L5.46973 14.2019L3.46973 12.2019C3.17702 11.909 3.17689 11.4342 3.46973 11.1414C3.76257 10.8487 4.23743 10.8487 4.53027 11.1414L6 12.6111L7.46973 11.1414ZM12 9.4978H2V7.9978H12V9.4978ZM10 6.49878H0V4.99878H10V6.49878ZM5.5957 0.11792C5.88214 -0.0657377 6.26532 -0.0348403 6.51953 0.209717L8.51953 2.13354C8.81789 2.42073 8.82716 2.89563 8.54004 3.19409C8.25299 3.49186 7.77882 3.50106 7.48047 3.2146L6 1.78882L4.51953 3.2146C4.22118 3.50106 3.74701 3.49187 3.45996 3.19409C3.17284 2.89563 3.18211 2.42073 3.48047 2.13354L5.48047 0.209717L5.5957 0.11792Z" fill="#4E637E"/>
                </svg>
              </div>
            )}
            <Toggle checked={optionsActive[index]} onChange={(val) => {
              const newActive = [...optionsActive];
              newActive[index] = val;
              setOptionsActive(newActive);
            }} />
            <button className="option-item-more" type="button">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="10" r="2" fill="#4F4F4F"/>
                <circle cx="16" cy="16" r="2" fill="#4F4F4F"/>
                <circle cx="16" cy="22" r="2" fill="#4F4F4F"/>
              </svg>
            </button>
          </div>

          <div className="option-item-search">
            <button className="btn-search" type="button">옵션 찿기</button>
            <div className="option-item-input">
              <span className="option-item-input-text">소스 선택안함</span>
            </div>
          </div>

          <div className="option-item-code">
            <span className="option-item-code-text">PDM10005</span>
            <Badge label="미운영" variant="inactive" />
          </div>

          <div className="option-item-field">
            <label className="option-item-label-text">추가가격</label>
            <div className="option-item-input">
              <input 
                type="text" 
                className="option-item-input-field" 
                defaultValue="500" 
                style={{ textAlign: 'right' }}
              />
            </div>
          </div>

          <div className="option-item-controls">
            <div className="option-item-control">
              <span className="option-item-control-label">수량입력</span>
              <Toggle checked={quantityInput[index]} onChange={(val) => {
                const newQuantity = [...quantityInput];
                newQuantity[index] = val;
                setQuantityInput(newQuantity);
              }} />
            </div>
            <div className="option-item-control">
              <span className="option-item-control-label">디폴트</span>
              <Radio 
                label="" 
                checked={defaultOption[index]} 
                onChange={() => {
                  setDefaultOption([index === 0, index === 1]);
                }}
                name={`default-option-${setNumber}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
