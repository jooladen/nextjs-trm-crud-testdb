import { NextRequest } from 'next/server';
import { productLinePlanMapService } from '@/lib/services/productLinePlanMap.service';
import { successResponse, errorResponse, notFoundResponse, badRequestResponse } from '@/lib/utils/apiResponse';
import { handlePrismaError, NotFoundError } from '@/lib/utils/errorHandler';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [lineId, planKey] = id.split('-').map(Number);

    if (isNaN(lineId) || isNaN(planKey)) {
      return badRequestResponse('유효하지 않은 ID입니다');
    }

    await productLinePlanMapService.delete(lineId, planKey);
    return successResponse({ message: '매핑이 삭제되었습니다' });
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return errorResponse(handlePrismaError(error));
  }
}
