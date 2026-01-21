● 훌륭한 설계가 완성되었습니다! Plan agent가 매우 상세한 아키텍처를 제공했네요. 이제 최종 계획 파일을 작성하겠습니다.

  ★ Insight ─────────────────────────────────────
  서비스 레이어 패턴의 핵심 가치
  1. API 라우트는 "얇은 컨트롤러"로 유지 - 요청/응답만 처리
  2. 서비스 레이어에 모든 비즈니스 로직 집중 - 재사용성 증가
  3. DTO를 통한 명확한 계층 분리 - Prisma 타입과 API 타입 분리로 안전성 확보
  ─────────────────────────────────────────────────

● Updated plan
  ⎿  Wrote 1 lines to ..\..\.claude\plans\refactored-roaming-shell.md
      1 # TRM CRUD 시스템 구현 계획
      2 ## 📋 프로젝트 개요
      3 Next.js 16 + Prisma + PostgreSQL 기반 TRM(Technology Roadmap Management) CRUD 시스템 구축
      4 **1단계 목표**: 타겟제품군(Target_Product)과 기술확보계획(Tech_Secure_Plan) 두 테이블의 완전한 CRUD 구현
      5 ## 🏗️ 아키텍처 패턴─
  [nextjs-trm-crud-testdb] | Sonnet 4.5
