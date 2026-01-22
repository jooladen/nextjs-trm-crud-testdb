/**
 * 타겟제품군 API 엔드포인트
 * GET /api/target-products - 전체 조회
 * POST /api/target-products - 생성
 */

import { NextRequest } from 'next/server';
import { targetProductService } from '@/lib/services/targetProduct.service';
import {
  successResponse,
  createdResponse,
  errorResponse,
  badRequestResponse,
} from '@/lib/utils/apiResponse';
import { handlePrismaError, ValidationError } from '@/lib/utils/errorHandler';
import { CreateTargetProductDto } from '@/lib/types/targetProduct.types';

/**
 * GET /api/target-products
 * 모든 타겟제품 조회
 */
export async function GET() {
  try {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> [API] GET /api/target-products");

    const products = await targetProductService.findAll();
    console.log(`[API] Fetched ${products.length} target products`);

    return successResponse(products);
  } catch (error) {
    console.error('[API] Error fetching target products:', error);
    return errorResponse(handlePrismaError(error));
  }
}

/**
 * POST /api/target-products
 * 타겟제품군 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 필수 필드 검증
    if (!body.target_product_line_id || !body.target_product_name || !body.deployment_date) {
      return badRequestResponse('필수 필드가 누락되었습니다');
    }

    const dto: CreateTargetProductDto = {
      target_product_line_id: Number(body.target_product_line_id),
      target_product_name: body.target_product_name,
      deployment_date: body.deployment_date,
    };

    const product = await targetProductService.create(dto);
    return createdResponse(product);
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequestResponse(error.message);
    }
    return errorResponse(handlePrismaError(error));
  }
}
