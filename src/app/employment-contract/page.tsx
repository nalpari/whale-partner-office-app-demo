"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import SearchResultToggle from "@/components/SearchResultToggle";
import ContractSearchFilter, { ContractSearchFilters } from "@/components/ContractSearchFilter";
import Button from "@/components/Button";
import PerPageSelect from "@/components/PerPageSelect";
import ContractCard from "@/components/ContractCard";
import PaginationWrapper from "@/components/PaginationWrapper";
import SkeletonCard from "@/components/SkeletonCard";

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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function EmploymentContractPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async (page: number = 1, limit: number = 50, search?: string, status?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append('search', search);
      }
      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`/api/contracts?${params.toString()}`);

      if (!response.ok) {
        throw new Error('계약 데이터를 불러오는데 실패했습니다.');
      }

      const result = await response.json();
      setContracts(result.data || []);
      setPagination(result.pagination || {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts(pagination.page, pagination.limit);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchContracts(newPage, pagination.limit);
  };

  const handlePerPageChange = (newLimit: number) => {
    fetchContracts(1, newLimit);
  };

  const handleSearch = (filters: ContractSearchFilters) => {
    fetchContracts(1, pagination.limit, filters.employeeName, filters.contractStatus);
  };

  const handleFilterReset = () => {
    fetchContracts(1, pagination.limit);
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
              <h1 className="page-title">근로 계약 관리</h1>
              <Breadcrumb
                items={[
                  { label: "BP 직원 관리" },
                  { label: "근로 계약 관리", active: true }
                ]}
              />
            </div>
          </div>

          <div className="page-content">
            <SearchResultToggle count={pagination.total}>
              <ContractSearchFilter
                onSearch={handleSearch}
                onReset={handleFilterReset}
                onClose={handleFilterClose}
              />
            </SearchResultToggle>

            <div className="tables-section">
              <div className="tables-header">
                <Button variant="primary" onClick={() => router.push("/employment-contract/new")}>등록</Button>
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
                  <div style={{ color: 'red' }}>{error}</div>
                </div>
              )}

              {!loading && !error && (
                <div className="template-list">
                  <div className="template-list-cards">
                    {contracts.length > 0 ? (
                      contracts.map((contract) => (
                        <ContractCard
                          key={contract.id}
                          data={contract}
                        />
                      ))
                    ) : (
                      <div className="empty-state">
                        <div>등록된 계약이 없습니다.</div>
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
