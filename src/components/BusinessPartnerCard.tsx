"use client";

import { useRouter } from "next/navigation";

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

interface BusinessPartnerData {
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

interface BusinessPartnerCardProps {
  data: BusinessPartnerData;
  index: number;
  isSelected?: boolean;
}

export default function BusinessPartnerCard({ data, index, isSelected = false }: BusinessPartnerCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/business-partner/${data.id}`);
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

  // 운영 상태 색상 클래스
  const getOperationStatusClass = (status: string) => {
    switch (status) {
      case 'CONSULTING':
        return 'status-consulting';
      case 'OPERATING':
        return 'status-operating';
      case 'TERMINATED':
        return 'status-terminated';
      default:
        return '';
    }
  };

  // 사용 서비스 목록 가져오기
  const getServiceNames = () => {
    if (!data.bp_services || data.bp_services.length === 0) {
      return '-';
    }
    return data.bp_services
      .filter(service => service.status === 'ACTIVE')
      .map(service => service.service_types?.name || '')
      .filter(name => name)
      .join(', ') || '-';
  };

  // 등록일 포맷
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\. /g, '-').replace('.', '');
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
                <div className="template-field-label">#</div>
                <div className="template-field-value">{index}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">운영여부</div>
                <div className={`template-field-value ${getOperationStatusClass(data.operation_status)}`}>
                  {getOperationStatusText(data.operation_status)}
                </div>
              </div>
              <div className="template-field">
                <div className="template-field-label">본사</div>
                <div className="template-field-value">{data.company_name}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">가맹점</div>
                <div className="template-field-value">{data.brand_name || '-'}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">대표자</div>
                <div className="template-field-value">{data.representative_name || '-'}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">등록자</div>
                <div className="template-field-value">hs_admin</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">등록일</div>
                <div className="template-field-value">{formatDate(data.created_at)}</div>
              </div>
              <div className="template-field">
                <div className="template-field-label">사용 서비스</div>
                <div className="template-field-value">{getServiceNames()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
