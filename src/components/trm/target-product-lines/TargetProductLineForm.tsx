'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { TargetProductLineResponseDto } from '@/lib/types/targetProductLine.types';
import { ROUTES } from '@/lib/constants/routes';

interface TargetProductLineFormProps {
  mode: 'create' | 'edit';
  initialData?: TargetProductLineResponseDto;
}

export default function TargetProductLineForm({
  mode,
  initialData,
}: TargetProductLineFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    target_division: initialData?.target_division || '',
    target_product_line: initialData?.target_product_line || '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.target_division.trim()) {
        throw new Error('사업부를 입력해주세요');
      }
      if (!formData.target_product_line.trim()) {
        throw new Error('제품군 라인을 입력해주세요');
      }

      const url =
        mode === 'create'
          ? ROUTES.API.TARGET_PRODUCT_LINES.BASE
          : ROUTES.API.TARGET_PRODUCT_LINES.BY_ID(initialData!.target_product_line_id);

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '저장에 실패했습니다');
      }

      alert(mode === 'create' ? '생성되었습니다' : '수정되었습니다');
      router.push(ROUTES.TRM.TARGET_PRODUCT_LINES.LIST);
      router.refresh();
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          사업부 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.target_division}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, target_division: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          placeholder="예: 전장사업부"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          제품군 라인 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.target_product_line}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, target_product_line: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          placeholder="예: 전동화 제품군"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? '저장 중...' : mode === 'create' ? '생성' : '수정'}
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
