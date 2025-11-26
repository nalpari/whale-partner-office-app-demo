"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import SearchResultToggle from "@/components/SearchResultToggle";
import EmployeeSearchFilter, { EmployeeSearchFilters } from "@/components/EmployeeSearchFilter";
import Button from "@/components/Button";
import PerPageSelect from "@/components/PerPageSelect";
import EmployeeCard from "@/components/EmployeeCard";
import PaginationWrapper from "@/components/PaginationWrapper";

interface Employee {
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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async (page: number = 1, limit: number = 50) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/employees?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('직원 데이터를 불러오는데 실패했습니다.');
      }

      const result = await response.json();
      setEmployees(result.data || []);
      setPagination(result.pagination || {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(pagination.page, pagination.limit);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchEmployees(newPage, pagination.limit);
  };

  const handlePerPageChange = (newLimit: number) => {
    fetchEmployees(1, newLimit);
  };

  const handleSearch = (filters: EmployeeSearchFilters) => {
    // 검색 필터를 적용하여 직원 목록 조회
    const searchParams = new URLSearchParams();
    if (filters.employeeName) {
      searchParams.append('search', filters.employeeName);
    }
    if (filters.employmentStatus) {
      searchParams.append('employment_status', filters.employmentStatus);
    }
    // 추가 필터 파라미터들을 필요에 따라 추가
    fetchEmployees(1, pagination.limit);
  };

  const handleFilterClose = () => {
    // 필터 닫기 처리 (SearchResultToggle에서 자동으로 처리됨)
  };

  return (
    <>
      <Header />
      <div className={`page-container ${loading ? 'page-container-loading' : ''}`}>
        <div className="page-body">
          <div className="page-header">
            <div className="page-title-section">
              <h1 className="page-title">직원 정보 관리</h1>
              <Breadcrumb 
                items={[
                  { label: "BP 직원 관리" },
                  { label: "직원 정보 관리", active: true }
                ]}
              />
            </div>
          </div>

          <div className="page-content">
            <SearchResultToggle count={pagination.total}>
              <EmployeeSearchFilter
                onSearch={handleSearch}
                onClose={handleFilterClose}
              />
            </SearchResultToggle>

            <div className="tables-section">
              <div className="tables-header">
                <Button variant="primary">등록</Button>
                <PerPageSelect 
                  value={pagination.limit} 
                  onChange={handlePerPageChange}
                />
              </div>

              {loading && (
                <div className="loading-container">
                  <div>로딩 중...</div>
                </div>
              )}

              {error && (
                <div className="error-container">
                  <div style={{ color: 'red' }}>{error}</div>
                </div>
              )}

              {!loading && !error && (
                <div className="template-list">
                  <div className="template-list-cards">
                    {employees.length > 0 ? (
                      employees.map((employee) => (
                        <EmployeeCard 
                          key={employee.id} 
                          data={employee} 
                        />
                      ))
                    ) : (
                      <div className="empty-state">
                        <div>등록된 직원이 없습니다.</div>
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

