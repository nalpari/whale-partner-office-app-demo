"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import SearchResultToggle from "@/components/SearchResultToggle";
import AttendanceSearchFilter, { AttendanceSearchFilters } from "@/components/AttendanceSearchFilter";
import PerPageSelect from "@/components/PerPageSelect";
import AttendanceCard from "@/components/AttendanceCard";
import PaginationWrapper from "@/components/PaginationWrapper";
import StoreSelect from "@/components/StoreSelect";
import SkeletonCard from "@/components/SkeletonCard";

interface AttendanceData {
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
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SearchFiltersState {
  search?: string;
  workStatus?: string;
  storeId?: string;
  startDate?: string;
  endDate?: string;
}

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<AttendanceData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFiltersState>({});

  const fetchAttendances = useCallback(async (
    page: number = 1,
    limit: number = 50,
    searchFilters: SearchFiltersState = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      // API 쿼리 파라미터 구성
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (searchFilters.search) {
        params.append('search', searchFilters.search);
      }
      if (searchFilters.workStatus) {
        params.append('workStatus', searchFilters.workStatus);
      }
      if (searchFilters.storeId) {
        params.append('storeId', searchFilters.storeId);
      }
      if (searchFilters.startDate) {
        params.append('startDate', searchFilters.startDate);
      }
      if (searchFilters.endDate) {
        params.append('endDate', searchFilters.endDate);
      }

      const response = await fetch(`/api/attendances?${params.toString()}`);

      if (!response.ok) {
        throw new Error('출퇴근 현황을 불러오는데 실패했습니다.');
      }

      const result = await response.json();

      setAttendances(result.data || []);
      setPagination(result.pagination || {
        page,
        limit,
        total: 0,
        totalPages: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      console.error("Error fetching attendances:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendances(pagination.page, pagination.limit, filters);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchAttendances(newPage, pagination.limit, filters);
  };

  const handlePerPageChange = (newLimit: number) => {
    fetchAttendances(1, newLimit, filters);
  };

  const handleSearch = (searchFilters: AttendanceSearchFilters) => {
    const newFilters: SearchFiltersState = {
      search: searchFilters.employeeName,
      workStatus: searchFilters.workStatus,
    };
    setFilters(newFilters);
    fetchAttendances(1, pagination.limit, newFilters);
  };

  const handleFilterReset = () => {
    setFilters({});
    fetchAttendances(1, pagination.limit, {});
  };

  const handleFilterClose = () => {
    // 필터 닫기 처리
  };

  return (
    <>
      <Header />
      <div className={`page-container ${loading ? "page-container-loading" : ""}`}>
        <StoreSelect value="을지로3가점" />
        <div className="page-body">
          <div className="page-header">
            <div className="page-title-section">
              <h1 className="page-title">출퇴근 현황</h1>
              <Breadcrumb
                items={[
                  { label: "근무 현황" },
                  { label: "출퇴근 현황", active: true },
                ]}
              />
            </div>
          </div>

          <div className="page-content">
            <SearchResultToggle count={pagination.total}>
              <AttendanceSearchFilter
                onSearch={handleSearch}
                onReset={handleFilterReset}
                onClose={handleFilterClose}
              />
            </SearchResultToggle>

            <div className="tables-section">
              <div className="tables-header">
                <PerPageSelect
                  value={pagination.limit}
                  onChange={handlePerPageChange}
                />
              </div>

              {loading && (
                <div className="template-list">
                  <div className="template-list-cards">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="error-container">
                  <div style={{ color: "red" }}>{error}</div>
                </div>
              )}

              {!loading && !error && (
                <div className="template-list">
                  <div className="template-list-cards">
                    {attendances.length > 0 ? (
                      attendances.map((attendance) => (
                        <AttendanceCard key={attendance.id} data={attendance} />
                      ))
                    ) : (
                      <div className="empty-state">
                        <div>등록된 출퇴근 현황이 없습니다.</div>
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
