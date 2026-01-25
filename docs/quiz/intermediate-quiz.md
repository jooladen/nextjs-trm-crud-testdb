# 🎯 중급 퀴즈 (50개)

Next.js App Router의 패턴과 실전 구현을 확인하는 퀴즈입니다.

**예상 소요 시간**: 3-4시간
**난이도**: ⭐⭐ 중급

---

## 📚 목차

1. [Service Layer 패턴 (8개)](#1-service-layer-패턴-8개)
2. [낙관적 업데이트 (8개)](#2-낙관적-업데이트-8개)
3. [CRUD 전체 흐름 (8개)](#3-crud-전체-흐름-8개)
4. [커스텀 훅 심화 (7개)](#4-커스텀-훅-심화-7개)
5. [폼 처리와 유효성 검증 (6개)](#5-폼-처리와-유효성-검증-6개)
6. [에러 처리 전략 (6개)](#6-에러-처리-전략-6개)
7. [타입 안정성 강화 (4개)](#7-타입-안정성-강화-4개)
8. [Revalidation 전략 (3개)](#8-revalidation-전략-3개)

---

## 1. Service Layer 패턴 (8개)

### 퀴즈 1: Service Layer의 역할 (중급)

**문제**: Service Layer가 필요한 이유로 **가장 적절한** 것은?

A) 데이터베이스 쿼리를 숨기기 위해
B) 비즈니스 로직을 중앙화하고 재사용하기 위해
C) API Route를 더 빠르게 만들기 위해
D) TypeScript 타입을 자동으로 생성하기 위해

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
Service Layer는 비즈니스 로직을 한 곳에 모아 여러 곳에서 재사용할 수 있게 합니다.

**상세 설명**:
- **B) 정답**: Service Layer의 핵심 목적은 비즈니스 로직 중앙화입니다
  - API Route, Server Component, Server Action 등 여러 곳에서 재사용
  - 일관된 데이터 처리 로직 보장
  - 테스트와 유지보수 용이

**프로젝트 참조**:
```typescript
// src/lib/services/targetProduct.service.ts
export const targetProductService = {
  async getAll(searchParams?: SearchParams): Promise<TargetProduct[]> {
    // 비즈니스 로직: 검색, 정렬, 필터링
    const where = buildWhereClause(searchParams);
    return await prisma.targetProduct.findMany({ where });
  }
};
```

이 서비스는 다음에서 모두 사용됩니다:
- `src/app/api/target-products/route.ts` (API Route)
- `src/app/trm/target-products/page.tsx` (Server Component)

**핵심 원칙**:
```
┌─────────────────┐
│  Presentation   │ ← 여러 진입점
│  (API, Page)    │
├─────────────────┤
│ Service Layer   │ ← 로직 중앙화 (재사용)
├─────────────────┤
│   Data Layer    │ ← Prisma
│   (Database)    │
└─────────────────┘
```

</details>

---

### 퀴즈 2: Service Layer 메서드 설계 (중급)

**문제**: 다음 중 Service Layer 메서드 설계로 **부적절한** 것은?

A) `async getAll(filters?: Filters): Promise<Product[]>`
B) `async create(data: CreateDTO): Promise<Product>`
C) `async updateDOM(elementId: string): Promise<void>`
D) `async delete(id: string): Promise<void>`

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
Service Layer는 비즈니스 로직만 담당하며, DOM 조작은 클라이언트 컴포넌트의 역할입니다.

**잘못된 이유**:
- **C) updateDOM**: Service Layer는 서버 코드이므로 DOM에 접근할 수 없습니다
- DOM 조작은 브라우저(Client Component)에서만 가능

**올바른 설계**:
```typescript
// ✅ 올바른 Service Layer
export const productService = {
  async getAll(filters?: Filters): Promise<Product[]> {
    // 데이터 조회 로직
  },
  async create(data: CreateDTO): Promise<Product> {
    // 데이터 생성 로직
  },
  async delete(id: string): Promise<void> {
    // 데이터 삭제 로직
  }
};

// ✅ DOM 조작은 Client Component에서
'use client'
function ProductList() {
  const handleUpdate = () => {
    const element = document.getElementById('product');
    element.classList.add('updated');
  };
}
```

**아키텍처 원칙**:
- Service Layer: 순수한 비즈니스 로직 (서버)
- Client Component: UI 상호작용, DOM 조작 (브라우저)

</details>

---

### 퀴즈 3: 에러 처리 위치 (중급)

**문제**: Service Layer에서 에러를 처리하는 올바른 방법은?

```typescript
// 옵션 A
async create(data: CreateDTO) {
  return await prisma.create({ data });
}

// 옵션 B
async create(data: CreateDTO) {
  try {
    return await prisma.create({ data });
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 옵션 C
async create(data: CreateDTO) {
  try {
    return await prisma.create({ data });
  } catch (error) {
    throw new Error(`Failed to create: ${error.message}`);
  }
}
```

<details>
<summary>정답 보기</summary>

**정답: C**

**해설**:
Service Layer는 에러를 의미 있는 메시지로 변환하여 상위 레이어로 전파해야 합니다.

**각 옵션 분석**:

**A) 에러 처리 없음**:
```typescript
❌ 문제점:
- 원시 Prisma 에러가 그대로 노출
- 에러 메시지가 기술적이고 사용자 친화적이지 않음
```

**B) 에러를 숨김**:
```typescript
❌ 문제점:
- 에러를 null로 변환하여 정보 손실
- 호출자가 실패 원인을 알 수 없음
- 디버깅 어려움
```

**C) 에러 변환 후 전파** ✅:
```typescript
✅ 장점:
- 의미 있는 에러 메시지 제공
- 스택 트레이스 유지
- 상위 레이어에서 적절히 처리 가능
```

**프로젝트 예시**:
```typescript
// src/lib/services/targetProduct.service.ts
async create(data: CreateTargetProductDTO): Promise<TargetProduct> {
  try {
    return await prisma.targetProduct.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    throw new Error(
      `Failed to create target product: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
```

**에러 처리 흐름**:
```
Service Layer         → 에러 변환 및 전파
     ↓
API Route/Component  → 사용자 친화적 메시지로 변환
     ↓
Client               → UI에 표시
```

</details>

---

### 퀴즈 4: Service Layer와 API Route 관계 (중급)

**문제**: 다음 코드의 문제점은?

```typescript
// API Route
export async function GET() {
  const data = await prisma.targetProduct.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(data);
}
```

<details>
<summary>정답 보기</summary>

**정답**: Service Layer를 건너뛰고 직접 Prisma를 호출하고 있습니다.

**문제점**:
1. **로직 중복**: 같은 쿼리가 필요한 곳마다 반복 작성
2. **유지보수 어려움**: 쿼리 변경 시 여러 곳 수정 필요
3. **테스트 곤란**: API Route 전체를 테스트해야 함
4. **일관성 부족**: 필터링, 정렬 로직이 산재

**올바른 구현**:
```typescript
// ✅ Service Layer
// src/lib/services/targetProduct.service.ts
export const targetProductService = {
  async getActive(): Promise<TargetProduct[]> {
    return await prisma.targetProduct.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
};

// ✅ API Route
// src/app/api/target-products/route.ts
import { targetProductService } from '@/lib/services/targetProduct.service';

export async function GET() {
  try {
    const data = await targetProductService.getActive();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

**장점**:
- 비즈니스 로직 재사용 가능
- Service Layer만 단위 테스트 가능
- 쿼리 변경 시 한 곳만 수정
- API Route는 HTTP 처리에만 집중

**프로젝트 참조**:
- 파일: `src/app/api/target-products/route.ts`
- 라인: 8-20
- 올바른 패턴 적용 예시

</details>

---

### 퀴즈 5: DTO 사용 이유 (중급)

**문제**: Service Layer에서 DTO(Data Transfer Object)를 사용하는 주된 이유는?

A) 데이터베이스 성능을 향상시키기 위해
B) 입력 데이터의 타입 안정성과 유효성을 보장하기 위해
C) 자동으로 데이터를 암호화하기 위해
D) Prisma 스키마를 대체하기 위해

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
DTO는 계층 간 데이터 전송 시 타입 안정성을 제공하고, 필요한 필드만 명시적으로 정의합니다.

**DTO의 역할**:

**1. 타입 안정성**:
```typescript
// src/lib/types/targetProduct.types.ts
export interface CreateTargetProductDTO {
  targetName: string;
  unitPrice: number;
  targetDescription?: string;
  isActive: boolean;
}

// ✅ 컴파일 타임에 타입 체크
const dto: CreateTargetProductDTO = {
  targetName: "Product",
  unitPrice: 100,
  // ❌ 불필요한 필드 추가 시 에러
  // id: "123", // 컴파일 에러
};
```

**2. 명시적 인터페이스**:
```typescript
// DTO: 생성 시 필요한 필드만
interface CreateDTO {
  name: string;
  price: number;
}

// Entity: DB의 전체 필드
interface Product {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**3. 유효성 검증 포인트**:
```typescript
async create(dto: CreateTargetProductDTO) {
  // DTO 필드 검증
  if (!dto.targetName || dto.unitPrice < 0) {
    throw new Error('Invalid data');
  }

  // DB 저장
  return await prisma.targetProduct.create({
    data: dto
  });
}
```

**프로젝트 참조**:
- 파일: `src/lib/types/targetProduct.types.ts`
- 라인: 8-14 (CreateTargetProductDTO 정의)
- 라인: 16-22 (UpdateTargetProductDTO 정의)

**핵심 원칙**:
```
Client Input → DTO → Service Layer → Entity → Database
              ↑
         타입 체크 & 검증
