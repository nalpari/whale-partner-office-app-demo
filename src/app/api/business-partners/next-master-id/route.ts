import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * 다음 Master ID 생성 (GET)
 * PTN + 6자리 제로필 일련번호 형식 (예: PTN000001)
 */
export async function GET() {
  try {
    // 현재 최대 Master ID 조회
    const { data, error } = await supabase
      .from('business_partners')
      .select('master_id')
      .like('master_id', 'PTN%')
      .order('master_id', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    let nextNumber = 1;

    if (data && data.length > 0) {
      const lastMasterId = data[0].master_id;
      // PTN000006 → 6 추출
      const lastNumber = parseInt(lastMasterId.replace('PTN', ''), 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    // PTN + 6자리 제로필 형식으로 생성
    const nextMasterId = `PTN${nextNumber.toString().padStart(6, '0')}`;

    return NextResponse.json({
      data: {
        master_id: nextMasterId,
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
