"use client";

import { useRouter } from "next/navigation";

interface EmployeeData {
  id: number;
  employee_id: string;
  name: string;
  position: string | null;
  hire_date: string | null;
  phone: string | null;
  email: string | null;
  workplace_type: string | null;
  workplace_name: string | null;
  workplace_full_name: string | null;
  employee_classification: string | null;
  contract_classification: string | null;
  employment_status: string | null;
  approval_status: string | null;
  created_at: string | null;
}

interface EmployeeCardProps {
  data: EmployeeData;
  isSelected?: boolean;
}

export default function EmployeeCard({ data, isSelected = false }: EmployeeCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/employee-management/${data.id}`);
  };
  // 이미지 리스트 항목에 맞춰 표시할 필드만 포함
  // #, 근무여부, 직원 회원 상태, 본사, 가맹점, 점포, 직원명, 직원분류, 계약분류
  
  const getHeadquarters = () => {
    if (data.workplace_type === '본사' || data.workplace_full_name?.includes('따름인')) {
      return data.workplace_full_name || data.workplace_name || '따름인';
    }
    return '-';
  };

  const getFranchise = () => {
    if (data.workplace_type === '가맹점' || data.workplace_name?.includes('점')) {
      return data.workplace_name || '-';
    }
    return '-';
  };

  const getStore = () => {
    if (data.workplace_type === '점포' || data.workplace_name?.includes('점')) {
      return data.workplace_name || '-';
    }
    return '-';
  };

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
                <div className="template-field-label">근무여부</div>
                <div className="template-field-value">{data.employment_status || '-'}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">직원 회원 상태</div>
                <div className="template-field-value">{data.approval_status || '-'}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">본사</div>
                <div className="template-field-value">{getHeadquarters()}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">가맹점</div>
                <div className="template-field-value">{getFranchise()}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">점포</div>
                <div className="template-field-value">{getStore()}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">직원명</div>
                <div className="template-field-value">{data.name}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">직원분류</div>
                <div className="template-field-value">{data.employee_classification || '-'}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">계약분류</div>
                <div className="template-field-value">{data.contract_classification || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

