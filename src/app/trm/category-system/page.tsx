import Link from 'next/link';
import { categorySystemService } from '@/lib/services/categorySystem.service';
import CategorySystemList from '@/components/trm/category-system/CategorySystemList';
import { ROUTES } from '@/lib/constants/routes';

export const metadata = {
  title: '카테고리 시스템 | TRM',
  description: '카테고리 시스템 관리 페이지',
};

export default async function CategorySystemPage() {
  const categories = await categorySystemService.findAll();

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">카테고리 시스템</h2>
          <p className="mt-1 text-sm text-gray-600">
            카테고리를 조회하고 관리합니다
          </p>
        </div>
        <Link
          href={ROUTES.TRM.CATEGORY_SYSTEM.NEW}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          + 새 카테고리 등록
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-600">전체 카테고리</p>
          <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
        </div>
      </div>

      <CategorySystemList initialData={categories} />
    </div>
  );
}
