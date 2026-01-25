# 🎯 초급 퀴즈 (50개)

Next.js App Router의 기본 개념을 확인하는 퀴즈입니다.

**예상 소요 시간**: 2-3시간
**난이도**: ⭐ 초급

---

## 📚 목차

1. [Server vs Client Component (8개)](#1-server-vs-client-component-8개)
2. [기본 라우팅 (7개)](#2-기본-라우팅-7개)
3. [데이터 흐름 기초 (8개)](#3-데이터-흐름-기초-8개)
4. [API Routes 기초 (7개)](#4-api-routes-기초-7개)
5. [기본 타입과 DTO (6개)](#5-기본-타입과-dto-6개)
6. [Prisma 기초 (5개)](#6-prisma-기초-5개)
7. [useState와 상태 관리 (5개)](#7-usestate와-상태-관리-5개)
8. [기본 에러 처리 (4개)](#8-기본-에러-처리-4개)

---

## 1. Server vs Client Component (8개)

### 퀴즈 1: Server Component 식별 (초급)

**문제**: 다음 중 Server Component의 특징이 **아닌** 것은?

A) 'use client'가 없다
B) async 함수로 만들 수 있다
C) useState를 사용할 수 있다
D) 서버에서만 실행된다

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
useState는 React Hook으로 브라우저에서만 작동하며, Client Component에서만 사용 가능합니다.

**상세 설명**:
- **A) 올바름**: Server Component는 'use client' 지시어가 없습니다
- **B) 올바름**: Server Component는 async 함수로 선언 가능합니다
- **C) 틀림**: useState는 Client Component 전용입니다
- **D) 올바름**: Server Component는 서버에서만 실행됩니다

**코드 예제**:
```typescript
// ✅ Server Component (async 가능, useState 불가)
export default async function ProductsPage() {
  const data = await serverFetch('/api/products');
  return <div>{data}</div>;
}

// ✅ Client Component (useState 가능, async 불가)
'use client'
import { useState } from 'react';

export default function ProductList() {
  const [items, setItems] = useState([]);
  return <div>{items}</div>;
}
```

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/page.tsx`
- 라인: 31 (async Server Component)
- 설명: async 함수로 선언된 Server Component 예시

**추가 팁**:
- Server Component는 DB 접근, API 호출 등 서버 작업에 적합
- Client Component는 사용자 상호작용(클릭, 입력)에 필요

</details>

---

### 퀴즈 2: 'use client' 지시어 (초급)

**문제**: 다음 빈칸을 채우세요.

```typescript
___________

import { useState } from 'react';

export default function MyComponent() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

<details>
<summary>정답 보기</summary>

**정답**: `'use client'`

**해설**:
useState를 사용하려면 반드시 파일 맨 위에 'use client' 지시어를 추가해야 합니다.

**상세 설명**:
- **위치**: 파일의 첫 번째 줄 (import보다 위)
- **작은따옴표**: 'use client' (큰따옴표도 가능하지만 작은따옴표 권장)
- **효과**: 이 파일을 Client Component로 변환

**올바른 코드**:
```typescript
'use client'  // 👈 맨 위에!

import { useState } from 'react';

export default function MyComponent() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

**프로젝트 참조**:
- 파일: `src/components/trm/target-products/TargetProductList.tsx`
- 라인: 17
- 설명: 'use client' 지시어 사용 예시

**자주 하는 실수**:
```typescript
// ❌ import 아래에 쓰면 에러!
import { useState } from 'react';
'use client'  // 너무 늦음!

// ❌ 주석도 'use client' 위에 있으면 안 됨
// 이것은 주석
'use client'  // 에러!

// ✅ 올바른 방법
'use client'
// 주석은 여기
import { useState } from 'react';
```

</details>

---

### 퀴즈 3: async 함수 사용 (초급)

**문제**: 다음 중 올바른 코드는?

A)
```typescript
'use client'
export default async function Page() {
  const data = await fetch('/api/data');
  return <div>{data}</div>;
}
```

B)
```typescript
export default async function Page() {
  const data = await fetch('/api/data');
  return <div>{data}</div>;
}
```

C)
```typescript
'use client'
export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
  return <div>{data}</div>;
}
```

<details>
<summary>정답 보기</summary>

**정답: B와 C 모두 올바름 (단, 용도가 다름)**

**해설**:
- **B**: Server Component로 서버에서 데이터 fetch (초기 로딩)
- **C**: Client Component로 브라우저에서 데이터 fetch (동적 업데이트)
- **A**: Client Component는 async 함수가 될 수 없어서 **틀림**

**상세 설명**:

**B) Server Component (✅ 추천)**:
```typescript
// 서버에서 실행, SEO 좋음, 빠름
export default async function Page() {
  const data = await fetch('/api/data');
  return <div>{data}</div>;
}
```
장점:
- 서버에서 미리 데이터 준비
- SEO 최적화
- 빠른 초기 로딩

**C) Client Component (✅ 필요시 사용)**:
```typescript
'use client'
import { useState, useEffect } from 'react';

// 브라우저에서 실행, 동적 업데이트
export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
  return <div>{data || '로딩 중...'}</div>;
}
```
장점:
- 사용자 행동에 반응
- 실시간 업데이트 가능

**A) 틀린 이유**:
```typescript
// ❌ Client Component는 async 불가!
'use client'
export default async function Page() {  // 에러!
  // ...
}
```

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/page.tsx`
- 라인: 31
- 설명: async Server Component 사용 예시

**언제 뭘 쓸까?**:
- **초기 데이터 로딩**: Server Component (B)
- **사용자 상호작용 후**: Client Component (C)

</details>

---

### 퀴즈 4: Server Component의 장점 (초급)

**문제**: Server Component의 주요 장점이 **아닌** 것은?

A) 번들 크기 감소
B) SEO 최적화
C) 빠른 사용자 상호작용
D) 보안 (비밀 정보 숨김)

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
Server Component는 서버에서 실행되므로 사용자 상호작용(클릭, 입력)에는 Client Component가 더 적합합니다.

**상세 설명**:

**A) 번들 크기 감소 (✅ 장점)**:
- Server Component 코드는 브라우저로 전송되지 않음
- JavaScript 번들이 작아져 로딩 속도 향상

**B) SEO 최적화 (✅ 장점)**:
- 서버에서 완성된 HTML 생성
- 검색 엔진이 내용을 읽을 수 있음

**C) 빠른 사용자 상호작용 (❌ 장점 아님)**:
- Server Component는 서버에서만 실행
- 사용자 이벤트(클릭, 입력)는 Client Component 필요

**D) 보안 (✅ 장점)**:
- API 키, DB 비밀번호 등을 서버에만 보관
- 브라우저로 전송되지 않음

**비교표**:
| 기능 | Server Component | Client Component |
|------|------------------|------------------|
| 번들 크기 | ✅ 작음 | ❌ 큼 |
| SEO | ✅ 좋음 | ❌ 나쁨 |
| 상호작용 | ❌ 불가 | ✅ 가능 |
| 보안 | ✅ 안전 | ⚠️ 주의 |

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/page.tsx`
- 라인: 1-16 (주석 참조)
- 설명: Server Component 장점 설명

</details>

---

### 퀴즈 5: Client Component가 필요한 경우 (초급)

**문제**: 다음 중 Client Component가 **반드시 필요한** 경우는?

A) 데이터베이스에서 데이터 조회
B) 버튼 클릭 이벤트 처리
C) 페이지 메타데이터 설정
D) 서버에서 API 호출

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
버튼 클릭 같은 사용자 이벤트는 브라우저에서만 발생하므로 Client Component가 필수입니다.

**상세 설명**:

**A) DB 조회 (Server Component)**:
```typescript
// ✅ Server Component로 충분
export default async function Page() {
  const products = await prisma.product.findMany();
  return <div>{products.length}개</div>;
}
```

**B) 버튼 클릭 (Client Component 필수)**:
```typescript
// ✅ 'use client' 필수!
'use client'

export default function DeleteButton() {
  const handleClick = () => {  // 이벤트 핸들러!
    alert('삭제!');
  };
  return <button onClick={handleClick}>삭제</button>;
}
```

**C) 메타데이터 (Server Component)**:
```typescript
// ✅ Server Component로 충분
export const metadata = {
  title: '제품 목록',
};

export default function Page() {
  return <div>제품 목록</div>;
}
```

**D) API 호출 (Server Component)**:
```typescript
// ✅ Server Component로 충분
export default async function Page() {
  const data = await serverFetch('/api/products');
  return <div>{data}</div>;
}
```

**Client Component가 필요한 경우**:
- ✅ onClick, onChange 등 이벤트
- ✅ useState, useEffect 같은 Hook
- ✅ 브라우저 API (localStorage, window 등)

**프로젝트 참조**:
- 파일: `src/components/trm/target-products/TargetProductList.tsx`
- 라인: 42, 91
- 설명: handleDelete 이벤트 핸들러 사용

</details>

---

### 퀴즈 6: 컴포넌트 구분 연습 (초급)

**문제**: 다음 컴포넌트를 Server/Client로 구분하세요.

```typescript
// 컴포넌트 A
export default async function ProductsPage() {
  const products = await serverFetch('/api/products');
  return <div>{products.length}</div>;
}

// 컴포넌트 B
'use client'
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

A는 _____, B는 _____

<details>
<summary>정답 보기</summary>

**정답**: A는 **Server Component**, B는 **Client Component**

**해설**:

**컴포넌트 A (Server Component)**:
```typescript
export default async function ProductsPage() {
  // ✅ async 함수
  // ✅ 'use client' 없음
  // ✅ await 사용
  const products = await serverFetch('/api/products');
  return <div>{products.length}</div>;
}
```
판단 근거:
- async 키워드 → Server Component
- 'use client' 없음 → Server Component
- await로 데이터 fetch → Server Component

**컴포넌트 B (Client Component)**:
```typescript
'use client'  // 👈 명시적 표시
import { useState } from 'react';

export default function Counter() {
  // ✅ useState 사용
  // ✅ onClick 이벤트
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```
판단 근거:
- 'use client' 지시어 → Client Component
- useState 사용 → Client Component
- onClick 이벤트 → Client Component

**빠른 판단법**:
1. 'use client'가 있나? → Client
2. async 함수인가? → Server
3. useState/useEffect 있나? → Client
4. onClick/onChange 있나? → Client
5. 아무것도 없나? → Server (기본)

**프로젝트 참조**:
- Server: `src/app/trm/target-products/page.tsx`
- Client: `src/components/trm/target-products/TargetProductList.tsx`

</details>

---

### 퀴즈 7: Props 전달 (초급)

**문제**: Server Component에서 Client Component로 데이터를 전달하는 방법은?

A) localStorage 사용
B) Props로 전달
C) 전역 변수 사용
D) API 호출로 다시 가져오기

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
Server Component에서 가져온 데이터를 Client Component에 전달할 때는 Props를 사용합니다.

**상세 설명**:

**올바른 방법 (Props 사용)**:
```typescript
// 1. Server Component에서 데이터 fetch
// src/app/products/page.tsx
export default async function ProductsPage() {
  const products = await serverFetch('/api/products');

  // 2. Props로 Client Component에 전달
  return <ProductList initialData={products} />;
}

// 3. Client Component에서 받기
// src/components/ProductList.tsx
'use client'

interface Props {
  initialData: Product[];
}

export default function ProductList({ initialData }: Props) {
  const [products, setProducts] = useState(initialData);
  return <div>{products.length}</div>;
}
```

**왜 다른 방법은 안 될까?**

**A) localStorage (❌)**:
- 서버에는 localStorage가 없음
- 브라우저 전용 API

**C) 전역 변수 (❌)**:
- Server/Client는 다른 환경
- 변수 공유 불가능

**D) API 재호출 (❌ 비효율)**:
- 중복 요청 발생
- 성능 낭비

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/page.tsx`
- 라인: 72
- 설명: Server Component에서 Client Component로 Props 전달

```typescript
// page.tsx (Server)
<TargetProductList initialData={products} />

// TargetProductList.tsx (Client)
interface TargetProductListProps {
  initialData: TargetProductListItemDto[];
}

export default function TargetProductList({ initialData }: TargetProductListProps) {
  const [products, setProducts] = useState(initialData);
  // ...
}
```

**패턴 정리**:
1. Server: 데이터 fetch
2. Server → Client: Props 전달
3. Client: useState로 상태 관리
4. Client: 이벤트 처리

</details>

---

### 퀴즈 8: 혼합 사용 패턴 (초급)

**문제**: 다음 설명 중 **틀린** 것은?

A) Server Component 안에 Client Component를 넣을 수 있다
B) Client Component 안에 Server Component를 넣을 수 있다
C) 한 페이지에 Server와 Client를 섞어 쓸 수 있다
D) 대부분은 Server Component로 만들고 필요한 부분만 Client로 만드는 게 좋다

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
Client Component 안에는 Server Component를 **직접** 넣을 수 없습니다. (children으로는 가능)

**상세 설명**:

**A) Server → Client (✅ 가능)**:
```typescript
// ✅ Server Component
export default async function Page() {
  const data = await fetch('/api/data');

  return (
    <div>
      <h1>서버 렌더링</h1>
      {/* ✅ Client Component 포함 가능 */}
      <ClientButton />
    </div>
  );
}
```

**B) Client → Server (❌ 직접 불가능)**:
```typescript
// ❌ Client Component
'use client'

export default function ClientWrapper() {
  return (
    <div>
      {/* ❌ Server Component 직접 import 불가! */}
      <ServerComponent />  // 에러!
    </div>
  );
}
```

하지만 children으로는 가능:
```typescript
// ✅ Client Component
'use client'

export default function ClientWrapper({ children }) {
  return (
    <div className="wrapper">
      {children}  {/* ✅ Server Component 가능 */}
    </div>
  );
}

// 사용
<ClientWrapper>
  <ServerComponent />  {/* ✅ 가능! */}
</ClientWrapper>
```

**C) 혼합 사용 (✅ 가능)**:
```typescript
export default async function Page() {
  return (
    <div>
      {/* Server 영역 */}
      <ServerStats />

      {/* Client 영역 */}
      <ClientForm />

      {/* Server 영역 */}
      <ServerFooter />
    </div>
  );
}
```

**D) 권장 패턴 (✅ 올바름)**:
- 기본은 Server Component (빠르고 가벼움)
- 상호작용 필요한 부분만 Client Component

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/page.tsx`
- 라인: 42-74
- 설명: Server Component 안에 Client Component(TargetProductList) 포함

**규칙 정리**:
```
Server Component
├─ ✅ Server Component
└─ ✅ Client Component
    ├─ ❌ Server Component (직접)
    ├─ ✅ Server Component (children)
    └─ ✅ Client Component
```

</details>

---

## 2. 기본 라우팅 (7개)

### 퀴즈 9: 파일 기반 라우팅 (초급)

**문제**: Next.js App Router에서 `/products` 경로를 만들려면 어떤 파일을 생성해야 하나요?

A) `pages/products.tsx`
B) `app/products/page.tsx`
C) `src/products/index.tsx`
D) `app/products.tsx`

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
Next.js App Router에서는 `app/` 디렉토리 안에 폴더를 만들고, 그 안에 `page.tsx` 파일을 만듭니다.

**상세 설명**:

**라우팅 규칙**:
```
app/
├─ page.tsx                    → /
├─ about/
│  └─ page.tsx                 → /about
├─ products/
│  ├─ page.tsx                 → /products
│  └─ [id]/
│     └─ page.tsx              → /products/123
└─ blog/
   ├─ page.tsx                 → /blog
   └─ [slug]/
      └─ page.tsx              → /blog/hello-world
```

**왜 다른 답은 틀렸을까?**

**A) `pages/products.tsx` (❌ Pages Router)**:
- Next.js 12 이전 방식
- App Router에서는 사용 안 함

**C) `src/products/index.tsx` (❌ 일반 React)**:
- Next.js 규칙이 아님

**D) `app/products.tsx` (❌ 파일명 틀림)**:
- 폴더 없이 파일만 있으면 라우트 생성 안 됨
- 반드시 `폴더/page.tsx` 형식

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/page.tsx`
- 경로: `/trm/target-products`
- 설명: app/trm/target-products/page.tsx가 라우트 생성

**파일명 규칙**:
- `page.tsx`: 페이지 컴포넌트
- `layout.tsx`: 레이아웃
- `loading.tsx`: 로딩 UI
- `error.tsx`: 에러 UI
- `not-found.tsx`: 404 페이지

</details>

---

### 퀴즈 10: 동적 라우팅 [id] (초급)

**문제**: `/products/123`과 `/products/456`처럼 동적인 ID를 받으려면?

A) `app/products/[id]/page.tsx`
B) `app/products/:id/page.tsx`
C) `app/products/{id}/page.tsx`
D) `app/products/$id/page.tsx`

<details>
<summary>정답 보기</summary>

**정답: A**

**해설**:
Next.js에서 동적 라우팅은 **대괄호 []** 를 사용합니다.

**상세 설명**:

**파일 구조**:
```
app/
└─ products/
   ├─ page.tsx           → /products (목록)
   └─ [id]/
      └─ page.tsx        → /products/123 (상세)
```

**[id] 파라미터 받기**:
```typescript
// app/products/[id]/page.tsx

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  // Next.js 15+에서는 params가 Promise!
  const { id } = await params;

  console.log(id);  // "123"

  return <div>제품 ID: {id}</div>;
}
```

**실제 URL 예시**:
- `/products/123` → id = "123"
- `/products/456` → id = "456"
- `/products/abc` → id = "abc"

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/[id]/page.tsx` (존재한다면)
- 경로: `/trm/target-products/123`
- 설명: [id] 폴더로 동적 라우팅 구현

