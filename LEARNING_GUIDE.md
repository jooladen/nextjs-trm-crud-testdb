# 타켓제품 소스코드 학습 가이드

## 📚 목차
1. [초등학생도 이해하는 타켓제품 따라가기](#1-초등학생도-이해하는-타켓제품-따라가기)
2. [설계 선택의 히스토리 - 왜 이렇게 만들었을까?](#2-설계-선택의-히스토리---왜-이렇게-만들었을까)
3. [필수 사전지식](#3-필수-사전지식)
4. [학습 로드맵 및 제안사항](#4-학습-로드맵-및-제안사항)

---

## 1. 초등학생도 이해하는 타켓제품 따라가기

### 🎯 단계별 코드 읽기 순서

타켓제품을 이해하기 위해 **이 순서대로** 파일을 읽으세요:

#### **Step 1: 데이터베이스 스키마 이해 (설계도 보기)**
📁 `prisma/schema.prisma` (30줄 정도)

```
타켓제품 테이블
├─ target_product_id (번호표)
├─ target_product_line_id (어떤 제품군인지)
├─ target_product_name (제품 이름)
└─ deployment_date (언제 배치했는지)
```

**비유**: 학생 명단을 만든다고 생각해보세요
- 학생 번호 (target_product_id)
- 학년/반 (target_product_line_id)
- 이름 (target_product_name)
- 입학일 (deployment_date)

#### **Step 2: 타입 정의 이해 (약속된 규칙)**
📁 `src/lib/types/targetProduct.types.ts` (50줄)

```typescript
// 새 제품 만들 때 필요한 정보
CreateTargetProductDto = {
  제품군 ID,
  제품 이름,
  배치 날짜
}

// 화면에 보여줄 때 형태
TargetProductResponseDto = {
  제품 ID,
  제품 이름,
  배치 날짜,
  제품군 정보 (division, product_line)
}
```

**비유**: 편지 봉투에 쓸 주소 형식을 정해놓은 것

#### **Step 3: 서비스 레이어 (실제 일 처리하는 곳)**
📁 `src/lib/services/targetProduct.service.ts` (200줄)

**5가지 주요 기능:**
1. `findAll()` → 모든 제품 가져오기 (목록 보기)
2. `findById(id)` → 특정 제품 1개 가져오기 (상세 보기)
3. `create(data)` → 새 제품 만들기 (등록)
4. `update(id, data)` → 제품 수정하기 (수정)
5. `delete(id)` → 제품 삭제하기 (삭제)

**비유**: 도서관 사서
- 책 전체 목록 보여주기
- 특정 책 찾아주기
- 새 책 등록하기
- 책 정보 수정하기
- 책 폐기하기

**주목할 점:**
```typescript
// ✅ 좋은 예: 에러 처리
async findById(id: number) {
  const product = await prisma.findUnique({ where: { id } });
  if (!product) {
    throw new NotFoundError('제품을 찾을 수 없습니다');
  }
  return product;
}
```

#### **Step 4: API 라우트 (외부에서 요청 받는 창구)**
📁 `src/app/api/target-products/route.ts` (GET, POST)
📁 `src/app/api/target-products/[id]/route.ts` (GET, PUT, DELETE)

**REST API 패턴:**
```
GET    /api/target-products      → 목록 조회
POST   /api/target-products      → 신규 생성
GET    /api/target-products/123  → 단건 조회
PUT    /api/target-products/123  → 수정
DELETE /api/target-products/123  → 삭제
```

**비유**: 은행 창구
- 계좌 목록 조회 (GET)
- 계좌 개설 (POST)
- 계좌 정보 조회 (GET by ID)
- 계좌 정보 변경 (PUT)
- 계좌 해지 (DELETE)

**코드 읽는 방법:**
```typescript
export async function POST(request: NextRequest) {
  // 1. 요청 데이터 받기
  const body = await request.json();

  // 2. 필수 필드 검증
  if (!body.target_product_line_id) {
    return badRequestResponse('제품군을 선택해주세요');
  }

  // 3. Service에게 일 시키기
  const product = await targetProductService.create(dto);

  // 4. 성공 응답 보내기
  return createdResponse(product);
}
```

#### **Step 5: 페이지 컴포넌트 (화면)**

**5-1. 목록 페이지 (Server Component)**
📁 `src/app/trm/target-products/page.tsx` (30줄)

```typescript
// 서버에서 실행 (Node.js)
export default async function TargetProductsPage() {
  // 1. API 호출해서 데이터 가져오기
  const products = await serverFetch('/api/target-products');

  // 2. Client Component에 전달
  return <TargetProductList initialData={products} />;
}
```

**비유**: 요리 재료 준비하는 주방 (서버)

**5-2. 목록 컴포넌트 (Client Component)**
📁 `src/components/trm/target-products/TargetProductList.tsx` (100줄)

```typescript
'use client'; // 브라우저에서 실행

export default function TargetProductList({ initialData }) {
  // 1. 상태 관리 (React의 useState)
  const [products, setProducts] = useState(initialData);

  // 2. 삭제 기능
  const { handleDelete } = useOptimisticDelete({...});

  // 3. 테이블 컬럼 정의
  const columns = [
    { key: 'target_product_id', label: 'ID' },
    { key: 'target_product_name', label: '제품명' },
    ...
  ];

  // 4. 액션 버튼 정의
  const actions = [
    { label: '보기', href: ... },
    { label: '수정', href: ... },
    { label: '삭제', onClick: handleDelete },
  ];

  // 5. DataTable에 전달
  return <DataTable columns={columns} data={products} actions={actions} />;
}
```

**비유**: 손님에게 음식 서빙하는 홀 (클라이언트)

#### **Step 6: 폼 컴포넌트 (생성/수정)**
📁 `src/components/trm/target-products/TargetProductForm.tsx` (200줄)

```typescript
export default function TargetProductForm({ mode, initialData }) {
  // 1. 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    target_product_line_id: initialData?.target_product_line_id || '',
    target_product_name: initialData?.target_product_name || '',
    deployment_date: initialData?.deployment_date || '',
  });

  // 2. 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 3. 유효성 검사
    if (!formData.target_product_name.trim()) {
      throw new Error('제품명을 입력해주세요');
    }

    // 4. API 호출
    const url = mode === 'create'
      ? '/api/target-products'
      : `/api/target-products/${id}`;

    const method = mode === 'create' ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method,
      body: JSON.stringify(formData),
    });

    // 5. 성공 시 목록 페이지로 이동
    router.push('/trm/target-products');
  };

  return (
    <form onSubmit={handleSubmit}>
      <SelectField label="제품군" ... />
      <input type="text" placeholder="제품명" ... />
      <input type="date" ... />
      <button type="submit">저장</button>
    </form>
  );
}
```

---

### 🔄 완전한 데이터 흐름 따라가기

#### **시나리오 1: 목록 보기**

```
1. 브라우저에 /trm/target-products 입력
   ↓
2. Next.js 서버가 page.tsx 실행 (Server Component)
   ↓
3. serverFetch로 자기 자신의 API 호출
   GET http://localhost:3001/api/target-products
   ↓
4. API Route (route.ts)가 요청 받음
   ↓
5. targetProductService.findAll() 호출
   ↓
6. Prisma가 PostgreSQL에 쿼리
   SELECT * FROM Target_product ...
   ↓
7. DB가 데이터 반환
   ↓
8. Service가 DTO로 변환 (Date → String)
   ↓
9. API Route가 { success: true, data: [...] } 응답
   ↓
10. page.tsx가 응답 받음
   ↓
11. TargetProductList에 initialData 전달
   ↓
12. 브라우저에 HTML 전송 (이미 데이터 포함)
   ↓
13. 사용자가 테이블 확인 ✅
```

**비유**: 도서관에서 책 목록 요청
```
사용자 → 사서 → 서고 확인 → 목록 작성 → 사용자에게 전달
```

#### **시나리오 2: 새 제품 등록**

```
1. "새 제품 등록" 버튼 클릭
   ↓
2. /trm/target-products/new 페이지 이동
   ↓
3. TargetProductForm (mode="create") 렌더링
   ↓
4. SelectField가 제품군 목록 fetch
   GET /api/reference-data/product-lines
   ↓
5. 드롭다운에 제품군 표시
   ↓
6. 사용자가 폼 입력
   - 제품군: "가전 - TV"
   - 제품명: "2024 OLED TV"
   - 배치일: "2024-03-15"
   ↓
7. "저장" 버튼 클릭
   ↓
8. handleSubmit 실행
   ↓
9. POST /api/target-products 호출
   Body: { target_product_line_id: 1, ... }
   ↓
10. API Route가 요청 받음
   ↓
11. 필수 필드 검증
   ↓
12. targetProductService.create() 호출
   ↓
13. 외래키 검증 (제품군 ID 존재 여부)
   ↓
14. Prisma INSERT 쿼리
   ↓
15. DB에 저장 완료
   ↓
16. { success: true, data: {...} } 응답
   ↓
17. Form에서 router.push('/trm/target-products')
   ↓
18. 목록 페이지로 이동 (새 데이터 포함) ✅
```

**비유**: 도서관에 새 책 등록
```
책 정보 작성 → 사서에게 제출 → 사서가 검증 → 서고에 배치 → 목록에 추가
```

#### **시나리오 3: 제품 삭제 (낙관적 업데이트)**

```
1. 목록에서 "삭제" 버튼 클릭
   ↓
2. confirm("2024 OLED TV를 삭제하시겠습니까?")
   ↓
3. 사용자 확인
   ↓
4. [즉시 실행] setProducts(prev => prev.filter(p => p.id !== 123))
   → 화면에서 해당 행이 즉시 사라짐 ⚡
   ↓
5. [백그라운드] DELETE /api/target-products/123 호출
   ↓
6. API Route가 요청 받음
   ↓
7. targetProductService.delete(123) 호출
   ↓
8. Prisma DELETE 쿼리
   ↓
9. DB에서 삭제 완료
   ↓
10. { success: true } 응답
   ↓
11. [성공 시] 낙관적 업데이트 그대로 유지 ✅
    [실패 시] router.refresh()로 실제 데이터 다시 불러오기
```

**비유**: 장바구니에서 상품 삭제
```
즉시 화면에서 제거 → 동시에 서버에 알림 → 실제로 삭제됨
(실패하면 다시 복구)
```

---

## 2. 설계 선택의 히스토리 - 왜 이렇게 만들었을까?

### 🤔 선택 1: Server Component vs Client Component 분리

#### ❌ 간단하게 만들면 (옛날 방식)
```typescript
// 모든 걸 Client Component로 (useEffect 사용)
'use client';

export default function TargetProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/target-products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return <div>{products.map(...)}</div>;
}
```

**문제점:**
1. **SEO 불가능**: 검색 엔진이 "로딩 중..." 텍스트만 봄
2. **느린 초기 로딩**: JS 다운로드 → 실행 → API 호출 → 렌더링 (4단계)
3. **깜빡임**: 빈 화면 → 로딩 스피너 → 데이터 표시

#### ✅ 현재 방식 (Next.js 15 App Router)
```typescript
// page.tsx (Server Component - 서버에서 실행)
export default async function TargetProductsPage() {
  const products = await serverFetch('/api/target-products');
  return <TargetProductList initialData={products} />;
}

// TargetProductList.tsx (Client Component - 브라우저에서 실행)
'use client';
export default function TargetProductList({ initialData }) {
  const [products, setProducts] = useState(initialData);
  // 인터랙션 처리
}
```

**장점:**
1. **SEO 가능**: HTML에 이미 데이터가 포함되어 전송됨
2. **빠른 초기 로딩**: 서버에서 데이터 준비 완료 후 전송 (1단계)
3. **깜빡임 없음**: 첫 화면부터 데이터 표시
4. **하이드레이션**: 클라이언트에서 인터랙티브하게 변함

**역사적 배경:**
- 2020년 이전: Create React App (CSR - Client Side Rendering)
- 2020-2023: Next.js 12 Pages Router (SSR + CSR 혼용)
- 2023년 이후: Next.js 13+ App Router (RSC - React Server Components)

---

### 🤔 선택 2: Service Layer 도입

#### ❌ 간단하게 만들면
```typescript
// API Route에서 직접 Prisma 호출
export async function GET() {
  const products = await prisma.target_product.findMany({
    include: { productLine: true },
  });
  return successResponse(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = await prisma.target_product.create({
    data: body,
  });
  return createdResponse(product);
}
```

**문제점:**
1. **중복 코드**: 여러 곳에서 같은 Prisma 쿼리 반복
2. **테스트 어려움**: API Route 전체를 테스트해야 함
3. **비즈니스 로직 분산**: 검증, 변환 로직이 여기저기 흩어짐
4. **재사용 불가**: Server Component에서 직접 사용 불가

#### ✅ 현재 방식 (Service Layer)
```typescript
// targetProduct.service.ts
class TargetProductService {
  async findAll() {
    const products = await prisma.target_product.findMany({
      include: { productLine: true },
    });
    return products.map(this.toListDto);
  }

  async create(dto: CreateTargetProductDto) {
    // 외래키 검증
    await this.validateProductLine(dto.target_product_line_id);

    // 생성
    const product = await prisma.target_product.create({
      data: dto,
    });

    return this.toResponseDto(product);
  }
}

// API Route에서 사용
export async function GET() {
  const products = await targetProductService.findAll();
  return successResponse(products);
}

// Server Component에서도 사용
export default async function Page() {
  const products = await targetProductService.findAll();
  return <List products={products} />;
}
```

**장점:**
1. **재사용 가능**: API Route, Server Component 모두에서 사용
2. **테스트 용이**: Service만 독립적으로 테스트
3. **로직 집중화**: 검증, 변환 로직이 한 곳에 모임
4. **유지보수 쉬움**: 비즈니스 규칙 변경 시 한 곳만 수정

**실제 활용:**
```typescript
// src/app/page.tsx (메인 페이지)
const products = await targetProductService.findAll();

// src/app/api/target-products/route.ts (API)
const products = await targetProductService.findAll();

// 두 곳에서 같은 로직 사용 ✅
```

---

### 🤔 선택 3: 낙관적 업데이트 (Optimistic Update)

#### ❌ 간단하게 만들면
```typescript
const handleDelete = async (product) => {
  if (!confirm('삭제하시겠습니까?')) return;

  setLoading(true); // 로딩 표시

  await fetch(`/api/target-products/${product.id}`, {
    method: 'DELETE',
  });

  setLoading(false);

  // 서버에서 다시 전체 목록 불러오기
  const response = await fetch('/api/target-products');
  const data = await response.json();
  setProducts(data);
};
```

**문제점:**
1. **느린 반응**: 서버 응답 기다림 (보통 500ms~2s)
2. **네트워크 2번**: DELETE + GET (비효율적)
3. **UX 나쁨**: 삭제 → 로딩 → 화면 갱신 (사용자 대기)

#### ✅ 현재 방식 (낙관적 업데이트)
```typescript
const handleDelete = async (product) => {
  if (!confirm('삭제하시겠습니까?')) return;

  // 1. 즉시 UI 업데이트 (낙관적)
  setProducts(prev => prev.filter(p => p.id !== product.id));

  try {
    // 2. 백그라운드에서 서버 호출
    await fetch(`/api/target-products/${product.id}`, {
      method: 'DELETE',
    });

    // 3. 성공 시: 그대로 유지
    alert('삭제되었습니다');
  } catch (error) {
    // 4. 실패 시: 롤백
    router.refresh(); // 실제 데이터 다시 불러오기
    alert('삭제에 실패했습니다');
  }
};
```

**장점:**
1. **즉각적인 반응**: 클릭 → 즉시 화면에서 사라짐 (0ms)
2. **네트워크 1번**: DELETE만 호출
3. **UX 좋음**: 앱이 빠르게 느껴짐
4. **안전성**: 실패 시 자동 복구

**실제 체감:**
```
❌ 옛날 방식: 클릭 → [2초 대기] → 삭제됨
✅ 현재 방식: 클릭 → [즉시 삭제] → 백그라운드 처리
```

**주의사항:**
- 네트워크 실패 확률이 높은 경우 적합하지 않음
- 중요한 금융 거래 등에는 신중하게 적용

---

### 🤔 선택 4: DTO (Data Transfer Object) 패턴

#### ❌ 간단하게 만들면
```typescript
// 그냥 Prisma 모델 그대로 사용
export async function GET() {
  const products = await prisma.target_product.findMany();
  return successResponse(products); // Date 객체 포함
}

// Client에서 받을 때
const products = await fetch('/api/target-products').then(r => r.json());
console.log(products[0].deployment_date); // "2024-03-15T00:00:00.000Z" (문자열)
console.log(typeof products[0].deployment_date); // "string" 😱
```

**문제점:**
1. **타입 불일치**: DB는 Date, JSON은 String
2. **불필요한 필드 노출**: DB 내부 필드까지 전송
3. **관계 데이터 일관성 없음**: include 여부에 따라 구조 변경
4. **타입 안정성 부족**: any 타입 남발

#### ✅ 현재 방식 (DTO)
```typescript
// targetProduct.types.ts
export interface TargetProductListItemDto {
  target_product_id: number;
  target_product_name: string;
  deployment_date: string; // ISO 문자열로 명시
  productLine: {
    target_division: string;
    target_product_line: string;
  };
}

// targetProduct.service.ts
private toListDto(product: Target_product & { productLine: Target_Product_Line }): TargetProductListItemDto {
  return {
    target_product_id: product.target_product_id,
    target_product_name: product.target_product_name,
    deployment_date: product.deployment_date.toISOString(), // Date → String 변환
    productLine: {
      target_division: product.productLine.target_division,
      target_product_line: product.productLine.target_product_line,
    },
  };
}

// API Route
export async function GET() {
  const products = await targetProductService.findAll(); // DTO 반환
  return successResponse(products);
}
```

**장점:**
1. **타입 명확성**: API 응답 구조가 코드로 문서화됨
2. **일관성**: 항상 같은 형태로 데이터 전송
3. **최적화**: 필요한 필드만 선택적 전송
4. **캡슐화**: DB 스키마 변경이 API에 영향 없음

**실제 효과:**
```typescript
// TypeScript가 자동 완성 제공
const products: TargetProductListItemDto[] = await fetch(...);
products[0]. // ← IDE가 4개 필드만 제안 ✅
```

---

### 🤔 선택 5: 라우트 상수 집중화

#### ❌ 간단하게 만들면
```typescript
// 여기저기 하드코딩
<Link href="/trm/target-products">목록</Link>
<Link href={`/trm/target-products/${id}/edit`}>수정</Link>

fetch('/api/target-products')
fetch(`/api/target-products/${id}`)
```

**문제점:**
1. **오타 위험**: `/trm/target-product` (s 빠짐) 😱
2. **변경 어려움**: URL 구조 변경 시 전체 검색 필요
3. **일관성 없음**: 같은 경로를 다르게 표현

#### ✅ 현재 방식 (ROUTES 상수)
```typescript
// src/lib/constants/routes.ts
export const ROUTES = {
  TRM: {
    TARGET_PRODUCTS: {
      LIST: '/trm/target-products',
      NEW: '/trm/target-products/new',
      EDIT: (id: number) => `/trm/target-products/${id}/edit`,
    },
  },
  API: {
    TARGET_PRODUCTS: {
      BASE: '/api/target-products',
      BY_ID: (id: number) => `/api/target-products/${id}`,
    },
  },
};

// 사용
<Link href={ROUTES.TRM.TARGET_PRODUCTS.LIST}>목록</Link>
<Link href={ROUTES.TRM.TARGET_PRODUCTS.EDIT(123)}>수정</Link>

fetch(ROUTES.API.TARGET_PRODUCTS.BASE)
fetch(ROUTES.API.TARGET_PRODUCTS.BY_ID(123))
```

**장점:**
1. **타입 안전**: TypeScript가 오타 방지
2. **자동 완성**: IDE가 경로 제안
3. **중앙 관리**: 한 곳만 수정하면 전체 반영
4. **리팩토링 용이**: "Rename Symbol" 기능 사용 가능

---

### 🤔 선택 6: Error Boundary

#### ❌ 간단하게 만들면
```typescript
// 에러 발생 시 흰 화면 or 콘솔 에러만
export default async function Page() {
  const products = await serverFetch('/api/target-products');
  // 만약 API가 실패하면? → 앱 전체 크래시 😱
  return <List products={products} />;
}
```

#### ✅ 현재 방식 (error.tsx)
```typescript
// src/app/trm/target-products/error.tsx
'use client';

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="p-6">
      <h2>데이터를 불러오는데 실패했습니다</h2>
      <p>{error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

**장점:**
1. **우아한 실패**: 앱이 완전히 죽지 않음
2. **사용자 친화적**: 에러 메시지 + 복구 버튼
3. **격리**: 해당 페이지만 영향받음

---

## 3. 필수 사전지식

### 📚 학습 로드맵 (난이도 순)

#### **레벨 1: 기초 (필수)**

**1. HTML/CSS**
- 역할: UI 구조와 스타일링
- 필요한 부분:
  - 시맨틱 태그 (`<div>`, `<form>`, `<button>`, `<input>`)
  - 클래스와 ID
  - Flexbox/Grid 기본
- 학습 시간: 1주
- 확인 방법: 간단한 로그인 폼을 HTML로 만들 수 있는가?

**2. JavaScript (ES6+)**
- 역할: 프로그래밍 로직
- 필요한 부분:
  - 변수 선언 (`const`, `let`)
  - 함수 (화살표 함수, async/await)
  - 객체와 배열 (구조분해, spread)
  - Array 메서드 (`map`, `filter`, `find`)
  - Promise와 비동기
- 학습 시간: 2주
- 확인 방법: fetch로 API 호출하고 결과를 화면에 표시할 수 있는가?

**3. TypeScript**
- 역할: 타입 안정성
- 필요한 부분:
  - 기본 타입 (`string`, `number`, `boolean`)
  - 인터페이스 (`interface`)
  - 유니온 타입 (`'create' | 'edit'`)
  - 제네릭 기초 (`Array<T>`)
- 학습 시간: 1주
- 확인 방법: DTO 인터페이스를 작성할 수 있는가?

#### **레벨 2: React 기초**

**4. React 핵심 개념**
- 역할: UI 컴포넌트 프레임워크
- 필요한 부분:
  - JSX 문법
  - 컴포넌트 (함수형)
  - Props 전달
  - State (`useState`)
  - 이벤트 핸들링
  - 조건부 렌더링
  - 리스트 렌더링 (`map`)
- 학습 시간: 2주
- 확인 방법: 투두 리스트 앱을 만들 수 있는가? (CRUD)

**5. React Hooks**
- 역할: 상태 및 사이드 이펙트 관리
- 필요한 부분:
  - `useState`: 상태 관리
  - `useEffect`: API 호출, 구독
  - `useRouter`: Next.js 라우팅
  - Custom Hooks: 로직 재사용
- 학습 시간: 1주
- 확인 방법: API 호출 결과를 상태에 저장하고 화면에 표시할 수 있는가?

#### **레벨 3: Next.js**

**6. Next.js App Router**
- 역할: 풀스택 React 프레임워크
- 필요한 부분:
  - 파일 기반 라우팅 (`app/` 디렉토리)
  - Server Component vs Client Component
  - 동적 라우트 (`[id]`)
  - `Link` 컴포넌트
  - API Routes
- 학습 시간: 2주
- 확인 방법: 블로그 목록/상세 페이지를 만들 수 있는가?

**7. Server Components (RSC)**
- 역할: 서버 렌더링 최적화
- 필요한 부분:
  - `'use client'` 지시어
  - `async/await` in Server Components
  - `serverFetch` 패턴
  - Hydration 개념
- 학습 시간: 1주
- 확인 방법: 서버에서 DB 데이터를 fetch하여 초기 HTML에 포함시킬 수 있는가?

#### **레벨 4: 데이터베이스**

**8. SQL 기초**
- 역할: 데이터베이스 쿼리
- 필요한 부분:
  - SELECT, INSERT, UPDATE, DELETE
  - WHERE 조건
  - JOIN (INNER JOIN)
  - Primary Key, Foreign Key
- 학습 시간: 1주
- 확인 방법: 2개 테이블을 JOIN하여 원하는 데이터를 조회할 수 있는가?

**9. Prisma ORM**
- 역할: 타입 안전한 DB 쿼리
- 필요한 부분:
  - Schema 정의
  - CRUD 메서드 (`findMany`, `create`, `update`, `delete`)
  - Relations (`include`)
  - Migration
- 학습 시간: 1주
- 확인 방법: 1:N 관계의 데이터를 조회하고 생성할 수 있는가?

#### **레벨 5: 아키텍처 패턴**

**10. REST API 설계**
- 역할: API 엔드포인트 구조
- 필요한 부분:
  - HTTP 메서드 (GET, POST, PUT, DELETE)
  - 상태 코드 (200, 201, 400, 404, 500)
  - Request/Response 구조
  - RESTful URL 설계
- 학습 시간: 3일
- 확인 방법: CRUD API를 설계하고 문서화할 수 있는가?

**11. Service Layer 패턴**
- 역할: 비즈니스 로직 분리
- 필요한 부분:
  - 계층 구조 (Presentation → Service → Data)
  - DTO 패턴
  - 책임 분리
- 학습 시간: 3일
- 확인 방법: API Route와 Service를 분리할 필요성을 설명할 수 있는가?

#### **레벨 6: 고급 개념**

**12. Tailwind CSS**
- 역할: 유틸리티 퍼스트 CSS 프레임워크
- 필요한 부분:
  - 클래스명 규칙
  - 반응형 디자인 (`md:`, `lg:`)
  - 색상 시스템
  - 레이아웃 유틸리티
- 학습 시간: 3일
- 확인 방법: 디자인 목업을 보고 Tailwind 클래스로 구현할 수 있는가?

**13. Git/GitHub**
- 역할: 버전 관리
- 필요한 부분:
  - clone, add, commit, push
  - branch, merge
  - pull request
- 학습 시간: 3일
- 확인 방법: 브랜치를 만들어 작업하고 PR을 올릴 수 있는가?

---

### 🎓 각 기술의 역할 요약

```
┌─────────────────────────────────────────────────┐
│              프론트엔드 (브라우저)               │
├─────────────────────────────────────────────────┤
│  Tailwind CSS ────► UI 스타일링                 │
│       ↓                                          │
│  React ───────────► 컴포넌트 구조               │
│       ↓                                          │
│  TypeScript ──────► 타입 안정성                 │
│       ↓                                          │
│  JavaScript ──────► 프로그래밍 로직             │
└─────────────────────────────────────────────────┘
                      ↕ HTTP
┌─────────────────────────────────────────────────┐
│              백엔드 (Next.js 서버)              │
├─────────────────────────────────────────────────┤
│  Next.js App Router ─► 라우팅 & SSR            │
│       ↓                                          │
│  API Routes ──────────► REST API 엔드포인트     │
│       ↓                                          │
│  Service Layer ────► 비즈니스 로직              │
│       ↓                                          │
│  Prisma ORM ───────► DB 쿼리                    │
└─────────────────────────────────────────────────┘
                      ↕ SQL
┌─────────────────────────────────────────────────┐
│            데이터베이스 (PostgreSQL)            │
├─────────────────────────────────────────────────┤
│  Tables, Relations, Constraints                 │
└─────────────────────────────────────────────────┘
```

---

### 📖 추천 학습 자료

**1. JavaScript/TypeScript**
- MDN Web Docs (한글): https://developer.mozilla.org/ko/
- TypeScript 공식 문서 (한글): https://www.typescriptlang.org/ko/

**2. React**
- React 공식 문서 (한글): https://ko.react.dev/
- 특히 "Learn React" 섹션 필독

**3. Next.js**
- Next.js 공식 문서: https://nextjs.org/docs
- "App Router" 섹션 집중

**4. Prisma**
- Prisma 공식 문서: https://www.prisma.io/docs
- "Getting Started" + "CRUD" 섹션

**5. Tailwind CSS**
- Tailwind 공식 문서: https://tailwindcss.com/docs
- 유틸리티 클래스 검색 기능 활용

---

## 4. 학습 로드맵 및 제안사항

### 🎯 4주 학습 계획

#### **1주차: 코드 읽기 훈련**

**Day 1-2: 데이터베이스 스키마 분석**
```
목표: 타켓제품의 데이터 구조 이해

실습:
1. schema.prisma 파일 열기
2. Target_product 테이블 구조 그리기 (종이에)
3. 관계 다이어그램 작성:
   Target_Product_Line (1) ←→ (N) Target_product
4. 각 필드의 역할 적어보기

확인:
- "deployment_date는 왜 DateTime 타입인가?"
- "target_product_line_id는 무엇을 가리키는가?"
```

**Day 3-4: 타입 정의 이해**
```
목표: DTO 패턴 이해

실습:
1. targetProduct.types.ts 읽기
2. 각 DTO의 용도 비교표 만들기:

   | DTO 이름                  | 언제 사용? | 포함 필드 |
   |---------------------------|-----------|----------|
   | CreateTargetProductDto   | POST API  | 3개      |
   | UpdateTargetProductDto   | PUT API   | 3개(선택)|
   | TargetProductResponseDto | 응답      | 관계포함 |

3. "왜 Create와 Update DTO를 분리했을까?" 답해보기
```

**Day 5-6: Service Layer 분석**
```
목표: 비즈니스 로직 흐름 파악

실습:
1. targetProduct.service.ts 열기
2. findAll() 메서드 한 줄씩 주석 달기:

   async findAll() {
     // 1. Prisma로 모든 제품 조회
     const products = await prisma.target_product.findMany({
       // 2. 제품군 정보도 함께 가져오기
       include: { productLine: true },
       // 3. 최신순 정렬
       orderBy: { target_product_id: 'desc' },
     });

     // 4. DTO로 변환
     return products.map(this.toListDto);
   }

3. 나머지 4개 메서드도 동일하게 분석
```

**Day 7: 복습 퀴즈**
```
1. Target_product 테이블에 없는 필드는?
   a) target_product_id
   b) target_product_name
   c) target_product_description ✅
   d) deployment_date

