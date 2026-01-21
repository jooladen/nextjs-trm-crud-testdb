'use client';

/**
 * 기술확보계획 폼 컴포넌트
 * 생성 및 수정 모드 지원
 */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import SelectField from '../common/SelectField';
import { TechSecurePlanResponseDto } from '@/lib/types/techSecurePlan.types';
import { ROUTES } from '@/lib/constants/routes';

interface TechSecurePlanFormProps {
  mode: 'create' | 'edit';
  initialData?: TechSecurePlanResponseDto;
}

export default function TechSecurePlanForm({
  mode,
  initialData,
}: TechSecurePlanFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    category_id: initialData?.category_id || ('' as number | ''),
    tech_plan_name: initialData?.tech_plan_name || '',
  });

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 유효성 검사
      if (!formData.category_id) {
        throw new Error('카테고리를 선택해주세요');
      }
      if (!formData.tech_plan_name.trim()) {
        throw new Error('기술계획명을 입력해주세요');
      }

      const url =
        mode === 'create'
          ? ROUTES.API.TECH_SECURE_PLANS.BASE
          : ROUTES.API.TECH_SECURE_PLANS.BY_ID(initialData!.plan_key);

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '저장에 실패했습니다');
      }

      alert(mode === 'create' ? '생성되었습니다' : '수정되었습니다');
      router.push(ROUTES.TRM.TECH_SECURE_PLANS.LIST);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* 카테고리 선택 */}
      <SelectField
        label="카테고리"
        value={formData.category_id}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, category_id: value }))
        }
        apiEndpoint={ROUTES.API.REFERENCE_DATA.CATEGORIES}
        formatLabel={(item) => `[Level ${item.category_level}] ${item.tech_name}`}
        required
      />

      {/* 기술계획명 입력 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          기술계획명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.tech_plan_name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tech_plan_name: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="기술계획명을 입력하세요"
        />
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? '저장 중...'
            : mode === 'create'
            ? '생성'
            : '수정'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  );
}
