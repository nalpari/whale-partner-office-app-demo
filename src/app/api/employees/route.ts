import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 직원 목록 조회 (GET)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const employeeClassification = searchParams.get('employee_classification') || '';
    const employmentStatus = searchParams.get('employment_status') || '';
    const offset = (page - 1) * limit;

    let query = supabase
      .from('employees')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 검색 조건 추가
    if (search) {
      query = query.or(`name.ilike.%${search}%,employee_id.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // 직원 분류 필터 (정직원, 계약직 등)
    if (employeeClassification) {
      query = query.eq('employee_classification', employeeClassification);
    }

    // 근무 상태 필터 (근무, 퇴사 등)
    if (employmentStatus) {
      query = query.eq('employment_status', employmentStatus);
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
 * 직원 생성 (POST)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      member_id,
      employee_id,
      name,
      position,
      hire_date,
      phone,
      email,
      address,
      workplace_type,
      workplace_name,
      workplace_full_name,
      employee_classification,
      contract_classification,
      bank_name,
      account_number,
      account_holder,
      employment_status,
      employment_memo,
      health_checkup_expiry_date,
      login_id,
      login_permission,
      approval_status,
      approval_request_date,
      approval_join_date,
      created_by,
    } = body;

    // 필수 필드 검증
    if (!employee_id || !name) {
      return NextResponse.json(
        { error: 'employee_id and name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('employees')
      .insert({
        member_id,
        employee_id,
        name,
        position,
        hire_date,
        phone,
        email,
        address,
        workplace_type,
        workplace_name,
        workplace_full_name,
        employee_classification,
        contract_classification,
        bank_name,
        account_number,
        account_holder,
        employment_status: employment_status || '근무',
        employment_memo,
        health_checkup_expiry_date,
        login_id,
        login_permission,
        approval_status: approval_status || '가입요청전',
        approval_request_date,
        approval_join_date,
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







