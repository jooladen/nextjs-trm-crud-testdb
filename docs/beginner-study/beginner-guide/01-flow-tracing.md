# 🔍 코드 흐름 따라가기

이 문서에서는 **실제로 코드가 어떻게 실행되는지** 단계별로 따라가봅니다.

마치 탐정이 되어 사건을 추적하듯이, 코드의 흐름을 하나하나 추적해볼 거예요!

---

## 🎬 시나리오 1: 페이지 로딩 (처음 방문할 때)

**상황**: 사용자가 브라우저 주소창에 다음을 입력합니다
```
http://localhost:3000/trm/target-products
```

이제 무슨 일이 일어나는지 Step별로 따라가봅시다!

---

### Step 1 🚪 Next.js 라우터가 요청을 받음

**📍 실행 위치**: Next.js 내부 (우리가 만든 코드가 아님)

**💭 라우터가 생각하기**:
"오, 사용자가 `/trm/target-products` 경로를 요청했네!"
"이 경로에 해당하는 `page.tsx` 파일을 찾아야겠어."

**🔍 찾은 파일**:
```
src/app/trm/target-products/page.tsx
```

**➡️ 다음 단계**: 찾은 page.tsx 파일을 실행합니다

---

### Step 2 🏃 page.tsx (Server Component) 실행

**📍 파일 위치**: `src/app/trm/target-products/page.tsx`
**📍 실행 환경**: 서버 (브라우저가 아님!)
**⏰ 타이밍**: 페이지 요청 시 딱 한 번 실행

**💭 page.tsx가 생각하기**:
"제품 목록을 보여줘야 하는데, 먼저 데이터를 가져와야겠어."
"serverFetch 함수를 사용해서 API를 호출하자!"

**📝 실제 코드** (17번째 줄 근처):
```typescript
const products = await serverFetch<TargetProductListItemDto[]>(
  '/api/target-products'
);
```

**🔑 핵심 포인트**:
- `async/await`를 사용할 수 있어요 (Server Component니까!)
- `serverFetch`는 서버에서 자기 자신의 API를 호출하는 유틸리티예요
- 이 코드는 **브라우저에서 절대 실행되지 않습니다**

**➡️ 다음 단계**: serverFetch 함수가 실행됩니다

---

### Step 3 📞 serverFetch가 내부 API 호출

**📍 파일 위치**: `src/lib/utils/serverFetch.ts`
**📍 실행 환경**: 서버

**💭 serverFetch가 생각하기**:
"API 엔드포인트 `/api/target-products`에 GET 요청을 보내야지."
"전체 URL을 만들어야 하니까... `http://localhost:3000/api/target-products`"

**📝 실제 동작**:
```typescript
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const url = `${baseUrl}/api/target-products`;

const response = await fetch(url, {
  cache: 'no-store',  // 캐시 안 씀 = 항상 최신 데이터
});
```

**📡 HTTP 요청**:
```
GET http://localhost:3000/api/target-products
```

**➡️ 다음 단계**: API Route가 이 요청을 받습니다

---

### Step 4 🛣️ API Route (GET 핸들러) 실행

**📍 파일 위치**: `src/app/api/target-products/route.ts`
**📍 실행 환경**: 서버
**📍 코드 라인**: 8번째 줄 근처 (GET 함수)

**💭 API Route가 생각하기**:
"GET 요청이 왔네! 제품 목록을 조회해야 하는구나."
"Service Layer에 요청해서 데이터를 가져오자."

**📝 실제 코드**:
```typescript
export async function GET() {
  try {
    // Service에서 모든 제품 가져오기
    const products = await targetProductService.findAll();

    // 성공 응답 반환
    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    // 에러 처리
    return NextResponse.json({
      success: false,
      error: '조회에 실패했습니다'
    }, { status: 500 });
  }
}
```

**🔑 핵심 포인트**:
- API Route는 HTTP 요청을 받아서 처리하는 곳이에요
- 실제 로직은 Service Layer에 위임합니다
- 에러가 나도 적절하게 응답을 보냅니다

**➡️ 다음 단계**: Service Layer 호출

---

### Step 5 ⚙️ Service Layer에서 DB 조회

