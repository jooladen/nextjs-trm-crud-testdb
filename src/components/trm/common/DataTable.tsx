/**
 * 재사용 가능한 데이터 테이블 컴포넌트
 * 제네릭 타입으로 다양한 데이터 구조 지원
 */

import Link from 'next/link';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableAction<T> {
  label: string;
  onClick?: (item: T) => void;
  href?: (item: T) => string;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: DataTableAction<T>[];
  emptyMessage?: string;
  getRowKey: (item: T) => string | number;
}

export default function DataTable<T>({
  columns,
  data,
  actions,
  emptyMessage = '데이터가 없습니다',
  getRowKey,
}: DataTableProps<T>) {
  // 버튼 스타일 헬퍼
  const getButtonClass = (variant: DataTableAction<T>['variant'] = 'secondary') => {
    const baseClass = 'px-3 py-1 rounded text-sm font-medium transition-colors';

    switch (variant) {
      case 'primary':
        return `${baseClass} bg-blue-600 text-white hover:bg-blue-700`;
      case 'danger':
        return `${baseClass} bg-red-600 text-white hover:bg-red-700`;
      case 'secondary':
      default:
        return `${baseClass} bg-gray-100 text-gray-700 hover:bg-gray-200`;
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={getRowKey(item)} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render
                    ? column.render(item)
                    : String((item as any)[column.key] ?? '')}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {actions.map((action, index) => {
                      if (action.href) {
                        return (
                          <Link
                            key={index}
                            href={action.href(item)}
                            className={getButtonClass(action.variant)}
                          >
                            {action.label}
                          </Link>
                        );
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => action.onClick?.(item)}
                          className={getButtonClass(action.variant)}
                        >
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
