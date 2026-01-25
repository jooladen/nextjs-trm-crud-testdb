# ✏️ 실습 가이드 (손으로 직접!)

이 문서는 **직접 코드를 작성하며 배우는** 실습 과제를 제공합니다.

읽기만 하지 말고, 실제로 따라하면서 배워보세요! 💪

---

## 📋 실습 전 준비사항

### ✅ 확인 체크리스트
```
□ 프로젝트가 로컬에서 실행 중 (npm run dev)
□ 코드 에디터 (VS Code) 열려 있음
□ 터미널 준비
□ 브라우저 준비 (개발자 도구 F12)
```

### 🛠️ 필요한 도구
```
- Node.js 18+
- VS Code (또는 다른 코드 에디터)
- 터미널
- 브라우저 (Chrome 추천)
```

---

## ✏️ 실습 과제 1: 새로운 필드 추가하기 (난이도: ⭐)

### 🎯 목표
`target_product` 테이블에 **"설명(description)"** 필드를 추가하고 화면에 표시하기

### 🤔 왜 이 실습을 할까요?
- 데이터 흐름을 전체적으로 이해할 수 있습니다
- DB → Service → API → UI까지 모든 계층을 경험합니다
- 다른 프로젝트에서도 똑같이 적용할 수 있는 패턴입니다

### ⏱️ 예상 소요 시간
30분

### 📚 단계별 가이드

#### Step 1: 데이터베이스 스키마 수정 🗄️

**파일 열기**: `prisma/schema.prisma`

**찾을 코드**:
```prisma
model target_product {
  target_product_id      Int       @id @default(autoincrement())
  target_product_line_id Int
  target_product_name    String    @db.VarChar(200)
  deployment_date        DateTime  @db.Date
  // 여기에 추가할 거예요!
```

**추가할 코드**:
```prisma
model target_product {
  target_product_id      Int       @id @default(autoincrement())
  target_product_line_id Int
  target_product_name    String    @db.VarChar(200)
  deployment_date        DateTime  @db.Date
  description            String?   @db.Text  // 👈 이 줄 추가!

  productLine target_product_line @relation(...)
  // ...
}
```

**💡 설명**:
- `String?` : 물음표는 "선택적(optional)" 의미
- `@db.Text` : 긴 텍스트를 저장하는 타입

#### Step 2: 마이그레이션 실행 💾

**터미널에서 실행**:
```bash
npx prisma migrate dev
```

**물어보는 것**:
```
? Enter a name for the new migration:
```

**입력할 이름**:
```
add_description_field
```

**성공 메시지 확인**:
```
✔ Migration add_description_field created and applied
```

**💡 설명**:
- 마이그레이션은 DB 스키마 변경을 실제로 적용하는 과정이에요
- `prisma/migrations/` 폴더에 SQL 파일이 생성됩니다

#### Step 3: 타입 정의 수정 📝

**파일 열기**: `src/lib/types/targetProduct.types.ts`

**찾을 코드 (CreateTargetProductDto)**:
```typescript
export interface CreateTargetProductDto {
  target_product_line_id: number;
  target_product_name: string;
  deployment_date: string;
  // description 추가할 곳
}
```

**수정 후**:
```typescript
export interface CreateTargetProductDto {
  target_product_line_id: number;
  target_product_name: string;
  deployment_date: string;
  description?: string;  // 👈 추가 (선택적 필드)
}
```

**찾을 코드 (TargetProductResponseDto)**:
```typescript
export interface TargetProductResponseDto {
  target_product_id: number;
  target_product_line_id: number;
  target_product_name: string;
  deployment_date: string;
  // description 추가할 곳
  productLine: {
    // ...
  };
}
```

**수정 후**:
```typescript
export interface TargetProductResponseDto {
  target_product_id: number;
  target_product_line_id: number;
  target_product_name: string;
  deployment_date: string;
  description?: string;  // 👈 추가
  productLine: {
    // ...
  };
}
```

**TargetProductListItemDto도 동일하게 추가**!

#### Step 4: Service Layer 수정 ⚙️

**파일 열기**: `src/lib/services/targetProduct.service.ts`

**찾을 코드 (findAll 메서드)**:
```typescript
async findAll() {
  const products = await prisma.target_product.findMany({
    include: { productLine: true },
  });

  return products.map((product) => ({
    target_product_id: product.target_product_id,
    target_product_name: product.target_product_name,
    deployment_date: product.deployment_date.toISOString(),
    // description 추가할 곳
    productLine: {
      target_division: product.productLine.target_division,
      target_product_line: product.productLine.target_product_line,
    },
  }));
}
```