2. DTO의 목적은?
   a) 데이터베이스 스키마 정의
   b) API 요청/응답 형식 정의 ✅
   c) UI 컴포넌트 Props 정의
   d) 라우팅 경로 정의

3. Service Layer의 역할은?
   a) HTML 렌더링
   b) 비즈니스 로직 처리 ✅
   c) CSS 스타일링
   d) 라우팅 처리
```

---

#### **2주차: API 흐름 따라가기**

**Day 1-2: API Route 분석 (GET, POST)**
```
목표: REST API 구조 이해

실습:
1. src/app/api/target-products/route.ts 열기
2. GET 핸들러 플로우차트 그리기:

   [Request]
      ↓
   [API Route GET 함수]
      ↓
   [targetProductService.findAll()]
      ↓
   [Prisma findMany]
      ↓
   [DTO 변환]
      ↓
   [successResponse()]
      ↓
   [Response { success: true, data: [...] }]

3. POST 핸들러도 동일하게 그리기
4. Thunder Client / Postman으로 실제 호출해보기
```

**Day 3-4: API Route 분석 (PUT, DELETE)**
```
실습:
1. src/app/api/target-products/[id]/route.ts 분석
2. 에러 처리 패턴 찾기:
   - 필수 필드 누락 → 400 Bad Request
   - 리소스 없음 → 404 Not Found
   - DB 에러 → 500 Internal Server Error

