'use client';

import { useState } from 'react';
import DataTable, { Column, DataTableAction } from '../common/DataTable';
import { CategorySystemListItemDto } from '@/lib/types/categorySystem.types';
import { ROUTES } from '@/lib/constants/routes';
import { useOptimisticDelete } from '@/lib/hooks/useOptimisticDelete';

interface CategorySystemListProps {
  initialData: CategorySystemListItemDto[];
}

export default function CategorySystemList({ initialData }: CategorySystemListProps) {
  const [categories, setCategories] = useState(initialData);

  const { handleDelete, isPending, isDeleting } = useOptimisticDelete({
    items: categories,
    setItems: setCategories,
    getItemId: (cat) => cat.category_id,
    getItemName: (cat) => cat.tech_name,
    deleteEndpoint: (cat) => ROUTES.API.CATEGORY_SYSTEM.BY_ID(cat.category_id),
  });

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
      <div className={isPending ? 'opacity-70 pointer-events-none' : ''}>
        <DataTable columns={columns} data={categories} actions={actions} emptyMessage="등록된 카테고리가 없습니다" getRowKey={(c) => c.category_id} />
      </div>
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl"><p className="text-gray-900">삭제 중...</p></div>
        </div>
      )}
    </div>
  );
}
