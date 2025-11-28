import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * BP 타입 목록 조회 (GET)
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('bp_types')
      .select('id, code, name')
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      // BP 타입 테이블이 없는 경우 기본값 반환
      return NextResponse.json({
        data: [
          { id: '1', code: 'HEADQUARTERS', name: '본사' },
          { id: '2', code: 'FRANCHISE', name: '가맹점' },
          { id: '3', code: 'SHOP', name: '점포' },
          { id: '4', code: 'SUPPLIER', name: '공급사' },
        ],
      });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('API error:', error);
    // 오류 발생 시 기본값 반환
    return NextResponse.json({
      data: [
        { id: '1', code: 'HEADQUARTERS', name: '본사' },
        { id: '2', code: 'FRANCHISE', name: '가맹점' },
        { id: '3', code: 'SHOP', name: '점포' },
        { id: '4', code: 'SUPPLIER', name: '공급사' },
      ],
    });
  }
}
