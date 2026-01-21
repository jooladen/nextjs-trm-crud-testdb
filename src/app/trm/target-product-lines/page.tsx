import Link from 'next/link';
import { targetProductLineService } from '@/lib/services/targetProductLine.service';
import TargetProductLineList from '@/components/trm/target-product-lines/TargetProductLineList';
import { ROUTES } from '@/lib/constants/routes';

export const metadata = {
  title: '타겟제품군 라인 | TRM',
  description: '타겟제품군 라인 관리 페이지',
};

export default async function TargetProductLinesPage() {
  const productLines = await targetProductLineService.findAll();

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">타겟제품군 라인</h2>
          <p className="mt-1 text-sm text-gray-600">
            제품군 라인을 조회하고 관리합니다
          </p>
        </div>
        <Link
          href={ROUTES.TRM.TARGET_PRODUCT_LINES.NEW}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          + 새 제품군 라인 등록
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-600">전체 제품군 라인</p>
          <p className="text-2xl font-bold text-gray-900">{productLines.length}</p>
        </div>
      </div>

      <TargetProductLineList initialData={productLines} />
    </div>
  );
}