3. 각 에러 케이스 테스트:
   curl -X DELETE http://localhost:3001/api/target-products/99999
   (존재하지 않는 ID로 404 확인)
```

**Day 5-6: Server Component 데이터 로드**
```
목표: Server Component에서 API 호출 이해

실습:
1. src/app/trm/target-products/page.tsx 분석
2. serverFetch 함수 따라가기:
   - src/lib/utils/serverFetch.ts 열기
   - fetch 옵션 확인 (cache: 'no-store')
   - 응답 검증 로직 이해

3. 브라우저 DevTools Network 탭에서:
   - 페이지 로드 시 API 호출 확인
   - 응답 데이터 구조 확인
```

**Day 7: API 테스트 실습**
```
Thunder Client로 전체 CRUD 테스트:

1. GET /api/target-products (목록 조회)
2. POST /api/target-products (생성)
   Body: {
     "target_product_line_id": 1,
     "target_product_name": "테스트 제품",
     "deployment_date": "2024-03-20"
   }
3. GET /api/target-products/{생성된ID} (단건 조회)
4. PUT /api/target-products/{생성된ID} (수정)
   Body: { "target_product_name": "수정된 제품" }
5. DELETE /api/target-products/{생성된ID} (삭제)
6. GET /api/target-products/{생성된ID} (404 확인)
```

---

#### **3주차: 컴포넌트 분석**

**Day 1-2: TargetProductList (목록)**
```
실습:
1. src/components/trm/target-products/TargetProductList.tsx 열기
2. useState 찾기:
   const [products, setProducts] = useState(initialData);

   질문:
   - initialData는 어디서 왔나? → page.tsx의 serverFetch
   - products는 언제 변경되나? → 삭제 시

