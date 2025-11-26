"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import FormSection from "@/components/FormSection";
import RadioGroup from "@/components/RadioGroup";
import Checkbox from "@/components/Checkbox";
import CheckboxGroup from "@/components/CheckboxGroup";
import DatePicker from "@/components/DatePicker";
import DateRangePicker from "@/components/DateRangePicker";
import Textarea from "@/components/Textarea";
import Toggle from "@/components/Toggle";
import FileUpload from "@/components/FileUpload";
import Button from "@/components/Button";
import ContractWorkingHoursCard from "@/components/ContractWorkingHoursCard";

interface BonusItem {
  id: string;
  type: string;
  isActive: boolean;
  amount: string;
  memo: string;
}

interface ContractFormData {
  // 기본 정보
  employeeType: string;
  headquarters: string;
  franchise: string;
  store: string;
  isElectronic: boolean;
  employeeName: string;
  employeeNumber: string;
  contractClassification: string;
  isComprehensiveSalary: boolean;

  // 4대 보험
  insurances: string[];

  // 급여 설정
  paymentCycle: string;
  paymentMonth: string;
  paymentDay: string;

  // 계약 기간
  contractStartDate: string;
  contractEndDate: string;
  hasNoEndDate: boolean;

  // 파일
  laborContractFile: File | null;
  wageContractFile: File | null;

  // 기타
  contractDate: string;
  jobDescription: string;

  // 급여 정보
  annualSalary: string;
  monthlySalary: string;
  hourlyWage: string;
  basicPayHours: string;
  basicPayAmount: string;
  overtimeHours: string;
  overtimeAmount: string;
  nightPayHours: string;
  nightPayAmount: string;
  holidayPayHours: string;
  holidayPayAmount: string;
  extraHolidayPayHours: string;
  extraHolidayPayAmount: string;
  mealAllowance: string;
  carAllowance: string;
  childcareAllowance: string;

  // 상여금
  bonuses: BonusItem[];
}

