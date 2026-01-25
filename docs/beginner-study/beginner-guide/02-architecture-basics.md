# 🏗️ Next.js 아키텍처 기초

이 문서에서는 Next.js App Router의 **핵심 개념**들을 쉽게 설명합니다.

전문 용어는 최대한 피하고, **레스토랑 비유**를 사용해서 이해하기 쉽게 만들었어요!

---

## 🏗️ 개념 1: Server Component (주방 👨‍🍳) vs Client Component (테이블 🍽️)

### 🏪 레스토랑 비유로 이해하기

상상해보세요. 당신이 레스토랑을 운영합니다.

```
🏪 레스토랑 (Next.js 애플리케이션)

┌─────────────────────────────────────┐
│  👨‍🍳 주방 (Server Component)        │
│  ─────────────────────────────────  │
│  - 손님이 보지 못하는 곳             │
│  - 음식(데이터)을 준비하는 곳        │
│  - 비밀 레시피 보관 (API 키, DB 암호)│
│  - 빠르게 준비해서 완성품만 내보냄   │
└─────────────────────────────────────┘
           ↓ 완성된 음식 전달
┌─────────────────────────────────────┐
│  🍽️ 테이블 (Client Component)       │
│  ─────────────────────────────────  │
│  - 손님이 앉아있는 곳               │
│  - 음식을 먹고 반응하는 곳          │
│  - 종업원을 부를 수 있음 (API 호출) │
│  - 소스 추가 같은 작은 조작 가능    │
└─────────────────────────────────────┘
```

---

## 📄 Server Component 상세 설명

### 📁 예시 파일
```
src/app/trm/target-products/page.tsx
```

### 🎯 Server Component란?

**서버에서만 실행되는 컴포넌트**입니다. 브라우저에는 결과(HTML)만 전송됩니다.

### ✅ 언제 사용하나요?

| 상황 | 사용 여부 |
|------|-----------|
| 페이지 처음 로딩할 때 데이터 필요 | ✅ 사용 |
| 검색 엔진(구글)이 내용을 읽어야 함 (SEO) | ✅ 사용 |
| 보안이 중요한 정보 다룸 (DB 비밀번호, API 키) | ✅ 사용 |
| 서버에서만 접근 가능한 파일 읽기 | ✅ 사용 |
| 버튼 클릭에 반응해야 함 | ❌ Client Component 사용 |
| 입력창 값을 받아야 함 | ❌ Client Component 사용 |
| useState, useEffect 사용하고 싶음 | ❌ Client Component 사용 |

### 📝 Server Component 코드 예시

```typescript
// ✅ Server Component (기본값)
// 파일 맨 위에 'use client'가 없으면 Server Component

import { serverFetch } from '@/lib/utils/serverFetch';

// async 함수 사용 가능! (Server Component만 가능)
export default async function ProductPage() {
  // ✅ 가능: 직접 데이터 가져오기
  const products = await serverFetch('/api/products');

  // ✅ 가능: 환경 변수 접근 (보안 중요 정보)
  const apiKey = process.env.SECRET_API_KEY;

  // ✅ 가능: 서버 파일 시스템 접근
  const fs = require('fs');
  const data = fs.readFileSync('./data.json');

  return (
    <div>
      <h1>제품 목록</h1>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### ❌ Server Component에서 불가능한 것

```typescript
// ❌ 에러! Server Component에서는 사용 불가능
export default async function Page() {
  // ❌ useState 사용 불가
  const [count, setCount] = useState(0);
  // Error: useState only works in Client Components

  // ❌ 이벤트 핸들러 사용 불가
  const handleClick = () => { ... };
  return <button onClick={handleClick}>클릭</button>;
  // 버튼은 보이지만 클릭해도 아무 일도 안 일어남!

  // ❌ useEffect 사용 불가
  useEffect(() => { ... }, []);
  // Error: useEffect only works in Client Components

  // ❌ 브라우저 API 사용 불가
  window.localStorage.getItem('key');
  // Error: window is not defined
}
```

### 🔑 Server Component의 장점

```
1. 🔒 보안
   - 비밀 정보(API 키, DB 비밀번호)를 숨길 수 있어요
   - 브라우저에 절대 노출되지 않습니다

2. ⚡ 성능
   - 서버가 미리 HTML을 만들어서 보냅니다
   - 브라우저가 할 일이 줄어듭니다
   - 초기 로딩이 빨라집니다

