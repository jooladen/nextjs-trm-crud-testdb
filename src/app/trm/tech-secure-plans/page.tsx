/**
 * 기술확보계획 목록 페이지 (Server Component)
 * 서버에서 데이터를 fetch하여 클라이언트 컴포넌트에 전달
 */

import Link from 'next/link';
import { techSecurePlanService } from '@/lib/services/techSecurePlan.service';
import TechSecurePlanList from '@/components/trm/tech-secure-plans/TechSecurePlanList';
import { ROUTES } from '@/lib/constants/routes';

export const metadata = {
  title: '기술확보계획 목록 | TRM',
  description: '기술확보계획 관리 페이지',
};

export default async function TechSecurePlansPage() {
  // 서버에서 데이터 fetch
  const plans = await techSecurePlanService.findAll();

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">기술확보계획</h2>
          <p className="mt-1 text-sm text-gray-600">
            기술확보계획을 조회하고 관리합니다
          </p>
        </div>
        <Link
          href={ROUTES.TRM.TECH_SECURE_PLANS.NEW}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + 새 계획 등록
        </Link>
      </div>

      {/* 통계 */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-600">전체 계획</p>
          <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
        </div>
      </div>

      {/* 목록 */}
      <TechSecurePlanList initialData={plans} />
    </div>
  );
}
