"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import SearchResultToggle from "@/components/SearchResultToggle";
import PayslipSearchFilter, { PayslipSearchFilters } from "@/components/PayslipSearchFilter";
import Button from "@/components/Button";
import PerPageSelect from "@/components/PerPageSelect";
import PayslipCard from "@/components/PayslipCard";
import PaginationWrapper from "@/components/PaginationWrapper";
import StoreSelect from "@/components/StoreSelect";
import LoadingScreen from "@/components/LoadingScreen";

interface PayslipData {
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
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 임시 더미 데이터
const dummyPayslips: PayslipData[] = [
  {
    id: 1,
    workStatus: "근무",
    headquarters: "주식회사 마름인",
    franchise: "을지로3가점",
    store: "을지로3가점",
    employeeName: "홍길동",
    employeeClassification: "본사 직원",
    payDate: "2025-01-01",
    registrationDate: "2025-01-01",
    payslipStatus: "pending",
  },
  {
    id: 2,
    workStatus: "퇴사",
    headquarters: "주식회사 마름인",
    franchise: "을지로3가점",
    store: "을지로3가점",
    employeeName: "김길수",
    employeeClassification: "점포 직원",
    payDate: "2025-01-01",
    registrationDate: "2025-01-01",
    payslipStatus: "completed",
  },
  {
    id: 3,
    workStatus: "근무",
    headquarters: "주식회사 마름인",
    franchise: "을지로3가점",
    store: "을지로3가점",
    employeeName: "구로구",
    employeeClassification: "점포 매니저",
    payDate: "2025-01-01",
    registrationDate: "2025-01-01",
    payslipStatus: "completed",
  },
];

export default function PayslipPage() {
  const router = useRouter();
  const [payslips, setPayslips] = useState<PayslipData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayslips = async (page: number = 1, limit: number = 50) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: 실제 API 연동 시 교체
      // 임시로 더미 데이터 사용
      await new Promise((resolve) => setTimeout(resolve, 300));

      setPayslips(dummyPayslips);
      setPagination({
        page,
        limit,
        total: dummyPayslips.length,
        totalPages: Math.ceil(dummyPayslips.length / limit),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      console.error("Error fetching payslips:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslips(pagination.page, pagination.limit);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchPayslips(newPage, pagination.limit);
  };

  const handlePerPageChange = (newLimit: number) => {
    fetchPayslips(1, newLimit);
  };

  const handleSearch = (filters: PayslipSearchFilters) => {
    console.log("Search filters:", filters);
    fetchPayslips(1, pagination.limit);
  };

  const handleFilterReset = () => {
    fetchPayslips(1, pagination.limit);
  };

  const handleFilterClose = () => {
    // 필터 닫기 처리
  };

  const handleExcelUpload = () => {
    alert("엑셀 업로드");
  };

  return (
    <>
      <Header />
      <div className={`page-container ${loading ? "page-container-loading" : ""}`}>
        <StoreSelect value="을지로3가점" />
        <div className="page-body">
          <div className="page-header">
            <div className="page-title-section">
              <h1 className="page-title">정직원 급여명세서</h1>
              <Breadcrumb
                items={[
                  { label: "급여 명세서" },
                  { label: "정직원 급여명세서", active: true },
                ]}
              />
            </div>
          </div>

          <div className="page-content">
            <SearchResultToggle count={pagination.total}>
              <PayslipSearchFilter
                onSearch={handleSearch}
                onReset={handleFilterReset}
                onClose={handleFilterClose}
              />
            </SearchResultToggle>

            <div className="tables-section">
              <div className="tables-header">
                <Button variant="secondary" onClick={handleExcelUpload}>
                  엑셀
                </Button>
                <Button variant="primary" onClick={() => router.push("/payslip/register")}>
                  등록
                </Button>
                <PerPageSelect
                  value={pagination.limit}
                  onChange={handlePerPageChange}
                />
              </div>

              {loading && (
                <LoadingScreen type="list" cardCount={6} showHeader={false} />
              )}

              {error && (
                <div className="error-container">
                  <div style={{ color: "red" }}>{error}</div>
                </div>
              )}

              {!loading && !error && (
                <div className="template-list">
                  <div className="template-list-cards">
                    {payslips.length > 0 ? (
                      payslips.map((payslip) => (
                        <PayslipCard key={payslip.id} data={payslip} />
                      ))
                    ) : (
                      <div className="empty-state">
                        <div>등록된 급여명세서가 없습니다.</div>
                      </div>
                    )}
                  </div>

                  <PaginationWrapper
                    totalPages={pagination.totalPages}
                    currentPage={pagination.page}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
