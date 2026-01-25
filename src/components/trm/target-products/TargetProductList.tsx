/**
 * 📖 학습 포인트 2: Client Component
 *
 * 🔝 맨 위의 'use client'를 보세요! 이게 있으면 Client Component입니다.
 *
 * 🤔 왜 Client Component를 쓸까요?
 * - 상호작용: 버튼 클릭, 입력 등을 처리해요
 * - 상태 관리: useState로 데이터를 기억해요
 * - 실시간 업데이트: 화면이 바로바로 바뀌어요
 *
 * 🔍 여기서 배울 것:
 * 1. useState 사용법
 * 2. 낙관적 업데이트 패턴 (빠른 UI 반응)
 * 3. 커스텀 훅 사용법
 */

'use client';  // 👈 이게 있으면 Client Component!

import { useState } from 'react';
import DataTable, { Column, DataTableAction } from '../common/DataTable';
import { TargetProductListItemDto } from '@/lib/types/targetProduct.types';
import { ROUTES } from '@/lib/constants/routes';
import { useOptimisticDelete } from '@/lib/hooks/useOptimisticDelete';

// Props 타입 정의: page.tsx에서 전달받는 데이터 형식
interface TargetProductListProps {
  initialData: TargetProductListItemDto[];  // 💡 서버에서 받은 초기 데이터
}

export default function TargetProductList({ initialData }: TargetProductListProps) {
  // 💡 Step 1: 상태 관리
  // useState로 제품 목록을 관리합니다
  // 📍 실행 위치: 브라우저
  // ⏰ 타이밍: 컴포넌트가 마운트될 때 initialData로 초기화
  const [products, setProducts] = useState(initialData);

  // 💡 Step 2: 낙관적 업데이트 훅 사용
  // useOptimisticDelete는 삭제를 빠르게 보이게 하는 커스텀 훅입니다
  // "낙관적" = "성공할 거라고 낙관하고 먼저 UI 업데이트"
  // 📍 실행 위치: 브라우저
  // ⏰ 타이밍: 삭제 버튼 클릭 시
  const { handleDelete, isPending, isDeleting } = useOptimisticDelete({
    items: products,              // 현재 목록
    setItems: setProducts,        // 목록 업데이트 함수
    getItemId: (p) => p.target_product_id,     // ID 추출 함수
    getItemName: (p) => p.target_product_name, // 이름 추출 함수 (확인창용)
    deleteEndpoint: (p) => ROUTES.API.TARGET_PRODUCTS.BY_ID(p.target_product_id), // API 경로
  });

  // 💡 Step 3: 테이블 컬럼 정의
  // 어떤 필드를 어떻게 표시할지 정의합니다
  const columns: Column<TargetProductListItemDto>[] = [
    {
      key: 'target_product_id',
      label: 'ID',
    },
    {
      key: 'target_product_name',
      label: '제품명',
    },
    {
      key: 'productLine',
      label: '제품군',
      render: (product) =>
        `${product.productLine.target_division} - ${product.productLine.target_product_line}`,
    },
    {
      key: 'deployment_date',
      label: '배치일',
      render: (product) => new Date(product.deployment_date).toLocaleDateString('ko-KR'),
    },
  ];

  // 💡 Step 4: 액션 버튼 정의
  // 각 행에 표시될 버튼들을 정의합니다
  const actions: DataTableAction<TargetProductListItemDto>[] = [
    {
      label: '보기',
      href: (product) =>
        ROUTES.TRM.TARGET_PRODUCTS.EDIT(product.target_product_id),
      variant: 'secondary',
    },
    {
      label: '수정',
      href: (product) =>
        ROUTES.TRM.TARGET_PRODUCTS.EDIT(product.target_product_id),
      variant: 'primary',
    },
    {
      label: '삭제',
      onClick: handleDelete,  // 💡 이벤트 핸들러 연결! (Client Component만 가능)
      variant: 'danger',
    },
  ];

  // 💡 Step 5: UI 렌더링
  return (
    <div>
      {/* isPending이 true일 때 흐리게 표시 (삭제 진행 중) */}
      <div className={isPending ? 'opacity-70 pointer-events-none' : ''}>
        <DataTable
          columns={columns}          // 표시할 컬럼
          data={products}             // 💡 useState로 관리하는 데이터!
          actions={actions}           // 액션 버튼
          emptyMessage="등록된 타겟제품군이 없습니다"
          getRowKey={(product) => product.target_product_id}
        />
      </div>

      {/* 삭제 중일 때 로딩 표시 (isDeleting이 true) */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <p className="text-gray-900">삭제 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 🎓 이 파일에서 배운 것:
 *
 * ✅ 'use client'로 Client Component 만들기
 * ✅ useState로 상태 관리하기
 * ✅ Props로 데이터 받기 (initialData)
 * ✅ 커스텀 훅 사용하기 (useOptimisticDelete)
 * ✅ 이벤트 핸들러 연결하기 (onClick)
 * ✅ 조건부 렌더링 (isPending, isDeleting)
 *
 * 💡 낙관적 업데이트 흐름:
 * 1. 삭제 버튼 클릭 → handleDelete 호출
 * 2. 즉시 UI에서 항목 제거 (setProducts)
 * 3. 백그라운드에서 API 호출
 * 4. 성공 시: 그대로 유지
 *    실패 시: router.refresh()로 복구
 *
 * 💡 다음 파일:
 * API Route를 보면 서버에서 어떻게 요청을 처리하는지 알 수 있어요!
 */