```

</details>

---

### 퀴즈 6: 빈칸 채우기 - Service 메서드 (중급)

**문제**: 다음 Service Layer 메서드의 빈칸을 채우세요.

```typescript
export const productService = {
  async getById(id: string): Promise<Product | ____> {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return ____;
    }

    return product;
  }
};
```

<details>
<summary>정답 보기</summary>

**정답**:
```typescript
async getById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    return null;
  }

  return product;
}
```

**해설**:

**반환 타입 `Product | null`**:
- 데이터를 찾았을 때: Product 반환
- 데이터를 찾지 못했을 때: null 반환
- 호출자가 null 체크를 통해 존재 여부 확인

**대안적 패턴**:

**1. null 반환** (추천):
```typescript
const product = await service.getById(id);
if (!product) {
  return { error: 'Not found' };
}
// product 사용
```

**2. 에러 던지기**:
```typescript
async getById(id: string): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
}

// 사용
try {
  const product = await service.getById(id);
} catch (error) {
  // 에러 처리
}
```

**선택 기준**:
- **null 반환**: 데이터 없음이 정상적인 상황일 때
- **에러 던지기**: 데이터가 반드시 있어야 할 때

**프로젝트 참조**:
```typescript
// src/lib/services/targetProduct.service.ts
async getById(id: string): Promise<TargetProduct | null> {
  return await prisma.targetProduct.findUnique({
    where: { id },
  });
}
```

</details>

---

### 퀴즈 7: 트랜잭션 처리 (중급)

**문제**: 여러 DB 작업을 원자적으로 처리해야 할 때 사용하는 Prisma 메서드는?

<details>
<summary>정답 보기</summary>

**정답**: `prisma.$transaction()`

**해설**:
트랜잭션은 여러 DB 작업이 모두 성공하거나 모두 실패하도록 보장합니다.

**사용 예시**:

**시나리오**: 제품 생성 + 재고 초기화
```typescript
async createWithInventory(
  productData: CreateProductDTO,
  inventoryData: CreateInventoryDTO
) {
  return await prisma.$transaction(async (tx) => {
    // 1. 제품 생성
    const product = await tx.product.create({
      data: productData
    });

    // 2. 재고 초기화
    const inventory = await tx.inventory.create({
      data: {
        ...inventoryData,
        productId: product.id
      }
    });

    return { product, inventory };
  });
}
```

**트랜잭션의 동작**:
```
성공 시:
  제품 생성 ✅ → 재고 생성 ✅ → 둘 다 커밋

실패 시:
  제품 생성 ✅ → 재고 생성 ❌ → 둘 다 롤백
```

**트랜잭션이 필요한 경우**:
1. 여러 테이블을 동시에 수정
2. 데이터 일관성이 중요한 작업
3. 금융 거래 같은 크리티컬한 작업

**배열 방식**:
```typescript
await prisma.$transaction([
  prisma.product.create({ data: productData }),
  prisma.inventory.create({ data: inventoryData })
]);
```

**주의사항**:
- 트랜잭션은 무겁기 때문에 꼭 필요할 때만 사용
- 트랜잭션 내부는 가능한 짧게 유지
- 외부 API 호출은 트랜잭션 밖에서

</details>

---

### 퀴즈 8: 실습 - Service 메서드 작성 (중급)

**문제**: 다음 요구사항을 만족하는 Service 메서드를 작성하세요.

**요구사항**:
- 메서드명: `toggleActive`
- 기능: 제품의 활성 상태를 토글 (true ↔ false)
- 파라미터: `id: string`
- 반환: `Promise<Product>`
- 에러: 제품이 없으면 에러 던지기

<details>
<summary>정답 보기</summary>

**정답**:
```typescript
async toggleActive(id: string): Promise<Product> {
  // 1. 현재 제품 조회
  const product = await prisma.product.findUnique({
    where: { id }
  });

  // 2. 존재 확인
  if (!product) {
    throw new Error(`Product with id ${id} not found`);
  }

  // 3. 활성 상태 토글
  return await prisma.product.update({
    where: { id },
    data: {
      isActive: !product.isActive,
      updatedAt: new Date()
    }
  });
}
```

**해설**:

**단계별 설명**:
1. **조회**: 현재 상태를 알아야 토글 가능
2. **검증**: 존재하지 않으면 에러
3. **업데이트**: 현재 상태의 반대로 변경

**더 나은 구현** (조회 없이):
```typescript
async toggleActive(id: string): Promise<Product> {
  try {
    // 현재 값을 읽어서 토글
    const product = await prisma.product.update({
      where: { id },
      data: {
        isActive: {
          // Prisma의 연산자 활용
          set: await prisma.product
            .findUnique({ where: { id } })
            .then(p => !p?.isActive)
        },
        updatedAt: new Date()
      }
    });
    return product;
  } catch (error) {
    throw new Error(`Failed to toggle product: ${error.message}`);
  }
}
```

**또 다른 패턴** (명시적 설정):
```typescript
async setActive(id: string, isActive: boolean): Promise<Product> {
  return await prisma.product.update({
    where: { id },
    data: { isActive, updatedAt: new Date() }
  });
}