**수정 후**:
```typescript
async findAll() {
  const products = await prisma.target_product.findMany({
    include: { productLine: true },
  });

  return products.map((product) => ({
    target_product_id: product.target_product_id,
    target_product_name: product.target_product_name,
    deployment_date: product.deployment_date.toISOString(),
    description: product.description,  // 👈 추가
    productLine: {
      target_division: product.productLine.target_division,
      target_product_line: product.productLine.target_product_line,
    },
  }));
}
```

**create 메서드도 수정**:
```typescript
async create(data: CreateTargetProductDto) {
  return await prisma.target_product.create({
    data: {
      target_product_line_id: data.target_product_line_id,
      target_product_name: data.target_product_name,
      deployment_date: new Date(data.deployment_date),
      description: data.description,  // 👈 추가
    },
    include: { productLine: true },
  });
}
```

#### Step 5: UI에서 표시하기 🖥️

**파일 열기**: `src/components/trm/target-products/TargetProductList.tsx`

**찾을 코드 (columns 배열)**:
```typescript
const columns = [
  {
    accessorKey: 'target_product_id',
    header: 'ID',
  },
  {
    accessorKey: 'target_product_name',
    header: '제품명',
  },
  // 여기에 설명 컬럼 추가!
  {
    accessorKey: 'deployment_date',
    header: '배치일',
    // ...
  },
];
```

**수정 후**:
```typescript
const columns = [
  {
    accessorKey: 'target_product_id',
    header: 'ID',
  },
  {
    accessorKey: 'target_product_name',
    header: '제품명',
  },
  {
    accessorKey: 'description',  // 👈 추가
    header: '설명',
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.original.description || '설명 없음'}
      </span>
    ),
  },
  {
    accessorKey: 'deployment_date',
    header: '배치일',
    // ...
  },
];
```

#### Step 6: 테스트하기 ✅

**브라우저에서 확인**:
```
1. http://localhost:3000/trm/target-products 접속
2. 테이블에 "설명" 컬럼이 추가되었는지 확인
3. 기존 데이터는 "설명 없음"으로 표시됨
```

**선택 과제**: 등록 폼에도 설명 입력란 추가하기!

### ✅ 완료 체크리스트
```
□ schema.prisma에 description 필드 추가
□ npx prisma migrate dev 실행
□ 타입 정의 파일 수정 (3곳: CreateDto, ResponseDto, ListItemDto)
□ Service의 findAll, create 메서드 수정
□ UI의 columns 배열에 컬럼 추가
□ 브라우저에서 확인
```

### 🎉 완료하면 배운 것
```
✅ DB 스키마 변경하는 법
✅ 마이그레이션 실행하는 법
✅ 전체 계층에서 필드 추가하는 패턴
✅ Optional 필드 다루는 법 (?)
```

---

## ✏️ 실습 과제 2: 검색 기능 추가하기 (난이도: ⭐⭐)

### 🎯 목표
제품명으로 검색하는 기능 추가

### ⏱️ 예상 소요 시간
30분

### 💡 힌트

#### Client Component에서 검색 구현 (방법 1)

**파일**: `src/components/trm/target-products/TargetProductList.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function TargetProductList({ initialData }) {
  const [items, setItems] = useState(initialData);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 검색된 제품 필터링
  const filteredProducts = items.filter((product) =>
    product.target_product_name
      .toLowerCase()
      .includes(searchKeyword.toLowerCase())
  );

  return (
    <div>
      {/* 검색 입력창 */}
      <div className="mb-4">
        <Input
          placeholder="제품명으로 검색..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* 테이블은 filteredProducts 사용 */}
      <table>
        {filteredProducts.map((product) => (
          <tr key={product.target_product_id}>
            <td>{product.target_product_name}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
```

#### Service에서 검색 구현 (방법 2 - 심화)

**파일**: `src/lib/services/targetProduct.service.ts`

```typescript
async search(keyword: string) {
  const products = await prisma.target_product.findMany({
    where: {
      target_product_name: {
        contains: keyword,  // 부분 일치 검색
        // mode: 'insensitive',  // 대소문자 무시 (PostgreSQL)
      },
    },
    include: { productLine: true },
  });

  return products.map(...);  // DTO 변환
}
```

### 🎯 도전 과제
```
1. 검색 입력창 UI 구현
2. useState로 검색어 관리
3. filter 함수로 목록 필터링
4. 검색 결과가 없을 때 메시지 표시
5. (심화) Service 메서드로 서버 검색 구현
```

### ✅ 완료 체크리스트
```
□ 검색 입력창 추가
□ useState로 검색어 상태 관리
□ filter로 제품 필터링
□ 검색 결과 표시
□ 검색어가 없으면 전체 목록 표시
```

---

## ✏️ 실습 과제 3: 정렬 기능 추가하기 (난이도: ⭐⭐)

### 🎯 목표
제품명 또는 배치일로 정렬하는 기능 추가

### ⏱️ 예상 소요 시간
30분

