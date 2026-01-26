# 타겟 제품 실습 문제집

## 📚 개요

이 문제집은 **타겟 제품(Target Product)** CRUD 애플리케이션을 통해 Next.js 15 App Router, Prisma ORM, React Server/Client Components 패턴을 실습으로 학습하기 위해 제작되었습니다.

### 🎯 학습 목표

이 문제집을 완료하면 다음을 할 수 있게 됩니다:

1. **Next.js 15 App Router 아키텍처 이해**
   - Server Components와 Client Components의 차이점 이해
   - API Routes와 Server Actions의 적절한 사용
   - 파일 기반 라우팅 시스템 활용

2. **Prisma ORM 마스터**
   - CRUD 작업 수행
   - 복잡한 쿼리 작성 (필터링, 정렬, 페이지네이션)
   - 관계형 데이터 처리 및 최적화
   - 트랜잭션과 성능 최적화

3. **React 상태 관리 패턴**
   - useState, useEffect를 활용한 클라이언트 상태 관리
   - 낙관적 업데이트(Optimistic Updates) 구현
   - 폼 상태 관리 및 유효성 검사

4. **프로덕션 수준 코드 작성**
   - 에러 처리 및 로딩 상태 관리
   - 타입 안전성 확보 (TypeScript)
   - 테스트 작성 (단위 테스트, E2E 테스트)

### ✅ 전제 조건

- **필수 지식**:
  - JavaScript/TypeScript 기본 문법
  - React 기초 (컴포넌트, Props, State)
  - HTML/CSS 기본

- **권장 지식**:
  - Next.js 기본 개념
  - SQL 기초
  - Git 사용법

- **개발 환경**:
  - Node.js 18 이상
  - PostgreSQL 설치 및 실행 중
  - 프로젝트 클론 및 종속성 설치 완료
  - 데이터베이스 마이그레이션 완료

### 📖 학습 순서 가이드

문제 번호 순서대로 풀 필요는 없습니다! 다음 **7단계 Phase 학습 경로**를 추천합니다:

| Phase | 기간 | 주제 | 문제 번호 |
|-------|------|------|-----------|
| **Phase 1** | 1-2주 | 기본 이해 | 1, 2, 3, 4, 5, 9 |
| **Phase 2** | 1주 | 인터랙션 | 6, 7, 8, 10, 13 |
| **Phase 3** | 2주 | 데이터 처리 | 11, 12, 14, 15, 17, 18 |
| **Phase 4** | 2-3주 | 고급 기능 | 16, 19, 20, 21, 22, 25 |
| **Phase 5** | 1-2주 | 성능 최적화 | 23, 24, 26, 31, 32, 37 |
| **Phase 6** | 2-3주 | 프로덕션 수준 | 27, 30, 33, 34, 36, 38, 39 |
| **Phase 7** | 1-2주 | 품질 보증 | 28, 29, 35, 40, 41, 42 |

**총 예상 학습 기간**: 10-15주 (개인차 있음)

---

## 🌟 초급 (Beginner) - 14문제

초급 문제는 **단일 파일 수정**으로 완료 가능하며, 기본적인 React와 TypeScript 문법을 연습합니다.

---

### 문제 1: 테이블에 "상태" 컬럼 추가

**난이도**: ⭐
**예상 시간**: 20분
**학습 목표**: DataTable 컴포넌트의 columns 정의 방식 이해, Cell Renderer 활용

**상황**:
제품 관리 팀에서 각 타겟 제품의 활성 상태를 한눈에 보고 싶다고 요청했습니다. 현재 `is_active` 필드가 DB에 존재하지만 테이블에 표시되지 않습니다.

**요구사항**:
1. 테이블에 "상태" 컬럼을 추가하세요
2. `is_active`가 `true`이면 "활성" (초록색 배지), `false`이면 "비활성" (회색 배지)으로 표시
3. 컬럼 위치는 "제품명" 다음에 배치

**힌트**:
- `src/components/trm/target-products/TargetProductList.tsx` 파일의 `columns` 배열 수정
- `accessorKey`를 사용해 데이터 필드와 연결
- `cell: ({ row })` 함수로 커스텀 렌더링 가능
- Tailwind CSS 클래스 활용: `bg-green-100 text-green-800`, `bg-gray-100 text-gray-500`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 개발 서버 실행 (`npm run dev`)
2. `/trm/target-products` 페이지 접속
3. 테이블에 "상태" 컬럼이 표시되는지 확인
4. 활성/비활성 제품의 배지 색상이 올바른지 확인

---

### 문제 2: 날짜 형식을 "YYYY년 MM월 DD일"로 변경

**난이도**: ⭐
**예상 시간**: 15분
**학습 목표**: JavaScript Date 객체 다루기, 템플릿 리터럴 활용

**상황**:
현재 생성일과 수정일이 ISO 8601 형식으로 표시되어 사용자가 읽기 어렵습니다. 한국어 형식으로 변경해야 합니다.

**요구사항**:
1. "생성일"과 "수정일" 컬럼의 날짜 형식을 변경하세요
2. 형식 예시: `2024-01-15T10:30:00Z` → `2024년 01월 15일`
3. 시간은 제외하고 날짜만 표시

**힌트**:
- `new Date(dateString)` 로 Date 객체 생성
- `getFullYear()`, `getMonth() + 1`, `getDate()` 메서드 활용
- `padStart(2, '0')` 로 두 자리 숫자 포맷팅
- 또는 `toLocaleDateString('ko-KR')` 활용 가능

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 타겟 제품 목록 페이지 확인
2. 날짜가 "YYYY년 MM월 DD일" 형식으로 표시되는지 확인
3. 여러 제품의 날짜가 올바르게 변환되었는지 확인

---

### 문제 3: 빈 목록 상태 메시지 개선

**난이도**: ⭐
**예상 시간**: 20분
**학습 목표**: 조건부 렌더링, 사용자 경험(UX) 개선

**상황**:
타겟 제품이 하나도 없을 때 단순히 "등록된 타겟 제품이 없습니다."만 표시됩니다. 더 친근하고 행동을 유도하는 메시지로 개선해야 합니다.

**요구사항**:
1. 빈 목록일 때 아이콘과 함께 안내 메시지 표시
2. "첫 타겟 제품을 등록해보세요!" 메시지 추가
3. "새 제품 등록" 버튼을 중앙에 크게 배치
4. 배경색과 여백을 추가해 시각적으로 눈에 띄게 만들기

**힌트**:
- `products.length === 0` 조건으로 분기 처리
- Lucide React 아이콘 사용 가능 (`import { PackageOpen } from "lucide-react"`)
- Flexbox로 중앙 정렬: `flex items-center justify-center`
- 카드 형태로 감싸기: `border rounded-lg p-8`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 데이터베이스에서 모든 타겟 제품 삭제 (또는 테스트 DB 사용)
2. 타겟 제품 목록 페이지 접속
3. 개선된 빈 상태 메시지가 표시되는지 확인
4. "새 제품 등록" 버튼 클릭 시 폼이 표시되는지 확인

---

### 문제 4: 폼 유효성 검사 강화

**난이도**: ⭐
**예상 시간**: 30분
**학습 목표**: 클라이언트 측 유효성 검사, 에러 메시지 표시

**상황**:
현재 폼에서는 빈 값으로 제품을 등록할 수 있어 데이터 품질이 떨어집니다. 제출 전에 유효성을 검사해야 합니다.

**요구사항**:
1. 제품명(`product_name`): 필수, 2자 이상 50자 이하
2. 제품군(`product_group`): 필수
3. 순서(`order`): 필수, 1 이상의 정수
4. 각 필드 아래에 에러 메시지 표시 (빨간색)
5. 모든 검증이 통과해야만 제출 버튼 활성화

