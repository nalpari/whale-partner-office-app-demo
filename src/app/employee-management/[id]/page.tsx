"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import CollapsibleCard from "@/components/CollapsibleCard";

interface Career {
  id?: number;
  company_name: string;
  start_date: string | null;
  end_date: string | null;
  position: string | null;
  job_description: string | null;
}

interface License {
  id?: number;
  license_name: string;
  start_date: string | null;
  end_date: string | null;
  issue_date: string | null;
}

interface EmployeeFile {
  id?: number;
  file_type: string;
  file_name: string;
  file_url: string | null;
}

interface Employee {
  id: number;
  employee_id: string;
  name: string;
  position: string | null;
  hire_date: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  workplace_type: string | null;
  workplace_name: string | null;
  workplace_full_name: string | null;
  employee_classification: string | null;
  contract_classification: string | null;
  bank_name: string | null;
  account_number: string | null;
  account_holder: string | null;
  employment_status: string | null;
  employment_memo: string | null;
  health_checkup_expiry_date: string | null;
  login_id: string | null;
  login_permission: string | null;
  approval_status: string | null;
  approval_request_date: string | null;
  approval_join_date: string | null;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
  careers: Career[];
  licenses: License[];
  files: EmployeeFile[];
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/employees/${params.id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('직원을 찾을 수 없습니다.');
        }
        throw new Error('직원 정보를 불러오는데 실패했습니다.');
      }

      const result = await response.json();
      setEmployee(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchEmployee();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/employees/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/employee-management');
      }
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleGoBack = () => {
    router.push('/employee-management');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return dateString.split('T')[0];
  };

  const getFileByType = (type: string) => {
    return employee?.files?.find(f => f.file_type === type);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="loading-container">
            <div>로딩 중...</div>
          </div>
        </div>
      </>
    );
  }

  if (error || !employee) {
    return (
      <>
        <Header />
        <div className="page-container">
          <div className="error-container">
            <div style={{ color: 'red' }}>{error || '직원 정보를 찾을 수 없습니다.'}</div>
            <button onClick={handleGoBack} className="store-btn-basic" style={{ marginTop: '16px' }}>
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </>
    );
  }

  // 직원 Header 정보 관리 데이터 (문서 정보 + 등록/수정 이력 통합)
  const headerInfoData = [
    {
      label: "근무 여부",
      values: [
        employee.employment_status || '-',
        employee.employment_memo || '-',
      ],
    },
    {
      label: "직원 개인 정보",
      values: [
        `사번: ${employee.employee_id}`,
        `직원명: ${employee.name}`,
        `직급: ${employee.position || '-'}`,
        `입사일: ${formatDate(employee.hire_date)}`,
        `휴대폰번호: ${employee.phone || '-'}`,
        `이메일/주소: ${employee.email || '-'}`,
      ],
    },
    {
      label: "근무처",
      values: [employee.workplace_full_name || employee.workplace_name || '-'],
    },
    {
      label: "직원분류/계약분류",
      values: [
        `${employee.employee_classification || '-'}/${employee.contract_classification || '-'}`,
      ],
    },
    {
      label: "계좌 정보",
      values: [
        `${employee.bank_name || '-'}`,
        `${employee.account_number || '-'}`,
        `${employee.account_holder || '-'}`,
      ],
    },
    {
      label: "주민등록등본",
      values: [getFileByType('resident_registration')?.file_name || '-'],
    },
    {
      label: "건강진단결과서",
      values: [getFileByType('health_checkup')?.file_name || '-'],
    },
    {
      label: "건강진단결과서 만료일",
      values: [formatDate(employee.health_checkup_expiry_date)],
    },
    {
      label: "이력서",
      values: [getFileByType('resume')?.file_name || '-'],
    },
  ];

  // 로그인 정보 및 권한 데이터
  const loginInfoData = [
    {
      label: "로그인 ID 및 권한",
      values: [
        `ID: ${employee.login_id || '-'}`,
        `권한: ${employee.login_permission || '-'}`,
      ],
    },
    {
      label: "승인정보",
      values: [
        `상태: ${employee.approval_status || '-'}`,
        `요청일: ${formatDate(employee.approval_request_date)}`,
        `가입일: ${formatDate(employee.approval_join_date)}`,
      ],
    },
  ];

  // 경력 정보 데이터
  const careerInfoData = employee.careers?.length > 0
    ? employee.careers.map((career, index) => ({
        label: `경력 #${index + 1}`,
        values: [
          career.company_name || '-',
          `${formatDate(career.start_date)} ~ ${formatDate(career.end_date)}`,
          career.position || '-',
          career.job_description || '-',
        ],
      }))
    : [{ label: "경력", values: ["등록된 경력이 없습니다."] }];

  // 자격증 정보 데이터
  const licenseInfoData = employee.licenses?.length > 0
    ? employee.licenses.map((license, index) => ({
        label: `자격증 #${index + 1}`,
        values: [
          license.license_name || '-',
          `${formatDate(license.start_date)} ~ ${formatDate(license.end_date)}`,
          `발급일: ${formatDate(license.issue_date)}`,
        ],
      }))
    : [{ label: "자격증", values: ["등록된 자격증이 없습니다."] }];

  // 등록 및 수정 이력 데이터
  const historyInfoData = [
    {
      label: "등록자/등록일",
      values: [
        `${employee.created_by || '-'} | ${formatDate(employee.created_at)}`,
      ],
    },
    {
      label: "최근수정자/최근수정일",
      values: [
        `${employee.updated_by || '-'} | ${formatDate(employee.updated_at)}`,
      ],
    },
  ];

  return (
    <>
      <Header />
      <div className="page-container">
        <div className="page-body">
          <div className="page-title-section">
            <h1 className="page-title">직원 정보 관리</h1>
            <Breadcrumb
              items={[
                { label: "BP 직원 관리" },
                { label: "직원 정보 관리" },
                { label: "직원 정보 상세조회", active: true },
              ]}
            />
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
                  title="직원 Header 정보 관리"
                  actions={[{ label: "수정" }]}
                  data={headerInfoData}
                />
                <CollapsibleCard
                  title="로그인 정보 및 권한"
                  actions={[{ label: "수정" }]}
                  data={loginInfoData}
                />
                <CollapsibleCard
                  title="경력 정보"
                  actions={[{ label: "수정" }]}
                  data={careerInfoData}
                />
                <CollapsibleCard
                  title="자격증 정보"
                  actions={[{ label: "수정" }]}
                  data={licenseInfoData}
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