3. 🔍 SEO (검색 엔진 최적화)
   - 구글 같은 검색 엔진이 내용을 읽을 수 있어요
   - 검색 결과에 잘 나타납니다

4. 📦 번들 크기 감소
   - 서버 코드는 브라우저로 안 보내집니다
   - JavaScript 파일 크기가 작아집니다
```

---

## 🖥️ Client Component 상세 설명

### 📁 예시 파일
```
src/components/trm/target-products/TargetProductList.tsx
```

### 🎯 Client Component란?

**브라우저에서 실행되는 컴포넌트**입니다. 사용자와 상호작용합니다.

### 🔝 표시 방법

**파일 맨 위에 `'use client'`를 써야 합니다!**

```typescript
'use client'  // 👈 이게 있으면 Client Component!

import { useState } from 'react';

export default function MyComponent() {
  // 이제 useState 사용 가능!
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>
    클릭 수: {count}
  </button>;
}
```

### ✅ 언제 사용하나요?

| 상황 | 사용 여부 |
|------|-----------|
| 버튼 클릭, 마우스 움직임 등 이벤트 처리 | ✅ 사용 |
| 입력창, 체크박스 등 상호작용 | ✅ 사용 |
| 화면을 실시간으로 업데이트 (useState) | ✅ 사용 |
| 타이머, 애니메이션 등 브라우저 기능 | ✅ 사용 |
| 로컬 스토리지 접근 | ✅ 사용 |
| 페이지 처음 로딩할 때만 필요 | ❌ Server Component 사용 |
| DB에 직접 접근해야 함 | ❌ Server Component + API 사용 |

### 📝 Client Component 코드 예시

```typescript
'use client'  // 필수!

import { useState } from 'react';

export default function Counter() {
  // ✅ 가능: 상태 관리
  const [count, setCount] = useState(0);

  // ✅ 가능: 이벤트 핸들러
  const handleClick = () => {
    setCount(count + 1);
    alert('클릭!');
  };

  // ✅ 가능: 브라우저 API
  const saveToLocalStorage = () => {
    localStorage.setItem('count', count.toString());
  };

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={handleClick}>증가</button>
      <button onClick={saveToLocalStorage}>저장</button>
    </div>
  );
}
```

### ⚠️ Client Component에서 조심할 것

```typescript
'use client'

export default function MyComponent() {
  // ❌ 위험! 비밀 정보 노출됨
  const apiKey = process.env.SECRET_API_KEY;
  // 이 값이 브라우저 코드에 포함되어 누구나 볼 수 있어요!

  // ❌ 불가능! DB 직접 접근
  const products = await prisma.product.findMany();
  // Error: prisma는 서버에서만 사용 가능

  // ✅ 올바른 방법: API를 통해 간접 접근
  const response = await fetch('/api/products');
  const products = await response.json();
}
```

### 🔑 Client Component의 장점

```
1. 🎮 상호작용
   - 버튼 클릭, 입력, 드래그 등 모든 이벤트 처리
   - 사용자 경험이 풍부해집니다

2. ⚡ 즉각적인 반응
   - 서버에 요청하지 않고 바로 화면 업데이트
   - 낙관적 업데이트 가능

3. 🔧 브라우저 API 사용
   - localStorage, sessionStorage
   - window, document 접근
   - 타이머, 애니메이션
```

---

## 🤔 실전 예시: 언제 뭘 써야 할까?

### 시나리오별 선택 가이드

| 만들려는 것 | 사용할 것 | 이유 |
|------------|----------|------|
| **블로그 글 목록 페이지** | Server Component | SEO 필요, 초기 데이터만 로드 |
| **블로그 글 목록 테이블** | Client Component | 정렬, 검색 기능 필요 |
| **제품 등록 폼** | Client Component | 입력 값 관리 필요 |
| **대시보드 통계** | Server Component | 매번 최신 데이터 계산 |
| **좋아요 버튼** | Client Component | 클릭 이벤트 처리 |
| **댓글 목록** | Server Component | SEO, 초기 로딩 |
| **댓글 작성 폼** | Client Component | 입력, 제출 처리 |
| **검색 결과 페이지** | Server Component | SEO, URL 파라미터 기반 |
| **검색 입력창** | Client Component | 실시간 검색어 반영 |

### 프로젝트 예시 분석

**우리 프로젝트의 제품 관리 기능:**

```
📄 page.tsx (Server Component)
   └─ 역할: 초기 데이터 로드 (DB → Service → API → Page)
   └─ 이유: SEO 필요, 보안 (serverFetch 사용)
   └─ 코드: async/await 사용

