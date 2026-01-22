'use client';

/**
 * 타겟제품군 폼 컴포넌트
 * 생성 및 수정 모드 지원
 */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import SelectField from '../common/SelectField';
import { TargetProductResponseDto } from '@/lib/types/targetProduct.types';
import { ROUTES } from '@/lib/constants/routes';

interface TargetProductFormProps {
  mode: 'create' | 'edit';
  initialData?: TargetProductResponseDto;
}

export default function TargetProductForm({
  mode,
  initialData,
}: TargetProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    target_product_line_id: initialData?.target_product_line_id || ('' as number | ''),
    target_product_name: initialData?.target_product_name || '',
    deployment_date: initialData?.deployment_date
      ? new Date(initialData.deployment_date).toISOString().split('T')[0]
      : '',
  });

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 유효성 검사
      if (!formData.target_product_line_id) {
        throw new Error('제품군을 선택해주세요');
      }
      if (!formData.target_product_name.trim()) {
        throw new Error('제품명을 입력해주세요');
      }
      if (!formData.deployment_date) {
        throw new Error('배치일을 선택해주세요');
      }

      const url =
        mode === 'create'
          ? ROUTES.API.TARGET_PRODUCTS.BASE
          : ROUTES.API.TARGET_PRODUCTS.BY_ID(initialData!.target_product_id);

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
      router.push(ROUTES.TRM.TARGET_PRODUCTS.LIST);
      // router.refresh() 제거: push()가 자동으로 Server Component 재실행
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

      {/* 제품군 선택 */}
      <SelectField
        label="제품군"
        value={formData.target_product_line_id}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, target_product_line_id: value }))
        }
        apiEndpoint={ROUTES.API.REFERENCE_DATA.PRODUCT_LINES}
        formatLabel={(item) =>
          `${item.target_division} - ${item.target_product_line}`
        }
        required
      />

      {/* 제품명 입력 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          제품명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.target_product_name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, target_product_name: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="제품명을 입력하세요"
        />
      </div>

      {/* 배치일 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          배치일 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.deployment_date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, deployment_date: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
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
