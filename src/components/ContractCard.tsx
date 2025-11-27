"use client";

import { useRouter } from "next/navigation";

interface ContractData {
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
  employees: {
    id: number;
    employee_id: string;
    name: string;
    position: string | null;
    employee_classification: string | null;
    contract_classification: string | null;
  } | null;
  stores: {
    id: number;
    name: string;
  } | null;
  contract_salaries: {
    annual_salary: number | null;
    monthly_salary: number | null;
    hourly_wage: number | null;
  } | {
    annual_salary: number | null;
    monthly_salary: number | null;
    hourly_wage: number | null;
  }[] | null;
}

interface ContractCardProps {
  data: ContractData;
  isSelected?: boolean;
}

export default function ContractCard({ data, isSelected = false }: ContractCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/employment-contract/${data.id}`);
  };

  // 계약 상태 표시
  const getContractStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return '작성중';
      case 'IN_PROGRESS':
        return '진행중';
      case 'COMPLETED':
        return '계약완료';
      default:
        return status;
    }
  };

  // 계약 상태 색상
  const getContractStatusStyle = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return { color: '#F59E0B', backgroundColor: '#FEF3C7' };
      case 'IN_PROGRESS':
        return { color: '#3B82F6', backgroundColor: '#DBEAFE' };
      case 'COMPLETED':
        return { color: '#10B981', backgroundColor: '#D1FAE5' };
      default:
        return { color: '#6B7280', backgroundColor: '#F3F4F6' };
    }
  };

  // 급여 유형 표시
  const getSalaryTypeLabel = (type: string) => {
    switch (type) {
      case 'ANNUAL':
        return '포괄연봉제';
      case 'MONTHLY':
        return '월급';
      case 'HOURLY':
        return '시급';
      default:
        return type;
    }
  };

  // 급여 정보 포맷
  const formatSalary = () => {
    if (!data.contract_salaries) return '-';

    // 배열인 경우 첫 번째 요소 사용, 객체인 경우 그대로 사용
    const salary = Array.isArray(data.contract_salaries)
      ? data.contract_salaries[0]
      : data.contract_salaries;

    if (!salary) return '-';

    if (salary.annual_salary) {
      return `${(salary.annual_salary / 10000).toLocaleString()}만원`;
    }
    if (salary.monthly_salary) {
      return `${salary.monthly_salary.toLocaleString()}원/월`;
    }
    if (salary.hourly_wage) {
      return `${salary.hourly_wage.toLocaleString()}원/시`;
    }
    return '-';
  };

  // 계약 기간 포맷
  const formatContractPeriod = () => {
    const start = data.contract_start_date?.split('T')[0] || '-';
    const end = data.contract_end_date?.split('T')[0] || '무기한';
    return `${start} ~ ${end}`;
  };

  const statusStyle = getContractStatusStyle(data.contract_status);

  return (
    <div
      className={isSelected ? "template-card-selected" : "template-card"}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="template-card-body">
        <div className="template-card-content">
          <div className="template-card-info">
            <div className="template-card-fields">
              <div className="template-field">
                <div className="template-field-label">전자계약 상태</div>
                <div className="template-field-value">
                  <span
                    style={{
                      ...statusStyle,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {getContractStatusLabel(data.contract_status)}
                  </span>
                  {data.is_electronic && (
                    <span style={{ marginLeft: '8px', color: '#6B7280', fontSize: '12px' }}>
                      전자계약
                    </span>
                  )}
                </div>
              </div>
              <div className="template-field">
                <div className="template-field-label">직원명</div>
                <div className="template-field-value">
                  {data.employees?.employee_id} | {data.employees?.name || '-'}
                </div>
              </div>
              <div className="template-field">
                <div className="template-field-label">근무처 및 업무</div>
                <div className="template-field-value" style={{ fontSize: '13px' }}>
                  {data.company_name || '-'} | {data.store_name || '-'} | {data.job_description || '-'}
                </div>
              </div>
              <div className="template-field">
                <div className="template-field-label">근로계약 내용</div>
                <div className="template-field-value">
                  {getSalaryTypeLabel(data.salary_type)} | {formatSalary()} | {formatContractPeriod()}
                </div>
              </div>
              <div className="template-field">
                <div className="template-field-label">직원분류</div>
                <div className="template-field-value">
                  {data.employees?.employee_classification || '-'}
                </div>
              </div>
              <div className="template-field">
                <div className="template-field-label">계약분류</div>
                <div className="template-field-value">
                  {data.employees?.contract_classification || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