🧩 TargetProductList.tsx (Client Component)
   └─ 역할: 목록 표시, 삭제 버튼 클릭 처리
   └─ 이유: 사용자 상호작용 필요
   └─ 코드: 'use client', useState, onClick
```

---

## 🛣️ 개념 2: API Routes (주문서 📋)

### 🎯 API Routes란?

**레스토랑의 주문서**라고 생각하세요!

```
손님(클라이언트) → 주문서(API) → 주방(서버)

손님: "제품 목록 주세요!"
  ↓ (GET /api/products)
주문서: "주방에 전달할게요"
  ↓
주방: "여기 제품 목록이에요"
  ↓ (JSON 응답)
주문서: "손님에게 전달할게요"
  ↓
손님: "감사합니다!"
```

### 📁 예시 파일
```
src/app/api/target-products/route.ts       (목록, 생성)
src/app/api/target-products/[id]/route.ts  (단건 조회, 수정, 삭제)
```

### 🤔 왜 필요한가요?

```
1. 🔒 보안
   - 데이터베이스를 직접 노출하지 않아요
   - 클라이언트가 DB에 직접 접근하면 위험해요!

2. ✅ 검증
   - 잘못된 요청을 걸러냅니다
   - "이름이 없는 제품은 만들 수 없어요!"

3. 🎯 통일
   - 같은 데이터를 여러 곳에서 쓸 때 일관성 유지
   - 로직이 한 곳에 모여있어요

4. 🔄 재사용
   - 웹, 모바일 앱 모두 같은 API 사용 가능
```

### 🎭 HTTP 메서드 종류 (레스토랑 비유)

| HTTP 메서드 | 의미 | 레스토랑 비유 | 예시 |
|------------|------|-------------|------|
| **GET** | 읽기 | 메뉴 보기 | 제품 목록 조회 |
| **POST** | 생성 | 주문하기 | 새 제품 등록 |
| **PUT** | 전체 수정 | 주문 완전히 바꾸기 | 제품 전체 정보 수정 |
| **PATCH** | 부분 수정 | 주문 일부만 바꾸기 | 제품 이름만 수정 |
| **DELETE** | 삭제 | 주문 취소 | 제품 삭제 |

### 📝 API Route 코드 구조

```typescript
// 파일: src/app/api/target-products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { targetProductService } from '@/lib/services/targetProduct.service';

// GET: 목록 조회
export async function GET() {
  try {
    const products = await targetProductService.findAll();

    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '조회에 실패했습니다'
    }, { status: 500 });
  }
}

// POST: 새 제품 생성
export async function POST(request: NextRequest) {
  try {
    // 요청 본문(body) 읽기
    const body = await request.json();

    // 검증
    if (!body.name) {
      return NextResponse.json({
        success: false,
        error: '제품명은 필수입니다'
      }, { status: 400 });
    }

    // Service에서 생성
    const product = await targetProductService.create(body);

    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '생성에 실패했습니다'
    }, { status: 500 });
  }
}
```

### 🔑 API Route의 핵심 패턴

```
1. try-catch로 에러 처리 (필수!)
2. 성공 시: { success: true, data: ... }
3. 실패 시: { success: false, error: ... } + HTTP 상태 코드
4. 검증 로직 포함
5. Service Layer에 실제 작업 위임
```

---

## ⚙️ 개념 3: Service Layer (셰프의 레시피북 📖)

### 🎯 Service Layer란?

**셰프가 보는 레시피북**이라고 생각하세요!

```
👨‍🍳 셰프 (Service Layer)
   └─ 레시피북을 보며 요리합니다
   └─ 재료(데이터)를 어떻게 다룰지 정의
   └─ 같은 요리를 여러 번 만들 때 일관성 유지
```

### 📁 예시 파일
```
src/lib/services/targetProduct.service.ts
```

### 🤔 왜 필요한가요?

```
1. 🔄 재사용
   - 같은 로직을 여러 API에서 사용
   - "제품 조회" 로직을 한 번만 작성

