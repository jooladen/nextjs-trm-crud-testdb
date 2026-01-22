'use client';

/**
 * 타겟제품군 목록 컴포넌트
 * 목록 표시 및 삭제 기능 제공
 */

import { useState } from 'react';
import DataTable, { Column, DataTableAction } from '../common/DataTable';
import { TargetProductListItemDto } from '@/lib/types/targetProduct.types';
import { ROUTES } from '@/lib/constants/routes';
import { useOptimisticDelete } from '@/lib/hooks/useOptimisticDelete';

interface TargetProductListProps {
  initialData: TargetProductListItemDto[];
}

export default function TargetProductList({ initialData }: TargetProductListProps) {
  const [products, setProducts] = useState(initialData);

  const { handleDelete, isPending, isDeleting } = useOptimisticDelete({
    items: products,
    setItems: setProducts,
    getItemId: (p) => p.target_product_id,
    getItemName: (p) => p.target_product_name,
    deleteEndpoint: (p) => ROUTES.API.TARGET_PRODUCTS.BY_ID(p.target_product_id),
  });

  // 테이블 컬럼 정의
  const columns: Column<TargetProductListItemDto>[] = [
    {
      key: 'target_product_id',
      label: 'ID',
    },
    {
      key: 'target_product_name',
      label: '제품명',
    },
    {
      key: 'productLine',
      label: '제품군',
      render: (product) =>
        `${product.productLine.target_division} - ${product.productLine.target_product_line}`,
    },
    {
      key: 'deployment_date',
      label: '배치일',
      render: (product) => new Date(product.deployment_date).toLocaleDateString('ko-KR'),
    },
  ];

  // 테이블 액션 정의
  const actions: DataTableAction<TargetProductListItemDto>[] = [
    {
      label: '보기',
      href: (product) =>
        ROUTES.TRM.TARGET_PRODUCTS.EDIT(product.target_product_id),
      variant: 'secondary',
    },
    {
      label: '수정',
      href: (product) =>
        ROUTES.TRM.TARGET_PRODUCTS.EDIT(product.target_product_id),
      variant: 'primary',
    },
    {
      label: '삭제',
      onClick: handleDelete,
      variant: 'danger',
    },
  ];

  return (
    <div>
      <div className={isPending ? 'opacity-70 pointer-events-none' : ''}>
        <DataTable
          columns={columns}
          data={products}
          actions={actions}
          emptyMessage="등록된 타겟제품군이 없습니다"
          getRowKey={(product) => product.target_product_id}
        />
      </div>

      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <p className="text-gray-900">삭제 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}