**📍 파일 위치**: `src/lib/services/targetProduct.service.ts`
**📍 메서드**: `findAll()`
**📍 실행 환경**: 서버

**💭 Service가 생각하기**:
"Prisma ORM을 사용해서 데이터베이스에서 모든 제품을 가져와야지."
"관련 테이블(productLine)도 함께 가져와야 해."

**📝 실제 코드**:
```typescript
async findAll() {
  // Step 5-1: Prisma로 DB 쿼리
  const products = await prisma.target_product.findMany({
    include: {
      productLine: true  // 관련 데이터도 함께 가져오기
    },
  });

  // Step 5-2: DTO로 변환 (필요한 필드만 추출)
  return products.map((product) => ({
    target_product_id: product.target_product_id,
    target_product_name: product.target_product_name,
    deployment_date: product.deployment_date.toISOString(),
    productLine: {
      target_division: product.productLine.target_division,
      target_product_line: product.productLine.target_product_line,
    },
  }));
}
```

**🗄️ 실제 실행되는 SQL** (Prisma가 자동 생성):
```sql
SELECT
  tp.*,
  tpl.*
FROM target_product tp
LEFT JOIN target_product_line tpl
  ON tp.target_product_line_id = tpl.target_product_line_id;
```

**🔄 DTO 변환**:
- DB 모델 그대로 반환하면 불필요한 정보가 많아요
- 필요한 필드만 골라서 깔끔하게 정리합니다
- Date 객체를 문자열로 변환합니다 (JSON 전송을 위해)

**⬅️ 돌아가기**: API Route에 데이터를 반환합니다

---

### Step 6 ⬅️ 응답이 역순으로 돌아옴

응답이 거꾸로 올라갑니다:

```
🗄️ Database (PostgreSQL/MySQL)
    ↓ 쿼리 결과 반환
⚙️ Service Layer
    ↓ DTO 배열 반환
🛣️ API Route
    ↓ JSON 응답 { success: true, data: [...] }
📞 serverFetch
    ↓ data 부분만 추출
📄 page.tsx
    ↓ products 변수에 저장
```

**📦 최종 데이터 형식** (JSON 배열):
```json
[
  {
    "target_product_id": 1,
    "target_product_name": "제품A",
    "deployment_date": "2024-01-15",
    "productLine": {
      "target_division": "사업부1",
      "target_product_line": "라인1"
    }
  },
  {
    "target_product_id": 2,
    "target_product_name": "제품B",
    ...
  }
]
```

---

### Step 7 🎨 page.tsx가 HTML 만들기

**📍 파일 위치**: `src/app/trm/target-products/page.tsx`
**📍 코드 라인**: 23번째 줄부터

**💭 page.tsx가 생각하기**:
"데이터를 받았으니, 이제 HTML을 만들어서 사용자에게 보여줘야지."
"Client Component인 `TargetProductList`에 데이터를 넘겨줄게."

**📝 실제 코드**:
```typescript
return (
  <div className="p-6">
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">목표 제품 관리</h1>
      <Link href="/trm/target-products/new">
        <Button>신규 등록</Button>
      </Link>
    </div>

    {/* Client Component에 데이터 전달 */}
    <TargetProductList initialData={products} />
  </div>
);
```

**🔑 핵심 포인트**:
- Server Component는 **완성된 HTML**을 만듭니다
- Client Component(`TargetProductList`)에 `initialData`로 데이터를 전달합니다
- 이 HTML에는 아직 상호작용 기능이 없어요 (다음 단계에서 추가)

**➡️ 다음 단계**: 브라우저가 HTML을 받습니다

---

### Step 8 🖥️ 브라우저가 HTML 받고 화면에 표시

**📍 실행 환경**: 사용자의 브라우저

**📦 서버가 브라우저에 보내는 것**:
```
1. HTML (완성된 구조)
2. CSS (스타일)
3. JavaScript (상호작용 로직)
```

**💻 브라우저가 하는 일**:

**8-1. HTML 렌더링**
```
브라우저가 받은 HTML을 화면에 그립니다
→ 사용자가 제품 목록을 볼 수 있어요!
```