3. useOptimisticDelete 훅 분석:
   - src/lib/hooks/useOptimisticDelete.ts 열기
   - handleDelete 함수 로직 단계별 이해
   - isPending, isDeleting 상태 역할 파악

4. DataTable 컴포넌트 분석:
   - columns: 어떤 컬럼을 표시할지
   - data: 실제 데이터 배열
   - actions: 각 행의 액션 버튼
```

**Day 3-4: TargetProductForm (생성/수정)**
```
실습:
1. src/components/trm/target-products/TargetProductForm.tsx 열기
2. mode prop 이해:
   - 'create': 새 데이터 생성 (POST)
   - 'edit': 기존 데이터 수정 (PUT)

3. formData 상태 초기화 로직:
   const [formData, setFormData] = useState({
     target_product_line_id: initialData?.target_product_line_id || '',
     ...
   });

   질문:
   - `?.` 연산자의 역할은? → Optional Chaining
   - `||` 연산자의 역할은? → 기본값 설정

4. handleSubmit 함수 분석:
   - 유효성 검사 단계
   - API 호출 단계
   - 성공 시 라우팅 단계
```

**Day 5-6: SelectField (드롭다운)**
```
실습:
1. src/components/trm/common/SelectField.tsx 분석
2. useEffect 훅 이해:
   useEffect(() => {
     fetch(apiEndpoint)
       .then(res => res.json())
       .then(data => setOptions(data.data));
   }, [apiEndpoint]);

   질문:
   - useEffect는 언제 실행되나? → 컴포넌트 마운트 & apiEndpoint 변경 시
   - 의존성 배열 [apiEndpoint]의 역할은?

