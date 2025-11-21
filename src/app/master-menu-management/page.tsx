"use client";

import { useState } from "react";
import "../master-menu.css";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import StoreSelect from "@/components/StoreSelect";
import MenuComponentItem from "@/components/MenuComponentItem";
import OptionSetItem from "@/components/OptionSetItem";
import CategorySelector from "@/components/CategorySelector";

export default function MasterMenuManagement() {
  const [setMenuOpen, setSetMenuOpen] = useState(true);
  const [optionOpen, setOptionOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);

  return (
    <main>
      <Header />
      <div className="page-container">
        <div className="page-body">
          <div className="page-header">
            <StoreSelect value="(상담중) 동해에서잡아온- BIM1234" />
            <div className="page-title-section">
              <h1 className="page-title">마스터용 메뉴 관리</h1>
              <Breadcrumb 
                items={[
                  { label: "기준정보관리" },
                  { label: "상품관리" },
                  { label: "상품목록", active: true }
                ]}
              />
            </div>
          </div>
          
          <div className="page-content">
            {/* 세트 메뉴 구성 */}
            <div className="master-menu-card">
              <div className="master-menu-card-header">
                <div className="master-menu-card-title-bar">
                  <span className="master-menu-card-title">세트 메뉴 구성</span>
                  <button
                    className="master-menu-card-toggle"
                    onClick={() => setSetMenuOpen(!setMenuOpen)}
                    type="button"
                  >
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0H38C41.3137 0 44 2.68629 44 6V44H0V0Z" fill="#474F5C"/>
                      <path d="M0 0H44H0ZM44 44H0H44ZM-1 44V0H1V44H-1ZM44 0V44V0Z" fill="#69727F"/>
                      <path 
                        d="M17 24.5L22 19.5L27 24.5" 
                        stroke="white" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{
                          transform: setMenuOpen ? "none" : "rotate(180deg)",
                          transformOrigin: "center",
                          transition: "transform 0.2s",
                        }}
                      />
                    </svg>
                  </button>
                </div>
                {setMenuOpen && (
                  <div className="master-menu-card-actions">
                    <button className="master-menu-save-btn" type="button">저장</button>
                  </div>
                )}
              </div>
              
              {setMenuOpen && (
                <div className="master-menu-card-body">
                  <div className="master-menu-option-description">
                    <div className="master-menu-option-description-section">
                      <p className="master-menu-option-description-text">
                        1. 세트 메뉴 구성을 위해 세트를 구성할 컴포넌트 메뉴들을 선택해 주세요.<br />
                        2. 컴포넌트 메뉴는 [마스터용 메뉴 Header 정보 관리]에서 등록한 '세트 여부'의 '일반 메뉴'만 검색하여 구성할 수 있습니다. (세트 메뉴는 컴포넌트 메뉴로 구성할 수 없습니다.)<br />
                        3. 컴포넌트 메뉴는 [마스터용 메뉴 Header 정보 관리]에서 등록한 '메뉴 타입'의 '메뉴'만 검색하여 구성할 수 있습니다. (옵션 메뉴는 컴포넌트 메뉴로 구성할 수 없습니다.)<br />
                        4. 컴포넌트 메뉴 #1은 필수로 등록해야 합니다.<br />
                        5. 세트 메뉴는 자체적으로 가격을 설정할 수 있습니다.(컴포넌트 메뉴들의 가격 합계가 세트 메뉴의 가격이 되지 않습니다.)
                      </p>
                    </div>
                  </div>
                  
                  <MenuComponentItem componentNumber={1} showDragHandle={true} />
                  <MenuComponentItem componentNumber={2} showDragHandle={false} />
                  <MenuComponentItem componentNumber={3} showDragHandle={false} />
                </div>
              )}
            </div>

            {/* 옵션 구성 */}
            <div className="master-menu-card">
              <div className="master-menu-card-header">
                <div className="master-menu-card-title-bar">
                  <span className="master-menu-card-title">옵션 구성</span>
                  <button
                    className="master-menu-card-toggle"
                    onClick={() => setOptionOpen(!optionOpen)}
                    type="button"
                  >
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0H38C41.3137 0 44 2.68629 44 6V44H0V0Z" fill="#474F5C"/>
                      <path d="M0 0H44H0ZM44 44H0H44ZM-1 44V0H1V44H-1ZM44 0V44V0Z" fill="#69727F"/>
                      <path 
                        d="M17 24.5L22 19.5L27 24.5" 
                        stroke="white" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{
                          transform: optionOpen ? "none" : "rotate(180deg)",
                          transformOrigin: "center",
                          transition: "transform 0.2s",
                        }}
                      />
                    </svg>
                  </button>
                </div>
                {optionOpen && (
                  <div className="master-menu-card-actions">
                    <button className="master-menu-save-btn" type="button">저장</button>
                  </div>
                )}
              </div>
              
              {optionOpen && (
                <div className="master-menu-card-body">
                  <div className="master-menu-option-description">
                    <div className="master-menu-option-description-section">
                      <h3 className="master-menu-option-description-title">옵션 SET에 대한 해설</h3>
                      <p className="master-menu-option-description-text">
                        옵션 SET의 SET명을 입력하세요. 메뉴에 옵션이 없는 경우 정보를 입력하지 않습니다.<br />
                        1. 필수선택 : 고객이 옵션 SET에서 옵션을 하나라도 선택해야 합니다.<br />
                        2. 다중선택 : 고객이 옵션 SET에서 옵션을 복수로 선택할 수 있습니다. 다중선택을 하지 않으면 옵션 SET 에 등록된 옵션 중에 1가지만 선택할 수 있습니다.<br />
                        3. 노출 순서 : 고객 APP에서 옵션 SET의 노출 순서를 의미합니다. 번호가 작은 순서로 노출됩니다.
                      </p>
                    </div>
                    <div className="master-menu-option-divider" />
                    <div className="master-menu-option-description-section">
                      <h3 className="master-menu-option-description-title">옵션 SET에 대한 해설</h3>
                      <p className="master-menu-option-description-text">
                        옵션 SET의 SET명을 입력하세요. 메뉴에 옵션이 없는 경우 정보를 입력하지 않습니다.<br />
                        1. 필수선택 : 고객이 옵션 SET에서 옵션을 하나라도 선택해야 합니다.<br />
                        2. 다중선택 : 고객이 옵션 SET에서 옵션을 복수로 선택할 수 있습니다. 다중선택을 하지 않으면 옵션 SET 에 등록된 옵션 중에 1가지만 선택할 수 있습니다.<br />
                        3. 노출 순서 : 고객 APP에서 옵션 SET의 노출 순서를 의미합니다. 번호가 작은 순서로 노출됩니다.
                      </p>
                    </div>
                  </div>

                  <OptionSetItem setNumber={1} backgroundColor="#F5F5F5" />
                  <OptionSetItem setNumber={2} backgroundColor="#F5F5F5" />
                </div>
              )}
            </div>

            {/* 카테고리 설정 */}
            <div className="master-menu-card">
              <div className="master-menu-card-header">
                <div className="master-menu-card-title-bar">
                  <span className="master-menu-card-title">카테고리 설정</span>
                  <button
                    className="master-menu-card-toggle"
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    type="button"
                  >
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0H38C41.3137 0 44 2.68629 44 6V44H0V0Z" fill="#474F5C"/>
                      <path d="M0 0H44H0ZM44 44H0H44ZM-1 44V0H1V44H-1ZM44 0V44V0Z" fill="#69727F"/>
                      <path 
                        d="M17 24.5L22 19.5L27 24.5" 
                        stroke="white" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{
                          transform: categoryOpen ? "none" : "rotate(180deg)",
                          transformOrigin: "center",
                          transition: "transform 0.2s",
                        }}
                      />
                    </svg>
                  </button>
                </div>
                {categoryOpen && (
                  <div className="master-menu-card-actions">
                    <button className="master-menu-save-btn" type="button">저장</button>
                  </div>
                )}
              </div>
              
              {categoryOpen && (
                <div className="master-menu-card-body">
                  <CategorySelector 
                    title="카테고리 선택에 대한 해설"
                    description="메뉴가 노출되어야 할 카테고리를 선택합니다.
                        1. 여러 개의 카테고리에 메뉴를 노출할 수 있습니다.
                        2. 카테고리는 필수적으로 선택해야 합니다."
                  />

                  <div className="master-menu-store-description">
                    <div className="master-menu-store-description-section">
                      <h3 className="master-menu-store-description-title">사용가능 가맹점에 대한 해설</h3>
                      <p className="master-menu-store-description-text">
                        1. 본사가 등록한 마스터용 메뉴는 가맹점에 상속할 수 있습니다.<br />
                        2. '전체 가맹점'으로 선택한 경우 본사 소속 전체 가맹점에 본 메뉴를 상속할 수 있습니다.<br />
                        3.특정 가맹점을 선택한 경우 해당 가맹점에만 메뉴를 상속할 수 있습니다.<br />
                        4. 본사의 마스터용 메뉴를 가맹점의 점포용 메뉴로 동시에 저장시키기 위해서는 [가맹점 판매용 메뉴로 동시 저장]에 체크 해주세요. 저장과 동시에 가맹점의 점포 메뉴에 등록됩니다.<br />
                        5. 본사의 마스터용 메뉴를 본사 소속 점포용 메뉴로 동시에 저장시키기 위해서는 [점포 판매용 메뉴로 동시 저장]에 체크 해주세요. 저장과 동시에 점포 메뉴에 등록됩니다.
                      </p>
                    </div>
                  </div>

                  <div className="master-menu-store-selector">
                    <div className="master-menu-store-actions">
                      <div className="master-menu-store-select">
                        <span className="master-menu-store-select-text">선택</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <button className="master-menu-store-add-btn" type="button">추가</button>
                    </div>

                    <div className="master-menu-store-buttons">
                      <button className="master-menu-store-save-btn-active" type="button">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.33035 8.31638C3.15684 8.31638 2.99777 8.25854 2.86763 8.1284L-0.00986332 5.2509C-0.27014 4.99062 -0.27014 4.58575 -0.00986332 4.32547C0.250414 4.06519 0.655275 4.06519 0.915552 4.32547L3.34481 6.74026L9.11429 0.985245C9.37457 0.724968 9.77944 0.724968 10.0397 0.985245C10.3 1.24552 10.3 1.6504 10.0397 1.91068L3.80752 8.1284C3.66292 8.25854 3.50387 8.31638 3.33035 8.31638Z" fill="white"/>
                        </svg>
                        가맹점 점포용 메뉴로 동시 저장
                      </button>
                      <button className="master-menu-store-save-btn" type="button">
                        나의 점포용 메뉴로 동시 저장
                      </button>
                    </div>

                    <div className="master-menu-store-list">
                      <div className="master-menu-store-item">
                        <span className="master-menu-store-item-text">전체 가맹점</span>
                        <button className="master-menu-store-remove-btn" type="button">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" fill="white"/>
                            <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" stroke="#6A7E96"/>
                            <path d="M5.875 5.875L12.125 12.125" stroke="#6A7E96"/>
                            <path d="M12.125 5.875L5.875 12.125" stroke="#6A7E96"/>
                          </svg>
                        </button>
                      </div>
                      <div className="master-menu-store-item">
                        <span className="master-menu-store-item-text">무교점 (운영)</span>
                        <button className="master-menu-store-remove-btn" type="button">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" fill="white"/>
                            <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" stroke="#6A7E96"/>
                            <path d="M5.875 5.875L12.125 12.125" stroke="#6A7E96"/>
                            <path d="M12.125 5.875L5.875 12.125" stroke="#6A7E96"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
