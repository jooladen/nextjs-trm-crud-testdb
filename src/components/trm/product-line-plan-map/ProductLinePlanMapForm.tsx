'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import SelectField from '../common/SelectField';
import { ROUTES } from '@/lib/constants/routes';

export default function ProductLinePlanMapForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    target_product_line_id: '' as number | '',
    plan_key: '' as number | '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.target_product_line_id) throw new Error('제품군 라인을 선택해주세요');
      if (!formData.plan_key) throw new Error('기술계획을 선택해주세요');

      const response = await fetch(ROUTES.API.PRODUCT_LINE_PLAN_MAP.BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || '저장에 실패했습니다');

      alert('매핑이 생성되었습니다');
      router.push(ROUTES.TRM.PRODUCT_LINE_PLAN_MAP.LIST);
      // router.refresh() 제거: push()가 자동으로 Server Component 재실행
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <SelectField
        label="제품군 라인"
        value={formData.target_product_line_id}
        onChange={(value) => setFormData((prev) => ({ ...prev, target_product_line_id: value }))}
        apiEndpoint={ROUTES.API.TARGET_PRODUCT_LINES.BASE}
        formatLabel={(item) => `${item.target_division} - ${item.target_product_line}`}
        required
      />

      <SelectField
        label="기술계획"
        value={formData.plan_key}
        onChange={(value) => setFormData((prev) => ({ ...prev, plan_key: value }))}
        apiEndpoint={ROUTES.API.TECH_SECURE_PLANS.BASE}
        formatLabel={(item) => item.tech_plan_name}
        required
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? '저장 중...' : '생성'}
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
