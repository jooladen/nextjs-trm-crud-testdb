/**
 * 기술확보계획 생성 페이지
 */

import TechSecurePlanForm from '@/components/trm/tech-secure-plans/TechSecurePlanForm';

export const metadata = {
  title: '새 기술확보계획 등록 | TRM',
  description: '새로운 기술확보계획을 등록합니다',
};

export default function NewTechSecurePlanPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">새 기술확보계획 등록</h2>
        <p className="mt-1 text-sm text-gray-600">
          새로운 기술확보계획 정보를 입력하세요
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <TechSecurePlanForm mode="create" />
      </div>
    </div>
  );
}