**여러 개 파라미터**:
```
app/blog/[category]/[slug]/page.tsx
→ /blog/tech/hello-world
  category = "tech"
  slug = "hello-world"
```

**왜 다른 답은 틀렸을까?**
- **B) :id**: Express.js 스타일 (Next.js 아님)
- **C) {id}**: 템플릿 리터럴 스타일 (Next.js 아님)
- **D) $id**: PHP 스타일 (Next.js 아님)

</details>

---

### 퀴즈 11: Link 컴포넌트 (초급)

**문제**: Next.js에서 페이지 간 이동 시 사용하는 컴포넌트는?

A) `<a href="/products">`
B) `<Link href="/products">`
C) `<Navigate to="/products">`
D) `<Router path="/products">`

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
Next.js에서는 `<Link>` 컴포넌트를 사용해 클라이언트 사이드 네비게이션을 구현합니다.

**상세 설명**:

**올바른 사용법**:
```typescript
import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <Link href="/products">제품 목록</Link>
      <Link href="/products/123">제품 상세</Link>
    </div>
  );
}
```

**Link vs a 태그**:
```typescript
// ✅ Link: 빠름 (클라이언트 사이드)
<Link href="/products">
  제품 목록
</Link>
// → 페이지 새로고침 없음
// → 빠른 전환

// ❌ a 태그: 느림 (전체 페이지 로드)
<a href="/products">
  제품 목록
</a>
// → 전체 페이지 새로고침
// → 느린 전환
```

**Link의 장점**:
1. **빠름**: 전체 페이지 로드 안 함
2. **프리페치**: 미리 데이터 가져옴
3. **부드러운 전환**: 깜빡임 없음
4. **히스토리 관리**: 뒤로가기 작동

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/page.tsx`
- 라인: 53-58
- 설명: Link 컴포넌트로 "새 제품 등록" 버튼 구현

```typescript
<Link
  href={ROUTES.TRM.TARGET_PRODUCTS.NEW}
  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
>
  + 새 제품 등록
</Link>
```

**동적 경로와 함께 사용**:
```typescript
const productId = 123;

<Link href={`/products/${productId}`}>
  제품 #{productId} 보기
</Link>

// 또는 템플릿 리터럴
<Link href={ROUTES.TRM.TARGET_PRODUCTS.EDIT(productId)}>
  수정
</Link>
```

**언제 a 태그를 쓸까?**:
- 외부 사이트로 이동: `<a href="https://google.com">`
- 파일 다운로드: `<a href="/file.pdf" download>`

</details>

---

### 퀴즈 12: 라우트 그룹 (초급)

**문제**: `(trm)` 같은 괄호로 감싼 폴더의 역할은?

A) 동적 라우팅
B) 선택적 라우팅
C) 그룹화 (URL에 포함 안 됨)
D) 보호된 라우팅

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
괄호로 감싼 폴더는 **라우트 그룹**으로, URL에 포함되지 않고 폴더 구조만 정리하는 역할입니다.

**상세 설명**:

**라우트 그룹 사용 예시**:
```
app/
├─ (marketing)/          ← URL에 포함 안 됨!
│  ├─ about/
│  │  └─ page.tsx       → /about (marketing 없음!)
│  └─ contact/
│     └─ page.tsx       → /contact
└─ (shop)/               ← URL에 포함 안 됨!
   ├─ products/
   │  └─ page.tsx       → /products (shop 없음!)
   └─ cart/
      └─ page.tsx       → /cart
```

**왜 사용할까?**

**1) 폴더 정리**:
```
app/
├─ (auth)/
│  ├─ login/page.tsx    → /login
│  └─ signup/page.tsx   → /signup
└─ (dashboard)/
   ├─ profile/page.tsx  → /profile
   └─ settings/page.tsx → /settings
```

**2) 다른 레이아웃 적용**:
```
app/
├─ (marketing)/
│  ├─ layout.tsx        ← 마케팅 레이아웃
│  └─ about/page.tsx
└─ (app)/
   ├─ layout.tsx        ← 앱 레이아웃
   └─ dashboard/page.tsx
```

**프로젝트 참조**:
- 구조: `src/app/trm/target-products/page.tsx`
- 만약 `(trm)`이었다면: 경로는 `/target-products`
- 현재 `trm`: 경로는 `/trm/target-products`

**비교표**:
| 폴더 형식 | URL 포함 | 용도 |
|-----------|----------|------|
| `products/` | ✅ Yes | 일반 라우트 |
| `[id]/` | ✅ Yes (동적) | 동적 라우트 |
| `(group)/` | ❌ No | 그룹화 |

**실전 팁**:
```
// 좋은 그룹화 예시
app/
├─ (public)/           ← 인증 불필요
│  ├─ page.tsx
│  └─ about/page.tsx
└─ (private)/          ← 인증 필요
   ├─ dashboard/page.tsx
   └─ profile/page.tsx
```

</details>

---

### 퀴즈 13: 중첩 라우팅 (초급)

**문제**: `/blog/2024/hello-world` 경로를 만들려면?

A) `app/blog/2024/hello-world/page.tsx`
B) `app/blog/[year]/[slug]/page.tsx`
C) `app/blog-2024-hello-world/page.tsx`
D) 둘 다 A와 B 가능

<details>
<summary>정답 보기</summary>

**정답: D**

**해설**:
정적 경로(A)와 동적 경로(B) 모두 가능하며, 필요에 따라 선택합니다.

**상세 설명**:

**A) 정적 경로 (특정 경로만)**:
```
app/
└─ blog/
   └─ 2024/
      └─ hello-world/
         └─ page.tsx    → /blog/2024/hello-world
```
- 장점: 간단, 명확
- 단점: 다른 연도나 글마다 폴더 생성 필요

**B) 동적 경로 (모든 경로 처리)**:
```
app/
└─ blog/
   └─ [year]/
      └─ [slug]/
         └─ page.tsx    → /blog/2024/hello-world
                        → /blog/2025/new-post
```

```typescript
interface Props {
  params: Promise<{
    year: string;
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { year, slug } = await params;

  console.log(year);  // "2024"
  console.log(slug);  // "hello-world"

  return (
    <div>
      <h1>{year}년 글: {slug}</h1>
    </div>
  );
}
```

**언제 뭘 쓸까?**

**정적 경로 (A)가 좋을 때**:
- 고정된 페이지 (about, contact 등)
- 특별한 페이지 (terms, privacy 등)

**동적 경로 (B)가 좋을 때**:
- 데이터베이스에서 가져오는 콘텐츠
- 사용자가 생성하는 콘텐츠
- 많은 수의 비슷한 페이지

**혼합 사용**:
```
app/
└─ products/
   ├─ page.tsx           → /products (목록)
   ├─ featured/
   │  └─ page.tsx        → /products/featured (특별)
   └─ [id]/
      └─ page.tsx        → /products/123 (동적)
```

**프로젝트 참조**:
```
src/app/
└─ trm/
   └─ target-products/
      ├─ page.tsx        → /trm/target-products (목록)
      ├─ new/
      │  └─ page.tsx     → /trm/target-products/new (신규)
      └─ [id]/
         └─ page.tsx     → /trm/target-products/123 (상세)
```

</details>

---

### 퀴즈 14: 라우트 우선순위 (초급)

**문제**: 다음 구조에서 `/products/new`로 접근하면 어느 페이지가 보일까?

```
app/products/
├─ [id]/page.tsx
└─ new/page.tsx
```

A) `[id]/page.tsx` (id = "new")
B) `new/page.tsx`
C) 에러 발생
D) 둘 다 렌더링

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
Next.js는 **정적 라우트를 동적 라우트보다 우선**합니다.

**상세 설명**:

**우선순위 규칙**:
1. **정적 경로** (최우선)
2. **동적 경로** `[id]`
3. **Catch-all** `[...slug]`

**예시**:
```
app/products/
├─ new/page.tsx         → /products/new (우선!)
├─ featured/page.tsx    → /products/featured (우선!)
└─ [id]/page.tsx        → /products/123, /products/456 등
```

**동작 방식**:
```typescript
// 1. /products/new 요청
//    ↓
// 2. new/ 폴더가 있나? → ✅ 있음!
//    ↓
// 3. new/page.tsx 렌더링

// 4. /products/123 요청
//    ↓
// 5. 123/ 폴더가 있나? → ❌ 없음
//    ↓
// 6. [id]/page.tsx로 이동 (id = "123")
```

**프로젝트 예시**:
```
src/app/trm/target-products/
├─ page.tsx            → /trm/target-products
├─ new/
│  └─ page.tsx         → /trm/target-products/new ✅ 우선!
└─ [id]/
   └─ page.tsx         → /trm/target-products/123
```

`/trm/target-products/new`로 접근하면:
- `new/page.tsx` 렌더링 ✅
- `[id]/page.tsx`는 실행 안 됨

**주의사항**:
```
// ❌ 이런 구조는 문제!
app/products/
└─ [id]/page.tsx       → /products/new도 여기로!
└─ [id]/new/page.tsx   → 에러! (이미 [id]가 "new"를 가져감)

// ✅ 이렇게 구조 변경
app/products/
├─ new/page.tsx        → /products/new
└─ [id]/
   └─ page.tsx         → /products/123
```

**실전 팁**:
- 정적 페이지(new, edit)는 먼저 만들기
- 동적 라우트는 나머지를 처리하도록

</details>

---

### 퀴즈 15: params는 Promise (초급)

**문제**: Next.js 15+에서 params를 사용하는 올바른 방법은?

A) `const id = params.id;`
B) `const { id } = params;`
C) `const { id } = await params;`
D) `const id = await params.id;`

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
Next.js 15부터 params는 **Promise**이므로 반드시 `await`를 사용해야 합니다.

**상세 설명**:

**올바른 코드 (Next.js 15+)**:
```typescript
// 1. 타입 정의
interface Props {
  params: Promise<{ id: string }>;  // ← Promise!
}

// 2. params await 하기
export default async function ProductPage({ params }: Props) {
  const { id } = await params;  // ✅ await 필수!

  console.log(id);  // "123"

  return <div>제품 ID: {id}</div>;
}
```

**왜 Promise일까?**:
- 성능 최적화를 위해 비동기로 변경
- 라우팅 정보를 필요할 때만 로드

**틀린 예시**:
```typescript
// ❌ A: await 없이 바로 접근
export default async function Page({ params }) {
  const id = params.id;  // undefined!
  return <div>{id}</div>;
}

// ❌ B: 구조 분해만 하고 await 안 함
export default async function Page({ params }) {
  const { id } = params;  // Promise 객체!
  return <div>{id}</div>;  // [object Promise]
}

// ❌ D: params.id를 await
export default async function Page({ params }) {
  const id = await params.id;  // 에러!
  // params 전체를 await 해야 함
}
```

**searchParams도 Promise**:
```typescript
interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;  // ← 이것도 Promise!
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const { page } = await searchParams;

  console.log(id);    // "123"
  console.log(page);  // "2"

  return <div>제품 {id}, 페이지 {page}</div>;
}
```

**프로젝트 참조**:
- 파일: `src/app/api/target-products/[id]/route.ts`
- 확인: params를 await 하는 패턴

**Next.js 14 vs 15**:
```typescript
// Next.js 14 (이전)
export default function Page({ params }) {
  const { id } = params;  // ✅ 바로 사용
}

// Next.js 15+ (현재)
export default async function Page({ params }) {
  const { id } = await params;  // ✅ await 필수
}
```

**실전 팁**:
- TypeScript 타입에 `Promise<>` 추가
- `async` 함수로 만들기
- 항상 `await params` 먼저 하기

</details>

---

## 3. 데이터 흐름 기초 (8개)

### 퀴즈 16: 페이지 로딩 흐름 (초급)

**문제**: 사용자가 `/products` 페이지를 처음 방문할 때, 데이터가 흐르는 올바른 순서는?

A) 브라우저 → API → Service → DB
B) Page → serverFetch → API → Service → DB
C) DB → API → Page → 브라우저
D) Service → DB → API → Page

<details>
<summary>정답 보기</summary>

**정답: B** (요청 흐름)

**해설**:
데이터 흐름은 **요청**과 **응답** 두 단계로 나뉩니다.

**상세 설명**:

**1. 요청 흐름 (Request)**:
```
사용자 방문
  ↓
Page Component (Server)
  ↓
serverFetch() 호출
  ↓
API Route (/api/products)
  ↓
Service Layer
  ↓
Database (Prisma)
```

**2. 응답 흐름 (Response) - 역순!**:
```
Database (데이터 반환)
  ↓
Service (DTO 변환)
  ↓
API (JSON 응답)
  ↓
serverFetch (데이터 받기)
  ↓
Page Component (렌더링)
  ↓
브라우저로 HTML 전송
```

**코드로 보는 흐름**:
```typescript
// 1. Page Component
// src/app/trm/target-products/page.tsx
export default async function TargetProductsPage() {
  // 2. serverFetch 호출
  const products = await serverFetch<ProductDto[]>(
    ROUTES.API.TARGET_PRODUCTS.BASE  // '/api/target-products'
  );

  // 6. 데이터를 받아서 렌더링
  return <TargetProductList initialData={products} />;
}

// 3. API Route
// src/app/api/target-products/route.ts
export async function GET() {
  // 4. Service 호출
  const data = await targetProductService.findAll();

  return NextResponse.json({ success: true, data });
}

// 4. Service Layer
// src/lib/services/targetProduct.service.ts
async findAll() {
  // 5. Prisma로 DB 조회
  const products = await prisma.target_product.findMany();

  // 5. DTO 변환 후 반환
  return products.map(p => ({ /* DTO */ }));
}
```

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/page.tsx`
- 라인: 36-38
- 설명: serverFetch로 데이터 흐름 시작

**시간 순서**:
```
00ms: 사용자가 페이지 요청
10ms: Page Component 실행
20ms: serverFetch 호출
30ms: API Route 도달
40ms: Service Layer 실행
50ms: DB 쿼리 실행
60ms: DB 결과 반환
70ms: Service가 DTO 변환
80ms: API가 JSON 응답
90ms: serverFetch가 데이터 수신
100ms: Page가 HTML 생성
110ms: 브라우저에 HTML 전달
```

</details>

---

### 퀴즈 17: serverFetch란? (초급)

**문제**: serverFetch의 역할은?

A) 브라우저에서 API 호출
B) Server Component에서 내부 API 호출
C) 데이터베이스 직접 조회
D) 외부 API 호출 전용

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
serverFetch는 **Server Component**에서 **내부 API Route**를 호출하는 유틸리티 함수입니다.

**상세 설명**:

**serverFetch의 역할**:
```typescript
// src/lib/utils/serverFetch.ts
export async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // 1. 내부 API 전체 URL 생성
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}${endpoint}`;

  // 2. fetch 요청
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  // 3. 응답 처리
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}
```

**사용 예시**:
```typescript
// Server Component에서 사용
export default async function Page() {
  // ✅ 내부 API 호출
  const products = await serverFetch<Product[]>('/api/products');

  return <div>{products.length}개</div>;
}
```

**왜 serverFetch를 쓸까?**

**1) 타입 안전성**:
```typescript
// ✅ 타입 명시
const products = await serverFetch<ProductDto[]>('/api/products');
// products는 ProductDto[] 타입!

// ❌ fetch만 쓰면
const response = await fetch('/api/products');
const data = await response.json();
// data는 any 타입...
```

**2) 에러 처리 자동화**:
```typescript
// ✅ serverFetch: 에러 자동 처리
try {
  const data = await serverFetch('/api/products');
} catch (error) {
  // 에러가 이미 throw됨
}

// ❌ fetch: 수동 처리 필요
const response = await fetch('/api/products');
if (!response.ok) {
  throw new Error('실패');
}
const result = await response.json();
if (!result.success) {
  throw new Error(result.error);
}
```

**3) 코드 간결화**:
```typescript
// ✅ serverFetch: 1줄
const data = await serverFetch<Product[]>('/api/products');

// ❌ fetch: 5줄
const response = await fetch('http://localhost:3000/api/products');
const result = await response.json();
if (!result.success) throw new Error(result.error);
const data = result.data;
```

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/page.tsx`
- 라인: 36-38
- 설명: serverFetch로 제품 목록 조회

**주의사항**:
- ✅ Server Component에서만 사용
- ❌ Client Component에서는 일반 fetch 사용
- ✅ 내부 API 전용 (외부 API는 직접 fetch)

</details>

---

### 퀴즈 18: Props로 데이터 전달 (초급)

**문제**: 다음 빈칸을 채우세요.

```typescript
// Server Component
export default async function Page() {
  const data = await serverFetch('/api/products');

  return <ProductList ________={data} />;
}

// Client Component
'use client'

interface Props {
  ________: Product[];
}

export default function ProductList({ ________ }: Props) {
  const [products, setProducts] = useState(________);
  return <div>{products.length}</div>;
}
```

<details>
<summary>정답 보기</summary>

**정답**:
1. `initialData`
2. `initialData`
3. `initialData`
4. `initialData`

**해설**:
Server Component에서 가져온 데이터를 Client Component에 전달할 때는 Props를 사용하며, 보통 `initialData`라는 이름을 씁니다.

**상세 설명**:

