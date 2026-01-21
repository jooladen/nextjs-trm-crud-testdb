/**
 * 타겟제품군 수정 페이지 (Server Component)
 * 서버에서 기존 데이터를 fetch하여 폼에 전달
 */

import { notFound } from 'next/navigation';
import { targetProductService } from '@/lib/services/targetProduct.service';
import TargetProductForm from '@/components/trm/target-products/TargetProductForm';
import { NotFoundError } from '@/lib/utils/errorHandler';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `타겟제품군 수정 #${id} | TRM`,
    description: '타겟제품군 정보를 수정합니다',
  };
}

export default async function EditTargetProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) {
    notFound();
  }

  // 서버에서 데이터 fetch
  let product;
  try {
    product = await targetProductService.findById(productId);
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
          타겟제품군 수정 #{product.target_product_id}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          타겟제품군 정보를 수정하세요
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <TargetProductForm mode="edit" initialData={product} />
      </div>
    </div>
  );
}
