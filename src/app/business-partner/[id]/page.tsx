"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import StoreSelect from "@/components/StoreSelect";
import CollapsibleCard from "@/components/CollapsibleCard";
import LoadingScreen from "@/components/LoadingScreen";

interface BpType {
  id: string;
  code: string;
  name: string;
}

interface BusinessCategory {
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
  start_date: string | null;
  status: string;
  service_types?: ServiceType;
}

interface TargetBp {
  id: string;
  master_id: string;
  company_name: string;
  brand_name: string | null;
  operation_status: string;
}

interface BpPartnerFunction {
  id: string;
  partner_function_type: string;
  target_bp_id: string;
  target_bp?: TargetBp;
}

interface BusinessPartner {
  id: string;
  master_id: string;
  bp_code: string | null;
  operation_status: string;
  bp_type_id: string | null;
  company_name: string;
  brand_name: string | null;
  business_registration_number: string | null;
  business_category_id: string | null;
  postal_code: string | null;
  address_road: string | null;
  address_detail: string | null;
  address_full: string | null;
  representative_name: string | null;
  representative_phone: string | null;
  representative_email: string | null;
  lnb_logo_url: string | null;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
  bp_types?: BpType | null;
  business_categories?: BusinessCategory | null;
  bp_services?: BpService[];
  bp_partner_functions?: BpPartnerFunction[];
}

export default function BusinessPartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [partner, setPartner] = useState<BusinessPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartner = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/business-partners/${params.id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Business Partner를 찾을 수 없습니다.');
        }
        throw new Error('Business Partner 정보를 불러오는데 실패했습니다.');
      }

      const result = await response.json();
      setPartner(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchPartner();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/business-partners/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/business-partner');
      }
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleGoBack = () => {
    router.push('/business-partner');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return dateString.split('T')[0];
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 운영 상태 한글 변환
  const getOperationStatusText = (status: string) => {
    switch (status) {
      case 'CONSULTING':
        return '상담중';
      case 'OPERATING':
        return '운영';
      case 'TERMINATED':
        return '종료';
      default:
        return status;
    }
  };

  // 서비스 상태 한글 변환
  const getServiceStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '활성';
      case 'INACTIVE':
        return '비활성';
      case 'PENDING':
        return '대기';
      default:
        return status;
    }
  };

  // Partner Function 타입 한글 변환
  const getPartnerFunctionTypeText = (type: string) => {
    switch (type) {
      case 'HEADQUARTERS':
        return '본사';
      case 'FRANCHISE':
        return '가맹점';
      case 'BILL_TO_PARTY':
        return 'Bill to Party';
      default:
        return type;
    }
  };


  if (loading) {
    return <LoadingScreen type="detail" blockCount={4} />;
  }

  if (error || !partner) {
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="error-container">
            <div style={{ color: 'red' }}>{error || 'Business Partner 정보를 찾을 수 없습니다.'}</div>
            <button onClick={handleGoBack} className="store-btn-basic" style={{ marginTop: '16px' }}>
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </>
    );
  }

  // Business Partner Header 정보
  const headerInfoData = [
    {
      label: "운영여부",
      values: [
        `${getOperationStatusText(partner.operation_status)} | ${partner.bp_types?.name || '-'}`,
      ],
    },
    {
      label: "Business Partner 정보",
      values: [
        `${partner.bp_types?.name || '-'} | ${partner.company_name}`,
        `${partner.brand_name || '-'} | ${partner.master_id}`,
      ],
    },
    {
      label: "Business Partner 주소",
      values: [partner.address_full || `${partner.address_road || ''} ${partner.address_detail || ''}`.trim() || '-'],
    },
    {
      label: "대표자 정보",
      values: [
        `${partner.representative_name || '-'} | ${partner.representative_phone || '-'} | ${partner.representative_email || '-'}`,
      ],
    },
    {
      label: "분류 정보",
      values: [partner.business_categories?.name || '-'],
    },
    {
      label: "LNB 로고",
      values: [partner.lnb_logo_url ? partner.lnb_logo_url.split('/').pop() || '-' : '-'],
    },
  ];

  // Partner Function 정보
  const partnerFunctionData = partner.bp_partner_functions && partner.bp_partner_functions.length > 0
    ? partner.bp_partner_functions.map((pf) => ({
      label: getPartnerFunctionTypeText(pf.partner_function_type),
      values: [
        pf.target_bp
          ? `(${getOperationStatusText(pf.target_bp.operation_status)}) ${pf.target_bp.company_name}${pf.target_bp.brand_name ? ` | ${pf.target_bp.brand_name}` : ''} | ${pf.target_bp.master_id}`
          : '-',
      ],
    }))
    : [{ label: "Partner Function", values: ["등록된 Partner Function이 없습니다."] }];

  // 사용 서비스 정보
  const serviceInfoData = partner.bp_services && partner.bp_services.length > 0
    ? partner.bp_services.map((service) => ({
      label: service.service_types?.name || '-',
      values: [
        `시작일: ${formatDate(service.start_date)} | 상태: ${getServiceStatusText(service.status)}`,
      ],
    }))
    : [{ label: "사용 서비스", values: ["등록된 서비스가 없습니다."] }];

  // 등록 및 수정 이력 데이터
  const historyInfoData = [
    {
      label: "등록자",
      values: [partner.created_by || '-'],
    },
    {
      label: "등록일시",
      values: [formatDateTime(partner.created_at)],
    },
    {
      label: "최종수정자",
      values: [partner.updated_by || '-'],
    },
    {
      label: "최종수정일시",
      values: [formatDateTime(partner.updated_at)],
    },
  ];

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-body">
          <div className="page-header">
            <StoreSelect value={`(${getOperationStatusText(partner.operation_status)}) ${partner.brand_name || partner.company_name} - ${partner.bp_code || partner.master_id}`} />
            <div className="page-title-section">
              <h1 className="page-title">Business Partner Master</h1>
              <Breadcrumb
                items={[
                  { label: "Master data 관리" },
                  { label: "Business Partner Master" },
                  { label: "Business Partner 정보 상세조회", active: true },
                ]}
              />
            </div>
          </div>
          <div className="page-content">
            <div className="store-management-body">
              <div className="store-management-top-actions">
                <button className="store-btn-gray" type="button" onClick={handleDelete}>
                  삭제
                </button>
                <button className="store-btn-basic" type="button" onClick={handleGoBack}>
                  목록
                </button>
              </div>
              <div className="store-management-cards">
                <CollapsibleCard
                  title="Business Partner Header 정보"
                  actions={[{ label: "수정" }]}
                  data={headerInfoData}
                />
                <CollapsibleCard
                  title="Partner Function"
                  actions={[{ label: "수정" }]}
                  data={partnerFunctionData}
                />
                <CollapsibleCard
                  title="사용 서비스"
                  actions={[{ label: "수정" }]}
                  data={serviceInfoData}
                />
                <CollapsibleCard
                  title="등록 및 수정 이력"
                  actions={[]}
                  data={historyInfoData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
