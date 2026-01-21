/**
 * 타겟제품군 목록 페이지 (Server Component)
 * 서버에서 데이터를 fetch하여 클라이언트 컴포넌트에 전달
 */

import Link from 'next/link';
import { targetProductService } from '@/lib/services/targetProduct.service';
import TargetProductList from '@/components/trm/target-products/TargetProductList';
import { ROUTES } from '@/lib/constants/routes';

export const metadata = {
  title: '타겟제품군 목록 | TRM',
  description: '타겟제품군 관리 페이지',
};

export default async function TargetProductsPage() {
  // 서버에서 데이터 fetch
  const products = await targetProductService.findAll();

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">타겟제품군</h2>
          <p className="mt-1 text-sm text-gray-600">
            타겟제품군을 조회하고 관리합니다
          </p>
        </div>
        <Link
          href={ROUTES.TRM.TARGET_PRODUCTS.NEW}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + 새 제품 등록
        </Link>
      </div>

      {/* 통계 */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-600">전체 제품</p>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
      </div>

      {/* 목록 */}
      <TargetProductList initialData={products} />
    </div>
  );
}
