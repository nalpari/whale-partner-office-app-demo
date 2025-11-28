import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 직원 파일 목록 조회 (GET)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fileType = request.nextUrl.searchParams.get('file_type');

    let query = supabase
      .from('employee_files')
      .select('*')
      .eq('employee_id', id);

    if (fileType) {
      query = query.eq('file_type', fileType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * 직원 파일 추가 (POST)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      file_type,
      file_name,
      file_path,
      file_size,
      mime_type,
      created_by,
    } = body;

    // 필수 필드 검증
    if (!file_type || !file_name || !file_path) {
      return NextResponse.json(
        { error: 'file_type, file_name, and file_path are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('employee_files')
      .insert({
        employee_id: parseInt(id),
        file_type,
        file_name,
        file_path,
        file_size,
        mime_type,
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





