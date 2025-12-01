"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import StoreSelect from "@/components/StoreSelect";
import SearchResultToggle from "@/components/SearchResultToggle";
import BusinessPartnerSearchFilter, { BusinessPartnerSearchFilters } from "@/components/BusinessPartnerSearchFilter";
import Button from "@/components/Button";
import PerPageSelect from "@/components/PerPageSelect";
import BusinessPartnerCard from "@/components/BusinessPartnerCard";
import PaginationWrapper from "@/components/PaginationWrapper";
import LoadingScreen from "@/components/LoadingScreen";

interface BpType {
  id: string;
  code: string;
  name: string;
}

interface ServiceType {
  id: string;
  code: string;
  name: string;
}

interface BpService {
  id: string;
  service_type_id: string;
  start_date: string;
  status: string;
  service_types?: ServiceType;
}

interface BusinessPartner {
  id: string;
  master_id: string;
  bp_code: string | null;
  operation_status: string;
  company_name: string;
  brand_name: string | null;
  representative_name: string | null;
  created_at: string | null;
  bp_types?: BpType | null;
  bp_services?: BpService[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function BusinessPartnerPage() {
  const [partners, setPartners] = useState<BusinessPartner[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<BusinessPartnerSearchFilters>({
    headquarters: "",
    franchise: "",
    representativeName: "",
    operationStatus: "",
    serviceType: "",
    startDate: "",
    endDate: "",
  });

  const fetchPartners = async (
    page: number = 1,
    limit: number = 50,
    filters?: BusinessPartnerSearchFilters
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      if (filters?.representativeName) {
        params.append('search', filters.representativeName);
      }
      if (filters?.operationStatus) {
        params.append('operation_status', filters.operationStatus);
      }
      if (filters?.serviceType) {
        params.append('service_type', filters.serviceType);
      }
      if (filters?.startDate) {
        params.append('start_date', filters.startDate);
      }
      if (filters?.endDate) {
        params.append('end_date', filters.endDate);
      }

      const response = await fetch(`/api/business-partners?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Business Partner 데이터를 불러오는데 실패했습니다.');
      }

      const result = await response.json();
      setPartners(result.data || []);
      setPagination(result.pagination || {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      console.error('Error fetching business partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners(pagination.page, pagination.limit);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchPartners(newPage, pagination.limit, currentFilters);
  };

  const handlePerPageChange = (newLimit: number) => {
    fetchPartners(1, newLimit, currentFilters);
  };

  const handleSearch = (filters: BusinessPartnerSearchFilters) => {
    setCurrentFilters(filters);
    fetchPartners(1, pagination.limit, filters);
  };

  const handleFilterClose = () => {
    // 필터 닫기 처리 (SearchResultToggle에서 자동으로 처리됨)
  };

  const handleRegister = () => {
    // 등록 페이지로 이동
    window.location.href = '/business-partner/new';
  };

  return (
    <>
      <Header />
      <div className={`page-container ${loading ? 'page-container-loading' : ''}`}>
        <div className="page-body">
          <div className="page-header">
            <StoreSelect value="(운영) 힘이나는커피생활 - BMI1234" />
            <div className="page-title-section">
              <h1 className="page-title">Business Partner Master</h1>
              <Breadcrumb
                items={[
                  { label: "Master data 관리" },
                  { label: "Business Partner Master", active: true }
                ]}
              />
            </div>
          </div>

          <div className="page-content">
            <SearchResultToggle count={pagination.total}>
              <BusinessPartnerSearchFilter
                onSearch={handleSearch}
                onClose={handleFilterClose}
              />
            </SearchResultToggle>

            <div className="tables-section">
              <div className="tables-header">
                <Button variant="primary" onClick={handleRegister}>등록</Button>
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
                  <div style={{ color: 'red' }}>{error}</div>
                </div>
              )}

              {!loading && !error && (
                <div className="template-list">
                  <div className="template-list-cards">
                    {partners.length > 0 ? (
                      partners.map((partner, index) => (
                        <BusinessPartnerCard
                          key={partner.id}
                          data={partner}
                          index={(pagination.page - 1) * pagination.limit + index + 1}
                        />
                      ))
                    ) : (
                      <div className="empty-state">
                        <div>등록된 Business Partner가 없습니다.</div>
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