**8-2. Hydration (수분 공급? 생명 불어넣기!)**
```javascript
// JavaScript가 실행되면서 HTML에 "생명"을 불어넣습니다
// 이제 버튼이 클릭 가능해지고, 입력창이 작동합니다
```

**🎯 Hydration이란?**
- 서버에서 만든 정적 HTML에 JavaScript를 연결하는 과정
- 이제 React가 제어권을 가져갑니다
- 버튼 클릭, 입력 등 상호작용이 가능해집니다

**✅ 완료!**
```
사용자가 화면에서 제품 목록을 보게 됩니다!
테이블에 데이터가 표시되고, 버튼을 클릭할 수 있습니다.
```

---

## 📊 전체 흐름 요약 (페이지 로딩)

```
1. 🙋 사용자: 주소창에 URL 입력
   ↓
2. 🚪 Next.js Router: page.tsx 찾기
   ↓
3. 📄 page.tsx (Server): serverFetch 호출
   ↓
4. 📞 serverFetch: API에 GET 요청
   ↓
5. 🛣️ API Route: Service 호출
   ↓
6. ⚙️ Service: Prisma로 DB 쿼리
   ↓
7. 🗄️ Database: 데이터 반환
   ↓
8. ⬅️ 응답이 역순으로 돌아감 (Service → API → serverFetch → page.tsx)
   ↓
9. 🎨 page.tsx: HTML 생성
   ↓
10. 📦 서버: HTML + CSS + JS를 브라우저에 전송
    ↓
11. 🖥️ 브라우저: 화면에 렌더링 + Hydration
    ↓
12. ✅ 완료: 사용자가 화면을 봄!
```

**⏱️ 소요 시간**: 보통 1초 이내

---

## 🎬 시나리오 2: 삭제 버튼 클릭 (사용자 인터랙션)

**상황**: 사용자가 테이블에서 "삭제" 버튼을 클릭합니다

이제 무슨 일이 일어나는지 따라가봅시다!

---

### Step 1 🖱️ Client Component의 이벤트 핸들러 실행

**📍 파일 위치**: `src/components/trm/target-products/TargetProductList.tsx`
**📍 실행 환경**: 브라우저 (클라이언트!)
**⏰ 타이밍**: 버튼 클릭 즉시

**💭 컴포넌트가 생각하기**:
"사용자가 삭제 버튼을 클릭했네!"
"먼저 확인 대화상자를 보여줘야지."

**📝 실제 코드**:
```typescript
<Button
  variant="ghost"
  size="sm"
  onClick={() => handleDelete(product)}
>
  <Trash2 className="h-4 w-4" />
</Button>
```

**🔔 확인 대화상자**:
```javascript
if (!confirm('정말 삭제하시겠습니까?')) {
  return;  // 사용자가 취소하면 여기서 끝
}
```

**➡️ 다음 단계**: 사용자가 "확인"을 누르면 계속 진행

---

### Step 2 ⚡ 낙관적 업데이트 (Optimistic Update)

**📍 파일 위치**: `src/lib/hooks/useOptimisticDelete.ts`
**📍 실행 환경**: 브라우저

**💭 훅이 생각하기**:
"서버 응답을 기다리지 말고, 먼저 UI부터 업데이트하자!"
"사용자에게 빠른 반응을 보여주는 게 중요해!"

**📝 실제 코드**:
```typescript
// Step 2-1: 낙관적 업데이트 (UI에서 먼저 제거)
startTransition(() => {
  setItems((prev) => prev.filter(
    (item) => getItemId(item) !== itemId
  ));
});
```

**👀 사용자가 보는 것**:
```
클릭!
  ↓
0.01초 안에 항목이 화면에서 사라짐
  ↓
"와, 빠르다!" 😊
```

**🔑 핵심 포인트**:
- 서버 응답을 기다리지 않고 **먼저 UI를 업데이트**합니다
- 사용자 경험이 훨씬 좋아집니다
- 실패하면 나중에 복구합니다 (Step 6에서 설명)

**➡️ 동시에**: 백그라운드에서 API 호출이 시작됩니다

---

### Step 3 📡 DELETE 요청 보냄