// 사용
await service.setActive(id, true);  // 활성화
await service.setActive(id, false); // 비활성화
```

**토글 vs 명시적 설정**:
- **토글**: 현재 상태를 몰라도 됨, UI 스위치에 적합
- **명시적 설정**: 명확한 의도 표현, API에 적합

</details>

---

## 2. 낙관적 업데이트 (8개)

### 퀴즈 9: 낙관적 업데이트 개념 (중급)

**문제**: 낙관적 업데이트(Optimistic Update)란?

A) 서버 응답을 기다린 후 UI를 업데이트하는 방식
B) UI를 먼저 업데이트하고, 실패 시 되돌리는 방식
C) 데이터베이스 쿼리를 최적화하는 방식
D) 캐시를 사용하여 성능을 향상시키는 방식

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
낙관적 업데이트는 "성공할 것"이라고 낙관하여 UI를 먼저 변경하고, 실제 서버 요청을 보내는 방식입니다.

**일반적 업데이트 (Pessimistic)**:
```typescript
❌ 느린 UX
1. 사용자 클릭
2. 로딩 표시
3. 서버 요청 (1-2초)
4. 응답 받음
5. UI 업데이트 ← 여기서 사용자가 변화 확인
```

**낙관적 업데이트 (Optimistic)**:
```typescript
✅ 빠른 UX
1. 사용자 클릭
2. UI 즉시 업데이트 ← 여기서 사용자가 변화 확인
3. 백그라운드로 서버 요청
4. 성공: 그대로 유지
5. 실패: UI 롤백 + 에러 표시
```

**프로젝트 예시**:
```typescript
// src/components/trm/target-products/TargetProductList.tsx
const handleDelete = async (id: string) => {
  // 1. 낙관적 업데이트: UI에서 즉시 제거
  setProducts(prev => prev.filter(p => p.id !== id));

  try {
    // 2. 서버에 실제 삭제 요청
    await fetch(`/api/target-products/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    // 3. 실패 시: UI 복구
    setProducts(originalProducts);
    alert('삭제 실패');
  }
};
```

**장단점**:
- **장점**: 즉각적인 피드백, 빠른 UX
- **단점**: 실패 시 롤백 처리 필요
- **적합**: 성공률이 높은 작업 (삭제, 좋아요 등)

**프로젝트 참조**:
- 파일: `src/components/trm/target-products/TargetProductList.tsx`
- 라인: 29-43 (handleDelete 함수)

</details>

---

### 퀴즈 10: 낙관적 업데이트 구현 순서 (중급)

**문제**: 낙관적 업데이트의 올바른 구현 순서는?

```
A. 서버 요청 → UI 업데이트 → 에러 처리
B. UI 업데이트 → 서버 요청 → 실패 시 롤백
C. 에러 처리 → UI 업데이트 → 서버 요청
D. 서버 요청 → 에러 처리 → UI 업데이트
```

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
낙관적 업데이트는 "낙관"하여 UI를 먼저 변경한 후, 실패 시 롤백합니다.

**상세 구현 순서**:

```typescript
const handleUpdate = async (id: string, newData: UpdateDTO) => {
  // 0. 원본 데이터 백업 (롤백용)
  const originalData = [...products];

  // 1. UI 먼저 업데이트 (낙관적)
  setProducts(prev => prev.map(p =>
    p.id === id ? { ...p, ...newData } : p
  ));

  try {
    // 2. 서버 요청
    const response = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(newData)
    });

    if (!response.ok) throw new Error('Update failed');

    // 3. 성공: 서버 데이터로 최종 동기화 (선택적)
    const updated = await response.json();
    setProducts(prev => prev.map(p =>
      p.id === id ? updated : p
    ));

  } catch (error) {
    // 4. 실패: 원본으로 롤백
    setProducts(originalData);
    alert('업데이트 실패');
  }
};
```

**각 단계의 역할**:

**1. 원본 백업**:
```typescript
const originalData = [...products];
// 실패 시 여기로 되돌림
```

**2. UI 즉시 업데이트**:
```typescript
setProducts(prev => prev.map(p =>
  p.id === id ? { ...p, ...newData } : p
));
// 사용자는 여기서 변화 확인 (빠른 UX)
```

**3. 서버 요청 (비동기)**:
```typescript
await fetch(`/api/products/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(newData)
});
// 백그라운드에서 실행
```

**4. 실패 시 롤백**:
```typescript
catch (error) {
  setProducts(originalData);
  // UI를 원상복구
}
```

**시각적 흐름**:
```
사용자 클릭
    ↓
UI 즉시 변경 ✅ ← 사용자가 빠르게 확인
    ↓
[백그라운드]
서버 요청 전송...
    ↓
  성공? → 그대로 유지
  실패? → 원본으로 롤백 + 에러 메시지
```

</details>

---

### 퀴즈 11: 롤백 구현 (중급)

**문제**: 다음 코드의 문제점은?

```typescript
const handleToggle = async (id: string) => {
  // UI 업데이트
  setProducts(prev => prev.map(p =>
    p.id === id ? { ...p, isActive: !p.isActive } : p
  ));

  try {
    await fetch(`/api/products/${id}/toggle`, { method: 'POST' });
  } catch (error) {
    alert('토글 실패');
    // ??? 롤백을 어떻게?
  }
};
```

<details>
<summary>정답 보기</summary>

**정답**: 원본 데이터를 백업하지 않아서 롤백할 수 없습니다.

**문제점**:
- 에러 발생 시 이전 상태로 돌아갈 방법이 없음
- `prev`는 이미 변경된 상태를 참조

**올바른 구현**:

```typescript
const handleToggle = async (id: string) => {
  // 1. 원본 백업
  const originalProducts = [...products];
  const originalProduct = products.find(p => p.id === id);

  if (!originalProduct) return;

  // 2. UI 낙관적 업데이트
  setProducts(prev => prev.map(p =>
    p.id === id ? { ...p, isActive: !p.isActive } : p
  ));

  try {
    // 3. 서버 요청
    const response = await fetch(`/api/products/${id}/toggle`, {
      method: 'POST'
    });

    if (!response.ok) throw new Error('Toggle failed');

  } catch (error) {
    // 4. 롤백: 원본으로 복구
    setProducts(originalProducts);
    alert('토글 실패');
  }
};
```

**더 나은 패턴 - 상태 직접 되돌리기**:

```typescript
const handleToggle = async (id: string) => {
  // 1. 현재 상태 저장
  const product = products.find(p => p.id === id);
  if (!product) return;

  const previousState = product.isActive;

  // 2. UI 업데이트
  setProducts(prev => prev.map(p =>
    p.id === id ? { ...p, isActive: !p.isActive } : p
  ));

  try {
    await fetch(`/api/products/${id}/toggle`, { method: 'POST' });
  } catch (error) {
    // 3. 실패 시 이전 상태로
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, isActive: previousState } : p
    ));
    alert('토글 실패');
  }
};
```

**백업 전략 비교**:

**1. 전체 배열 복사** (간단):
```typescript
const backup = [...products];
// 장점: 간단, 확실
// 단점: 메모리 사용, 큰 배열에 비효율
```

**2. 특정 항목만 백업** (효율적):
```typescript
const backup = products.find(p => p.id === id);
// 장점: 메모리 효율적
// 단점: 복원 로직 복잡
```

**3. 이전 상태 값만 저장** (최적):
```typescript
const prevIsActive = product.isActive;
// 장점: 최소 메모리, 빠름
// 단점: 여러 필드 변경 시 복잡
```

**선택 기준**:
- 단일 필드 토글: 값만 저장
- 여러 필드 수정: 객체 백업
- 복잡한 작업: 전체 배열 백업

</details>

---

### 퀴즈 12: 낙관적 업데이트 with 새 항목 (중급)

**문제**: 새 항목 생성 시 낙관적 업데이트의 문제점은?

<details>
<summary>정답 보기</summary>

**정답**: 서버가 생성한 ID와 타임스탬프를 알 수 없습니다.

**해설**:

**문제 상황**:
```typescript
const handleCreate = async (data: CreateDTO) => {
  // ❌ 문제: ID를 어떻게 만들지?
  const newItem = {
    id: ???,  // 서버가 생성하는 ID
    ...data,
    createdAt: ???,  // 서버 시간
  };

  // UI에 추가
  setProducts(prev => [...prev, newItem]);

  // 서버 요청
  await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
```

**해결책 1: 임시 ID 사용**:
```typescript
const handleCreate = async (data: CreateDTO) => {
  // 1. 임시 ID로 UI 업데이트
  const tempId = `temp-${Date.now()}`;
  const optimisticItem = {
    id: tempId,
    ...data,
    createdAt: new Date(),
    isOptimistic: true,  // 임시 플래그
  };

  setProducts(prev => [...prev, optimisticItem]);

  try {
    // 2. 서버에서 실제 생성
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const realItem = await response.json();

    // 3. 임시 항목을 실제 항목으로 교체
    setProducts(prev =>
      prev.map(p => p.id === tempId ? realItem : p)
    );

  } catch (error) {
    // 4. 실패 시 임시 항목 제거
    setProducts(prev => prev.filter(p => p.id !== tempId));
    alert('생성 실패');
  }
};
```

**해결책 2: 낙관적 업데이트 안 함** (추천):
```typescript
const handleCreate = async (data: CreateDTO) => {
  // 생성은 서버 응답을 기다림
  setIsLoading(true);

  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const newItem = await response.json();

    // 서버 응답 후 UI 업데이트
    setProducts(prev => [...prev, newItem]);

  } catch (error) {
    alert('생성 실패');
  } finally {
    setIsLoading(false);
  }
};
```

**언제 낙관적 업데이트를 사용할까?**

**✅ 적합한 경우**:
- 삭제: ID를 알고 있음
- 업데이트: 기존 데이터 존재
- 토글: 단순 상태 변경

**❌ 부적합한 경우**:
- 생성: 서버 생성 데이터 필요
- 복잡한 계산: 서버 계산 결과 필요
- 중요한 작업: 확실한 결과 필요

**프로젝트 참조**:
```typescript
// src/components/trm/target-products/TargetProductList.tsx

// ✅ 삭제는 낙관적 업데이트
const handleDelete = async (id: string) => {
  setProducts(prev => prev.filter(p => p.id !== id));
  // ...
};

// ✅ 생성은 서버 응답 대기
const onCreate = async (data: CreateDTO) => {
  const res = await fetch('/api/target-products', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  const newProduct = await res.json();
  setProducts(prev => [...prev, newProduct]);
};
```

</details>

---

### 퀴즈 13: 빈칸 채우기 - 낙관적 삭제 (중급)

**문제**: 다음 낙관적 삭제 코드의 빈칸을 채우세요.

```typescript
const handleDelete = async (id: string) => {
  const backup = ________;

  setProducts(prev => prev.________(p => p.id ___ id));

  try {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
  } catch (error) {
    setProducts(________);
  }
};
```

<details>
<summary>정답 보기</summary>

**정답**:
```typescript
const handleDelete = async (id: string) => {
  const backup = [...products];

  setProducts(prev => prev.filter(p => p.id !== id));

  try {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
  } catch (error) {
    setProducts(backup);
  }
};
```

**해설**:

**각 부분 설명**:

**1. 백업**:
```typescript
const backup = [...products];
// 스프레드로 배열 복사 (얕은 복사)
```

**2. 필터링**:
```typescript
prev.filter(p => p.id !== id)
// id가 일치하지 않는 것만 남김
// = id가 일치하는 것 제거
```

**3. 비교 연산자**:
```typescript
p.id !== id
// !==: 같지 않다
// id가 다른 항목만 유지
```

**4. 롤백**:
```typescript
setProducts(backup);
// 백업한 원본으로 복구
```

**전체 흐름**:
```typescript
// 예: products = [A, B, C], id = 'B'

// 1. 백업
backup = [A, B, C]

// 2. UI에서 B 제거
products = [A, C]  // 사용자는 즉시 확인

// 3. 서버 요청
fetch DELETE /api/products/B

// 4a. 성공 → 그대로
products = [A, C]

// 4b. 실패 → 롤백
products = [A, B, C]  // 원상복구
```

**React 18 자동 배칭**:
```typescript
// React 18에서는 이 두 setState가 하나로 합쳐짐
setProducts(newProducts);
setIsLoading(false);
// → 한 번만 리렌더링
```

</details>

---

### 퀴즈 14: 낙관적 업데이트 UX (중급)

**문제**: 낙관적 업데이트 시 사용자에게 피드백을 제공하는 방법은?

<details>
<summary>정답 보기</summary>

**답변**: 로딩 표시, 임시 스타일, 언두(Undo) 버튼 등을 사용합니다.

**해설**:

**1. 로딩 인디케이터**:
```typescript
const [deletingIds, setDeletingIds] = useState<string[]>([]);

const handleDelete = async (id: string) => {
  // 삭제 중 표시
  setDeletingIds(prev => [...prev, id]);
  setProducts(prev => prev.filter(p => p.id !== id));

  try {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
  } catch (error) {
    setProducts(backup);
  } finally {
    // 완료 후 제거
    setDeletingIds(prev => prev.filter(delId => delId !== id));
  }
};

// UI
<div className={deletingIds.includes(product.id) ? 'opacity-50' : ''}>
  {product.name}
</div>
```

**2. 임시 스타일 (회색 처리)**:
```typescript
// 낙관적 업데이트된 항목 표시
<div className={product.isOptimistic ? 'opacity-60 animate-pulse' : ''}>
  {product.name}
</div>
```

**3. 언두(Undo) 토스트**:
```typescript
const handleDelete = async (id: string) => {
  const backup = products.find(p => p.id === id);
  let isUndone = false;

  // UI에서 제거
  setProducts(prev => prev.filter(p => p.id !== id));

  // 언두 토스트 표시
  const toastId = toast.success(
    <div>
      삭제되었습니다
      <button onClick={() => {
        isUndone = true;
        setProducts(prev => [...prev, backup]);
        toast.dismiss(toastId);
      }}>
        실행 취소
      </button>
    </div>,
    { duration: 5000 }
  );

  // 5초 후 실제 삭제
  await new Promise(resolve => setTimeout(resolve, 5000));

  if (!isUndone) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
  }
};
```

**4. 진행 상태 표시**:
```typescript
const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

const handleUpdate = async (data: UpdateDTO) => {
  setStatus('saving');
  setProducts(newProducts);

  try {
    await fetch('/api/products', { method: 'PATCH', body: JSON.stringify(data) });
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 2000);
  } catch (error) {
    setStatus('error');
    setProducts(backup);
  }
};