**완성된 코드**:
```typescript
// 1. Server Component
export default async function Page() {
  const data = await serverFetch('/api/products');

  // Props로 전달
  return <ProductList initialData={data} />;
}

// 2. Client Component
'use client'

interface Props {
  initialData: Product[];  // 타입 정의
}

export default function ProductList({ initialData }: Props) {
  // 3. useState로 상태 관리 (초기값은 initialData)
  const [products, setProducts] = useState(initialData);

  return <div>{products.length}</div>;
}
```

**왜 initialData라고 부를까?**
- **initial**: "초기"라는 의미
- Server에서 받은 **최초 데이터**
- Client에서 **상태의 초기값**으로 사용

**전체 흐름**:
```typescript
// Step 1: Server에서 fetch
const data = await serverFetch('/api/products');
// data = [{ id: 1, name: '제품1' }, ...]

// Step 2: Props로 전달
<ProductList initialData={data} />

// Step 3: Client에서 받기
function ProductList({ initialData }) {
  // initialData = [{ id: 1, name: '제품1' }, ...]

  // Step 4: useState 초기화
  const [products, setProducts] = useState(initialData);
  // products = [{ id: 1, name: '제품1' }, ...]

  // Step 5: 이후 상태 업데이트 가능
  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };
}
```

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/page.tsx`
- 라인: 72
- 설명: Server → Client Props 전달

```typescript
// Server Component
const products = await serverFetch<TargetProductListItemDto[]>(
  ROUTES.API.TARGET_PRODUCTS.BASE
);

return <TargetProductList initialData={products} />;
```

- 파일: `src/components/trm/target-products/TargetProductList.tsx`
- 라인: 26-35
- 설명: Client Component에서 Props 받기

```typescript
interface TargetProductListProps {
  initialData: TargetProductListItemDto[];
}

export default function TargetProductList({ initialData }: TargetProductListProps) {
  const [products, setProducts] = useState(initialData);
  // ...
}
```

**다른 이름도 가능**:
```typescript
// data도 OK
<ProductList data={products} />

// items도 OK
<ProductList items={products} />

// 하지만 initialData가 의미가 명확!
<ProductList initialData={products} />
```

</details>

---

### 퀴즈 19: 데이터 흐름 시각화 (초급)

**문제**: 다음 데이터 흐름도에서 빈칸을 채우세요.

```
사용자 요청
  ↓
_____ Component (page.tsx)
  ↓
_____ (유틸리티)
  ↓
API Route
  ↓
_____ Layer
  ↓
Database
```

<details>
<summary>정답 보기</summary>

**정답**:
1. **Server**
2. **serverFetch**
3. **Service**

**해설**:
전형적인 Next.js App Router의 데이터 흐름 구조입니다.

**상세 설명**:

**완성된 흐름도**:
```
사용자 요청 (/products)
  ↓
Server Component (page.tsx)
  ↓
serverFetch (유틸리티)
  ↓
API Route (/api/products)
  ↓
Service Layer (productService)
  ↓
Database (Prisma)
  ↓
↓↓↓ 응답은 역순 ↓↓↓
  ↓
Database (결과 반환)
  ↓
Service Layer (DTO 변환)
  ↓
API Route (JSON 응답)
  ↓
serverFetch (파싱)
  ↓
Server Component (렌더링)
  ↓
브라우저 (HTML 표시)
```

**각 계층의 역할**:

**1. Server Component**:
```typescript
// 역할: 초기 데이터 로딩, HTML 생성
export default async function Page() {
  const data = await serverFetch('/api/products');
  return <div>{data}</div>;
}
```

**2. serverFetch**:
```typescript
// 역할: 내부 API 호출, 타입 안전성
const products = await serverFetch<Product[]>('/api/products');
```

**3. API Route**:
```typescript
// 역할: HTTP 요청 처리, 응답 반환
export async function GET() {
  const data = await service.findAll();
  return NextResponse.json({ success: true, data });
}
```

**4. Service Layer**:
```typescript
// 역할: 비즈니스 로직, DTO 변환
class ProductService {
  async findAll() {
    const products = await prisma.product.findMany();
    return products.map(p => ({ /* DTO */ }));
  }
}
```

**5. Database**:
```typescript
// 역할: 데이터 저장/조회
await prisma.product.findMany();
```

**프로젝트에서 확인**:
```
1. src/app/trm/target-products/page.tsx (Server Component)
2. src/lib/utils/serverFetch.ts (serverFetch)
3. src/app/api/target-products/route.ts (API Route)
4. src/lib/services/targetProduct.service.ts (Service)
5. prisma (Database)
```

**왜 이렇게 나눌까?**
- **관심사 분리**: 각 계층이 명확한 역할
- **재사용**: Service는 여러 API에서 사용 가능
- **테스트**: 각 계층을 독립적으로 테스트
- **유지보수**: 문제 발생 시 해당 계층만 수정

</details>

---

### 퀴즈 20: async/await 타이밍 (초급)

**문제**: 다음 코드의 실행 순서는?

```typescript
export default async function Page() {
  console.log('A');

  const data = await serverFetch('/api/products');

  console.log('B');

  return <div>{data.length}</div>;
}
```

A) A → B → API 호출
B) A → API 호출 → B
C) API 호출 → A → B
D) A와 B 동시 → API 호출

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
`await`는 비동기 작업이 **완료될 때까지 기다리므로**, 그 다음 줄은 작업 완료 후에 실행됩니다.

**상세 설명**:

**실행 순서**:
```typescript
export default async function Page() {
  console.log('A');           // 1. 즉시 실행

  const data = await serverFetch('/api/products');
  // 2. API 호출 시작
  // 3. 응답 기다림... (100ms)
  // 4. 응답 받음, data에 저장

  console.log('B');           // 5. 응답 받은 후 실행

  return <div>{data.length}</div>;  // 6. 렌더링
}
```

**타임라인**:
```
0ms:   console.log('A') 실행 ✅
1ms:   serverFetch 호출 시작
2ms:   API로 요청 전송
...    (기다림)
100ms: API 응답 받음
101ms: data 변수에 저장
102ms: console.log('B') 실행 ✅
103ms: JSX 반환
```

**await의 동작**:
```typescript
// await가 있으면
const data = await serverFetch('/api/products');
console.log('다음 줄');
// → serverFetch 완료 후 '다음 줄' 실행

// await가 없으면?
const promise = serverFetch('/api/products');
console.log('다음 줄');
// → 즉시 '다음 줄' 실행
// → promise는 아직 미완성 상태
```

**여러 개의 await**:
```typescript
export default async function Page() {
  console.log('1');

  const users = await fetch('/api/users');     // 100ms 대기
  console.log('2');

  const products = await fetch('/api/products');  // 100ms 대기
  console.log('3');

  return <div>완료</div>;
}

// 출력 순서: 1 → (100ms) → 2 → (100ms) → 3
// 총 200ms 소요
```

**병렬 실행 (더 빠름)**:
```typescript
export default async function Page() {
  console.log('1');

  // 동시에 시작!
  const [users, products] = await Promise.all([
    fetch('/api/users'),
    fetch('/api/products'),
  ]);

  console.log('2');

  return <div>완료</div>;
}

// 출력 순서: 1 → (100ms) → 2
// 총 100ms 소요 (더 빠름!)
```

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/page.tsx`
- 라인: 36
- 설명: await로 데이터 로딩 완료 후 렌더링

**실전 팁**:
- await는 순차 실행
- 독립적인 요청은 Promise.all로 병렬 실행
- 의존 관계가 있으면 순차 실행

</details>

---

### 퀴즈 21: 응답 흐름 추적 (초급)

**문제**: API가 데이터를 반환한 후, 어느 순서로 거쳐서 브라우저에 도달하나요?

```
Database → _____ → _____ → _____ → Browser
```

A) Service → API → Page
B) API → Service → Page
C) Page → API → Service
D) Service → Page → API

<details>
<summary>정답 보기</summary>

**정답: A**

**해설**:
응답은 요청의 **역순**으로 흐릅니다.

**상세 설명**:

**전체 흐름 (요청 + 응답)**:
```
요청 (Request) ↓
────────────────────
Page Component
  ↓
serverFetch
  ↓
API Route
  ↓
Service Layer
  ↓
Database
────────────────────
응답 (Response) ↑
────────────────────
Database (데이터 반환)
  ↓
Service (DTO 변환)
  ↓
API (JSON 응답)
  ↓
serverFetch (파싱)
  ↓
Page (렌더링)
  ↓
Browser (HTML 표시)
```

**코드로 추적**:
```typescript
// 5. Database에서 결과 반환
// prisma가 실행
const dbResult = [
  { id: 1, name: '제품1', ... },
  { id: 2, name: '제품2', ... },
];

// 4. Service Layer에서 DTO 변환
// targetProduct.service.ts
async findAll() {
  const products = await prisma.target_product.findMany();

  // DTO 변환
  return products.map(p => ({
    target_product_id: p.target_product_id,
    target_product_name: p.target_product_name,
    // ...
  }));
}

// 3. API Route에서 JSON 응답
// api/target-products/route.ts
export async function GET() {
  const data = await targetProductService.findAll();

  // JSON으로 응답
  return NextResponse.json({
    success: true,
    data,  // ← Service에서 받은 DTO
  });
}

// 2. serverFetch에서 파싱
// serverFetch.ts
const response = await fetch(url);
const result = await response.json();
// result = { success: true, data: [...] }

return result.data;  // ← data 부분만 추출

// 1. Page Component에서 렌더링
// page.tsx
export default async function Page() {
  const products = await serverFetch('/api/products');
  // products = [{ target_product_id: 1, ... }, ...]

  // HTML 생성
  return <ProductList initialData={products} />;
}

// 0. Browser에 HTML 전송
// Next.js가 자동으로 처리
```

**데이터 변환 추적**:
```
Database:
  [{ id: 1, product_name: '제품1', created_at: Date, ... }]
    ↓
Service (DTO 변환):
  [{ target_product_id: 1, target_product_name: '제품1', ... }]
    ↓
API (JSON 래핑):
  { success: true, data: [{ target_product_id: 1, ... }] }
    ↓
serverFetch (data 추출):
  [{ target_product_id: 1, target_product_name: '제품1', ... }]
    ↓
Page (HTML 생성):
  <div>제품1</div>
    ↓
Browser (렌더링):
  화면에 "제품1" 표시
```

**프로젝트 참조**:
1. `src/lib/services/targetProduct.service.ts` (Service)
2. `src/app/api/target-products/route.ts` (API)
3. `src/lib/utils/serverFetch.ts` (serverFetch)
4. `src/app/trm/target-products/page.tsx` (Page)

**왜 역순일까?**
- 함수 호출은 **스택(Stack)** 구조
- 나중에 호출된 것이 먼저 반환
- DB → Service → API → Page 순으로 return

</details>

---

### 퀴즈 22: 에러 발생 시 흐름 (초급)

**문제**: Service Layer에서 에러가 발생하면 어디로 전달되나요?

A) 바로 브라우저로
B) API Route → Page
C) Page → 브라우저
D) Database로

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
에러도 응답 흐름을 따라 **역순**으로 전달됩니다.

**상세 설명**:

**에러 발생 흐름**:
```
Service에서 에러 throw
  ↓
API Route에서 catch
  ↓
에러 응답 (JSON)
  ↓
serverFetch에서 받음
  ↓
Page에서 처리 (또는 에러 전파)
  ↓
브라우저에 표시
```

**코드로 보는 에러 흐름**:
```typescript
// 1. Service에서 에러 발생
// targetProduct.service.ts
async findById(id: number) {
  const product = await prisma.target_product.findUnique({
    where: { id },
  });

  if (!product) {
    // 🔥 에러 throw!
    throw new NotFoundError(`ID ${id}를 찾을 수 없습니다`);
  }

  return product;
}

// 2. API Route에서 catch
// api/target-products/[id]/route.ts
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const data = await targetProductService.findById(Number(id));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    // 🔥 에러를 잡아서 JSON으로 응답
    console.error('에러:', error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: error instanceof NotFoundError ? 404 : 500 }
    );
  }
}

// 3. serverFetch에서 에러 감지
// serverFetch.ts
const result = await response.json();

if (!result.success) {
  // 🔥 에러를 throw
  throw new Error(result.error);
}

// 4. Page에서 처리 (선택)
// page.tsx
try {
  const product = await serverFetch(`/api/products/${id}`);
  return <div>{product.name}</div>;
} catch (error) {
  // 🔥 에러 처리
  return <div>에러: {error.message}</div>;
}
```

**에러 타입별 흐름**:

**NotFoundError (404)**:
```
Service: throw new NotFoundError()
  ↓
API: catch → 404 응답
  ↓
serverFetch: throw Error
  ↓
Page: catch → 에러 UI
```

**ValidationError (400)**:
```
Service: throw new ValidationError()
  ↓
API: catch → 400 응답
  ↓
serverFetch: throw Error
  ↓
Page: catch → 유효성 검사 실패 메시지
```

**Database Error (500)**:
```
Prisma: DB 연결 실패
  ↓
Service: 에러 전파
  ↓
API: catch → 500 응답
  ↓
serverFetch: throw Error
  ↓
Page: catch → 일반 에러 메시지
```

**프로젝트 참조**:
- 파일: `src/lib/services/targetProduct.service.ts`
- 라인: 74-76
- 설명: NotFoundError throw

```typescript
if (!product) {
  throw new NotFoundError(`ID ${id}에 해당하는 타겟제품군을 찾을 수 없습니다`);
}
```

**에러 처리 패턴**:
```typescript
// Service: 명확한 에러 throw
throw new NotFoundError('...');
throw new ValidationError('...');

// API: 적절한 HTTP 상태 코드
return NextResponse.json(
  { success: false, error: '...' },
  { status: 404 | 400 | 500 }
);

// Page/Client: 사용자에게 친절한 메시지
alert('해당 제품을 찾을 수 없습니다');
```

</details>

---

### 퀴즈 23: 데이터 변환 (DTO) (초급)

**문제**: Service Layer에서 DTO로 변환하는 이유는?

A) 데이터 크기를 줄이기 위해
B) 필요한 필드만 선택하고 민감한 정보 숨기기
C) 더 빠르게 만들기 위해
D) 타입 에러를 방지하기 위해

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
DTO(Data Transfer Object)는 **필요한 데이터만 선택**하고, **민감한 정보를 숨기는** 역할을 합니다.

**상세 설명**:

**DTO 변환 전후 비교**:
```typescript
// ❌ 변환 전 (DB 모델 그대로)
{
  target_product_id: 1,
  target_product_name: '제품1',
  target_product_line_id: 5,
  deployment_date: Date('2024-01-01'),
  created_at: Date('2023-12-01'),    // ← 불필요
  updated_at: Date('2024-01-15'),    // ← 불필요
  deleted_at: null,                   // ← 민감
  created_by: 'admin@example.com',    // ← 민감
  internal_notes: '내부 메모...',      // ← 민감
}

// ✅ 변환 후 (DTO)
{
  target_product_id: 1,
  target_product_name: '제품1',
  deployment_date: '2024-01-01',    // Date → String
  productLine: {                     // ← 관계 데이터 포함
    target_division: '사업부1',
    target_product_line: '제품군1',
  },
}
```

**Service에서 DTO 변환**:
```typescript
// targetProduct.service.ts
async findAll() {
  // 1. DB에서 모든 데이터 조회
  const products = await prisma.target_product.findMany({
    include: {
      productLine: true,
    },
  });

  // 2. DTO로 변환 (필요한 것만)
  return products.map((product) => ({
    target_product_id: product.target_product_id,
    target_product_name: product.target_product_name,
    deployment_date: product.deployment_date.toISOString(),
    productLine: {
      target_division: product.productLine.target_division,
      target_product_line: product.productLine.target_product_line,
    },
    // created_at, updated_at, internal_notes 등은 제외!
  }));
}
```

**DTO의 장점**:

**1) 보안 (민감 정보 숨김)**:
```typescript
// ❌ 위험: DB 모델 그대로
return users;  // password 필드 노출!

// ✅ 안전: DTO로 변환
return users.map(u => ({
  id: u.id,
  name: u.name,
  email: u.email,
  // password는 제외!
}));
```

**2) 필드 선택 (필요한 것만)**:
```typescript
// 목록에서는 간단한 정보만
interface ProductListItemDto {
  id: number;
  name: string;
}

// 상세에서는 모든 정보
interface ProductDetailDto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  // ...
}
```

**3) 데이터 형식 변환**:
```typescript
return {
  // Date → String
  deployment_date: product.deployment_date.toISOString(),

  // Number → String (긴 ID)
  id: product.id.toString(),

  // 관계 데이터 평탄화
  divisionName: product.productLine.division.name,
};
```

**프로젝트 참조**:
- 파일: `src/lib/services/targetProduct.service.ts`
- 라인: 55-60
- 설명: DTO 변환 예시

```typescript
return products.map((product) => ({
  target_product_id: product.target_product_id,
  target_product_name: product.target_product_name,
  deployment_date: product.deployment_date.toISOString(),
  productLine: product.productLine,
}));
```

**다른 답이 틀린 이유**:
- **A) 크기 감소**: 부수적 효과일 뿐, 주목적 아님
- **C) 속도**: 크게 영향 없음
- **D) 타입 에러**: TypeScript가 담당

**실전 원칙**:
- 항상 Service에서 DTO 변환
- 민감한 정보는 절대 반환 안 함
- 필요한 것만 선택적으로 반환

</details>

---

## 5. 기본 타입과 DTO (6개)

