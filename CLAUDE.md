# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Whale Partner Office App Demo** - Next.js 16.0.3 기반의 **모바일 우선** ERP 관리 시스템입니다. Next.js App Router, React 19.2.0, TypeScript, Tailwind CSS v4를 사용하며, React Compiler가 활성화되어 있습니다. Supabase를 백엔드 데이터베이스로 사용하고, Anthropic Claude API를 통한 AI 채팅 기능을 제공합니다.

## Development Commands

```bash
# 개발 서버 실행 (http://localhost:3000)
pnpm dev        # 권장
npm run dev     # 대안

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# ESLint 실행
pnpm lint
```

## Environment Variables

`.env.local` 파일에 다음 환경 변수가 필요합니다:

```bash
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic Claude API (AI 채팅 기능 사용 시)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Architecture & Key Principles

### Language & Communication
- **모든 코드 작업 시 한국어로 답변 및 추론 과정 제공**
- UI 텍스트는 한국어 사용
- 변수명/함수명은 영어 사용 (TypeScript 컨벤션 준수)

### Mobile-First Design
- 모바일 우선 설계 원칙 준수
- 반응형 디자인 적용 (필요시 md: 브레이크포인트 사용)
- 터치 인터페이스 고려

### App Router Structure

```
src/
├── app/
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 홈페이지
│   ├── globals.css          # 글로벌 CSS + 커스텀 클래스
│   ├── api/                 # API 라우트 (RESTful)
│   │   ├── ai-chat/         # Claude AI 채팅 API
│   │   ├── employees/       # 직원 CRUD
│   │   ├── business-partners/ # 거래처 CRUD
│   │   ├── contracts/       # 계약 관리
│   │   ├── attendances/     # 출퇴근 기록
│   │   ├── payslips/        # 급여명세서
│   │   └── [기타 API 엔드포인트]
│   ├── store-info/          # 점포 정보 관리
│   ├── store-management/    # 점포 관리
│   ├── contract-management/ # 계약 관리
│   └── templates/           # 템플릿 관리
├── components/              # 재사용 컴포넌트
└── lib/
    └── supabase.ts          # Supabase 클라이언트 설정
```

### TypeScript Configuration
- **Path alias**: `@/*` → `./src/*`로 매핑 (임포트 시 절대 경로 사용)
- **JSX runtime**: `react-jsx` (자동 JSX 변환)
- **Target**: ES2017
- **Strict mode**: 활성화됨

### React Compiler
`next.config.ts`에서 **React Compiler** (babel-plugin-react-compiler v1.0.0) 활성화됨.

**중요 사항:**
- `useMemo`, `useCallback`, `React.memo` 등 **수동 메모이제이션 불필요** (컴파일러가 자동 처리)
- 컴포넌트는 **순수 함수**여야 함
- Props와 state는 **불변(immutable)**으로 취급
- 예상치 못한 동작 발생 시 컴파일러 관련 문제일 수 있음

### Styling System

**Tailwind CSS v4 + Custom CSS Classes**

프로젝트는 두 가지 스타일링 방식을 혼용합니다:

1. **Tailwind 유틸리티 클래스**: 간단한 스타일링
2. **커스텀 CSS 클래스**: `src/app/globals.css`에 정의된 재사용 가능한 클래스

**주요 커스텀 클래스 패턴** (`globals.css` 참조):
- `.header` - 공통 헤더 스타일
- `.page-container`, `.page-body`, `.page-content` - 페이지 레이아웃 구조
- `.page-title`, `.page-header` - 페이지 제목 및 헤더
- `.btn-primary`, `.btn-secondary` - 버튼 스타일
- `.logo-container`, `.brand-text` - 브랜딩 요소

**스타일링 규칙:**
- 공통 레이아웃/UI 패턴: 커스텀 클래스 사용
- 간단한 스타일링: Tailwind 유틸리티 클래스 사용
- 새로운 컴포넌트 작성 시 기존 패턴 참고

## Component Patterns

### 페이지 구조 패턴
모든 페이지는 일관된 구조를 따릅니다:

```tsx
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";

export default function ExamplePage() {
  return (
    <main>
      <Header />
      <div className="page-container">
        {/* StoreSelect 또는 Select 컴포넌트 (필요시) */}
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

### 컴포넌트 타입 정의
- Props 인터페이스는 컴포넌트 파일 내에서 정의
- 타입 이름: `{ComponentName}Props` 형식 사용

### Server vs Client Components
- **기본적으로 모든 컴포넌트는 Server Component**
- 인터랙티브한 기능 필요 시에만 `'use client'` 지시어 추가
- 상태 관리, 이벤트 핸들러, 브라우저 API 사용 시 Client Component로 변환

## Backend Architecture

### Supabase Integration

`src/lib/supabase.ts`에서 Supabase 클라이언트를 내보냅니다. API 라우트에서 사용:

```typescript
import { supabase } from '@/lib/supabase';

// 예시: 데이터 조회
const { data, error, count } = await supabase
  .from('employees')
  .select('*', { count: 'exact' })
  .eq('is_deleted', false)
  .order('created_at', { ascending: false });
```

### 주요 테이블 (Supabase)

- `employees` - 직원 정보 (employee_id, name, position, contract_classification 등)
- `business_partners` - 거래처/BP (company_name, brand_name, operation_status 등)
- `employment_contracts` - 근로계약서
- `contract_work_schedules` - 근무 스케줄
- `contract_salaries` - 급여 정보
- `attendance_records` - 출퇴근 기록
- `stores` - 매장 정보

### API Route Pattern

모든 API는 Next.js Route Handlers 사용 (App Router):

```typescript
// src/app/api/[resource]/route.ts - 목록 조회/생성
export async function GET(request: NextRequest) { ... }
export async function POST(request: NextRequest) { ... }

// src/app/api/[resource]/[id]/route.ts - 단일 조회/수정/삭제
export async function GET(request: NextRequest, { params }) { ... }
export async function PUT(request: NextRequest, { params }) { ... }
export async function DELETE(request: NextRequest, { params }) { ... }
```

### AI Chat API (`/api/ai-chat`)

Anthropic Claude API (claude-sonnet-4-20250514)를 사용한 Tool Use 패턴:
- 데이터베이스 조회 도구 (get_employee_list, get_business_partner_count 등)
- 대화 히스토리 유지
- 자연어로 ERP 데이터 질의 가능

## Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.3 | React 프레임워크 (App Router) |
| React | 19.2.0 | UI 라이브러리 |
| TypeScript | ^5 | 타입 안정성 |
| Tailwind CSS | ^4 | 유틸리티 퍼스트 스타일링 |
| React Compiler | 1.0.0 | 자동 React 최적화 |
| Supabase | ^2.84.0 | 백엔드 데이터베이스 |
| Anthropic SDK | ^0.71.0 | AI 채팅 기능 |

## Important Notes

1. **한국어 우선**: 모든 설명, 추론 과정, 코드 주석은 한국어로 작성
2. **모바일 우선**: 모바일 화면만 고려 (PC 해상도 무시)
3. **React Compiler**: 수동 메모이제이션 불필요 (useMemo, useCallback, React.memo 사용 금지)
4. **Soft Delete**: 모든 테이블에서 `is_deleted` 필드로 소프트 삭제 적용
5. **pnpm 사용**: 패키지 관리자로 pnpm 권장
