/**
 * 타겟제품군 ID별 API 엔드포인트
 * GET /api/target-products/[id] - 단건 조회
 * PUT /api/target-products/[id] - 수정
 * DELETE /api/target-products/[id] - 삭제
 */

import { NextRequest } from 'next/server';
import { targetProductService } from '@/lib/services/targetProduct.service';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  badRequestResponse,
} from '@/lib/utils/apiResponse';
import {
  handlePrismaError,
  NotFoundError,
  ValidationError,
} from '@/lib/utils/errorHandler';
import { UpdateTargetProductDto } from '@/lib/types/targetProduct.types';

/**
 * GET /api/target-products/[id]
 * 타겟제품군 단건 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return badRequestResponse('유효하지 않은 ID입니다');
    }

    const product = await targetProductService.findById(productId);
    return successResponse(product);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFoundResponse(error.message);
    }
    return errorResponse(handlePrismaError(error));
  }
}

/**
 * PUT /api/target-products/[id]
 * 타겟제품군 수정
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return badRequestResponse('유효하지 않은 ID입니다');
    }

    const body = await request.json();

    const dto: UpdateTargetProductDto = {
      ...(body.target_product_line_id !== undefined && {
        target_product_line_id: Number(body.target_product_line_id),
      }),
      ...(body.target_product_name !== undefined && {
        target_product_name: body.target_product_name,
      }),
      ...(body.deployment_date !== undefined && {
        deployment_date: body.deployment_date,
      }),
    };

    const product = await targetProductService.update(productId, dto);
    return successResponse(product);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFoundResponse(error.message);
    }
    if (error instanceof ValidationError) {
      return badRequestResponse(error.message);
    }
    return errorResponse(handlePrismaError(error));
  }
}

/**
 * DELETE /api/target-products/[id]
 * 타겟제품군 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return badRequestResponse('유효하지 않은 ID입니다');
    }

    await targetProductService.delete(productId);
    return successResponse({ message: '타겟제품군이 삭제되었습니다' });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFoundResponse(error.message);
    }
    return errorResponse(handlePrismaError(error));
  }
}
