import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';
import { currentUser, getUserContextForAI } from '@/lib/userContext';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 사용 가능한 함수(도구) 정의
const tools: Anthropic.Tool[] = [
  {
    name: 'get_business_partner_count',
    description: 'Business Partner(거래처/파트너)의 총 개수를 조회합니다. 운영 상태별로 필터링할 수 있습니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        operation_status: {
          type: 'string',
          enum: ['ALL', 'CONSULTING', 'OPERATING', 'TERMINATED'],
          description: '운영 상태 필터. ALL은 전체, CONSULTING은 상담중, OPERATING은 운영중, TERMINATED는 종료',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_business_partner_list',
    description: 'Business Partner(거래처/파트너) 목록을 조회합니다. "BP 리스트 보여줘", "거래처 목록 보여줘" 같은 요청에 사용합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        operation_status: {
          type: 'string',
          enum: ['ALL', 'CONSULTING', 'OPERATING', 'TERMINATED'],
          description: '운영 상태 필터',
        },
        limit: {
          type: 'number',
          description: '조회할 최대 개수 (기본값: 10)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_business_partner_detail',
    description: '특정 Business Partner의 상세 정보를 조회합니다. ID, 업체명, 브랜드명 등으로 검색할 수 있습니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'number',
          description: 'Business Partner ID (정확한 ID를 알고 있을 때)',
        },
        search: {
          type: 'string',
          description: '업체명 또는 브랜드명으로 검색 (예: "테스트회사", "브랜드A")',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_employee_count',
    description: '직원의 총 개수를 조회합니다. 계약 분류, 소속 분류, 근무 상태로 필터링할 수 있습니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        contract_classification: {
          type: 'string',
          enum: ['정직원', '파트타이머'],
          description: '계약 분류 필터. 정직원 또는 파트타이머(아르바이트). 정직원/계약직/파트타임/알바 질문시 이 필드 사용.',
        },
        employee_classification: {
          type: 'string',
          enum: ['본사 직원', '가맹점 직원', '점포 직원'],
          description: '소속 분류 필터. 본사/가맹점/점포 소속 질문시 이 필드 사용.',
        },
        employment_status: {
          type: 'string',
          enum: ['근무', '퇴사'],
          description: '근무 상태 필터 (근무 또는 퇴사)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_employee_list',
    description: '직원 목록을 조회합니다. "직원 리스트 보여줘", "직원 목록 보여줘", "을지로3가점 소속 직원", "특정 매장 직원" 같은 요청에 사용합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        contract_classification: {
          type: 'string',
          enum: ['정직원', '파트타이머'],
          description: '계약 분류 필터',
        },
        employee_classification: {
          type: 'string',
          enum: ['본사 직원', '가맹점 직원', '점포 직원'],
          description: '소속 분류 필터',
        },
        employment_status: {
          type: 'string',
          enum: ['근무', '퇴사'],
          description: '근무 상태 필터',
        },
        workplace_name: {
          type: 'string',
          description: '근무지(매장명) 필터. 예: "을지로3가점", "강남점" 등. 특정 매장의 직원만 조회할 때 사용.',
        },
        search: {
          type: 'string',
          description: '이름 또는 직원번호로 검색',
        },
        limit: {
          type: 'number',
          description: '조회할 최대 개수 (기본값: 10)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_employee_detail',
    description: '특정 직원의 상세 정보를 조회합니다. "홍길동 직원 정보 보여줘", "특정 직원 데이터 보여줘" 같은 요청에 사용합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'number',
          description: '직원 ID (정확한 ID를 알고 있을 때)',
        },
        name: {
          type: 'string',
          description: '직원 이름으로 검색 (예: "홍길동")',
        },
        employee_id: {
          type: 'string',
          description: '직원번호로 검색 (예: "EMP001")',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_employee_work_schedule',
    description: '직원의 근무 스케줄(근무요일, 근무시간)을 조회합니다. "정직원 근무요일 알려줘", "홍길동 근무시간 보여줘", "직원들 언제 일해?" 같은 요청에 사용합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        contract_classification: {
          type: 'string',
          enum: ['정직원', '파트타이머'],
          description: '계약 분류 필터 (정직원 또는 파트타이머)',
        },
        employee_name: {
          type: 'string',
          description: '특정 직원 이름으로 검색 (예: "홍길동")',
        },
        employee_id: {
          type: 'number',
          description: '특정 직원 ID로 검색',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_employee_salary',
    description: '직원의 급여 정보(연봉, 월급, 시급)를 조회합니다. 근로계약서의 내용을 참조하여 계약 상태, 계약 기간, 급여 지급 주기, 업무 설명 등도 함께 제공합니다. "정직원 급여 알려줘", "홍길동 시급 보여줘", "직원 연봉 얼마야?", "월급 정보 보여줘" 같은 요청에 사용합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        contract_classification: {
          type: 'string',
          enum: ['정직원', '파트타이머'],
          description: '계약 분류 필터 (정직원 또는 파트타이머)',
        },
        employee_name: {
          type: 'string',
          description: '특정 직원 이름으로 검색 (예: "홍길동")',
        },
        employee_id: {
          type: 'number',
          description: '특정 직원 ID로 검색',
        },
        salary_type: {
          type: 'string',
          enum: ['ANNUAL', 'MONTHLY', 'HOURLY'],
          description: '급여 유형 필터 (ANNUAL: 연봉제, MONTHLY: 월급제, HOURLY: 시급제)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_current_working_employees',
    description: '현재 근무 중인 직원 목록을 조회합니다. 오늘 출근했지만 아직 퇴근하지 않은 직원을 보여줍니다. "현재 근무중인 직원", "지금 일하는 사람", "아직 퇴근 안한 직원", "누가 근무중이야?" 같은 요청에 사용합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        store_id: {
          type: 'number',
          description: '특정 매장의 근무 중인 직원만 조회 (선택사항)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_employee_work_hours',
    description: '직원의 실제 근무시간을 출퇴근 데이터를 기반으로 계산합니다. "홍길동 이번주 근무시간", "정직원 이번달 근무시간", "을지로3가점 직원 근무시간", "오늘 근무시간" 같은 요청에 사용합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        employee_name: {
          type: 'string',
          description: '특정 직원 이름으로 검색 (예: "홍길동")',
        },
        employee_id: {
          type: 'number',
          description: '특정 직원 ID로 검색',
        },
        workplace_name: {
          type: 'string',
          description: '근무지(매장명) 필터. 예: "을지로3가점", "강남점" 등',
        },
        contract_classification: {
          type: 'string',
          enum: ['정직원', '파트타이머'],
          description: '계약 분류 필터 (정직원 또는 파트타이머)',
        },
        date_range: {
          type: 'string',
          enum: ['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'custom'],
          description: '조회 기간. today=오늘, yesterday=어제, this_week=이번주, last_week=지난주, this_month=이번달, last_month=지난달, custom=사용자 지정 기간',
        },
        start_date: {
          type: 'string',
          description: 'date_range가 custom일 때 시작 날짜. YYYY-MM-DD 형식 (예: 2025-01-01)',
        },
        end_date: {
          type: 'string',
          description: 'date_range가 custom일 때 종료 날짜. YYYY-MM-DD 형식 (예: 2025-01-31)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_employee_payslip',
    description: '직원의 급여명세서를 조회합니다. "홍길동 급여명세서", "11월 급여명세서", "이번달 급여", "지난달 급여", "실수령액 알려줘", "총 지급액", "공제내역" 같은 요청에 사용합니다. 급여명세서에는 기본급, 각종 수당, 4대보험, 세금, 총 지급액, 총 공제액, 실수령액 정보가 포함됩니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        employee_name: {
          type: 'string',
          description: '특정 직원 이름으로 검색 (예: "홍길동")',
        },
        employee_id: {
          type: 'number',
          description: '특정 직원 ID로 검색',
        },
        pay_year_month: {
          type: 'string',
          description: '급여 년월 (예: "2024-11"). YYYY-MM 형식. 특정 월 급여명세서 조회 시 사용.',
        },
        date_range: {
          type: 'string',
          enum: ['this_month', 'last_month', 'custom'],
          description: '조회 기간. this_month=이번달, last_month=지난달, custom=사용자 지정',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_store_count',
    description: '매장(점포)의 총 개수를 조회합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        status: {
          type: 'string',
          enum: ['ALL', 'active', 'inactive', 'closed'],
          description: '매장 상태 필터',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_store_list',
    description: '매장(점포) 목록을 조회합니다. "매장 리스트 보여줘", "점포 목록 보여줘" 같은 요청에 사용합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        status: {
          type: 'string',
          enum: ['ALL', 'active', 'inactive', 'closed'],
          description: '매장 상태 필터',
        },
        search: {
          type: 'string',
          description: '매장명으로 검색',
        },
        limit: {
          type: 'number',
          description: '조회할 최대 개수 (기본값: 10)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_store_detail',
    description: '특정 매장의 상세 정보를 조회합니다. "강남점 정보 보여줘", "특정 매장 데이터 보여줘" 같은 요청에 사용합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'number',
          description: '매장 ID (정확한 ID를 알고 있을 때)',
        },
        name: {
          type: 'string',
          description: '매장명으로 검색 (예: "강남점")',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_menu_count',
    description: '메뉴의 총 개수를 조회합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_order_summary',
    description: '주문 요약 정보를 조회합니다 (총 주문 수, 총 매출 등). 결제 수단별로 필터링할 수 있습니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        payment_type: {
          type: 'string',
          enum: ['ALL', 'CARD', 'CASH', 'TRANSFER', 'OTHER'],
          description: '결제 수단 필터. ALL은 전체, CARD는 카드결제, CASH는 현금결제, TRANSFER는 계좌이체, OTHER는 기타',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_store_sales',
    description: '특정 매장의 매출 정보를 조회합니다. "오늘 매출 알려줘", "12월 12일 매출", "이번 달 매출", "카드 매출 알려줘" 같은 요청에 사용합니다. 매장을 지정하지 않으면 현재 로그인한 사용자의 담당 매장(을지로3가점) 매출을 조회합니다. 특정 날짜(예: 12월 12일)를 물으면 date_range를 today로 설정하세요 - 오늘 날짜와 같으면 today, 어제면 yesterday를 사용합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        store_id: {
          type: 'number',
          description: '매장 ID. 지정하지 않으면 현재 사용자의 담당 매장(을지로3가점) ID 사용',
        },
        store_name: {
          type: 'string',
          description: '매장명으로 검색 (예: "강남점", "을지로3가점")',
        },
        date_range: {
          type: 'string',
          enum: ['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'custom'],
          description: '조회 기간. today=오늘(특정 날짜가 오늘이면 today 사용), yesterday=어제, this_week=이번주, last_week=지난주, this_month=이번달, last_month=지난달. 특정 날짜 요청시 오늘/어제가 아니면 custom 사용.',
        },
        start_date: {
          type: 'string',
          description: 'date_range가 custom일 때 시작 날짜. 반드시 YYYY-MM-DD 형식 (예: 2025-12-12). 연도를 반드시 포함해야 함.',
        },
        end_date: {
          type: 'string',
          description: 'date_range가 custom일 때 종료 날짜. 반드시 YYYY-MM-DD 형식 (예: 2025-12-12). 연도를 반드시 포함해야 함. 하루 매출 조회시 start_date와 동일하게 설정.',
        },
        payment_type: {
          type: 'string',
          enum: ['ALL', 'CARD', 'CASH', 'TRANSFER', 'OTHER'],
          description: '결제 수단 필터. ALL은 전체, CARD는 카드결제, CASH는 현금결제, TRANSFER는 계좌이체, OTHER는 기타. "카드 매출", "현금 매출" 요청시 사용.',
        },
      },
      required: [],
    },
  },
];

