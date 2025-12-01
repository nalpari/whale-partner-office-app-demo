"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import StoreSelect from "@/components/StoreSelect";
import LoadingScreen from "@/components/LoadingScreen";

interface BpType {
  id: string;
  code: string;
  name: string;
}

interface PartnerFunction {
  id: string;
  code: string;
  name: string;
}

interface BusinessPartnerOption {
  id: string;
  master_id: string;
  company_name: string;
  brand_name: string | null;
}

interface FormData {
  master_id: string;
  operation_status: string;
  representative_partner_function: string;
  company_name: string;
  brand_name: string;
  business_registration_number: string;
  postal_code: string;
  address_road: string;
  address_detail: string;
  representative_name: string;
  representative_phone: string;
  bp_type_id: string;
  lnb_logo_file: File | null;
  lnb_logo_url: string;
  headquarters_bp_id: string;
  franchise_bp_id: string;
}

export default function BusinessPartnerNewPage() {
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [bpTypes, setBpTypes] = useState<BpType[]>([]);
  const [partnerFunctions] = useState<PartnerFunction[]>([
    { id: "HEADQUARTERS", code: "HEADQUARTERS", name: "본사" },
    { id: "FRANCHISE", code: "FRANCHISE", name: "가맹점" },
    { id: "SUPPLIER", code: "SUPPLIER", name: "공급처" },
    { id: "LOGISTICS", code: "LOGISTICS", name: "물류사" },
  ]);
  const [businessPartners, setBusinessPartners] = useState<BusinessPartnerOption[]>([]);

  const [formData, setFormData] = useState<FormData>({
    master_id: "",
    operation_status: "CONSULTING",
    representative_partner_function: "",
    company_name: "",
    brand_name: "",
    business_registration_number: "",
    postal_code: "",
    address_road: "",
    address_detail: "",
    representative_name: "",
    representative_phone: "",
    bp_type_id: "",
    lnb_logo_file: null,
    lnb_logo_url: "",
    headquarters_bp_id: "",
    franchise_bp_id: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // BP 타입 목록 및 다음 Master ID 가져오기
  useEffect(() => {
    const fetchNextMasterId = async () => {
      try {
        const response = await fetch("/api/business-partners/next-master-id");
        if (response.ok) {
          const result = await response.json();
          setFormData((prev) => ({ ...prev, master_id: result.data?.master_id || "" }));
        }
      } catch (error) {
        console.error("다음 Master ID 로드 실패:", error);
      }
    };

    const fetchBpTypes = async () => {
      try {
        const response = await fetch("/api/business-partners/types");
        if (response.ok) {
          const result = await response.json();
          setBpTypes(result.data || []);
        }
      } catch (error) {
        console.error("BP 타입 목록 로드 실패:", error);
        // 기본값 설정
        setBpTypes([
          { id: "1", code: "HEADQUARTERS", name: "본사" },
          { id: "2", code: "FRANCHISE", name: "가맹점" },
          { id: "3", code: "SHOP", name: "점포" },
        ]);
      }
    };

    const fetchBusinessPartners = async () => {
      try {
        const response = await fetch("/api/business-partners?limit=100");
        if (response.ok) {
          const result = await response.json();
          setBusinessPartners(result.data || []);
        }
      } catch (error) {
        console.error("Business Partner 목록 로드 실패:", error);
      }
    };

    Promise.all([
      fetchNextMasterId(),
      fetchBpTypes(),
      fetchBusinessPartners(),
    ]).finally(() => {
      setInitialLoading(false);
    });
  }, []);

  const handleInputChange = (field: keyof FormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleRadioChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      handleInputChange("lnb_logo_file", file);
      handleInputChange("lnb_logo_url", file.name);
    }
  };

  const handleFileRemove = () => {
    handleInputChange("lnb_logo_file", null);
    handleInputChange("lnb_logo_url", "");
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers;
  };

  const formatBusinessNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = "업체명을 입력해주세요.";
    }

    if (!formData.business_registration_number.trim()) {
      newErrors.business_registration_number = "사업자등록번호를 입력해주세요.";
    } else if (formData.business_registration_number.length !== 10) {
      newErrors.business_registration_number = "사업자등록번호는 10자리입니다.";
    }

    if (!formData.representative_name.trim()) {
      newErrors.representative_name = "대표자명을 입력해주세요.";
    }

    if (!formData.bp_type_id) {
      newErrors.bp_type_id = "BP 타입을 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        master_id: formData.master_id,
        operation_status: formData.operation_status,
        company_name: formData.company_name,
        brand_name: formData.brand_name || null,
        business_registration_number: formData.business_registration_number,
        postal_code: formData.postal_code || null,
        address_road: formData.address_road || null,
        address_detail: formData.address_detail || null,
        representative_name: formData.representative_name,
        representative_phone: formData.representative_phone || null,
        bp_type_id: formData.bp_type_id,
        lnb_logo_url: formData.lnb_logo_url || null,
        headquarters_bp_id: formData.headquarters_bp_id || null,
        franchise_bp_id: formData.franchise_bp_id || null,
      };

      const response = await fetch("/api/business-partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Business Partner가 등록되었습니다.");
        router.push(`/business-partner/${result.data.id}`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("등록 오류:", error);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/business-partner");
  };

  if (initialLoading) {
    return <LoadingScreen type="form" blockCount={2} />;
  }

  return (
    <>
      <Header />
      <div className={`page-container ${loading ? "page-container-loading" : ""}`}>
        <div className="page-body">
          <div className="page-header">
            <StoreSelect value="(운영) 힘이나는커피생활 - BMI1234" />
            <div className="page-title-section">
              <h1 className="page-title">Business Partner Master</h1>
              <Breadcrumb
                items={[
                  { label: "Master data 관리" },
                  { label: "Business Partner Master" },
                  { label: "Business Partner 등록", active: true },
                ]}
              />
            </div>
          </div>

          <div className="page-content">
            <div className="store-management-body">
              {/* 상단 버튼 영역 */}
              <div className="bp-form-actions-top">
                <button
                  type="button"
                  className="store-btn-basic"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "저장 중..." : "저장"}
                </button>
              </div>

              <div className="store-management-cards">
                {/* Business Partner Header 정보 섹션 */}
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-title-wrapper">
                      <div className="form-section-title">Business Partner Header 정보</div>
                    </div>
                  </div>
                  <div className="form-section-body">
                    <div className="form-section-content">
                      {/* 운영여부 */}
                      <div className="form-field-row">
                        <div className="form-field-label">
                          <span className="form-field-label-text">운영여부</span>
                        </div>
                        <div className="form-field-input-wrapper">
                          <div className="bp-radio-group-equal">
                            {[
                              { value: "CONSULTING", label: "상담중" },
                              { value: "OPERATING", label: "운영" },
                              { value: "TERMINATED", label: "종료" },
                            ].map((option) => (
                              <label key={option.value} className="bp-radio-item-equal">
                                <div className="radio-button-wrapper">
                                  <input
                                    type="radio"
                                    name="operation_status"
                                    value={option.value}
                                    checked={formData.operation_status === option.value}
                                    onChange={() => handleRadioChange("operation_status", option.value)}
                                    className="radio-input"
                                  />
                                  <div className={formData.operation_status === option.value ? "radio-visual-checked" : "radio-visual"}>
                                    {formData.operation_status === option.value && <div className="radio-dot" />}
                                  </div>
                                </div>
                                <span className={formData.operation_status === option.value ? "radio-label radio-label-active" : "radio-label"}>
                                  {option.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 대표 Partner Function */}
                      <div className="form-field-row">
                        <div className="form-field-label">
                          <span className="form-field-label-text">대표 Partner Function</span>
                        </div>
                        <div className="form-field-input-wrapper">
                          <div className="bp-select-field">
                            <select
                              className="select-native"
                              value={formData.representative_partner_function}
                              onChange={(e) => handleInputChange("representative_partner_function", e.target.value)}
                            >
                              <option value="">선택</option>
                              {partnerFunctions.map((pf) => (
                                <option key={pf.id} value={pf.id}>
                                  {pf.name}
                                </option>
                              ))}
                            </select>
                            <svg className="bp-select-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 9L12 15L18 9" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Master ID - 읽기 전용 */}
                      <div className="form-field-row">
                        <div className="form-field-label">
                          <span className="form-field-label-text">Master ID</span>
                        </div>
                        <div className="form-field-input-wrapper">
                          <div className="input-field-disabled">
                            <input
                              type="text"
                              className="input-native"
                              value={formData.master_id || "로딩 중..."}
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                      {/* 업체명 */}
                      <div className="form-field-row">
                        <div className="form-field-label">
                          <span className="form-field-label-text">업체명</span>
                          <span className="form-field-label-required"> *</span>
                        </div>
                        <div className="form-field-input-wrapper">
                          <div className={`input-field ${errors.company_name ? "input-field-error" : ""}`}>
                            <input
                              type="text"
                              className="input-native"
                              placeholder="업체명을 입력하세요"
                              value={formData.company_name}
                              onChange={(e) => handleInputChange("company_name", e.target.value)}
                            />
                          </div>
                        </div>
                        {errors.company_name && (
                          <div className="input-error-message">{errors.company_name}</div>
                        )}
                      </div>

                      {/* 브랜드명 */}
                      <div className="form-field-row">
                        <div className="form-field-label">
                          <span className="form-field-label-text">브랜드명</span>
                        </div>
                        <div className="form-field-input-wrapper">
                          <div className="input-field">
                            <input
                              type="text"
                              className="input-native"
                              placeholder="브랜드명을 입력하세요"
                              value={formData.brand_name}
                              onChange={(e) => handleInputChange("brand_name", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* 사업자등록번호 */}
                      <div className="form-field-row">
                        <div className="form-field-label">
                          <span className="form-field-label-text">사업자등록번호</span>
                          <span className="form-field-label-required"> *</span>
                        </div>
                        <div className="form-field-input-wrapper">
                          <div className={`input-field ${errors.business_registration_number ? "input-field-error" : ""}`}>
                            <input
                              type="text"
                              className="input-native"
                              placeholder="숫자만 입력"
                              maxLength={10}
                              value={formData.business_registration_number}
                              onChange={(e) => handleInputChange("business_registration_number", formatBusinessNumber(e.target.value))}
                            />
                          </div>
                          <div className="form-field-description">※ 숫자만 허용</div>
                        </div>
                        {errors.business_registration_number && (
                          <div className="input-error-message">{errors.business_registration_number}</div>
                        )}
                      </div>

                      {/* 주소 */}
                      <div className="form-field-row">
                        <div className="form-field-label">
                          <span className="form-field-label-text">주소</span>
                        </div>
                        <div className="bp-address-wrapper">
                          <div className="bp-address-row">
                            <button type="button" className="bp-address-search-btn">
                              주소 찾기
                            </button>
                            <div className="input-field-disabled bp-address-postal">
                              <input
                                type="text"
                                className="input-native"
                                placeholder="(우편번호) 도로명/지번"
                                value={formData.postal_code ? `(${formData.postal_code}) ${formData.address_road}` : ""}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="input-field">
                            <input
                              type="text"
                              className="input-native"
                              placeholder="상세주소"
                              value={formData.address_detail}
                              onChange={(e) => handleInputChange("address_detail", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* 대표자명 */}
                      <div className="form-field-row">
                        <div className="form-field-label">
                          <span className="form-field-label-text">대표자명</span>
                          <span className="form-field-label-required"> *</span>
                        </div>
                        <div className="form-field-input-wrapper">
                          <div className={`input-field ${errors.representative_name ? "input-field-error" : ""}`}>
                            <input
                              type="text"
                              className="input-native"
                              placeholder="대표자명을 입력하세요"
                              value={formData.representative_name}
                              onChange={(e) => handleInputChange("representative_name", e.target.value)}
                            />
                          </div>
                        </div>
                        {errors.representative_name && (
                          <div className="input-error-message">{errors.representative_name}</div>
                        )}
                      </div>

                      {/* 대표자 휴대폰번호 */}
                      <div className="form-field-row">
                        <div className="form-field-label">
                          <span className="form-field-label-text">대표자 휴대폰번호</span>
                        </div>
                        <div className="form-field-input-wrapper">
                          <div className="input-field">
                            <span className="input-prefix">📱</span>
                            <input
                              type="tel"
                              className="input-native"
                              placeholder="예) 01012345678"
                              maxLength={11}
                              value={formData.representative_phone}
                              onChange={(e) => handleInputChange("representative_phone", formatPhoneNumber(e.target.value))}
                            />
                          </div>
                          <div className="form-field-description">※ 숫자만 허용</div>
                        </div>
                      </div>

                      {/* BP 타입 */}
                      <div className="form-field-row">
                        <div className="form-field-label">
                          <span className="form-field-label-text">BP 타입</span>
                          <span className="form-field-label-required"> *</span>
                        </div>
                        <div className="form-field-input-wrapper">
                          <div className={`bp-select-field ${errors.bp_type_id ? "bp-select-field-error" : ""}`}>
                            <select
                              className="select-native"
                              value={formData.bp_type_id}
                              onChange={(e) => handleInputChange("bp_type_id", e.target.value)}
                            >
                              <option value="">선택</option>
                              {bpTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                            <svg className="bp-select-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 9L12 15L18 9" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        {errors.bp_type_id && (
                          <div className="input-error-message">{errors.bp_type_id}</div>
                        )}
                      </div>

                      {/* LNB 로고 */}
                      <div className="form-field-row">
                        <div className="form-field-label">
                          <span className="form-field-label-text">LNB 로고</span>
                        </div>
                        <div className="bp-file-upload-wrapper">
                          <label className="bp-file-upload-btn">
                            파일 찾기
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              style={{ display: "none" }}
                            />
                          </label>
                          {formData.lnb_logo_url ? (
                            <div className="bp-file-preview">
                              <a href="#" className="bp-file-link">{formData.lnb_logo_url}</a>
                              <button type="button" className="bp-file-remove" onClick={handleFileRemove}>×</button>
                              <button type="button" className="bp-file-view">👁</button>
                              <button type="button" className="bp-file-info">ⓘ</button>
                            </div>
                          ) : (
                            <div className="bp-file-empty" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partner Function 섹션 - 대표 Partner Function 선택에 따라 동적 표시 */}
                {formData.representative_partner_function && (
                  <div className="form-section">
                    <div className="form-section-header">
                      <div className="form-section-title-wrapper">
                        <div className="form-section-title">Partner Function</div>
                      </div>
                    </div>
                    <div className="form-section-body">
                      <div className="form-section-content">
                        {/* 본사 선택 시 → 가맹점만 표시 */}
                        {formData.representative_partner_function === "HEADQUARTERS" && (
                          <div className="form-field-row">
                            <div className="form-field-label">
                              <span className="form-field-label-text">가맹점</span>
                            </div>
                            <div className="form-field-input-wrapper">
                              <div className="bp-select-field">
                                <select
                                  className="select-native"
                                  value={formData.franchise_bp_id}
                                  onChange={(e) => handleInputChange("franchise_bp_id", e.target.value)}
                                >
                                  <option value="">선택</option>
                                  {businessPartners.map((bp) => (
                                    <option key={bp.id} value={bp.id}>
                                      {bp.company_name} {bp.brand_name ? `| ${bp.brand_name}` : ""} | {bp.master_id}
                                    </option>
                                  ))}
                                </select>
                                <svg className="bp-select-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 9L12 15L18 9" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 가맹점 선택 시 → 본사만 표시 */}
                        {formData.representative_partner_function === "FRANCHISE" && (
                          <div className="form-field-row">
                            <div className="form-field-label">
                              <span className="form-field-label-text">본사</span>
                            </div>
                            <div className="form-field-input-wrapper">
                              <div className="bp-select-field">
                                <select
                                  className="select-native"
                                  value={formData.headquarters_bp_id}
                                  onChange={(e) => handleInputChange("headquarters_bp_id", e.target.value)}
                                >
                                  <option value="">선택</option>
                                  {businessPartners.map((bp) => (
                                    <option key={bp.id} value={bp.id}>
                                      {bp.company_name} {bp.brand_name ? `| ${bp.brand_name}` : ""} | {bp.master_id}
                                    </option>
                                  ))}
                                </select>
                                <svg className="bp-select-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 9L12 15L18 9" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 그 외 (공급처, 물류사 등) 선택 시 → 본사와 가맹점 모두 표시 */}
                        {formData.representative_partner_function !== "HEADQUARTERS" &&
                         formData.representative_partner_function !== "FRANCHISE" && (
                          <>
                            <div className="form-field-row">
                              <div className="form-field-label">
                                <span className="form-field-label-text">본사</span>
                              </div>
                              <div className="form-field-input-wrapper">
                                <div className="bp-select-field">
                                  <select
                                    className="select-native"
                                    value={formData.headquarters_bp_id}
                                    onChange={(e) => handleInputChange("headquarters_bp_id", e.target.value)}
                                  >
                                    <option value="">선택</option>
                                    {businessPartners.map((bp) => (
                                      <option key={bp.id} value={bp.id}>
                                        {bp.company_name} {bp.brand_name ? `| ${bp.brand_name}` : ""} | {bp.master_id}
                                      </option>
                                    ))}
                                  </select>
                                  <svg className="bp-select-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className="form-field-row">
                              <div className="form-field-label">
                                <span className="form-field-label-text">가맹점</span>
                              </div>
                              <div className="form-field-input-wrapper">
                                <div className="bp-select-field">
                                  <select
                                    className="select-native"
                                    value={formData.franchise_bp_id}
                                    onChange={(e) => handleInputChange("franchise_bp_id", e.target.value)}
                                  >
                                    <option value="">선택</option>
                                    {businessPartners.map((bp) => (
                                      <option key={bp.id} value={bp.id}>
                                        {bp.company_name} {bp.brand_name ? `| ${bp.brand_name}` : ""} | {bp.master_id}
                                      </option>
                                    ))}
                                  </select>
                                  <svg className="bp-select-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 하단 버튼 영역 */}
              <div className="bp-form-actions-bottom">
                <button
                  type="button"
                  className="store-btn-gray"
                  onClick={handleCancel}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="store-btn-basic"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
