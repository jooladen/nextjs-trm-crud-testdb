/**
 * 📖 학습 포인트 1: Server Component
 *
 * 이 파일은 "Server Component"입니다.
 * Server Component는 서버에서만 실행됩니다.
 *
 * 🤔 왜 Server Component를 쓸까요?
 * - 보안: API 키 같은 비밀 정보를 숨길 수 있어요
 * - 속도: 서버가 미리 HTML을 만들어서 보내줍니다
 * - SEO: 검색 엔진이 내용을 읽을 수 있어요
 *
 * 🔍 여기서 배울 것:
 * 1. async/await로 데이터 가져오기
 * 2. serverFetch 사용법
 * 3. Props로 데이터 전달하기
 */

import Link from 'next/link';
import TargetProductList from '@/components/trm/target-products/TargetProductList';
import { ROUTES } from '@/lib/constants/routes';
import { serverFetch } from '@/lib/utils/serverFetch';
import { TargetProductListItemDto } from '@/lib/types/targetProduct.types';

// 메타데이터: 브라우저 탭에 표시되는 제목과 설명
export const metadata = {
  title: '타겟제품군 목록 | TRM',
  description: '타겟제품군 관리 페이지',
};

// 💡 주목! async 함수입니다! (Server Component만 가능)
export default async function TargetProductsPage() {
  // 💡 Step 1: 서버에서 데이터 가져오기
  // serverFetch는 내부 API를 호출하는 유틸리티 함수입니다
  // 📍 실행 위치: 서버 (브라우저 X)
  // ⏰ 타이밍: 페이지 요청 시 딱 한 번
  const products = await serverFetch<TargetProductListItemDto[]>(
    ROUTES.API.TARGET_PRODUCTS.BASE
  );

  // 💡 Step 2: HTML 생성 및 반환
  // 서버에서 완성된 HTML을 만들어서 브라우저로 보냅니다
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">타겟제품</h2>
          <p className="mt-1 text-sm text-gray-600">
            타겟제품을 조회하고 관리합니다
          </p>
        </div>
        {/* 💡 Link: Next.js의 클라이언트 사이드 네비게이션 */}
        <Link
          href={ROUTES.TRM.TARGET_PRODUCTS.NEW}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + 새 제품 등록
        </Link>
      </div>

      {/* 통계 - 서버에서 계산한 값 표시 */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-600">전체 제품</p>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
      </div>

      {/* 💡 Step 3: Client Component에 데이터 전달 */}
      {/* initialData로 서버에서 가져온 데이터를 넘겨줍니다 */}
      {/* TargetProductList는 'use client' 컴포넌트입니다 */}
      <TargetProductList initialData={products} />
    </div>
  );
}

/**
 * 🎓 이 파일에서 배운 것:
 *
 * ✅ Server Component는 async 함수로 만들 수 있다
 * ✅ await로 데이터를 가져올 수 있다 (브라우저에서는 불가능!)
 * ✅ serverFetch로 내부 API를 호출한다
 * ✅ Client Component에 Props로 데이터를 전달한다
 * ✅ 서버에서 완성된 HTML을 만들어서 보낸다
 *
 * 💡 다음 파일:
 * TargetProductList.tsx를 보면 Client Component가 어떻게 작동하는지 알 수 있어요!
 */