// 도구 실행 함수
async function executeTool(toolName: string, toolInput: Record<string, unknown>): Promise<string> {
  switch (toolName) {
    case 'get_business_partner_count': {
      let query = supabase
        .from('business_partners')
        .select('*', { count: 'exact', head: true })
        .eq('is_deleted', false);

      if (toolInput.operation_status && toolInput.operation_status !== 'ALL') {
        query = query.eq('operation_status', toolInput.operation_status);
      }

      const { count, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        count,
        message: `Business Partner는 총 ${count}개입니다.`,
        operation_status: toolInput.operation_status || 'ALL'
      });
    }

    case 'get_business_partner_list': {
      const limit = (toolInput.limit as number) || 10;
      let query = supabase
        .from('business_partners')
        .select('id, master_id, company_name, brand_name, operation_status, bp_code, representative_name, representative_phone')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (toolInput.operation_status && toolInput.operation_status !== 'ALL') {
        query = query.eq('operation_status', toolInput.operation_status);
      }

      const { data, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        data,
        count: data?.length || 0,
        dataType: 'business_partner_list',
        message: `Business Partner 목록입니다.`
      });
    }

    case 'get_business_partner_detail': {
      let query = supabase
        .from('business_partners')
        .select('*')
        .eq('is_deleted', false);

      if (toolInput.id) {
        query = query.eq('id', toolInput.id);
      } else if (toolInput.search) {
        query = query.or(`company_name.ilike.%${toolInput.search}%,brand_name.ilike.%${toolInput.search}%`);
      }

      const { data, error } = await query.limit(1).single();
      if (error) {
        if (error.code === 'PGRST116') {
          return JSON.stringify({ error: '해당 Business Partner를 찾을 수 없습니다.', dataType: 'not_found' });
        }
        return JSON.stringify({ error: error.message });
      }

      return JSON.stringify({
        data,
        dataType: 'business_partner_detail',
        message: `${data.company_name}의 상세 정보입니다.`
      });
    }

    case 'get_employee_count': {
      let query = supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('is_deleted', false);

      if (toolInput.contract_classification) {
        query = query.eq('contract_classification', toolInput.contract_classification);
      }

      if (toolInput.employee_classification) {
        query = query.eq('employee_classification', toolInput.employee_classification);
      }

      if (toolInput.employment_status) {
        query = query.eq('employment_status', toolInput.employment_status);
      }

      const { count, error } = await query;
      if (error) return JSON.stringify({ error: error.message });

      const contract = toolInput.contract_classification ? `${toolInput.contract_classification} ` : '';
      const employee = toolInput.employee_classification ? `(${toolInput.employee_classification}) ` : '';
      const status = toolInput.employment_status ? `${toolInput.employment_status} 중인 ` : '';
      return JSON.stringify({
        count,
        contract_classification: toolInput.contract_classification || 'ALL',
        employee_classification: toolInput.employee_classification || 'ALL',
        employment_status: toolInput.employment_status || 'ALL',
        message: `${status}${contract}${employee}직원은 총 ${count}명입니다.`
      });
    }

    case 'get_employee_list': {
      const limit = (toolInput.limit as number) || 10;
      let query = supabase
        .from('employees')
        .select('id, employee_id, name, position, phone, email, employee_classification, contract_classification, employment_status, workplace_name')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (toolInput.contract_classification) {
        query = query.eq('contract_classification', toolInput.contract_classification);
      }
      if (toolInput.employee_classification) {
        query = query.eq('employee_classification', toolInput.employee_classification);
      }
      if (toolInput.employment_status) {
        query = query.eq('employment_status', toolInput.employment_status);
      }
      if (toolInput.workplace_name) {
        query = query.ilike('workplace_name', `%${toolInput.workplace_name}%`);
      }
      if (toolInput.search) {
        query = query.or(`name.ilike.%${toolInput.search}%,employee_id.ilike.%${toolInput.search}%`);
      }

      const { data, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        data,
        count: data?.length || 0,
        dataType: 'employee_list',
        message: `직원 목록입니다.`
      });
    }

    case 'get_employee_detail': {
      let query = supabase
        .from('employees')
        .select('*')
        .eq('is_deleted', false);

      if (toolInput.id) {
        query = query.eq('id', toolInput.id);
      } else if (toolInput.name) {
        query = query.ilike('name', `%${toolInput.name}%`);
      } else if (toolInput.employee_id) {
        query = query.ilike('employee_id', `%${toolInput.employee_id}%`);
      }

      const { data, error } = await query.limit(1).single();
      if (error) {
        if (error.code === 'PGRST116') {
          return JSON.stringify({ error: '해당 직원을 찾을 수 없습니다.', dataType: 'not_found' });
        }
        return JSON.stringify({ error: error.message });
      }

      return JSON.stringify({
        data,
        dataType: 'employee_detail',
        message: `${data.name}님의 상세 정보입니다.`
      });
    }

    case 'get_employee_work_schedule': {
      // 직원 + 근로계약서 + 근무스케줄 조인 쿼리
      let employeeQuery = supabase
        .from('employees')
        .select('id, name, contract_classification, workplace_name')
        .eq('is_deleted', false);

      if (toolInput.contract_classification) {
        employeeQuery = employeeQuery.eq('contract_classification', toolInput.contract_classification);
      }
      if (toolInput.employee_name) {
        employeeQuery = employeeQuery.ilike('name', `%${toolInput.employee_name}%`);
      }
      if (toolInput.employee_id) {
        employeeQuery = employeeQuery.eq('id', toolInput.employee_id);
      }

      const { data: employees, error: empError } = await employeeQuery;
      if (empError) return JSON.stringify({ error: empError.message });
      if (!employees || employees.length === 0) {
        return JSON.stringify({ error: '해당 직원을 찾을 수 없습니다.', dataType: 'not_found' });
      }

      // 각 직원의 근무 스케줄 조회
      const scheduleResults = [];
      for (const emp of employees) {
        // 해당 직원의 근로계약서 조회
        const { data: contracts } = await supabase
          .from('employment_contracts')
          .select('id, store_name, contract_status')
          .eq('employee_id', emp.id)
          .or('is_deleted.eq.false,is_deleted.is.null');

        if (contracts && contracts.length > 0) {
          for (const contract of contracts) {
            // 해당 계약서의 근무 스케줄 조회
            const { data: schedules } = await supabase
              .from('contract_work_schedules')
              .select('day_type, work_days, work_start_time, work_end_time, break_start_time, break_end_time, frequency')
              .eq('contract_id', contract.id);

            if (schedules && schedules.length > 0) {
              for (const schedule of schedules) {
                scheduleResults.push({
                  employee_name: emp.name,
                  contract_classification: emp.contract_classification,
                  workplace: emp.workplace_name,
                  day_type: schedule.day_type,
                  work_days: schedule.work_days,
                  work_start_time: schedule.work_start_time,
                  work_end_time: schedule.work_end_time,
                  break_time: schedule.break_start_time && schedule.break_end_time
                    ? `${schedule.break_start_time?.toString().slice(0, 5)}~${schedule.break_end_time?.toString().slice(0, 5)}`
                    : null,
                  frequency: schedule.frequency,
                });
              }
            }
          }
        }
      }

      if (scheduleResults.length === 0) {
        return JSON.stringify({
          error: '해당 직원의 근무 스케줄 정보가 없습니다.',
          dataType: 'not_found'
        });
      }

      return JSON.stringify({
        data: scheduleResults,
        count: scheduleResults.length,
        dataType: 'work_schedule',
        message: `근무 스케줄 정보입니다.`
      });
    }

    case 'get_employee_salary': {
      // 직원 + 근로계약서 + 급여 조인 쿼리
      let employeeQuery = supabase
        .from('employees')
        .select('id, name, contract_classification, workplace_name')
        .eq('is_deleted', false);

      if (toolInput.contract_classification) {
        employeeQuery = employeeQuery.eq('contract_classification', toolInput.contract_classification);
      }
      if (toolInput.employee_name) {
        employeeQuery = employeeQuery.ilike('name', `%${toolInput.employee_name}%`);
      }
      if (toolInput.employee_id) {
        employeeQuery = employeeQuery.eq('id', toolInput.employee_id);
      }

      const { data: employees, error: empError } = await employeeQuery;
      if (empError) return JSON.stringify({ error: empError.message });
      if (!employees || employees.length === 0) {
        return JSON.stringify({ error: '해당 직원을 찾을 수 없습니다.', dataType: 'not_found' });
      }

      // 각 직원의 급여 정보 조회
      const salaryResults = [];
      for (const emp of employees) {
        // 해당 직원의 근로계약서 조회 (근로계약서의 상세 정보 포함)
        let contractQuery = supabase
          .from('employment_contracts')
          .select('id, store_name, contract_status, salary_type, contract_start_date, contract_end_date, work_start_date, pay_cycle, pay_day, job_description')
          .eq('employee_id', emp.id)
          .or('is_deleted.eq.false,is_deleted.is.null');

        if (toolInput.salary_type) {
          contractQuery = contractQuery.eq('salary_type', toolInput.salary_type);
        }

        const { data: contracts } = await contractQuery;

        if (contracts && contracts.length > 0) {
          for (const contract of contracts) {
            // 해당 계약서의 급여 정보 조회
            const { data: salaries } = await supabase
              .from('contract_salaries')
              .select('annual_salary, monthly_salary, hourly_wage')
              .eq('contract_id', contract.id);

            if (salaries && salaries.length > 0) {
              for (const salary of salaries) {
                salaryResults.push({
                  employee_name: emp.name,
                  contract_classification: emp.contract_classification,
                  workplace: emp.workplace_name,
                  // 근로계약서 정보
                  contract_status: contract.contract_status,
                  contract_start_date: contract.contract_start_date,
                  contract_end_date: contract.contract_end_date,
                  work_start_date: contract.work_start_date,
                  pay_cycle: contract.pay_cycle,
                  pay_day: contract.pay_day,
                  job_description: contract.job_description,
                  // 급여 정보
                  salary_type: contract.salary_type,
                  annual_salary: salary.annual_salary ? Number(salary.annual_salary) : null,
                  monthly_salary: salary.monthly_salary ? Number(salary.monthly_salary) : null,
                  hourly_wage: salary.hourly_wage ? Number(salary.hourly_wage) : null,
                });
              }
            } else {
              // 급여 정보가 없어도 근로계약서 정보는 포함
              salaryResults.push({
                employee_name: emp.name,
                contract_classification: emp.contract_classification,
                workplace: emp.workplace_name,
                // 근로계약서 정보
                contract_status: contract.contract_status,
                contract_start_date: contract.contract_start_date,
                contract_end_date: contract.contract_end_date,
                work_start_date: contract.work_start_date,
                pay_cycle: contract.pay_cycle,
                pay_day: contract.pay_day,
                job_description: contract.job_description,
                // 급여 정보 없음
                salary_type: contract.salary_type,
                annual_salary: null,
                monthly_salary: null,
                hourly_wage: null,
              });
            }
          }
        }
      }

      if (salaryResults.length === 0) {
        return JSON.stringify({
          error: '해당 직원의 근로계약서 정보가 없습니다.',
          dataType: 'not_found'
        });
      }

      return JSON.stringify({
        data: salaryResults,
        count: salaryResults.length,
        dataType: 'salary',
        message: `급여 정보입니다.`
      });
    }

    case 'get_current_working_employees': {
      // 오늘 날짜 구하기 (한국 시간 기준)
      const today = new Date();
      const koreaTime = new Date(today.getTime() + (9 * 60 * 60 * 1000));
      const todayStr = koreaTime.toISOString().split('T')[0];

      // 매장 ID가 없으면 현재 사용자의 담당 매장 사용
      const storeId = (toolInput.store_id as number) || currentUser.storeId;

      // 오늘 출퇴근 기록 조회 (attendance_status 조건 제거 - 실제 세션 데이터로 판단)
      const query = supabase
        .from('attendance_records')
        .select(`
          id,
          employee_id,
          store_id,
          work_date,
          attendance_status,
          total_work_minutes
        `)
        .eq('work_date', todayStr)
        .eq('store_id', storeId)
        .or('is_deleted.eq.false,is_deleted.is.null');

      const { data: records, error: recordError } = await query;
      if (recordError) return JSON.stringify({ error: recordError.message });

      if (!records || records.length === 0) {
        return JSON.stringify({
          data: [],
          count: 0,
          store_id: storeId,
          store_name: currentUser.storeName,
          dataType: 'current_working',
          message: `${currentUser.storeName}에 오늘(${todayStr}) 현재 근무 중인 직원이 없습니다.`
        });
      }

      // 각 출퇴근 기록에 대해 세션 정보와 직원 정보 조회
      const workingEmployees = [];
      for (const record of records) {
        // 세션 정보 조회 (출근 기록이 있고 퇴근 시간이 NULL인 경우)
        const { data: sessions } = await supabase
          .from('attendance_sessions')
          .select('clock_in_time, clock_out_time')
          .eq('attendance_record_id', record.id)
          .not('clock_in_time', 'is', null)
          .is('clock_out_time', null);

        if (sessions && sessions.length > 0) {
          // 직원 정보 조회
          const { data: employee } = await supabase
            .from('employees')
            .select('name, contract_classification, workplace_name, phone')
            .eq('id', record.employee_id)
            .single();

          if (employee) {
            workingEmployees.push({
              employee_name: employee.name,
              contract_classification: employee.contract_classification,
              workplace: employee.workplace_name,
              phone: employee.phone,
              clock_in_time: sessions[0].clock_in_time,
              work_date: record.work_date,
            });
          }
        }
      }

      return JSON.stringify({
        data: workingEmployees,
        count: workingEmployees.length,
        store_id: storeId,
        store_name: currentUser.storeName,
        dataType: 'current_working',
        today: todayStr,
        message: workingEmployees.length > 0
          ? `${currentUser.storeName}에 현재 ${workingEmployees.length}명이 근무 중입니다.`
          : `${currentUser.storeName}에 오늘(${todayStr}) 현재 근무 중인 직원이 없습니다.`
      });
    }

    case 'get_employee_work_hours': {
      // 날짜 범위 계산 (한국 시간 기준)
      const now = new Date();
      const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
      const todayStr = koreaTime.toISOString().split('T')[0];
      const currentYear = koreaTime.getFullYear();

      let startDate: string;
      let endDate: string;
      const dateRange = (toolInput.date_range as string) || 'today';

      switch (dateRange) {
        case 'today':
          startDate = todayStr;
          endDate = todayStr;
          break;
        case 'yesterday': {
          const yesterday = new Date(koreaTime);
          yesterday.setDate(yesterday.getDate() - 1);
          startDate = yesterday.toISOString().split('T')[0];
          endDate = startDate;
          break;
        }
        case 'this_week': {
          const weekStart = new Date(koreaTime);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          startDate = weekStart.toISOString().split('T')[0];
          endDate = todayStr;
          break;
        }
        case 'last_week': {
          const lastWeekEnd = new Date(koreaTime);
          lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay() - 1);
          const lastWeekStart = new Date(lastWeekEnd);
          lastWeekStart.setDate(lastWeekStart.getDate() - 6);
          startDate = lastWeekStart.toISOString().split('T')[0];
          endDate = lastWeekEnd.toISOString().split('T')[0];
          break;
        }
        case 'this_month': {
          const monthStart = new Date(koreaTime.getFullYear(), koreaTime.getMonth(), 1);
          startDate = monthStart.toISOString().split('T')[0];
          endDate = todayStr;
          break;
        }
        case 'last_month': {
          const lastMonthEnd = new Date(koreaTime.getFullYear(), koreaTime.getMonth(), 0);
          const lastMonthStart = new Date(koreaTime.getFullYear(), koreaTime.getMonth() - 1, 1);
          startDate = lastMonthStart.toISOString().split('T')[0];
          endDate = lastMonthEnd.toISOString().split('T')[0];
          break;
        }
        case 'custom': {
          const fixDateFormat = (dateStr: string): string => {
            if (!dateStr) return todayStr;
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
            if (/^\d{2}-\d{2}$/.test(dateStr)) return `${currentYear}-${dateStr}`;
            const parts = dateStr.split('-');
            if (parts.length === 2) {
              const month = parts[0].padStart(2, '0');
              const day = parts[1].padStart(2, '0');
              return `${currentYear}-${month}-${day}`;
            }
            return todayStr;
          };
          startDate = fixDateFormat(toolInput.start_date as string);
          endDate = fixDateFormat(toolInput.end_date as string);
          break;
        }
        default:
          startDate = todayStr;
          endDate = todayStr;
      }

      // 직원 조회
      let employeeQuery = supabase
        .from('employees')
        .select('id, name, contract_classification, workplace_name')
        .eq('is_deleted', false);

      if (toolInput.employee_name) {
        employeeQuery = employeeQuery.ilike('name', `%${toolInput.employee_name}%`);
      }
      if (toolInput.employee_id) {
        employeeQuery = employeeQuery.eq('id', toolInput.employee_id);
      }
      if (toolInput.workplace_name) {
        employeeQuery = employeeQuery.ilike('workplace_name', `%${toolInput.workplace_name}%`);
      }
      if (toolInput.contract_classification) {
        employeeQuery = employeeQuery.eq('contract_classification', toolInput.contract_classification);
      }

      const { data: employees, error: empError } = await employeeQuery;
      if (empError) return JSON.stringify({ error: empError.message });
      if (!employees || employees.length === 0) {
        return JSON.stringify({ error: '해당 직원을 찾을 수 없습니다.', dataType: 'not_found' });
      }

      // 각 직원의 근무시간 계산
      const workHoursResults = [];
      for (const emp of employees) {
        // 출퇴근 기록 조회
        let recordsQuery = supabase
          .from('attendance_records')
          .select('id, work_date, total_work_minutes')
          .eq('employee_id', emp.id)
          .gte('work_date', startDate)
          .lte('work_date', endDate)
          .or('is_deleted.eq.false,is_deleted.is.null');

        const { data: records, error: recordsError } = await recordsQuery;
        if (recordsError) continue;

        if (records && records.length > 0) {
          // 총 근무시간 계산 (분 단위)
          const totalMinutes = records.reduce((sum, record) => {
            return sum + (record.total_work_minutes || 0);
          }, 0);

          // 시간으로 변환
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;

          workHoursResults.push({
            employee_name: emp.name,
            contract_classification: emp.contract_classification,
            workplace: emp.workplace_name,
            start_date: startDate,
            end_date: endDate,
            total_work_minutes: totalMinutes,
            total_work_hours: hours,
            total_work_minutes_remainder: minutes,
            work_days: records.length,
            formatted_hours: minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`,
          });
        } else {
          // 출퇴근 기록이 없는 경우
          workHoursResults.push({
            employee_name: emp.name,
            contract_classification: emp.contract_classification,
            workplace: emp.workplace_name,
            start_date: startDate,
            end_date: endDate,
            total_work_minutes: 0,
            total_work_hours: 0,
            total_work_minutes_remainder: 0,
            work_days: 0,
            formatted_hours: '0시간',
          });
        }
      }

      if (workHoursResults.length === 0) {
        return JSON.stringify({
          error: '해당 기간의 출퇴근 기록이 없습니다.',
          dataType: 'not_found'
        });
      }

      // 기간 표시 문자열 생성
      let periodLabel = '';
      switch (dateRange) {
        case 'today': periodLabel = '오늘'; break;
        case 'yesterday': periodLabel = '어제'; break;
        case 'this_week': periodLabel = '이번 주'; break;
        case 'last_week': periodLabel = '지난 주'; break;
        case 'this_month': periodLabel = '이번 달'; break;
        case 'last_month': periodLabel = '지난 달'; break;
        default: periodLabel = `${startDate} ~ ${endDate}`;
      }

      return JSON.stringify({
        data: workHoursResults,
        count: workHoursResults.length,
        period: periodLabel,
        start_date: startDate,
        end_date: endDate,
        dataType: 'work_hours',
        message: `근무시간 정보입니다.`
      });
    }

    case 'get_employee_payslip': {
      // 급여 년월 결정 (한국 시간 기준)
      const now = new Date();
      const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
      const currentYear = koreaTime.getFullYear();
      const currentMonth = koreaTime.getMonth() + 1;

      let payYearMonth: string;
      const dateRange = toolInput.date_range as string | undefined;

      if (toolInput.pay_year_month) {
        payYearMonth = toolInput.pay_year_month as string;
      } else if (dateRange === 'this_month') {
        payYearMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
      } else if (dateRange === 'last_month') {
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const year = currentMonth === 1 ? currentYear - 1 : currentYear;
        payYearMonth = `${year}-${String(lastMonth).padStart(2, '0')}`;
      } else {
        // 기본값: 가장 최근 급여명세서
        payYearMonth = '';
      }

      // 직원 필터링
      let employeeIds: number[] = [];
      if (toolInput.employee_name || toolInput.employee_id) {
        let empQuery = supabase
          .from('employees')
          .select('id, name')
          .eq('is_deleted', false);

        if (toolInput.employee_name) {
          empQuery = empQuery.ilike('name', `%${toolInput.employee_name}%`);
        }
        if (toolInput.employee_id) {
          empQuery = empQuery.eq('id', toolInput.employee_id);
        }

        const { data: employees } = await empQuery;
        if (employees && employees.length > 0) {
          employeeIds = employees.map(e => e.id);
        } else {
          return JSON.stringify({
            error: '해당 직원을 찾을 수 없습니다.',
            dataType: 'not_found'
          });
        }
      }

      // 급여명세서 조회
      let payslipQuery = supabase
        .from('payslips')
        .select('*')
        .eq('is_deleted', false)
        .order('pay_year_month', { ascending: false });

      if (employeeIds.length > 0) {
        payslipQuery = payslipQuery.in('employee_id', employeeIds);
      }

      if (payYearMonth) {
        payslipQuery = payslipQuery.eq('pay_year_month', payYearMonth);
      }

      const { data: payslips, error } = await payslipQuery.limit(10);

      if (error) return JSON.stringify({ error: error.message });

      if (!payslips || payslips.length === 0) {
        return JSON.stringify({
          error: '해당 조건의 급여명세서가 없습니다.',
          dataType: 'not_found'
        });
      }

      // 결과 포맷팅
      const formattedPayslips = payslips.map(p => ({
        employee_name: p.employee_name,
        employee_classification: p.employee_classification,
        store_name: p.store_name,
        pay_year_month: p.pay_year_month,
        pay_date: p.pay_date,
        settlement_period: `${p.settlement_start_date} ~ ${p.settlement_end_date}`,
        // 지급 항목
        base_salary: Number(p.base_salary) || 0,
        meal_allowance: Number(p.meal_allowance) || 0,
        car_allowance: Number(p.car_allowance) || 0,
        childcare_allowance: Number(p.childcare_allowance) || 0,
        overtime_allowance: Number(p.overtime_allowance) || 0,
        night_allowance: Number(p.night_allowance) || 0,
        holiday_allowance: Number(p.holiday_allowance) || 0,
        extra_work_allowance: Number(p.extra_work_allowance) || 0,
        position_bonus: Number(p.position_bonus) || 0,
        incentive: Number(p.incentive) || 0,
        // 공제 항목
        national_pension: Number(p.national_pension) || 0,
        health_insurance: Number(p.health_insurance) || 0,
        long_term_care_insurance: Number(p.long_term_care_insurance) || 0,
        employment_insurance: Number(p.employment_insurance) || 0,
        income_tax: Number(p.income_tax) || 0,
        local_income_tax: Number(p.local_income_tax) || 0,
        // 합계
        total_payment: Number(p.total_payment) || 0,
        total_deduction: Number(p.total_deduction) || 0,
        net_payment: Number(p.net_payment) || 0,
      }));

      return JSON.stringify({
        data: formattedPayslips,
        count: formattedPayslips.length,
        pay_year_month: payYearMonth || '전체',
        dataType: 'payslip',
        message: `급여명세서 정보입니다.`
      });
    }

    case 'get_store_count': {
      let query = supabase
        .from('stores')
        .select('*', { count: 'exact', head: true });

      if (toolInput.status && toolInput.status !== 'ALL') {
        query = query.eq('status', toolInput.status);
      }

      const { count, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        count,
        message: `매장은 총 ${count}개입니다.`
      });
    }

    case 'get_store_list': {
      const limit = (toolInput.limit as number) || 10;
      let query = supabase
        .from('stores')
        .select('id, name, address, phone, status, opening_hours, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (toolInput.status && toolInput.status !== 'ALL') {
        query = query.eq('status', toolInput.status);
      }
      if (toolInput.search) {
        query = query.ilike('name', `%${toolInput.search}%`);
      }

      const { data, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        data,
        count: data?.length || 0,
        dataType: 'store_list',
        message: `매장 목록입니다.`
      });
    }

    case 'get_store_detail': {
      let query = supabase
        .from('stores')
        .select('*');

      if (toolInput.id) {
        query = query.eq('id', toolInput.id);
      } else if (toolInput.name) {
        query = query.ilike('name', `%${toolInput.name}%`);
      }

      const { data, error } = await query.limit(1).single();
      if (error) {
        if (error.code === 'PGRST116') {
          return JSON.stringify({ error: '해당 매장을 찾을 수 없습니다.', dataType: 'not_found' });
        }
        return JSON.stringify({ error: error.message });
      }

      return JSON.stringify({
        data,
        dataType: 'store_detail',
        message: `${data.name}의 상세 정보입니다.`
      });
    }

    case 'get_menu_count': {
      const { count, error } = await supabase
        .from('menu')
        .select('*', { count: 'exact', head: true });

      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        count,
        message: `메뉴는 총 ${count}개입니다.`
      });
    }

    case 'get_order_summary': {
      let query = supabase
        .from('orders')
        .select('id, final_amount, status, payment_type');

      // 결제 수단 필터 적용
      if (toolInput.payment_type && toolInput.payment_type !== 'ALL') {
        query = query.eq('payment_type', toolInput.payment_type);
      }

      const { data: orders, error } = await query;

      if (error) return JSON.stringify({ error: error.message });

      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.final_amount || 0), 0) || 0;

      // 결제 수단별 집계
      const paymentStats = orders?.reduce((acc, order) => {
        const type = order.payment_type || 'OTHER';
        if (!acc[type]) {
          acc[type] = { count: 0, amount: 0 };
        }
        acc[type].count += 1;
        acc[type].amount += order.final_amount || 0;
        return acc;
      }, {} as Record<string, { count: number; amount: number }>) || {};

      const paymentTypeLabel = toolInput.payment_type && toolInput.payment_type !== 'ALL'
        ? ` (${toolInput.payment_type === 'CARD' ? '카드결제' : toolInput.payment_type === 'CASH' ? '현금결제' : toolInput.payment_type === 'TRANSFER' ? '계좌이체' : '기타'})`
        : '';

      return JSON.stringify({
        totalOrders,
        totalRevenue,
        payment_type_filter: toolInput.payment_type || 'ALL',
        payment_stats: paymentStats,
        message: `총 ${totalOrders}건의 주문${paymentTypeLabel}이 있으며, 총 매출은 ${totalRevenue.toLocaleString()}원입니다.`
      });
    }

    case 'get_store_sales': {
      // 디버그: 입력 파라미터 로깅
      console.log('[get_store_sales] toolInput:', JSON.stringify(toolInput));

      // 날짜 범위 계산 (한국 시간 기준)
      const now = new Date();
      const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
      const todayStr = koreaTime.toISOString().split('T')[0];
      const currentYear = koreaTime.getFullYear();

      let startDate: string;
      let endDate: string;
      const dateRange = (toolInput.date_range as string) || 'today';

      switch (dateRange) {
        case 'today':
          startDate = todayStr;
          endDate = todayStr;
          break;
        case 'yesterday': {
          const yesterday = new Date(koreaTime);
          yesterday.setDate(yesterday.getDate() - 1);
          startDate = yesterday.toISOString().split('T')[0];
          endDate = startDate;
          break;
        }
        case 'this_week': {
          const weekStart = new Date(koreaTime);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          startDate = weekStart.toISOString().split('T')[0];
          endDate = todayStr;
          break;
        }
        case 'last_week': {
          const lastWeekEnd = new Date(koreaTime);
          lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay() - 1);
          const lastWeekStart = new Date(lastWeekEnd);
          lastWeekStart.setDate(lastWeekStart.getDate() - 6);
          startDate = lastWeekStart.toISOString().split('T')[0];
          endDate = lastWeekEnd.toISOString().split('T')[0];
          break;
        }
        case 'this_month': {
          const monthStart = new Date(koreaTime.getFullYear(), koreaTime.getMonth(), 1);
          startDate = monthStart.toISOString().split('T')[0];
          endDate = todayStr;
          break;
        }
        case 'last_month': {
          const lastMonthEnd = new Date(koreaTime.getFullYear(), koreaTime.getMonth(), 0);
          const lastMonthStart = new Date(koreaTime.getFullYear(), koreaTime.getMonth() - 1, 1);
          startDate = lastMonthStart.toISOString().split('T')[0];
          endDate = lastMonthEnd.toISOString().split('T')[0];
          break;
        }
        case 'custom': {
          // 날짜 형식 보정 함수 (연도 없으면 현재 연도 추가)
          const fixDateFormat = (dateStr: string): string => {
            if (!dateStr) return todayStr;
            // 이미 YYYY-MM-DD 형식이면 그대로 반환
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
            // MM-DD 형식이면 현재 연도 추가
            if (/^\d{2}-\d{2}$/.test(dateStr)) return `${currentYear}-${dateStr}`;
            // M-D 또는 MM-D 등 형식이면 파싱 후 보정
            const parts = dateStr.split('-');
            if (parts.length === 2) {
              const month = parts[0].padStart(2, '0');
              const day = parts[1].padStart(2, '0');
              return `${currentYear}-${month}-${day}`;
            }
            return todayStr;
          };
          startDate = fixDateFormat(toolInput.start_date as string);
          endDate = fixDateFormat(toolInput.end_date as string);
          console.log('[get_store_sales] custom dates - start:', startDate, 'end:', endDate);
          break;
        }
        default:
          startDate = todayStr;
          endDate = todayStr;
      }

      // 매장 ID 결정 (지정하지 않으면 현재 사용자의 담당 매장 사용)
      let storeId = toolInput.store_id as number | undefined;
      const storeName = toolInput.store_name as string | undefined;
      let resolvedStoreName = currentUser.storeName;

      if (storeName && !storeId) {
        // 매장명으로 매장 ID 조회
        const { data: storeData } = await supabase
          .from('stores')
          .select('id, name')
          .ilike('name', `%${storeName}%`)
          .limit(1)
          .single();

        if (storeData) {
          storeId = storeData.id;
          resolvedStoreName = storeData.name;
        }
      }

      // 매장 ID가 없으면 현재 사용자의 담당 매장 사용
      if (!storeId) {
        storeId = currentUser.storeId;
        resolvedStoreName = currentUser.storeName;
      }

      // 주문 데이터 조회
      let query = supabase
        .from('orders')
        .select('id, final_amount, status, created_at, payment_type')
        .eq('store_id', storeId)
        .gte('created_at', `${startDate}T00:00:00`)
        .lte('created_at', `${endDate}T23:59:59`);

      // 결제 수단 필터 적용
      const paymentTypeFilter = toolInput.payment_type as string | undefined;
      if (paymentTypeFilter && paymentTypeFilter !== 'ALL') {
        query = query.eq('payment_type', paymentTypeFilter);
      }

      const { data: orders, error } = await query;

      if (error) return JSON.stringify({ error: error.message });

      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.final_amount || 0), 0) || 0;
      const completedOrders = orders?.filter(o => o.status === 'COMPLETED')?.length || 0;
      const cancelledOrders = orders?.filter(o => o.status === 'CANCELLED')?.length || 0;

      // 결제 수단별 집계
      const paymentStats = orders?.reduce((acc, order) => {
        const type = order.payment_type || 'OTHER';
        if (!acc[type]) {
          acc[type] = { count: 0, amount: 0 };
        }
        acc[type].count += 1;
        acc[type].amount += order.final_amount || 0;
        return acc;
      }, {} as Record<string, { count: number; amount: number }>) || {};

      // 기간 표시 문자열 생성
      let periodLabel = '';
      switch (dateRange) {
        case 'today': periodLabel = '오늘'; break;
        case 'yesterday': periodLabel = '어제'; break;
        case 'this_week': periodLabel = '이번 주'; break;
        case 'last_week': periodLabel = '지난 주'; break;
        case 'this_month': periodLabel = '이번 달'; break;
        case 'last_month': periodLabel = '지난 달'; break;
        default: periodLabel = `${startDate} ~ ${endDate}`;
      }

      // 결제 수단 라벨
      const paymentTypeLabel = paymentTypeFilter && paymentTypeFilter !== 'ALL'
        ? ` (${paymentTypeFilter === 'CARD' ? '카드결제' : paymentTypeFilter === 'CASH' ? '현금결제' : paymentTypeFilter === 'TRANSFER' ? '계좌이체' : '기타'})`
        : '';

      return JSON.stringify({
        store_id: storeId,
        store_name: resolvedStoreName,
        period: periodLabel,
        start_date: startDate,
        end_date: endDate,
        total_orders: totalOrders,
        completed_orders: completedOrders,
        cancelled_orders: cancelledOrders,
        total_revenue: totalRevenue,
        payment_type_filter: paymentTypeFilter || 'ALL',
        payment_stats: paymentStats,
        dataType: 'store_sales',
        message: `${resolvedStoreName}의 ${periodLabel}${paymentTypeLabel} 매출입니다. 총 ${totalOrders}건의 주문, 매출액 ${totalRevenue.toLocaleString()}원입니다.`
      });
    }

    default:
      return JSON.stringify({ error: '알 수 없는 도구입니다.' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: '메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자 컨텍스트 가져오기
    const userContext = getUserContextForAI();

    // 시스템 프롬프트
    const systemPrompt = `당신은 Whale ERP 시스템의 AI 어시스턴트입니다.
사용자가 비즈니스 관련 질문을 하면 적절한 도구를 사용하여 데이터베이스에서 정보를 조회하고 답변합니다.

${userContext}

## 도메인 용어집
사용자가 아래 용어나 약어를 사용하면 해당 의미로 이해하세요:
- BP, 비피 = Business Partner (거래처/파트너)
- 정직원 = contract_classification이 "정직원"인 직원
- 파트타이머, 알바, 아르바이트 = contract_classification이 "파트타이머"인 직원
- 본사, 본사직원 = employee_classification이 "본사 직원"
- 가맹점, 가맹점직원 = employee_classification이 "가맹점 직원"
- 점포, 점포직원 = employee_classification이 "점포 직원"

## 당신이 할 수 있는 일
- Business Partner(BP/거래처/파트너) 목록 조회, 상세 정보 조회, 개수 확인
- 직원 목록 조회, 상세 정보 조회, 개수 확인 (계약분류, 소속분류, 근무상태별)
- 직원 근무 스케줄(근무요일, 근무시간) 조회
- 직원 급여 정보(연봉, 월급, 시급) 조회 - **근로계약서 내용을 참조하여 계약 상태, 계약 기간, 급여 지급 주기, 업무 설명 등도 함께 제공**
- **직원 급여명세서 조회 - 급여명세서(payslips) 데이터를 기준으로 기본급, 각종 수당, 4대보험, 세금, 총 지급액, 총 공제액, 실수령액 정보 제공**
- 직원 실제 근무시간 조회 - **출퇴근 데이터를 기반으로 실제 근무시간 계산 (오늘/어제/이번주/지난주/이번달/지난달)**
- 현재 근무 중인 직원 조회 (오늘 출근 후 아직 퇴근하지 않은 직원)
- 매장(점포) 목록 조회, 상세 정보 조회, 개수 확인
- 메뉴 정보 조회
- 주문/매출 정보 요약
- **매장별 매출 조회 (오늘/어제/이번주/지난주/이번달/지난달)**

## 처리할 수 없는 요청
위에 명시된 "당신이 할 수 있는 일" 이외의 요청에 대해서는 반드시 "해당 요청은 처리할 수 없습니다."라고만 응답하세요. 추가 설명이나 지원 가능한 업무 목록을 나열하지 마세요.

**중요**: 도구 실행 결과에 에러가 있거나 "처리할 수 없습니다"라는 메시지가 있으면, 즉시 사용자에게 "해당 요청은 처리할 수 없습니다."라고 응답하고 끝내세요. 추가 도구를 사용하거나 계속 시도하지 마세요.

## 응답 규칙 (매우 중요!)
**모든 응답은 반드시 단답형으로 작성하세요.**

### 단답형 응답 원칙
- 불필요한 설명, 서론, 예의 표현 없이 핵심 정보만 간결하게 전달
- 질문에 대한 직접적인 답변만 제공
- 예: "을지로3가점 직원은 총 5명입니다." (O)
- 예: "안녕하세요. 을지로3가점의 직원 정보를 조회해드리겠습니다. 총 5명의 직원이 있습니다." (X)
- 숫자나 데이터를 말할 때는 명확하게 표현하되, 불필요한 수식어는 제거하세요

### 목록 응답 형식 (중요!)
**특별한 주문이 없다면 표 형식을 사용하지 말고 간단하게 나열하세요.**

- 직원이 누군지 묻는 요청: 이름만 나열 (예: "홍길동, 김철수, 이영희")
- 목록 조회 요청: 해당 내용만 간단히 나열 (예: "강남점, 을지로3가점, 신촌점")
- 사용자가 명시적으로 "표로 보여줘", "상세하게 보여줘" 같은 요청을 할 때만 표 형식 사용
- 기본적으로는 콤마로 구분된 간단한 나열 방식 사용

## 데이터 표시 형식 (표 형식은 사용자가 명시적으로 요청할 때만 사용)
사용자가 "표로 보여줘", "상세하게 보여줘" 같은 명시적 요청을 할 때만 다음과 같은 마크다운 테이블 형식으로 보여주세요:

### 직원 목록 예시
| 이름 | 직원번호 | 직책 | 소속 | 근무상태 |
|------|---------|------|------|---------|
| 홍길동 | EMP001 | 매니저 | 본사 직원 | 근무 |

### 매장 목록 예시
| 매장명 | 주소 | 전화번호 | 상태 |
|--------|------|---------|------|
| 강남점 | 서울시 강남구... | 02-1234-5678 | 운영중 |

### Business Partner 목록 예시
| 업체명 | 브랜드명 | 대표자 | 상태 |
|--------|---------|--------|------|
| (주)테스트 | 브랜드A | 김대표 | 운영중 |

### 근무 스케줄 예시
| 직원명 | 근무지 | 근무유형 | 근무요일 | 출근 | 퇴근 | 휴게시간 | 빈도 |
|--------|--------|---------|---------|------|------|---------|------|
| 홍길동 | 강남점 | 평일 | 월,화,수,목,금 | 09:00 | 18:00 | 12:00~13:00 | 매주 |

근무유형(day_type) 값 설명:
- WEEKDAY: 평일
- SATURDAY: 토요일
- SUNDAY: 일요일
- HOLIDAY: 공휴일

빈도(frequency) 값 설명:
- EVERY_WEEK: 매주
- EVERY_OTHER_WEEK: 격주

### 급여 정보 예시
급여 관련 요청 시 근로계약서의 내용을 참조하여 답변하세요. 근로계약서에는 계약 상태, 계약 기간, 급여 지급 주기, 업무 설명 등의 정보가 포함되어 있습니다.

사용자가 "표로 보여줘" 같은 명시적 요청을 할 때만 표 형식 사용:
| 직원명 | 근무지 | 급여유형 | 연봉 | 월급 | 시급 | 계약상태 | 계약기간 | 급여지급주기 |
|--------|--------|---------|------|------|------|---------|---------|------------|
| 홍길동 | 강남점 | 연봉제 | 45,000,000원 | 3,750,000원 | 12,360원 | 계약중 | 2024-01-01 ~ 2024-12-31 | 월 1회 |

기본적으로는 간단하게 나열:
- "홍길동: 연봉제, 연봉 45,000,000원, 계약중 (2024-01-01 ~ 2024-12-31), 월 1회 지급"

급여유형(salary_type) 값 설명:
- ANNUAL: 연봉제
- MONTHLY: 월급제
- HOURLY: 시급제

계약 상태(contract_status) 값 설명:
- 계약중, 계약만료, 계약해지 등

금액 표시 시 천 단위 콤마를 사용하고 '원'을 붙여주세요.

### 급여명세서 응답 형식 (중요!)
급여명세서 관련 요청("급여명세서 보여줘", "실수령액 알려줘", "11월 급여", "이번달 급여" 등)은 반드시 급여명세서(payslips) 데이터를 기준으로 응답하세요.

**단일 직원 급여명세서 (기본 형식):**
- "홍길동님 2024년 11월 급여: 총 지급액 3,683,333원, 총 공제액 418,960원, 실수령액 3,264,373원"

**상세 정보 요청 시:**
- 지급 항목: 기본급, 식대, 연장근무수당, 야간근무수당, 휴일근무수당 등
- 공제 항목: 국민연금, 건강보험, 장기요양보험, 고용보험, 소득세, 지방소득세
- 합계: 총 지급액, 총 공제액, 실수령액

**여러 직원 급여명세서 간단 나열:**
- "홍길동: 실수령액 3,264,373원, 김철수: 실수령액 3,695,350원"

**표 형식 (사용자가 명시적으로 요청할 때만):**
| 직원명 | 기본급 | 식대 | 총 지급액 | 총 공제액 | 실수령액 |
|--------|--------|------|-----------|-----------|----------|
| 홍길동 | 3,333,333원 | 200,000원 | 3,683,333원 | 418,960원 | 3,264,373원 |

### 현재 근무 중인 직원 예시
| 직원명 | 계약분류 | 근무지 | 출근시간 | 연락처 |
|--------|---------|--------|---------|--------|
| 김철수 | 정직원 | 강남점 | 09:00 | 010-1234-5678 |

현재 근무 중인 직원은 오늘 출근했지만 아직 퇴근 기록이 없는 직원입니다.

### 근무시간 응답 형식 (중요!)
근무시간 관련 요청에는 출퇴근 데이터를 기반으로 계산한 실제 근무시간을 제공하세요:
- 단일 직원: "홍길동 이번주 근무시간은 40시간입니다."
- 여러 직원: "홍길동: 40시간, 김철수: 35시간, 이영희: 38시간"
- 기간별: "이번달 근무시간은 160시간입니다."
- 특별한 주문이 없다면 표 형식 사용하지 말고 간단히 나열하세요.

### 일 매출 응답 형식 (중요!)
오늘/어제/특정일 매출을 묻는 질문에는 **반드시** 아래 형식으로 간단하게 답변하세요:
- "오늘 매출은 1,234,500원입니다."
- "어제 매출은 987,000원입니다."
- "12월 10일 매출은 500,000원입니다."

표나 추가 정보 없이 한 문장으로 간결하게 답변합니다.

### 기간 매출 응답 형식
이번주/이번달 등 기간 매출을 묻는 질문에는 간단히 답변:
- "이번주 매출은 5,500,000원입니다."
- "이번달 매출은 23,400,000원입니다."

### 매출 비교 응답 형식 (중요!)
"11월과 12월 매출 비교해줘", "이번달과 저번달 매출 비교" 같은 매출 비교 요청에는 **반드시** 아래 형식으로 간단하게 답변하세요:
- "11월은 12,345,000원, 12월은 15,678,000원, 3,333,000원 증가했습니다."
- "10월은 8,000,000원, 11월은 6,500,000원, 1,500,000원 감소했습니다."

표나 추가 분석 없이 한 문장으로 간결하게 답변합니다. 증가/감소 여부만 명시하세요.

매출 조회 시 특정 매장을 언급하지 않으면 현재 로그인한 사용자의 담당 매장(을지로3가점) 데이터를 조회합니다.`;

    // 대화 메시지 구성
    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    // Claude API 호출
    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      tools,
      messages,
    });

    // 도구 사용이 필요한 경우 처리 (최대 5회 반복 제한)
    let toolUseCount = 0;
    const maxToolUseIterations = 5;
    
    while (response.stop_reason === 'tool_use' && toolUseCount < maxToolUseIterations) {
      toolUseCount++;
      
      // 모든 tool_use 블록 찾기
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
      );

      if (toolUseBlocks.length === 0) break;

      // 모든 도구 병렬 실행
      const toolResults = await Promise.all(
        toolUseBlocks.map(async (toolUseBlock) => {
          try {
            const result = await executeTool(
              toolUseBlock.name,
              toolUseBlock.input as Record<string, unknown>
            );
            return {
              type: 'tool_result' as const,
              tool_use_id: toolUseBlock.id,
              content: result,
            };
          } catch (error) {
            console.error(`Tool execution error for ${toolUseBlock.name}:`, error);
            return {
              type: 'tool_result' as const,
              tool_use_id: toolUseBlock.id,
              content: JSON.stringify({ 
                error: `도구 실행 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}` 
              }),
            };
          }
        })
      );

      // 도구 실행 결과에 에러나 "처리할 수 없습니다" 메시지가 있는지 확인
      let shouldStopEarly = false;
      for (const toolResult of toolResults) {
        try {
          const resultData = JSON.parse(toolResult.content);
          // 에러가 있거나, 처리할 수 없다는 메시지가 있으면 즉시 종료
          if (resultData.error || 
              (typeof resultData.message === 'string' && 
               (resultData.message.includes('처리할 수 없') || 
                resultData.message.includes('알 수 없는 도구')))) {
            shouldStopEarly = true;
            break;
          }
        } catch {
          // JSON 파싱 실패 시 무시 (일반 텍스트 응답일 수 있음)
        }
      }

      // 도구 결과와 함께 다시 API 호출
      messages.push({ role: 'assistant', content: response.content });
      messages.push({
        role: 'user',
        content: toolResults,
      });

      try {
        response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemPrompt,
          tools,
          messages,
        });

        // 처리할 수 없는 요청이면 즉시 종료
        if (shouldStopEarly) {
          break;
        }
      } catch (error) {
        console.error('Anthropic API error during tool use:', error);
        throw error;
      }
    }

    // 도구 사용 횟수 초과 시 경고
    if (toolUseCount >= maxToolUseIterations && response.stop_reason === 'tool_use') {
      console.warn('Maximum tool use iterations reached');
      // 강제로 응답 생성
      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt + '\n\n중요: 도구 사용 횟수가 초과되었습니다. 사용자에게 "죄송합니다. 요청을 처리하는데 시간이 너무 오래 걸렸습니다. 다시 시도해주세요."라고 응답하세요.',
        messages: [
          ...messages,
          {
            role: 'user',
            content: '도구 사용 횟수가 초과되었습니다. 사용자에게 간단히 사과 메시지를 전달하세요.',
          },
        ],
      });
    }

    // 최종 텍스트 응답 추출
    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    );

    const assistantMessage = textBlock?.text || '죄송합니다. 응답을 생성할 수 없습니다.';

    return NextResponse.json({
      message: assistantMessage,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage },
      ],
    });
  } catch (error) {
    console.error('AI Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'AI 응답 생성 중 오류가 발생했습니다.', details: errorMessage },
      { status: 500 }
    );
  }
}
