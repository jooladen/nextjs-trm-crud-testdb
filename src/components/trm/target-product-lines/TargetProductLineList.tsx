'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, DataTableAction } from '../common/DataTable';
import { TargetProductLineListItemDto } from '@/lib/types/targetProductLine.types';
import { ROUTES } from '@/lib/constants/routes';

interface TargetProductLineListProps {
  initialData: TargetProductLineListItemDto[];
}

export default function TargetProductLineList({ initialData }: TargetProductLineListProps) {
  const [productLines, setProductLines] = useState(initialData);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (line: TargetProductLineListItemDto) => {
    if (!confirm(`"${line.target_product_line}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(
        ROUTES.API.TARGET_PRODUCT_LINES.BY_ID(line.target_product_line_id),
        { method: 'DELETE' }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '삭제에 실패했습니다');
      }

      setProductLines((prev) =>
        prev.filter((p) => p.target_product_line_id !== line.target_product_line_id)
      );

      alert('삭제되었습니다');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다');
    } finally {
      setIsDeleting(false);
    }
  };

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
      <DataTable
        columns={columns}
        data={productLines}
        actions={actions}
        emptyMessage="등록된 제품군 라인이 없습니다"
        getRowKey={(line) => line.target_product_line_id}
      />

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