**힌트**:
- `useState`로 각 필드별 에러 상태 관리
- `handleSubmit` 함수에서 검증 로직 추가
- `errors` 객체로 에러 관리: `{ product_name: "", product_group: "", order: "" }`
- 제출 버튼 비활성화: `disabled={!isValid}`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductForm.tsx`

**테스트 방법**:
1. 새 제품 등록 폼 열기
2. 각 필드를 비워두고 제출 시도 → 에러 메시지 확인
3. 제품명에 1글자만 입력 → "2자 이상 입력해주세요" 확인
4. 모든 필드를 올바르게 입력 → 제출 가능 확인

---

### 문제 5: 목록 정렬 기능 추가

**난이도**: ⭐
**예상 시간**: 25분
**학습 목표**: Array.sort() 메서드, 정렬 로직 구현

**상황**:
제품 관리자가 제품명 순서대로 또는 생성일 순서대로 정렬하고 싶다고 요청했습니다. 드롭다운으로 정렬 기준을 선택할 수 있어야 합니다.

**요구사항**:
1. 목록 상단에 정렬 드롭다운 추가
2. 정렬 옵션: "이름 순", "생성일 순 (최신)", "순서 순"
3. 정렬 선택 시 즉시 목록 재정렬
4. 선택된 정렬 기준을 로컬 상태로 유지

**힌트**:
- `useState`로 정렬 기준 상태 관리: `const [sortBy, setSortBy] = useState("order")`
- `useMemo`로 정렬된 배열 계산
- `Array.sort((a, b) => ...)` 활용
- 문자열 비교: `a.product_name.localeCompare(b.product_name)`
- 날짜 비교: `new Date(a.created_at) - new Date(b.created_at)`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 타겟 제품이 여러 개 있는 상태에서 테스트
2. "이름 순" 선택 → 가나다 순으로 정렬 확인
3. "생성일 순" 선택 → 최신 항목이 위로 오는지 확인
4. "순서 순" 선택 → order 필드 값 순서로 정렬 확인

---

### 문제 6: 검색 기능 구현

**난이도**: ⭐
**예상 시간**: 30분
**학습 목표**: filter() 메서드, includes() 메서드, 디바운싱 개념

**상황**:
제품이 많아지면서 특정 제품을 찾기 어렵습니다. 제품명으로 실시간 검색할 수 있는 기능이 필요합니다.

**요구사항**:
1. 목록 상단에 검색 입력 필드 추가
2. 입력 시 제품명에 검색어가 포함된 항목만 필터링
3. 대소문자 구분 없이 검색
4. 검색어가 없으면 전체 목록 표시

**힌트**:
- `useState`로 검색어 상태 관리: `const [searchTerm, setSearchTerm] = useState("")`
- `filter()` 메서드로 배열 필터링
- `toLowerCase()` + `includes()` 로 대소문자 무시 검색
- `useMemo`로 필터링된 배열 메모이제이션

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 검색 필드에 제품명 일부 입력
2. 입력과 동시에 목록이 필터링되는지 확인
3. 검색어를 지우면 전체 목록이 다시 나타나는지 확인
4. 영문 대소문자 혼합해도 검색되는지 확인

---

### 문제 7: 로딩 상태 개선 (스피너 추가)

**난이도**: ⭐
**예상 시간**: 20분
**학습 목표**: 로딩 상태 관리, SVG 애니메이션

**상황**:
현재 데이터 로딩 중에는 아무 표시가 없어 사용자가 페이지가 멈춘 것으로 오해할 수 있습니다. 로딩 스피너를 추가해야 합니다.

**요구사항**:
1. 데이터 로딩 중에 화면 중앙에 스피너 표시
2. 스피너와 함께 "로딩 중..." 텍스트 표시
3. 로딩 완료 후 스피너 제거 및 목록 표시

**힌트**:
- `isLoading` 상태가 이미 존재하는지 확인
- Lucide React의 `Loader2` 아이콘 사용
- `animate-spin` 클래스로 회전 애니메이션
- 조건부 렌더링: `if (isLoading) return <Spinner />`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 네트워크 속도를 느리게 설정 (Chrome DevTools → Network → Slow 3G)
2. 페이지 새로고침
3. 로딩 스피너가 표시되는지 확인
4. 데이터 로드 완료 후 목록이 표시되는지 확인

---

### 문제 8: 에러 메시지 스타일 개선

**난이도**: ⭐
**예상 시간**: 25분
**학습 목표**: 에러 UI/UX 개선, 아이콘 활용

**상황**:
현재 에러 메시지가 단순 텍스트로만 표시되어 눈에 잘 띄지 않습니다. 더 명확하고 사용자 친화적인 에러 표시가 필요합니다.

**요구사항**:
1. 에러 메시지를 경고 아이콘과 함께 표시
2. 빨간색 배경에 흰색 텍스트 사용
3. 닫기 버튼 추가 (X 아이콘)
4. 에러 메시지 영역에 적절한 패딩과 라운드 처리

**힌트**:
- Lucide React의 `AlertCircle`, `X` 아이콘 사용
- 배경 클래스: `bg-red-50 border border-red-200`
- 텍스트 클래스: `text-red-800`
- 닫기 버튼 클릭 시 에러 상태를 `null`로 설정

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 의도적으로 에러를 발생시키기 (예: 네트워크 차단)
2. 개선된 에러 메시지 UI 확인
3. 닫기 버튼 클릭 시 에러 메시지가 사라지는지 확인

---

### 문제 9: 통계 카드 추가

**난이도**: ⭐
**예상 시간**: 30분
**학습 목표**: 데이터 집계, 카드 레이아웃

**상황**:
대시보드에 타겟 제품의 통계 정보를 표시하고 싶습니다. 전체 제품 수, 활성 제품 수, 비활성 제품 수를 카드로 보여주세요.

**요구사항**:
1. 목록 상단에 3개의 통계 카드 배치
2. 카드 내용:
   - "전체 제품": 전체 개수
   - "활성 제품": is_active=true 개수 (초록색 아이콘)
   - "비활성 제품": is_active=false 개수 (회색 아이콘)
3. 각 카드에 아이콘과 숫자를 크게 표시

**힌트**:
- `products.length` 로 전체 개수
- `products.filter(p => p.is_active).length` 로 활성 개수
- Grid 레이아웃: `grid grid-cols-3 gap-4`
- 카드 스타일: `bg-white border rounded-lg p-6`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 타겟 제품 목록 페이지 접속
2. 상단에 3개의 통계 카드가 표시되는지 확인
3. 각 카드의 숫자가 실제 데이터와 일치하는지 확인
4. 제품 추가/삭제 시 통계가 업데이트되는지 확인

---

### 문제 10: 삭제 확인 모달 추가

**난이도**: ⭐
**예상 시간**: 35분
**학습 목표**: 모달 상태 관리, 조건부 렌더링

**상황**:
현재는 삭제 버튼을 클릭하면 즉시 삭제됩니다. 실수로 삭제하는 것을 방지하기 위해 확인 모달이 필요합니다.

**요구사항**:
1. 삭제 버튼 클릭 시 확인 모달 표시
2. 모달에 "정말 삭제하시겠습니까?" 메시지와 제품명 표시
3. "취소"와 "삭제" 버튼 제공
4. 삭제 버튼은 빨간색으로 강조

**힌트**:
- `useState`로 모달 상태 관리: `const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)`
- `deleteConfirm`에 삭제할 제품의 ID 저장
- 모달 배경: `fixed inset-0 bg-black/50`로 오버레이
- 모달 컨텐츠: `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`로 중앙 배치

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 제품 삭제 버튼 클릭
2. 확인 모달이 화면 중앙에 표시되는지 확인
3. "취소" 클릭 시 모달이 닫히고 삭제되지 않는지 확인
4. "삭제" 클릭 시 제품이 삭제되는지 확인

---

### 문제 11: 필드별 에러 표시

**난이도**: ⭐
**예상 시간**: 30분
**학습 목표**: 폼 에러 상태 관리, 세밀한 피드백

**상황**:
현재 폼 제출 실패 시 전체 에러만 표시됩니다. 어떤 필드에 문제가 있는지 명확히 알려줘야 합니다.

**요구사항**:
1. 각 입력 필드 아래에 개별 에러 메시지 표시 공간 마련
2. 에러가 있는 필드는 테두리를 빨간색으로 변경
3. 에러 메시지는 작은 빨간 텍스트로 표시
4. API 응답의 필드별 에러를 파싱해서 표시

**힌트**:
- `fieldErrors` 상태로 필드별 에러 관리
- 조건부 클래스: `border-red-500` vs `border-gray-300`
- API 응답에서 `errors` 객체 추출
- 각 필드마다 `{fieldErrors.product_name && <p className="text-red-500 text-sm">{fieldErrors.product_name}</p>}` 추가

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductForm.tsx`

