# Whale Partner Office App Demo

**모바일 우선 Whale ERP 관리 시스템** - Next.js 16과 React 19를 기반으로 한 파트너사 사무실 관리 애플리케이션입니다.

> **Note**: 모바일 퍼스트 프로젝트입니다. PC 해상도 화면은 고려하지 않습니다.

## 주요 기능

### 핵심 관리 기능
- **직원 관리** - 직원 정보 CRUD, 검색/필터링
- **Business Partner 관리** - 거래처/파트너사 정보 관리
- **근로계약서 관리** - 계약 생성, 조회, 관리
- **출퇴근 관리** - 출퇴근 기록 및 근무 현황
- **급여명세서 관리** - 급여 정보 등록 및 조회
- **점포 정보 관리** - 점포 기본 정보 및 운영 시간
- **템플릿 관리** - 계약서 템플릿 등 각종 템플릿

### AI 기능
- **AI 채팅 어시스턴트** - Claude API 기반 자연어 데이터 질의
  - 직원, BP, 매장 정보 조회
  - 근무 스케줄, 급여 정보 질의
  - 현재 근무 중인 직원 확인
  - **매장별 매출 조회** (오늘/어제/이번주/이번달 등)
  - **결제 수단별 매출 조회** (카드/현금/계좌이체)

#### AI 채팅 응답 규칙 (중요)
**모든 AI 채팅 응답은 반드시 단답형으로 작성됩니다.**

- 불필요한 설명, 서론, 예의 표현 없이 핵심 정보만 간결하게 전달
- 질문에 대한 직접적인 답변만 제공
- 예: "을지로3가점 직원은 총 5명입니다." (O)
- 예: "안녕하세요. 을지로3가점의 직원 정보를 조회해드리겠습니다. 총 5명의 직원이 있습니다." (X)

**목록 응답 형식:**
- 특별한 주문이 없다면 표 형식을 사용하지 않고 간단하게 나열
- 직원이 누군지 묻는 요청: 이름만 나열 (예: "홍길동, 김철수, 이영희")
- 목록 조회 요청: 해당 내용만 간단히 나열 (예: "강남점, 을지로3가점, 신촌점")
- 사용자가 명시적으로 "표로 보여줘", "상세하게 보여줘" 같은 요청을 할 때만 표 형식 사용
- 처리할 수 없는 요청은 "해당 요청은 처리할 수 없습니다."로 간단히 응답

이 규칙은 `src/app/api/ai-chat/route.ts`의 시스템 프롬프트에 반영되어 있습니다.

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| **프레임워크** | Next.js (App Router) | 16.0.7 |
| **UI** | React | 19.2.1 |
| **언어** | TypeScript | ^5 |
| **스타일링** | Tailwind CSS | v4 |
| **최적화** | React Compiler | 1.0.0 |
| **백엔드** | Supabase | ^2.84.0 |
| **AI** | Anthropic Claude SDK | ^0.71.0 |

## 프로젝트 구조

```
src/
├── app/
│   ├── api/                      # RESTful API 라우트
│   │   ├── ai-chat/              # AI 채팅 API (Tool Use)
│   │   ├── employees/            # 직원 CRUD
│   │   ├── business-partners/    # BP CRUD
│   │   ├── contracts/            # 계약 관리
│   │   ├── attendances/          # 출퇴근 관리
│   │   ├── payslips/             # 급여명세서
│   │   └── store-status/         # 매장 현황 (매출, 근무 직원)
│   ├── employee-management/      # 직원 관리 페이지
│   ├── business-partner/         # BP 관리 페이지
│   ├── employment-contract/      # 근로계약서 페이지
│   ├── attendance/               # 출퇴근 관리 페이지
│   ├── payslip/                  # 급여명세서 페이지
│   ├── store-info/               # 점포 정보 페이지
│   ├── store-management/         # 점포 관리 페이지
│   └── templates/                # 템플릿 관리 페이지
├── components/                   # 재사용 컴포넌트
└── lib/
    ├── supabase.ts               # Supabase 클라이언트
    └── userContext.ts            # 사용자 컨텍스트 (하드코딩)
```

### 주요 컴포넌트

