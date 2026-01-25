# 📖 패턴 참조서 (복사해서 쓰는 템플릿)

이 문서는 **복사해서 바로 사용할 수 있는 코드 템플릿**을 제공합니다.

새로운 기능을 만들 때 이 패턴을 따라하면, 실수 없이 빠르게 개발할 수 있어요!

---

## 📖 패턴 1: 목록 페이지 만들기 (CRUD의 R - Read)

### ✅ 체크리스트

작업을 시작하기 전에 이 체크리스트를 복사해서 하나씩 체크하세요!

```
□ 1. DB 스키마 확인 (어떤 테이블/필드?)
□ 2. 타입 정의 작성 (DTO)
□ 3. Service Layer 메서드 작성 (findAll)
□ 4. API Route 생성 (GET 핸들러)
□ 5. Server Component 페이지 생성
□ 6. Client Component 목록 컴포넌트 생성
□ 7. 브라우저에서 테스트
```

### 📝 1단계: 타입 정의

**파일 생성**: `src/lib/types/yourEntity.types.ts`

```typescript
// ===== 응답 DTO (API에서 반환하는 형식) =====
export interface YourEntityListItemDto {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  // 관계 데이터
  relatedEntity?: {
    id: number;
    name: string;
  };
}

export interface YourEntityResponseDto {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  relatedEntity: {
    id: number;
    name: string;
  };
}

// ===== 생성 DTO =====
export interface CreateYourEntityDto {
  name: string;
  description?: string;
  relatedEntityId: number;
}

// ===== 수정 DTO =====
export interface UpdateYourEntityDto {
  name?: string;
  description?: string;
  relatedEntityId?: number;
}
```

### 📝 2단계: Service Layer

**파일 생성**: `src/lib/services/yourEntity.service.ts`

```typescript
import { prisma } from '@/lib/prisma';
import type {
  YourEntityListItemDto,
  YourEntityResponseDto,
  CreateYourEntityDto,
  UpdateYourEntityDto,
} from '@/lib/types/yourEntity.types';

class YourEntityService {
  /**
   * 전체 목록 조회
   */
  async findAll(): Promise<YourEntityListItemDto[]> {
    const items = await prisma.your_table.findMany({
      include: {
        relatedTable: true,  // 필요한 관계만 포함
      },
      orderBy: {
        created_at: 'desc',  // 최신순 정렬
      },
    });

    // DTO로 변환
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      createdAt: item.created_at.toISOString(),
      relatedEntity: item.relatedTable ? {
        id: item.relatedTable.id,
        name: item.relatedTable.name,
      } : undefined,
    }));
  }

  /**
   * ID로 단건 조회
   */
  async findById(id: number): Promise<YourEntityResponseDto> {
    const item = await prisma.your_table.findUnique({
      where: { id },
      include: {
        relatedTable: true,
      },
    });

    if (!item) {
      throw new Error('항목을 찾을 수 없습니다');
    }

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      createdAt: item.created_at.toISOString(),
      updatedAt: item.updated_at.toISOString(),
      relatedEntity: {
        id: item.relatedTable.id,
        name: item.relatedTable.name,
      },
    };
  }

  /**
   * 새 항목 생성
   */
  async create(data: CreateYourEntityDto): Promise<YourEntityResponseDto> {
    // 검증
    if (!data.name) {
      throw new Error('이름은 필수입니다');
    }

    const item = await prisma.your_table.create({
      data: {
        name: data.name,
        description: data.description,
        related_table_id: data.relatedEntityId,
      },
      include: {
        relatedTable: true,
      },
    });

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      createdAt: item.created_at.toISOString(),
      updatedAt: item.updated_at.toISOString(),
      relatedEntity: {
        id: item.relatedTable.id,
        name: item.relatedTable.name,
      },
    };
  }

  /**
   * 수정
   */
  async update(id: number, data: UpdateYourEntityDto): Promise<YourEntityResponseDto> {
    // 존재 확인
    await this.findById(id);

    const item = await prisma.your_table.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        related_table_id: data.relatedEntityId,
      },
      include: {
        relatedTable: true,
      },
    });

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      createdAt: item.created_at.toISOString(),
      updatedAt: item.updated_at.toISOString(),
      relatedEntity: {
        id: item.relatedTable.id,
        name: item.relatedTable.name,
      },
    };
  }

  /**
   * 삭제
   */
  async delete(id: number): Promise<void> {
    // 존재 확인
    await this.findById(id);

    await prisma.your_table.delete({
      where: { id },
    });
  }
}

// 싱글톤 인스턴스 export
export const yourEntityService = new YourEntityService();
```

