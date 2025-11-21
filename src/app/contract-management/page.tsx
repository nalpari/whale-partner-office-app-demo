"use client";

import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import StoreSelect from "@/components/StoreSelect";
import FormField from "@/components/FormField";
import RadioGroup from "@/components/RadioGroup";
import FileUpload from "@/components/FileUpload";

export default function ContractManagementPage() {
  return (
    <>
      <Header />
      <div className="page-container">
      <StoreSelect value="(상담중) 동해에서잡아온- BIM1234" />
      
      <div className="page-body">
        <div className="page-title-section">
          <h1 className="page-title">가맹점 계약 관리</h1>
          <Breadcrumb 
            items={[
              { label: "기준정보관리" },
              { label: "상품관리" },
              { label: "상품목록", active: true }
            ]} 
          />
        </div>

        <div className="contract-management-content">
          <div className="contract-management-body">
            <div className="contract-top-actions">
              <button className="contract-btn-delete" type="button">
                삭제
              </button>
              <button className="contract-btn-list" type="button">
                목록
              </button>
            </div>

            <div className="contract-cards">
              <div className="contract-card">
                <div className="contract-card-header">
                  <div className="contract-card-title-wrapper">
                    <div className="contract-card-title">가맹점 계약 Header 정보</div>
                    <button className="contract-card-toggle" type="button">
                      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="path-1-inside-1" fill="white">
                          <path d="M0 0H38C41.3137 0 44 2.68629 44 6V44H0V0Z"/>
                        </mask>
                        <path d="M0 0H38C41.3137 0 44 2.68629 44 6V44H0V0Z" fill="#474F5C"/>
                        <path d="M0 0H44H0ZM44 44H0H44ZM-1 44V0H1V44H-1ZM44 0V44V0Z" fill="#69727F" mask="url(#path-1-inside-1)"/>
                        <path d="M17 24.5L22 19.5L27 24.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <div className="contract-card-save-actions">
                    <button className="contract-card-save-btn" type="button">
                      저장
                    </button>
                  </div>
                </div>

                <div className="contract-card-body">
                  <div className="contract-form-rows">
                    <FormField
                      label="본사 선택"
                      value="힘이나는 커피생활"
                      type="select"
                      required
                    />

                    <FormField
                      label="가맹점 선택"
                      value="힘이나는 커피생활"
                      type="select"
                      required
                      tooltip
                    />

                    <FormField
                      label="점포명"
                      value="힘이나는커피생활  을지로3가점"
                      type="input"
                      required
                    />

                    <RadioGroup
                      label="계약 상태"
                      options={[
                        { value: "writing", label: "작성중" },
                        { value: "progress", label: "진행중" },
                        { value: "completed", label: "계약완료" }
                      ]}
                      defaultValue="writing"
                      required
                      tooltip
                    />

                    <FormField
                      label="계약서 템플릿 선택"
                      value="가맹점 계약 기본 템플릿"
                      type="select"
                      required
                      description="※ 기존에 등록한 계약서 템플릿을 사용하여 계약서를   생성합니다."
                    />

                    <FormField
                      label="계약관리번호"
                      value="㈜따름인-[#힘이나는커피생활]-2025-001"
                      type="input"
                    />

                    <FormField
                      label="계약서명"
                      value="을지로3가점 가맹 계약서"
                      type="input"
                      required
                    />

                    <FormField
                      label="계약 준비일"
                      value="2020.05.08"
                      type="date"
                    />

                    <FormField
                      label="계약 체결일"
                      value="2020.05.08"
                      type="date"
                      required
                    />

                    <FormField
                      label="서명일"
                      value="2020.05.08"
                      type="date"
                      description="※ 전자계약서 사용 시 서명자가 서명한 일자가 자동으로 표시됩니다."
                    />

                    <FormField
                      label="서명자"
                      value="홍길동"
                      type="disabled"
                      description="※ 전자계약서 사용 서명자 이름이 자동으로 표시됩니다."
                    />

                    <FormField
                      label="서명자 휴대폰 번호"
                      value="010-2222-3333"
                      type="select"
                      required
                      tooltip
                    />

                    <FileUpload
                      label="날인 전 계약서 파일"
                      defaultFiles={[
                        { name: "을지로3가점 가맹 계약서.pdf", isLink: true },
                        { name: "을지로3가점 가맹 계약서.pdf", isLink: false }
                      ]}
                      description="※ 전자계약서 사용 시 서명자 이름이 자동으로 표시됩니다."
                    />

                    <FileUpload
                      label="날인 후 계약서 파일"
                      defaultFiles={[
                        { name: "을지로3가점 가맹 계약서.pdf", isLink: true }
                      ]}
                      description="※ 전자계약서 사용 시 서명자 이름이 자동으로 표시됩니다."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
