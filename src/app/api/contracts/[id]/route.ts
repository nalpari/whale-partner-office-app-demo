import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 근로 계약 상세 조회 (GET)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contractId = parseInt(id);

    if (isNaN(contractId)) {
      return NextResponse.json(
        { error: 'Invalid contract ID' },
        { status: 400 }
      );
    }

    // 근로 계약 상세 정보 조회 (관련 테이블 포함)
    const { data, error } = await supabase
      .from('employment_contracts')
      .select(`
        *,
        employees (
          id,
          employee_id,
          name,
          position,
          phone,
          email,
          employee_classification,
          contract_classification
        ),
        stores (
          id,
          name
        ),
        contract_salaries (
          id,
          annual_salary,
          monthly_salary,
          hourly_wage
        ),
        contract_work_schedules (
          id,
          day_type,
          work_start_time,
          work_end_time,
          break_start_time,
          break_end_time
        )
      `)
      .eq('id', contractId)
      .eq('is_deleted', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '계약 정보를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 프론트엔드 호환성을 위해 데이터 매핑
    const resultData = {
      ...data,
      // 프론트엔드에서 사용하는 필드명으로 매핑
      employment_contract_work_hours: data.contract_work_schedules,
    };

    return NextResponse.json({ data: resultData });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 근로 계약 삭제 (DELETE) - Soft Delete
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contractId = parseInt(id);

    if (isNaN(contractId)) {
      return NextResponse.json(
        { error: 'Invalid contract ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('employment_contracts')
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq('id', contractId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
