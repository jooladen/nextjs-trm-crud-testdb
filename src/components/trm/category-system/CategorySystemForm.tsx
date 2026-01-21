'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CategorySystemResponseDto } from '@/lib/types/categorySystem.types';
import { ROUTES } from '@/lib/constants/routes';

interface CategorySystemFormProps {
  mode: 'create' | 'edit';
  initialData?: CategorySystemResponseDto;
}

export default function CategorySystemForm({ mode, initialData }: CategorySystemFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category_id: initialData?.category_id || (''),
    category_level: initialData?.category_level || '',
    tech_name: initialData?.tech_name || '',
    link_id: initialData?.link_id || (''),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'create' && !formData.category_id) throw new Error('카테고리 ID를 입력해주세요');
      if (!formData.category_level) throw new Error('레벨을 입력해주세요');
      if (!formData.tech_name.trim()) throw new Error('기술명을 입력해주세요');

      const url = mode === 'create' ? ROUTES.API.CATEGORY_SYSTEM.BASE : ROUTES.API.CATEGORY_SYSTEM.BY_ID(initialData!.category_id);
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || '저장에 실패했습니다');

      alert(mode === 'create' ? '생성되었습니다' : '수정되었습니다');
      router.push(ROUTES.TRM.CATEGORY_SYSTEM.LIST);
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

      {mode === 'create' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리 ID <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.category_id}
            onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          레벨 <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formData.category_level}
          onChange={(e) => setFormData((prev) => ({ ...prev, category_level: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
          placeholder="예: 1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          기술명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.tech_name}
          onChange={(e) => setFormData((prev) => ({ ...prev, tech_name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
          placeholder="기술명을 입력하세요"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          상위 카테고리 ID (선택)
        </label>
        <input
          type="number"
          value={formData.link_id}
          onChange={(e) => setFormData((prev) => ({ ...prev, link_id: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="상위 카테고리가 있으면 입력하세요"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
