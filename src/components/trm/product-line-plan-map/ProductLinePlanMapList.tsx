'use client';

import { useState } from 'react';
import DataTable, { Column, DataTableAction } from '../common/DataTable';
import { ProductLinePlanMapListItemDto } from '@/lib/types/productLinePlanMap.types';
import { ROUTES } from '@/lib/constants/routes';
import { useOptimisticDelete } from '@/lib/hooks/useOptimisticDelete';

interface ProductLinePlanMapListProps {
  initialData: ProductLinePlanMapListItemDto[];
}

export default function ProductLinePlanMapList({ initialData }: ProductLinePlanMapListProps) {
  const [maps, setMaps] = useState(initialData);

  const { handleDelete, isPending, isDeleting } = useOptimisticDelete({
    items: maps,
    setItems: setMaps,
    getItemId: (map) => `${map.target_product_line_id}-${map.plan_key}`,
    getItemName: (map) => `${map.productLineName} ↔ ${map.planName}`,
    deleteEndpoint: (map) => `/api/product-line-plan-map/${map.target_product_line_id}-${map.plan_key}`,
  });

  const columns: Column<ProductLinePlanMapListItemDto>[] = [
    { key: 'productLineName', label: '제품군 라인' },
    { key: 'planName', label: '기술계획' },
  ];

  const actions: DataTableAction<ProductLinePlanMapListItemDto>[] = [
    { label: '삭제', onClick: handleDelete, variant: 'danger' },
  ];

  return (
    <div>
      <div className={isPending ? 'opacity-70 pointer-events-none' : ''}>
        <DataTable columns={columns} data={maps} actions={actions} emptyMessage="등록된 매핑이 없습니다" getRowKey={(m) => `${m.target_product_line_id}-${m.plan_key}`} />
      </div>
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl"><p className="text-gray-900">삭제 중...</p></div>
        </div>
      )}
    </div>
  );
}
