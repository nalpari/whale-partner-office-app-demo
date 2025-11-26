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
    // 현재 DB 스키마에서 FK 관계가 설정된 테이블만 조인
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

    return NextResponse.json({ data });
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
