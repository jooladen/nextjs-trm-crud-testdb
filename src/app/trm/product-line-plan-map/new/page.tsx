import ProductLinePlanMapForm from '@/components/trm/product-line-plan-map/ProductLinePlanMapForm';

export const metadata = {
  title: '새 매핑 등록 | TRM',
};

export default function NewProductLinePlanMapPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">새 매핑 등록</h2>
        <p className="mt-1 text-sm text-gray-600">제품군 라인과 기술계획을 연결하세요</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <ProductLinePlanMapForm />
      </div>
    </div>
  );
}