### 📝 3단계: API Route (목록, 생성)

**파일 생성**: `src/app/api/your-entity/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { yourEntityService } from '@/lib/services/yourEntity.service';

/**
 * GET /api/your-entity
 * 전체 목록 조회
 */
export async function GET() {
  try {
    const items = await yourEntityService.findAll();

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('조회 에러:', error);

    return NextResponse.json(
      {
        success: false,
        error: '조회에 실패했습니다',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/your-entity
 * 새 항목 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 간단한 검증
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: '이름은 필수입니다',
        },
        { status: 400 }
      );
    }

    const item = await yourEntityService.create(body);

    return NextResponse.json(
      {
        success: true,
        data: item,
        message: '생성되었습니다',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('생성 에러:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '생성에 실패했습니다',
      },
      { status: 500 }
    );
  }
}
```

### 📝 4단계: API Route (단건 조회, 수정, 삭제)

**파일 생성**: `src/app/api/your-entity/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { yourEntityService } from '@/lib/services/yourEntity.service';

/**
 * GET /api/your-entity/:id
 * 단건 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await yourEntityService.findById(Number(id));

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('조회 에러:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '조회에 실패했습니다',
      },
      { status: 404 }
    );
  }
}

/**
 * PUT /api/your-entity/:id
 * 수정
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const item = await yourEntityService.update(Number(id), body);

    return NextResponse.json({
      success: true,
      data: item,
      message: '수정되었습니다',
    });
  } catch (error) {
    console.error('수정 에러:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '수정에 실패했습니다',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/your-entity/:id
 * 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await yourEntityService.delete(Number(id));

    return NextResponse.json({
      success: true,
      message: '삭제되었습니다',
    });
  } catch (error) {
    console.error('삭제 에러:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '삭제에 실패했습니다',
      },
      { status: 500 }
    );
  }
}
```

### 📝 5단계: Server Component 페이지

**파일 생성**: `src/app/your-entity/page.tsx`

```typescript
import { serverFetch } from '@/lib/utils/serverFetch';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import YourEntityList from '@/components/YourEntityList';
import type { YourEntityListItemDto } from '@/lib/types/yourEntity.types';

export default async function YourEntityPage() {
  // 서버에서 데이터 가져오기
  const items = await serverFetch<YourEntityListItemDto[]>('/api/your-entity');

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">목록 관리</h1>
        <Link href="/your-entity/new">
          <Button>신규 등록</Button>
        </Link>
      </div>

      {/* 목록 (Client Component) */}
      <YourEntityList initialData={items} />
    </div>
  );
}
```

### 📝 6단계: Client Component (목록)

