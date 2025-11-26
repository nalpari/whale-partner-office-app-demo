"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import CollapsibleCard from "@/components/CollapsibleCard";

interface Employee {
  id: number;
  employee_id: string;
  name: string;
  position: string | null;
  phone: string | null;
  email: string | null;
  employee_classification: string | null;
  contract_classification: string | null;
}

interface ContractSalary {
  id: number;
  annual_salary: number | null;
  monthly_salary: number | null;
  hourly_wage: number | null;
}

// 아래 인터페이스들은 현재 DB 스키마에서 FK 관계 미설정
// 추후 스키마 업데이트 후 활성화 필요
// interface ContractWorkHour { ... }
// interface ContractBenefit { ... }
// interface ContractBonus { ... }
// interface ContractInsurance { ... }
// interface ContractFile { ... }

interface ContractDetail {
  id: number;
  employee_id: number;
  store_id: number | null;
  contract_status: string;
  is_electronic: boolean;
  company_name: string | null;
  store_name: string | null;
  brand_name: string | null;
  job_description: string | null;
  salary_type: string;
  pay_cycle: string;
  pay_day: string | null;
  contract_start_date: string;
  contract_end_date: string | null;
  work_start_date: string;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
  employees: Employee | null;
  stores: { id: number; name: string } | null;
  contract_salaries: ContractSalary | ContractSalary[] | null;
  // 아래 테이블들은 현재 DB 스키마에서 FK 관계가 설정되지 않음
  // contract_work_hours: ContractWorkHour[] | null;
  // contract_benefits: ContractBenefit[] | null;
  // contract_bonuses: ContractBonus[] | null;
  // contract_insurances: ContractInsurance[] | null;
  // contract_files: ContractFile[] | null;
}

