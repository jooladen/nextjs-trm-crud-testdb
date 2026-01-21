'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable, { Column, DataTableAction } from '../common/DataTable';
import { CategorySystemListItemDto } from '@/lib/types/categorySystem.types';
import { ROUTES } from '@/lib/constants/routes';

interface CategorySystemListProps {
  initialData: CategorySystemListItemDto[];
}

export default function CategorySystemList({ initialData }: CategorySystemListProps) {
  const [categories, setCategories] = useState(initialData);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (cat: CategorySystemListItemDto) => {
    if (!confirm(`"${cat.tech_name}"을(를) 삭제하시겠습니까?`)) return;

    try {
      setIsDeleting(true);
      const response = await fetch(ROUTES.API.CATEGORY_SYSTEM.BY_ID(cat.category_id), { method: 'DELETE' });
      const result = await response.json();

      if (!result.success) throw new Error(result.error || '삭제에 실패했습니다');

      setCategories((prev) => prev.filter((c) => c.category_id !== cat.category_id));
      alert('삭제되었습니다');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<CategorySystemListItemDto>[] = [
    { key: 'category_id', label: 'ID' },
    { key: 'tech_name', label: '기술명' },
    { key: 'category_level', label: '레벨', render: (c) => `Level ${c.category_level}` },
    { key: 'parentName', label: '상위 카테고리', render: (c) => c.parentName || '-' },
    { key: 'childCount', label: '하위 카테고리', render: (c) => `${c.childCount}개` },
    { key: 'planCount', label: '기술계획', render: (c) => `${c.planCount}개` },
  ];

  const actions: DataTableAction<CategorySystemListItemDto>[] = [
    { label: '수정', href: (c) => ROUTES.TRM.CATEGORY_SYSTEM.EDIT(c.category_id), variant: 'primary' },
    { label: '삭제', onClick: handleDelete, variant: 'danger' },
  ];

  return (
    <div>
      <DataTable columns={columns} data={categories} actions={actions} emptyMessage="등록된 카테고리가 없습니다" getRowKey={(c) => c.category_id} />
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl"><p className="text-gray-900">삭제 중...</p></div>
        </div>
      )}
    </div>
  );
}