**파일 생성**: `src/components/YourEntityList.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import type { YourEntityListItemDto } from '@/lib/types/yourEntity.types';

interface Props {
  initialData: YourEntityListItemDto[];
}

export default function YourEntityList({ initialData }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialData);

  // 삭제 핸들러
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    // 낙관적 업데이트: UI에서 먼저 제거
    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      const response = await fetch(`/api/your-entity/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('삭제되었습니다');
      } else {
        alert('삭제 실패: ' + result.error);
        router.refresh(); // 실패 시 데이터 복구
      }
    } catch (error) {
      alert('에러가 발생했습니다');
      router.refresh(); // 실패 시 데이터 복구
    }
  };

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">이름</th>
            <th className="px-4 py-2 text-left">설명</th>
            <th className="px-4 py-2 text-left">관련 정보</th>
            <th className="px-4 py-2 text-left">생성일</th>
            <th className="px-4 py-2 text-center">작업</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                데이터가 없습니다
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2 font-medium">{item.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {item.description || '-'}
                </td>
                <td className="px-4 py-2 text-sm">
                  {item.relatedEntity?.name || '-'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/your-entity/${item.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

### 🎯 이 프로젝트의 예시

완벽한 구현 예시를 보고 싶다면:
- Service: `src/lib/services/targetProduct.service.ts`
- API: `src/app/api/target-products/route.ts`
- Page: `src/app/trm/target-products/page.tsx`
- Component: `src/components/trm/target-products/TargetProductList.tsx`

---

## 📖 패턴 2: 생성 폼 만들기 (CRUD의 C - Create)

### ✅ 체크리스트

```
□ 1. Service에 create 메서드가 있는지 확인
□ 2. API Route에 POST 핸들러가 있는지 확인
□ 3. 폼 페이지 생성 (Client Component)
□ 4. useState로 폼 상태 관리
□ 5. handleSubmit에서 API 호출
□ 6. 성공 시 목록 페이지로 이동
□ 7. 브라우저에서 테스트
```

### 📝 생성 페이지

**파일 생성**: `src/app/your-entity/new/page.tsx`

```typescript
import YourEntityForm from '@/components/YourEntityForm';

export default function NewYourEntityPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">신규 등록</h1>
      <YourEntityForm />
    </div>
  );
}
```

### 📝 폼 컴포넌트

**파일 생성**: `src/components/YourEntityForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CreateYourEntityDto } from '@/lib/types/yourEntity.types';

interface Props {
  initialData?: CreateYourEntityDto;
  isEdit?: boolean;
  id?: number;
}

export default function YourEntityForm({ initialData, isEdit = false, id }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 폼 상태 관리
  const [formData, setFormData] = useState<CreateYourEntityDto>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    relatedEntityId: initialData?.relatedEntityId || 0,
  });

  // 입력 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'relatedEntityId' ? Number(value) : value,
    }));
  };

  // 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 검증
    if (!formData.name) {
      alert('이름을 입력해주세요');
      return;
    }

    setIsLoading(true);

    try {
      const url = isEdit ? `/api/your-entity/${id}` : '/api/your-entity';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert(isEdit ? '수정되었습니다' : '생성되었습니다');
        router.push('/your-entity');
      } else {
        alert('실패: ' + result.error);
      }
    } catch (error) {
      console.error('에러:', error);
      alert('에러가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {/* 이름 */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          이름 <span className="text-red-500">*</span>
        </label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="이름을 입력하세요"
          required
        />
      </div>

      {/* 설명 */}
      <div>
        <label className="mb-1 block text-sm font-medium">설명</label>
        <Textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="설명을 입력하세요"
          rows={4}
        />
      </div>

      {/* 관련 엔티티 ID */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          관련 항목 ID <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          name="relatedEntityId"
          value={formData.relatedEntityId}
          onChange={handleChange}
          placeholder="관련 항목 ID"
          required
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '처리 중...' : isEdit ? '수정' : '생성'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
```

---

## 📖 패턴 3: 수정 폼 만들기 (CRUD의 U - Update)

### ✅ 체크리스트

```
□ 1. Service에 findById, update 메서드가 있는지 확인
□ 2. API Route에 GET, PUT 핸들러가 있는지 확인
□ 3. 수정 페이지 생성
□ 4. 기존 데이터 불러오기
□ 5. 폼 컴포넌트 재사용 (isEdit=true)
□ 6. 브라우저에서 테스트
```

### 📝 수정 페이지

**파일 생성**: `src/app/your-entity/[id]/edit/page.tsx`

```typescript
import { serverFetch } from '@/lib/utils/serverFetch';
import YourEntityForm from '@/components/YourEntityForm';
import type { YourEntityResponseDto } from '@/lib/types/yourEntity.types';

export default async function EditYourEntityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 기존 데이터 가져오기
  const item = await serverFetch<YourEntityResponseDto>(
    `/api/your-entity/${id}`
  );

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">수정</h1>
      <YourEntityForm
        initialData={{
          name: item.name,
          description: item.description,
          relatedEntityId: item.relatedEntity.id,
        }}
        isEdit={true}
        id={Number(id)}
      />
    </div>
  );
}
```

---

## 🎯 패턴 적용 순서 (새 엔티티 추가할 때)

완전히 새로운 기능을 만들 때는 이 순서를 따르세요:

### 1단계: 📊 데이터 모델링
```bash
# schema.prisma에 모델 추가
model your_table {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(200)
  description String?  @db.Text
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  // 관계 정의
  related_id Int
  relatedTable RelatedTable @relation(fields: [related_id], references: [id])
}

# 마이그레이션 실행
npx prisma migrate dev --name add_your_table
```

### 2단계: ⚙️ Service Layer
```
✅ yourEntity.service.ts 생성
✅ findAll, findById, create, update, delete 메서드 작성
✅ DTO 변환 로직 포함
```

### 3단계: 🛣️ API Routes
```
✅ /api/your-entity/route.ts (GET, POST)
✅ /api/your-entity/[id]/route.ts (GET, PUT, DELETE)
✅ 에러 처리 포함
```

### 4단계: 📋 타입 정의
```
✅ yourEntity.types.ts 생성
✅ ListItemDto, ResponseDto, CreateDto, UpdateDto 정의
```

### 5단계: 📄 Server Component 페이지
```
✅ /your-entity/page.tsx (목록)
✅ /your-entity/new/page.tsx (생성)
✅ /your-entity/[id]/edit/page.tsx (수정)
```

### 6단계: 🖥️ Client Component
```
✅ YourEntityList.tsx (목록 + 삭제)
✅ YourEntityForm.tsx (생성/수정 폼)
```

### 7단계: ✅ 테스트
```
✅ 브라우저에서 목록 확인
✅ 신규 등록 테스트
✅ 수정 테스트
✅ 삭제 테스트
✅ 에러 케이스 테스트
```

---

## 💡 패턴 사용 팁

### 🎯 이름 규칙
```
Entity: Product
  ├─ Service: productService
  ├─ API: /api/products, /api/products/[id]
  ├─ Types: product.types.ts
  ├─ Page: /products/page.tsx
  └─ Components: ProductList.tsx, ProductForm.tsx
```

### 🔄 재사용 전략
```
1. Form 컴포넌트는 생성/수정 공용
   - isEdit prop으로 구분
   - initialData로 기존 값 전달

2. Service 메서드는 여러 API에서 호출 가능
   - 로직 중복 방지
   - 일관성 유지

3. DTO는 타입 안정성 보장
   - API 응답 형식 표준화
   - IDE 자동완성 지원
```

### ⚠️ 주의사항
```
1. params는 Next.js 15+에서 Promise
   - 반드시 await params 사용

2. 에러 처리는 필수
   - try-catch로 감싸기
   - 사용자에게 명확한 메시지

3. 낙관적 업데이트 사용 시
   - 실패 케이스 처리 필수
   - router.refresh()로 복구

4. 타입은 정확하게
   - DTO와 DB 모델 구분
   - Optional 필드 명시 (?)
```

---

## 🎓 다음 단계

패턴을 이해했다면, 이제 **직접 따라하며 배울** 차례입니다!

실습 가이드에서 단계별로 코딩을 경험해보세요.

```
📍 다음 단계: 04-hands-on.md
```

---

## 📚 추가 참고자료

### 이 프로젝트의 완벽한 예시
```
📁 target-products 기능
   ├─ Service: src/lib/services/targetProduct.service.ts
   ├─ API: src/app/api/target-products/
   ├─ Types: src/lib/types/targetProduct.types.ts
   ├─ Page: src/app/trm/target-products/page.tsx
   └─ Components: src/components/trm/target-products/
```

### 빠른 참조
```
1. 새 필드 추가: schema.prisma → migrate → Service → API → UI
2. 새 엔티티 추가: 7단계 순서 따르기
3. 폼 검증: handleSubmit에서 처리
4. 에러 메시지: { success: false, error: '...' }
```