### 퀴즈 31: interface 정의 (초급)

**문제**: TypeScript에서 객체의 형태를 정의하는 키워드는?

A) class
B) interface
C) type
D) object

<details>
<summary>정답 보기</summary>

**정답: B (또는 C도 가능)**

**해설**:
`interface`는 객체의 형태(shape)를 정의하는 TypeScript 키워드입니다. `type`도 비슷한 용도로 사용 가능합니다.

**상세 설명**:

**interface 사용**:
```typescript
// ✅ interface로 객체 형태 정의
interface Product {
  id: number;
  name: string;
  price: number;
}

// 사용
const product: Product = {
  id: 1,
  name: '제품1',
  price: 10000,
};
```

**type vs interface**:
```typescript
// interface
interface Product {
  id: number;
  name: string;
}

// type (같은 효과)
type Product = {
  id: number;
  name: string;
};

// 둘 다 사용 가능!
const p1: Product = { id: 1, name: '제품1' };
```

**interface의 장점**:
```typescript
// 1. 확장 가능
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const dog: Dog = {
  name: '바둑이',
  breed: '진돗개',
};

// 2. 선언 병합 (Declaration Merging)
interface User {
  name: string;
}

interface User {
  age: number;
}

// 자동으로 병합됨
const user: User = {
  name: '홍길동',
  age: 30,
};
```

**프로젝트 참조**:
- 파일: `src/lib/types/targetProduct.types.ts`
- 라인: 8-12
- 설명: interface로 DTO 정의

```typescript
export interface CreateTargetProductDto {
  target_product_line_id: number;
  target_product_name: string;
  deployment_date: string;
}
```

**함수 타입**:
```typescript
// 함수 매개변수와 반환값
interface ApiResponse {
  success: boolean;
  data: any;
}

async function fetchProducts(): Promise<ApiResponse> {
  // ...
}
```

**중첩 객체**:
```typescript
interface Product {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
}

const product: Product = {
  id: 1,
  name: '제품1',
  category: {
    id: 10,
    name: '전자제품',
  },
};
```

**언제 interface를 쓸까?**:
- 객체 형태 정의
- API 요청/응답 타입
- DTO (Data Transfer Object)
- Props 타입

</details>

---

### 퀴즈 32: Optional 필드 (초급)

**문제**: 다음 중 선택적(optional) 필드를 나타내는 기호는?

```typescript
interface UpdateProduct {
  id: number;
  name___ string;
  price___ number;
}
```

A) `!`
B) `?`
C) `*`
D) `~`

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
`?`는 TypeScript에서 선택적(optional) 필드를 나타내며, 해당 필드가 없어도 됩니다.

**상세 설명**:

**Optional 필드 사용**:
```typescript
// ✅ ? 로 선택적 필드 표시
interface UpdateProductDto {
  id: number;          // 필수
  name?: string;       // 선택적
  price?: number;      // 선택적
  description?: string; // 선택적
}

// 모두 유효함
const update1: UpdateProductDto = {
  id: 1,
  name: '제품1',
  price: 10000,
};

const update2: UpdateProductDto = {
  id: 1,
  name: '제품1',
  // price 없어도 OK
};

const update3: UpdateProductDto = {
  id: 1,
  // name, price 모두 없어도 OK
};
```

**필수 vs 선택적**:
```typescript
interface CreateProductDto {
  // 필수 필드 (반드시 있어야 함)
  name: string;
  price: number;

  // 선택적 필드 (없어도 됨)
  description?: string;
  image?: string;
}

// ✅ 유효
const product: CreateProductDto = {
  name: '제품1',
  price: 10000,
  // description, image 없어도 OK
};

// ❌ 에러: name과 price는 필수!
const invalid: CreateProductDto = {
  description: '설명',
};
```

**프로젝트 참조**:
- 파일: `src/lib/types/targetProduct.types.ts`
- 라인: 17-21
- 설명: UpdateDto에서 모든 필드 optional

```typescript
export interface UpdateTargetProductDto {
  target_product_line_id?: number;   // 선택적
  target_product_name?: string;      // 선택적
  deployment_date?: string;          // 선택적
}

// 부분 수정 가능
const update1 = { target_product_name: '새 이름' };  // ✅
const update2 = { deployment_date: '2024-01-01' };  // ✅
const update3 = { /* 빈 객체도 OK */ };  // ✅
```

**함수 파라미터에도**:
```typescript
function createProduct(
  name: string,          // 필수
  price: number,         // 필수
  description?: string   // 선택적
) {
  console.log(name, price);

  if (description) {
    console.log(description);
  }
}

// 사용
createProduct('제품1', 10000);  // ✅
createProduct('제품1', 10000, '설명');  // ✅
```

**undefined와의 차이**:
```typescript
interface Example {
  // Optional: 필드가 없어도 됨
  optional?: string;

  // undefined 허용: 필드는 있어야 하지만 값이 undefined 가능
  nullable: string | undefined;
}

const ex1: Example = {
  // optional은 없어도 OK
  nullable: undefined,  // 필드는 있어야 함
};

const ex2: Example = {
  optional: '값',
  nullable: undefined,
};
```

**Partial 유틸리티 타입**:
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

// 모든 필드를 optional로 변환
type PartialProduct = Partial<Product>;

// 같은 의미
interface PartialProduct {
  id?: number;
  name?: string;
  price?: number;
}
```

</details>

---

### 퀴즈 33: DTO란? (초급)

**문제**: DTO(Data Transfer Object)의 주요 목적은?

A) 데이터베이스 스키마 정의
B) 계층 간 데이터 전송 형식 정의
C) 클래스 상속 구조 정의
D) 알고리즘 최적화

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
DTO는 **계층 간 데이터 전송**을 위한 객체로, API와 클라이언트, Service와 API 사이의 데이터 형식을 정의합니다.

**상세 설명**:

**DTO의 역할**:
```
Client ←→ API ←→ Service ←→ Database
       DTO1      DTO2       DB Model

- DTO1: API와 Client 간 통신
- DTO2: API와 Service 간 통신
- DB Model: Database 스키마
```

**Create DTO (생성)**:
```typescript
// 클라이언트 → 서버로 전송
export interface CreateProductDto {
  name: string;
  price: number;
  category_id: number;
}

// 사용
const newProduct: CreateProductDto = {
  name: '새 제품',
  price: 10000,
  category_id: 5,
};

await fetch('/api/products', {
  method: 'POST',
  body: JSON.stringify(newProduct),
});
```

**Update DTO (수정)**:
```typescript
// 부분 수정을 위해 모든 필드 optional
export interface UpdateProductDto {
  name?: string;
  price?: number;
  category_id?: number;
}

// 이름만 수정
const update: UpdateProductDto = {
  name: '수정된 이름',
};
```

**Response DTO (응답)**:
```typescript
// 서버 → 클라이언트로 전송
export interface ProductResponseDto {
  id: number;
  name: string;
  price: number;
  created_at: string;  // Date → string 변환
  category: {
    id: number;
    name: string;
  };
  // password, internal_notes 등은 제외
}
```

**List DTO (목록)**:
```typescript
// 목록 조회 시 간단한 정보만
export interface ProductListItemDto {
  id: number;
  name: string;
  price: number;
  // 상세 정보는 제외
}

// 상세 조회 시 모든 정보
export interface ProductDetailDto {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: CategoryDto;
  // 등등...
}
```

**프로젝트 참조**:
- 파일: `src/lib/types/targetProduct.types.ts`
- 전체 파일
- 설명: 다양한 DTO 정의

```typescript
// 생성용
export interface CreateTargetProductDto {
  target_product_line_id: number;
  target_product_name: string;
  deployment_date: string;
}

// 수정용 (모두 optional)
export interface UpdateTargetProductDto {
  target_product_line_id?: number;
  target_product_name?: string;
  deployment_date?: string;
}

// 응답용 (상세)
export interface TargetProductResponseDto {
  target_product_id: number;
  target_product_line_id: number;
  target_product_name: string;
  deployment_date: string;
  productLine: { /* 관계 데이터 */ };
}

// 목록용 (간단)
export interface TargetProductListItemDto {
  target_product_id: number;
  target_product_name: string;
  deployment_date: string;
  productLine: { /* 필요한 것만 */ };
}
```

**DTO의 장점**:

**1) 보안**:
```typescript
// ❌ DB 모델 그대로 (위험)
return user;  // password 포함!

// ✅ DTO로 필터링 (안전)
return {
  id: user.id,
  name: user.name,
  email: user.email,
  // password 제외!
};
```

**2) 유연성**:
```typescript
// DB 모델
interface User {
  id: number;
  first_name: string;
  last_name: string;
}

// DTO (합쳐서 전송)
interface UserDto {
  id: number;
  fullName: string;  // first_name + last_name
}
```

**3) 버전 관리**:
```typescript
// V1 API
interface ProductDtoV1 {
  id: number;
  name: string;
}

// V2 API (필드 추가)
interface ProductDtoV2 {
  id: number;
  name: string;
  description: string;  // 새 필드
}
```

</details>

---

### 퀴즈 34: 타입 안전성 (초급)

**문제**: TypeScript의 타입 시스템이 주는 장점은?

A) 실행 속도 향상
B) 컴파일 시점에 에러 발견
C) 번들 크기 감소
D) 자동 코드 최적화

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
TypeScript는 **컴파일 시점**(코드 작성 중)에 타입 에러를 발견하여 런타임 에러를 예방합니다.

**상세 설명**:

**타입 에러 조기 발견**:
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

// ❌ 컴파일 에러: 'nmae'는 존재하지 않음
const product: Product = {
  id: 1,
  nmae: '제품1',  // 오타!
  price: 10000,
};

// IDE가 빨간 줄로 즉시 표시!
```

**함수 파라미터 검증**:
```typescript
function createProduct(data: CreateProductDto) {
  // data는 CreateProductDto 타입!
  console.log(data.name);   // ✅
  console.log(data.price);  // ✅
  console.log(data.invalid);  // ❌ 컴파일 에러!
}

// ❌ 잘못된 인자
createProduct({
  name: '제품1',
  // price 누락! → 컴파일 에러
});

// ✅ 올바른 인자
createProduct({
  name: '제품1',
  price: 10000,
});
```

**자동완성 (IntelliSense)**:
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

const product: Product = {
  // IDE가 자동으로 필드 제안!
  // id, name, price가 목록에 나타남
};

product.  // 점을 찍으면 id, name, price 자동완성
```

**타입 추론**:
```typescript
// 타입을 명시하지 않아도 추론됨
const products = await serverFetch<Product[]>('/api/products');

// products는 Product[] 타입
products.forEach(p => {
  console.log(p.name);   // ✅ 자동완성
  console.log(p.price);  // ✅ 자동완성
  console.log(p.invalid);  // ❌ 에러!
});
```

**프로젝트에서의 타입 안전성**:
```typescript
// src/lib/services/targetProduct.service.ts

// 반환 타입 명시
async findAll(): Promise<TargetProductListItemDto[]> {
  const products = await prisma.target_product.findMany();

  return products.map((product) => ({
    target_product_id: product.target_product_id,
    target_product_name: product.target_product_name,
    deployment_date: product.deployment_date.toISOString(),
    productLine: product.productLine,
  }));
  // 반환값이 TargetProductListItemDto[]와 맞지 않으면 에러!
}
```

**리팩토링 안전성**:
```typescript
// 타입 정의 변경
interface Product {
  id: number;
  name: string;
  // price: number;  // 삭제!
}

// 이 필드를 사용하는 모든 곳에서 에러 발생!
console.log(product.price);  // ❌ 즉시 에러
```

**런타임 vs 컴파일 타임**:
```javascript
// JavaScript (런타임 에러)
const product = {
  id: 1,
  name: '제품1',
};

console.log(product.price.toFixed(2));
// 실행해봐야 에러 발견: Cannot read property 'toFixed' of undefined

// TypeScript (컴파일 에러)
const product: Product = {
  id: 1,
  name: '제품1',
  // price 누락 → 코드 작성 중 에러 발견!
};

console.log(product.price.toFixed(2));
// 작성하는 순간 IDE가 에러 표시!
```

**다른 답이 틀린 이유**:
- **A) 실행 속도**: TypeScript는 JavaScript로 변환되므로 속도는 동일
- **C) 번들 크기**: 타입은 컴파일 후 제거되므로 크기 동일
- **D) 최적화**: 타입 시스템은 최적화와 무관

**실전 장점**:
1. **버그 예방**: 실행 전에 에러 발견
2. **자동완성**: 개발 속도 향상
3. **리팩토링 안전**: 영향 범위 즉시 파악
4. **문서화**: 타입 자체가 문서 역할

</details>

---

### 퀴즈 35: 배열 타입 (초급)

**문제**: Product 객체의 배열 타입을 정의하는 올바른 방법은?

A) `Array<Product>`
B) `Product[]`
C) `[Product]`
D) A와 B 모두 가능

<details>
<summary>정답 보기</summary>

**정답: D**

**해설**:
`Product[]`와 `Array<Product>`는 모두 올바른 배열 타입 정의 방법이며, 같은 의미입니다.

**상세 설명**:

**두 가지 방식**:
```typescript
interface Product {
  id: number;
  name: string;
}

// 방법 1: 대괄호 []
const products1: Product[] = [
  { id: 1, name: '제품1' },
  { id: 2, name: '제품2' },
];

// 방법 2: Array<>
const products2: Array<Product> = [
  { id: 1, name: '제품1' },
  { id: 2, name: '제품2' },
];

// 둘 다 완전히 같음!
```

**관례**:
```typescript
// ✅ 간단한 타입: [] 사용 (더 일반적)
const numbers: number[] = [1, 2, 3];
const strings: string[] = ['a', 'b', 'c'];
const products: Product[] = [/* ... */];

// ✅ 복잡한 제네릭: Array<> 사용
const matrix: Array<Array<number>> = [[1, 2], [3, 4]];
const complex: Array<Product | Category> = [/* ... */];
```

**함수 반환 타입**:
```typescript
// ✅ 둘 다 가능
async function getProducts1(): Promise<Product[]> {
  return [];
}

async function getProducts2(): Promise<Array<Product>> {
  return [];
}
```

**프로젝트 참조**:
- 파일: `src/lib/services/targetProduct.service.ts`
- 라인: 36
- 설명: 배열 타입 반환

```typescript
async findAll(): Promise<TargetProductListItemDto[]> {
  // 반환: TargetProductListItemDto 배열
  const products = await prisma.target_product.findMany();
  return products.map(/* ... */);
}
```

**다차원 배열**:
```typescript
// 2차원 배열
const matrix1: number[][] = [[1, 2], [3, 4]];
const matrix2: Array<Array<number>> = [[1, 2], [3, 4]];

// 3차원 배열
const cube: number[][][] = [[[1]]];
```

**빈 배열 초기화**:
```typescript
// ✅ 타입 명시
const products: Product[] = [];

// ❌ 타입 추론 안 됨
const products = [];  // any[]
products.push({ id: 1, name: '제품1' });  // 에러 없음 (위험!)

// ✅ 제네릭 사용
const products = Array<Product>();
```

**배열 메서드 타입 안전**:
```typescript
const products: Product[] = [
  { id: 1, name: '제품1', price: 1000 },
  { id: 2, name: '제품2', price: 2000 },
];

// map: 타입 추론됨
const names: string[] = products.map(p => p.name);
const prices: number[] = products.map(p => p.price);

// filter: 타입 유지
const filtered: Product[] = products.filter(p => p.price > 1500);

// find: Product | undefined
const found: Product | undefined = products.find(p => p.id === 1);
```

**C) [Product]가 틀린 이유**:
```typescript
// ❌ [Product]: 튜플 (정확히 1개 요소)
const tuple: [Product] = [{ id: 1, name: '제품1' }];
tuple.push({ id: 2, name: '제품2' });  // 에러!

// ✅ Product[]: 배열 (0개 이상)
const array: Product[] = [];
array.push({ id: 1, name: '제품1' });  // ✅
array.push({ id: 2, name: '제품2' });  // ✅
```

**튜플 타입**:
```typescript
// 튜플: 정해진 개수와 타입
const tuple: [number, string] = [1, '제품1'];

// 배열: 가변 개수
const array: number[] = [1, 2, 3, 4, 5, /* ... */];
```

</details>

---

### 퀴즈 36: 타입 재사용 (초급)

**문제**: 다른 파일에서 정의한 타입을 사용하려면?

A) `import type { Product } from './types'`
B) `import { Product } from './types'`
C) `include './types'`
D) A와 B 모두 가능

<details>
<summary>정답 보기</summary>

**정답: D**

**해설**:
TypeScript에서는 `import` 또는 `import type` 둘 다 사용 가능하며, `import type`이 타입 전용 import임을 명시합니다.

**상세 설명**:

**타입 import 방식**:
```typescript
// types.ts
export interface Product {
  id: number;
  name: string;
}

export type ProductId = number;

// ─────────────────────────────

// otherFile.ts

// 방법 1: import (일반)
import { Product, ProductId } from './types';

// 방법 2: import type (타입 전용)
import type { Product, ProductId } from './types';

// 둘 다 사용 가능!
const product: Product = { id: 1, name: '제품1' };
```

**import type의 장점**:
```typescript
// import type: 컴파일 후 완전히 제거됨
import type { Product } from './types';

// 컴파일 후 JavaScript:
// (import 문이 사라짐)

// import (일반): 값도 import 가능
import { Product, getProduct } from './types';