**레이아웃**: Header, SideMenu, Breadcrumb, FloatingButton

**폼**: Input, Select, Checkbox, CheckboxGroup, Radio, RadioGroup, Toggle, DatePicker, DateRangePicker, TimePicker, Textarea, FileUpload, FormField, FormSection

**카드**: EmployeeCard, BusinessPartnerCard, ContractCard, AttendanceCard, PayslipCard, CollapsibleCard

**검색/필터**: SearchFilter, EmployeeSearchFilter, BusinessPartnerSearchFilter, ContractSearchFilter, AttendanceSearchFilter, PayslipSearchFilter

**AI**: AiChatScreen, AiChatHeader, ChatMessage, AiIcon, AiIconWrapper

**기타**: Pagination, Badge, Button, LoadingScreen, SkeletonCard

## 개발 시작하기

### 필수 요구사항
- Node.js 20 이상
- pnpm 9 이상

### 환경 변수 설정

`.env.local` 파일 생성:

```bash
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic Claude API (AI 채팅 기능)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (http://localhost:3000)
pnpm dev

# 프로덕션 빌드
pnpm build
pnpm start

# 코드 검사
pnpm lint
```

## API 엔드포인트

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/employees` | GET, POST | 직원 목록/생성 |
| `/api/employees/[id]` | GET, PUT, DELETE | 직원 상세/수정/삭제 |
| `/api/business-partners` | GET, POST | BP 목록/생성 |
| `/api/business-partners/[id]` | GET, PUT, DELETE | BP 상세/수정/삭제 |
| `/api/contracts` | GET, POST | 계약 목록/생성 |
| `/api/attendances` | GET, POST | 출퇴근 목록/생성 |
| `/api/payslips` | GET, POST | 급여명세서 목록/생성 |
| `/api/store-status` | GET | 매장 현황 (오늘 매출, 결제 수단별 매출, 근무 직원) |
| `/api/ai-chat` | POST | AI 채팅 (Tool Use) |

## 데이터베이스 (Supabase)

### 주요 테이블

| 테이블 | 설명 |
|--------|------|
| `employees` | 직원 정보 (employee_id, name, position, contract_classification) |
| `business_partners` | 거래처/BP (company_name, brand_name, operation_status) |
| `employment_contracts` | 근로계약서 |
| `contract_work_schedules` | 근무 스케줄 |
| `contract_salaries` | 급여 정보 |
| `attendance_records` | 출퇴근 기록 |
| `attendance_sessions` | 출퇴근 세션 (출근/퇴근 시간) |
| `stores` | 매장 정보 |
| `orders` | 주문 정보 |
| `menu` | 메뉴 정보 |

### 결제 수단 (orders.payment_type)

| 값 | 설명 |
|---|---|
| `CARD` | 카드결제 (기본값) |
| `CASH` | 현금결제 |
| `TRANSFER` | 계좌이체 |
| `OTHER` | 기타 |

### 공통 규칙
- 모든 테이블에 `is_deleted` 필드 사용 (Soft Delete)
- 조회 시 항상 `.eq('is_deleted', false)` 조건 적용

## 주요 설정

### React Compiler
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  reactCompiler: true,
};
```

**주의사항:**
- `useMemo`, `useCallback`, `React.memo` 사용 불필요 (자동 처리)
- 컴포넌트는 순수 함수여야 함
- props와 state는 불변(immutable)으로 취급

### TypeScript 경로 별칭
- `@/*` → `./src/*` 매핑

## 개발 가이드라인

### 컴포넌트 작성
- **Server Components 우선** - 필요시에만 `'use client'` 사용
- **Props 타입**: `{ComponentName}Props` 형식
- **경로 별칭**: `@/components/...` 형태로 임포트

### 스타일링
- **공통 패턴**: `globals.css` 커스텀 클래스 사용
- **간단한 스타일링**: Tailwind 유틸리티 클래스

### 페이지 구조 패턴
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
            <h1 className="page-title">페이지 제목</h1>
            <Breadcrumb items={[...]} />
          </div>
          <div className="page-content">
            {/* 콘텐츠 */}
          </div>
        </div>
      </div>
    </main>
  );
}
```

## 라이선스

Private 프로젝트