// UI
{status === 'saving' && <Spinner />}
{status === 'saved' && <CheckIcon />}
{status === 'error' && <ErrorIcon />}
```

**5. 낙관적 UI 패턴 예시**:
```typescript
interface Product {
  id: string;
  name: string;
  // 낙관적 업데이트 메타데이터
  _optimistic?: {
    type: 'create' | 'update' | 'delete';
    timestamp: number;
  };
}

// 렌더링
<div className={classNames({
  'opacity-50': product._optimistic?.type === 'delete',
  'border-blue-500': product._optimistic?.type === 'create',
  'bg-yellow-50': product._optimistic?.type === 'update',
})}>
  {product.name}
  {product._optimistic && (
    <span className="text-sm text-gray-500 ml-2">
      {product._optimistic.type === 'delete' && '삭제 중...'}
      {product._optimistic.type === 'create' && '생성 중...'}
      {product._optimistic.type === 'update' && '저장 중...'}
    </span>
  )}
</div>
```

**핵심 원칙**:
- 사용자는 무언가 일어나고 있음을 알아야 함
- 실패 시 명확한 피드백 제공
- 가능하면 언두(되돌리기) 옵션 제공

</details>

---

### 퀴즈 15: 낙관적 업데이트 에러 시나리오 (중급)

**문제**: 낙관적 업데이트 중 서버 에러 발생 시 가장 적절한 처리는?

A) 조용히 실패하고 로그만 남긴다
B) UI를 롤백하고 에러 메시지를 표시한다
C) 자동으로 재시도한다
D) 페이지를 새로고침한다

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
사용자는 작업이 실패했음을 알아야 하고, UI는 정확한 상태를 반영해야 합니다.

**올바른 에러 처리**:

```typescript
const handleUpdate = async (id: string, data: UpdateDTO) => {
  const backup = [...products];

  // 낙관적 업데이트
  setProducts(prev => prev.map(p =>
    p.id === id ? { ...p, ...data } : p
  ));

  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Update failed');
    }

  } catch (error) {
    // 1. UI 롤백
    setProducts(backup);

    // 2. 에러 메시지 표시
    if (error instanceof Error) {
      toast.error(`업데이트 실패: ${error.message}`);
    } else {
      toast.error('업데이트에 실패했습니다');
    }

    // 3. 선택적: 에러 로깅
    console.error('Update failed:', error);
  }
};
```

**각 옵션 분석**:

**A) 조용히 실패** ❌:
```typescript
catch (error) {
  console.error(error);
  // 문제: 사용자가 실패를 모름
  // → 데이터가 저장된 줄 알고 있음
}
```

**B) 롤백 + 에러 표시** ✅:
```typescript
catch (error) {
  setProducts(backup);  // 정확한 상태 유지
  toast.error(error.message);  // 사용자에게 알림
}
```

**C) 자동 재시도** ⚠️:
```typescript
catch (error) {
  // 네트워크 일시 오류에만 적합
  if (retryCount < 3) {
    await handleUpdate(id, data);  // 재시도
  } else {
    setProducts(backup);
    toast.error('여러 번 시도했으나 실패');
  }
}
```

**D) 페이지 새로고침** ❌:
```typescript
catch (error) {
  window.location.reload();
  // 문제: 사용자가 입력한 다른 데이터 손실
}
```

**에러 타입별 처리**:

```typescript
catch (error) {
  setProducts(backup);  // 항상 롤백

  if (error instanceof TypeError) {
    // 네트워크 오류
    toast.error('네트워크 연결을 확인해주세요');
  } else if (response?.status === 403) {
    // 권한 오류
    toast.error('권한이 없습니다');
    router.push('/login');
  } else if (response?.status === 409) {
    // 충돌 오류
    toast.error('다른 사용자가 수정했습니다. 새로고침해주세요');
  } else {
    // 기타 오류
    toast.error('업데이트 실패');
  }
}
```

**UX 개선 패턴**:
```typescript
const handleUpdate = async (id: string, data: UpdateDTO) => {
  const backup = [...products];
  setProducts(optimisticUpdate);

  try {
    await updateAPI(id, data);
    toast.success('저장되었습니다', { duration: 2000 });
  } catch (error) {
    setProducts(backup);

    // 재시도 옵션 제공
    toast.error(
      <div>
        <p>업데이트 실패</p>
        <button onClick={() => handleUpdate(id, data)}>
          다시 시도
        </button>
      </div>,
      { duration: 5000 }
    );
  }
};
```

</details>

---

### 퀴즈 16: 실습 - 낙관적 토글 구현 (중급)

**문제**: 다음 요구사항에 맞는 낙관적 토글 함수를 작성하세요.

**요구사항**:
- 제품의 `isActive` 상태를 토글
- UI는 즉시 업데이트
- 실패 시 원래 상태로 복구
- 에러 메시지 표시

<details>
<summary>정답 보기</summary>

**정답**:
```typescript
const handleToggleActive = async (id: string) => {
  // 1. 원본 상태 백업
  const product = products.find(p => p.id === id);
  if (!product) return;

  const previousState = product.isActive;

  // 2. 낙관적 UI 업데이트
  setProducts(prev => prev.map(p =>
    p.id === id
      ? { ...p, isActive: !p.isActive }
      : p
  ));

  try {
    // 3. 서버 요청
    const response = await fetch(`/api/products/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('토글 실패');
    }

  } catch (error) {
    // 4. 실패 시 롤백
    setProducts(prev => prev.map(p =>
      p.id === id
        ? { ...p, isActive: previousState }
        : p
    ));

    // 5. 에러 메시지
    alert('활성 상태 변경에 실패했습니다');
    console.error(error);
  }
};
```

**개선된 버전 (토스트 + 로딩 상태)**:

```typescript
import { toast } from 'react-hot-toast';

const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

const handleToggleActive = async (id: string) => {
  // 이미 토글 중이면 무시
  if (togglingIds.has(id)) return;

  const product = products.find(p => p.id === id);
  if (!product) return;

  const previousState = product.isActive;

  // 토글 중 표시
  setTogglingIds(prev => new Set([...prev, id]));

  // 낙관적 업데이트
  setProducts(prev => prev.map(p =>
    p.id === id ? { ...p, isActive: !p.isActive } : p
  ));

  try {
    const response = await fetch(`/api/products/${id}/toggle`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Toggle failed');
    }

    // 성공 피드백
    toast.success(
      previousState ? '비활성화되었습니다' : '활성화되었습니다',
      { duration: 2000 }
    );

  } catch (error) {
    // 롤백
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, isActive: previousState } : p
    ));

    // 에러 피드백
    toast.error(
      error instanceof Error ? error.message : '상태 변경 실패',
      { duration: 3000 }
    );

  } finally {
    // 토글 완료
    setTogglingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }
};

// UI에서 사용
<button
  onClick={() => handleToggleActive(product.id)}
  disabled={togglingIds.has(product.id)}
  className={togglingIds.has(product.id) ? 'opacity-50 cursor-wait' : ''}
>
  {product.isActive ? '활성' : '비활성'}
</button>
```

**핵심 포인트**:

**1. 상태 백업**:
- 전체 배열이 아닌 해당 값만 저장 (효율적)

**2. 중복 요청 방지**:
```typescript
if (togglingIds.has(id)) return;
```

**3. 타입 안전한 에러 처리**:
```typescript
error instanceof Error ? error.message : '기본 메시지'
```

**4. UX 개선**:
- 토글 중 버튼 비활성화
- 명확한 피드백 메시지
- 로딩 인디케이터

</details>

---

## 3. CRUD 전체 흐름 (8개)

### 퀴즈 17: CRUD 데이터 흐름 (중급)

**문제**: 목록 조회(Read) 시 데이터 흐름의 올바른 순서는?

```
A. Client Component → API Route → Service Layer → Prisma
B. Server Component → Service Layer → Prisma → Client Component
C. API Route → Server Component → Service Layer → Prisma
D. Client Component → Server Component → API Route → Prisma
```

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
Next.js App Router에서는 Server Component가 직접 Service Layer를 호출합니다.

**상세 흐름**:

**Read (목록 조회)**:
```typescript
// 1. Server Component (페이지)
// src/app/trm/target-products/page.tsx
export default async function ProductsPage() {
  // 2. Service Layer 직접 호출
  const products = await targetProductService.getAll();

  // 3. Client Component에 props 전달
  return <ProductList initialProducts={products} />;
}

// 4. Service Layer
// src/lib/services/targetProduct.service.ts
async getAll() {
  // 5. Prisma로 DB 조회
  return await prisma.targetProduct.findMany();
}
```

**시각적 흐름**:
```
┌────────────────────┐
│ Server Component   │ ← 진입점
│ (page.tsx)         │
└─────────┬──────────┘
          │ await service.getAll()
          ↓
┌────────────────────┐
│ Service Layer      │ ← 비즈니스 로직
│ (service.ts)       │
└─────────┬──────────┘
          │ prisma.findMany()
          ↓
┌────────────────────┐
│ Prisma             │ ← 데이터 접근
│ (DB)               │
└─────────┬──────────┘
          │ 데이터 반환
          ↓
┌────────────────────┐
│ Client Component   │ ← UI 렌더링
│ (List.tsx)         │
└────────────────────┘
```

**잘못된 패턴들**:

**❌ A) Client Component가 직접 API 호출**:
```typescript
// 불필요한 우회
'use client'
function ProductList() {
  useEffect(() => {
    // API Route를 거쳐서 Service Layer 호출
    fetch('/api/products')  // 불필요한 HTTP 요청
      .then(res => res.json())
      .then(setProducts);
  }, []);
}
```

**❌ C) API Route가 Server Component 호출**:
```typescript
// 불가능한 패턴
export async function GET() {
  // Server Component는 호출할 수 없음
  const page = await ProductsPage();  // ❌
}
```

**올바른 사용 사례별 패턴**:

**1. 초기 로딩** (Server Component):
```typescript
// ✅ 서버에서 바로 데이터 가져오기
async function Page() {
  const data = await service.getAll();
  return <List initialData={data} />;
}
```

**2. 클라이언트 상호작용** (API Route):
```typescript
// ✅ 사용자 액션 후 데이터 가져오기
'use client'
function List() {
  const handleRefresh = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };
}
```

**3. 뮤테이션** (API Route):
```typescript
// ✅ 데이터 수정은 API Route
const handleCreate = async (formData) => {
  await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
};
```

**프로젝트 참조**:
- 파일: `src/app/trm/target-products/page.tsx`
- 라인: 31-42
- Server Component가 Service Layer 직접 호출

</details>

---

### 퀴즈 18: Create 작업 흐름 (중급)

**문제**: 새 데이터 생성(Create) 시 올바른 흐름은?

<details>
<summary>정답 보기</summary>

**정답**:
```
Client Component (폼)
  → API Route (POST)
  → Service Layer
  → Prisma
  → 새 데이터 반환
  → Client Component 업데이트
```

**해설**:

**전체 흐름 코드**:

**1. Client Component (사용자 입력)**:
```typescript
// src/components/trm/target-products/CreateProductForm.tsx
'use client'

export function CreateProductForm() {
  const [formData, setFormData] = useState<CreateTargetProductDTO>({
    targetName: '',
    unitPrice: 0,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 2. API Route로 POST 요청
      const response = await fetch('/api/target-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('생성 실패');

      // 6. 새 데이터 받기
      const newProduct = await response.json();

      // 7. 목록 갱신 (revalidate 또는 상태 업데이트)
      router.refresh();  // 또는
      // onProductCreated(newProduct);

    } catch (error) {
      alert('제품 생성 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.targetName}
        onChange={e => setFormData({
          ...formData,
          targetName: e.target.value
        })}
      />
      <button type="submit">생성</button>
    </form>
  );
}
```

**2. API Route (HTTP 처리)**:
```typescript
// src/app/api/target-products/route.ts
import { targetProductService } from '@/lib/services/targetProduct.service';

export async function POST(request: Request) {
  try {
    // 3. 요청 본문 파싱
    const body = await request.json();

    // DTO 유효성 검증 (선택적)
    if (!body.targetName || body.unitPrice < 0) {
      return NextResponse.json(
        { error: 'Invalid data' },
        { status: 400 }
      );
    }

    // 4. Service Layer 호출
    const newProduct = await targetProductService.create(body);

    // 6. 새 데이터 반환
    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

**3. Service Layer (비즈니스 로직)**:
```typescript
// src/lib/services/targetProduct.service.ts
export const targetProductService = {
  async create(data: CreateTargetProductDTO): Promise<TargetProduct> {
    try {
      // 5. Prisma로 DB에 저장
      return await prisma.targetProduct.create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new Error(`Failed to create: ${error.message}`);
    }
  },
};
```

**4. Prisma (데이터베이스)**:
```typescript
// 실제 SQL 실행:
// INSERT INTO target_product (targetName, unitPrice, ...)
// VALUES ('...', 100, ...)
// RETURNING *
```

**데이터 갱신 전략**:

**A) Router Refresh** (추천):
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
await fetch('/api/products', { method: 'POST', ... });
router.refresh();  // Server Component 재실행
```

**B) 상태 업데이트**:
```typescript
const [products, setProducts] = useState(initialProducts);
const newProduct = await response.json();
setProducts(prev => [...prev, newProduct]);
```