// 컴파일 후 JavaScript:
import { getProduct } from './types';
// (getProduct 함수만 남음, Product 타입은 제거)
```

**프로젝트에서의 사용**:
```typescript
// src/app/trm/target-products/page.tsx
import { TargetProductListItemDto } from '@/lib/types/targetProduct.types';

// src/components/trm/target-products/TargetProductList.tsx
import { TargetProductListItemDto } from '@/lib/types/targetProduct.types';

// src/lib/services/targetProduct.service.ts
import {
  CreateTargetProductDto,
  UpdateTargetProductDto,
  TargetProductResponseDto,
  TargetProductListItemDto,
} from '../types/targetProduct.types';
```

**여러 개 import**:
```typescript
// 개별 import
import { Product } from './types';
import { Category } from './types';
import { User } from './types';

// 한 번에 import (권장)
import { Product, Category, User } from './types';

// 전부 import
import * as Types from './types';
const product: Types.Product = { /* ... */ };
```

**alias 사용**:
```typescript
// 이름이 겹칠 때
import { Product as ProductType } from './types';

// 사용
const product: ProductType = { id: 1, name: '제품1' };
```

**경로 alias**:
```typescript
// tsconfig.json에서 설정
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// 사용
import { Product } from '@/lib/types/product.types';
import { service } from '@/lib/services/product.service';

// 상대 경로 대신 절대 경로처럼 사용
```

**export와 함께**:
```typescript
// types/index.ts (barrel export)
export { Product } from './product.types';
export { Category } from './category.types';
export { User } from './user.types';

// 다른 파일에서
import { Product, Category, User } from './types';
// types 폴더에서 한 번에 import!
```

**값과 타입 혼합**:
```typescript
// utils.ts
export interface Config {
  apiUrl: string;
}

export const defaultConfig: Config = {
  apiUrl: 'http://localhost:3000',
};

// 사용
import { Config, defaultConfig } from './utils';

const config: Config = defaultConfig;
```

**C) include가 틀린 이유**:
```typescript
// ❌ include는 존재하지 않음
include './types';  // 에러!

// ✅ import 사용
import { Product } from './types';
```

**실전 팁**:
- 타입만 import: `import type`
- 값과 타입 혼합: `import`
- 프로젝트 규칙 따르기
- 경로 alias 활용

</details>

---

## 6. Prisma 기초 (5개)

### 퀴즈 37: Prisma란? (초급)

**문제**: Prisma의 주요 역할은?

A) 프론트엔드 프레임워크
B) ORM (데이터베이스 접근 도구)
C) 테스트 라이브러리
D) CSS 프레임워크

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
Prisma는 **ORM(Object-Relational Mapping)** 도구로, TypeScript/JavaScript에서 데이터베이스를 쉽게 다룰 수 있게 해줍니다.

**상세 설명**:

**Prisma의 역할**:
```
Application (TypeScript)
        ↕
   Prisma ORM
        ↕
  Database (PostgreSQL, MySQL 등)
```

**SQL 없이 DB 접근**:
```typescript
// ❌ 직접 SQL 작성 (어려움)
const result = await db.query(`
  SELECT * FROM products
  WHERE price > 1000
  ORDER BY created_at DESC
`);

// ✅ Prisma (쉬움, 타입 안전)
const products = await prisma.product.findMany({
  where: {
    price: {
      gt: 1000,
    },
  },
  orderBy: {
    created_at: 'desc',
  },
});
```

**타입 안전성**:
```typescript
// Prisma가 자동으로 타입 생성!
const product = await prisma.product.findUnique({
  where: { id: 1 },
});

// product는 타입이 자동으로 추론됨
console.log(product.name);   // ✅ 자동완성
console.log(product.price);  // ✅ 자동완성
console.log(product.invalid);  // ❌ 컴파일 에러
```

**프로젝트에서의 사용**:
```typescript
// src/lib/services/targetProduct.service.ts
import prisma from '../prisma';

async findAll() {
  // Prisma로 DB 조회
  const products = await prisma.target_product.findMany({
    include: {
      productLine: true,
    },
    orderBy: {
      target_product_id: 'desc',
    },
  });

  return products;
}
```

**Prisma의 장점**:

**1) 타입 안전성**:
```typescript
// schema.prisma에서 자동 생성
model Product {
  id    Int    @id @default(autoincrement())
  name  String
  price Int
}

// TypeScript에서 타입 자동 완성
const product = await prisma.product.create({
  data: {
    name: '제품1',
    price: 10000,
    // 오타나 잘못된 필드 → 즉시 에러
  },
});
```

**2) 마이그레이션**:
```bash
# schema 변경 후
npx prisma migrate dev

# DB가 자동으로 업데이트됨
```

**3) 관계 처리**:
```typescript
// include로 관련 데이터 가져오기
const product = await prisma.product.findUnique({
  where: { id: 1 },
  include: {
    category: true,     // 카테고리 포함
    reviews: true,      // 리뷰 포함
  },
});

console.log(product.category.name);
console.log(product.reviews.length);
```

**기본 사용법**:
```typescript
// 전체 조회
const all = await prisma.product.findMany();

// 단건 조회
const one = await prisma.product.findUnique({
  where: { id: 1 },
});

// 생성
const created = await prisma.product.create({
  data: {
    name: '제품1',
    price: 10000,
  },
});

// 수정
const updated = await prisma.product.update({
  where: { id: 1 },
  data: {
    price: 12000,
  },
});

// 삭제
await prisma.product.delete({
  where: { id: 1 },
});
```

**프로젝트 참조**:
- 파일: `prisma/schema.prisma`
- 설명: DB 스키마 정의

- 파일: `src/lib/prisma.ts`
- 설명: Prisma Client 설정

</details>

---

### 퀴즈 38: schema.prisma (초급)

**문제**: `schema.prisma` 파일의 역할은?

A) 타입 정의 파일
B) 데이터베이스 스키마 정의
C) API 라우트 설정
D) 환경 변수 설정

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
`schema.prisma`는 데이터베이스의 **테이블 구조**를 정의하는 파일입니다.

**상세 설명**:

**schema.prisma 기본 구조**:
```prisma
// 데이터베이스 연결 설정
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Prisma Client 생성 설정
generator client {
  provider = "prisma-client-js"
}

// 모델 정의 (테이블)
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Int
  description String?
  created_at  DateTime @default(now())
}
```

**모델 = 데이터베이스 테이블**:
```prisma
model Product {
  // 필드명    타입      속성
  id          Int      @id @default(autoincrement())
  name        String
  price       Int
}

// SQL로 변환되면:
CREATE TABLE "Product" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "price" INTEGER NOT NULL
);
```

**프로젝트 참조**:
- 파일: `prisma/schema.prisma`
- 라인: 45-52
- 설명: Target_product 모델

```prisma
model Target_product {
  target_product_id      Int      @id @default(autoincrement())
  target_product_line_id Int
  target_product_name    String
  deployment_date        DateTime

  productLine Target_Product_Line @relation(fields: [target_product_line_id], references: [target_product_line_id])
}
```

**필드 타입**:
```prisma
model Example {
  // 숫자
  count     Int
  price     Float
  big_number BigInt

  // 문자
  name      String
  email     String

  // 날짜/시간
  created_at DateTime
  updated_at DateTime

  // 불린
  is_active Boolean

  // JSON
  metadata  Json

  // Optional (?)
  description String?
}
```

**속성 (Attributes)**:
```prisma
model Product {
  // @id: 기본 키
  id    Int @id

  // @default: 기본값
  created_at DateTime @default(now())

  // @autoincrement: 자동 증가
  id    Int @id @default(autoincrement())

  // @unique: 유일 값
  email String @unique

  // @updatedAt: 자동 업데이트 시간
  updated_at DateTime @updatedAt
}
```

**관계 (Relations)**:
```prisma
model Category {
  id       Int       @id @default(autoincrement())
  name     String
  products Product[]  // 1:N 관계
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  category_id Int

  // N:1 관계
  category Category @relation(fields: [category_id], references: [id])
}
```

**스키마 수정 후 마이그레이션**:
```bash
# 1. schema.prisma 수정
model Product {
  id          Int     @id @default(autoincrement())
  name        String
  description String  // 새 필드 추가!
}

# 2. 마이그레이션 실행
npx prisma migrate dev --name add_description

# 3. DB에 변경사항 반영됨
# 4. TypeScript 타입도 자동 생성됨
```

**스키마 → TypeScript 타입**:
```prisma
// schema.prisma
model Product {
  id    Int    @id
  name  String
  price Int
}

// 자동 생성된 TypeScript 타입
type Product = {
  id: number;
  name: string;
  price: number;
};
```

**실전 워크플로우**:
```
1. schema.prisma 수정
   ↓
2. npx prisma migrate dev
   ↓
3. DB 스키마 업데이트
   ↓
4. TypeScript 타입 자동 생성
   ↓
5. 코드에서 사용
```

</details>

---

### 퀴즈 39: findMany (초급)

**문제**: Prisma에서 모든 레코드를 조회하는 메서드는?

A) `prisma.product.getAll()`
B) `prisma.product.findMany()`
C) `prisma.product.selectAll()`
D) `prisma.product.find()`

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
Prisma에서 여러 레코드를 조회할 때는 `findMany()` 메서드를 사용합니다.

**상세 설명**:

**기본 사용법**:
```typescript
// 모든 제품 조회
const products = await prisma.product.findMany();

// SQL: SELECT * FROM Product;
```

**조건 (where)**:
```typescript
// 가격이 1000 이상인 제품
const products = await prisma.product.findMany({
  where: {
    price: {
      gte: 1000,  // greater than or equal
    },
  },
});

// SQL: SELECT * FROM Product WHERE price >= 1000;
```

**정렬 (orderBy)**:
```typescript
// 최신순 정렬
const products = await prisma.product.findMany({
  orderBy: {
    created_at: 'desc',
  },
});

// 여러 기준 정렬
const products = await prisma.product.findMany({
  orderBy: [
    { price: 'desc' },     // 가격 높은 순
    { created_at: 'asc' }, // 그 다음 오래된 순
  ],
});
```

**필드 선택 (select)**:
```typescript
// 특정 필드만 조회
const products = await prisma.product.findMany({
  select: {
    id: true,
    name: true,
    // price는 제외
  },
});

// 결과: { id: 1, name: '제품1' }
```

**관계 포함 (include)**:
```typescript
// 관련 데이터 함께 조회
const products = await prisma.product.findMany({
  include: {
    category: true,  // 카테고리 포함
    reviews: true,   // 리뷰 포함
  },
});

// 결과:
{
  id: 1,
  name: '제품1',
  category: { id: 10, name: '전자제품' },
  reviews: [{ id: 1, comment: '좋아요' }]
}
```

**프로젝트 참조**:
- 파일: `src/lib/services/targetProduct.service.ts`
- 라인: 39-51
- 설명: findMany 사용 예시

```typescript
async findAll(): Promise<TargetProductListItemDto[]> {
  const products = await prisma.target_product.findMany({
    include: {
      productLine: {
        select: {
          target_division: true,
          target_product_line: true,
        },
      },
    },
    orderBy: {
      target_product_id: 'desc',
    },
  });

  return products.map(/* DTO 변환 */);
}
```

**페이지네이션**:
```typescript
// 처음 10개
const products = await prisma.product.findMany({
  take: 10,
});

// 10개 건너뛰고 다음 10개
const products = await prisma.product.findMany({
  skip: 10,
  take: 10,
});

// 페이지 계산
const page = 2;
const pageSize = 10;

const products = await prisma.product.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
});
```

**복합 조건**:
```typescript
// AND 조건
const products = await prisma.product.findMany({
  where: {
    price: { gte: 1000 },
    stock: { gt: 0 },
    // AND: 가격 >= 1000 그리고 재고 > 0
  },
});

// OR 조건
const products = await prisma.product.findMany({
  where: {
    OR: [
      { price: { lt: 1000 } },
      { stock: { gt: 100 } },
    ],
    // OR: 가격 < 1000 또는 재고 > 100
  },
});
```

**연산자**:
```typescript
{
  equals: 10,        // = 10
  not: 10,           // != 10
  gt: 10,            // > 10 (greater than)
  gte: 10,           // >= 10
  lt: 10,            // < 10 (less than)
  lte: 10,           // <= 10
  in: [1, 2, 3],     // IN (1, 2, 3)
  notIn: [1, 2],     // NOT IN (1, 2)
  contains: 'text',  // LIKE '%text%'
  startsWith: 'A',   // LIKE 'A%'
  endsWith: 'Z',     // LIKE '%Z'
}
```

</details>

---

### 퀴즈 40: findUnique (초급)

**문제**: ID로 단일 레코드를 조회할 때 사용하는 메서드는?

A) `findOne()`
B) `findById()`
C) `findUnique()`
D) `find()`

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
Prisma에서 고유한 값(ID, 이메일 등)으로 단일 레코드를 조회할 때는 `findUnique()`를 사용합니다.

**상세 설명**:

**기본 사용법**:
```typescript
// ID로 조회
const product = await prisma.product.findUnique({
  where: { id: 1 },
});

// 결과: Product | null
```

**고유 필드로 조회**:
```typescript
// @unique 속성이 있는 필드 사용 가능
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
});

const product = await prisma.product.findUnique({
  where: { sku: 'PROD-001' },
});
```

**관계 포함**:
```typescript
const product = await prisma.product.findUnique({
  where: { id: 1 },
  include: {
    category: true,
    reviews: true,
  },
});

// 결과:
{
  id: 1,
  name: '제품1',
  category: { id: 10, name: '전자제품' },
  reviews: [...]
}
```

**프로젝트 참조**:
- 파일: `src/lib/services/targetProduct.service.ts`
- 라인: 67-72
- 설명: findUnique로 단건 조회

```typescript
async findById(id: number): Promise<TargetProductResponseDto> {
  const product = await prisma.target_product.findUnique({
    where: { target_product_id: id },
    include: {
      productLine: true,
    },
  });

  if (!product) {
    throw new NotFoundError(`ID ${id}에 해당하는 타겟제품군을 찾을 수 없습니다`);
  }

  return { /* DTO 변환 */ };
}
```

**findUnique vs findFirst**:
```typescript
// findUnique: 고유 필드만 가능
const product1 = await prisma.product.findUnique({
  where: { id: 1 },  // ✅ ID는 unique
});

const product2 = await prisma.product.findUnique({
  where: { name: '제품1' },  // ❌ name이 unique가 아니면 에러
});

// findFirst: 모든 필드 가능 (첫 번째 결과)
const product3 = await prisma.product.findFirst({
  where: { name: '제품1' },  // ✅ 가능
});
```

**null 처리**:
```typescript
// 방법 1: null 체크
const product = await prisma.product.findUnique({
  where: { id: 1 },
});

if (!product) {
  throw new Error('찾을 수 없음');
}

// product는 이제 Product 타입 (null 아님)

// 방법 2: findUniqueOrThrow
const product = await prisma.product.findUniqueOrThrow({
  where: { id: 1 },
});
// 없으면 자동으로 에러 throw
```

**복합 고유 키**:
```typescript
// schema.prisma
model UserRole {
  user_id Int
  role_id Int

  @@unique([user_id, role_id])
}

// 사용
const userRole = await prisma.userRole.findUnique({
  where: {
    user_id_role_id: {
      user_id: 1,
      role_id: 2,
    },
  },
});
```

**선택적 필드**:
```typescript
// select로 필드 선택
const product = await prisma.product.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    name: true,
    // 나머지 필드는 제외
  },
});

// 결과: { id: 1, name: '제품1' }
```

</details>

---

### 퀴즈 41: create (초급)

**문제**: Prisma에서 새 레코드를 생성하는 메서드는?

A) `insert()`
B) `add()`
C) `create()`
D) `new()`

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
Prisma에서 새 레코드를 생성할 때는 `create()` 메서드를 사용합니다.

**상세 설명**:

**기본 사용법**:
```typescript
// 새 제품 생성
const product = await prisma.product.create({
  data: {
    name: '제품1',
    price: 10000,
  },
});

// SQL: INSERT INTO Product (name, price) VALUES ('제품1', 10000);
```

**관계와 함께 생성**:
```typescript
// 외래 키로 연결
const product = await prisma.product.create({
  data: {
    name: '제품1',
    price: 10000,
    category_id: 5,  // 기존 카테고리 ID
  },
});

// 또는 관계 객체 사용
const product = await prisma.product.create({
  data: {
    name: '제품1',
    price: 10000,
    category: {
      connect: { id: 5 },  // ID 5인 카테고리에 연결
    },
  },
});
```

**중첩 생성**:
```typescript
// 카테고리와 제품을 함께 생성
const category = await prisma.category.create({
  data: {
    name: '전자제품',
    products: {
      create: [
        { name: '제품1', price: 10000 },
        { name: '제품2', price: 20000 },
      ],
    },
  },
});
```

**프로젝트 참조**:
- 파일: `src/lib/services/targetProduct.service.ts`
- 라인: 107-116
- 설명: create로 새 제품 생성

```typescript
async create(data: CreateTargetProductDto): Promise<TargetProductResponseDto> {
  // 외래키 검증
  const productLineExists = await prisma.target_Product_Line.findUnique({
    where: { target_product_line_id: data.target_product_line_id },
  });

  if (!productLineExists) {
    throw new ValidationError(`ID ${data.target_product_line_id}에 해당하는 제품군이 존재하지 않습니다`);
  }

  // 생성
  const product = await prisma.target_product.create({
    data: {
      target_product_line_id: data.target_product_line_id,
      target_product_name: data.target_product_name,
      deployment_date: new Date(data.deployment_date),
    },
    include: {
      productLine: true,
    },
  });

  return { /* DTO 변환 */ };
}
```

**생성 후 관계 포함**:
```typescript
// include로 관련 데이터도 가져오기
const product = await prisma.product.create({
  data: {
    name: '제품1',
    price: 10000,
    category_id: 5,
  },
  include: {
    category: true,  // 카테고리 정보도 함께 반환
  },
});