3. formatLabel prop 이해:
   formatLabel={(item) => `${item.target_division} - ${item.target_product_line}`}

   이것은 "고차 함수"입니다.
```

**Day 7: 컴포넌트 트리 그리기**
```
실습:
종이에 전체 컴포넌트 계층 구조 그리기:

app/trm/target-products/page.tsx (Server)
  └─ TargetProductList (Client)
       └─ DataTable (Client)
            ├─ 테이블 헤더
            ├─ 테이블 바디 (products.map)
            └─ 액션 버튼들
                 ├─ 보기 (Link)
                 ├─ 수정 (Link)
                 └─ 삭제 (handleDelete)

app/trm/target-products/new/page.tsx (Server)
  └─ TargetProductForm (Client, mode="create")
       ├─ SelectField (제품군)
       ├─ input (제품명)
       ├─ input (배치일)
       └─ button (제출)

app/trm/target-products/[id]/edit/page.tsx (Server)
  └─ TargetProductForm (Client, mode="edit", initialData)
       └─ (위와 동일)
```

---

#### **4주차: 전체 흐름 통합 & 실전**

**Day 1-2: 완전한 CRUD 흐름 추적**
```
실습:
브라우저에서 직접 사용하면서 DevTools로 추적:

1. 목록 조회:
   - Network 탭: /api/target-products 요청 확인
   - Response 탭: JSON 구조 확인
   - Elements 탭: 렌더링된 HTML 확인

