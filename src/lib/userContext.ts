/**
 * 현재 로그인한 사용자 컨텍스트
 *
 * 현재 앱에 로그인 기능이 없기 때문에 하드코딩된 사용자 정보를 사용합니다.
 * 추후 로그인 기능 구현 시 이 파일을 수정하여 실제 사용자 정보를 제공하도록 변경합니다.
 */

export interface CurrentUser {
  id: number;
  name: string;
  role: string;
  storeId: number;
  storeName: string;
}

/**
 * 현재 로그인한 사용자 정보
 * - 을지로 3가 매니저 임꺽정으로 고정
 */
export const currentUser: CurrentUser = {
  id: 2, // employees 테이블의 임꺽정 ID (실제 DB의 ID로 조정 필요)
  name: '임꺽정',
  role: 'Platform Manager',
  storeId: 6, // stores 테이블의 을지로3가점 ID
  storeName: '을지로3가점',
};

/**
 * 현재 사용자의 매장 정보를 반환합니다.
 */
export function getCurrentUserStore() {
  return {
    id: currentUser.storeId,
    name: currentUser.storeName,
  };
}

/**
 * 현재 사용자 정보를 반환합니다.
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * AI 채팅 시스템 프롬프트에 사용할 사용자 컨텍스트 문자열을 반환합니다.
 */
export function getUserContextForAI(): string {
  return `
## 현재 로그인한 사용자 정보
- 이름: ${currentUser.name}
- 역할: ${currentUser.role}
- 담당 매장: ${currentUser.storeName} (ID: ${currentUser.storeId})

## 매출 관련 요청 처리 규칙
사용자가 매출, 주문, 오늘 실적 등을 물어볼 때:
1. 특정 매장을 언급하지 않으면 → 현재 사용자의 담당 매장(${currentUser.storeName})의 데이터를 기준으로 답변
2. "오늘 매출 알려줘" → ${currentUser.storeName}의 오늘 매출 데이터 조회
3. "이번 달 매출은?" → ${currentUser.storeName}의 이번 달 매출 데이터 조회
4. 다른 매장을 명시적으로 언급하면 → 해당 매장의 데이터 조회

현재 사용자(${currentUser.name})는 ${currentUser.storeName}의 매니저이므로,
매출/주문 관련 질문은 기본적으로 ${currentUser.storeName} 기준으로 처리합니다.
`;
}
