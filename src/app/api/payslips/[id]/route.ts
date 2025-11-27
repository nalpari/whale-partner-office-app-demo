import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * 급여명세서 상세 조회 (GET)
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const payslipId = parseInt(id);

    if (isNaN(payslipId)) {
      return NextResponse.json(
        { error: '유효하지 않은 급여명세서 ID입니다.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('payslips')
      .select(`
        *,
        employees (
          id,
          employee_id,
          name,
          email,
          phone,
          position,
          employee_classification,
          contract_classification
        ),
        stores (
          id,
          name,
          address
        )
      `)
      .eq('id', payslipId)
      .eq('is_deleted', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '급여명세서를 찾을 수 없습니다.' },
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
    console.error('급여명세서 상세 조회 오류:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 급여명세서 수정 (PUT)
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const payslipId = parseInt(id);

    if (isNaN(payslipId)) {
      return NextResponse.json(
        { error: '유효하지 않은 급여명세서 ID입니다.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
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
      updated_by,
    } = body;

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      updated_by,
    };

    // 선택적 필드 업데이트
    if (store_id !== undefined) updateData.store_id = store_id;
    if (headquarters_name !== undefined) updateData.headquarters_name = headquarters_name;
    if (franchise_name !== undefined) updateData.franchise_name = franchise_name;
    if (store_name !== undefined) updateData.store_name = store_name;
    if (employee_name !== undefined) updateData.employee_name = employee_name;
    if (employee_classification !== undefined) updateData.employee_classification = employee_classification;
    if (employment_status !== undefined) updateData.employment_status = employment_status;
    if (pay_year_month !== undefined) updateData.pay_year_month = pay_year_month;
    if (pay_date !== undefined) updateData.pay_date = pay_date;
    if (settlement_start_date !== undefined) updateData.settlement_start_date = settlement_start_date;
    if (settlement_end_date !== undefined) updateData.settlement_end_date = settlement_end_date;
    if (use_file_attachment !== undefined) updateData.use_file_attachment = use_file_attachment;
    if (attachment_file_name !== undefined) updateData.attachment_file_name = attachment_file_name;
    if (attachment_file_path !== undefined) updateData.attachment_file_path = attachment_file_path;
    if (base_salary !== undefined) updateData.base_salary = base_salary;
    if (meal_allowance !== undefined) updateData.meal_allowance = meal_allowance;
    if (car_allowance !== undefined) updateData.car_allowance = car_allowance;
    if (childcare_allowance !== undefined) updateData.childcare_allowance = childcare_allowance;
    if (overtime_allowance !== undefined) updateData.overtime_allowance = overtime_allowance;
    if (night_allowance !== undefined) updateData.night_allowance = night_allowance;
    if (holiday_allowance !== undefined) updateData.holiday_allowance = holiday_allowance;
    if (extra_work_allowance !== undefined) updateData.extra_work_allowance = extra_work_allowance;
    if (position_bonus !== undefined) updateData.position_bonus = position_bonus;
    if (incentive !== undefined) updateData.incentive = incentive;
    if (national_pension !== undefined) updateData.national_pension = national_pension;
    if (health_insurance !== undefined) updateData.health_insurance = health_insurance;
    if (long_term_care_insurance !== undefined) updateData.long_term_care_insurance = long_term_care_insurance;
    if (employment_insurance !== undefined) updateData.employment_insurance = employment_insurance;
    if (income_tax !== undefined) updateData.income_tax = income_tax;
    if (local_income_tax !== undefined) updateData.local_income_tax = local_income_tax;

    // 급여 항목이 변경된 경우 합계 재계산
    if (
      base_salary !== undefined ||
      meal_allowance !== undefined ||
      car_allowance !== undefined ||
      childcare_allowance !== undefined ||
      overtime_allowance !== undefined ||
      night_allowance !== undefined ||
      holiday_allowance !== undefined ||
      extra_work_allowance !== undefined ||
      position_bonus !== undefined ||
      incentive !== undefined ||
      national_pension !== undefined ||
      health_insurance !== undefined ||
      long_term_care_insurance !== undefined ||
      employment_insurance !== undefined ||
      income_tax !== undefined ||
      local_income_tax !== undefined
    ) {
      // 기존 데이터 조회하여 합계 재계산
      const { data: existingData } = await supabase
        .from('payslips')
        .select('*')
        .eq('id', payslipId)
        .single();

      if (existingData) {
        const finalBaseSalary = base_salary ?? existingData.base_salary;
        const finalMealAllowance = meal_allowance ?? existingData.meal_allowance;
        const finalCarAllowance = car_allowance ?? existingData.car_allowance;
        const finalChildcareAllowance = childcare_allowance ?? existingData.childcare_allowance;
        const finalOvertimeAllowance = overtime_allowance ?? existingData.overtime_allowance;
        const finalNightAllowance = night_allowance ?? existingData.night_allowance;
        const finalHolidayAllowance = holiday_allowance ?? existingData.holiday_allowance;
        const finalExtraWorkAllowance = extra_work_allowance ?? existingData.extra_work_allowance;
        const finalPositionBonus = position_bonus ?? existingData.position_bonus;
        const finalIncentive = incentive ?? existingData.incentive;
        const finalNationalPension = national_pension ?? existingData.national_pension;
        const finalHealthInsurance = health_insurance ?? existingData.health_insurance;
        const finalLongTermCareInsurance = long_term_care_insurance ?? existingData.long_term_care_insurance;
        const finalEmploymentInsurance = employment_insurance ?? existingData.employment_insurance;
        const finalIncomeTax = income_tax ?? existingData.income_tax;
        const finalLocalIncomeTax = local_income_tax ?? existingData.local_income_tax;

        const recalculatedTotalPayment =
          (Number(finalBaseSalary) || 0) +
          (Number(finalMealAllowance) || 0) +
          (Number(finalCarAllowance) || 0) +
          (Number(finalChildcareAllowance) || 0) +
          (Number(finalOvertimeAllowance) || 0) +
          (Number(finalNightAllowance) || 0) +
          (Number(finalHolidayAllowance) || 0) +
          (Number(finalExtraWorkAllowance) || 0) +
          (Number(finalPositionBonus) || 0) +
          (Number(finalIncentive) || 0);

        const recalculatedTotalDeduction =
          (Number(finalNationalPension) || 0) +
          (Number(finalHealthInsurance) || 0) +
          (Number(finalLongTermCareInsurance) || 0) +
          (Number(finalEmploymentInsurance) || 0) +
          (Number(finalIncomeTax) || 0) +
          (Number(finalLocalIncomeTax) || 0);

        updateData.total_payment = recalculatedTotalPayment;
        updateData.total_deduction = recalculatedTotalDeduction;
        updateData.net_payment = recalculatedTotalPayment - recalculatedTotalDeduction;
      }
    }

    const { data, error } = await supabase
      .from('payslips')
      .update(updateData)
      .eq('id', payslipId)
      .eq('is_deleted', false)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: '급여명세서를 찾을 수 없습니다.' },
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
    console.error('급여명세서 수정 오류:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 급여명세서 삭제 (DELETE) - 논리적 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const payslipId = parseInt(id);

    if (isNaN(payslipId)) {
      return NextResponse.json(
        { error: '유효하지 않은 급여명세서 ID입니다.' },
        { status: 400 }
      );
    }

    // 삭제 전 존재 여부 확인
    const { data: existingData, error: fetchError } = await supabase
      .from('payslips')
      .select('id')
      .eq('id', payslipId)
      .eq('is_deleted', false)
      .single();

    if (fetchError || !existingData) {
      return NextResponse.json(
        { error: '급여명세서를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 논리적 삭제 (is_deleted = true)
    const { error } = await supabase
      .from('payslips')
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payslipId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '급여명세서가 삭제되었습니다.' });
  } catch (error) {
    console.error('급여명세서 삭제 오류:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
