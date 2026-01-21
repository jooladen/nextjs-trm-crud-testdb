/**
 * 카테고리 참조 데이터 API
 * GET /api/reference-data/categories - 드롭다운용 카테고리 목록
 */

import { techSecurePlanService } from '@/lib/services/techSecurePlan.service';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';
import { handlePrismaError } from '@/lib/utils/errorHandler';

/**
 * GET /api/reference-data/categories
 * 드롭다운에서 사용할 카테고리 목록 조회
 */
export async function GET() {
  try {
    const categories = await techSecurePlanService.getCategoryReferences();
    return successResponse(categories);
  } catch (error) {
    return errorResponse(handlePrismaError(error));
  }
}