● 완벽합니다! 상세한 구현 계획이 완성되었습니다.

  ★ Insight ─────────────────────────────────────
  효과적인 구현 계획의 3요소
  1. 명확한 계층 구조: 31개 파일을 7개 Phase로 구조화 - 의존성 순서대로
  2. 구체적인 데이터 흐름: 각 레이어의 역할과 데이터 변환 지점 명시
  3. 검증 가능한 체크리스트: API 테스트, UI 시나리오, 엣지 케이스까지 포함
  ─────────────────────────────────────────────────

  계획서에 포함된 내용:
  - ✅ 31개 파일의 정확한 경로와 역할
  - ✅ 7단계 구현 순서 (기초 → 서비스 → API → UI)
  - ✅ 타입/DTO 구조 상세 설명
  - ✅ 데이터 흐름 다이어그램
  - ✅ 검증 시나리오 (API 테스트, UI 테스트, 엣지 케이스)
  - ✅ Tailwind CSS 기반 디자인 가이드

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── Ready to code?

 Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ TRM CRUD 시스템 구현 계획

 📋 프로젝트 개요

 Next.js 16 + Prisma + PostgreSQL 기반 TRM(Technology Roadmap Management) CRUD 시스템 구축

 1단계 목표: 타겟제품군(Target_Product)과 기술확보계획(Tech_Secure_Plan) 두 테이블의 완전한 CRUD 구현

 🏗️ 아키텍처 패턴


 클라이언트 (React 19)
     ↓
 페이지 (Server Component)
     ↓
 API Routes (App Router)
     ↓
 서비스 레이어 (비즈니스 로직)
     ↓
 Prisma 클라이언트 (싱글톤)
     ↓
 PostgreSQL 데이터베이스

 📁 구현할 폴더 구조

 src/
 ├── lib/
 │   ├── prisma.ts                     [기존] Prisma 싱글톤
 │   ├── types/                        [신규] 타입 정의 레이어
 │   │   ├── common.types.ts           - 공통 타입 (ApiResponse, Pagination 등)
 │   │   ├── targetProduct.types.ts    - 타겟제품군 DTO
 │   │   └── techSecurePlan.types.ts   - 기술확보계획 DTO
 │   ├── services/                     [신규] 서비스 레이어
 │   │   ├── targetProduct.service.ts  - 타겟제품군 CRUD 로직
 │   │   └── techSecurePlan.service.ts - 기술확보계획 CRUD 로직
 │   ├── utils/                        [신규] 유틸리티
 │   │   ├── apiResponse.ts            - API 응답 헬퍼
 │   │   └── errorHandler.ts           - 에러 처리 유틸
 │   └── constants/
 │       └── routes.ts                 - 라우트 상수
 ├── app/
 │   ├── api/                          [신규] API 라우트
 │   │   ├── target-products/
 │   │   │   ├── route.ts              - GET all, POST create
 │   │   │   └── [id]/route.ts         - GET one, PUT, DELETE
 │   │   ├── tech-secure-plans/
 │   │   │   ├── route.ts
 │   │   │   └── [id]/route.ts
 │   │   └── reference-data/           - 드롭다운용 참조 데이터
 │   │       ├── product-lines/route.ts
 │   │       └── categories/route.ts
 │   └── trm/                          [신규] TRM 페이지
 │       ├── layout.tsx                - 공통 레이아웃 + 상단 메뉴
 │       ├── target-products/
 │       │   ├── page.tsx              - 목록 (Server Component)
 │       │   ├── new/page.tsx          - 생성 폼
 │       │   └── [id]/edit/page.tsx    - 수정 폼
 │       ├── tech-secure-plans/
 │       │   ├── page.tsx
 │       │   ├── new/page.tsx
 │       │   └── [id]/edit/page.tsx
 │       ├── target-product-lines/     - [2단계] 플레이스홀더
 │       │   └── page.tsx
 │       ├── category-system/          - [2단계] 플레이스홀더
 │       │   └── page.tsx
 │       └── product-line-plan-map/    - [2단계] 플레이스홀더
 │           └── page.tsx
 └── components/
     └── trm/                          [신규] TRM 컴포넌트
         ├── Navigation.tsx            - 5개 메뉴 탭
         ├── common/
         │   ├── DataTable.tsx         - 재사용 테이블
         │   └── SelectField.tsx       - 외래키 드롭다운
         ├── target-products/
         │   ├── TargetProductList.tsx - 목록 (Client Component)
         │   └── TargetProductForm.tsx - 폼 (생성/수정)
         └── tech-secure-plans/
             ├── TechSecurePlanList.tsx
             └── TechSecurePlanForm.tsx

 🎯 핵심 파일 상세 설명

 1. 타입 정의 레이어 (src/lib/types/)

 common.types.ts
 - ApiResponse<T>: 모든 API 응답 래퍼 ({ success, data?, error? })
 - HTTP 공통 타입

 targetProduct.types.ts
 - CreateTargetProductDto: 생성 요청 DTO
 - UpdateTargetProductDto: 수정 요청 DTO
 - TargetProductResponseDto: 응답 DTO (관계 포함)
 - TargetProductListItemDto: 목록 표시용 DTO

 techSecurePlan.types.ts
 - 동일한 패턴으로 기술확보계획용 DTO 정의

 2. 서비스 레이어 (src/lib/services/)

 targetProduct.service.ts
 class TargetProductService {
   async findAll(): Promise<TargetProductListItemDto[]>
   async findById(id: number): Promise<TargetProductResponseDto | null>
   async create(data: CreateTargetProductDto): Promise<TargetProductResponseDto>
   async update(id: number, data: UpdateTargetProductDto): Promise<TargetProductResponseDto>
   async delete(id: number): Promise<void>
 }

 핵심 로직:
 - Prisma를 통한 DB 작업
 - 외래키 존재 검증 (productLine 존재 확인)
 - 날짜 변환 (ISO string ↔ Date 객체)
 - DTO 변환 (Prisma 타입 → Response DTO)

 techSecurePlan.service.ts
 - 동일한 패턴
 - 삭제 시 교차테이블 참조 확인 (참조되면 삭제 불가)

 3. API Routes (src/app/api/)

 target-products/route.ts
 - GET /api/target-products: 전체 조회
 - POST /api/target-products: 생성

 target-products/[id]/route.ts
 - GET /api/target-products/[id]: 단건 조회
 - PUT /api/target-products/[id]: 수정
 - DELETE /api/target-products/[id]: 삭제

 패턴:
 export async function GET() {
   try {
     const data = await targetProductService.findAll();
     return successResponse(data);
   } catch (error) {
     return errorResponse(handlePrismaError(error));
   }
 }

 reference-data/ API:
 - GET /api/reference-data/product-lines: 드롭다운용 제품군 목록
 - GET /api/reference-data/categories: 드롭다운용 분류 목록

 4. UI 컴포넌트

 Navigation.tsx (Client Component)
 - 5개 메뉴 탭: Target Products, Tech Secure Plans, Target Product Lines, Category System, Product Line Plan Map
 - 처음 2개만 활성화, 나머지는 "Coming Soon"
 - 현재 경로 강조 표시

 DataTable.tsx (재사용 가능한 제네릭 테이블)
 - 컬럼 정의, 데이터 렌더링
 - View/Edit/Delete 액션 버튼
 - 빈 데이터 처리

 SelectField.tsx (외래키 드롭다운)
 - API에서 참조 데이터 fetch
 - 라벨 + 값 표시 (예: "Division - Product Line")

 TargetProductForm.tsx (Client Component)
 - 생성/수정 모드 지원
 - 제품군 드롭다운 (API에서 로드)
 - 날짜 선택기
 - 유효성 검사 + 에러 표시

 TargetProductList.tsx (Client Component)
 - DataTable 사용
 - 삭제 확인 다이얼로그
 - 클라이언트 상태 관리

 5. 페이지 (Server Components)

 trm/layout.tsx
 - TRM 공통 헤더 ("TRM Management System")
 - Navigation 컴포넌트 포함
 - 컨테이너 레이아웃

 trm/target-products/page.tsx
 export default async function TargetProductsPage() {
   const products = await targetProductService.findAll();
   return (
     <div>
       <h2>Target Products</h2>
       <Link href="/trm/target-products/new">Create New</Link>
       <TargetProductList initialData={products} />
     </div>
   );
 }

 데이터 흐름:
 1. Server Component에서 서비스 호출 (서버 사이드)
 2. 초기 데이터를 Client Component에 props로 전달
 3. Client Component에서 상호작용 (삭제 등)은 API Routes 호출

 🔄 데이터 흐름 예시

 목록 조회

 사용자 → /trm/target-products (Server Component)
   → targetProductService.findAll()
   → Prisma.target_product.findMany({ include: { productLine } })
   → PostgreSQL
   → DTO 변환
   → <TargetProductList initialData={products} />
   → 화면 렌더링

 데이터 생성

 사용자 → 폼 입력 → Submit
   → POST /api/target-products (API Route)
   → targetProductService.create(dto)
   → 외래키 검증 (productLine 존재 확인)
   → Prisma.target_product.create()
   → PostgreSQL
   → successResponse(product)
   → router.push('/trm/target-products')

 데이터 삭제

 사용자 → Delete 버튼 → 확인
   → DELETE /api/target-products/[id]
   → targetProductService.delete(id)
   → Prisma.target_product.delete()
   → 로컬 상태 업데이트
   → router.refresh()

 📝 구현 순서

 Phase 1: 기초 인프라 (10개 파일)

 1. src/lib/utils/apiResponse.ts - API 응답 헬퍼
 2. src/lib/utils/errorHandler.ts - Prisma 에러 처리
 3. src/lib/constants/routes.ts - 라우트 상수
 4. src/lib/types/common.types.ts - 공통 타입
 5. src/lib/types/targetProduct.types.ts - 타겟제품군 타입
 6. src/lib/types/techSecurePlan.types.ts - 기술확보계획 타입

 Phase 2: 서비스 레이어 (2개 파일)

 7. src/lib/services/targetProduct.service.ts - 타겟제품군 서비스
 8. src/lib/services/techSecurePlan.service.ts - 기술확보계획 서비스

 Phase 3: API Routes (6개 파일)

 9. src/app/api/target-products/route.ts - GET all, POST
 10. src/app/api/target-products/[id]/route.ts - GET one, PUT, DELETE
 11. src/app/api/tech-secure-plans/route.ts - GET all, POST
 12. src/app/api/tech-secure-plans/[id]/route.ts - GET one, PUT, DELETE
 13. src/app/api/reference-data/product-lines/route.ts - 드롭다운 데이터
 14. src/app/api/reference-data/categories/route.ts - 드롭다운 데이터

 Phase 4: 공통 컴포넌트 (3개 파일)

 15. src/components/trm/Navigation.tsx - 상단 메뉴
 16. src/components/trm/common/DataTable.tsx - 재사용 테이블
 17. src/components/trm/common/SelectField.tsx - 드롭다운 필드

 Phase 5: 타겟제품군 기능 (5개 파일)

 18. src/app/trm/layout.tsx - TRM 레이아웃
 19. src/components/trm/target-products/TargetProductForm.tsx - 폼
 20. src/components/trm/target-products/TargetProductList.tsx - 목록
 21. src/app/trm/target-products/page.tsx - 목록 페이지
 22. src/app/trm/target-products/new/page.tsx - 생성 페이지
 23. src/app/trm/target-products/[id]/edit/page.tsx - 수정 페이지

 Phase 6: 기술확보계획 기능 (5개 파일)

 24. src/components/trm/tech-secure-plans/TechSecurePlanForm.tsx - 폼
 25. src/components/trm/tech-secure-plans/TechSecurePlanList.tsx - 목록
 26. src/app/trm/tech-secure-plans/page.tsx - 목록 페이지
 27. src/app/trm/tech-secure-plans/new/page.tsx - 생성 페이지
 28. src/app/trm/tech-secure-plans/[id]/edit/page.tsx - 수정 페이지

 Phase 7: 플레이스홀더 페이지 (3개 파일)

 29. src/app/trm/target-product-lines/page.tsx - "Coming Soon"
 30. src/app/trm/category-system/page.tsx - "Coming Soon"
 31. src/app/trm/product-line-plan-map/page.tsx - "Coming Soon"

 총 31개 파일 생성

 🧪 검증 방법

 1. API 테스트

 # 서버 실행
 npm run dev

 # 타겟제품군 목록 조회
 curl http://localhost:3000/api/target-products

 # 제품군 참조 데이터 조회
 curl http://localhost:3000/api/reference-data/product-lines

 # 분류 참조 데이터 조회
 curl http://localhost:3000/api/reference-data/categories

 2. UI 테스트 시나리오

 타겟제품군 (Target_Product):
 1. http://localhost:3000/trm/target-products 접속
 2. "Create New Product" 버튼 클릭
 3. 폼 입력:
   - Product Name: "신제품 A"
   - Product Line: 드롭다운에서 선택
   - Deployment Date: 날짜 선택
 4. "Create" 버튼 클릭 → 목록으로 리다이렉트 확인
 5. 목록에서 새 항목 확인
 6. "Edit" 버튼 클릭 → 수정 폼에서 데이터 확인
 7. 이름 수정 후 "Update" 클릭
 8. "Delete" 버튼 클릭 → 확인 다이얼로그 → 삭제 확인

 기술확보계획 (Tech_Secure_Plan):
 1. 상단 메뉴에서 "Tech Secure Plans" 탭 클릭
 2. 동일한 CRUD 플로우 테스트
 3. Category 드롭다운 동작 확인

 네비게이션:
 1. 5개 메뉴 탭 모두 표시 확인
 2. 처음 2개만 클릭 가능, 나머지는 "Coming Soon" 표시
 3. 현재 탭 강조 표시 확인

 3. 엣지 케이스 테스트

 - 존재하지 않는 외래키로 생성 시도 → 에러 표시
 - 필수 필드 누락 → 유효성 검사 에러
 - 존재하지 않는 ID로 조회/수정/삭제 → 404 에러
 - 교차테이블에서 참조되는 Tech Plan 삭제 시도 → 에러 메시지

 🎨 UI/UX 특징

 - Tailwind CSS 사용
 - 반응형 디자인: 컨테이너, 그리드 레이아웃
 - 색상 스키마:
   - Primary: Blue (버튼, 링크, 활성 탭)
   - Gray: 배경, 테두리, 비활성 요소
   - Red: 삭제, 에러 메시지
 - 인터랙션:
   - Hover 효과
   - Loading 상태
   - 확인 다이얼로그
   - 에러 메시지 표시

 🔐 데이터 검증

 서비스 레이어에서 검증

 1. 외래키 검증: 생성/수정 전 참조 테이블 존재 확인
 2. 존재 검증: 수정/삭제 전 엔티티 존재 확인
 3. 관계 검증: 삭제 시 자식 레코드 확인

 API 레이어에서 검증

 1. 타입 검증: ID가 숫자인지 확인
 2. 필수 필드: 누락된 필드 확인
 3. 에러 응답: 일관된 에러 포맷

 📊 주요 기술 결정

 1. Server Component 우선: 초기 데이터는 서버에서 fetch
 2. Client Component 최소화: 인터랙션 필요한 부분만
 3. Service Layer 패턴: API Routes는 얇게, 로직은 서비스에
 4. DTO 변환: Prisma 타입과 API 타입 명확히 분리
 5. 재사용 가능한 컴포넌트: DataTable, SelectField 등
 6. 타입 안전성: TypeScript 엄격하게 활용

 🚀 다음 단계 (2단계)

 1. 나머지 3개 테이블 구현
 2. 교차테이블 UI (다대다 관계 관리)
 3. Category_System 계층 구조 UI (트리 뷰)
 4. 페이지네이션
 5. 검색/필터링
 6. 정렬 기능
 7. 데이터 Export (CSV)

 ---
 ✅ 구현 완료 조건

 - 모든 31개 파일 생성
 - TypeScript 컴파일 에러 없음
 - npm run dev 실행 성공
 - /trm/target-products 접속 성공
 - 타겟제품군 CRUD 모두 동작
 - 기술확보계획 CRUD 모두 동작
 - 5개 메뉴 탭 표시 확인
 - 외래키 드롭다운 정상 동작
 - 에러 처리 정상 동작
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 Would you like to proceed?

 ❯ 1. Yes, clear context and auto-accept edits (shift+tab)
   2. Yes, auto-accept edits
   3. Yes, manually approve edits
   4. Type here to tell Claude what to change

   --
  ★ 인사이트 ─────────────────────────────────────
  DTO 패턴의 중요성: Database 모델(Prisma)과 API 응답 타입을 분리하면 프론트엔드와 백엔드의 계약을 명확히 할 수 있습니다. 예를 들어 DB에는 target_product_line_id만 있지만, API 응답에서는   
  전체 productLine 객체를 포함시켜 클라이언트가 추가 요청 없이 모든 정보를 얻을 수 있습니다.
  ─────────────────────────────────────────────────

  ● ★ 인사이트 ─────────────────────────────────────
  서비스 레이어 패턴: API Routes를 얇게 유지하고 비즈니스 로직을 서비스에 집중시키면 테스트가 쉽고, 같은 로직을 여러 곳에서 재사용할 수 있습니다. 예를 들어 Server Component와 API Route 모두
   같은 서비스를 호출할 수 있습니다.
  ─────────────────────────────────────────────────
 ★ 인사이트 ─────────────────────────────────────
  Next.js App Router의 파일 규칙: route.ts는 API 엔드포인트를 정의하고, 폴더 이름이 URL 경로가 됩니다. [id] 폴더는 동적 라우트로, URL의 해당 부분을 파라미터로 받을 수 있습니다. 각 HTTP     
  메서드(GET, POST, PUT, DELETE)는 별도의 export 함수로 정의됩니다.
  ─────────────────────────────────────────────────

  
● ★ 인사이트 ─────────────────────────────────────
  Layout과 Server Component의 조합: Next.js의 layout은 중첩된 페이지에 공통 UI를 제공합니다. Navigation을 layout에 넣으면 모든 TRM 페이지가 자동으로 상단 메뉴를 갖게 됩니다. 또한 layout은  
  Server Component이므로 초기 로딩이 빠릅니다.
  ─────────────────────────────────────────────────