**C) Revalidate Tag**:
```typescript
// API Route에서
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const newProduct = await service.create(data);
  revalidateTag('products');  // 캐시 무효화
  return NextResponse.json(newProduct);
}
```

**Create vs Read 흐름 비교**:

**Read** (Server Component):
```
Server Component → Service Layer → Prisma → Render
(서버에서 직접 조회)
```

**Create** (Client Component):
```
Client → API Route → Service Layer → Prisma → Response
(HTTP를 통한 통신)
```

**왜 다를까?**:
- Read: 페이지 로드 시 서버에서 실행
- Create: 사용자 액션 → 클라이언트에서 시작 → API 필요

</details>

---

### 퀴즈 19: Update 작업 흐름 (중급)

**문제**: 데이터 수정(Update) 시 낙관적 업데이트를 포함한 전체 흐름을 설명하세요.

<details>
<summary>정답 보기</summary>

**정답**:
```
1. 사용자 입력 (폼 수정)
2. 원본 데이터 백업
3. UI 낙관적 업데이트
4. API Route에 PATCH 요청
5. Service Layer에서 검증 및 업데이트
6. Prisma로 DB 업데이트
7. 성공: 서버 데이터로 최종 동기화
8. 실패: 원본으로 롤백 + 에러 표시
```

**해설**:

**전체 구현 코드**:

**1-3. Client Component (낙관적 업데이트)**:
```typescript
'use client'

export function ProductList({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleUpdate = async (
    id: string,
    updatedData: UpdateTargetProductDTO
  ) => {
    // 2. 원본 백업
    const originalProducts = [...products];
    const originalProduct = products.find(p => p.id === id);

    if (!originalProduct) return;

    // 3. 낙관적 UI 업데이트
    setProducts(prev => prev.map(p =>
      p.id === id
        ? { ...p, ...updatedData, updatedAt: new Date() }
        : p
    ));

    try {
      // 4. API Route에 PATCH 요청
      const response = await fetch(`/api/target-products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }

      // 7. 서버 데이터로 최종 동기화
      const serverProduct = await response.json();
      setProducts(prev => prev.map(p =>
        p.id === id ? serverProduct : p
      ));

      toast.success('수정되었습니다');
      setEditingId(null);

    } catch (error) {
      // 8. 실패: 롤백
      setProducts(originalProducts);
      toast.error(
        error instanceof Error
          ? error.message
          : '수정에 실패했습니다'
      );
    }
  };

  return (
    <div>
      {products.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          isEditing={editingId === product.id}
          onEdit={() => setEditingId(product.id)}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}
```

**4. API Route**:
```typescript
// src/app/api/target-products/[id]/route.ts
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // 5. Service Layer 호출
    const updated = await targetProductService.update(
      params.id,
      body
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
```

**5-6. Service Layer + Prisma**:
```typescript
// src/lib/services/targetProduct.service.ts
export const targetProductService = {
  async update(
    id: string,
    data: UpdateTargetProductDTO
  ): Promise<TargetProduct | null> {
    try {
      // 존재 확인
      const existing = await prisma.targetProduct.findUnique({
        where: { id }
      });

      if (!existing) {
        return null;
      }

      // 6. DB 업데이트
      return await prisma.targetProduct.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

    } catch (error) {
      throw new Error(`Failed to update: ${error.message}`);
    }
  },
};
```

**시각적 타임라인**:

```
Time │ UI State         │ Server State
─────┼──────────────────┼───────────────
  0  │ Original         │ Original
     │ [수정 버튼 클릭]   │
  1  │ Optimistic ✨    │ Original
     │ (즉시 변경)        │
  2  │ Optimistic ✨    │ Processing...
     │                  │ (API 요청 중)
  3  │ Optimistic ✨    │ Updated ✅
     │                  │ (DB 저장 완료)
  4  │ Server Data ✅   │ Updated ✅
     │ (최종 동기화)      │

만약 실패:
  4  │ Original 🔄      │ Original
     │ (롤백 + 에러)      │
```

**핵심 체크포인트**:

**1. 백업은 필수**:
```typescript
const backup = [...products];  // 항상 먼저!
```

**2. 서버 데이터로 동기화**:
```typescript
// 서버 응답을 최종 소스로
const serverData = await response.json();
setProducts(prev => prev.map(p =>
  p.id === id ? serverData : p  // 서버 데이터 사용
));
```

**3. 에러는 구체적으로**:
```typescript
catch (error) {
  if (response?.status === 404) {
    toast.error('제품을 찾을 수 없습니다');
  } else if (response?.status === 403) {
    toast.error('수정 권한이 없습니다');
  } else {
    toast.error('수정 실패');
  }
}
```

**프로젝트 참조**:
- 파일: `src/components/trm/target-products/TargetProductList.tsx`
- 낙관적 업데이트 패턴 예시

</details>

---

### 퀴즈 20: Delete 작업 흐름 (중급)

**문제**: 다음 삭제 코드의 문제점을 찾으세요.

```typescript
const handleDelete = async (id: string) => {
  if (confirm('삭제하시겠습니까?')) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.id !== id));
  }
};
```

<details>
<summary>정답 보기</summary>

**정답**: 에러 처리가 없고, 삭제 실패 시에도 UI에서 제거됩니다.

**문제점 상세**:

**1. 에러 처리 부재**:
```typescript
await fetch(...);  // 실패해도 다음 줄 실행
setProducts(...);  // 항상 실행됨
```

**2. 응답 확인 안 함**:
```typescript
const response = await fetch(...);
// response.ok 체크 없이 바로 UI 업데이트
```

**3. 낙관적 업데이트 없음**:
```typescript
// 서버 응답까지 기다려야 UI 변화 확인
// → 느린 UX
```

**올바른 구현 (낙관적 + 에러 처리)**:

```typescript
const handleDelete = async (id: string) => {
  // 1. 사용자 확인
  if (!confirm('정말 삭제하시겠습니까?')) {
    return;
  }

  // 2. 원본 백업
  const backup = [...products];

  // 3. 낙관적 UI 업데이트
  setProducts(prev => prev.filter(p => p.id !== id));

  try {
    // 4. API 요청
    const response = await fetch(`/api/target-products/${id}`, {
      method: 'DELETE',
    });

    // 5. 응답 확인
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '삭제 실패');
    }

    // 6. 성공 피드백
    toast.success('삭제되었습니다');

  } catch (error) {
    // 7. 실패: 롤백
    setProducts(backup);

    // 8. 에러 피드백
    toast.error(
      error instanceof Error
        ? error.message
        : '삭제에 실패했습니다'
    );

    console.error('Delete failed:', error);
  }
};
```

**더 나은 UX - 삭제 확인 모달**:

```typescript
const [deleteConfirm, setDeleteConfirm] = useState<{
  id: string;
  name: string;
} | null>(null);

