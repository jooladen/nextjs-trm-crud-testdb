/**
 * 기술확보계획 수정 페이지 (Server Component)
 * 서버에서 기존 데이터를 fetch하여 폼에 전달
 */

import { notFound } from 'next/navigation';
import { techSecurePlanService } from '@/lib/services/techSecurePlan.service';
import TechSecurePlanForm from '@/components/trm/tech-secure-plans/TechSecurePlanForm';
import { NotFoundError } from '@/lib/utils/errorHandler';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `기술확보계획 수정 #${id} | TRM`,
    description: '기술확보계획 정보를 수정합니다',
  };
}

export default async function EditTechSecurePlanPage({ params }: PageProps) {
  const { id } = await params;
  const planId = Number(id);

  if (isNaN(planId)) {
    notFound();
  }

  // 서버에서 데이터 fetch
  let plan;
  try {
    plan = await techSecurePlanService.findById(planId);
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
          기술확보계획 수정 #{plan.plan_key}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          기술확보계획 정보를 수정하세요
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <TechSecurePlanForm mode="edit" initialData={plan} />
      </div>
    </div>
  );
}