2. 생성:
   - /trm/target-products/new 이동
   - Network 탭: /api/reference-data/product-lines 요청 (드롭다운용)
   - 폼 제출 시: POST /api/target-products 확인
   - Payload 탭: 전송된 데이터 확인
   - 목록 페이지 리디렉션 확인

3. 수정:
   - 수정 버튼 클릭
   - Network 탭: 페이지 로드 시 서버에서 데이터 fetch 확인 없음 (Server Component에서 처리)
   - 폼 제출 시: PUT /api/target-products/{id} 확인

4. 삭제:
   - Console 탭 열기
   - 삭제 버튼 클릭 → confirm 대화상자
   - Network 탭: DELETE 요청 확인
   - Elements 탭: 해당 행이 즉시 사라지는 것 확인 (낙관적 업데이트)
```

**Day 3-4: 코드 수정 실습**
```
실습 1: 새 필드 추가
목표: "메모" 필드를 타켓제품에 추가

단계:
1. schema.prisma에 `memo String?` 추가
2. npx prisma migrate dev 실행
3. DTO 타입에 memo 필드 추가
4. Service의 toDto 메서드에 memo 포함
5. Form 컴포넌트에 textarea 추가
6. 테스트: 생성/수정/조회 확인

실습 2: 유효성 검사 추가
목표: 제품명 최소 3글자 제한

단계:
1. TargetProductForm.tsx의 handleSubmit에 검증 추가:
   if (formData.target_product_name.length < 3) {
     throw new Error('제품명은 최소 3글자 이상이어야 합니다');
   }
2. 테스트: 2글자 입력 시 에러 메시지 확인

실습 3: 정렬 변경
목표: 제품명 가나다순 정렬

단계:
1. targetProduct.service.ts의 findAll()에서:
   orderBy: { target_product_name: 'asc' }  // 'desc' → 'asc'
2. 브라우저 새로고침 후 정렬 확인
```

**Day 5-6: 디버깅 연습**
```
연습 1: 의도적으로 버그 만들기
1. API Route에서 Service 호출 부분 주석 처리:
   // const products = await targetProductService.findAll();
   const products = [];
   return successResponse(products);