**테스트 방법**:
1. 폼에 잘못된 데이터 입력 (예: 중복 제품명)
2. 제출 후 해당 필드에 빨간 테두리와 에러 메시지 표시 확인
3. 여러 필드에 에러가 있을 때 각각 표시되는지 확인

---

### 문제 12: API 응답 타입 안전성 확보

**난이도**: ⭐
**예상 시간**: 25분
**학습 목표**: TypeScript 타입 가드, 런타임 검증

**상황**:
API 응답이 예상과 다른 형태로 올 때 앱이 깨질 수 있습니다. 타입 가드를 추가해 안전성을 확보해야 합니다.

**요구사항**:
1. API 응답 타입 체크 함수 작성
2. 필수 필드가 있는지 확인
3. 타입이 예상과 다르면 에러 처리
4. TypeScript의 타입 가드 패턴 활용

**힌트**:
- 타입 가드 함수: `function isTargetProduct(obj: any): obj is TargetProduct { ... }`
- 필수 필드 체크: `obj && typeof obj.id === 'string' && typeof obj.product_name === 'string'`
- API 호출 후 응답 검증: `if (!isTargetProduct(data)) { throw new Error("Invalid response") }`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. Chrome DevTools에서 Network 탭 열기
2. API 응답을 수동으로 변경 (Breakpoint 사용)
3. 잘못된 타입 응답 시 에러 처리되는지 확인

---

### 문제 13: 성공 메시지 개선 (Toast 알림)

**난이도**: ⭐
**예상 시간**: 30분
**학습 목표**: Toast 알림 구현, 사용자 피드백

**상황**:
제품 등록/수정/삭제 성공 시 사용자에게 피드백이 필요합니다. 화면 우측 상단에 Toast 알림을 표시하세요.

**요구사항**:
1. 성공 시 화면 우측 상단에 Toast 알림 표시
2. 3초 후 자동으로 사라지기
3. 초록색 배경에 체크 아이콘 포함
4. 알림 내용: "제품이 등록되었습니다", "제품이 수정되었습니다", "제품이 삭제되었습니다"

**힌트**:
- `useState`로 Toast 상태 관리: `const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null)`
- `useEffect`와 `setTimeout`으로 3초 후 제거
- 위치: `fixed top-4 right-4 z-50`
- 애니메이션: `transition-all duration-300`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 새 제품 등록 후 Toast 알림 확인
2. 3초 후 자동으로 사라지는지 확인
3. 여러 작업을 연속으로 수행해도 알림이 정상 작동하는지 확인

---

### 문제 14: 페이지네이션 기초 구현

**난이도**: ⭐
**예상 시간**: 35분
**학습 목표**: 클라이언트 측 페이지네이션, slice() 메서드

**상황**:
제품이 100개 이상일 때 한 페이지에 모두 표시하면 성능이 저하됩니다. 페이지네이션을 추가해야 합니다.

**요구사항**:
1. 페이지당 10개 항목 표시
2. 하단에 페이지 번호 버튼 표시
3. 이전/다음 버튼 추가
4. 현재 페이지 번호 강조

**힌트**:
- `useState`로 현재 페이지 관리: `const [currentPage, setCurrentPage] = useState(1)`
- `slice()` 메서드로 현재 페이지 데이터 추출
- 시작 인덱스: `(currentPage - 1) * pageSize`
- 끝 인덱스: `currentPage * pageSize`
- 총 페이지 수: `Math.ceil(products.length / pageSize)`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 제품을 15개 이상 등록 (또는 Seed 데이터 사용)
2. 페이지네이션 버튼이 표시되는지 확인
3. 페이지 이동 시 올바른 항목이 표시되는지 확인
4. 이전/다음 버튼이 첫/마지막 페이지에서 비활성화되는지 확인

---

## ⭐⭐ 중급 (Intermediate) - 15문제

중급 문제는 **여러 파일 수정**이 필요하며, 전체 스택(프론트엔드 + 백엔드 + DB)을 이해해야 합니다.

---

### 문제 15: 새 필드 추가 (description)

**난이도**: ⭐⭐
**예상 시간**: 60분
**학습 목표**: 전체 스택 변경, Prisma 마이그레이션, 폼 업데이트

**상황**:
제품 관리 팀에서 각 타겟 제품에 대한 상세 설명을 저장하고 싶다고 요청했습니다. DB 스키마부터 UI까지 모두 변경해야 합니다.

**요구사항**:
1. Prisma 스키마에 `description` 필드 추가 (String, 선택적)
2. DB 마이그레이션 실행
3. 폼에 설명 입력 필드 추가 (textarea)
4. API에서 description 필드 처리
5. 목록에서 설명 표시 (말줄임표 처리)

**힌트**:
- Prisma 스키마 수정 후 `npx prisma migrate dev --name add_description`
- API Route에서 `description` 필드 추가
- Textarea 컴포넌트: `<textarea rows={3} />`
- CSS 말줄임표: `line-clamp-2` 또는 `overflow-hidden text-ellipsis`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\prisma\schema.prisma`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\services\targetProduct.service.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\route.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductForm.tsx`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 마이그레이션 실행 성공 확인
2. 새 제품 등록 시 설명 입력 가능 확인
3. 목록에서 설명이 표시되는지 확인
4. 기존 제품(description이 null)도 정상 작동하는지 확인

---

### 문제 16: 일괄 삭제 기능

**난이도**: ⭐⭐
**예상 시간**: 60분
**학습 목표**: 복수 선택 UI, 배치 API 호출

**상황**:
한 번에 여러 제품을 삭제하고 싶다는 요청이 들어왔습니다. 체크박스로 여러 항목을 선택해 일괄 삭제할 수 있어야 합니다.

**요구사항**:
1. 각 행에 체크박스 추가
2. 상단에 "전체 선택" 체크박스 추가
3. 선택된 항목 수 표시
4. "선택 삭제" 버튼 추가 (선택 시에만 활성화)
5. API에서 배치 삭제 지원

