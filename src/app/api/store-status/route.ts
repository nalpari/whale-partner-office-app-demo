import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { currentUser } from '@/lib/userContext';

export async function GET() {
  try {
    const storeId = currentUser.storeId;
    const storeName = currentUser.storeName;

    // 오늘 날짜 (한국 시간 기준)
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const todayStr = koreaTime.toISOString().split('T')[0];

    // 1. 오늘 매출액 조회 (결제 수단별 포함)
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('final_amount, payment_type')
      .eq('store_id', storeId)
      .gte('created_at', `${todayStr}T00:00:00`)
      .lte('created_at', `${todayStr}T23:59:59`);

    if (ordersError) {
      console.error('Orders query error:', ordersError);
    }

    const todaySales = orders?.reduce((sum, order) => sum + (order.final_amount || 0), 0) || 0;

    // 결제 수단별 매출 집계
    const salesByPaymentType = orders?.reduce((acc, order) => {
      const type = order.payment_type || 'OTHER';
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += order.final_amount || 0;
      return acc;
    }, {} as Record<string, number>) || {};

    // 2. 현재 근무중인 직원 조회
    const workingEmployees: string[] = [];

    // 오늘 출퇴근 기록 조회
    const { data: records, error: recordError } = await supabase
      .from('attendance_records')
      .select('id, employee_id, store_id')
      .eq('work_date', todayStr)
      .eq('store_id', storeId)
      .or('is_deleted.eq.false,is_deleted.is.null');

    console.log(`[store-status] 조회 조건 - storeId: ${storeId}, todayStr: ${todayStr}`);
    console.log(`[store-status] attendance_records 조회 결과:`, records, recordError);

    if (!recordError && records && records.length > 0) {
      for (const record of records) {
        // 세션 정보 조회 (출근 기록이 있고 퇴근 시간이 NULL인 경우)
        const { data: sessions, error: sessionError } = await supabase
          .from('attendance_sessions')
          .select('clock_in_time, clock_out_time')
          .eq('attendance_record_id', record.id)
          .not('clock_in_time', 'is', null)
          .is('clock_out_time', null);

        console.log(`[store-status] record.id: ${record.id}, sessions:`, sessions, sessionError);

        if (sessions && sessions.length > 0) {
          // 직원 정보 조회
          const { data: employee } = await supabase
            .from('employees')
            .select('name')
            .eq('id', record.employee_id)
            .single();

          if (employee) {
            workingEmployees.push(employee.name);
          }
        }
      }
    }

    // 3. 입금액/출금액 (임시 하드코딩)
    const depositAmount = 10000000; // 1000만원
    const withdrawAmount = 10000000; // 1000만원

    return NextResponse.json({
      store_name: storeName,
      today_sales: todaySales,
      sales_by_payment_type: salesByPaymentType,
      deposit_amount: depositAmount,
      withdraw_amount: withdrawAmount,
      working_employees: workingEmployees,
      date: todayStr,
    });
  } catch (error) {
    console.error('Store status API error:', error);
    return NextResponse.json(
      { error: '매장 현황 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
