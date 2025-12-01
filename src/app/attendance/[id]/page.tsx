"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import AttendanceTimeCard from "@/components/AttendanceTimeCard";
import LoadingScreen from "@/components/LoadingScreen";

interface AttendanceRecord {
  date: string;
  sessions: {
    startTime: string;
    endTime: string;
    workHours: string;
  }[];
  totalHours?: string;
  isAbsent?: boolean;
  memo?: string;
}

interface AttendanceDetail {
  id: number;
  employeeCode: string;
  workStatus: string;
  headquarters: string;
  franchise: string;
  store: string;
  employeeName: string;
  employeeClassification: string;
  contractType: string;
  workDay: string;
  records: AttendanceRecord[];
}

export default function AttendanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [detail, setDetail] = useState<AttendanceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceDetail = useCallback(async (employeeId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/attendances/${employeeId}`);

      if (!response.ok) {
        throw new Error('출퇴근 상세 정보를 불러오는데 실패했습니다.');
      }

      const result = await response.json();
      setDetail(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error('Error fetching attendance detail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      fetchAttendanceDetail(id);
    }
  }, [params.id, fetchAttendanceDetail]);

  const handleBackToList = () => {
    router.push("/attendance");
  };

  if (loading) {
    return <LoadingScreen type="detail" blockCount={3} />;
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="error-container">
            <div style={{ color: "red" }}>{error}</div>
            <button className="btn-primary" onClick={handleBackToList}>
              목록으로
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!detail) {
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="error-container">
            <div>데이터를 찾을 수 없습니다.</div>
            <button className="btn-primary" onClick={handleBackToList}>
              목록으로
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-body">
          <div className="page-header">
            <div className="page-title-section">
              <h1 className="page-title">출퇴근 현황</h1>
              <Breadcrumb
                items={[
                  { label: "근무 현황" },
                  { label: "출퇴근 현황" },
                  { label: "상세", active: true },
                ]}
              />
            </div>
          </div>

          <div className="page-content">
            <div className="attendance-register-actions">
              <button className="btn-primary" type="button" onClick={handleBackToList}>
                목록
              </button>
            </div>

            {/* 직원 정보 카드 */}
            <div className="attendance-employee-info">
              <div className="payslip-card">
                <div className="payslip-card-row">
                  <div className="payslip-card-field">
                    <span className="payslip-card-label">본사/가맹점</span>
                    <span className="payslip-card-value">{detail.headquarters}</span>
                  </div>
                  <div className="payslip-card-field">
                    <span className="payslip-card-label">점포</span>
                    <span className="payslip-card-value">{detail.store}</span>
                  </div>
                </div>
                <div className="payslip-card-row">
                  <div className="payslip-card-field">
                    <span className="payslip-card-label">직원명</span>
                    <span className="payslip-card-value">{detail.employeeName}</span>
                  </div>
                  <div className="payslip-card-field">
                    <span className="payslip-card-label">사번</span>
                    <span className="payslip-card-value">{detail.employeeCode}</span>
                  </div>
                </div>
                <div className="payslip-card-row">
                  <div className="payslip-card-field">
                    <span className="payslip-card-label">직원분류</span>
                    <span className="payslip-card-value">{detail.employeeClassification}</span>
                  </div>
                  <div className="payslip-card-field">
                    <span className="payslip-card-label">계약분류</span>
                    <span className="payslip-card-value">{detail.contractType}</span>
                  </div>
                </div>
                <div className="payslip-card-row">
                  <div className="payslip-card-field">
                    <span className="payslip-card-label">근무여부</span>
                    <span className="payslip-card-value">{detail.workStatus}</span>
                  </div>
                  <div className="payslip-card-field">
                    <span className="payslip-card-label">근무요일</span>
                    <span className="payslip-card-value">{detail.workDay}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 출퇴근 기록 카드 목록 */}
            <div className="attendance-time-cards">
              {detail.records.length > 0 ? (
                detail.records.map((record, index) => (
                  <AttendanceTimeCard
                    key={index}
                    date={record.date}
                    sessions={record.sessions}
                    totalHours={record.totalHours}
                    isAbsent={record.isAbsent}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <div>출퇴근 기록이 없습니다.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
