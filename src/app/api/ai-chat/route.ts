import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 사용 가능한 함수(도구) 정의
const tools: Anthropic.Tool[] = [
  {
    name: 'get_business_partner_count',
    description: 'Business Partner(거래처/파트너)의 총 개수를 조회합니다. 운영 상태별로 필터링할 수 있습니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        operation_status: {
          type: 'string',
          enum: ['ALL', 'CONSULTING', 'OPERATING', 'TERMINATED'],
          description: '운영 상태 필터. ALL은 전체, CONSULTING은 상담중, OPERATING은 운영중, TERMINATED는 종료',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_business_partner_list',
    description: 'Business Partner(거래처/파트너) 목록을 조회합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        operation_status: {
          type: 'string',
          enum: ['ALL', 'CONSULTING', 'OPERATING', 'TERMINATED'],
          description: '운영 상태 필터',
        },
        limit: {
          type: 'number',
          description: '조회할 최대 개수 (기본값: 10)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_employee_count',
    description: '직원의 총 개수를 조회합니다. 계약 분류, 소속 분류, 근무 상태로 필터링할 수 있습니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        contract_classification: {
          type: 'string',
          enum: ['정직원', '파트타이머'],
          description: '계약 분류 필터. 정직원 또는 파트타이머(아르바이트). 정직원/계약직/파트타임/알바 질문시 이 필드 사용.',
        },
        employee_classification: {
          type: 'string',
          enum: ['본사 직원', '가맹점 직원', '점포 직원'],
          description: '소속 분류 필터. 본사/가맹점/점포 소속 질문시 이 필드 사용.',
        },
        employment_status: {
          type: 'string',
          enum: ['근무', '퇴사'],
          description: '근무 상태 필터 (근무 또는 퇴사)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_store_count',
    description: '매장(점포)의 총 개수를 조회합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {
        status: {
          type: 'string',
          enum: ['ALL', 'active', 'inactive', 'closed'],
          description: '매장 상태 필터',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_menu_count',
    description: '메뉴의 총 개수를 조회합니다.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_order_summary',
    description: '주문 요약 정보를 조회합니다 (총 주문 수, 총 매출 등).',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
];

// 도구 실행 함수
async function executeTool(toolName: string, toolInput: Record<string, unknown>): Promise<string> {
  switch (toolName) {
    case 'get_business_partner_count': {
      let query = supabase
        .from('business_partners')
        .select('*', { count: 'exact', head: true })
        .eq('is_deleted', false);

      if (toolInput.operation_status && toolInput.operation_status !== 'ALL') {
        query = query.eq('operation_status', toolInput.operation_status);
      }

      const { count, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        count,
        message: `Business Partner는 총 ${count}개입니다.`,
        operation_status: toolInput.operation_status || 'ALL'
      });
    }

    case 'get_business_partner_list': {
      const limit = (toolInput.limit as number) || 10;
      let query = supabase
        .from('business_partners')
        .select('master_id, company_name, brand_name, operation_status, bp_code')
        .eq('is_deleted', false)
        .limit(limit);

      if (toolInput.operation_status && toolInput.operation_status !== 'ALL') {
        query = query.eq('operation_status', toolInput.operation_status);
      }

      const { data, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        data,
        count: data?.length || 0,
        message: `Business Partner 목록입니다.`
      });
    }

    case 'get_employee_count': {
      let query = supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('is_deleted', false);

      if (toolInput.contract_classification) {
        query = query.eq('contract_classification', toolInput.contract_classification);
      }

      if (toolInput.employee_classification) {
        query = query.eq('employee_classification', toolInput.employee_classification);
      }

      if (toolInput.employment_status) {
        query = query.eq('employment_status', toolInput.employment_status);
      }

      const { count, error } = await query;
      if (error) return JSON.stringify({ error: error.message });

      const contract = toolInput.contract_classification ? `${toolInput.contract_classification} ` : '';
      const employee = toolInput.employee_classification ? `(${toolInput.employee_classification}) ` : '';
      const status = toolInput.employment_status ? `${toolInput.employment_status} 중인 ` : '';
      return JSON.stringify({
        count,
        contract_classification: toolInput.contract_classification || 'ALL',
        employee_classification: toolInput.employee_classification || 'ALL',
        employment_status: toolInput.employment_status || 'ALL',
        message: `${status}${contract}${employee}직원은 총 ${count}명입니다.`
      });
    }

    case 'get_store_count': {
      let query = supabase
        .from('stores')
        .select('*', { count: 'exact', head: true });

      if (toolInput.status && toolInput.status !== 'ALL') {
        query = query.eq('status', toolInput.status);
      }

      const { count, error } = await query;
      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        count,
        message: `매장은 총 ${count}개입니다.`
      });
    }

    case 'get_menu_count': {
      const { count, error } = await supabase
        .from('menu')
        .select('*', { count: 'exact', head: true });

      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({
        count,
        message: `메뉴는 총 ${count}개입니다.`
      });
    }

    case 'get_order_summary': {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('id, final_amount, status');

      if (error) return JSON.stringify({ error: error.message });

      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.final_amount || 0), 0) || 0;

      return JSON.stringify({
        totalOrders,
        totalRevenue,
        message: `총 ${totalOrders}건의 주문이 있으며, 총 매출은 ${totalRevenue.toLocaleString()}원입니다.`
      });
    }

    default:
      return JSON.stringify({ error: '알 수 없는 도구입니다.' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: '메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    // 시스템 프롬프트
    const systemPrompt = `당신은 Whale ERP 시스템의 AI 어시스턴트입니다.
사용자가 비즈니스 관련 질문을 하면 적절한 도구를 사용하여 데이터베이스에서 정보를 조회하고 답변합니다.

## 도메인 용어집
사용자가 아래 용어나 약어를 사용하면 해당 의미로 이해하세요:
- BP, 비피 = Business Partner (거래처/파트너)
- 정직원 = contract_classification이 "정직원"인 직원
- 파트타이머, 알바, 아르바이트 = contract_classification이 "파트타이머"인 직원
- 본사, 본사직원 = employee_classification이 "본사 직원"
- 가맹점, 가맹점직원 = employee_classification이 "가맹점 직원"
- 점포, 점포직원 = employee_classification이 "점포 직원"

## 당신이 할 수 있는 일
- Business Partner(BP/거래처/파트너) 정보 조회 및 개수 확인
- 직원 정보 조회 및 개수 확인 (계약분류, 소속분류, 근무상태별)
- 매장(점포) 정보 조회 및 개수 확인
- 메뉴 정보 조회
- 주문/매출 정보 요약

## 응답 규칙
- 답변은 항상 친절하고 간결하게 한국어로 해주세요.
- 숫자나 데이터를 말할 때는 명확하게 표현해주세요.`;

    // 대화 메시지 구성
    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    // Claude API 호출
    let response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      tools,
      messages,
    });

    // 도구 사용이 필요한 경우 처리
    while (response.stop_reason === 'tool_use') {
      const toolUseBlock = response.content.find(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
      );

      if (!toolUseBlock) break;

      // 도구 실행
      const toolResult = await executeTool(
        toolUseBlock.name,
        toolUseBlock.input as Record<string, unknown>
      );

      // 도구 결과와 함께 다시 API 호출
      messages.push({ role: 'assistant', content: response.content });
      messages.push({
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: toolUseBlock.id,
            content: toolResult,
          },
        ],
      });

      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        tools,
        messages,
      });
    }

    // 최종 텍스트 응답 추출
    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    );

    const assistantMessage = textBlock?.text || '죄송합니다. 응답을 생성할 수 없습니다.';

    return NextResponse.json({
      message: assistantMessage,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage },
      ],
    });
  } catch (error) {
    console.error('AI Chat API error:', error);
    return NextResponse.json(
      { error: 'AI 응답 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