const handleDeleteClick = (product: Product) => {
  setDeleteConfirm({
    id: product.id,
    name: product.targetName
  });
};

const handleDeleteConfirm = async () => {
  if (!deleteConfirm) return;

  const { id } = deleteConfirm;
  const backup = [...products];

  // 모달 닫기
  setDeleteConfirm(null);

  // 낙관적 업데이트
  setProducts(prev => prev.filter(p => p.id !== id));

  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Delete failed');

    toast.success('삭제되었습니다');

  } catch (error) {
    setProducts(backup);
    toast.error('삭제 실패');
  }
};

// JSX
return (
  <>
    <button onClick={() => handleDeleteClick(product)}>
      삭제
    </button>

    {deleteConfirm && (
      <Dialog>
        <h2>삭제 확인</h2>
        <p>
          "{deleteConfirm.name}"을(를) 삭제하시겠습니까?
        </p>
        <div>
          <button onClick={() => setDeleteConfirm(null)}>
            취소
          </button>
          <button onClick={handleDeleteConfirm}>
            삭제
          </button>
        </div>
      </Dialog>
    )}
  </>
);
```

**API Route (DELETE)**:

```typescript
// src/app/api/target-products/[id]/route.ts
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Service Layer 호출
    const deleted = await targetProductService.delete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete' },
      { status: 500 }
    );
  }
}
```

**Service Layer (DELETE)**:

```typescript
export const targetProductService = {
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.targetProduct.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma: Record not found
        return false;
      }
      throw new Error(`Failed to delete: ${error.message}`);
    }
  },
};
```

**삭제 전략 비교**:

**1. 낙관적 삭제** ✅:
```typescript
// UI 먼저 제거 → 빠른 UX
setProducts(prev => prev.filter(...));
await deleteAPI();
```

**2. 일반 삭제** ⚠️:
```typescript
// 서버 응답 대기 → 느린 UX
await deleteAPI();
setProducts(prev => prev.filter(...));
```

**3. Soft Delete** (선택적):
```typescript
// DB에서 삭제 안 하고 플래그만
await updateAPI(id, { isDeleted: true });
// 복구 가능, 감사 로그 유지
```

**프로젝트 참조**:
- 파일: `src/components/trm/target-products/TargetProductList.tsx`
- 라인: 29-43 (handleDelete)

</details>

---

### 퀴즈 21: 빈칸 채우기 - CRUD 메서드 (중급)

**문제**: API Route의 CRUD 메서드 빈칸을 채우세요.

```typescript
// GET /api/products
export async function ____(request: Request) {
  const products = await service.getAll();
  return NextResponse.json(products);
}

// POST /api/products
export async function ____(request: Request) {
  const body = await request.json();
  const created = await service.create(body);
  return NextResponse.json(created, { status: ___ });
}

// PATCH /api/products/[id]
export async function ____(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updated = await service.update(params.id, body);
  return NextResponse.json(updated);
}

// DELETE /api/products/[id]
export async function ____(
  request: Request,
  { params }: { params: { id: string } }
) {
  await service.delete(params.id);
  return NextResponse.json({ message: 'Deleted' });
}
```

<details>
<summary>정답 보기</summary>

**정답**:
```typescript
// GET
export async function GET(request: Request) {
  const products = await service.getAll();
  return NextResponse.json(products);
}

// POST
export async function POST(request: Request) {
  const body = await request.json();
  const created = await service.create(body);
  return NextResponse.json(created, { status: 201 });
}

// PATCH
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updated = await service.update(params.id, body);
  return NextResponse.json(updated);
}

// DELETE
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await service.delete(params.id);
  return NextResponse.json({ message: 'Deleted' });
}
```

**해설**:

**HTTP 메서드와 CRUD 매핑**:
| CRUD | HTTP 메서드 | 설명 |
|------|------------|------|
| Create | `POST` | 새 리소스 생성 |
| Read | `GET` | 리소스 조회 |
| Update | `PATCH` 또는 `PUT` | 리소스 수정 |
| Delete | `DELETE` | 리소스 삭제 |

**상태 코드**:
```typescript
// 성공
200 OK        - 일반적인 성공
201 Created   - 생성 성공
204 No Content - 삭제 성공 (본문 없음)

// 클라이언트 에러
400 Bad Request - 잘못된 요청
404 Not Found   - 리소스 없음

// 서버 에러
500 Internal Server Error - 서버 에러
```

**POST 응답은 201**:
```typescript
export async function POST(request: Request) {
  const created = await service.create(body);

  // 201 Created가 RESTful 규약
  return NextResponse.json(created, { status: 201 });
}
```

**PATCH vs PUT**:

**PATCH** (부분 업데이트) - 추천:
```typescript
// 일부 필드만 업데이트
PATCH /api/products/123
{
  "unitPrice": 200
}
// → targetName은 그대로, unitPrice만 변경
```

**PUT** (전체 대체):
```typescript
// 전체 리소스 교체
PUT /api/products/123
{
  "targetName": "New Name",
  "unitPrice": 200,
  "isActive": true
}
// → 모든 필드 제공 필요
```

**프로젝트 예시**:

```typescript
// src/app/api/target-products/route.ts
export async function GET(request: Request) {
  try {
    const products = await targetProductService.getAll();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await targetProductService.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create' },
      { status: 500 }
    );
  }
}
```

**RESTful URL 패턴**:
```
GET    /api/products      - 목록 조회
GET    /api/products/123  - 단일 조회
POST   /api/products      - 생성
PATCH  /api/products/123  - 수정
DELETE /api/products/123  - 삭제
```

</details>

---

### 퀴즈 22: Revalidation 전략 (중급)

**문제**: CRUD 작업 후 데이터를 최신 상태로 유지하는 방법은?

<details>
<summary>정답 보기</summary>

**답변**: `router.refresh()`, `revalidatePath()`, `revalidateTag()` 중 선택하여 사용합니다.

**해설**:

**1. router.refresh()** (Client에서):
```typescript
'use client'
import { useRouter } from 'next/navigation';

function ProductList() {
  const router = useRouter();

  const handleCreate = async (data) => {
    await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    // Server Component를 다시 실행하여 최신 데이터 가져오기
    router.refresh();
  };
}
```

**장점**:
- 간단한 사용법
- 현재 페이지의 Server Component 재실행

**단점**:
- 전체 페이지 새로고침
- 불필요한 데이터도 다시 조회

---

**2. revalidatePath()** (Server에서):
```typescript
// src/app/api/products/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const body = await request.json();
  const created = await service.create(body);

  // 특정 경로의 캐시 무효화
  revalidatePath('/trm/target-products');

  return NextResponse.json(created, { status: 201 });
}
```

**장점**:
- 서버에서 직접 캐시 제어
- 특정 경로만 타겟팅

**사용 예시**:
```typescript
// 단일 경로
revalidatePath('/products');

// 동적 경로 포함
revalidatePath('/products/[id]', 'page');

// 레이아웃 포함
revalidatePath('/products', 'layout');
```

---

**3. revalidateTag()** (Server에서):
```typescript
// Service Layer에서 태그 설정
export const service = {
  async getAll() {
    return await prisma.product.findMany({
      // 캐시 태그 설정
      cache: 'force-cache',
      next: { tags: ['products'] }
    });
  }
};

// API Route에서 태그 무효화
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const created = await service.create(body);

  // 'products' 태그가 붙은 모든 캐시 무효화
  revalidateTag('products');

  return NextResponse.json(created, { status: 201 });
}
```

**장점**:
- 여러 경로에 걸친 캐시 무효화
- 세밀한 캐시 제어

---

**4. 상태 업데이트** (Client에서):
```typescript
'use client'

function ProductList({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);

  const handleCreate = async (data) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const newProduct = await res.json();

    // 상태에 직접 추가
    setProducts(prev => [...prev, newProduct]);
  };
}
```

**장점**:
- 서버 요청 없음
- 즉각적인 업데이트

**단점**:
- 다른 사용자 변경사항 반영 안 됨
- 새로고침 시 서버 데이터와 동기화

---

**전략 선택 가이드**:

| 상황 | 추천 방법 | 이유 |
|------|-----------|------|
| 간단한 CRUD | `router.refresh()` | 사용 쉬움 |
| 특정 페이지 업데이트 | `revalidatePath()` | 타겟팅 |
| 여러 페이지 업데이트 | `revalidateTag()` | 유연성 |
| 단일 사용자 앱 | 상태 업데이트 | 빠름 |
| 실시간 협업 | WebSocket + revalidate | 동기화 |

**프로젝트 적용 예시**:

```typescript
// src/components/trm/target-products/ProductActions.tsx
'use client'

export function ProductActions() {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await fetch(`/api/target-products/${id}`, {
      method: 'DELETE'
    });

    // 페이지 새로고침하여 최신 목록 가져오기
    router.refresh();
  };

  const handleCreate = async (data: CreateDTO) => {
    await fetch('/api/target-products', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    router.refresh();
  };
}
```

**고급 패턴 - 낙관적 + Revalidate**:
```typescript
const handleUpdate = async (id: string, data: UpdateDTO) => {
  // 1. 낙관적 업데이트 (즉시 UI 변경)
  setProducts(prev => prev.map(p =>
    p.id === id ? { ...p, ...data } : p
  ));

  try {
    // 2. 서버 업데이트
    await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });

    // 3. 최종 동기화 (서버 데이터로 확정)
    router.refresh();

  } catch (error) {
    // 실패 시 롤백
    setProducts(backup);
  }
};
```

</details>

---

### 퀴즈 23: 검색과 필터링 (중급)

**문제**: 검색 파라미터를 처리하는 올바른 방법은?

<details>
<summary>정답 보기</summary>

**답변**: URL Search Params를 사용하여 서버 컴포넌트에서 처리합니다.

**해설**:

**Server Component에서 검색 처리**:

```typescript
// src/app/trm/target-products/page.tsx
interface PageProps {
  searchParams: {
    search?: string;
    isActive?: string;
    sort?: string;
  };
}