export default function EmploymentContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContract = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/contracts/${params.id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("계약 정보를 찾을 수 없습니다.");
        }
        throw new Error("계약 정보를 불러오는데 실패했습니다.");
      }

      const result = await response.json();
      setContract(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchContract();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/contracts/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/employment-contract");
      }
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  const handleGoBack = () => {
    router.push("/employment-contract");
  };

  const handleSendContract = () => {
    alert("직원에게 계약서를 전송합니다.");
  };

  const handleDownloadContract = () => {
    alert("계약서(미날인원본)를 다운로드합니다.");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return dateString.split("T")[0];
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "-";
    return amount.toLocaleString() + "원";
  };

  const getContractStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      DRAFT: "작성중",
      SENT: "전송됨",
      SIGNED: "서명완료",
      COMPLETED: "계약완료",
      CANCELLED: "취소됨",
    };
    return statusMap[status] || status;
  };

  // 현재 DB 스키마에서 FK 관계가 설정되지 않아 사용 불가
  // 추후 스키마 업데이트 후 활성화 가능
  const getInsuranceNames = () => {
    // contract_insurances 테이블 관계 미설정
    return "-";
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="loading-container">
            <div>로딩 중...</div>
          </div>
        </div>
      </>
    );
  }

  if (error || !contract) {
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="error-container">
            <div style={{ color: "red" }}>
              {error || "계약 정보를 찾을 수 없습니다."}
            </div>
            <button
              onClick={handleGoBack}
              className="store-btn-basic"
              style={{ marginTop: "16px" }}
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </>
    );
  }

  // 급여 정보 가져오기 (배열 또는 단일 객체 대응)
  const salaries = contract.contract_salaries;
  const salary = Array.isArray(salaries) ? salaries[0] : salaries;

  // 근로 계약 Header 정보
  const headerInfoData = [
    {
      label: "전자계약 진행 상태",
      values: [
        getContractStatusLabel(contract.contract_status),
        contract.is_electronic ? "전자계약" : "서류계약",
      ],
    },
    {
      label: "직원명",
      values: [
        contract.employees?.employee_id || "-",
        contract.employees?.name || "-",
      ],
    },
    {
      label: "근무처 및 업무",
      values: [
        contract.company_name || "-",
        contract.store_name || "-",
        contract.brand_name || "-",
        contract.job_description || "-",
      ].filter((v) => v !== "-"),
    },
    {
      label: "근로계약 내용",
      values: [
        contract.salary_type || "-",
        contract.pay_cycle || "-",
        `${formatDate(contract.contract_start_date)} ~ ${formatDate(contract.contract_end_date)}`,
        formatDate(contract.work_start_date),
      ],
    },
    {
      label: "4대보험 가입여부",
      values: [getInsuranceNames()],
    },
    {
      label: "급여 계산 주기/급여일",
      values: [contract.pay_cycle || "-", contract.pay_day || "-"],
    },
    {
      label: "관련서류",
      values: ["등록된 서류 없음"], // contract_files 테이블 관계 미설정
    },
  ];

  // 급여 정보
  const salaryInfoData = [
    {
      label: "급여 정보",
      values: [
        `연봉: ${formatCurrency(salary?.annual_salary ?? null)}`,
        `월급: ${formatCurrency(salary?.monthly_salary ?? null)}`,
        `시급: ${salary?.hourly_wage?.toLocaleString() || "-"}원`,
      ],
    },
  ];

  // 비과세 항목 - contract_benefits 테이블 관계 미설정
  const benefitsData = [
    { label: "비과세 항목", values: ["등록된 비과세 항목이 없습니다."] },
  ];

  // 상여금 - contract_bonuses 테이블 관계 미설정
  const bonusesData = [
    { label: "상여금", values: ["등록된 상여금이 없습니다."] },
  ];

  // 급여 정보 전체 데이터
  const fullSalaryInfoData = [...salaryInfoData, ...benefitsData, ...bonusesData];

  // 계약 근무 시간 - contract_work_hours 테이블 관계 미설정
  const workHoursInfoData = [
    {
      label: "평일",
      values: ["등록된 평일 근무 시간이 없습니다."],
    },
    {
      label: "토요일",
      values: ["등록된 토요일 근무 시간이 없습니다."],
    },
    {
      label: "일요일",
      values: ["등록된 일요일 근무 시간이 없습니다."],
    },
  ];

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-body">
          <div className="page-title-section">
            <h1 className="page-title">근로 계약 정보 상세조회</h1>
            <Breadcrumb
              items={[
                { label: "BP 직원 관리" },
                { label: "근로 계약 관리" },
                { label: "근로 계약 정보 상세조회", active: true },
              ]}
            />
          </div>
          <div className="page-content">
            <div className="store-management-body">
              <div className="store-management-top-actions" style={{ flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                  <button
                    className="store-btn-basic"
                    type="button"
                    onClick={handleSendContract}
                    style={{ flex: 1 }}
                  >
                    직원에게 계약서 전송
                  </button>
                  <button
                    className="store-btn-basic"
                    type="button"
                    onClick={handleDownloadContract}
                    style={{ flex: 1 }}
                  >
                    계약서(미날인) 다운로드
                  </button>
                </div>
                <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                  <button
                    className="store-btn-gray"
                    type="button"
                    onClick={handleDelete}
                    style={{ flex: 1 }}
                  >
                    삭제
                  </button>
                  <button
                    className="store-btn-basic"
                    type="button"
                    onClick={handleGoBack}
                    style={{ flex: 1 }}
                  >
                    목록
                  </button>
                </div>
              </div>
              <div className="store-management-cards">
                <CollapsibleCard
                  title="근로 계약 Header 정보"
                  actions={[{ label: "수정" }]}
                  data={headerInfoData}
                />
                <CollapsibleCard
                  title="급여 정보"
                  actions={[{ label: "수정" }]}
                  data={fullSalaryInfoData}
                />
                <CollapsibleCard
                  title="계약 근무 시간"
                  actions={[{ label: "수정" }]}
                  data={workHoursInfoData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
