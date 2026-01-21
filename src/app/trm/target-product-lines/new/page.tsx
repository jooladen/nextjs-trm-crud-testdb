import TargetProductLineForm from '@/components/trm/target-product-lines/TargetProductLineForm';

export const metadata = {
  title: '새 제품군 라인 등록 | TRM',
  description: '새로운 제품군 라인을 등록합니다',
};

export default function NewTargetProductLinePage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">새 제품군 라인 등록</h2>
        <p className="mt-1 text-sm text-gray-600">
          새로운 제품군 라인 정보를 입력하세요
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <TargetProductLineForm mode="create" />
      </div>
    </div>
  );
}
