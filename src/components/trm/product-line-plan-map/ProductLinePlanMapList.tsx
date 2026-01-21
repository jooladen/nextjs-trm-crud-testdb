'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, DataTableAction } from '../common/DataTable';
import { ProductLinePlanMapListItemDto } from '@/lib/types/productLinePlanMap.types';
import { ROUTES } from '@/lib/constants/routes';

interface ProductLinePlanMapListProps {
  initialData: ProductLinePlanMapListItemDto[];
}

export default function ProductLinePlanMapList({ initialData }: ProductLinePlanMapListProps) {
  const [maps, setMaps] = useState(initialData);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (map: ProductLinePlanMapListItemDto) => {
    if (!confirm(`"${map.productLineName} ↔ ${map.planName}" 매핑을 삭제하시겠습니까?`)) return;

    try {
      setIsDeleting(true);
      const id = `${map.target_product_line_id}-${map.plan_key}`;
      const response = await fetch(`/api/product-line-plan-map/${id}`, { method: 'DELETE' });
      const result = await response.json();

      if (!result.success) throw new Error(result.error || '삭제에 실패했습니다');

      setMaps((prev) => prev.filter((m) =>
        !(m.target_product_line_id === map.target_product_line_id && m.plan_key === map.plan_key)
      ));
      alert('삭제되었습니다');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<ProductLinePlanMapListItemDto>[] = [
    { key: 'productLineName', label: '제품군 라인' },
    { key: 'planName', label: '기술계획' },
  ];

  const actions: DataTableAction<ProductLinePlanMapListItemDto>[] = [
    { label: '삭제', onClick: handleDelete, variant: 'danger' },
  ];

  return (
    <div>
      <DataTable columns={columns} data={maps} actions={actions} emptyMessage="등록된 매핑이 없습니다" getRowKey={(m) => `${m.target_product_line_id}-${m.plan_key}`} />
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl"><p className="text-gray-900">삭제 중...</p></div>
        </div>
      )}
    </div>
  );
}