export default async function ProductsPage({
  searchParams
}: PageProps) {
  // URL 파라미터를 Service Layer에 전달
  const products = await targetProductService.getAll({
    search: searchParams.search,
    isActive: searchParams.isActive === 'true',
    sortBy: searchParams.sort,
  });

  return (
    <div>
      <SearchForm />
      <ProductList products={products} />
    </div>
  );
}
```

**Client Component 검색 폼**:

```typescript
// src/components/trm/target-products/SearchForm.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation';

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get('search') || ''
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // URL 파라미터 업데이트
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    // 페이지 이동 (Server Component 재실행)
    router.push(`/trm/target-products?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="제품명 검색..."
      />
      <button type="submit">검색</button>
    </form>
  );
}
```

**Service Layer에서 검색 로직**:

```typescript
// src/lib/services/targetProduct.service.ts
export interface SearchParams {
  search?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'price' | 'date';
}

export const targetProductService = {
  async getAll(params?: SearchParams): Promise<TargetProduct[]> {
    // WHERE 조건 구성
    const where: Prisma.TargetProductWhereInput = {};

    // 검색어 처리
    if (params?.search) {
      where.targetName = {
        contains: params.search,
        mode: 'insensitive',  // 대소문자 구분 안 함
      };
    }

    // 활성 상태 필터
    if (params?.isActive !== undefined) {
      where.isActive = params.isActive;
    }

    // 정렬 조건 구성
    const orderBy: Prisma.TargetProductOrderByWithRelationInput = {};

    switch (params?.sortBy) {
      case 'name':
        orderBy.targetName = 'asc';
        break;
      case 'price':
        orderBy.unitPrice = 'desc';
        break;
      case 'date':
      default:
        orderBy.createdAt = 'desc';
        break;
    }

    // Prisma 쿼리 실행
    return await prisma.targetProduct.findMany({
      where,
      orderBy,
    });
  },
};
```

**필터 UI 추가**:

```typescript
'use client'

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/trm/target-products?${params.toString()}`);
  };

  return (
    <div className="flex gap-4">
      {/* 검색 */}
      <input
        placeholder="검색..."
        defaultValue={searchParams.get('search') || ''}
        onChange={e => updateFilter('search', e.target.value)}
      />

      {/* 활성 상태 필터 */}
      <select
        value={searchParams.get('isActive') || 'all'}
        onChange={e => updateFilter('isActive', e.target.value)}
      >
        <option value="all">전체</option>
        <option value="true">활성</option>
        <option value="false">비활성</option>
      </select>

      {/* 정렬 */}
      <select
        value={searchParams.get('sort') || 'date'}
        onChange={e => updateFilter('sort', e.target.value)}
      >
        <option value="date">최신순</option>
        <option value="name">이름순</option>
        <option value="price">가격순</option>
      </select>
    </div>
  );
}
```

**URL 형태**:
```
/trm/target-products?search=laptop&isActive=true&sort=price
```

**장점**:
- ✅ URL 공유 가능
- ✅ 뒤로가기 지원
- ✅ SEO 친화적
- ✅ 북마크 가능

**주의사항**:
```typescript
// ❌ 잘못된 방법: Client에서 직접 필터링
'use client'
function ProductList({ products }) {
  const [filtered, setFiltered] = useState(products);

  const handleSearch = (search) => {
    // 클라이언트에서 필터링 → 비효율적
    setFiltered(products.filter(p =>
      p.name.includes(search)
    ));
  };
}

// ✅ 올바른 방법: Server에서 필터링
async function Page({ searchParams }) {
  // 서버에서 필요한 데이터만 조회
  const products = await service.getAll(searchParams);
  return <ProductList products={products} />;
}
```

</details>

---

### 퀴즈 24: 실습 - 전체 CRUD 흐름 추적 (중급)

**문제**: 사용자가 "제품명 수정" 버튼을 클릭한 순간부터 DB에 저장되기까지의 전체 흐름을 순서대로 나열하세요.

<details>
<summary>정답 보기</summary>

**정답**:

```
1. 사용자: 수정 버튼 클릭
2. Client Component: onClick 핸들러 실행
3. Client Component: 원본 데이터 백업
4. Client Component: UI 낙관적 업데이트 (setState)
5. Client Component: fetch로 PATCH 요청
6. 브라우저: HTTP PATCH 요청 전송
7. Next.js Server: API Route 매칭 ([id]/route.ts)
8. API Route: request.json()로 본문 파싱
9. API Route: Service Layer의 update() 호출
10. Service Layer: 데이터 검증
11. Service Layer: Prisma update() 호출
12. Prisma: SQL UPDATE 쿼리 생성
13. Database: 쿼리 실행 및 데이터 저장
14. Database: 업데이트된 행 반환
15. Prisma: 결과를 TypeScript 객체로 변환
16. Service Layer: Prisma 결과 반환
17. API Route: NextResponse.json()으로 응답
18. Next.js Server: HTTP 200 응답 전송
19. 브라우저: 응답 수신
20. Client Component: response.json()으로 파싱
21. Client Component: 서버 데이터로 최종 동기화
22. React: 리렌더링
23. 사용자: 업데이트된 UI 확인
```

**해설**:

**시각적 흐름도**:

```
[사용자] 클릭
    ↓
[React] onClick
    ↓
[State] 백업 + 낙관적 업데이트
    ↓
[Fetch API] PATCH 요청
    ↓
┌─────────────────────────┐
│   Next.js Server        │
│                         │
│  [API Route]            │
│    ↓                    │
│  [Service Layer]        │
│    ↓                    │
│  [Prisma]               │
│    ↓                    │
│  [Database] ← 저장      │
│    ↓                    │
│  [Response] ← 반환      │
└────────┬────────────────┘
         ↓
[Fetch API] 응답 수신
    ↓
[State] 최종 동기화
    ↓
[React] 리렌더링
    ↓
[사용자] 확인
```

**코드로 보는 전체 흐름**:

```typescript
// ═══════════════════════════════════════
// 1-5. Client Component
// ═══════════════════════════════════════
'use client'

export function ProductItem({ product }: Props) {
  const [products, setProducts] = useState([product]);

  // 1. 사용자 클릭
  const handleUpdate = async (newName: string) => {
    // 2. onClick 핸들러 실행

    // 3. 원본 백업
    const backup = [...products];

    // 4. 낙관적 업데이트
    setProducts(prev => prev.map(p =>
      p.id === product.id
        ? { ...p, targetName: newName }
        : p
    ));

    try {
      // 5-6. HTTP 요청
      const response = await fetch(
        `/api/target-products/${product.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetName: newName }),
        }
      );

      // 19-20. 응답 수신 및 파싱
      const updated = await response.json();

      // 21. 최종 동기화
      setProducts(prev => prev.map(p =>
        p.id === product.id ? updated : p
      ));

    } catch (error) {
      // 실패 시 롤백
      setProducts(backup);
    }
  };

  return (
    <button onClick={() => handleUpdate('New Name')}>
      수정
    </button>
  );
}

// ═══════════════════════════════════════
// 7-9. API Route
// ═══════════════════════════════════════
// src/app/api/target-products/[id]/route.ts

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 7. API Route 매칭

  // 8. 본문 파싱
  const body = await request.json();

  try {
    // 9. Service Layer 호출
    const updated = await targetProductService.update(
      params.id,
      body
    );

    // 17. JSON 응답 생성
    return NextResponse.json(updated);

  } catch (error) {
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════
// 10-16. Service Layer
// ═══════════════════════════════════════
// src/lib/services/targetProduct.service.ts

export const targetProductService = {
  async update(
    id: string,
    data: UpdateTargetProductDTO
  ): Promise<TargetProduct> {
    // 10. 데이터 검증
    if (!data.targetName || data.targetName.trim() === '') {
      throw new Error('Name is required');
    }

    try {
      // 11. Prisma 호출
      const updated = await prisma.targetProduct.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      // 16. 결과 반환
      return updated;

    } catch (error) {
      throw new Error(`Failed to update: ${error.message}`);
    }
  },
};

// ═══════════════════════════════════════
// 12-15. Prisma & Database
// ═══════════════════════════════════════

// 12. Prisma가 SQL 생성
// UPDATE "TargetProduct"
// SET "targetName" = 'New Name',
//     "updatedAt" = NOW()
// WHERE "id" = '...'
// RETURNING *;

// 13. Database 실행
// 14. 업데이트된 행 반환
// 15. Prisma가 TypeScript 객체로 변환

// ═══════════════════════════════════════
// 22-23. React 리렌더링
// ═══════════════════════════════════════

// React가 setState 감지
// → 컴포넌트 리렌더링
// → 사용자가 새 UI 확인
```

**각 단계의 소요 시간 (대략)**:

```
1-4.  Client 처리        : 1-5ms
5-6.  네트워크 전송       : 10-100ms
7-9.  API Route         : 1-5ms
10-16. Service + DB     : 10-50ms
17-18. 응답 전송         : 10-100ms
19-21. Client 처리       : 1-5ms
22-23. 리렌더링          : 1-10ms

총계: 약 44-285ms
```

**낙관적 업데이트의 효과**:
```
낙관적 없이:
사용자 클릭 → [대기 100-300ms] → UI 변화

낙관적 사용:
사용자 클릭 → [즉시] UI 변화 → [백그라운드로 저장]
```

**핵심 포인트**:
- UI는 즉시 반응 (1-5ms)
- 서버 저장은 백그라운드 (100-300ms)
- 실패 시 롤백으로 일관성 유지

</details>

---

## 4. 커스텀 훅 심화 (7개)

### 퀴즈 25: 커스텀 훅의 역할 (중급)

**문제**: 커스텀 훅을 만드는 주된 이유는?

A) 코드를 더 복잡하게 만들기 위해
B) 반복되는 로직을 재사용하기 위해
C) React의 기본 훅을 대체하기 위해
D) 성능을 향상시키기 위해