**📍 실행 환경**: 브라우저
**⏰ 타이밍**: Step 2와 거의 동시에 (백그라운드)

**📝 실제 코드**:
```typescript
const response = await fetch(
  `/api/target-products/${itemId}`,
  {
    method: 'DELETE',
  }
);
```

**📡 HTTP 요청**:
```
DELETE http://localhost:3000/api/target-products/123
```

**🔑 핵심 포인트**:
- 이 요청은 백그라운드에서 실행됩니다
- 사용자는 이미 UI 변화를 봤어요 (Step 2에서)
- 응답이 오는 데 약 0.5~1초 걸립니다

**➡️ 다음 단계**: API Route가 요청을 받습니다

---

### Step 4 🛣️ API Route DELETE 핸들러 실행

**📍 파일 위치**: `src/app/api/target-products/[id]/route.ts`
**📍 함수**: `DELETE`
**📍 실행 환경**: 서버

**💭 API Route가 생각하기**:
"DELETE 요청이 왔네! ID는... 123번이구나."
"Service에 삭제 요청을 전달하자."

**📝 실제 코드**:
```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // params는 Promise니까 await 필요!
    const { id } = await params;

    // Service에 삭제 요청
    await targetProductService.delete(Number(id));

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '삭제되었습니다'
    });
  } catch (error) {
    // 에러 처리
    return NextResponse.json({
      success: false,
      error: '삭제에 실패했습니다'
    }, { status: 500 });
  }
}
```

**🔑 핵심 포인트**:
- `params`는 Next.js 15+에서 Promise입니다 (꼭 await!)
- ID를 숫자로 변환합니다 (`Number(id)`)
- Service Layer에 실제 작업을 위임합니다

**➡️ 다음 단계**: Service Layer 호출

---

### Step 5 🗑️ Service가 DB에서 삭제

**📍 파일 위치**: `src/lib/services/targetProduct.service.ts`
**📍 메서드**: `delete(id: number)`
**📍 실행 환경**: 서버

**💭 Service가 생각하기**:
"ID 123번 제품을 삭제해야 하는구나."
"먼저 존재하는지 확인하고, 있으면 삭제하자."

**📝 실제 코드**:
```typescript
async delete(id: number) {
  // Step 5-1: 존재 여부 확인
  const existing = await prisma.target_product.findUnique({
    where: { target_product_id: id },
  });

  if (!existing) {
    throw new Error('제품을 찾을 수 없습니다');
  }

  // Step 5-2: 삭제 실행
  await prisma.target_product.delete({
    where: { target_product_id: id },
  });
}
```

**🗄️ 실제 실행되는 SQL**:
```sql
-- 1. 존재 확인
SELECT * FROM target_product WHERE target_product_id = 123;

-- 2. 삭제
DELETE FROM target_product WHERE target_product_id = 123;
```

**✅ 완료**: 데이터베이스에서 실제로 삭제되었습니다!

**⬅️ 돌아가기**: API Route에 성공 응답을 반환합니다

---

### Step 6 ✅ 성공 응답 또는 ❌ 에러 처리

**📍 실행 환경**: 브라우저
**⏰ 타이밍**: 서버 응답을 받은 후

**📝 실제 코드**:
```typescript
const result = await response.json();

if (result.success) {
  // ✅ 성공 시
  alert('삭제되었습니다');
  // UI는 이미 업데이트했으니 아무것도 안 해도 됨!
} else {
  // ❌ 실패 시 - 복구 필요!
  alert('삭제 실패: ' + result.error);
  router.refresh();  // 서버에서 최신 데이터 다시 가져옴
}
```

**🔄 실패 시 복구 과정**:
```
1. 사용자에게 에러 메시지 표시
2. router.refresh() 호출
3. 서버에서 최신 데이터를 다시 가져옴
4. 삭제했던 항목이 다시 나타남
5. 사용자가 "아, 실패했구나" 인지
```

**🎯 성공 시 동작**:
```
1. 알림창 표시: "삭제되었습니다"
2. UI는 이미 업데이트되어 있음 (Step 2에서)
3. 아무 작업 필요 없음 - 완벽!
```

---

## 📊 전체 흐름 요약 (삭제 버튼 클릭)

