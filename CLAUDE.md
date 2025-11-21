# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Whale Partner Office App Demo** - Next.js 16.0.3 기반의 **모바일 우선** ERP 관리 시스템입니다. Next.js App Router, React 19.2.0, TypeScript, Tailwind CSS v4를 사용하며, React Compiler가 활성화되어 있습니다.

## Development Commands

```bash
# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# ESLint 실행
npm run lint
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
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 루트 레이아웃 (공통 HTML 구조)
│   ├── page.tsx             # 홈페이지 (메뉴 목록)
│   ├── globals.css          # 글로벌 CSS 및 커스텀 클래스
│   ├── store-info/          # 점포 정보 관리
│   ├── store-management/    # 점포 관리
│   ├── contract-management/ # 계약 관리
│   └── templates/           # 템플릿 관리
└── components/              # 재사용 가능한 컴포넌트들
    ├── Header.tsx           # 공통 헤더 (Whale ERP 브랜딩)
    ├── Breadcrumb.tsx       # 페이지 네비게이션
    ├── Button.tsx           # 버튼 (primary/secondary)
    ├── Select.tsx           # 선택 컴포넌트
    ├── StoreSelect.tsx      # 점포 선택 드롭다운
    ├── TemplateCard.tsx     # 템플릿 카드 (드래그 가능)
    └── [기타 UI 컴포넌트들]
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

## Modern React 19.2 & Next.js 16 Features

다음 최신 기능들을 적극 활용하세요:

- **Server Components**: 기본값으로 사용, 서버에서 렌더링
- **Server Actions**: 폼 제출 및 서버 측 데이터 변경 시 사용
- **Streaming & Suspense**: 필요시 점진적 렌더링 적용
- **Metadata API**: SEO 최적화를 위한 메타데이터 정의

## ESLint Configuration

Next.js ESLint 프리셋 사용:
- `eslint-config-next/core-web-vitals` - Core Web Vitals 규칙
- `eslint-config-next/typescript` - TypeScript 전용 규칙
- 제외 대상: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.3 | React 프레임워크 (App Router) |
| React | 19.2.0 | UI 라이브러리 |
| TypeScript | ^5 | 타입 안정성 |
| Tailwind CSS | ^4 | 유틸리티 퍼스트 스타일링 |
| React Compiler | 1.0.0 | 자동 React 최적화 |

## Important Notes

1. **한국어 우선**: 모든 설명, 추론 과정, 코드 주석은 한국어로 작성
2. **모바일 우선**: 모든 UI는 모바일 화면을 먼저 고려하여 설계
3. **최신 문법 사용**: React 19.2 및 Next.js 16의 최신 기능 적극 활용
4. **컴포넌트 순수성**: React Compiler 요구사항 준수
5. **스타일 일관성**: 기존 커스텀 클래스 패턴 참고 및 확장