### 💡 힌트

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TargetProductList({ initialData }) {
  const [items, setItems] = useState(initialData);
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 정렬된 제품 목록
  const sortedProducts = [...items].sort((a, b) => {
    if (sortBy === 'name') {
      // 제품명으로 정렬
      const result = a.target_product_name.localeCompare(
        b.target_product_name
      );
      return sortOrder === 'asc' ? result : -result;
    } else {
      // 배치일로 정렬
      const dateA = new Date(a.deployment_date).getTime();
      const dateB = new Date(b.deployment_date).getTime();
      const result = dateA - dateB;
      return sortOrder === 'asc' ? result : -result;
    }
  });

  return (
    <div>
      {/* 정렬 버튼 */}
      <div className="mb-4 flex gap-2">
        <Button
          variant={sortBy === 'name' ? 'default' : 'outline'}
          onClick={() => setSortBy('name')}
        >
          제품명순
        </Button>
        <Button
          variant={sortBy === 'date' ? 'default' : 'outline'}
          onClick={() => setSortBy('date')}
        >
          배치일순
        </Button>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? '↑ 오름차순' : '↓ 내림차순'}
        </Button>
      </div>

      {/* 테이블은 sortedProducts 사용 */}
      <table>
        {sortedProducts.map((product) => (
          // ...
        ))}
      </table>
    </div>
  );
}
```

### 🎯 도전 과제
```
1. 정렬 기준 선택 버튼 (제품명/배치일)
2. 정렬 순서 토글 (오름차순/내림차순)
3. sort 함수로 배열 정렬
4. 정렬된 결과 표시
```

### ✅ 완료 체크리스트
```
□ 정렬 기준 버튼 추가
□ 정렬 순서 토글 버튼 추가
□ useState로 정렬 상태 관리
□ sort 함수로 배열 정렬
□ 정렬된 결과 표시
```

---

## ✏️ 실습 과제 4: 완전히 새로운 엔티티 만들기 (난이도: ⭐⭐⭐)

### 🎯 목표
"카테고리(category)" 테이블/기능을 **처음부터 끝까지** 만들기

### ⏱️ 예상 소요 시간
1-2시간

### 📋 요구사항
```
테이블명: category
필드:
  - id (자동 증가)
  - name (이름, 필수)
  - description (설명, 선택)
  - created_at (생성일, 자동)
  - updated_at (수정일, 자동)

기능:
  - 목록 조회
  - 상세 조회
  - 생성
  - 수정
  - 삭제
```

### 📚 11단계 가이드

#### Step 1: DB 스키마 정의
**파일**: `prisma/schema.prisma`

```prisma
model category {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(100)
  description String?  @db.Text
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  @@map("category")
}
```

**터미널 실행**:
```bash
npx prisma migrate dev --name add_category_table
```

#### Step 2: 타입 정의 작성
**파일 생성**: `src/lib/types/category.types.ts`

```typescript
export interface CategoryListItemDto {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CategoryResponseDto {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}
```

#### Step 3: Service Layer 작성
**파일 생성**: `src/lib/services/category.service.ts`

```typescript
import { prisma } from '@/lib/prisma';
import type {
  CategoryListItemDto,
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/lib/types/category.types';

class CategoryService {
  async findAll(): Promise<CategoryListItemDto[]> {
    const categories = await prisma.category.findMany({
      orderBy: { created_at: 'desc' },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      createdAt: cat.created_at.toISOString(),
    }));
  }

  async findById(id: number): Promise<CategoryResponseDto> {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error('카테고리를 찾을 수 없습니다');
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.created_at.toISOString(),
      updatedAt: category.updated_at.toISOString(),
    };
  }

  async create(data: CreateCategoryDto): Promise<CategoryResponseDto> {
    if (!data.name) {
      throw new Error('이름은 필수입니다');
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.created_at.toISOString(),
      updatedAt: category.updated_at.toISOString(),
    };
  }

