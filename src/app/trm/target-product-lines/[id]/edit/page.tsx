import { notFound } from 'next/navigation';
import { targetProductLineService } from '@/lib/services/targetProductLine.service';
import TargetProductLineForm from '@/components/trm/target-product-lines/TargetProductLineForm';
import { NotFoundError } from '@/lib/utils/errorHandler';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `제품군 라인 수정 #${id} | TRM`,
    description: '제품군 라인 정보를 수정합니다',
  };
}

export default async function EditTargetProductLinePage({ params }: PageProps) {
  const { id } = await params;
  const lineId = Number(id);

  if (isNaN(lineId)) {
    notFound();
  }

  let productLine;
  try {
    productLine = await targetProductLineService.findById(lineId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          제품군 라인 수정 #{productLine.target_product_line_id}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          제품군 라인 정보를 수정하세요
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <TargetProductLineForm mode="edit" initialData={productLine} />
      </div>
    </div>
  );
}
