import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 분을 시간:분 형식으로 변환
 */
function formatMinutesToHours(minutes: number): string {
  if (minutes <= 0) return '-';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}시간`;
  }
  return `${hours}시간 ${mins}분`;
}

/**
 * 날짜를 한글 형식으로 변환 (2025.11.14 (금))
 */
function formatDateKorean(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[date.getDay()];

  return `${year}.${month}.${day} (${dayName})`;
}

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
 * 출퇴근 상세 조회 (GET)
 * - employeeId로 직원의 출퇴근 기록 조회
 * - 직원 정보, 계약 정보, 출퇴근 기록 포함
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employeeId = parseInt(id);

    if (isNaN(employeeId)) {
      return NextResponse.json(
        { error: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    // URL 파라미터에서 날짜 범위 가져오기
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 1. 직원 정보 조회
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select(`
        id,
        employee_id,
        name,
        employee_classification,
        contract_classification,
        employment_status,
        workplace_type,
        workplace_name,
        workplace_full_name
      `)
      .eq('id', employeeId)
      .eq('is_deleted', false)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // 2. 계약 정보 조회 (계약 완료된 것)
    const { data: contract, error: contractError } = await supabase
      .from('employment_contracts')
      .select(`
        id,
        contract_status,
        store:stores(
          id,
          name
        ),
        work_schedules:contract_work_schedules(
          day_type
        )
      `)
      .eq('employee_id', employeeId)
      .eq('is_deleted', false)
      .eq('contract_status', 'COMPLETED')
      .single();

    if (contractError) {
      console.error('Contract error:', contractError);
    }

    // 3. 출퇴근 기록 조회
    let attendanceQuery = supabase
      .from('attendance_records')
      .select(`
        id,
        work_date,
        attendance_status,
        is_absent,
        total_work_minutes,
        memo,
        sessions:attendance_sessions(
          id,
          session_number,
          clock_in_time,
          clock_out_time,
          work_minutes
        )
      `)
      .eq('employee_id', employeeId)
      .eq('is_deleted', false)
      .order('work_date', { ascending: true });

    // 날짜 필터 적용
    if (startDate) {
      attendanceQuery = attendanceQuery.gte('work_date', startDate);
    }
    if (endDate) {
      attendanceQuery = attendanceQuery.lte('work_date', endDate);
    }

    const { data: attendanceRecords, error: attendanceError } = await attendanceQuery;

    if (attendanceError) {
      console.error('Attendance error:', attendanceError);
      return NextResponse.json(
        { error: attendanceError.message },
        { status: 500 }
      );
    }

    // 근무요일 추출
    const dayTypes = contract?.work_schedules?.map((ws: { day_type: string }) => ws.day_type) || [];
    const workDays = dayTypes.length > 0 ? formatWorkDays(dayTypes) : '-';

    // 점포 정보
    const storeData = contract?.store as unknown;
    const store = storeData as { id: number; name: string } | null;

    // 출퇴근 기록 포맷팅
    const records = (attendanceRecords || []).map((record: {
      id: number;
      work_date: string;
      attendance_status: string;
      is_absent: boolean;
      total_work_minutes: number;
      memo: string | null;
      sessions: Array<{
        id: number;
        session_number: number;
        clock_in_time: string | null;
        clock_out_time: string | null;
        work_minutes: number | null;
      }>;
    }) => {
      const sessions = (record.sessions || [])
        .sort((a, b) => a.session_number - b.session_number)
        .map(session => ({
          startTime: session.clock_in_time?.slice(0, 5) || '-',
          endTime: session.clock_out_time?.slice(0, 5) || '-',
          workHours: session.work_minutes ? formatMinutesToHours(session.work_minutes) : '-',
        }));

      // 세션이 없는 경우 기본 세션 추가
      if (sessions.length === 0) {
        sessions.push({
          startTime: '-',
          endTime: '-',
          workHours: '-',
        });
      }

      return {
        date: formatDateKorean(record.work_date),
        sessions,
        totalHours: sessions.length > 1 ? formatMinutesToHours(record.total_work_minutes) : undefined,
        isAbsent: record.is_absent,
        memo: record.memo,
      };
    });

    // 응답 데이터 구성
    const responseData = {
      id: employee.id,
      employeeCode: employee.employee_id,
      workStatus: employee.employment_status || '-',
      headquarters: employee.workplace_full_name || employee.workplace_name || '-',
      franchise: employee.workplace_name || '-',
      store: store?.name || '-',
      employeeName: employee.name || '-',
      employeeClassification: employee.employee_classification || '-',
      contractType: employee.contract_classification || '-',
      workDay: workDays,
      records,
    };

    return NextResponse.json({ data: responseData });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
