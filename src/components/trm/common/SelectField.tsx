'use client';

/**
 * 외래키 선택을 위한 드롭다운 필드 컴포넌트
 * - API에서 참조 데이터를 1회만 fetch
 * - formatLabel 변경 시 불필요한 재fetch 방지
 */

import { useEffect, useState } from 'react';

export interface SelectOption {
  value: number;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: number | '';
  onChange: (value: number) => void;
  apiEndpoint: string;
  formatLabel: (item: any) => string;
  required?: boolean;
  error?: string;
}

export default function SelectField({
  label,
  value,
  onChange,
  apiEndpoint,
  formatLabel,
  required = false,
  error,
}: SelectFieldProps) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOptions() {
      try {
        setLoading(true);
        setFetchError(null);

        const response = await fetch(apiEndpoint);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || '데이터를 불러올 수 없습니다');
        }

        const formattedOptions: SelectOption[] = result.data.map((item: any) => ({
          value: item[Object.keys(item)[0]], // 첫 번째 필드를 ID로 사용
          label: formatLabel(item),
        }));

        setOptions(formattedOptions);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : '오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    }

    fetchOptions();
    // formatLabel 제거: 표시 로직은 데이터 fetching과 독립적
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiEndpoint]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {loading ? (
        <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500">
          불러오는 중...
        </div>
      ) : fetchError ? (
        <div className="border border-red-300 rounded-md px-3 py-2 bg-red-50 text-red-600 text-sm">
          {fetchError}
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`
            w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
            ${
              error
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }
          `}
          required={required}
        >
          <option value="">선택하세요</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