2. 🧹 정리
   - 코드가 깔끔하게 분리됨
   - API는 요청 처리만, Service는 비즈니스 로직만

3. 🧪 테스트
   - 로직을 독립적으로 테스트 가능
   - API Route 없이도 Service만 테스트

4. 🛠️ 유지보수
   - 로직 변경 시 한 곳만 수정
   - 여러 API Route에 영향 없음
```

### 📝 Service 코드 구조

```typescript
// 파일: src/lib/services/targetProduct.service.ts

import { prisma } from '@/lib/prisma';

class TargetProductService {
  // 전체 조회
  async findAll() {
    const products = await prisma.target_product.findMany({
      include: { productLine: true },
    });

    // DTO 변환 (필요한 필드만 추출)
    return products.map(product => ({
      target_product_id: product.target_product_id,
      target_product_name: product.target_product_name,
      deployment_date: product.deployment_date.toISOString(),
      productLine: {
        target_division: product.productLine.target_division,
        target_product_line: product.productLine.target_product_line,
      },
    }));
  }

  // ID로 조회
  async findById(id: number) {
    const product = await prisma.target_product.findUnique({
      where: { target_product_id: id },
      include: { productLine: true },
    });

    if (!product) {
      throw new Error('제품을 찾을 수 없습니다');
    }

    return product;
  }

  // 생성
  async create(data: CreateDto) {
    // 검증
    if (!data.target_product_name) {
      throw new Error('제품명은 필수입니다');
    }

    // DB에 저장
    return await prisma.target_product.create({
      data: {
        target_product_line_id: data.target_product_line_id,
        target_product_name: data.target_product_name,
        deployment_date: new Date(data.deployment_date),
      },
      include: { productLine: true },
    });
  }

  // 수정
  async update(id: number, data: UpdateDto) {
    // 존재 확인
    await this.findById(id);

    // 업데이트
    return await prisma.target_product.update({
      where: { target_product_id: id },
      data: {
        target_product_name: data.target_product_name,
        deployment_date: new Date(data.deployment_date),
      },
      include: { productLine: true },
    });
  }

  // 삭제
  async delete(id: number) {
    // 존재 확인
    await this.findById(id);

    // 삭제
    await prisma.target_product.delete({
      where: { target_product_id: id },
    });
  }
}

// 싱글톤 패턴 (인스턴스 하나만 생성)
export const targetProductService = new TargetProductService();
```

### 🔑 Service Layer의 핵심 패턴

```
1. CRUD 메서드 제공 (findAll, findById, create, update, delete)
2. 비즈니스 로직 포함 (검증, 계산 등)
3. DTO 변환 (DB 모델 → 응답 형식)
4. 에러 처리 (throw new Error)
5. Prisma ORM 사용
```

---

## 📊 개념 4: 데이터 흐름 (음식이 배달되는 과정)

### 🍔 전체 흐름 시각화

```
🗄️ Database (식재료 창고)
    ↓
⚙️ Service Layer (셰프가 요리)
    ↓
🛣️ API Route (서빙)
    ↓
📄 Page (Server Component) (테이블에 세팅)
    ↓
🖥️ Component (Client) (손님이 먹음)
```

### 📋 각 계층의 역할

| 계층 | 파일 예시 | 역할 | 비유 |
|------|----------|------|------|
| **Database** | PostgreSQL | 데이터 저장 | 식재료 창고 |
| **Prisma ORM** | schema.prisma | DB 쿼리 빌더 | 창고 관리 시스템 |
| **Service** | targetProduct.service.ts | 비즈니스 로직 | 셰프의 레시피 |
| **API Route** | route.ts | 요청/응답 처리 | 서빙 직원 |
| **Server Component** | page.tsx | 초기 데이터 로드 | 테이블 세팅 |
| **Client Component** | TargetProductList.tsx | 사용자 상호작용 | 손님이 식사 |

### 🔄 실제 데이터 흐름 예시 (제품 삭제)

```
1. 🖱️ 사용자가 "삭제" 버튼 클릭
   📍 TargetProductList.tsx (Client Component)
   💬 onClick={() => handleDelete(product)}

2. 📡 fetch로 DELETE 요청 보냄
   💬 DELETE /api/target-products/123

3. 🛣️ API Route가 요청 받음
   📍 route.ts의 DELETE 함수
   💬 await targetProductService.delete(123)

