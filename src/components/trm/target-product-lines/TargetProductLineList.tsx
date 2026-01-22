'use client';

import { useState } from 'react';
import DataTable, { Column, DataTableAction } from '../common/DataTable';
import { TargetProductLineListItemDto } from '@/lib/types/targetProductLine.types';
import { ROUTES } from '@/lib/constants/routes';
import { useOptimisticDelete } from '@/lib/hooks/useOptimisticDelete';

interface TargetProductLineListProps {
  initialData: TargetProductLineListItemDto[];
}

export default function TargetProductLineList({ initialData }: TargetProductLineListProps) {
  const [productLines, setProductLines] = useState(initialData);

  const { handleDelete, isPending, isDeleting } = useOptimisticDelete({
    items: productLines,
    setItems: setProductLines,
    getItemId: (line) => line.target_product_line_id,
    getItemName: (line) => line.target_product_line,
    deleteEndpoint: (line) => ROUTES.API.TARGET_PRODUCT_LINES.BY_ID(line.target_product_line_id),
  });

  const columns: Column<TargetProductLineListItemDto>[] = [
    { key: 'target_product_line_id', label: 'ID' },
    { key: 'target_division', label: '사업부' },
    { key: 'target_product_line', label: '제품군 라인' },
    { key: 'productCount', label: '제품 수', render: (line) => `${line.productCount}개` },
  ];

  const actions: DataTableAction<TargetProductLineListItemDto>[] = [
    {
      label: '수정',
      href: (line) => ROUTES.TRM.TARGET_PRODUCT_LINES.EDIT(line.target_product_line_id),
      variant: 'primary',
    },
    { label: '삭제', onClick: handleDelete, variant: 'danger' },
  ];

  return (
    <div>
      <div className={isPending ? 'opacity-70 pointer-events-none' : ''}>
        <DataTable
          columns={columns}
          data={productLines}
          actions={actions}
          emptyMessage="등록된 제품군 라인이 없습니다"
          getRowKey={(line) => line.target_product_line_id}
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