2. 브라우저에서 확인:
   - 목록이 비어있음
   - Network 탭: 응답은 200 OK이지만 data가 빈 배열
   - 원인 파악: API가 빈 배열 반환

3. 원상복구

연습 2: 타입 에러 고의로 발생
1. TargetProductForm에서 타입 불일치:
   setFormData({ ...prev, target_product_line_id: 'abc' });  // 숫자여야 하는데 문자열

2. TypeScript 컴파일 에러 확인
3. 에러 메시지 읽고 수정

연습 3: 네트워크 에러 시뮬레이션
1. 브라우저 DevTools → Network 탭 → Offline 체크
2. 목록 페이지 새로고침
3. error.tsx 컴포넌트가 표시되는지 확인
4. "다시 시도" 버튼 동작 확인
```

**Day 7: 최종 프로젝트**
```
미니 프로젝트: "카테고리" 기능 추가

요구사항:
1. Target_product에 category 필드 추가 (선택 사항)
2. 고정된 카테고리 옵션: "전략", "일반", "보류"
3. Form에 라디오 버튼 또는 Select로 선택 가능
4. 목록에 카테고리 표시
5. (보너스) 카테고리별 필터링 기능

체크리스트:
□ schema.prisma 수정
□ Migration 실행
□ DTO 타입 업데이트
□ Service 수정 (DTO 변환)
□ API Route 테스트
□ Form 컴포넌트 수정
□ List 컴포넌트 수정
□ 브라우저 테스트
```

---

### 💡 제안사항

#### **1. 코드 읽기 훈련 방법**

**기법 1: 주석 달기 연습**
```typescript
// ❌ 나쁜 주석
async findAll() {
  // 제품 조회
  const products = await prisma.target_product.findMany();
  return products;
}

// ✅ 좋은 주석 (초보자용)
async findAll() {
  // 1. 데이터베이스에서 모든 타켓제품 조회
  //    - productLine 관계도 함께 가져오기 (JOIN)
  //    - 최신 제품이 위로 오도록 정렬
  const products = await prisma.target_product.findMany({
    include: { productLine: true },  // LEFT JOIN Target_Product_Line
    orderBy: { target_product_id: 'desc' },  // ORDER BY id DESC
  });

  // 2. Prisma 모델을 DTO로 변환
  //    - Date 객체 → ISO 문자열
  //    - 필요한 필드만 선택
  return products.map(this.toListDto);
}
```

**기법 2: 실행 흐름 그리기**
```
종이와 펜을 준비하고:

1. 함수 호출 순서를 화살표로 연결
2. 각 함수가 반환하는 데이터 타입 적기
3. 조건문(if)은 분기로 표시
4. 반복문(map, forEach)은 박스로 묶기

예:
[Browser]
   ↓ (fetch)
[API Route] → return { success: true, data }
   ↓ (call)
[Service] → return TargetProductListItemDto[]
   ↓ (query)
[Prisma] → return Target_product[]
   ↓ (SQL)
[PostgreSQL] → ResultSet
```

**기법 3: "왜?" 질문하기**
```
코드를 읽으면서 계속 질문:

Q: 왜 Server Component와 Client Component를 분리했을까?
A: SEO + 초기 로딩 속도 (서버) + 인터랙션 (클라이언트)

Q: 왜 DTO를 사용할까?
A: API 응답 구조 명확화 + 타입 안정성

Q: 왜 Service Layer를 둘까?
A: 재사용 + 테스트 용이성 + 로직 집중화

Q: 왜 낙관적 업데이트를 할까?
A: 사용자 경험 개선 (즉각적인 반응)
```

---

#### **2. 디버깅 팁**

**팁 1: console.log 전략적으로 사용**
```typescript
// ✅ 좋은 디버깅
const handleSubmit = async (e) => {
  console.log('1. 폼 제출 시작');
  console.log('2. formData:', formData);

  const response = await fetch(url, { method, body: JSON.stringify(formData) });
  console.log('3. API 응답 상태:', response.status);

  const result = await response.json();
  console.log('4. API 응답 데이터:', result);

  if (!result.success) {
    console.error('5. 에러 발생:', result.error);
    throw new Error(result.error);
  }

  console.log('6. 성공, 리디렉션 시작');
  router.push(ROUTES.TRM.TARGET_PRODUCTS.LIST);
};
```

**팁 2: TypeScript 에러 읽는 법**
```
에러 메시지:
Type 'string' is not assignable to type 'number'

해석:
- Type 'string': 당신이 준 값이 문자열
- is not assignable to: 할당할 수 없다
- type 'number': 기대하는 타입은 숫자

해결:
const id = Number(stringId);  // 문자열을 숫자로 변환
```

**팁 3: Network 탭 활용**
```
Chrome DevTools → Network 탭:

1. Fetch/XHR 필터 선택 → API 호출만 보기
2. 요청 클릭 → Headers 탭:
   - Request URL: 어디로 보냈나?
   - Request Method: GET/POST/PUT/DELETE?
3. Payload 탭: 어떤 데이터를 보냈나?
4. Response 탭: 서버가 뭘 보냈나?
5. Timing 탭: 얼마나 걸렸나?
```

---

#### **3. 실전 학습 프로젝트 아이디어**

**프로젝트 1: 간단한 도서 관리 시스템**
```
목표: 타켓제품과 동일한 구조로 책 CRUD 만들기

엔티티:
- Book (id, title, author, publishedDate)
- Category (id, name)
- Book → Category (N:1)

구현할 것:
□ Prisma 스키마 정의
□ DTO 타입 정의
□ Service Layer (CRUD)
□ API Routes (5개)
□ 목록 페이지 (Server Component)
□ 목록 컴포넌트 (Client Component + DataTable)
□ Form 컴포넌트 (생성/수정)
□ SelectField로 카테고리 선택

학습 효과:
- 타켓제품 코드를 복사-붙여넣기하며 이해도 향상
- 스스로 변형하면서 원리 파악
```

**프로젝트 2: 할일 관리 + 카테고리**
```
목표: 1:N 관계를 다루는 연습

엔티티:
- TodoCategory (id, name, color)
- TodoItem (id, categoryId, title, completed, dueDate)

추가 기능:
- 카테고리별 할일 개수 표시
- 완료/미완료 필터링
- 마감일 임박 경고 (3일 이내)

