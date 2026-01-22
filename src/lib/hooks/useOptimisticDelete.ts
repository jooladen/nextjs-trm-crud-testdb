/**
 * 최적화된 삭제 훅
 * - useTransition으로 부드러운 전환
 * - Optimistic update + server refresh
 * - 에러 시 자동 복구
 */
import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseOptimisticDeleteOptions<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  getItemId: (item: T) => string | number;
  getItemName: (item: T) => string;
  deleteEndpoint: (item: T) => string;
}

interface DeleteHandler<T> {
  handleDelete: (item: T) => Promise<void>;
  isPending: boolean;
  isDeleting: boolean;
}

export function useOptimisticDelete<T>({
  items,
  setItems,
  getItemId,
  getItemName,
  deleteEndpoint,
}: UseOptimisticDeleteOptions<T>): DeleteHandler<T> {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (item: T) => {
    const itemName = getItemName(item);
    const itemId = getItemId(item);

    if (!confirm(`"${itemName}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      // API 호출
      const response = await fetch(deleteEndpoint(item), {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '삭제에 실패했습니다');
      }

      // Optimistic Update + Server Refresh (부드럽게)
      startTransition(() => {
        setItems((prev) => prev.filter((i) => getItemId(i) !== itemId));
        router.refresh();
      });

      alert('삭제되었습니다');
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : '삭제 중 오류가 발생했습니다'
      );
      router.refresh();  // 에러 시 서버 데이터로 복구
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleDelete,
    isPending,
    isDeleting,
  };
}