export default function EmploymentContractNewPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ContractFormData>({
    employeeType: "headquarters",
    headquarters: "",
    franchise: "",
    store: "",
    isElectronic: false,
    employeeName: "",
    employeeNumber: "",
    contractClassification: "",
    isComprehensiveSalary: false,
    insurances: [],
    paymentCycle: "monthly",
    paymentMonth: "next",
    paymentDay: "",
    contractStartDate: "",
    contractEndDate: "",
    hasNoEndDate: false,
    laborContractFile: null,
    wageContractFile: null,
    contractDate: "",
    jobDescription: "",
    annualSalary: "",
    monthlySalary: "",
    hourlyWage: "",
    basicPayHours: "",
    basicPayAmount: "",
    overtimeHours: "",
    overtimeAmount: "",
    nightPayHours: "",
    nightPayAmount: "",
    holidayPayHours: "",
    holidayPayAmount: "",
    extraHolidayPayHours: "",
    extraHolidayPayAmount: "",
    mealAllowance: "",
    carAllowance: "",
    childcareAllowance: "",
    bonuses: [
      { id: "1", type: "만근 상여", isActive: true, amount: "30000", memo: "" },
      { id: "2", type: "직책 상여", isActive: true, amount: "30000", memo: "" },
    ],
  });

  const updateFormData = <K extends keyof ContractFormData>(
    field: K,
    value: ContractFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddBonus = () => {
    const newBonus: BonusItem = {
      id: Date.now().toString(),
      type: "",
      isActive: false,
      amount: "",
      memo: "",
    };
    updateFormData("bonuses", [...formData.bonuses, newBonus]);
  };

  const handleRemoveBonus = (id: string) => {
    updateFormData(
      "bonuses",
      formData.bonuses.filter((b) => b.id !== id)
    );
  };

  const handleBonusChange = (
    id: string,
    field: keyof BonusItem,
    value: string | boolean
  ) => {
    updateFormData(
      "bonuses",
      formData.bonuses.map((b) =>
        b.id === id ? { ...b, [field]: value } : b
      )
    );
  };

  const handleSubmit = async () => {
    // TODO: API 호출
    console.log("Form submitted:", formData);
    alert("저장되었습니다.");
    router.push("/employment-contract");
  };

  const handleCancel = () => {
    router.push("/employment-contract");
  };

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-body">
          <div className="page-header">
            <div className="page-title-section">
              <h1 className="page-title">근로 계약 등록</h1>
              <Breadcrumb
                items={[
                  { label: "BP 직원 관리" },
                  { label: "근로 계약 관리" },
                  { label: "등록", active: true },
                ]}
              />
            </div>
          </div>

          <div className="page-content">
            {/* 근로 계약 Header 정보 섹션 */}
            <FormSection title="근로 계약 Header 정보">
              {/* 직원 소속 */}
              <RadioGroup
                label="직원 소속"
                options={[
                  { value: "headquarters", label: "본사" },
                  { value: "franchise", label: "가맹점" },
                ]}
                required
                defaultValue={formData.employeeType}
                onChange={(value) => updateFormData("employeeType", value)}
              />

              {/* 본사/가맹점 선택 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">본사/가맹점 선택 </span>
                  <span className="form-field-label-required">*</span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="form-inline-group" style={{ flex: 1 }}>
                    <div className="select-field" style={{ minWidth: "150px" }}>
                      <select
                        className="select-native"
                        value={formData.headquarters}
                        onChange={(e) => updateFormData("headquarters", e.target.value)}
                      >
                        <option value="">본사 선택</option>
                        <option value="hq1">본사 1</option>
                        <option value="hq2">본사 2</option>
                      </select>
                      <svg className="form-field-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {formData.employeeType === "franchise" && (
                      <div className="select-field" style={{ minWidth: "150px" }}>
                        <select
                          className="select-native"
                          value={formData.franchise}
                          onChange={(e) => updateFormData("franchise", e.target.value)}
                        >
                          <option value="">가맹점 선택</option>
                          <option value="fr1">가맹점 1</option>
                          <option value="fr2">가맹점 2</option>
                        </select>
                        <svg className="form-field-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 점포 선택 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">점포 선택 </span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="select-field">
                    <select
                      className="select-native"
                      value={formData.store}
                      onChange={(e) => updateFormData("store", e.target.value)}
                    >
                      <option value="">점포 선택</option>
                      <option value="store1">점포 1</option>
                      <option value="store2">점포 2</option>
                    </select>
                    <svg className="form-field-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* 전자계약 진행 상태 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">전자계약서 </span>
                  <span className="form-field-label-required">*</span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="form-inline-group">
                    <Toggle
                      checked={formData.isElectronic}
                      onChange={(checked) => updateFormData("isElectronic", checked)}
                    />
                    <span style={{ color: formData.isElectronic ? "#222" : "#888", fontSize: "15px" }}>
                      {formData.isElectronic ? "진행중" : "미진행"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 직원명 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">직원명 </span>
                  <span className="form-field-label-required">*</span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="form-inline-group" style={{ flex: 1 }}>
                    <div className="select-field" style={{ minWidth: "150px" }}>
                      <select
                        className="select-native"
                        value={formData.employeeName}
                        onChange={(e) => updateFormData("employeeName", e.target.value)}
                      >
                        <option value="">직원 선택</option>
                        <option value="홍길동">홍길동</option>
                        <option value="김철수">김철수</option>
                      </select>
                      <svg className="form-field-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="input-field-disabled" style={{ minWidth: "100px", maxWidth: "150px" }}>
                      <input
                        type="text"
                        className="input-native"
                        value={formData.employeeNumber || "BIM1001"}
                        disabled
                        placeholder="사번"
                      />
                    </div>
                    <Button variant="secondary" onClick={() => alert("이전 계약정보 불러오기")}>
                      이전 계약정보 불러오기
                    </Button>
                  </div>
                </div>
              </div>

              {/* 계약 분류 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">계약 분류 </span>
                  <span className="form-field-label-required">*</span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="form-inline-group" style={{ flex: 1 }}>
                    <div className="select-field" style={{ minWidth: "150px" }}>
                      <select
                        className="select-native"
                        value={formData.contractClassification}
                        onChange={(e) => updateFormData("contractClassification", e.target.value)}
                      >
                        <option value="">계약 분류 선택</option>
                        <option value="포괄연봉제">포괄연봉제</option>
                        <option value="시급제">시급제</option>
                        <option value="월급제">월급제</option>
                      </select>
                      <svg className="form-field-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <Checkbox
                      label="포괄연봉제"
                      checked={formData.isComprehensiveSalary}
                      onChange={(checked) => updateFormData("isComprehensiveSalary", checked)}
                    />
                  </div>
                </div>
              </div>

              {/* 4대 보험 가입 유무 */}
              <CheckboxGroup
                label="4대 보험 가입 유무"
                options={[
                  { value: "health", label: "건강보험" },
                  { value: "pension", label: "국민연금" },
                  { value: "employment", label: "고용보험" },
                  { value: "industrial", label: "산재보험" },
                ]}
                values={formData.insurances}
                onChange={(values) => updateFormData("insurances", values)}
              />

              {/* 급여계산 주기/급여일 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">급여계산 주기/급여일 </span>
                  <span className="form-field-label-required">*</span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="form-inline-group" style={{ flex: 1 }}>
                    <div className="select-field" style={{ minWidth: "100px", maxWidth: "120px" }}>
                      <select
                        className="select-native"
                        value={formData.paymentCycle}
                        onChange={(e) => updateFormData("paymentCycle", e.target.value)}
                      >
                        <option value="monthly">월급</option>
                        <option value="daily">일급</option>
                        <option value="hourly">시급</option>
                      </select>
                      <svg className="form-field-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="select-field" style={{ minWidth: "100px", maxWidth: "120px" }}>
                      <select
                        className="select-native"
                        value={formData.paymentMonth}
                        onChange={(e) => updateFormData("paymentMonth", e.target.value)}
                      >
                        <option value="current">당월</option>
                        <option value="next">익월</option>
                      </select>
                      <svg className="form-field-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="input-field" style={{ minWidth: "80px", maxWidth: "100px" }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.paymentDay}
                        onChange={(e) => updateFormData("paymentDay", e.target.value)}
                        placeholder="일"
                        min="1"
                        max="31"
                      />
                      <span className="input-suffix">일</span>
                    </div>
                    <span style={{ color: "#888", fontSize: "14px" }}>
                      ※ 31일을 입력한 경우 급여일은 매달 말일로 적용합니다.
                    </span>
                  </div>
                </div>
              </div>

              {/* 계약 기간 */}
              <DateRangePicker
                label="계약 기간"
                startDate={formData.contractStartDate}
                endDate={formData.contractEndDate}
                hasNoEndDate={formData.hasNoEndDate}
                required
                onStartDateChange={(date) => updateFormData("contractStartDate", date)}
                onEndDateChange={(date) => updateFormData("contractEndDate", date)}
                onNoEndDateChange={(checked) => updateFormData("hasNoEndDate", checked)}
              />

              {/* 근로계약서 */}
              <FileUpload
                label="근로계약서"
                description="※ 당사자 모두가 날인한 계약서 첨부"
              />

              {/* 임금계약서 */}
              <FileUpload
                label="임금계약서"
                description="※ 당사자 모두가 날인한 계약서 첨부"
              />

              {/* 계약일 */}
              <DatePicker
                label="계약일"
                value={formData.contractDate}
                required
                onChange={(date) => updateFormData("contractDate", date)}
              />

              {/* 업무 내용 */}
              <Textarea
                label="업무 내용"
                value={formData.jobDescription}
                placeholder="담당 업무를 입력하세요"
                required
                onChange={(value) => updateFormData("jobDescription", value)}
              />
            </FormSection>

            {/* 급여 정보 섹션 */}
            <FormSection
              title="급여 정보"
              actionButton={
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button variant="secondary" onClick={() => alert("연봉 및 통상시급 계산기")}>
                    연봉 및 통상시급 계산기
                  </Button>
                  <Button variant="primary" onClick={() => alert("급여 정보 저장")}>
                    저장
                  </Button>
                </div>
              }
            >
              {/* 급여 요약 */}
              <div className="salary-summary">
                <div className="salary-summary-row">
                  <div className="salary-summary-item">
                    <span className="salary-summary-label">연봉 총액</span>
                    <span className="salary-summary-value">
                      {formData.annualSalary ? `${Number(formData.annualSalary).toLocaleString()}원` : "40,000,000원"}
                    </span>
                  </div>
                  <div className="salary-summary-item">
                    <span className="salary-summary-label">월급여 총액</span>
                    <span className="salary-summary-value">
                      {formData.monthlySalary ? `${Number(formData.monthlySalary).toLocaleString()}원` : "3,333,333원"}
                    </span>
                  </div>
                  <div className="salary-summary-item">
                    <span className="salary-summary-label">통상시급</span>
                    <span className="salary-summary-value">
                      {formData.hourlyWage ? `${Number(formData.hourlyWage).toLocaleString()}원` : "10,994원"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 월간 기본급 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">월간 기본급 </span>
                  <span className="form-field-label-required">*</span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="salary-input-group">
                    <div className="input-field" style={{ maxWidth: "120px" }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.basicPayHours}
                        onChange={(e) => updateFormData("basicPayHours", e.target.value)}
                        placeholder="209"
                      />
                      <span className="input-suffix">시간</span>
                    </div>
                    <div className="input-field" style={{ flex: 1 }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.basicPayAmount}
                        onChange={(e) => updateFormData("basicPayAmount", e.target.value)}
                        placeholder="2,297,780"
                      />
                      <span className="input-suffix">원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 월간 연장수당 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">월간 연장수당 </span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="salary-input-group">
                    <div className="input-field" style={{ maxWidth: "120px" }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.overtimeHours}
                        onChange={(e) => updateFormData("overtimeHours", e.target.value)}
                        placeholder="52"
                      />
                      <span className="input-suffix">시간</span>
                    </div>
                    <div className="input-field" style={{ flex: 1 }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.overtimeAmount}
                        onChange={(e) => updateFormData("overtimeAmount", e.target.value)}
                        placeholder="725,610"
                      />
                      <span className="input-suffix">원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 월간 야간수당 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">월간 야간수당 </span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="salary-input-group">
                    <div className="input-field" style={{ maxWidth: "120px" }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.nightPayHours}
                        onChange={(e) => updateFormData("nightPayHours", e.target.value)}
                        placeholder="20"
                      />
                      <span className="input-suffix">시간</span>
                    </div>
                    <div className="input-field" style={{ flex: 1 }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.nightPayAmount}
                        onChange={(e) => updateFormData("nightPayAmount", e.target.value)}
                        placeholder="109,940"
                      />
                      <span className="input-suffix">원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 월간 휴일근무수당 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">월간 휴일근무수당 </span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="salary-input-group">
                    <div className="input-field" style={{ maxWidth: "120px" }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.holidayPayHours}
                        onChange={(e) => updateFormData("holidayPayHours", e.target.value)}
                        placeholder="20"
                      />
                      <span className="input-suffix">시간</span>
                    </div>
                    <div className="input-field" style={{ flex: 1 }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.holidayPayAmount}
                        onChange={(e) => updateFormData("holidayPayAmount", e.target.value)}
                        placeholder="10,030"
                      />
                      <span className="input-suffix">원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 월간 추가 휴일근무 수당 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">월간 추가 휴일근무 수당 </span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="salary-input-group">
                    <div className="input-field" style={{ maxWidth: "120px" }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.extraHolidayPayHours}
                        onChange={(e) => updateFormData("extraHolidayPayHours", e.target.value)}
                        placeholder="20"
                      />
                      <span className="input-suffix">시간</span>
                    </div>
                    <div className="input-field" style={{ flex: 1 }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.extraHolidayPayAmount}
                        onChange={(e) => updateFormData("extraHolidayPayAmount", e.target.value)}
                        placeholder="10,030"
                      />
                      <span className="input-suffix">원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 비과세항목 - 식대 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">비과세항목 </span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="tax-exempt-row">
                    <span className="tax-exempt-label">식대</span>
                    <div className="input-field" style={{ flex: 1 }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.mealAllowance}
                        onChange={(e) => updateFormData("mealAllowance", e.target.value)}
                        placeholder="200,000"
                      />
                      <span className="input-suffix">원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 비과세항목 - 자가운전보조금 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text"> </span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="tax-exempt-row">
                    <span className="tax-exempt-label">자가운전보조금</span>
                    <div className="input-field" style={{ flex: 1 }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.carAllowance}
                        onChange={(e) => updateFormData("carAllowance", e.target.value)}
                        placeholder="0"
                      />
                      <span className="input-suffix">원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 비과세항목 - 육아수당 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text"> </span>
                </div>
                <div className="form-field-input-wrapper">
                  <div className="tax-exempt-row">
                    <span className="tax-exempt-label">육아수당</span>
                    <div className="input-field" style={{ flex: 1 }}>
                      <input
                        type="number"
                        className="input-native"
                        value={formData.childcareAllowance}
                        onChange={(e) => updateFormData("childcareAllowance", e.target.value)}
                        placeholder="0"
                      />
                      <span className="input-suffix">원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 상여금 종류/상여금 */}
              <div className="form-field-row">
                <div className="form-field-label">
                  <span className="form-field-label-text">상여금 종류/상여금 </span>
                </div>
                <div className="form-field-input-wrapper" style={{ flexDirection: "column", alignItems: "stretch" }}>
                  <div className="bonus-list">
                    {formData.bonuses.map((bonus) => (
                      <div key={bonus.id} className="bonus-item">
                        <div className="bonus-item-row">
                          <div className="select-field" style={{ minWidth: "120px", maxWidth: "150px" }}>
                            <select
                              className="select-native"
                              value={bonus.type}
                              onChange={(e) => handleBonusChange(bonus.id, "type", e.target.value)}
                            >
                              <option value="">상여금 선택</option>
                              <option value="만근 상여">만근 상여</option>
                              <option value="직책 상여">직책 상여</option>
                              <option value="성과 상여">성과 상여</option>
                              <option value="명절 상여">명절 상여</option>
                            </select>
                            <svg className="form-field-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 10L12 15L7 10" stroke="#4F4F4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Toggle
                              checked={bonus.isActive}
                              onChange={(checked) => handleBonusChange(bonus.id, "isActive", checked)}
                            />
                          </div>
                          <div className="input-field" style={{ maxWidth: "150px" }}>
                            <input
                              type="number"
                              className="input-native"
                              value={bonus.amount}
                              onChange={(e) => handleBonusChange(bonus.id, "amount", e.target.value)}
                              placeholder="금액"
                            />
                            <span className="input-suffix">원</span>
                          </div>
                          <div className="input-field" style={{ flex: 1, minWidth: "100px" }}>
                            <input
                              type="text"
                              className="input-native"
                              value={bonus.memo}
                              onChange={(e) => handleBonusChange(bonus.id, "memo", e.target.value)}
                              placeholder="Memo"
                            />
                          </div>
                        </div>
                        <div className="bonus-item-actions">
                          <button
                            type="button"
                            className="bonus-delete-btn"
                            onClick={() => handleRemoveBonus(bonus.id)}
                          >
                            분류 삭제
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="bonus-add-btn"
                      onClick={handleAddBonus}
                    >
                      + 분류 추가
                    </button>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* 계약 근무 시간 섹션 */}
            <ContractWorkingHoursCard />

            {/* 액션 버튼 */}
            <div className="form-actions">
              <Button variant="secondary" onClick={handleCancel}>
                취소
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                저장
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
