# Whale Partner Office App Demo

- 모바일 퍼스트 프로젝트야.
- pc 해상도 화면은 신경쓰지 않아도 돼.

**모바일 우선 Whale ERP 관리 시스템** - Next.js 16과 React 19를 기반으로 한 파트너사 사무실 관리 애플리케이션입니다. 최신 Next.js App Router 아키텍처와 React Compiler를 활용하여 구축되었습니다.

## ✨ 주요 기능

### 📋 핵심 관리 기능
- **점포 정보 관리** - 점포 기본 정보 및 운영 시간 관리
- **점포 관리** - 점포 목록 및 상세 정보 관리
- **계약 관리** - 가맹점 계약 현황 및 관리
- **템플릿 관리** - 계약서 템플릿 등 각종 템플릿 관리

### 🎨 UI/UX 특징
- **모바일 우선 설계** - 모바일 환경에 최적화된 반응형 디자인
- **일관된 디자인 시스템** - Whale ERP 브랜딩 및 공통 컴포넌트 활용
- **직관적인 네비게이션** - Breadcrumb 및 Header 기반 페이지 탐색

## 🚀 기술 스택

### 핵심 프레임워크
- **Next.js 16.0.3** - App Router 아키텍처
- **React 19.2.0** - 최신 React 기능 활용 (Server Components, Server Actions)
- **TypeScript 5** - 타입 안정성

### 스타일링
- **Tailwind CSS v4** - 유틸리티 퍼스트 CSS 프레임워크
- **Custom CSS Classes** - 재사용 가능한 커스텀 클래스 (`globals.css`)

### 최적화
- **React Compiler (babel-plugin-react-compiler 1.0.0)** - 자동 React 최적화
  - `useMemo`, `useCallback`, `React.memo` 없이도 자동 메모이제이션
  - 컴포넌트 순수성 자동 검증 및 최적화

### 개발 도구
- **ESLint** - 코드 품질 관리
  - `eslint-config-next/core-web-vitals` - Core Web Vitals 규칙
  - `eslint-config-next/typescript` - TypeScript 전용 규칙

## 📁 프로젝트 구조

```
whale-partner-office-app-demo/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # 루트 레이아웃 (공통 HTML 구조)
│   │   ├── page.tsx                # 홈페이지 (메뉴 목록)
│   │   ├── globals.css             # 글로벌 CSS 및 커스텀 클래스
│   │   ├── store-info/             # 점포 정보 관리 페이지
│   │   ├── store-management/       # 점포 관리 페이지
│   │   ├── contract-management/    # 계약 관리 페이지
│   │   └── templates/              # 템플릿 관리 페이지
│   └── components/                 # 재사용 가능한 컴포넌트
│       ├── Header.tsx              # 공통 헤더 (Whale ERP 브랜딩)
│       ├── Breadcrumb.tsx          # 페이지 네비게이션
│       ├── Button.tsx              # 버튼 컴포넌트
│       ├── Select.tsx              # 선택 드롭다운
│       ├── StoreSelect.tsx         # 점포 선택 컴포넌트
│       ├── TemplateCard.tsx        # 템플릿 카드
│       ├── Pagination.tsx          # 페이지네이션
│       ├── SearchFilter.tsx        # 검색 필터
│       ├── FormField.tsx           # 폼 필드
│       ├── FileUpload.tsx          # 파일 업로드
│       ├── OperatingHours.tsx      # 운영 시간 관리
│       └── [기타 UI 컴포넌트들]
├── next.config.ts                  # Next.js 설정 (React Compiler 활성화)
├── tsconfig.json                   # TypeScript 설정 (@/* 경로 별칭)
└── package.json                    # 프로젝트 의존성 및 스크립트
```

### TypeScript 경로 별칭
- `@/*` → `./src/*` 매핑을 통해 절대 경로 임포트 지원

## 🛠️ 개발 시작하기

### 필수 요구사항
- Node.js 20 이상
- pnpm (권장 패키지 매니저)

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

`src/app/page.tsx` 파일을 수정하면 페이지가 자동으로 업데이트됩니다.

