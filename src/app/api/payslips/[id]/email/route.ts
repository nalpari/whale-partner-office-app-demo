import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * 급여명세서 이메일 전송 상태 업데이트 (POST)
 *
 * Body:
 * - email_status: 'NOT_SENT' | 'PENDING' | 'SENT' | 'FAILED'
 */
export async function POST(
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
    const { email_status } = body;

    // 이메일 상태 유효성 검증
    const validStatuses = ['NOT_SENT', 'PENDING', 'SENT', 'FAILED'];
    if (!email_status || !validStatuses.includes(email_status)) {
      return NextResponse.json(
        { error: '유효하지 않은 이메일 상태입니다. (NOT_SENT, PENDING, SENT, FAILED)' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      email_status,
      updated_at: new Date().toISOString(),
    };

    // SENT 상태일 경우 전송 시간 기록
    if (email_status === 'SENT') {
      updateData.email_sent_at = new Date().toISOString();
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

    return NextResponse.json({
      data,
      message: `이메일 상태가 '${email_status}'(으)로 업데이트되었습니다.`
    });
  } catch (error) {
    console.error('이메일 상태 업데이트 오류:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
