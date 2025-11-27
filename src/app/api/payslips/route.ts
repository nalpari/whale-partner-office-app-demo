import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 급여명세서 목록 조회 (GET)
 *
 * Query Parameters:
 * - page: 페이지 번호 (기본값: 1)
 * - limit: 페이지당 항목 수 (기본값: 10)
 * - headquarters: 본사명 필터
 * - franchise: 가맹점명 필터
 * - store: 점포명 필터
 * - employmentStatus: 근무여부 필터
 * - employeeName: 직원명 검색
 * - employeeClassification: 직원분류 필터
 * - payYearMonth: 급여지급월 필터 (YYYY-MM)
 * - startDate: 급여일 시작일 필터
 * - endDate: 급여일 종료일 필터
 * - emailStatus: 이메일 전송 상태 필터
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 필터 파라미터
    const headquarters = searchParams.get('headquarters') || '';
    const franchise = searchParams.get('franchise') || '';
    const store = searchParams.get('store') || '';
    const employmentStatus = searchParams.get('employmentStatus') || '';
    const employeeName = searchParams.get('employeeName') || '';
    const employeeClassification = searchParams.get('employeeClassification') || '';
    const payYearMonth = searchParams.get('payYearMonth') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const emailStatus = searchParams.get('emailStatus') || '';

    let query = supabase
      .from('payslips')
      .select(`
        id,
        employee_id,
        store_id,
        headquarters_name,
        franchise_name,
        store_name,
        employee_name,
        employee_classification,
        employment_status,
        pay_year_month,
        pay_date,
        settlement_start_date,
        settlement_end_date,
        total_payment,
        total_deduction,
        net_payment,
        email_status,
        email_sent_at,
        created_at,
        updated_at,
        employees (
          id,
          employee_id,
          name,
          email
        )
      `, { count: 'exact' })
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 본사 필터
    if (headquarters) {
      query = query.eq('headquarters_name', headquarters);
    }

    // 가맹점 필터
    if (franchise) {
      query = query.eq('franchise_name', franchise);
    }

    // 점포 필터
    if (store) {
      query = query.eq('store_name', store);
    }

    // 근무여부 필터
    if (employmentStatus) {
      query = query.eq('employment_status', employmentStatus);
    }

    // 직원명 검색
    if (employeeName) {
      query = query.ilike('employee_name', `%${employeeName}%`);
    }

    // 직원분류 필터
    if (employeeClassification) {
      query = query.eq('employee_classification', employeeClassification);
    }

    // 급여지급월 필터
    if (payYearMonth) {
      query = query.eq('pay_year_month', payYearMonth);
    }

    // 급여일 기간 필터
    if (startDate) {
      query = query.gte('pay_date', startDate);
    }
    if (endDate) {
      query = query.lte('pay_date', endDate);
    }

    // 이메일 전송 상태 필터
    if (emailStatus) {
      query = query.eq('email_status', emailStatus);
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
    console.error('급여명세서 목록 조회 오류:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 급여명세서 생성 (POST)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      employee_id,
      store_id,
      headquarters_name,
      franchise_name,
      store_name,
      employee_name,
      employee_classification,
      employment_status,
      pay_year_month,
      pay_date,
      settlement_start_date,
      settlement_end_date,
      use_file_attachment,
      attachment_file_name,
      attachment_file_path,
      base_salary,
      meal_allowance,
      car_allowance,
      childcare_allowance,
      overtime_allowance,
      night_allowance,
      holiday_allowance,
      extra_work_allowance,
      position_bonus,
      incentive,
      national_pension,
      health_insurance,
      long_term_care_insurance,
      employment_insurance,
      income_tax,
      local_income_tax,
      created_by,
    } = body;

    // 필수 필드 검증
    if (!employee_id || !employee_name || !pay_year_month || !pay_date || !settlement_start_date || !settlement_end_date) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다. (employee_id, employee_name, pay_year_month, pay_date, settlement_start_date, settlement_end_date)' },
        { status: 400 }
      );
    }

    // 지급액 합계 계산
    const totalPayment =
      (Number(base_salary) || 0) +
      (Number(meal_allowance) || 0) +
      (Number(car_allowance) || 0) +
      (Number(childcare_allowance) || 0) +
      (Number(overtime_allowance) || 0) +
      (Number(night_allowance) || 0) +
      (Number(holiday_allowance) || 0) +
      (Number(extra_work_allowance) || 0) +
      (Number(position_bonus) || 0) +
      (Number(incentive) || 0);

    // 공제액 합계 계산
    const totalDeduction =
      (Number(national_pension) || 0) +
      (Number(health_insurance) || 0) +
      (Number(long_term_care_insurance) || 0) +
      (Number(employment_insurance) || 0) +
      (Number(income_tax) || 0) +
      (Number(local_income_tax) || 0);

    // 실지급액 계산
    const netPayment = totalPayment - totalDeduction;

    const { data, error } = await supabase
      .from('payslips')
      .insert({
        employee_id,
        store_id,
        headquarters_name,
        franchise_name,
        store_name,
        employee_name,
        employee_classification,
        employment_status: employment_status || '근무',
        pay_year_month,
        pay_date,
        settlement_start_date,
        settlement_end_date,
        use_file_attachment: use_file_attachment || false,
        attachment_file_name,
        attachment_file_path,
        base_salary: base_salary || 0,
        meal_allowance: meal_allowance || 0,
        car_allowance: car_allowance || 0,
        childcare_allowance: childcare_allowance || 0,
        overtime_allowance: overtime_allowance || 0,
        night_allowance: night_allowance || 0,
        holiday_allowance: holiday_allowance || 0,
        extra_work_allowance: extra_work_allowance || 0,
        position_bonus: position_bonus || 0,
        incentive: incentive || 0,
        national_pension: national_pension || 0,
        health_insurance: health_insurance || 0,
        long_term_care_insurance: long_term_care_insurance || 0,
        employment_insurance: employment_insurance || 0,
        income_tax: income_tax || 0,
        local_income_tax: local_income_tax || 0,
        total_payment: totalPayment,
        total_deduction: totalDeduction,
        net_payment: netPayment,
        email_status: 'NOT_SENT',
        created_by,
        updated_by: created_by,
      })
      .select()
      .single();

    if (error) {
      console.error('급여명세서 생성 오류:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('급여명세서 생성 오류:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