// 결과:
{
  id: 1,
  name: '제품1',
  price: 10000,
  category_id: 5,
  category: { id: 5, name: '전자제품' }
}
```

**기본값 사용**:
```typescript
// schema.prisma
model Product {
  id         Int      @id @default(autoincrement())
  name       String
  price      Int
  created_at DateTime @default(now())
  is_active  Boolean  @default(true)
}

// create 시 기본값 자동 설정
const product = await prisma.product.create({
  data: {
    name: '제품1',
    price: 10000,
    // id, created_at, is_active는 자동 설정
  },
});
```

**여러 개 생성 (createMany)**:
```typescript
// 한 번에 여러 개 생성
const result = await prisma.product.createMany({
  data: [
    { name: '제품1', price: 10000 },
    { name: '제품2', price: 20000 },
    { name: '제품3', price: 30000 },
  ],
});

console.log(`${result.count}개 생성됨`);
```

**날짜 처리**:
```typescript
// ISO 문자열 → Date 객체
const product = await prisma.product.create({
  data: {
    name: '제품1',
    price: 10000,
    deployment_date: new Date('2024-01-01'),  // Date 객체
  },
});

// 현재 시간
const product = await prisma.product.create({
  data: {
    name: '제품1',
    price: 10000,
    created_at: new Date(),  // 현재 시간
  },
});
```

**선택적 필드**:
```typescript
// schema.prisma
model Product {
  id          Int     @id @default(autoincrement())
  name        String
  description String?  // optional
}

// description 없이 생성 가능
const product = await prisma.product.create({
  data: {
    name: '제품1',
    // description 생략 가능
  },
});
```

</details>

---

## 7. useState와 상태 관리 (5개)

### 퀴즈 42: useState 기본 (초급)

**문제**: useState의 반환값은?

A) 현재 값
B) 값 업데이트 함수
C) [현재 값, 값 업데이트 함수]
D) 상태 객체

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
useState는 **배열**을 반환하며, 첫 번째는 현재 값, 두 번째는 값을 업데이트하는 함수입니다.

**상세 설명**:

**기본 사용법**:
```typescript
'use client'
import { useState } from 'react';

export default function Counter() {
  // [현재 값, 업데이트 함수] = useState(초기값)
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        증가
      </button>
    </div>
  );
}
```

**구조 분해 할당**:
```typescript
// ✅ 구조 분해 (일반적)
const [count, setCount] = useState(0);

// 같은 의미 (배열로 받기)
const state = useState(0);
const count = state[0];      // 현재 값
const setCount = state[1];   // 업데이트 함수
```

**여러 개의 상태**:
```typescript
export default function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
    </form>
  );
}
```

**프로젝트 참조**:
- 파일: `src/components/trm/target-products/TargetProductList.tsx`
- 라인: 35
- 설명: useState로 제품 목록 관리

```typescript
export default function TargetProductList({ initialData }: TargetProductListProps) {
  const [products, setProducts] = useState(initialData);

  // products: 현재 제품 목록
  // setProducts: 목록 업데이트 함수

  return <DataTable data={products} /* ... */ />;
}
```

**다양한 타입의 상태**:
```typescript
// 숫자
const [count, setCount] = useState(0);

// 문자열
const [name, setName] = useState('');

// 불린
const [isOpen, setIsOpen] = useState(false);

// 배열
const [items, setItems] = useState<Product[]>([]);

// 객체
const [user, setUser] = useState({ name: '', age: 0 });

// null 가능
const [selected, setSelected] = useState<Product | null>(null);
```

**초기값**:
```typescript
// 직접 값
const [count, setCount] = useState(0);

// 함수로 계산 (초기화 시 한 번만 실행)
const [items, setItems] = useState(() => {
  const stored = localStorage.getItem('items');
  return stored ? JSON.parse(stored) : [];
});

// Props 사용
interface Props {
  initialCount: number;
}

export default function Counter({ initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
}
```

**naming convention**:
```typescript
// ✅ 일반적 패턴: [값, set + 값]
const [count, setCount] = useState(0);
const [name, setName] = useState('');
const [isOpen, setIsOpen] = useState(false);
const [products, setProducts] = useState([]);

// ❌ 비권장
const [count, updateCount] = useState(0);
const [n, setN] = useState('');
```

</details>

---

### 퀴즈 43: 상태 업데이트 (초급)

**문제**: 다음 중 상태를 올바르게 업데이트하는 방법은?

```typescript
const [count, setCount] = useState(0);
```

A) `count = count + 1;`
B) `setCount(count + 1);`
C) `count += 1;`
D) `useState(count + 1);`

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
상태는 **반드시 set 함수**를 사용해서 업데이트해야 합니다. 직접 변수를 수정하면 React가 변경을 감지하지 못합니다.

**상세 설명**:

**올바른 방법**:
```typescript
const [count, setCount] = useState(0);

// ✅ setCount 사용
const increment = () => {
  setCount(count + 1);
};

return <button onClick={increment}>증가</button>;
```

**틀린 방법**:
```typescript
const [count, setCount] = useState(0);

// ❌ 직접 수정 (작동 안 함!)
const increment = () => {
  count = count + 1;  // 변화 감지 안 됨
};

// ❌ += 연산자 (작동 안 함!)
const increment = () => {
  count += 1;  // 변화 감지 안 됨
};
```

**함수형 업데이트**:
```typescript
// 이전 값 기반 업데이트
setCount(prevCount => prevCount + 1);

// 왜 이게 더 안전할까?
const increment = () => {
  // ❌ 문제 있는 코드
  setCount(count + 1);
  setCount(count + 1);
  // count는 여전히 0이므로, 결과는 1

  // ✅ 안전한 코드
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  // prev는 업데이트된 값, 결과는 2
};
```

**객체 상태 업데이트**:
```typescript
const [user, setUser] = useState({ name: '', age: 0 });

// ❌ 직접 수정 (작동 안 함!)
user.name = '홍길동';

// ✅ 새 객체로 교체
setUser({ name: '홍길동', age: 30 });

// ✅ 스프레드 연산자 (기존 값 유지)
setUser(prev => ({
  ...prev,
  name: '홍길동',  // name만 변경
}));
```

**배열 상태 업데이트**:
```typescript
const [items, setItems] = useState<Product[]>([]);

// ❌ 직접 수정 (작동 안 함!)
items.push(newProduct);

// ✅ 추가
setItems(prev => [...prev, newProduct]);

// ✅ 삭제
setItems(prev => prev.filter(item => item.id !== deleteId));

// ✅ 수정
setItems(prev => prev.map(item =>
  item.id === updateId
    ? { ...item, name: '새 이름' }
    : item
));
```

**프로젝트에서의 사용**:
- 파일: `src/lib/hooks/useOptimisticDelete.ts`
- 라인: 60
- 설명: 함수형 업데이트로 배열에서 항목 제거

```typescript
startTransition(() => {
  setItems((prev) => prev.filter((i) => getItemId(i) !== itemId));
});
```

**여러 상태 업데이트**:
```typescript
const handleSubmit = () => {
  setName('홍길동');
  setEmail('hong@example.com');
  setAge(30);
  // 세 개 모두 한 번의 렌더링에서 처리됨 (batching)
};
```

**비동기 업데이트**:
```typescript
const handleClick = async () => {
  setLoading(true);

  try {
    const result = await fetch('/api/data');
    const data = await result.json();
    setData(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

**조건부 업데이트**:
```typescript
const handleToggle = () => {
  if (isValid) {
    setCount(prev => prev + 1);
  } else {
    setError('유효하지 않음');
  }
};
```

</details>

---

### 퀴즈 44: 배열 상태 관리 (초급)

**문제**: 배열 상태에서 항목을 삭제하는 올바른 방법은?

```typescript
const [items, setItems] = useState([1, 2, 3, 4, 5]);
// ID 3인 항목 삭제
```

A) `items.remove(3);`
B) `setItems(items.filter(id => id !== 3));`
C) `delete items[3];`
D) `items.splice(2, 1);`

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
배열에서 항목을 삭제할 때는 `filter()`로 **새 배열을 만들어** set 함수에 전달합니다.

**상세 설명**:

**삭제 (filter)**:
```typescript
const [items, setItems] = useState([1, 2, 3, 4, 5]);

// ✅ filter로 삭제
const handleDelete = (idToDelete: number) => {
  setItems(items.filter(id => id !== idToDelete));
};

// ID 3 삭제 → [1, 2, 4, 5]
handleDelete(3);
```

**추가 (스프레드 연산자)**:
```typescript
const [items, setItems] = useState([1, 2, 3]);

// ✅ 끝에 추가
setItems([...items, 4]);  // [1, 2, 3, 4]

// ✅ 앞에 추가
setItems([0, ...items]);  // [0, 1, 2, 3]

// ✅ 중간에 추가
setItems([...items.slice(0, 2), 2.5, ...items.slice(2)]);
// [1, 2, 2.5, 3]
```

**수정 (map)**:
```typescript
interface Product {
  id: number;
  name: string;
}

const [products, setProducts] = useState<Product[]>([
  { id: 1, name: '제품1' },
  { id: 2, name: '제품2' },
]);

// ✅ 특정 항목 수정
const handleUpdate = (id: number, newName: string) => {
  setProducts(products.map(product =>
    product.id === id
      ? { ...product, name: newName }  // 수정
      : product  // 그대로 유지
  ));
};

handleUpdate(1, '새 이름');
// [{ id: 1, name: '새 이름' }, { id: 2, name: '제품2' }]
```

**프로젝트 참조**:
- 파일: `src/lib/hooks/useOptimisticDelete.ts`
- 라인: 60
- 설명: filter로 삭제

```typescript
const handleDelete = async (item: T) => {
  // ...
  startTransition(() => {
    setItems((prev) => prev.filter((i) => getItemId(i) !== itemId));
  });
};
```

**실제 사용 예시**:
```typescript
'use client'
import { useState } from 'react';

export default function ProductList({ initialData }: Props) {
  const [products, setProducts] = useState(initialData);

  // 삭제
  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // 추가
  const handleAdd = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  // 수정
  const handleUpdate = (id: number, updates: Partial<Product>) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <span>{product.name}</span>
          <button onClick={() => handleDelete(product.id)}>
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
```

**왜 다른 방법은 안 될까?**

**A) items.remove() (❌ 존재하지 않는 메서드)**:
```typescript
items.remove(3);  // 에러: remove는 배열 메서드가 아님
```

**C) delete (❌ 배열에 빈 자리 남김)**:
```typescript
delete items[2];  // [1, 2, empty, 4, 5]
// 원하는 결과 아님
```

**D) splice (❌ 원본 배열 수정)**:
```typescript
items.splice(2, 1);  // 원본 배열 직접 수정
setItems(items);  // React가 변화 감지 못 함!

// ✅ 올바른 방법
const newItems = [...items];
newItems.splice(2, 1);
setItems(newItems);

// 하지만 filter가 더 간단!
setItems(items.filter(id => id !== 3));
```

**정렬**:
```typescript
// ❌ 원본 수정
items.sort();
setItems(items);

// ✅ 새 배열로 정렬
setItems([...items].sort());
```

**불변성 원칙**:
```
✅ 새 배열/객체를 만들어 set 함수에 전달
❌ 원본을 직접 수정
```

</details>

---

### 퀴즈 45: 초기값 설정 (초급)

**문제**: Props로 받은 데이터를 useState의 초기값으로 사용하는 방법은?

```typescript
interface Props {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: Props) {
  // 여기서 initialProducts를 상태로 만들기
}
```

A) `const [products] = useState();`
B) `const [products, setProducts] = useState(initialProducts);`
C) `const products = useState(initialProducts);`
D) `useState(initialProducts);`

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
Props를 useState의 **초기값**으로 전달하면, 컴포넌트가 마운트될 때 해당 값으로 상태가 초기화됩니다.

**상세 설명**:

**Props를 초기값으로 사용**:
```typescript
interface Props {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: Props) {
  // ✅ Props를 초기값으로
  const [products, setProducts] = useState(initialProducts);

  // 이후 상태 업데이트 가능
  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return <div>{products.length}개</div>;
}
```

**프로젝트 참조**:
- 파일: `src/components/trm/target-products/TargetProductList.tsx`
- 라인: 26-35
- 설명: initialData를 상태 초기값으로 사용

```typescript
interface TargetProductListProps {
  initialData: TargetProductListItemDto[];
}

export default function TargetProductList({ initialData }: TargetProductListProps) {
  const [products, setProducts] = useState(initialData);

  // products는 이제 상태로 관리됨
  // setProducts로 업데이트 가능
}
```

**흐름**:
```
1. Server Component에서 데이터 fetch
   const products = await serverFetch('/api/products');

2. Props로 Client Component에 전달
   <ProductList initialData={products} />

3. useState 초기값으로 사용
   const [products, setProducts] = useState(initialData);

4. 이후 Client에서 상태 업데이트 가능
   setProducts([...]);
```

**초기값 타입**:
```typescript
// 빈 배열
const [items, setItems] = useState<Product[]>([]);

// Props 사용
const [items, setItems] = useState(initialItems);

// 계산된 초기값
const [items, setItems] = useState(() => {
  return initialItems.filter(item => item.active);
});

// null 가능
const [selected, setSelected] = useState<Product | null>(null);
```

**주의: Props 변경 시**:
```typescript
// ⚠️ Props가 변경되어도 상태는 업데이트 안 됨!
export default function ProductList({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);

  // initialProducts가 바뀌어도 products는 그대로!
}

// ✅ Props 변경 감지가 필요하면 useEffect
export default function ProductList({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);
}

// 하지만 대부분 초기값만 사용하는 패턴!
```

**초기값 vs 제어 컴포넌트**:
```typescript
// 비제어 (Uncontrolled): 초기값만 사용
export default function Form({ initialName }: Props) {
  const [name, setName] = useState(initialName);
  // 이후 내부에서 자유롭게 변경
}

// 제어 (Controlled): 항상 Props 사용
export default function Form({ name, onNameChange }: Props) {
  // useState 없음, Props를 직접 사용
  return (
    <input
      value={name}
      onChange={e => onNameChange(e.target.value)}
    />
  );
}
```

**여러 Props 조합**:
```typescript
interface Props {
  initialProducts: Product[];
  initialFilter: string;
}

export default function ProductList({ initialProducts, initialFilter }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState(initialFilter);

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <div>{products.filter(p => p.name.includes(filter)).length}개</div>
    </div>
  );
}
```

</details>

---

### 퀴즈 46: 객체 상태 업데이트 (초급)

**문제**: 객체 상태에서 특정 필드만 업데이트하려면?

```typescript
const [user, setUser] = useState({ name: '홍길동', age: 30, email: 'hong@example.com' });
// name만 '김철수'로 변경하고 싶음
```

A) `user.name = '김철수';`
B) `setUser({ name: '김철수' });`
C) `setUser({ ...user, name: '김철수' });`
D) `setUser(user => user.name = '김철수');`

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
객체 상태를 업데이트할 때는 **스프레드 연산자**로 기존 값을 유지하면서 특정 필드만 변경합니다.

**상세 설명**:

**올바른 방법 (스프레드 연산자)**:
```typescript
const [user, setUser] = useState({
  name: '홍길동',
  age: 30,
  email: 'hong@example.com',
});

// ✅ 스프레드로 기존 값 유지
setUser({ ...user, name: '김철수' });
// 결과: { name: '김철수', age: 30, email: 'hong@example.com' }

// ✅ 함수형 업데이트
setUser(prev => ({ ...prev, name: '김철수' }));
```

**여러 필드 동시 업데이트**:
```typescript
setUser({
  ...user,
  name: '김철수',
  age: 35,
});
// 결과: { name: '김철수', age: 35, email: 'hong@example.com' }
```

**중첩 객체 업데이트**:
```typescript
const [user, setUser] = useState({
  name: '홍길동',
  address: {
    city: '서울',
    zipCode: '12345',
  },
});

// ✅ 중첩 객체도 스프레드
setUser({
  ...user,
  address: {
    ...user.address,
    city: '부산',  // city만 변경
  },
});
// 결과: { name: '홍길동', address: { city: '부산', zipCode: '12345' } }
```

**폼 입력 처리**:
```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  age: 0,
});

// 범용 핸들러
const handleChange = (field: string, value: any) => {
  setFormData(prev => ({
    ...prev,
    [field]: value,
  }));
};

return (
  <form>
    <input
      value={formData.name}
      onChange={e => handleChange('name', e.target.value)}
    />
    <input
      value={formData.email}
      onChange={e => handleChange('email', e.target.value)}
    />
  </form>
);
```

**왜 다른 방법은 안 될까?**

**A) user.name = ... (❌ 직접 수정)**:
```typescript
user.name = '김철수';
// 원본 객체 수정, React가 변경 감지 못 함!
```

**B) 전체 교체 (❌ 나머지 필드 손실)**:
```typescript
setUser({ name: '김철수' });
// 결과: { name: '김철수' }
// age, email 손실!
```

