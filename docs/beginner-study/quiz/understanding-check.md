# ✅ 이해도 체크리스트 & 퀴즈

이 문서는 학습 내용을 **점검하고 확인**하는 자료입니다.

체크리스트를 완료하고, 퀴즈를 풀어보세요!

---

## ✅ 이해도 체크리스트

### 기초 개념 (필수)

다음 항목을 이해했는지 체크해보세요:

```
□ Next.js가 무엇인지 설명할 수 있다
□ Server Component와 Client Component의 차이를 안다
□ 언제 Server를 쓰고 언제 Client를 써야 하는지 안다
□ API Route가 무엇인지 설명할 수 있다
□ Service Layer의 역할을 안다
□ Prisma ORM이 무엇인지 안다
□ DTO가 무엇인지 설명할 수 있다
```

### 코드 흐름 (중요)

다음 흐름을 설명할 수 있는지 체크해보세요:

```
□ 페이지 로딩 시 데이터 흐름을 단계별로 설명할 수 있다
   (사용자 요청 → Router → page.tsx → serverFetch → API → Service → DB)

□ 삭제 버튼 클릭 시 무슨 일이 일어나는지 안다
   (클릭 → 낙관적 업데이트 → API 호출 → 성공/실패 처리)

□ 낙관적 업데이트가 무엇인지 안다
   (먼저 UI 업데이트 → 백그라운드 API 호출)

□ serverFetch가 무엇을 하는지 안다
   (Server Component에서 내부 API 호출)

□ Prisma ORM의 역할을 안다
   (SQL 쿼리 생성, 타입 안전성)

□ 응답이 역순으로 돌아오는 것을 이해한다
   (DB → Service → API → Client)
```

### 실전 적용 (고급)

다음 작업을 할 수 있는지 체크해보세요:

```
□ 새로운 필드를 추가할 수 있다
   (schema.prisma → migrate → Service → API → UI)

□ 새로운 페이지를 만들 수 있다
   (page.tsx + Component 생성)

□ CRUD 전체를 처음부터 만들 수 있다
   (DB 스키마 → Service → API → Page → Component)

□ 에러가 나면 스스로 해결할 수 있다
   (에러 메시지 읽기 → 해당 계층 찾기 → 수정)

□ 다른 프로젝트에 패턴을 적용할 수 있다
   (패턴 참조서를 보고 템플릿 복사)
```

---

## ❓ 이해도 확인 퀴즈

### 퀴즈 1: Server vs Client (기초)

**문제**: 다음 중 Server Component를 사용해야 하는 경우는?

A) 버튼 클릭 이벤트 처리
B) 데이터베이스에서 초기 데이터 가져오기
C) useState로 상태 관리
D) 입력창 값 변경 감지

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
- Server Component는 서버에서만 실행되며, DB 접근이나 초기 데이터 로딩에 적합합니다
- A, C, D는 모두 사용자 상호작용이 필요하므로 Client Component에서 해야 합니다

**추가 설명**:
```
Server Component 사용 시기:
✅ 초기 데이터 로드
✅ SEO 필요
✅ 보안 (API 키, DB 비밀번호)

Client Component 사용 시기:
✅ 버튼 클릭, 입력 등 이벤트
✅ useState, useEffect
✅ 브라우저 API
```
</details>

---

### 퀴즈 2: 데이터 흐름 (중요)

**문제**: 사용자가 제품 목록 페이지를 처음 방문했을 때, 데이터가 흐르는 올바른 순서는?

A) Page → API → Service → DB
B) DB → Service → API → Page
C) API → Page → DB → Service
D) Service → DB → Page → API

<details>
<summary>정답 보기</summary>

**정답: A** (요청 흐름) 그리고 응답은 **B** (역순)

**해설**:
1. **요청 흐름**: Page → serverFetch → API → Service → DB
2. **응답 흐름**: DB → Service → API → serverFetch → Page (역순!)

**전체 흐름**:
```
┌──────┐
│ Page │ ─────┐
└──────┘      │
              ↓ 요청
         ┌─────────┐
         │   API   │
         └─────────┘
              ↓
         ┌─────────┐
         │ Service │
         └─────────┘
              ↓
         ┌─────────┐
         │   DB    │
         └─────────┘
              │
              ↓ 응답 (역순)
         (모두 거꾸로)
```
</details>

---

### 퀴즈 3: 낙관적 업데이트 (중요)

**문제**: 낙관적 업데이트(Optimistic Update)의 장점은?

A) 서버 부하를 줄인다
B) 사용자에게 빠른 반응을 보여준다
C) 코드가 간단해진다
D) 에러가 발생하지 않는다

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
낙관적 업데이트는 서버 응답을 기다리지 않고 먼저 UI를 업데이트하여 사용자 경험을 개선합니다.

**동작 방식**:
```
일반 방법:
  클릭 → 로딩 ⏳ (1초) → UI 업데이트
  사용자: "느리다..." 😕

낙관적 업데이트:
  클릭 → 즉시 UI 업데이트 ⚡ (0.01초)
        └─ 백그라운드 API 호출 (1초)
  사용자: "빠르다!" 😊
```