**힌트**:
- `useState`로 선택된 ID 배열 관리: `const [selectedIds, setSelectedIds] = useState<string[]>([])`
- 전체 선택 체크: `selectedIds.length === products.length`
- API: `DELETE /api/target-products` (Body에 `ids: string[]` 전달)
- Prisma: `deleteMany({ where: { id: { in: ids } } })`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\route.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\services\targetProduct.service.ts`

**테스트 방법**:
1. 여러 제품 체크박스 선택
2. 선택 수가 올바르게 표시되는지 확인
3. "선택 삭제" 버튼 클릭 후 선택된 모든 항목 삭제 확인
4. 전체 선택 후 일괄 삭제 테스트

---

### 문제 17: 제품군별 필터링

**난이도**: ⭐⭐
**예상 시간**: 45분
**학습 목표**: 드롭다운 필터, 복합 필터링 로직

**상황**:
제품군이 여러 개 있을 때 특정 제품군만 보고 싶을 때가 있습니다. 드롭다운으로 제품군을 선택해 필터링하세요.

**요구사항**:
1. 제품군 목록을 자동으로 추출 (중복 제거)
2. 드롭다운에 "전체" 옵션 포함
3. 제품군 선택 시 해당 제품군만 필터링
4. 검색 기능과 함께 작동 (AND 조건)

**힌트**:
- `Array.from(new Set(products.map(p => p.product_group)))` 로 unique 값 추출
- 필터 상태: `const [filterGroup, setFilterGroup] = useState<string | null>(null)`
- 복합 필터: `products.filter(p => (!filterGroup || p.product_group === filterGroup) && p.product_name.includes(searchTerm))`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 여러 제품군의 제품 등록
2. 드롭다운에서 특정 제품군 선택
3. 해당 제품군의 제품만 표시되는지 확인
4. 검색과 함께 사용해도 올바르게 작동하는지 확인

---

### 문제 18: API 쿼리 파라미터 지원

**난이도**: ⭐⭐
**예상 시간**: 50분
**학습 목표**: 서버 측 필터링, 쿼리 파라미터 처리

**상황**:
클라이언트에서 필터링하면 모든 데이터를 가져와야 해서 비효율적입니다. 서버에서 필터링해서 필요한 데이터만 가져오도록 개선하세요.

**요구사항**:
1. API에 쿼리 파라미터 지원 추가
   - `?product_group=XXX`: 제품군 필터
   - `?search=XXX`: 제품명 검색
   - `?is_active=true/false`: 활성 상태 필터
2. Prisma where 조건으로 필터링
3. 클라이언트에서 쿼리 파라미터로 API 호출

**힌트**:
- Next.js API에서 쿼리 파라미터: `request.nextUrl.searchParams.get('product_group')`
- Prisma where 조건: `{ product_group: productGroup, product_name: { contains: search }, is_active: isActive }`
- 클라이언트 호출: `fetch(\`/api/target-products?product_group=${group}\`)`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\route.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\services\targetProduct.service.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 브라우저에서 `/api/target-products?product_group=A` 직접 호출
2. 필터된 결과만 반환되는지 확인
3. 여러 쿼리 파라미터 조합 테스트
4. Network 탭에서 전송된 데이터 크기 확인

---

### 문제 19: 복합 키 CRUD 처리

**난이도**: ⭐⭐
**예상 시간**: 55분
**학습 목표**: Prisma Composite Key, unique 제약 조건

**상황**:
제품군과 제품명의 조합이 unique해야 합니다. 같은 제품군 내에서는 같은 이름을 사용할 수 없도록 제약을 추가하세요.

**요구사항**:
1. Prisma 스키마에 복합 unique 제약 추가
2. DB 마이그레이션 실행
3. API에서 중복 체크 및 에러 처리
4. 클라이언트에서 중복 에러 메시지 표시

**힌트**:
- Prisma 스키마: `@@unique([product_group, product_name])`
- 중복 에러 캐치: `catch (error) { if (error.code === 'P2002') { ... } }`
- 에러 메시지: "같은 제품군에 동일한 제품명이 이미 존재합니다"

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\prisma\schema.prisma`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\route.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductForm.tsx`

**테스트 방법**:
1. 같은 제품군에 같은 이름의 제품 등록 시도
2. 적절한 에러 메시지가 표시되는지 확인
3. 다른 제품군에는 같은 이름 사용 가능한지 확인

---

### 문제 20: 관계 데이터 최적화

**난이도**: ⭐⭐
**예상 시간**: 50분
**학습 목표**: Prisma select vs include, N+1 쿼리 방지

**상황**:
타겟 제품과 연관된 다른 테이블 데이터를 가져올 때 N+1 쿼리 문제가 발생합니다. Prisma의 include를 활용해 최적화하세요.

**요구사항**:
1. 불필요한 필드는 select로 제외
2. 연관 데이터는 include로 한 번에 가져오기
3. 쿼리 실행 시간 측정 및 비교
4. Console에 실행된 쿼리 로그 출력

**힌트**:
- Prisma Client 로깅: `log: ['query']`
- select vs include 비교
- 성능 측정: `console.time()`, `console.timeEnd()`
- 필요한 필드만: `select: { id: true, product_name: true }`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\services\targetProduct.service.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\prisma.ts` (로깅 설정)

**테스트 방법**:
1. 쿼리 로그 활성화 후 API 호출
2. 실행된 SQL 쿼리 수 확인
3. 최적화 전후 응답 시간 비교

---

### 문제 21: 낙관적 업데이트 (수정)

**난이도**: ⭐⭐
**예상 시간**: 60분
**학습 목표**: Optimistic Updates, useTransition, Rollback

**상황**:
제품 수정 시 API 응답을 기다리면 사용자 경험이 느려집니다. 낙관적 업데이트로 즉시 UI를 반영하고, 실패 시 되돌리세요.

**요구사항**:
1. 수정 버튼 클릭 시 즉시 UI 업데이트
2. API 호출이 진행 중임을 표시 (스피너)
3. API 실패 시 이전 상태로 롤백
4. 성공 시 서버 응답으로 최종 동기화

**힌트**:
- `useState`로 임시 상태 관리
- API 호출 전에 UI 먼저 업데이트
- try-catch로 에러 처리 및 롤백
- `previousProducts` 변수에 이전 상태 백업

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 제품 수정 후 즉시 UI 변경 확인
2. 네트워크를 차단한 상태에서 수정 시도 → 롤백 확인
3. 정상 상황에서 서버 응답으로 최종 동기화 확인

---

### 문제 22: 계층 구조 트리 뷰

**난이도**: ⭐⭐
**예상 시간**: 70분
**학습 목표**: 재귀 컴포넌트, 부모-자식 관계

**상황**:
타겟 제품에 상위 제품(parent_id) 개념을 추가해 계층 구조를 만들고 싶습니다. 트리 형태로 표시하세요.

**요구사항**:
1. Prisma 스키마에 `parent_id` 필드 추가 (자기 참조 관계)
2. 재귀 컴포넌트로 트리 렌더링
3. 펼치기/접기 기능 추가
4. 들여쓰기로 계층 표시

**힌트**:
- Prisma self-relation: `parent TargetProduct? @relation("ParentChild", fields: [parent_id], references: [id])`
- 재귀 컴포넌트: `function TreeNode({ product, level }) { ... }`
- 자식 필터링: `products.filter(p => p.parent_id === product.id)`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\prisma\schema.prisma`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductForm.tsx`

**테스트 방법**:
1. 상위 제품 없이 제품 등록 (root)
2. 상위 제품을 선택해 하위 제품 등록
3. 트리 구조가 올바르게 표시되는지 확인
4. 펼치기/접기 기능 테스트

---

### 문제 23: 드래그 앤 드롭 정렬

**난이도**: ⭐⭐
**예상 시간**: 75분
**학습 목표**: HTML5 Drag and Drop API, 순서 업데이트

**상황**:
order 필드를 수동으로 입력하는 대신, 드래그 앤 드롭으로 순서를 변경하고 싶습니다.

**요구사항**:
1. 각 행을 드래그 가능하게 만들기
2. 드롭 위치에 따라 순서 재배열
3. 변경된 순서를 API로 일괄 업데이트
4. 드래그 중 시각적 피드백 제공

**힌트**:
- `draggable` 속성 사용
- `onDragStart`, `onDragOver`, `onDrop` 이벤트 핸들러
- 순서 업데이트 API: `PATCH /api/target-products/reorder` (Body: `{ updates: [{id, order}] }`)
- 라이브러리 사용 가능: `@dnd-kit/core`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\reorder\route.ts` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\services\targetProduct.service.ts`

**테스트 방법**:
1. 제품을 드래그해서 다른 위치로 이동
2. 드롭 후 순서가 변경되었는지 확인
3. 페이지 새로고침 후에도 순서가 유지되는지 확인

---

### 문제 24: 캐싱 전략 적용

**난이도**: ⭐⭐
**예상 시간**: 50분
**학습 목표**: Next.js 캐싱, revalidate, ISR

**상황**:
타겟 제품 데이터는 자주 변경되지 않으므로 캐싱으로 성능을 개선할 수 있습니다. Next.js의 캐싱 전략을 적용하세요.

**요구사항**:
1. Server Component에서 데이터 페칭 시 캐싱 적용
2. 60초마다 자동 재검증
3. 데이터 변경 시 수동으로 캐시 무효화
4. API Route에도 캐싱 헤더 추가

**힌트**:
- `fetch` 옵션: `{ next: { revalidate: 60 } }`
- `revalidatePath('/trm/target-products')` 로 수동 재검증
- API Route: `export const revalidate = 60`
- Cache-Control 헤더: `public, s-maxage=60, stale-while-revalidate`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\trm\target-products\page.tsx`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\route.ts`

**테스트 방법**:
1. 페이지 첫 로드 후 Network 탭에서 캐시 헤더 확인
2. 60초 이내 재접속 시 캐시에서 로드되는지 확인
3. 데이터 변경 후 캐시가 무효화되는지 확인

---

### 문제 25: Optimistic Locking (버전 관리)

**난이도**: ⭐⭐
**예상 시간**: 60분
**학습 목표**: 동시성 제어, 버전 충돌 감지

**상황**:
여러 사용자가 동시에 같은 제품을 수정할 때 나중 사용자의 변경이 먼저 한 변경을 덮어쓸 수 있습니다. 버전 관리로 충돌을 감지하세요.

**요구사항**:
1. Prisma 스키마에 `version` 필드 추가 (Int, 기본값 0)
2. 수정 시 버전 번호 체크
3. 버전이 다르면 "다른 사용자가 수정했습니다" 에러 반환
4. 수정 성공 시 버전 번호 증가

**힌트**:
- Prisma 업데이트: `update({ where: { id, version }, data: { ..., version: { increment: 1 } } })`
- 버전 불일치 시 `P2025` 에러 발생
- 클라이언트에서 현재 버전을 hidden 필드로 전송

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\prisma\schema.prisma`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\[id]\route.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductForm.tsx`

**테스트 방법**:
1. 두 개의 브라우저 탭에서 같은 제품 수정 페이지 열기
2. 첫 번째 탭에서 수정 후 저장
3. 두 번째 탭에서 수정 시도 → 버전 충돌 에러 확인

---

### 문제 26: 가상 스크롤 (Virtual Scrolling)

**난이도**: ⭐⭐
**예상 시간**: 70분
**학습 목표**: 성능 최적화, 대용량 데이터 렌더링

**상황**:
제품이 1000개 이상일 때 모든 행을 렌더링하면 브라우저가 느려집니다. 가상 스크롤로 보이는 부분만 렌더링하세요.

**요구사항**:
1. 뷰포트에 보이는 행만 DOM에 렌더링
2. 스크롤 시 동적으로 렌더링 업데이트
3. 전체 스크롤바 높이 유지
4. 라이브러리 사용 권장: `react-window` 또는 `react-virtual`

**힌트**:
- `react-window`의 `FixedSizeList` 컴포넌트 사용
- `height`: 뷰포트 높이, `itemCount`: 전체 항목 수, `itemSize`: 행 높이
- `overscanCount` 로 여유 렌더링

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\package.json` (dependency 추가)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. Seed 스크립트로 1000개 제품 생성
2. Chrome DevTools Performance 탭에서 렌더링 성능 측정
3. 스크롤 시 부드럽게 작동하는지 확인
4. DOM에 렌더링된 행 수 확인 (개발자 도구)

---

### 문제 27: 상세 모달 (URL 상태 관리)

**난이도**: ⭐⭐
**예상 시간**: 55분
**학습 목표**: URL 상태 동기화, 라우팅 인터셉션

**상황**:
제품 상세 정보를 모달로 표시하되, URL에도 반영해 북마크 가능하게 만들어야 합니다.

**요구사항**:
1. 제품 클릭 시 `/trm/target-products?id=XXX` URL로 변경
2. 해당 URL 직접 접속 시에도 모달 표시
3. 모달 닫기 시 URL에서 쿼리 제거
4. 뒷배경 클릭 시 모달 닫기

**힌트**:
- `useRouter`, `useSearchParams` 훅 사용
- `router.push('?id=' + product.id)` 로 URL 업데이트
- `searchParams.get('id')` 로 ID 읽기
- 모달 외부 클릭 감지: `useEffect`로 이벤트 리스너 등록

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 제품 클릭 시 URL이 변경되는지 확인
2. URL 직접 입력 시 모달이 표시되는지 확인
3. 모달 닫기 시 URL이 초기화되는지 확인
4. 브라우저 뒤로가기 버튼으로 모달 닫기 테스트

---

### 문제 28: 다국어 지원 (i18n)

**난이도**: ⭐⭐
**예상 시간**: 65분
**학습 목표**: 국제화(i18n), 다국어 리소스 관리

**상황**:
글로벌 서비스를 위해 영어와 한국어를 지원해야 합니다. 언어 전환 버튼을 추가하고 모든 텍스트를 번역하세요.

**요구사항**:
1. 언어 파일 생성 (ko.json, en.json)
2. Context API로 현재 언어 상태 관리
3. 상단에 언어 전환 버튼 추가
4. 모든 UI 텍스트를 번역 키로 대체

**힌트**:
- 번역 파일 구조: `{ "product.list.title": "타겟 제품 목록", ... }`
- Context: `const { t, language, setLanguage } = useI18n()`
- 번역 함수: `t('product.list.title')`
- LocalStorage에 언어 선택 저장

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\i18n\ko.json` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\i18n\en.json` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\contexts\I18nContext.tsx` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 언어 전환 버튼 클릭
2. 모든 텍스트가 선택한 언어로 변경되는지 확인
3. 페이지 새로고침 후에도 언어 선택이 유지되는지 확인

---

### 문제 29: 권한 기반 UI (RBAC)

**난이도**: ⭐⭐
**예상 시간**: 60분
**학습 목표**: Role-Based Access Control, Context API

**상황**:
사용자 역할에 따라 특정 기능을 숨겨야 합니다. 관리자만 삭제 버튼을 볼 수 있도록 제한하세요.

**요구사항**:
1. 사용자 역할 Context 생성 (ADMIN, USER)
2. 역할에 따라 버튼 표시/숨김
3. 관리자 전용: 삭제, 수정 버튼
4. 일반 사용자: 읽기 전용

**힌트**:
- Context: `const { role } = useAuth()`
- 조건부 렌더링: `{role === 'ADMIN' && <button>삭제</button>}`
- 권한 체크 함수: `hasPermission(role, 'DELETE')`
- API에서도 권한 검증 (클라이언트 검증만으로는 불충분)

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\contexts\AuthContext.tsx` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\[id]\route.ts`

**테스트 방법**:
1. 역할을 'USER'로 설정 → 삭제 버튼 숨김 확인
2. 역할을 'ADMIN'으로 설정 → 삭제 버튼 표시 확인
3. API에 직접 DELETE 요청 시 권한 에러 확인 (USER 역할)

---

## ⭐⭐⭐ 고급 (Advanced) - 13문제

고급 문제는 **프로덕션 수준**의 코드를 요구하며, 성능, 보안, 테스트까지 고려해야 합니다.

---

### 문제 30: 트랜잭션 처리

**난이도**: ⭐⭐⭐
**예상 시간**: 70분
**학습 목표**: Prisma Transaction, ACID 속성, Rollback

**상황**:
제품 삭제 시 연관된 데이터(예: 주문 내역)도 함께 처리해야 합니다. 트랜잭션으로 원자성을 보장하세요.

**요구사항**:
1. 제품 삭제 시 연관 데이터도 함께 삭제 (or 소프트 삭제)
2. 일부 실패 시 모든 작업 롤백
3. 트랜잭션 로그 기록
4. 에러 발생 시 자세한 에러 메시지 반환

**힌트**:
- Prisma `$transaction` 사용
- `prisma.$transaction(async (tx) => { ... })`
- 배열 방식: `prisma.$transaction([query1, query2])`
- 에러 캐치 후 적절한 HTTP 상태 코드 반환

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\services\targetProduct.service.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\[id]\route.ts`

**테스트 방법**:
1. 연관 데이터가 있는 제품 삭제 시도
2. 모든 데이터가 함께 삭제되는지 확인
3. 의도적으로 에러를 발생시켜 롤백되는지 확인
4. 데이터베이스 로그 확인

---

### 문제 31: 서버 페이지네이션 (Cursor-based)

**난이도**: ⭐⭐⭐
**예상 시간**: 80분
**학습 목표**: Cursor-based Pagination, 무한 스크롤

**상황**:
클라이언트 페이지네이션은 전체 데이터를 가져와야 해서 비효율적입니다. 서버에서 페이지네이션하고 무한 스크롤을 구현하세요.

**요구사항**:
1. API에 cursor 기반 페이지네이션 구현
2. 페이지당 20개 항목 반환
3. 다음 페이지 커서 정보 포함
4. 클라이언트에서 무한 스크롤 구현

**힌트**:
- Prisma: `findMany({ take: 20, skip: 1, cursor: { id: lastId } })`
- API 응답: `{ data: [...], nextCursor: "xxx", hasMore: true }`
- 무한 스크롤: Intersection Observer API 사용
- 또는 `react-infinite-scroll-component` 라이브러리

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\route.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\services\targetProduct.service.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`

**테스트 방법**:
1. 페이지 하단까지 스크롤
2. 자동으로 다음 페이지 로드되는지 확인
3. Network 탭에서 cursor 파라미터 확인
4. 마지막 페이지에서 추가 요청이 없는지 확인

---

### 문제 32: 전체 텍스트 검색 (PostgreSQL)

**난이도**: ⭐⭐⭐
**예상 시간**: 90분
**학습 목표**: Full-Text Search, to_tsvector, GIN 인덱스

**상황**:
`LIKE '%keyword%'` 검색은 느리고 부정확합니다. PostgreSQL의 전체 텍스트 검색 기능을 활용해 고급 검색을 구현하세요.

**요구사항**:
1. Prisma에서 Raw Query로 `to_tsvector`, `to_tsquery` 사용
2. GIN 인덱스 추가 (마이그레이션)
3. 한글 검색 지원 (pg_trgm extension)
4. 검색 결과 관련도 순으로 정렬

**힌트**:
- Migration: `CREATE INDEX idx_fts ON target_products USING GIN (to_tsvector('korean', product_name));`
- Raw Query: `prisma.$queryRaw`SELECT * FROM target_products WHERE to_tsvector('korean', product_name) @@ to_tsquery('korean', ${search})`
- pg_trgm 활성화: `CREATE EXTENSION pg_trgm;`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\prisma\migrations\XXX_fulltext_search\migration.sql` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\services\targetProduct.service.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\route.ts`

**테스트 방법**:
1. 한글 키워드로 검색 (예: "타겟")
2. 부분 일치, 유사 단어도 검색되는지 확인
3. 검색 속도 측정 (EXPLAIN ANALYZE)
4. 1000개 이상 데이터에서 성능 비교

---

### 문제 33: 배치 Import (CSV)

**난이도**: ⭐⭐⭐
**예상 시간**: 85분
**학습 목표**: 파일 업로드, CSV 파싱, 배치 처리

**상황**:
기존 시스템에서 수백 개의 제품 데이터를 마이그레이션해야 합니다. CSV 파일 업로드로 일괄 등록하세요.

**요구사항**:
1. CSV 파일 업로드 UI (드래그 앤 드롭)
2. CSV 파싱 및 유효성 검사
3. 중복 데이터 처리 (skip 또는 update)
4. 진행 상태 표시 (프로그레스 바)
5. 에러 로그 다운로드

**힌트**:
- `papaparse` 라이브러리로 CSV 파싱
- 파일 업로드: `<input type="file" accept=".csv" />`
- 배치 처리: `createMany({ data: [...], skipDuplicates: true })`
- 진행률: `Math.round((processed / total) * 100)`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\ImportCSV.tsx` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\import\route.ts` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\services\targetProduct.service.ts`

**테스트 방법**:
1. 샘플 CSV 파일 작성 (100개 행)
2. 파일 업로드 후 처리 진행 확인
3. 중복 데이터 포함 시 처리 확인
4. 에러 로그 다운로드 및 내용 확인

---

### 문제 34: Audit Log (변경 이력)

**난이도**: ⭐⭐⭐
**예상 시간**: 90분
**학습 목표**: Prisma Middleware, 변경 추적, 히스토리 테이블

**상황**:
누가, 언제, 무엇을 변경했는지 추적해야 합니다. Audit Log를 자동으로 기록하세요.

**요구사항**:
1. AuditLog 테이블 생성 (Prisma 스키마)
2. Prisma Middleware로 CUD 작업 자동 기록
3. 변경 전/후 데이터 저장 (JSON)
4. 관리자 페이지에서 로그 조회

**힌트**:
- Prisma Middleware: `prisma.$use(async (params, next) => { ... })`
- AuditLog 스키마: `{ user_id, action, table_name, record_id, old_data, new_data, created_at }`
- 변경 감지: `params.action === 'update'` 일 때 이전 데이터 조회
- JSON 필드: Prisma의 `Json` 타입 사용

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\prisma\schema.prisma`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\prisma.ts` (middleware 추가)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\audit-logs\route.ts` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\trm\audit-logs\page.tsx` (새 파일)

**테스트 방법**:
1. 제품 생성/수정/삭제 수행
2. AuditLog 테이블에 기록되는지 확인
3. 관리자 페이지에서 로그 조회
4. 변경 전/후 데이터가 정확한지 확인

---

### 문제 35: 실시간 협업 (Server-Sent Events)

**난이도**: ⭐⭐⭐
**예상 시간**: 100분
**학습 목표**: Server-Sent Events, 실시간 업데이트, 동시 편집

**상황**:
여러 사용자가 동시에 목록을 보고 있을 때, 다른 사용자의 변경사항을 실시간으로 반영해야 합니다.

**요구사항**:
1. SSE 엔드포인트 생성 (`/api/target-products/events`)
2. 데이터 변경 시 모든 연결된 클라이언트에게 알림
3. 클라이언트에서 SSE 구독 및 자동 업데이트
4. 연결 끊김 시 재연결 로직

**힌트**:
- SSE API Route: `new ReadableStream()`으로 스트림 생성
- 클라이언트: `new EventSource('/api/target-products/events')`
- 이벤트 리스너: `eventSource.addEventListener('update', (e) => { ... })`
- 재연결: `eventSource.onerror` 핸들러

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\events\route.ts` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductList.tsx`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\services\targetProduct.service.ts`

**테스트 방법**:
1. 두 개의 브라우저 탭에서 목록 페이지 열기
2. 한 탭에서 제품 추가/수정/삭제
3. 다른 탭에서 즉시 반영되는지 확인
4. 네트워크 끊김 후 재연결 테스트

---

### 문제 36: Zod 스키마 검증

**난이도**: ⭐⭐⭐
**예상 시간**: 75분
**학습 목표**: Zod 라이브러리, 런타임 타입 체크, 에러 포맷팅

**상황**:
TypeScript는 컴파일 타임에만 타입을 체크합니다. 런타임에도 API 요청을 검증해 안전성을 확보하세요.

**요구사항**:
1. Zod 스키마 정의 (TargetProductSchema)
2. API Route에서 요청 body 검증
3. 검증 실패 시 상세한 에러 메시지 반환
4. 클라이언트 폼에도 Zod 검증 적용

**힌트**:
- Zod 스키마: `z.object({ product_name: z.string().min(2).max(50), ... })`
- 검증: `TargetProductSchema.parse(body)`
- 에러 처리: `catch (error) { if (error instanceof z.ZodError) { ... } }`
- 에러 포맷: `error.flatten().fieldErrors`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\validations\targetProduct.schema.ts` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\route.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\components\trm\target-products\TargetProductForm.tsx`

**테스트 방법**:
1. Postman으로 잘못된 데이터 전송
2. 상세한 필드별 에러 메시지 확인
3. 클라이언트 폼에서도 같은 검증 규칙 적용 확인

---

### 문제 37: 인덱스 최적화

**난이도**: ⭐⭐⭐
**예상 시간**: 85분
**학습 목표**: 데이터베이스 인덱스, 쿼리 성능 분석

**상황**:
데이터가 많아지면서 검색과 정렬이 느려집니다. 적절한 인덱스를 추가해 성능을 최적화하세요.

**요구사항**:
1. 자주 사용되는 쿼리 패턴 분석
2. 필요한 인덱스 추가 (Prisma 스키마)
3. Composite Index와 Single Column Index 비교
4. EXPLAIN ANALYZE로 성능 측정

**힌트**:
- Prisma 인덱스: `@@index([product_group, product_name])`
- 마이그레이션 후 쿼리 플랜 확인
- PostgreSQL: `EXPLAIN (ANALYZE, BUFFERS) SELECT ...`
- 인덱스 크기 확인: `pg_size_pretty(pg_relation_size('index_name'))`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\prisma\schema.prisma`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\docs\performance-analysis.md` (새 파일, 분석 결과)

**테스트 방법**:
1. Seed 스크립트로 10,000개 제품 생성
2. 인덱스 추가 전 쿼리 시간 측정
3. 인덱스 추가 후 쿼리 시간 측정
4. 개선 비율 문서화

---

### 문제 38: 소프트 삭제 (Soft Delete)

**난이도**: ⭐⭐⭐
**예상 시간**: 70분
**학습 목표**: Soft Delete 패턴, 데이터 복구, Global Filter

**상황**:
실수로 삭제된 데이터를 복구해야 할 때가 있습니다. 물리적 삭제 대신 소프트 삭제를 구현하세요.

**요구사항**:
1. `deleted_at` 필드 추가 (DateTime?, nullable)
2. 삭제 시 `deleted_at`에 현재 시간 설정
3. 기본 쿼리에서 삭제된 항목 제외
4. 관리자 페이지에서 삭제된 항목 조회 및 복구

**힌트**:
- Prisma Middleware로 자동 필터링: `if (params.action === 'findMany') { params.args.where.deleted_at = null }`
- 삭제: `update({ where: { id }, data: { deleted_at: new Date() } })`
- 복구: `update({ where: { id }, data: { deleted_at: null } })`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\prisma\schema.prisma`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\prisma.ts` (middleware)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\[id]\route.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\trm\target-products\trash\page.tsx` (새 파일)

**테스트 방법**:
1. 제품 삭제 → 목록에서 사라지는지 확인
2. 데이터베이스에서 `deleted_at` 필드 확인
3. Trash 페이지에서 삭제된 항목 조회
4. 복구 버튼으로 항목 복구 테스트

---

### 문제 39: 통계 대시보드 (집계 쿼리)

**난이도**: ⭐⭐⭐
**예상 시간**: 80분
**학습 목표**: Prisma 집계 함수, 데이터 시각화

**상황**:
경영진이 타겟 제품 데이터의 통계를 시각적으로 보고 싶어 합니다. 대시보드를 만드세요.

**요구사항**:
1. 제품군별 제품 수 차트 (막대 그래프)
2. 월별 신규 제품 추이 (선 그래프)
3. 활성/비활성 비율 (파이 차트)
4. 평균 순서 값, 최대/최소 순서 값

**힌트**:
- Prisma 집계: `groupBy({ by: ['product_group'], _count: true })`
- 날짜별 집계: SQL의 `DATE_TRUNC` 사용 (Raw Query)
- 차트 라이브러리: `recharts` 또는 `chart.js`
- 캐싱으로 성능 최적화

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\api\target-products\stats\route.ts` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\services\targetProduct.service.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\app\trm\target-products\dashboard\page.tsx` (새 파일)

**테스트 방법**:
1. 대시보드 페이지 접속
2. 모든 차트가 올바르게 렌더링되는지 확인
3. 데이터 변경 후 통계 업데이트 확인

---

### 문제 40: Rate Limiting (속도 제한)

**난이도**: ⭐⭐⭐
**예상 시간**: 75분
**학습 목표**: API 보호, Redis 캐싱, Middleware

**상황**:
API 남용을 방지하기 위해 요청 횟수를 제한해야 합니다. IP 기반 속도 제한을 구현하세요.

**요구사항**:
1. 분당 최대 100회 요청 허용
2. 초과 시 429 상태 코드 반환
3. Redis로 카운터 관리
4. Rate Limit 헤더 응답에 포함

**힌트**:
- Redis: `INCR key` + `EXPIRE key 60`
- IP 추출: `request.headers.get('x-forwarded-for')` 또는 `request.ip`
- 응답 헤더: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Next.js Middleware로 전역 적용

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\rateLimit.ts` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\middleware.ts`
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\package.json` (ioredis dependency)

**테스트 방법**:
1. 스크립트로 API에 연속 요청
2. 100회 초과 시 429 에러 확인
3. 1분 후 다시 요청 가능한지 확인
4. 응답 헤더에 Rate Limit 정보 확인

---

### 문제 41: 단위 테스트 (Jest)

**난이도**: ⭐⭐⭐
**예상 시간**: 90분
**학습 목표**: Jest, 테스트 작성, Mocking

**상황**:
코드 변경 시 기존 기능이 깨지지 않았는지 확인해야 합니다. 단위 테스트를 작성하세요.

**요구사항**:
1. Service Layer 함수에 대한 테스트 작성
2. Prisma Client Mocking
3. 성공/실패 케이스 모두 테스트
4. 커버리지 80% 이상

**힌트**:
- Jest 설정: `jest.config.js`
- Prisma Mock: `jest-mock-extended` 라이브러리
- 테스트 파일: `targetProduct.service.test.ts`
- 실행: `npm test`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\jest.config.js` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\src\lib\services\targetProduct.service.test.ts` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\package.json` (test script)

**테스트 방법**:
1. `npm test` 실행
2. 모든 테스트 통과 확인
3. `npm test -- --coverage` 로 커버리지 확인
4. 의도적으로 코드를 깨뜨려 테스트 실패 확인

---

### 문제 42: E2E 테스트 (Playwright)

**난이도**: ⭐⭐⭐
**예상 시간**: 100분
**학습 목표**: E2E 테스트, Playwright, 자동화

**상황**:
사용자 시나리오를 자동으로 테스트해 배포 전에 버그를 찾아야 합니다. E2E 테스트를 작성하세요.

**요구사항**:
1. Playwright 설정
2. 주요 시나리오 테스트:
   - 제품 등록
   - 제품 수정
   - 제품 삭제
   - 검색 및 필터링
3. 스크린샷 캡처 (실패 시)
4. CI/CD 파이프라인에 통합 가능

**힌트**:
- Playwright 설치: `npm init playwright@latest`
- 테스트 파일: `tests/target-products.spec.ts`
- 페이지 객체 패턴 사용
- 실행: `npx playwright test`

**수정할 파일**:
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\playwright.config.ts` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\tests\target-products.spec.ts` (새 파일)
- [ ] `C:\Users\jooladen\Desktop\nextjs-trm-crud-testdb\package.json` (test:e2e script)

**테스트 방법**:
1. `npx playwright test` 실행
2. 모든 테스트 통과 확인
3. `npx playwright test --ui` 로 UI 모드 실행
4. 실패 시 스크린샷 확인

---

## 📚 부록

### A. 문제별 학습 맵

| 문제 번호 | 핵심 개념 | Next.js | React | Prisma | TypeScript | 기타 |
|----------|----------|---------|-------|--------|-----------|------|
| 1 | DataTable, Cell Renderer | | ✓ | | | |
| 2 | Date 포맷팅 | | ✓ | | | |
| 3 | 조건부 렌더링, UX | | ✓ | | | |
| 4 | 폼 유효성 검사 | | ✓ | | | |
| 5 | Array.sort() | | ✓ | | | |
| 6 | filter(), includes() | | ✓ | | | |
| 7 | 로딩 상태 | | ✓ | | | |
| 8 | 에러 UI | | ✓ | | | |
| 9 | 데이터 집계 | | ✓ | | | |
| 10 | 모달 상태 관리 | | ✓ | | | |
| 11 | 필드별 에러 | | ✓ | | | |
| 12 | 타입 가드 | | | | ✓ | |
| 13 | Toast 알림 | | ✓ | | | |
| 14 | 클라이언트 페이지네이션 | | ✓ | | | |
| 15 | 전체 스택 변경 | ✓ | ✓ | ✓ | | |
| 16 | 배치 API | ✓ | ✓ | ✓ | | |
| 17 | 복합 필터링 | | ✓ | | | |
| 18 | 쿼리 파라미터 | ✓ | | ✓ | | |
| 19 | Composite Key | | | ✓ | | |
| 20 | select vs include | | | ✓ | | |
| 21 | Optimistic Updates | | ✓ | | | |
| 22 | 재귀 컴포넌트 | | ✓ | ✓ | | |
| 23 | Drag and Drop | | ✓ | | | |
| 24 | 캐싱 전략 | ✓ | | | | |
| 25 | Optimistic Locking | | | ✓ | | |
| 26 | Virtual Scrolling | | ✓ | | | |
| 27 | URL 상태 관리 | ✓ | ✓ | | | |
| 28 | i18n | | ✓ | | | |
| 29 | RBAC | | ✓ | | | |
| 30 | Transaction | | | ✓ | | |
| 31 | Cursor Pagination | ✓ | ✓ | ✓ | | |
| 32 | Full-Text Search | | | ✓ | | PostgreSQL |
| 33 | CSV Import | ✓ | ✓ | ✓ | | |
| 34 | Audit Log | | | ✓ | | Middleware |
| 35 | Server-Sent Events | ✓ | ✓ | | | |
| 36 | Zod 검증 | ✓ | ✓ | | | Zod |
| 37 | 인덱스 최적화 | | | ✓ | | PostgreSQL |
| 38 | Soft Delete | | | ✓ | | |
| 39 | 집계 쿼리 | | ✓ | ✓ | | Charts |
| 40 | Rate Limiting | ✓ | | | | Redis |
| 41 | 단위 테스트 | | | | | Jest |
| 42 | E2E 테스트 | ✓ | | | | Playwright |

### B. 핵심 파일 가이드

#### 1. `TargetProductList.tsx` (클라이언트 컴포넌트)
- **역할**: 타겟 제품 목록 표시 및 상태 관리
- **주요 기능**:
  - 목록 렌더링 (DataTable)
  - 검색, 필터링, 정렬
  - 낙관적 업데이트
  - 에러 및 로딩 상태 관리
- **자주 수정하는 이유**: UI 개선, 인터랙션 추가

#### 2. `TargetProductForm.tsx` (클라이언트 컴포넌트)
- **역할**: 타겟 제품 등록/수정 폼
- **주요 기능**:
  - 폼 입력 필드
  - 클라이언트 유효성 검사
  - API 호출
  - 에러 메시지 표시
- **자주 수정하는 이유**: 새 필드 추가, 검증 규칙 변경

#### 3. `targetProduct.service.ts` (Service Layer)
- **역할**: 비즈니스 로직 및 Prisma 쿼리
- **주요 기능**:
  - CRUD 작업
  - 복잡한 쿼리 (필터링, 집계)
  - 트랜잭션 처리
- **자주 수정하는 이유**: 새 쿼리 추가, 최적화

#### 4. `route.ts` (API Routes)
- **역할**: HTTP 요청 처리
- **주요 기능**:
  - GET, POST, PUT, DELETE 핸들러
  - 요청 검증
  - 에러 응답
- **자주 수정하는 이유**: 새 엔드포인트 추가, 검증 로직 변경

#### 5. `schema.prisma` (데이터베이스 스키마)
- **역할**: 데이터 모델 정의
- **주요 기능**:
  - 테이블 구조
  - 관계 정의
  - 인덱스 설정
- **자주 수정하는 이유**: 새 필드 추가, 관계 변경, 성능 최적화

### C. 디버깅 팁

#### 자주 하는 실수와 해결법

1. **Prisma Client가 업데이트되지 않음**
   - 증상: 새로 추가한 필드가 타입에 없음
   - 해결: `npx prisma generate` 실행

2. **낙관적 업데이트 후 롤백 안됨**
   - 증상: API 실패 시 이전 상태로 돌아가지 않음
   - 해결: try-catch에서 `setProducts(previousProducts)` 확인

3. **무한 루프 (useEffect)**
   - 증상: 컴포넌트가 계속 리렌더링됨
   - 해결: useEffect 의존성 배열 확인, 함수는 useCallback으로 감싸기

4. **CORS 에러**
   - 증상: API 호출 시 CORS 에러
   - 해결: Next.js API Route는 같은 도메인이므로 CORS 불필요. 외부 API 호출 시만 필요

5. **TypeScript 타입 에러**
   - 증상: `Type 'X' is not assignable to type 'Y'`
   - 해결: Prisma 타입을 import하거나 `as` 사용. 타입 가드 활용

6. **Prisma 쿼리가 느림**
   - 증상: 데이터 로딩에 시간이 오래 걸림
   - 해결: `include` 대신 `select` 사용, 인덱스 추가, N+1 쿼리 확인

7. **Hydration 에러**
   - 증상: `Text content does not match server-rendered HTML`
   - 해결: Server Component와 Client Component 구분, localStorage 사용 시 `useEffect` 안에서

### D. 참고 자료

#### 공식 문서
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [Prisma ORM](https://www.prisma.io/docs)
- [React 공식 문서](https://react.dev/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS](https://tailwindcss.com/docs)

#### 유용한 라이브러리
- [Zod](https://zod.dev/) - 스키마 검증
- [React Hook Form](https://react-hook-form.com/) - 폼 관리
- [Recharts](https://recharts.org/) - 데이터 시각화
- [Lucide React](https://lucide.dev/) - 아이콘
- [date-fns](https://date-fns.org/) - 날짜 포맷팅

#### 학습 리소스
- [Next.js Learn](https://nextjs.org/learn) - 공식 튜토리얼
- [Prisma Examples](https://github.com/prisma/prisma-examples) - 예제 코드
- [React Patterns](https://reactpatterns.com/) - 디자인 패턴

---

## 🎓 학습 완료 후 다음 단계

이 문제집을 모두 완료했다면, 다음 단계로 넘어가세요:

1. **자신만의 프로젝트 시작**
   - 배운 패턴을 적용해 새로운 CRUD 애플리케이션 구축
   - 다른 도메인(예: Todo, Blog, E-commerce)으로 확장

2. **고급 주제 학습**
   - GraphQL (Apollo Client, Relay)
   - Microservices Architecture
   - Event-Driven Architecture
   - Kubernetes, Docker

3. **오픈소스 기여**
   - Next.js, Prisma 등의 이슈 해결
   - 문서 번역 및 개선

4. **팀 프로젝트 참여**
   - 실무 경험 쌓기
   - 코드 리뷰 받기

---

**마지막 업데이트**: 2024-01-27
**버전**: 1.0.0
**저자**: Claude Code Agent
**라이센스**: MIT

🎉 **행운을 빕니다! Happy Coding!** 🚀