4. ⚙️ Service 호출
   📍 targetProductService.delete(123)
   💬 존재 확인 → 삭제 실행

5. 🗄️ Prisma로 DB 쿼리
   💬 DELETE FROM target_product WHERE id = 123

6. ⬅️ 응답이 역순으로 돌아감
   Service → API → Client Component

7. ✅ Client가 결과 처리
   성공: 화면 유지 (낙관적 업데이트)
   실패: router.refresh()로 데이터 복구
```

### 🎯 계층 분리의 장점

```
1. 📦 관심사의 분리
   - 각 계층이 자기 역할만 담당
   - 코드가 깔끔하고 이해하기 쉬움

2. 🔄 재사용성
   - Service 로직을 여러 API에서 사용
   - 같은 API를 여러 페이지에서 사용

3. 🧪 테스트 용이
   - 각 계층을 독립적으로 테스트
   - Service만 테스트, API만 테스트

4. 🛠️ 유지보수
   - 로직 변경 시 영향 범위 최소화
   - 버그 수정이 쉬움
```

---

## 🎓 학습 포인트 정리

### ✅ Server Component
```
✓ 서버에서만 실행된다
✓ async/await 사용 가능
✓ DB, 파일 시스템 직접 접근 가능
✓ 보안에 유리 (비밀 정보 숨김)
✓ SEO에 유리
✓ useState, onClick 사용 불가
```

### ✅ Client Component
```
✓ 브라우저에서 실행된다
✓ 'use client' 필수
✓ useState, useEffect 사용 가능
✓ 이벤트 처리 가능 (onClick 등)
✓ 브라우저 API 사용 가능
✓ DB 직접 접근 불가 (API 통해야 함)
```

### ✅ API Routes
```
✓ Server와 Client 사이의 다리
✓ HTTP 메서드로 작업 구분 (GET, POST, DELETE 등)
✓ 요청 검증과 에러 처리
✓ Service Layer에 로직 위임
✓ JSON 형식으로 응답
```

### ✅ Service Layer
```
✓ 비즈니스 로직 담당
✓ CRUD 메서드 제공
✓ Prisma로 DB 접근
✓ DTO 변환
✓ 재사용 가능한 로직
```

---

## 🎯 다음 단계

개념을 이해했다면, 이제 **실제로 코드를 작성하는 패턴**을 배워봅시다!

복사해서 바로 쓸 수 있는 템플릿을 제공합니다.

```
📍 다음 단계: 03-patterns-reference.md
```

---

## 💡 자주 묻는 질문 (FAQ)

### Q1: Server Component에서 버튼 클릭을 처리할 수 없나요?
```
A: 네, 불가능합니다!
   버튼 클릭은 브라우저에서 일어나는 일이기 때문에,
   Client Component에서 처리해야 합니다.

   해결: 버튼을 감싸는 작은 Client Component를 만드세요.
```

### Q2: Client Component에서 데이터베이스에 접근할 수 없나요?
```
A: 네, 직접 접근은 불가능합니다!
   보안상 이유로 DB는 서버에서만 접근 가능합니다.

   해결: API Route를 만들어서 간접적으로 접근하세요.
```

### Q3: 언제 Server를 쓰고 언제 Client를 써야 할지 헷갈려요!
```
A: 이렇게 생각하세요:
   - 사용자가 클릭하거나 입력하나요? → Client
   - 그냥 데이터를 보여주기만 하나요? → Server
   - 비밀 정보(API 키)를 써야 하나요? → Server
   - 검색 엔진이 읽어야 하나요? → Server
```

### Q4: API Route 없이 바로 Service를 호출하면 안 되나요?
```
A: Server Component에서는 가능하지만 추천하지 않습니다!

   이유:
   - Client Component에서는 API가 필요합니다
   - API를 만들어두면 나중에 모바일 앱에서도 쓸 수 있어요
   - 코드가 더 깔끔하게 분리됩니다
```

### Q5: DTO가 뭔가요?
```
A: Data Transfer Object (데이터 전송 객체)
   DB 모델을 그대로 반환하지 않고,
   필요한 필드만 골라서 정리한 형식이에요.

   예시:
   DB 모델: 20개 필드 (내부 정보 포함)
   DTO: 5개 필드 (클라이언트에 필요한 것만)
```