**D) 직접 할당 (❌ 구문 에러)**:
```typescript
setUser(user => user.name = '김철수');
// 반환값이 없어서 에러
```

**타입 안전성**:
```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

const [user, setUser] = useState<User>({
  name: '홍길동',
  age: 30,
  email: 'hong@example.com',
});

// ✅ 타입 체크됨
setUser({ ...user, name: '김철수' });

// ❌ 타입 에러
setUser({ ...user, invalid: 'field' });
```

**Partial 활용**:
```typescript
const updateUser = (updates: Partial<User>) => {
  setUser(prev => ({ ...prev, ...updates }));
};

// 사용
updateUser({ name: '김철수' });
updateUser({ age: 35 });
updateUser({ name: '이영희', age: 28 });
```

**실전 예시**:
```typescript
const [product, setProduct] = useState({
  id: 1,
  name: '제품1',
  price: 10000,
  stock: 100,
});

const handlePriceChange = (newPrice: number) => {
  setProduct(prev => ({ ...prev, price: newPrice }));
};

const handleStockChange = (newStock: number) => {
  setProduct(prev => ({ ...prev, stock: newStock }));
};
```

</details>

---

## 8. 기본 에러 처리 (4개)

### 퀴즈 47: try-catch 기본 (초급)

**문제**: try-catch 블록의 올바른 사용 순서는?

A) catch → try → finally
B) try → catch → finally
C) try → finally → catch
D) finally → try → catch

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
try-catch 블록은 `try` → `catch` → `finally` 순서로 작성합니다.

**상세 설명**:

**기본 구조**:
```typescript
try {
  // 정상 로직 (에러 발생 가능)
  const data = await fetch('/api/data');
} catch (error) {
  // 에러 처리
  console.error('에러 발생:', error);
} finally {
  // 항상 실행 (선택적)
  console.log('완료');
}
```

**각 블록의 역할**:

**1) try: 정상 로직**:
```typescript
try {
  const product = await prisma.product.findUnique({
    where: { id: 1 },
  });

  if (!product) {
    throw new Error('제품을 찾을 수 없습니다');
  }

  return product;
}
```

**2) catch: 에러 처리**:
```typescript
catch (error) {
  // 에러 로깅
  console.error('에러:', error);

  // 사용자에게 메시지
  alert('조회에 실패했습니다');

  // 에러 응답 반환 (API Route)
  return NextResponse.json(
    { success: false, error: '조회 실패' },
    { status: 500 }
  );
}
```

**3) finally: 정리 작업 (선택적)**:
```typescript
finally {
  // 성공/실패 관계없이 항상 실행
  setLoading(false);
  console.log('작업 완료');
}
```

**프로젝트 참조**:
- 파일: `src/app/api/target-products/route.ts`
- 라인: 37-53
- 설명: try-catch 패턴

```typescript
export async function GET() {
  try {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> [API] GET /api/target-products");

    const products = await targetProductService.findAll();
    console.log(`[API] Fetched ${products.length} target products`);

    return successResponse(products);
  } catch (error) {
    console.error('[API] Error fetching target products:', error);
    return errorResponse(handlePrismaError(error));
  }
}
```

**실전 예시**:
```typescript
// API Route
export async function POST(request: NextRequest) {
  try {
    // 1. 요청 처리
    const body = await request.json();

    // 2. 검증
    if (!body.name) {
      throw new ValidationError('이름은 필수입니다');
    }

    // 3. DB 작업
    const product = await service.create(body);

    // 4. 성공 응답
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    // 5. 에러 타입별 처리
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: '서버 에러' },
      { status: 500 }
    );
  }
}
```

**Client Component**:
```typescript
const handleDelete = async (id: number) => {
  try {
    setLoading(true);

    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error);
    }

    alert('삭제되었습니다');
    router.refresh();
  } catch (error) {
    alert(error instanceof Error ? error.message : '삭제 실패');
  } finally {
    setLoading(false);
  }
};
```

**중첩 try-catch**:
```typescript
try {
  // 외부 try
  const user = await getUser();

  try {
    // 내부 try
    const orders = await getUserOrders(user.id);
  } catch (orderError) {
    console.error('주문 조회 실패:', orderError);
    // orders는 빈 배열로
  }

  return { user, orders };
} catch (userError) {
  console.error('사용자 조회 실패:', userError);
  return null;
}
```

</details>

---

### 퀴즈 48: 에러 메시지 추출 (초급)

**문제**: catch 블록에서 에러 메시지를 안전하게 추출하는 방법은?

```typescript
catch (error) {
  // 여기서 에러 메시지 얻기
}
```

A) `error.message`
B) `error instanceof Error ? error.message : '알 수 없는 에러'`
C) `String(error)`
D) `error.toString()`

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
TypeScript에서 catch의 error는 `unknown` 타입이므로, **타입 체크**를 거쳐 안전하게 메시지를 추출해야 합니다.

**상세 설명**:

**안전한 패턴**:
```typescript
try {
  // ...
} catch (error) {
  // ✅ 타입 체크 후 메시지 추출
  const message = error instanceof Error
    ? error.message
    : '알 수 없는 에러가 발생했습니다';

  console.error(message);
  alert(message);
}
```

**왜 타입 체크가 필요할까?**:
```typescript
// error는 무엇이든 될 수 있음!
throw new Error('에러 메시지');        // Error 객체
throw '문자열 에러';                   // string
throw 404;                            // number
throw { code: 'ERR', message: '...' }; // object
throw null;                            // null

// 따라서 타입 체크 필수!
catch (error) {
  // error: unknown

  if (error instanceof Error) {
    // error: Error
    console.log(error.message);
  } else if (typeof error === 'string') {
    // error: string
    console.log(error);
  } else {
    console.log('알 수 없는 에러');
  }
}
```

**헬퍼 함수 만들기**:
```typescript
// 에러 메시지 추출 유틸리티
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return '알 수 없는 에러가 발생했습니다';
}

// 사용
try {
  // ...
} catch (error) {
  const message = getErrorMessage(error);
  console.error(message);
}
```

**프로젝트에서의 사용**:
- 파일: `src/lib/hooks/useOptimisticDelete.ts`
- 라인: 67-71
- 설명: instanceof로 타입 체크

```typescript
catch (error) {
  alert(
    error instanceof Error
      ? error.message
      : '삭제 중 오류가 발생했습니다'
  );
  router.refresh();
}
```

**Error 타입 구분**:
```typescript
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

try {
  // ...
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('검증 에러:', error.message);
    return { status: 400, message: error.message };
  }

  if (error instanceof NotFoundError) {
    console.error('찾을 수 없음:', error.message);
    return { status: 404, message: error.message };
  }

  if (error instanceof Error) {
    console.error('일반 에러:', error.message);
    return { status: 500, message: error.message };
  }

  console.error('알 수 없는 에러:', error);
  return { status: 500, message: '서버 에러' };
}
```

**API Response 에러**:
```typescript
try {
  const response = await fetch('/api/products');
  const result = await response.json();

  if (!result.success) {
    // 서버에서 보낸 에러 메시지
    throw new Error(result.error);
  }
} catch (error) {
  const message = error instanceof Error
    ? error.message
    : '요청 실패';

  alert(message);
}
```

**React Query/SWR에서**:
```typescript
const { data, error } = useSWR('/api/products');

if (error) {
  // SWR의 error도 unknown
  const message = error instanceof Error
    ? error.message
    : '데이터 로딩 실패';

  return <div>에러: {message}</div>;
}
```

**왜 다른 답은 부족할까?**

**A) error.message (❌)**:
```typescript
catch (error) {
  console.log(error.message);
  // error가 Error가 아니면 undefined!
}
```

**C) String(error) (⚠️ 불완전)**:
```typescript
String(new Error('메시지'));  // "Error: 메시지"
String('문자열');              // "문자열"
String(404);                  // "404"
String(null);                 // "null"
// 형식이 일정하지 않음
```

**D) error.toString() (⚠️ 불완전)**:
```typescript
new Error('메시지').toString();  // "Error: 메시지"
// 하지만 error가 Error가 아니면?
null.toString();  // 에러!
```

</details>

---

### 퀴즈 49: HTTP 상태 코드 (초급)

**문제**: 다음 상태 코드와 의미가 **잘못** 매칭된 것은?

A) 200 - 성공
B) 404 - 찾을 수 없음
C) 500 - 잘못된 요청
D) 201 - 생성 성공

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
500은 "Internal Server Error(서버 에러)"이며, "잘못된 요청"은 400입니다.

**상세 설명**:

**주요 상태 코드**:

**2xx: 성공**:
```typescript
// 200 OK - 성공
return NextResponse.json({ data }, { status: 200 });

// 201 Created - 생성 성공
return NextResponse.json({ data: newProduct }, { status: 201 });

// 204 No Content - 성공 (응답 본문 없음)
return new NextResponse(null, { status: 204 });
```

**4xx: 클라이언트 에러**:
```typescript
// 400 Bad Request - 잘못된 요청
if (!body.name) {
  return NextResponse.json(
    { error: '이름 필수' },
    { status: 400 }
  );
}

// 401 Unauthorized - 인증 필요
if (!session) {
  return NextResponse.json(
    { error: '로그인 필요' },
    { status: 401 }
  );
}

// 403 Forbidden - 권한 없음
if (user.role !== 'admin') {
  return NextResponse.json(
    { error: '권한 없음' },
    { status: 403 }
  );
}

// 404 Not Found - 찾을 수 없음
if (!product) {
  return NextResponse.json(
    { error: '제품을 찾을 수 없습니다' },
    { status: 404 }
  );
}
```

**5xx: 서버 에러**:
```typescript
// 500 Internal Server Error - 서버 에러
catch (error) {
  return NextResponse.json(
    { error: '서버 에러' },
    { status: 500 }
  );
}

// 503 Service Unavailable - 서비스 이용 불가
if (isMaintenanceMode) {
  return NextResponse.json(
    { error: '점검 중' },
    { status: 503 }
  );
}
```

**프로젝트에서의 사용**:
- 파일: `src/lib/utils/apiResponse.ts`
- 설명: 상태 코드별 응답 함수

```typescript
// 200 OK
export function successResponse<T>(data: T) {
  return NextResponse.json(
    { success: true, data },
    { status: 200 }
  );
}

// 201 Created
export function createdResponse<T>(data: T) {
  return NextResponse.json(
    { success: true, data },
    { status: 201 }
  );
}

// 400 Bad Request
export function badRequestResponse(error: string) {
  return NextResponse.json(
    { success: false, error },
    { status: 400 }
  );
}

// 404 Not Found
export function notFoundResponse(error: string) {
  return NextResponse.json(
    { success: false, error },
    { status: 404 }
  );
}

// 500 Internal Server Error
export function errorResponse(error: string) {
  return NextResponse.json(
    { success: false, error },
    { status: 500 }
  );
}
```

**에러 타입별 상태 코드**:
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 검증 에러 → 400
    if (!body.name) {
      return NextResponse.json(
        { error: '이름 필수' },
        { status: 400 }
      );
    }

    const product = await service.create(body);

    // 생성 성공 → 201
    return NextResponse.json(
      { data: product },
      { status: 201 }
    );
  } catch (error) {
    // ValidationError → 400
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // NotFoundError → 404
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    // 기타 → 500
    return NextResponse.json(
      { error: '서버 에러' },
      { status: 500 }
    );
  }
}
```

**클라이언트에서 상태 코드 확인**:
```typescript
const response = await fetch('/api/products', {
  method: 'POST',
  body: JSON.stringify({ name: '제품1' }),
});

// 상태 코드 확인
if (response.status === 400) {
  console.error('잘못된 요청');
} else if (response.status === 404) {
  console.error('찾을 수 없음');
} else if (response.status === 500) {
  console.error('서버 에러');
} else if (response.ok) {  // 200-299
  console.log('성공');
}

const result = await response.json();
```

**상태 코드 가이드**:
```
2xx - 성공
  200: 일반 성공
  201: 생성 성공
  204: 성공 (응답 없음)

4xx - 클라이언트 에러
  400: 잘못된 요청 (검증 실패)
  401: 인증 필요
  403: 권한 없음
  404: 찾을 수 없음

5xx - 서버 에러
  500: 일반 서버 에러
  503: 서비스 이용 불가
```

</details>

---

### 퀴즈 50: 에러 타입 구분 (초급)

**문제**: 사용자 입력 검증 실패 시 사용할 에러 클래스와 HTTP 상태 코드는?

A) Error, 500
B) ValidationError, 400
C) NotFoundError, 404
D) TypeError, 500

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
입력 검증 실패는 **ValidationError**로 처리하며, HTTP 상태 코드는 **400 Bad Request**를 사용합니다.

**상세 설명**:

**커스텀 에러 클래스**:
```typescript
// src/lib/utils/errorHandler.ts

// 검증 에러 (400)
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Not Found 에러 (404)
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
```

**Service Layer에서 throw**:
```typescript
// src/lib/services/targetProduct.service.ts

async create(data: CreateTargetProductDto) {
  // 외래키 검증
  const productLineExists = await prisma.target_Product_Line.findUnique({
    where: { target_product_line_id: data.target_product_line_id },
  });

  if (!productLineExists) {
    // ✅ ValidationError throw
    throw new ValidationError(
      `ID ${data.target_product_line_id}에 해당하는 제품군이 존재하지 않습니다`
    );
  }

  // 생성 로직
  const product = await prisma.target_product.create({ data });
  return product;
}

async findById(id: number) {
  const product = await prisma.target_product.findUnique({
    where: { id },
  });

  if (!product) {
    // ✅ NotFoundError throw
    throw new NotFoundError(
      `ID ${id}에 해당하는 타겟제품군을 찾을 수 없습니다`
    );
  }

  return product;
}
```

**API Route에서 catch**:
```typescript
// src/app/api/target-products/route.ts

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 필수 필드 검증
    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: '필수 필드 누락' },
        { status: 400 }
      );
    }

    const product = await service.create(body);

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    // ValidationError → 400
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // NotFoundError → 404
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    // 기타 에러 → 500
    return NextResponse.json(
      { success: false, error: '서버 에러' },
      { status: 500 }
    );
  }
}
```

**프로젝트 참조**:
- 파일: `src/lib/utils/errorHandler.ts`
- 설명: 커스텀 에러 클래스 정의

- 파일: `src/lib/services/targetProduct.service.ts`
- 라인: 100-104
- 설명: ValidationError throw

- 파일: `src/app/api/target-products/route.ts`
- 라인: 93-96
- 설명: ValidationError catch

**에러 타입별 매핑**:
```
ValidationError → 400 Bad Request
  - 필수 필드 누락
  - 잘못된 형식
  - 범위 초과
  - 외래키 불일치

NotFoundError → 404 Not Found
  - 존재하지 않는 ID
  - 삭제된 리소스

AuthError → 401 Unauthorized
  - 로그인 필요
  - 토큰 만료

ForbiddenError → 403 Forbidden
  - 권한 부족
  - 접근 불가

Error (기타) → 500 Internal Server Error
  - DB 연결 실패
  - 예상치 못한 에러
```

**실전 패턴**:
```typescript
// 1. Service에서 명확한 에러 throw
if (!isValid) {
  throw new ValidationError('검증 실패');
}

// 2. API에서 타입별로 catch
catch (error) {
  if (error instanceof ValidationError) {
    return badRequestResponse(error.message);
  }
  if (error instanceof NotFoundError) {
    return notFoundResponse(error.message);
  }
  return errorResponse('서버 에러');
}

// 3. Client에서 메시지 표시
const result = await fetch('/api/products', { /* ... */ });
if (!result.success) {
  alert(result.error);  // 사용자에게 에러 메시지
}
```

**검증 에러 예시**:
```typescript
// 필수 필드
if (!data.name) {
  throw new ValidationError('이름은 필수입니다');
}

// 형식 검증
if (!/^\d{3}-\d{4}$/.test(data.phone)) {
  throw new ValidationError('전화번호 형식이 잘못되었습니다');
}

// 범위 검증
if (data.age < 0 || data.age > 150) {
  throw new ValidationError('나이는 0-150 사이여야 합니다');
}

// 외래키 검증
const categoryExists = await prisma.category.findUnique({
  where: { id: data.category_id },
});
if (!categoryExists) {
  throw new ValidationError('존재하지 않는 카테고리입니다');
}
```

</details>

---

## 🎉 초급 퀴즈 완료!

축하합니다! 초급 퀴즈 50개를 모두 완료했습니다.

### 다음 단계

준비되셨다면 중급 퀴즈로 넘어가세요:
- **[중급 퀴즈 (50개)](./intermediate-quiz.md)**: Service Layer 패턴, 낙관적 업데이트, CRUD 전체 흐름

### 복습 추천

- 틀린 문제만 다시 풀어보기
- 프로젝트 파일 직접 열어서 확인하기
- 작은 기능 직접 만들어보기

**화이팅! 🚀**

## 4. API Routes 기초 (7개)

### 퀴즈 24: HTTP 메서드 구분 (초급)

**문제**: 다음 중 HTTP 메서드와 용도가 **잘못** 매칭된 것은?

A) GET - 데이터 조회
B) POST - 데이터 생성
C) DELETE - 데이터 수정
D) PUT - 데이터 수정

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
DELETE는 데이터 **삭제**에 사용하며, 수정은 PUT 또는 PATCH를 사용합니다.

**상세 설명**:

**CRUD와 HTTP 메서드 매칭**:
```
CREATE (생성)  → POST
READ   (조회)  → GET
UPDATE (수정)  → PUT / PATCH
DELETE (삭제)  → DELETE
```

**각 메서드의 역할**:

**GET - 조회**:
```typescript
// API Route
export async function GET() {
  const products = await service.findAll();
  return NextResponse.json({ success: true, data: products });
}

