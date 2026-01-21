/**
 * 제품군 참조 데이터 API
 * GET /api/reference-data/product-lines - 드롭다운용 제품군 목록
 */

import { targetProductService } from '@/lib/services/targetProduct.service';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';
import { handlePrismaError } from '@/lib/utils/errorHandler';

/**
 * GET /api/reference-data/product-lines
 * 드롭다운에서 사용할 제품군 목록 조회
 */
export async function GET() {
  try {
    const productLines = await targetProductService.getProductLineReferences();
    return successResponse(productLines);
  } catch (error) {
    return errorResponse(handlePrismaError(error));
  }
}
