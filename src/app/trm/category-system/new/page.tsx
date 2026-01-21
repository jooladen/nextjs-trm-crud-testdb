import CategorySystemForm from '@/components/trm/category-system/CategorySystemForm';

export const metadata = {
  title: '새 카테고리 등록 | TRM',
};

export default function NewCategorySystemPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">새 카테고리 등록</h2>
        <p className="mt-1 text-sm text-gray-600">새로운 카테고리 정보를 입력하세요</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <CategorySystemForm mode="create" />
      </div>
    </div>
  );
}
