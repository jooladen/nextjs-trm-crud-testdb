/**
 * 타겟제품군 생성 페이지
 */

import TargetProductForm from '@/components/trm/target-products/TargetProductForm';

export const metadata = {
  title: '새 타겟제품군 등록 | TRM',
  description: '새로운 타겟제품군을 등록합니다',
};

export default function NewTargetProductPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">새 타겟제품군 등록</h2>
        <p className="mt-1 text-sm text-gray-600">
          새로운 타겟제품군 정보를 입력하세요
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <TargetProductForm mode="create" />
      </div>
    </div>
  );
}
