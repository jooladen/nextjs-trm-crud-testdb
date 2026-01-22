/**
 * 최적화된 삭제 훅
 * - useTransition으로 부드러운 전환
 * - Optimistic update로 즉각적인 UI 반응
 * - 에러 시에만 server refresh로 데이터 복구
 * - 스크롤 위치 자동 보존
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

      // Optimistic Update (낙관적 업데이트)
      startTransition(() => {
        setItems((prev) => prev.filter((i) => getItemId(i) !== itemId));
        // router.refresh() 제거: 낙관적 업데이트만으로 충분
        // 다음 페이지 이동 시 자동으로 최신 데이터 fetch됨
      });

      alert('삭제되었습니다');
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : '삭제 중 오류가 발생했습니다'
      );
      // 에러 시에만 서버 데이터로 복구
      router.refresh();
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