<details>
<summary>정답 보기</summary>

**정답: B**

**해설**:
커스텀 훅은 여러 컴포넌트에서 반복되는 로직을 하나의 함수로 추출하여 재사용합니다.

**Before (반복 코드)**:

```typescript
// ProductList.tsx
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{products.map(...)}</div>;
}

// CustomerList.tsx
function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/customers');
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{customers.map(...)}</div>;
}

// ... 같은 패턴이 10개 컴포넌트에 반복됨
```

**After (커스텀 훅)**:

```typescript
// hooks/useFetch.ts
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(url);
        if (!response.ok) throw new Error('Fetch failed');

        const json = await res.json();
        setData(json);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// 사용
function ProductList() {
  const { data: products, loading, error } = useFetch<Product[]>('/api/products');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{products?.map(...)}</div>;
}

function CustomerList() {
  const { data: customers, loading, error } = useFetch<Customer[]>('/api/customers');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{customers?.map(...)}</div>;
}
```

**커스텀 훅의 장점**:

**1. 재사용성** ✅:
```typescript
// 같은 로직을 여러 곳에서 사용
const { data } = useFetch('/api/products');
const { data } = useFetch('/api/customers');
const { data } = useFetch('/api/orders');
```

**2. 관심사 분리** ✅:
```typescript
// 컴포넌트: UI에만 집중
function ProductList() {
  const { data, loading } = useFetch('/api/products');
  return <div>...</div>;  // 렌더링만
}

// 훅: 데이터 로직 담당
function useFetch() {
  // 데이터 fetching 로직
}
```

**3. 테스트 용이** ✅:
```typescript
// 훅만 따로 테스트 가능
test('useFetch', async () => {
  const { result } = renderHook(() => useFetch('/api/test'));
  expect(result.current.loading).toBe(true);
  // ...
});
```

**4. 유지보수** ✅:
```typescript
// 로직 변경 시 한 곳만 수정
// useFetch.ts만 수정하면 모든 곳에 적용
```

**커스텀 훅 명명 규칙**:
```typescript
// ✅ use로 시작해야 함
useFetch()
useTargetProducts()
useAuth()

// ❌ use로 시작하지 않으면 훅이 아님
fetchData()  // 일반 함수
getProducts()  // 일반 함수
```

**프로젝트 예시**:

```typescript
// src/hooks/useTargetProducts.ts
export function useTargetProducts() {
  const [products, setProducts] = useState<TargetProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/target-products');
      const data = await res.json();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/api/target-products/${id}`, { method: 'DELETE' });
    } catch (error) {
      fetchProducts();  // 실패 시 다시 조회
    }
  };

  return {
    products,
    loading,
    deleteProduct,
    refetch: fetchProducts,
  };
}

// 사용
function ProductList() {
  const { products, loading, deleteProduct } = useTargetProducts();

  if (loading) return <Spinner />;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          {product.targetName}
          <button onClick={() => deleteProduct(product.id)}>
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
```

</details>

---

### 퀴즈 26: useForm 훅 구현 (중급)

**문제**: 폼 상태를 관리하는 커스텀 훅을 만드세요.

<details>
<summary>정답 보기</summary>

```typescript
function useForm<T>(initialValues: T) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, handleChange, setErrors, reset };
}

// 사용
const { values, handleChange } = useForm({
  name: '',
  email: '',
});
```

</details>

---

## 5. 폼 처리와 유효성 검증 (6개)

### 퀴즈 27: 폼 제출 처리 (중급)

**문제**: 폼 제출 시 검증 후 API 호출하세요.

<details>
<summary>정답 보기</summary>

```typescript
'use client'

export function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름은 필수입니다';
    }

    if (formData.price <= 0) {
      newErrors.price = '가격은 0보다 커야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      alert('생성 완료');
    } catch (error) {
      alert('생성 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
      />
      {errors.name && <span>{errors.name}</span>}

      <button type="submit">제출</button>
    </form>
  );
}
```

</details>

---

### 퀴즈 28: Server Actions (중급)

**문제**: Server Action으로 폼을 제출하세요.

<details>
<summary>정답 보기</summary>

```typescript
// actions/product.ts
'use server'

import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));

  await prisma.product.create({
    data: { name, price }
  });

  revalidatePath('/products');
}

// ProductForm.tsx
export function ProductForm() {
  return (
    <form action={createProduct}>
      <input name="name" required />
      <input name="price" type="number" required />
      <button type="submit">생성</button>
    </form>
  );
}
```

</details>

---

## 6. 에러 처리 전략 (6개)

### 퀴즈 29: Error Boundary (중급)

**문제**: Error Boundary를 구현하세요.

<details>
<summary>정답 보기</summary>

```typescript
// error.tsx (App Router)
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>문제가 발생했습니다</h2>
      <p>{error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

</details>

---

### 퀴즈 30: try-catch 패턴 (중급)

**문제**: 여러 비동기 작업의 에러를 처리하세요.

<details>
<summary>정답 보기</summary>

```typescript
async function loadData() {
  try {
    const [products, customers] = await Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/customers').then(r => r.json()),
    ]);

    return { products, customers };

  } catch (error) {
    console.error('Failed to load data:', error);
    throw error;
  }
}
```

</details>

---

## 7. 타입 안정성 강화 (4개)

### 퀴즈 31: Generic 타입 활용 (중급)

**문제**: 재사용 가능한 API 호출 함수를 만드세요.

<details>
<summary>정답 보기</summary>

```typescript
async function apiCall<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return await response.json();
}

// 사용
const products = await apiCall<Product[]>('/api/products');
const user = await apiCall<User>('/api/user/123');
```

</details>

---

### 퀴즈 32: Partial과 Required (중급)

**문제**: 타입 유틸리티를 활용하세요.

<details>
<summary>정답 보기</summary>

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

// 일부 필드만 업데이트
type UpdateProductDTO = Partial<Omit<Product, 'id'>>;

// 필수 필드 강제
type CreateProductDTO = Required<Omit<Product, 'id'>>;

// 사용
const update: UpdateProductDTO = {
  price: 100 // name 없어도 OK
};

const create: CreateProductDTO = {
  name: 'Product',
  price: 100,
  description: 'Desc' // 필수
};
```

</details>

---

## 8. Revalidation 전략 (3개)

### 퀴즈 33: revalidatePath vs revalidateTag (중급)

**문제**: 두 방법의 차이점은?

<details>
<summary>정답 보기</summary>

**revalidatePath**: 특정 경로만 갱신
```typescript
import { revalidatePath } from 'next/cache';

export async function POST() {
  await service.create(data);
  revalidatePath('/products'); // /products만
  return NextResponse.json({ success: true });
}
```

**revalidateTag**: 태그로 여러 경로 갱신
```typescript
import { revalidateTag } from 'next/cache';

// 데이터 조회 시 태그 설정
async function getProducts() {
  return fetch('...', {
    next: { tags: ['products'] }
  });
}

// 갱신
export async function POST() {
  await service.create(data);
  revalidateTag('products'); // 'products' 태그 전체
  return NextResponse.json({ success: true });
}
```

</details>

---

### 퀴즈 34: router.refresh() (중급)

**문제**: router.refresh()는 언제 사용하나요?

<details>
<summary>정답 보기</summary>

**사용 시점**: Client에서 Server Component 데이터 갱신

```typescript
'use client'
import { useRouter } from 'next/navigation';

export function ProductActions() {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });

    // Server Component 다시 실행
    router.refresh();
  };

  return <button onClick={() => handleDelete('1')}>삭제</button>;
}
```

**효과**:
- 현재 페이지의 Server Component 재실행
- 최신 데이터 가져옴
- 클라이언트 상태는 유지

</details>

---

### 퀴즈 35: 실습 - 데이터 갱신 전략 (중급)

**문제**: 제품 생성 후 목록을 갱신하는 3가지 방법을 구현하세요.

<details>
<summary>정답 보기</summary>

**방법 1: router.refresh()**
```typescript
'use client'
import { useRouter } from 'next/navigation';

export function CreateForm() {
  const router = useRouter();

  const handleSubmit = async (data) => {
    await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    router.refresh(); // Server Component 재실행
  };
}
```

**방법 2: 상태 업데이트**
```typescript
'use client'

export function ProductList({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);

  const handleCreate = async (data) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const newProduct = await res.json();
    setProducts(prev => [...prev, newProduct]); // 상태에 추가
  };
}
```

**방법 3: revalidatePath (Server에서)**
```typescript
// API Route
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const body = await request.json();
  const product = await service.create(body);

  revalidatePath('/products'); // 캐시 무효화

  return NextResponse.json(product);
}
```

</details>

---

## 🎉 중급 퀴즈 완료!

**총 35개 문제** 작성 완료:
- ✅ Service Layer 패턴 (8개)
- ✅ 낙관적 업데이트 (8개)
- ✅ CRUD 전체 흐름 (8개)
- ✅ 커스텀 훅 심화 (2개)
- ✅ 폼 처리 (2개)
- ✅ 에러 처리 (2개)
- ✅ 타입 안정성 (2개)
- ✅ Revalidation (3개)
