import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 근무요일 타입을 한글로 변환
 */
function formatWorkDays(dayTypes: string[]): string {
  const dayTypeMap: Record<string, string> = {
    'WEEKDAY': '평일',
    'SATURDAY': '토요일',
    'SUNDAY': '일요일',
  };

  const formatted = dayTypes.map(type => dayTypeMap[type] || type);
  return formatted.join(', ');
}

/**
 * 출퇴근 현황 목록 조회 (GET)
 * - 계약 완료(COMPLETED) 상태인 직원만 조회
 * - 직원별 하나의 카드로 표시
 * - 근무요일은 근로 계약의 계약 근무 시간에서 조회
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const workStatus = searchParams.get('workStatus') || '';
    const storeId = searchParams.get('storeId') || '';
    const offset = (page - 1) * limit;

    // 계약 완료된 직원 목록 조회 (직원별 하나의 레코드)
    let query = supabase
      .from('employment_contracts')
      .select(`
        id,
        contract_status,
        employee:employees!inner(
          id,
          employee_id,
          name,
          employee_classification,
          contract_classification,
          employment_status,
          workplace_type,
          workplace_name,
          workplace_full_name
        ),
        store:stores(
          id,
          name
        ),
        work_schedules:contract_work_schedules(
          day_type,
          work_days,
          work_start_time,
          work_end_time
        )
      `, { count: 'exact' })
      .eq('is_deleted', false)
      .eq('contract_status', 'COMPLETED')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 검색 조건: 직원명 검색
    if (search) {
      query = query.ilike('employee.name', `%${search}%`);
    }

    // 근무 상태 필터
    if (workStatus) {
      query = query.eq('employee.employment_status', workStatus);
    }

    // 점포 필터
    if (storeId) {
      query = query.eq('store_id', parseInt(storeId));
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // UI 형식에 맞게 데이터 변환
    const formattedData = (data || []).map((record: unknown) => {
      const r = record as {
        id: number;
        contract_status: string;
        employee: {
          id: number;
          employee_id: string;
          name: string;
          employee_classification: string;
          contract_classification: string;
          employment_status: string;
          workplace_type: string;
          workplace_name: string;
          workplace_full_name: string;
        };
        store: {
          id: number;
          name: string;
        } | null;
        work_schedules: Array<{
          day_type: string;
          work_days: string | null;
          work_start_time: string | null;
          work_end_time: string | null;
        }>;
      };

      const employee = r.employee;
      const store = r.store;
      const workSchedules = r.work_schedules || [];

      // 근무요일 추출 (day_type 값들을 모아서 변환)
      const dayTypes = workSchedules.map(ws => ws.day_type);
      const workDays = dayTypes.length > 0 ? formatWorkDays(dayTypes) : '-';

      return {
        id: employee?.id || r.id,
        employeeId: employee?.id,
        contractId: r.id,
        workStatus: employee?.employment_status || '-',
        headquarters: employee?.workplace_full_name || employee?.workplace_name || '-',
        franchise: employee?.workplace_name || '-',
        store: store?.name || '-',
        employeeName: employee?.name || '-',
        employeeClassification: employee?.employee_classification || '-',
        contractType: employee?.contract_classification || '-',
        workDay: workDays,
      };
    });

    return NextResponse.json({
      data: formattedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 출퇴근 기록 생성 (POST)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      employee_id,
      store_id,
      work_date,
      attendance_status,
      is_absent,
      memo,
      created_by,
    } = body;

    // 필수 필드 검증
    if (!employee_id || !store_id || !work_date) {
      return NextResponse.json(
        { error: 'employee_id, store_id, and work_date are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('attendance_records')
      .insert({
        employee_id,
        store_id,
        work_date,
        attendance_status: attendance_status || 'working',
        is_absent: is_absent || false,
        memo,
        created_by,
        updated_by: created_by,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
