"use client";

import { useState } from "react";

interface CategorySelectorProps {
  title: string;
  description: string;
}

export default function CategorySelector({ title, description }: CategorySelectorProps) {
  const [categories, setCategories] = useState([
    { name: "COFFEE", isInactive: false },
    { name: "NON COFFEE", isInactive: true },
    { name: "ADE&TEA", isInactive: true },
  ]);

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  return (
    <div className="category-selector-wrapper">
      <div className="category-selector-info">
        <div className="category-selector-title">{title}</div>
        <div className="category-selector-description">{description}</div>
      </div>

      <div className="category-selector-field">
        <label className="category-selector-label">
          <span className="category-selector-label-text">카테고리 선택 </span>
          <span className="category-selector-label-required">*</span>
        </label>
      </div>

      <div className="category-selector-actions">
        <div className="category-selector-select">
          <span className="category-selector-select-text">선택</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <button className="category-selector-add-btn" type="button">추가</button>
      </div>

      <div className="category-selector-list">
        {categories.map((category, index) => (
          <div key={index} className="category-selector-item">
            <span className={category.isInactive ? "category-selector-item-text-inactive" : "category-selector-item-text"}>
              {category.name}
              {category.isInactive && <span className="category-selector-item-inactive"> 미운영</span>}
            </span>
            <button 
              className="category-selector-remove-btn" 
              type="button"
              onClick={() => removeCategory(index)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" fill="white"/>
                <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" stroke="#6A7E96"/>
                <path d="M5.875 5.875L12.125 12.125" stroke="#6A7E96"/>
                <path d="M12.125 5.875L5.875 12.125" stroke="#6A7E96"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
