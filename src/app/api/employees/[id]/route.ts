import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 직원 상세 조회 (GET)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 직원 기본 정보 조회
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (employeeError) {
      return NextResponse.json(
        { error: employeeError.message },
        { status: 500 }
      );
    }

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // 경력 정보 조회
    const { data: careers } = await supabase
      .from('employee_careers')
      .select('*')
      .eq('employee_id', id)
      .order('start_date', { ascending: false });

    // 자격증 정보 조회
    const { data: licenses } = await supabase
      .from('employee_licenses')
      .select('*')
      .eq('employee_id', id)
      .order('issue_date', { ascending: false });

    // 파일 정보 조회
    const { data: files } = await supabase
      .from('employee_files')
      .select('*')
      .eq('employee_id', id)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      data: {
        ...employee,
        careers: careers || [],
        licenses: licenses || [],
        files: files || [],
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
 * 직원 수정 (PUT)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
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
      updated_by,
      careers,
      licenses,
      files,
    } = body;

    // 직원 기본 정보 업데이트
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (position !== undefined) updateData.position = position;
    if (hire_date !== undefined) updateData.hire_date = hire_date;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (workplace_type !== undefined) updateData.workplace_type = workplace_type;
    if (workplace_name !== undefined) updateData.workplace_name = workplace_name;
    if (workplace_full_name !== undefined) updateData.workplace_full_name = workplace_full_name;
    if (employee_classification !== undefined) updateData.employee_classification = employee_classification;
    if (contract_classification !== undefined) updateData.contract_classification = contract_classification;
    if (bank_name !== undefined) updateData.bank_name = bank_name;
    if (account_number !== undefined) updateData.account_number = account_number;
    if (account_holder !== undefined) updateData.account_holder = account_holder;
    if (employment_status !== undefined) updateData.employment_status = employment_status;
    if (employment_memo !== undefined) updateData.employment_memo = employment_memo;
    if (health_checkup_expiry_date !== undefined) updateData.health_checkup_expiry_date = health_checkup_expiry_date;
    if (login_id !== undefined) updateData.login_id = login_id;
    if (login_permission !== undefined) updateData.login_permission = login_permission;
    if (approval_status !== undefined) updateData.approval_status = approval_status;
    if (approval_request_date !== undefined) updateData.approval_request_date = approval_request_date;
    if (approval_join_date !== undefined) updateData.approval_join_date = approval_join_date;
    if (updated_by !== undefined) updateData.updated_by = updated_by;

    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (employeeError) {
      return NextResponse.json(
        { error: employeeError.message },
        { status: 500 }
      );
    }

    // 경력 정보 업데이트 (전체 삭제 후 재생성)
    if (careers !== undefined && Array.isArray(careers)) {
      // 기존 경력 삭제
      await supabase
        .from('employee_careers')
        .delete()
        .eq('employee_id', id);

      // 새 경력 추가
      if (careers.length > 0) {
        const careersData = careers.map((career: any) => ({
          employee_id: parseInt(id),
          company_name: career.company_name,
          start_date: career.start_date,
          end_date: career.end_date,
          position: career.position,
          job_description: career.job_description,
          created_by: updated_by,
          updated_by: updated_by,
        }));

        await supabase
          .from('employee_careers')
          .insert(careersData);
      }
    }

    // 자격증 정보 업데이트 (전체 삭제 후 재생성)
    if (licenses !== undefined && Array.isArray(licenses)) {
      // 기존 자격증 삭제
      await supabase
        .from('employee_licenses')
        .delete()
        .eq('employee_id', id);

      // 새 자격증 추가
      if (licenses.length > 0) {
        const licensesData = licenses.map((license: any) => ({
          employee_id: parseInt(id),
          license_name: license.license_name,
          start_date: license.start_date,
          end_date: license.end_date,
          issue_date: license.issue_date,
          created_by: updated_by,
          updated_by: updated_by,
        }));

        await supabase
          .from('employee_licenses')
          .insert(licensesData);
      }
    }

    // 파일 정보는 별도 API로 관리 (여기서는 업데이트하지 않음)

    return NextResponse.json({ data: employee });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 직원 삭제 (논리 삭제) (DELETE)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const deletedBy = searchParams.get('deleted_by');

    const { data, error } = await supabase
      .from('employees')
      .update({
        is_deleted: true,
        updated_by: deletedBy ? parseInt(deletedBy) : null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
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