**주의사항**:
- 실패 시 복구 로직이 필요합니다 (router.refresh())
- A: 서버 부하는 동일 (API 호출은 여전히 발생)
- C: 오히려 코드가 복잡해집니다 (복구 로직 필요)
- D: 에러는 여전히 발생할 수 있습니다
</details>

---

### 퀴즈 4: API Route (기초)

**문제**: 다음 중 틀린 것은?

A) GET은 데이터 조회에 사용한다
B) POST는 데이터 생성에 사용한다
C) DELETE는 데이터 수정에 사용한다
D) PUT은 데이터 수정에 사용한다

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
DELETE는 데이터 **삭제**에 사용합니다. 수정은 PUT 또는 PATCH를 씁니다.

**HTTP 메서드 정리**:
```
GET    → 읽기   (Read)
POST   → 생성   (Create)
PUT    → 전체 수정 (Update - 전체)
PATCH  → 부분 수정 (Update - 일부)
DELETE → 삭제   (Delete)

CRUD 매핑:
C - CREATE  → POST
R - READ    → GET
U - UPDATE  → PUT/PATCH
D - DELETE  → DELETE
```
</details>

---

### 퀴즈 5: 실전 적용 (고급)

**문제**: 새로운 "카테고리" 기능을 만들 때, 가장 먼저 해야 할 일은?

A) UI 컴포넌트 만들기
B) API Route 만들기
C) 데이터베이스 스키마 정의하기
D) Service Layer 만들기

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
데이터 구조를 먼저 정의해야 나머지 계층을 만들 수 있습니다.

**올바른 순서**:
```
1. 📊 DB 스키마 정의
   └─ schema.prisma 수정
   └─ npx prisma migrate dev

2. 📋 타입 정의
   └─ category.types.ts

3. ⚙️ Service Layer
   └─ category.service.ts

4. 🛣️ API Routes
   └─ /api/categories/route.ts
   └─ /api/categories/[id]/route.ts

5. 📄 Pages
   └─ /categories/page.tsx

6. 🧩 Components
   └─ CategoryList.tsx
   └─ CategoryForm.tsx

7. ✅ 테스트
```

**왜 이 순서일까?**
- 데이터 구조가 정해져야 타입을 정의할 수 있어요
- 타입이 있어야 Service를 만들 수 있어요
- Service가 있어야 API를 만들 수 있어요
- API가 있어야 UI를 만들 수 있어요
</details>

---

### 퀴즈 6: 에러 처리 (고급)

**문제**: API Route에서 에러 처리를 하는 올바른 방법은?

A) 에러를 무시하고 빈 배열 반환
B) console.log만 하고 계속 진행
C) try-catch로 감싸고 적절한 응답 반환
D) 에러를 그대로 throw하여 Next.js가 처리하게 함

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
API Route는 항상 적절한 응답을 반환해야 합니다. try-catch로 에러를 잡고, HTTP 상태 코드와 함께 에러 메시지를 반환하세요.

**올바른 패턴**:
```typescript
export async function GET() {
  try {
    const data = await service.findAll();
    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error('에러:', error);
    return NextResponse.json(
      { success: false, error: '조회 실패' },
      { status: 500 }
    );
  }
}
```

**HTTP 상태 코드**:
```
200 OK            - 성공
201 Created       - 생성 성공
400 Bad Request   - 잘못된 요청
404 Not Found     - 찾을 수 없음
500 Internal Error - 서버 에러
```
</details>

---

## 💡 자주 하는 실수와 해결법

### 실수 1: 'use client'를 안 썼는데 useState를 씀

**에러**:
```
Error: useState only works in Client Components.
Add the "use client" directive at the top of the file.
```

**해결**:
```typescript
// ✅ 파일 맨 위에 추가
'use client'

import { useState } from 'react';

export default function MyComponent() {
  const [count, setCount] = useState(0);
  // ...
}
```

**왜?**
- useState는 브라우저에서만 작동합니다
- Server Component에서는 사용할 수 없어요
- 'use client'를 추가하면 Client Component가 됩니다

---

### 실수 2: async 함수를 Client Component에서 쓰려고 함

**틀린 코드**:
```typescript
'use client'

// ❌ Client Component는 async 함수가 될 수 없어요!
export default async function MyComponent() {
  const data = await fetch('/api/products');
  return <div>{data}</div>;
}
```

**올바른 코드**:
```typescript
'use client'

import { useEffect, useState } from 'react';

export default function MyComponent() {
  const [data, setData] = useState(null);

  // ✅ useEffect 안에서 fetch
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setData);
  }, []);

  return <div>{data ? data : '로딩 중...'}</div>;
}
```

**왜?**
- Client Component는 async 함수가 될 수 없어요
- Server Component만 async 가능합니다
- Client에서는 useEffect + fetch를 사용하세요

---

### 실수 3: params를 await 안 하고 바로 씀

