# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Whale Partner Office App Demo** - Next.js App Router 기반의 **모바일 우선** ERP 관리 시스템. React Compiler가 활성화되어 있으며, Supabase를 백엔드로, Anthropic Claude API를 통한 AI 채팅 기능을 제공합니다.

**Supabase 프로젝트명**: `coffee-assistant-with-ai` (MCP 도구 사용 시 참조)

## Development Commands

```bash
pnpm dev        # 개발 서버 (http://localhost:3000)
pnpm build      # 프로덕션 빌드
pnpm start      # 프로덕션 서버
pnpm lint       # ESLint 실행
```

## Environment Variables

`.env.local` 필수:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key  # AI 채팅용
```

## Core Principles

1. **한국어 우선**: 모든 답변, 추론 과정, 코드 주석은 한국어로 작성
2. **모바일 우선**: PC 해상도 무시, 모바일 화면만 고려
3. **React Compiler 활성화**: `useMemo`, `useCallback`, `React.memo` 사용 금지 (자동 처리)
4. **Soft Delete**: 모든 테이블에서 `is_deleted` 필드 사용
5. **pnpm 사용**: 패키지 관리자로 pnpm 권장

## Architecture

### Path Alias
`@/*` → `./src/*` (tsconfig.json)

### React Compiler
`next.config.ts`에서 활성화됨. 컴포넌트는 **순수 함수**여야 하고, props/state는 **불변**으로 취급.

### Styling
- **공통 패턴**: `src/app/globals.css` 커스텀 클래스 (`.page-container`, `.page-body`, `.btn-primary` 등)
- **간단한 스타일링**: Tailwind 유틸리티 클래스

### Page Structure Pattern
```tsx
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";

export default function ExamplePage() {
  return (
    <main>
      <Header />
      <div className="page-container">
        <div className="page-body">
          <div className="page-header">
            <div className="page-title-section">
              <h1 className="page-title">페이지 제목</h1>
              <Breadcrumb items={[...]} />
            </div>
          </div>
          <div className="page-content">
            {/* 페이지 콘텐츠 */}
          </div>
        </div>
      </div>
    </main>
  );
}
```

### Server vs Client Components
- 기본: Server Component
- `'use client'`는 상태 관리, 이벤트 핸들러, 브라우저 API 필요시에만

## Backend

### Supabase Integration
```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('employees')
  .select('*', { count: 'exact' })
  .eq('is_deleted', false)
  .order('created_at', { ascending: false });
```

### 주요 테이블
- `employees` - 직원 정보
- `business_partners` - 거래처/BP
- `employment_contracts` - 근로계약서
- `contract_work_schedules` - 근무 스케줄
- `contract_salaries` - 급여 정보
- `attendance_records` - 출퇴근 기록
- `attendance_sessions` - 출퇴근 세션
- `stores` - 매장 정보
- `orders` - 주문 정보 (payment_type: CARD/CASH/TRANSFER/OTHER)
- `payslips` - 급여명세서

### 사용자 컨텍스트
`src/lib/userContext.ts` - 하드코딩된 사용자:
- 기본 사용자: 임꺽정 (Platform Manager)
- 담당 매장: 을지로3가점 (ID: 6)

### API Route Pattern
```typescript
// src/app/api/[resource]/route.ts
export async function GET(request: NextRequest) { ... }
export async function POST(request: NextRequest) { ... }

// src/app/api/[resource]/[id]/route.ts
export async function GET(request: NextRequest, { params }) { ... }
export async function PUT(request: NextRequest, { params }) { ... }
export async function DELETE(request: NextRequest, { params }) { ... }
```

## AI Chat 응답 규칙 (중요!)

**`/api/ai-chat` API의 응답은 반드시 단답형으로 작성**

### 단답형 응답 원칙
- 불필요한 설명, 서론, 예의 표현 없이 핵심 정보만 전달
- 예: "을지로3가점 직원은 총 5명입니다." (O)
- 예: "안녕하세요. 을지로3가점의 직원 정보를 조회해드리겠습니다..." (X)

### 상세 응답 요청 시
사용자가 아래 키워드를 사용하면 표 형식으로 상세 응답:
- `"자세하게"`, `"자세히"`, `"상세하게"`, `"상세히"`, `"표로 보여줘"`

### 기본 응답 형식
- 목록: 간단한 나열 (예: "홍길동, 김철수, 이영희")
- 에러: "해당 요청은 처리할 수 없습니다."

이 규칙은 `src/app/api/ai-chat/route.ts`의 시스템 프롬프트에 반영되어 있습니다.
