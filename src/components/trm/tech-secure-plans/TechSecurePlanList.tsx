'use client';

/**
 * 기술확보계획 목록 컴포넌트
 * 목록 표시 및 삭제 기능 제공
 */

import { useState } from 'react';
import DataTable, { Column, DataTableAction } from '../common/DataTable';
import { TechSecurePlanListItemDto } from '@/lib/types/techSecurePlan.types';
import { ROUTES } from '@/lib/constants/routes';
import { useOptimisticDelete } from '@/lib/hooks/useOptimisticDelete';

interface TechSecurePlanListProps {
  initialData: TechSecurePlanListItemDto[];
}

export default function TechSecurePlanList({ initialData }: TechSecurePlanListProps) {
  const [plans, setPlans] = useState(initialData);

  const { handleDelete, isPending, isDeleting } = useOptimisticDelete({
    items: plans,
    setItems: setPlans,
    getItemId: (plan) => plan.plan_key,
    getItemName: (plan) => plan.tech_plan_name,
    deleteEndpoint: (plan) => ROUTES.API.TECH_SECURE_PLANS.BY_ID(plan.plan_key),
  });

  // 테이블 컬럼 정의
  const columns: Column<TechSecurePlanListItemDto>[] = [
    {
      key: 'plan_key',
      label: 'ID',
    },
    {
      key: 'tech_plan_name',
      label: '기술계획명',
    },
    {
      key: 'category',
      label: '카테고리',
      render: (plan) => plan.category.tech_name,
    },
    {
      key: 'category_level',
      label: '레벨',
      render: (plan) => `Level ${plan.category.category_level}`,
    },
  ];

  // 테이블 액션 정의
  const actions: DataTableAction<TechSecurePlanListItemDto>[] = [
    {
      label: '보기',
      href: (plan) => ROUTES.TRM.TECH_SECURE_PLANS.EDIT(plan.plan_key),
      variant: 'secondary',
    },
    {
      label: '수정',
      href: (plan) => ROUTES.TRM.TECH_SECURE_PLANS.EDIT(plan.plan_key),
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
          data={plans}
          actions={actions}
          emptyMessage="등록된 기술확보계획이 없습니다"
          getRowKey={(plan) => plan.plan_key}
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
