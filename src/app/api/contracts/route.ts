import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 근로 계약 목록 조회 (GET)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const offset = (page - 1) * limit;

    // 근로 계약 목록 조회 (직원 정보 포함)
    let query = supabase
      .from('employment_contracts')
      .select(`
        *,
        employees (
          id,
          employee_id,
          name,
          position,
          employee_classification,
          contract_classification
        ),
        stores (
          id,
          name
        ),
        contract_salaries (
          annual_salary,
          monthly_salary,
          hourly_wage
        )
      `, { count: 'exact' })
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 검색 조건 추가
    if (search) {
      // 직원명으로 검색하기 위해 별도 쿼리 필요
      const { data: employeeIds } = await supabase
        .from('employees')
        .select('id')
        .ilike('name', `%${search}%`);

      if (employeeIds && employeeIds.length > 0) {
        const ids = employeeIds.map(e => e.id);
        query = query.in('employee_id', ids);
      }
    }

    // 계약 상태 필터
    if (status) {
      query = query.eq('contract_status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 근로 계약 생성 (POST)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      employee_id,
      store_id,
      contract_status,
      is_electronic,
      company_name,
      store_name,
      brand_name,
      job_description,
      salary_type,
      pay_cycle,
      pay_day,
      contract_start_date,
      contract_end_date,
      work_start_date,
      created_by,
    } = body;

    // 필수 필드 검증
    if (!employee_id || !salary_type || !pay_cycle || !contract_start_date || !work_start_date) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('employment_contracts')
      .insert({
        employee_id,
        store_id,
        contract_status: contract_status || 'DRAFT',
        is_electronic: is_electronic || false,
        company_name,
        store_name,
        brand_name,
        job_description,
        salary_type,
        pay_cycle,
        pay_day,
        contract_start_date,
        contract_end_date,
        work_start_date,
        created_by,
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
