import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Business Partner 목록 조회 (GET)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const operationStatus = searchParams.get('operation_status') || '';
    const serviceType = searchParams.get('service_type') || '';
    const startDate = searchParams.get('start_date') || '';
    const endDate = searchParams.get('end_date') || '';
    const offset = (page - 1) * limit;

    // Business Partner 목록 조회 (관련 테이블 조인)
    let query = supabase
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
      `, { count: 'exact' })
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 검색 조건 추가 (업체명, 대표자명, BP코드)
    if (search) {
      query = query.or(`company_name.ilike.%${search}%,representative_name.ilike.%${search}%,bp_code.ilike.%${search}%`);
    }

    // 운영 상태 필터
    if (operationStatus) {
      query = query.eq('operation_status', operationStatus);
    }

    // 등록일 필터
    if (startDate) {
      query = query.gte('created_at', `${startDate}T00:00:00`);
    }
    if (endDate) {
      query = query.lte('created_at', `${endDate}T23:59:59`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 서비스 타입 필터링 (조인 후 필터링)
    let filteredData = data || [];
    if (serviceType) {
      filteredData = filteredData.filter((bp) =>
        bp.bp_services?.some((service: { service_types?: { code?: string } }) =>
          service.service_types?.code === serviceType
        )
      );
    }

    return NextResponse.json({
      data: filteredData,
      pagination: {
        page,
        limit,
        total: serviceType ? filteredData.length : (count || 0),
        totalPages: Math.ceil((serviceType ? filteredData.length : (count || 0)) / limit),
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
 * Business Partner 생성 (POST)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      master_id,
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
      created_by,
    } = body;

    // 필수 필드 검증
    if (!company_name) {
      return NextResponse.json(
        { error: '업체명은 필수입니다.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('business_partners')
      .insert({
        master_id,
        bp_code,
        operation_status: operation_status || 'CONSULTING',
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
        created_by,
        updated_by: created_by,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