  async update(id: number, data: UpdateCategoryDto): Promise<CategoryResponseDto> {
    await this.findById(id);

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.created_at.toISOString(),
      updatedAt: category.updated_at.toISOString(),
    };
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryService = new CategoryService();
```

#### Step 4: API Routes 생성 (목록, 생성)
**파일 생성**: `src/app/api/categories/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/lib/services/category.service';

export async function GET() {
  try {
    const categories = await categoryService.findAll();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '조회 실패' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = await categoryService.create(body);
    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '생성 실패' },
      { status: 500 }
    );
  }
}
```

#### Step 5: API Routes 생성 (단건, 수정, 삭제)
**파일 생성**: `src/app/api/categories/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/lib/services/category.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await categoryService.findById(Number(id));
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '조회 실패' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const category = await categoryService.update(Number(id), body);
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '수정 실패' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await categoryService.delete(Number(id));
    return NextResponse.json({ success: true, message: '삭제되었습니다' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '삭제 실패' },
      { status: 500 }
    );
  }
}
```

#### Step 6-11: 페이지와 컴포넌트 작성

**나머지 단계**:
```
Step 6: src/app/categories/page.tsx (목록 페이지)
Step 7: src/components/CategoryList.tsx (목록 컴포넌트)
Step 8: src/app/categories/new/page.tsx (생성 페이지)
Step 9: src/components/CategoryForm.tsx (폼 컴포넌트)
Step 10: src/app/categories/[id]/edit/page.tsx (수정 페이지)
Step 11: 브라우저에서 전체 테스트
```

**💡 힌트**: 패턴 참조서(03-patterns-reference.md)의 템플릿을 복사해서 사용하세요!

### ✅ 완료 체크리스트
```
□ Step 1: DB 스키마 + 마이그레이션
□ Step 2: 타입 정의
□ Step 3: Service Layer (CRUD 메서드)
□ Step 4: API Route (GET, POST)
□ Step 5: API Route [id] (GET, PUT, DELETE)
□ Step 6: 목록 페이지 (Server Component)
□ Step 7: 목록 컴포넌트 (Client Component)
□ Step 8: 생성 페이지
□ Step 9: 폼 컴포넌트
□ Step 10: 수정 페이지
□ Step 11: 전체 기능 테스트
```

### 🎉 완료하면 얻는 것
```
✅ 완전한 CRUD를 혼자서 만들 수 있게 됩니다!
✅ 다른 프로젝트에 바로 적용 가능한 능력
✅ Next.js App Router 마스터 수준
```

---

## 💡 실습 팁

### 🐛 에러가 나면
```
1. 콘솔 메시지를 자세히 읽기
   - 브라우저 Console 탭 (F12)
   - 터미널 에러 메시지

2. 에러 종류별 대처
   - 타입 에러 → 타입 정의 확인
   - 404 에러 → 경로/파일명 확인
   - 500 에러 → 서버 로그 확인
   - Prisma 에러 → 마이그레이션 실행 여부 확인

3. 디버깅 도구 활용
   - console.log로 값 확인
   - Network 탭에서 API 호출 확인
   - 브라우저 React DevTools
```

### 🔍 막혔을 때
```
1. 이 프로젝트의 기존 코드 참고
   - target-products 폴더가 완벽한 예시
   - 같은 패턴을 따라하세요

2. 학습 가이드 다시 읽기
   - 01-flow-tracing.md: 흐름 확인
   - 02-architecture-basics.md: 개념 복습
   - 03-patterns-reference.md: 템플릿 복사

3. 단계별로 천천히
   - 한 번에 하나씩 수정
   - 수정 후 바로 테스트
   - 작동하면 다음 단계
```

### ✅ 테스트 방법
```
1. 브라우저 DevTools (F12) 활용
   - Console: 에러 확인
   - Network: API 호출 확인
   - Elements: HTML 확인

2. 단계별 테스트
   - API 먼저 테스트 (Postman이나 curl)
   - UI는 나중에 테스트
   - 한 기능씩 확인

3. 체크리스트 활용
   - 각 단계마다 체크
   - 놓친 것이 없는지 확인
```

---

## 🎯 체크포인트

### 초급 (필수)
```
□ 실습 1 완료 - 필드 추가를 할 수 있다
□ 코드 흐름을 설명할 수 있다
□ Server/Client Component를 구분할 수 있다
```

### 중급 (권장)
```
□ 실습 2 완료 - 검색 기능을 만들 수 있다
□ 실습 3 완료 - 정렬 기능을 만들 수 있다
□ 패턴을 이해하고 응용할 수 있다
```

### 고급 (숙련)
```
□ 실습 4 완료 - 완전한 CRUD를 처음부터 만들 수 있다
□ 에러를 스스로 해결할 수 있다
□ 다른 프로젝트에 패턴을 적용할 수 있다
```

---

## 🎓 다음 단계

실습을 완료했다면, 퀴즈로 이해도를 점검해보세요!

```
📍 다음 단계: quiz/understanding-check.md
```

또는 시각 자료로 전체 구조를 복습하세요:

```
📊 다이어그램: diagrams/flow-interactive.md
🗺️ 구조 지도: visual-guide/architecture-map.md
```

---

## 💪 마무리 격려

실습은 어땠나요?

- ✅ 쉬웠다면: 고급 과제에 도전하세요!
- 🤔 어려웠다면: 천천히 다시 해보세요. 괜찮아요!
- 💪 완료했다면: 축하합니다! 이제 Next.js 개발자입니다!

**기억하세요**:
> 프로그래밍은 반복 연습으로 늡니다. 한 번에 완벽할 필요 없어요! 🌟