// 사용
fetch('/api/products')  // GET 요청
```

**POST - 생성**:
```typescript
// API Route
export async function POST(request: NextRequest) {
  const body = await request.json();
  const product = await service.create(body);
  return NextResponse.json({ success: true, data: product });
}

// 사용
fetch('/api/products', {
  method: 'POST',
  body: JSON.stringify({ name: '새 제품' })
})
```

**PUT/PATCH - 수정**:
```typescript
// API Route
export async function PUT(request: NextRequest, { params }) {
  const { id } = await params;
  const body = await request.json();
  const product = await service.update(Number(id), body);
  return NextResponse.json({ success: true, data: product });
}

// 사용
fetch('/api/products/123', {
  method: 'PUT',
  body: JSON.stringify({ name: '수정된 제품' })
})
```

**DELETE - 삭제**:
```typescript
// API Route
export async function DELETE(request: NextRequest, { params }) {
  const { id } = await params;
  await service.delete(Number(id));
  return NextResponse.json({ success: true });
}

// 사용
fetch('/api/products/123', {
  method: 'DELETE'
})
```

**프로젝트 참조**:
- 파일: `src/app/api/target-products/route.ts`
- 라인: 36 (GET), 63 (POST)
- 설명: GET과 POST 메서드 구현 예시

**PUT vs PATCH**:
```typescript
// PUT: 전체 교체
PUT /api/products/123
{
  name: '제품1',
  price: 1000,
  stock: 100
}
// → 모든 필드 업데이트

// PATCH: 부분 수정
PATCH /api/products/123
{
  price: 1200  // 가격만 변경
}
// → 일부 필드만 업데이트
```

**실전 팁**:
- 목록 조회: `GET /api/products`
- 단건 조회: `GET /api/products/123`
- 생성: `POST /api/products`
- 수정: `PUT /api/products/123`
- 삭제: `DELETE /api/products/123`

</details>

---

### 퀴즈 25: API Route 파일 위치 (초급)

**문제**: `/api/products`로 접근하려면 어디에 파일을 만들어야 하나요?

A) `app/api/products.ts`
B) `app/api/products/route.ts`
C) `pages/api/products.ts`
D) `api/products/index.ts`

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
Next.js App Router에서 API Route는 `app/api/폴더명/route.ts` 형식으로 만듭니다.

**상세 설명**:

**API Route 파일 구조**:
```
app/
└─ api/
   ├─ products/
   │  └─ route.ts           → /api/products
   ├─ users/
   │  └─ route.ts           → /api/users
   └─ orders/
      ├─ route.ts           → /api/orders
      └─ [id]/
         └─ route.ts        → /api/orders/123
```

**route.ts 기본 구조**:
```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products
export async function GET() {
  return NextResponse.json({
    success: true,
    data: [],
  });
}

// POST /api/products
export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    data: body,
  });
}
```

**동적 라우팅**:
```
app/api/products/
├─ route.ts              → /api/products
└─ [id]/
   └─ route.ts           → /api/products/123

// [id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ id });
}
```

**프로젝트 참조**:
- 파일: `src/app/api/target-products/route.ts`
- 경로: `/api/target-products`
- 설명: API Route 파일 구조 예시

**왜 다른 답은 틀렸을까?**

**A) `api/products.ts` (❌)**:
- 폴더 없이 파일만 있으면 작동 안 함
- 반드시 폴더 안에 route.ts

**C) `pages/api/products.ts` (❌)**:
- Pages Router 방식 (Next.js 12 이하)
- App Router에서는 app/api 사용

**D) `api/products/index.ts` (❌)**:
- 파일명이 틀림
- route.ts여야 함

**여러 메서드 한 파일에**:
```typescript
// app/api/products/route.ts
export async function GET() { /* 조회 */ }
export async function POST(request: NextRequest) { /* 생성 */ }

// app/api/products/[id]/route.ts
export async function GET(request, { params }) { /* 단건 조회 */ }
export async function PUT(request, { params }) { /* 수정 */ }
export async function DELETE(request, { params }) { /* 삭제 */ }
```

</details>

---

### 퀴즈 26: 응답 형식 (초급)

**문제**: API Route에서 JSON 응답을 반환하는 올바른 방법은?

A) `return { data: [] }`
B) `return JSON.stringify({ data: [] })`
C) `return NextResponse.json({ data: [] })`
D) `return response.json({ data: [] })`

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
Next.js API Route에서는 `NextResponse.json()`을 사용해 JSON 응답을 반환합니다.

**상세 설명**:

**올바른 사용법**:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  // ✅ NextResponse.json() 사용
  return NextResponse.json({
    success: true,
    data: [
      { id: 1, name: '제품1' },
      { id: 2, name: '제품2' },
    ],
  });
}
```

**HTTP 상태 코드와 함께**:
```typescript
// 200 OK (기본값)
return NextResponse.json({ data: [] });

// 201 Created
return NextResponse.json(
  { success: true, data: newProduct },
  { status: 201 }
);

// 400 Bad Request
return NextResponse.json(
  { success: false, error: '잘못된 요청' },
  { status: 400 }
);

// 404 Not Found
return NextResponse.json(
  { success: false, error: '찾을 수 없음' },
  { status: 404 }
);

// 500 Internal Server Error
return NextResponse.json(
  { success: false, error: '서버 에러' },
  { status: 500 }
);
```

**커스텀 헤더 추가**:
```typescript
return NextResponse.json(
  { data: [] },
  {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
      'X-Custom-Header': 'value',
    },
  }
);
```

**프로젝트 참조**:
- 파일: `src/app/api/target-products/route.ts`
- 라인: 47
- 설명: NextResponse.json() 사용 예시

```typescript
return successResponse(products);

// successResponse는 내부적으로:
return NextResponse.json(
  { success: true, data: products },
  { status: 200 }
);
```

**왜 다른 답은 틀렸을까?**

**A) `return { data: [] }` (❌)**:
```typescript
export async function GET() {
  return { data: [] };  // 에러!
  // NextResponse나 Response 객체여야 함
}
```

**B) `return JSON.stringify()` (❌)**:
```typescript
export async function GET() {
  return JSON.stringify({ data: [] });  // 에러!
  // 문자열이 아닌 Response 객체여야 함
}
```

**D) `return response.json()` (❌)**:
```typescript
// response.json()은 요청 파싱에 사용
export async function POST(request: NextRequest) {
  const body = await request.json();  // ✅ 요청 읽기
  return NextResponse.json({ data: body });  // ✅ 응답 반환
}
```

**일관된 응답 형식**:
```typescript
// ✅ 성공 응답
{
  success: true,
  data: { /* 실제 데이터 */ }
}

// ✅ 에러 응답
{
  success: false,
  error: "에러 메시지"
}
```

</details>

---

### 퀴즈 27: 요청 본문(body) 읽기 (초급)

**문제**: POST 요청에서 클라이언트가 보낸 JSON 데이터를 읽으려면?

A) `const body = request.body;`
B) `const body = await request.json();`
C) `const body = request.data;`
D) `const body = JSON.parse(request);`

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
`request.json()`은 비동기 함수이므로 `await`와 함께 사용해야 합니다.

**상세 설명**:

**올바른 사용법**:
```typescript
export async function POST(request: NextRequest) {
  // ✅ await request.json()
  const body = await request.json();

  console.log(body);
  // { target_product_name: '제품1', deployment_date: '2024-01-01' }

  return NextResponse.json({ success: true, data: body });
}
```

**전체 흐름**:
```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. 요청 본문 읽기
    const body = await request.json();

    // 2. 검증
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: '이름 필수' },
        { status: 400 }
      );
    }

    // 3. 처리
    const result = await service.create(body);

    // 4. 응답
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '서버 에러' },
      { status: 500 }
    );
  }
}
```

**타입 지정**:
```typescript
interface CreateProductDto {
  name: string;
  price: number;
}

export async function POST(request: NextRequest) {
  const body = await request.json() as CreateProductDto;

  // 이제 body는 타입 안전!
  console.log(body.name);   // ✅
  console.log(body.price);  // ✅
}
```

**프로젝트 참조**:
- 파일: `src/app/api/target-products/route.ts`
- 라인: 67
- 설명: POST 요청에서 body 읽기

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.target_product_line_id || !body.target_product_name || !body.deployment_date) {
      return badRequestResponse('필수 필드가 누락되었습니다');
    }

    const dto: CreateTargetProductDto = {
      target_product_line_id: Number(body.target_product_line_id),
      target_product_name: body.target_product_name,
      deployment_date: body.deployment_date,
    };

    const product = await targetProductService.create(dto);
    return createdResponse(product);
  } catch (error) {
    // ...
  }
}
```

**다른 데이터 형식**:
```typescript
// JSON (가장 일반적)
const body = await request.json();

// FormData
const formData = await request.formData();
const name = formData.get('name');

// 텍스트
const text = await request.text();

// Blob (파일)
const blob = await request.blob();
```

**클라이언트에서 보내기**:
```typescript
// 클라이언트 코드
fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '새 제품',
    price: 10000,
  }),
});

// ↓ 서버에서 받기
const body = await request.json();
// { name: '새 제품', price: 10000 }
```

</details>

---

### 퀴즈 28: 에러 처리 패턴 (초급)

**문제**: API Route에서 에러를 처리하는 올바른 패턴은?

A) 에러를 throw하고 Next.js가 처리하게 함
B) try-catch로 감싸고 적절한 응답 반환
C) console.log만 하고 계속 진행
D) 에러를 무시하고 빈 응답 반환

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
API Route는 항상 적절한 응답을 반환해야 하므로, try-catch로 에러를 잡아서 처리합니다.

**상세 설명**:

**올바른 패턴**:
```typescript
export async function GET() {
  try {
    // 정상 로직
    const data = await service.findAll();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    // 에러 로깅
    console.error('[API] Error:', error);

    // 적절한 에러 응답
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 에러',
      },
      { status: 500 }
    );
  }
}
```

**에러 타입별 처리**:
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 검증 에러
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: '이름은 필수입니다' },
        { status: 400 }  // Bad Request
      );
    }

    const result = await service.create(body);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    // ValidationError
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // NotFoundError
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    // 기타 에러
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: '서버 에러가 발생했습니다' },
      { status: 500 }
    );
  }
}
```

**프로젝트 참조**:
- 파일: `src/app/api/target-products/route.ts`
- 라인: 48-53, 91-99
- 설명: try-catch 패턴과 에러 타입별 처리

```typescript
export async function GET() {
  try {
    const products = await targetProductService.findAll();
    return successResponse(products);
  } catch (error) {
    console.error('[API] Error fetching target products:', error);
    return errorResponse(handlePrismaError(error));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.target_product_line_id || !body.target_product_name || !body.deployment_date) {
      return badRequestResponse('필수 필드가 누락되었습니다');
    }

    const dto: CreateTargetProductDto = { /* ... */ };
    const product = await targetProductService.create(dto);

    return createdResponse(product);
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequestResponse(error.message);
    }
    return errorResponse(handlePrismaError(error));
  }
}
```

**HTTP 상태 코드 가이드**:
```typescript
// 200 OK - 성공
{ status: 200 }

// 201 Created - 생성 성공
{ status: 201 }

// 400 Bad Request - 잘못된 요청
{ status: 400 }

// 401 Unauthorized - 인증 필요
{ status: 401 }

// 403 Forbidden - 권한 없음
{ status: 403 }

// 404 Not Found - 찾을 수 없음
{ status: 404 }

// 500 Internal Server Error - 서버 에러
{ status: 500 }
```

**왜 다른 답은 틀렸을까?**

**A) throw만 하기 (❌)**:
```typescript
export async function GET() {
  const data = await service.findAll();
  throw new Error('에러!');  // ❌ 클라이언트가 받을 응답이 없음
}
```

**C) console.log만 (❌)**:
```typescript
export async function GET() {
  try {
    const data = await service.findAll();
    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);  // ❌ 로깅만 하고 계속 진행?
    // 응답이 없어서 에러!
  }
}
```

**D) 에러 무시 (❌)**:
```typescript
export async function GET() {
  try {
    const data = await service.findAll();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({});  // ❌ 빈 응답? 클라이언트가 에러인지 모름
  }
}
```

</details>

---

### 퀴즈 29: URL 파라미터 받기 (초급)

**문제**: `/api/products/123`에서 "123"을 받으려면?

```typescript
// app/api/products/[id]/route.ts
export async function GET(request, { params }) {
  // 여기서 id 값을 어떻게 받을까?
}
```

A) `const id = params.id;`
B) `const { id } = params;`
C) `const { id } = await params;`
D) `const id = request.params.id;`

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
Next.js 15+에서 params는 Promise이므로 반드시 await를 사용해야 합니다.

**상세 설명**:

**올바른 코드**:
```typescript
// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ✅ await params 필수!
  const { id } = await params;

  console.log(id);  // "123"

  const product = await service.findById(Number(id));

  return NextResponse.json({
    success: true,
    data: product,
  });
}
```

**타입 정의 포함**:
```typescript
interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  // id는 string 타입
}
```

**여러 파라미터**:
```typescript
// app/api/blog/[category]/[slug]/route.ts
interface RouteParams {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { category, slug } = await params;

  console.log(category);  // "tech"
  console.log(slug);      // "hello-world"

  // /api/blog/tech/hello-world로 접근 시
}
```

**DELETE 예시**:
```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await service.delete(Number(id));

  return NextResponse.json({
    success: true,
    message: `ID ${id} 삭제 완료`,
  });
}
```

**프로젝트 참조**:
- 파일: `src/app/api/target-products/[id]/route.ts`
- 설명: params를 await하여 id 추출

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await targetProductService.findById(Number(id));

    return successResponse(product);
  } catch (error) {
    // ...
  }
}
```

**Number 변환 주의**:
```typescript
const { id } = await params;
// id는 string!

// ✅ 숫자로 변환
const numericId = Number(id);
await service.findById(numericId);

// 또는
await service.findById(parseInt(id, 10));
```

**잘못된 ID 처리**:
```typescript
const { id } = await params;

// 숫자가 아닌 경우
if (isNaN(Number(id))) {
  return NextResponse.json(
    { success: false, error: '잘못된 ID 형식' },
    { status: 400 }
  );
}

const product = await service.findById(Number(id));
```

</details>

---

### 퀴즈 30: 성공 응답 형식 (초급)

**문제**: 다음 중 일관된 API 응답 형식으로 가장 좋은 것은?

A) `{ data: [] }`
B) `{ success: true, data: [] }`
C) `{ ok: true, result: [] }`
D) `{ status: 'success', items: [] }`

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
`{ success: boolean, data: any }` 형식은 성공/실패를 명확히 구분하고 일관성을 유지합니다.

**상세 설명**:

**권장 응답 형식**:

**성공 응답**:
```typescript
// 조회 성공
{
  success: true,
  data: [
    { id: 1, name: '제품1' },
    { id: 2, name: '제품2' }
  ]
}

// 생성 성공
{
  success: true,
  data: {
    id: 123,
    name: '새 제품',
    created_at: '2024-01-01'
  }
}

// 삭제 성공
{
  success: true,
  message: '삭제되었습니다'
}
```

**에러 응답**:
```typescript
// 검증 에러 (400)
{
  success: false,
  error: '이름은 필수입니다'
}

// Not Found (404)
{
  success: false,
  error: 'ID 123을 찾을 수 없습니다'
}

// 서버 에러 (500)
{
  success: false,
  error: '서버 에러가 발생했습니다'
}
```

**프로젝트의 응답 형식**:
```typescript
// src/lib/utils/apiResponse.ts

// 성공 응답
export function successResponse<T>(data: T) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: 200 }
  );
}

// 생성 성공
export function createdResponse<T>(data: T) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: 201 }
  );
}

// 에러 응답
export function errorResponse(error: string) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status: 500 }
  );
}

// Bad Request
export function badRequestResponse(error: string) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status: 400 }
  );
}
```

**클라이언트에서 사용**:
```typescript
// 클라이언트 코드
const response = await fetch('/api/products');
const result = await response.json();

// success로 성공/실패 구분
if (result.success) {
  console.log('데이터:', result.data);
} else {
  console.error('에러:', result.error);
}
```

**프로젝트 참조**:
- 파일: `src/lib/utils/apiResponse.ts`
- 설명: 일관된 응답 형식 유틸리티

- 파일: `src/app/api/target-products/route.ts`
- 라인: 47, 90
- 사용: successResponse, createdResponse 사용

**왜 이 형식이 좋을까?**

**1) 명확성**:
```typescript
// ✅ success로 즉시 판단
if (result.success) { /* 성공 */ }

// ❌ 다른 형식은 애매함
if (result.ok) { /* ok? okay? success? */ }
if (result.status === 'success') { /* 문자열 비교 */ }
```

**2) 일관성**:
```typescript
// ✅ 모든 API가 같은 형식
GET /api/products    → { success: true, data: [] }
POST /api/products   → { success: true, data: {} }
DELETE /api/products → { success: true }

// 에러도 일관됨
모든 에러 → { success: false, error: "..." }
```

**3) 타입 안전성**:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 타입 추론 가능
const result: ApiResponse<Product[]> = await fetch(...);
```

</details>

---