학습 효과:
- JOIN 쿼리 이해
- 집계 함수 (COUNT)
- 조건부 렌더링
```

**프로젝트 3: 블로그 + 태그 (N:M)**
```
목표: 다대다 관계 학습

엔티티:
- Post (id, title, content, createdAt)
- Tag (id, name)
- PostTag (postId, tagId) ← 중간 테이블

추가 기능:
- 포스트에 여러 태그 추가
- 태그 클릭 시 해당 태그의 모든 포스트 표시
- 태그별 포스트 개수 표시

학습 효과:
- N:M 관계 설계
- 복합 쿼리 (중간 테이블 JOIN)
- 태그 시스템 패턴
```

---

#### **4. 참고 자료 모음**

**공식 문서 (필독)**
1. Next.js App Router: https://nextjs.org/docs/app
2. Prisma CRUD: https://www.prisma.io/docs/concepts/components/prisma-client/crud
3. React Hooks: https://react.dev/reference/react
4. TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/

**YouTube 강의 (한글)**
1. "Next.js 15 완벽 가이드" - 코딩애플
2. "TypeScript 기초부터 실전까지" - 드림코딩
3. "Prisma ORM 완전정복" - 노마드코더

**블로그 추천**
1. Vercel 공식 블로그 (Next.js 베스트 프랙티스)
2. Kent C. Dodds (React 고급 패턴)
3. Robin Wieruch (React 튜토리얼)

**커뮤니티**
1. Next.js Discord: https://discord.gg/nextjs
2. 한국 프론트엔드 개발자 오픈채팅방
3. Stack Overflow (영어 검색 필수)

---

#### **5. 자주 하는 실수 & 해결법**

**실수 1: 'use client' 빠뜨림**
```typescript
// ❌ 에러 발생
export default function MyForm() {
  const [data, setData] = useState({}); // useState는 Client에서만 가능
  // Error: useState is not defined
}

// ✅ 해결
'use client';

export default function MyForm() {
  const [data, setData] = useState({});
}
```

**실수 2: async 컴포넌트에서 'use client' 사용**
```typescript
// ❌ 에러 발생
'use client';

export default async function Page() {  // async와 'use client'는 같이 못 씀
  const data = await fetch(...);
}

// ✅ 해결: Server Component로 변경
export default async function Page() {
  const data = await fetch(...);
  return <ClientComponent data={data} />;
}
```

**실수 3: DTO 타입 불일치**
```typescript
// ❌ 에러 발생
const product: TargetProductResponseDto = await fetch(...).then(r => r.json());
// product.deployment_date는 string인데 Date로 사용하려 함
const date = product.deployment_date.getFullYear(); // ❌ String에는 getFullYear()가 없음

// ✅ 해결
const date = new Date(product.deployment_date).getFullYear(); // String → Date 변환
```

**실수 4: 의존성 배열 빠뜨림**
```typescript
// ❌ 무한 루프
useEffect(() => {
  fetch(apiEndpoint).then(res => setData(res.data));
  // 의존성 배열이 없어서 매 렌더링마다 실행 → setData → 리렌더링 → 다시 실행 → ...
});

// ✅ 해결
useEffect(() => {
  fetch(apiEndpoint).then(res => setData(res.data));
}, [apiEndpoint]); // apiEndpoint 변경 시에만 실행
```

**실수 5: Prisma Migration 안 함**
```
// schema.prisma 수정 후 npx prisma migrate dev 안 함
// → DB 테이블 구조가 변경 안 됨
// → Prisma 쿼리 시 에러 발생

// ✅ 해결
npx prisma migrate dev --name add_memo_field
npx prisma generate
```

---

### 🚀 마지막 조언

**1. 코드를 100% 이해하려 하지 마세요**
- 처음엔 70% 이해해도 충분
- 나머지 30%는 실습하면서 자연스럽게 채워짐
- 모든 걸 외울 필요 없음 (공식 문서 참고하면 됨)

**2. 작은 것부터 수정해보세요**
- 버튼 텍스트 변경
- 색상 변경
- 컬럼 추가/제거
- 유효성 검사 규칙 변경
→ 점점 큰 기능으로

**3. 에러를 두려워하지 마세요**
- 에러는 최고의 선생님
- 에러 메시지를 천천히 읽어보기
- Stack Overflow에 검색 (영어로)
- Git으로 버전 관리하면 언제든지 되돌릴 수 있음

**4. 커뮤니티를 활용하세요**
- 막히면 질문하기 (Discord, 오픈채팅)
- 다른 사람 코드 읽기 (GitHub)
- 블로그에 학습 내용 정리하기 (복습 효과)

**5. 꾸준히 하세요**
- 하루 1시간 × 30일 > 주말 10시간 × 3일
- 매일 조금씩 코드 읽고 수정하기
- 프로젝트 하나를 완성하는 것이 목표

---

## 검증 방법 (학습 완료 체크리스트)

### ✅ 초급 (1-2주 후)
- [ ] 타켓제품 테이블 구조를 종이에 그릴 수 있다
- [ ] DTO와 Prisma 모델의 차이를 설명할 수 있다
- [ ] Service Layer의 역할을 설명할 수 있다
- [ ] API Route에서 Service를 호출하는 이유를 설명할 수 있다
- [ ] Server Component와 Client Component의 차이를 설명할 수 있다

### ✅ 중급 (3-4주 후)
- [ ] 목록 조회의 전체 흐름을 화살표로 그릴 수 있다 (Browser → DB)
- [ ] Form 제출 시 데이터가 어떻게 전달되는지 설명할 수 있다
- [ ] 낙관적 업데이트가 무엇이고 왜 사용하는지 설명할 수 있다
- [ ] SelectField가 어떻게 동작하는지 설명할 수 있다
- [ ] 타켓제품 코드에 새 필드를 추가할 수 있다

### ✅ 고급 (2-3개월 후)
- [ ] 타켓제품과 유사한 새로운 기능을 처음부터 만들 수 있다
- [ ] 1:N, N:M 관계를 설계하고 구현할 수 있다
- [ ] API 에러를 적절히 처리할 수 있다
- [ ] TypeScript 타입 에러를 스스로 해결할 수 있다
- [ ] Next.js App Router의 장점을 다른 사람에게 설명할 수 있다

---

이제 준비가 되었습니다! 🎉

**첫 번째 단계:**
1. `prisma/schema.prisma` 파일을 엽니다
2. Target_product 테이블을 종이에 그립니다
3. 각 필드의 역할을 적어봅니다

**화이팅!** 💪
