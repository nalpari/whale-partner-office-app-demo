"use client";

import { useRouter } from "next/navigation";

interface PayslipCardProps {
  data: {
    id: number;
    workStatus: string;
    headquarters: string;
    franchise: string;
    store: string;
    employeeName: string;
    employeeClassification: string;
    payDate: string;
    registrationDate: string;
    payslipStatus: "pending" | "email_sent" | "completed";
  };
}

export default function PayslipCard({ data }: PayslipCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/payslip/${data.id}`);
  };

  const handleEmailSend = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("이메일 전송");
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "이메일 전송", className: "payslip-status-pending" };
      case "email_sent":
        return { text: "전송 완료", className: "payslip-status-sent" };
      case "completed":
        return { text: "전송 완료", className: "payslip-status-completed" };
      default:
        return { text: "-", className: "" };
    }
  };

  const statusInfo = getStatusLabel(data.payslipStatus);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return dateString.split("T")[0];
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
          <span className="payslip-card-label">급여일</span>
          <span className="payslip-card-value">{formatDate(data.payDate)}</span>
        </div>
        <div className="payslip-card-field">
          <span className="payslip-card-label">등록일</span>
          <span className="payslip-card-value">{formatDate(data.registrationDate)}</span>
        </div>
      </div>

      <div className="payslip-card-row">
        <div className="payslip-card-field payslip-card-field-full">
          <span className="payslip-card-label">급여명세서</span>
          {data.payslipStatus === "pending" ? (
            <button
              className={`payslip-status-btn ${statusInfo.className}`}
              onClick={handleEmailSend}
            >
              {statusInfo.text}
            </button>
          ) : (
            <span className={`payslip-status-badge ${statusInfo.className}`}>
              {statusInfo.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
