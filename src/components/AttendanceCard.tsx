"use client";

import { useRouter } from "next/navigation";

interface AttendanceCardProps {
  data: {
    id: number;
    employeeId?: number;
    contractId?: number;
    workStatus: string;
    headquarters: string;
    franchise: string;
    store: string;
    employeeName: string;
    employeeClassification: string;
    contractType: string;
    workDay: string; // 평일, 토요일, 일요일 형식
  };
}

export default function AttendanceCard({ data }: AttendanceCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // employeeId가 있으면 직원 기준으로, 없으면 기존 id 사용
    const targetId = data.employeeId || data.id;
    router.push(`/attendance/${targetId}`);
  };

  return (
    <div className="payslip-card" onClick={handleClick}>
      <div className="payslip-card-row">
        <div className="payslip-card-field">
          <span className="payslip-card-label">근무여부</span>
          <span className="payslip-card-value">{data.workStatus || "-"}</span>
        </div>
        <div className="payslip-card-field">
          <span className="payslip-card-label">본사</span>
          <span className="payslip-card-value">{data.headquarters || "-"}</span>
        </div>
      </div>

      <div className="payslip-card-row">
        <div className="payslip-card-field">
          <span className="payslip-card-label">가맹점</span>
          <span className="payslip-card-value">{data.franchise || "-"}</span>
        </div>
        <div className="payslip-card-field">
          <span className="payslip-card-label">점포</span>
          <span className="payslip-card-value">{data.store || "-"}</span>
        </div>
      </div>

      <div className="payslip-card-row">
        <div className="payslip-card-field">
          <span className="payslip-card-label">직원명</span>
          <span className="payslip-card-value">{data.employeeName || "-"}</span>
        </div>
        <div className="payslip-card-field">
          <span className="payslip-card-label">직원분류</span>
          <span className="payslip-card-value">{data.employeeClassification || "-"}</span>
        </div>
      </div>

      <div className="payslip-card-row">
        <div className="payslip-card-field">
          <span className="payslip-card-label">계약분류</span>
          <span className="payslip-card-value">{data.contractType || "-"}</span>
        </div>
        <div className="payslip-card-field">
          <span className="payslip-card-label">근무요일</span>
          <span className="payslip-card-value">{data.workDay || "-"}</span>
        </div>
      </div>
    </div>
  );
}