```
1. 🖱️ 사용자: 삭제 버튼 클릭
   ↓
2. 🔔 확인 대화상자: "정말 삭제하시겠습니까?"
   ↓
3. ⚡ 낙관적 업데이트: UI에서 즉시 항목 제거 (0.01초)
   ↓ (동시에)
4. 📡 fetch: DELETE /api/target-products/123
   ↓
5. 🛣️ API Route: Service.delete(123) 호출
   ↓
6. ⚙️ Service: Prisma로 DB에서 삭제
   ↓
7. 🗄️ Database: DELETE 실행
   ↓
8. ⬅️ 응답이 역순으로 돌아감 (Service → API → 브라우저)
   ↓
9. ✅ 성공: 알림 표시, UI 유지
   또는
   ❌ 실패: 에러 알림, router.refresh()로 복구
```

---

## ⏱️ 타이밍 비교

### 일반적인 방법 (낙관적 업데이트 없이):
```
사용자 클릭
  ↓
로딩 스피너 표시 ⏳
  ↓
서버 요청 및 응답 대기 (1초)
  ↓
UI 업데이트
  ↓
완료 ✅

총 시간: 약 1초 (사용자가 기다려야 함)
```

### 낙관적 업데이트 방법 (현재 프로젝트):
```
사용자 클릭
  ↓
즉시 UI 업데이트 ⚡ (0.01초)
  ↓
사용자: "오, 빠르다!" 😊
  ↓
(백그라운드) 서버 요청 및 응답 (1초)
  ↓
성공 확인 ✅

체감 시간: 0.01초 (훨씬 빠름!)
```

**🎯 결론**: 낙관적 업데이트를 사용하면 사용자 경험이 훨씬 좋아집니다!

---

## 🎓 학습 포인트 정리

### 페이지 로딩에서 배운 것:
```
✅ Server Component는 서버에서만 실행된다
✅ async/await를 사용해서 데이터를 가져올 수 있다
✅ serverFetch → API → Service → DB 순서로 흐른다
✅ 응답은 역순으로 돌아온다
✅ Hydration으로 HTML에 상호작용 기능이 추가된다
```

### 삭제 기능에서 배운 것:
```
✅ Client Component에서 이벤트를 처리한다
✅ 낙관적 업데이트로 빠른 반응을 보여준다
✅ 백그라운드에서 실제 삭제를 진행한다
✅ 실패 시 router.refresh()로 복구한다
✅ 성공 시 UI는 이미 업데이트되어 있다
```

---

## 🎯 다음 단계

이제 코드가 어떻게 흐르는지 이해했나요?

다음 문서에서는 **각 계층의 역할**과 **언제 무엇을 사용해야 하는지** 배워봅시다!

```
📍 다음 단계: 02-architecture-basics.md
```

---

## 💡 추가 팁

### 직접 확인해보기
실제 코드 파일을 열어서 다음을 확인해보세요:

1. **page.tsx 열기**
   - `src/app/trm/target-products/page.tsx`
   - serverFetch 호출 부분 찾기

2. **API Route 열기**
   - `src/app/api/target-products/route.ts`
   - GET 함수 확인

3. **Service 열기**
   - `src/lib/services/targetProduct.service.ts`
   - findAll, delete 메서드 확인

4. **브라우저 개발자 도구 (F12)**
   - Network 탭에서 API 호출 확인
   - Console 탭에서 로그 확인

### 실습 과제
실제로 코드를 수정해보며 흐름을 확인해보세요:

1. **console.log 추가하기**
   ```typescript
   // page.tsx에서
   console.log('📄 Page: 데이터 가져오는 중...');
   const products = await serverFetch(...);
   console.log('📄 Page: 데이터 받음:', products.length, '개');
   ```

2. **Network 탭 관찰하기**
   - 브라우저에서 F12 누르기
   - Network 탭 선택
   - 페이지 새로고침
   - `/api/target-products` 요청 찾기
   - 응답 데이터 확인

3. **삭제 흐름 추적하기**
   - 삭제 버튼 클릭
   - Network 탭에서 DELETE 요청 확인
   - 응답 시간 확인
   - UI 업데이트 타이밍 체크