### 프로덕션 빌드

```bash
pnpm build
pnpm start
```

### 코드 검사

```bash
pnpm lint
```

## ⚙️ 주요 설정

### React Compiler
React Compiler가 `next.config.ts`에서 활성화되어 있습니다:

```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
};
```

**주의사항:**
- React Compiler는 컴포넌트가 순수 함수여야 한다는 React 규칙을 엄격히 따릅니다
- props와 state는 불변(immutable)으로 취급해야 합니다
- 수동 메모이제이션(`useMemo`, `useCallback`, `React.memo`)은 컴파일러가 자동으로 처리하므로 불필요합니다

### TypeScript 설정
- **Target**: ES2017
- **JSX**: `react-jsx` (자동 JSX 변환)
- **Strict Mode**: 활성화
- **Path Alias**: `@/*` → `./src/*`

### ESLint 설정
- Next.js Core Web Vitals 규칙 적용
- TypeScript 전용 린트 규칙 포함
- 제외 대상: `.next/`, `out/`, `build/`, `next-env.d.ts`

## 📚 학습 리소스

Next.js에 대해 더 알아보려면 다음 리소스를 참고하세요:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js 기능 및 API 학습
- [Learn Next.js](https://nextjs.org/learn) - 인터랙티브 Next.js 튜토리얼
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - 피드백 및 기여 환영

## 🚢 배포

### Vercel에 배포
Next.js 앱을 배포하는 가장 쉬운 방법은 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)을 사용하는 것입니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참조하세요.

## 📋 현재 구현 상태

### ✅ 완료된 기능
- **기본 인프라**
  - Next.js 16 App Router 구조 설정
  - TypeScript 타입 시스템 구성
  - Tailwind CSS v4 + 커스텀 CSS 클래스 시스템
  - React Compiler 활성화
  - ESLint 코드 품질 관리

- **공통 컴포넌트**
  - Header (Whale ERP 브랜딩)
  - Breadcrumb 네비게이션
  - Button (Primary/Secondary)
  - Select, StoreSelect 드롭다운
  - Pagination, SearchFilter
  - FormField, FileUpload, Toggle
  - TemplateCard (드래그 가능)
  - OperatingHours (운영 시간 관리)

- **주요 페이지**
  - 홈페이지 (메뉴 목록)
  - 점포 정보 관리 페이지
  - 점포 관리 페이지
  - 계약 관리 페이지
  - 템플릿 관리 페이지

## 🔧 개발 가이드라인

### React 19.2 & Next.js 16 최신 기능 활용
- **Server Components 우선** - 기본적으로 모든 컴포넌트는 Server Component
- **Client Components 최소화** - 필요한 경우에만 `'use client'` 지시어 사용
- **React Compiler 활용** - 수동 메모이제이션 패턴 제거
- **Server Actions** - 폼 제출 및 서버 측 데이터 변경 시 사용

### 코드 스타일 및 컨벤션
- **TypeScript strict 모드** 준수
- **ESLint 규칙** 엄격히 준수
- **스타일링 전략**:
  - 공통 레이아웃/패턴: 커스텀 CSS 클래스 (`globals.css`)
  - 간단한 스타일링: Tailwind 유틸리티 클래스
- **컴포넌트 순수성** 유지 (React Compiler 요구사항)
- **모바일 우선** 설계 원칙 준수

### 페이지 구조 패턴
모든 페이지는 다음 구조를 따릅니다:

```tsx
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";

export default function ExamplePage() {
  return (
    <main>
      <Header />
      <div className="page-container">
        {/* StoreSelect 등 필요한 경우 */}
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

### 컴포넌트 개발 가이드
- **Props 타입 정의**: `{ComponentName}Props` 형식으로 인터페이스 정의
- **경로 별칭 사용**: `@/components/...` 형태로 임포트
- **재사용성 고려**: 공통 패턴은 컴포넌트화
- **접근성 준수**: ARIA 속성 및 시맨틱 HTML 사용

## 📝 라이선스

Private 프로젝트
