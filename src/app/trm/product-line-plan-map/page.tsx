import Link from 'next/link';
import { productLinePlanMapService } from '@/lib/services/productLinePlanMap.service';
import ProductLinePlanMapList from '@/components/trm/product-line-plan-map/ProductLinePlanMapList';
import { ROUTES } from '@/lib/constants/routes';

export const metadata = {
  title: '제품군-계획 매핑 | TRM',
};

export default async function ProductLinePlanMapPage() {
  const maps = await productLinePlanMapService.findAll();

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">제품군-계획 매핑</h2>
          <p className="mt-1 text-sm text-gray-600">제품군과 기술계획의 매핑을 관리합니다</p>
        </div>
        <Link
          href={ROUTES.TRM.PRODUCT_LINE_PLAN_MAP.NEW}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          + 새 매핑 등록
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-600">전체 매핑</p>
          <p className="text-2xl font-bold text-gray-900">{maps.length}</p>
        </div>
      </div>

      <ProductLinePlanMapList initialData={maps} />
    </div>
  );
}
