import { notFound } from 'next/navigation';
import { categorySystemService } from '@/lib/services/categorySystem.service';
import CategorySystemForm from '@/components/trm/category-system/CategorySystemForm';
import { NotFoundError } from '@/lib/utils/errorHandler';

export default async function EditCategorySystemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catId = Number(id);
  if (isNaN(catId)) notFound();

  let category;
  try {
    category = await categorySystemService.findById(catId);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">카테고리 수정 #{category.category_id}</h2>
        <p className="mt-1 text-sm text-gray-600">카테고리 정보를 수정하세요</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <CategorySystemForm mode="edit" initialData={category} />
      </div>
    </div>
  );
}