**틀린 코드**:
```typescript
// ❌ Next.js 15+에서는 params가 Promise예요!
export async function GET(request, { params }) {
  const id = params.id;  // 에러!
}
```

**올바른 코드**:
```typescript
// ✅ await를 써야 해요
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // Promise니까 await!
  // ...
}
```

**왜?**
- Next.js 15부터 params는 Promise입니다
- 반드시 await 해야 값을 얻을 수 있어요
- TypeScript 타입에도 Promise로 표시하세요

---

### 실수 4: API에서 에러 처리를 안 함

**위험한 코드**:
```typescript
// ❌ 에러가 나면 어떻게 되나요?
export async function GET() {
  const data = await service.findAll();  // 에러 나면?
  return NextResponse.json({ data });
}
```

**안전한 코드**:
```typescript
// ✅ try-catch로 안전하게!
export async function GET() {
  try {
    const data = await service.findAll();
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('에러:', error);
    return NextResponse.json(
      { success: false, error: '조회 실패' },
      { status: 500 }
    );
  }
}
```

**왜?**
- 에러가 나도 적절한 응답을 보내야 합니다
- 클라이언트가 에러를 처리할 수 있어야 해요
- try-catch는 필수입니다!

---

### 실수 5: Prisma 마이그레이션 안 하고 스키마만 수정

**틀린 순서**:
```
1. schema.prisma 수정
2. 바로 코드 작성 → 에러! 💥
```

**올바른 순서**:
```
1. schema.prisma 수정
2. npx prisma migrate dev  👈 이거 필수!
3. 코드 작성
```

**에러 메시지**:
```
Error: Column 'description' not found in table
```

**해결**:
```bash
# 터미널에서 실행
npx prisma migrate dev --name add_description

# 또는
npx prisma migrate dev
# 그리고 마이그레이션 이름 입력
```

**왜?**
- schema.prisma는 "설계도"일 뿐입니다
- migrate는 "실제 공사"입니다
- 설계도만 바꾸고 공사를 안 하면 DB에 반영이 안 돼요!

---

### 실수 6: DTO 타입을 안 맞춤

**문제**:
```typescript
// Service에서 반환
return {
  id: product.id,
  productName: product.name,  // productName
};

// 타입 정의
interface ProductDto {
  id: number;
  name: string;  // name (필드명이 다름!)
}
```

**해결**:
```typescript
// ✅ 필드명을 정확히 일치시키기
return {
  id: product.id,
  name: product.name,  // 타입과 동일하게
};
```

**또는 매핑 추가**:
```typescript
return {
  id: product.id,
  name: product.productName,  // DB 필드명 → DTO 필드명
};
```

**왜?**
- TypeScript는 필드명이 정확히 일치해야 합니다
- 오타나 이름 불일치는 타입 에러를 일으켜요
- IDE의 자동완성을 활용하세요

---

## 🎯 완료 기준

다음을 모두 할 수 있으면 이 가이드를 완료한 것입니다:

### 초급 완료 기준
```
□ 코드를 보고 어느 파일이 Server/Client인지 구분할 수 있다
□ 페이지 로딩 시 실행 순서를 그림으로 그릴 수 있다
□ 새로운 필드를 추가하고 화면에 표시할 수 있다
```

### 중급 완료 기준
```
□ 간단한 CRUD를 처음부터 만들 수 있다
□ 에러 메시지를 보고 어느 계층의 문제인지 알 수 있다
□ 낙관적 업데이트를 구현할 수 있다
```

### 고급 완료 기준
```
□ 완전히 새로운 엔티티를 처음부터 끝까지 만들 수 있다
□ 다른 프로젝트에서도 이 패턴을 자신있게 사용할 수 있다
□ 팀원에게 이 아키텍처를 설명할 수 있다
```

---

## 🎉 축하합니다!

모든 체크리스트와 퀴즈를 완료했나요?

**축하합니다! 🎉**

이제 Next.js App Router의 기본을 마스터했습니다.

다른 프로젝트에서도 이 패턴을 자신있게 사용할 수 있을 것입니다!

---

## 💪 다음 단계 추천

### 더 배우고 싶다면:
```
1. Next.js 공식 문서 읽기
   https://nextjs.org/docs

2. Prisma 공식 문서 읽기
   https://www.prisma.io/docs

3. TypeScript 깊이 있게 배우기
   https://www.typescriptlang.org/docs

4. 실전 프로젝트 만들기
   - 블로그
   - Todo 앱
   - 쇼핑몰
```

### 실력을 늘리려면:
```
1. 오픈소스 프로젝트 코드 읽기
2. 다른 사람의 코드 리뷰하기
3. 매일 조금씩 코딩하기
4. 에러를 두려워하지 말기
```

---

## 🙏 마무리 인사

이 가이드가 도움이 되었기를 바랍니다!

프로그래밍은 **반복 연습**으로 늡니다.

한 번에 완벽할 필요 없어요!

천천히, 꾸준히 배워나가세요. 💪

**화이팅! 🚀**
