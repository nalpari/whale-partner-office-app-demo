import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Business Partner 상세 조회 (GET)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Business Partner 상세 조회 (관련 테이블 조인)
    const { data, error } = await supabase
      .from('business_partners')
      .select(`
        *,
        bp_types (
          id,
          code,
          name
        ),
        business_categories (
          id,
          code,
          name
        ),
        bp_services (
          id,
          service_type_id,
          start_date,
          status,
          service_types (
            id,
            code,
            name
          )
        )
      `)
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    // Partner Function 별도 조회 (source_bp_id 기준)
    const { data: partnerFunctions } = await supabase
      .from('bp_partner_functions')
      .select(`
        id,
        partner_function_type,
        target_bp_id
      `)
      .eq('source_bp_id', id);

    // target_bp 정보 조회
    let partnerFunctionsWithTarget: Array<{
      id: string;
      partner_function_type: string;
      target_bp_id: string;
      target_bp?: {
        id: string;
        master_id: string;
        company_name: string;
        brand_name: string | null;
        operation_status: string;
      };
    }> = [];

    if (partnerFunctions && partnerFunctions.length > 0) {
      const targetBpIds = partnerFunctions.map(pf => pf.target_bp_id);
      const { data: targetBps } = await supabase
        .from('business_partners')
        .select('id, master_id, company_name, brand_name, operation_status')
        .in('id', targetBpIds);

      partnerFunctionsWithTarget = partnerFunctions.map(pf => ({
        ...pf,
        target_bp: targetBps?.find(bp => bp.id === pf.target_bp_id),
      }));
    }

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Business Partner를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Partner Functions 추가
    const responseData = {
      ...data,
      bp_partner_functions: partnerFunctionsWithTarget,
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

/**
 * Business Partner 수정 (PATCH)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      bp_code,
      operation_status,
      bp_type_id,
      company_name,
      brand_name,
      business_registration_number,
      business_category_id,
      postal_code,
      address_road,
      address_detail,
      address_full,
      representative_name,
      representative_phone,
      representative_email,
      lnb_logo_url,
      updated_by,
    } = body;

    const { data, error } = await supabase
      .from('business_partners')
      .update({
        bp_code,
        operation_status,
        bp_type_id,
        company_name,
        brand_name,
        business_registration_number,
        business_category_id,
        postal_code,
        address_road,
        address_detail,
        address_full,
        representative_name,
        representative_phone,
        representative_email,
        lnb_logo_url,
        updated_by,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_deleted', false)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Business Partner를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Business Partner 삭제 (DELETE) - 소프트 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('business_partners')
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
