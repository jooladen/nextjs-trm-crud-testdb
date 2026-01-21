/**
 * 타겟제품군 라인 ID별 API 엔드포인트
 */

import { NextRequest } from 'next/server';
import { targetProductLineService } from '@/lib/services/targetProductLine.service';
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
import { UpdateTargetProductLineDto } from '@/lib/types/targetProductLine.types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lineId = Number(id);

    if (isNaN(lineId)) {
      return badRequestResponse('유효하지 않은 ID입니다');
    }

    const productLine = await targetProductLineService.findById(lineId);
    return successResponse(productLine);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFoundResponse(error.message);
    }
    return errorResponse(handlePrismaError(error));
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lineId = Number(id);

    if (isNaN(lineId)) {
      return badRequestResponse('유효하지 않은 ID입니다');
    }

    const body = await request.json();

    const dto: UpdateTargetProductLineDto = {
      ...(body.target_division !== undefined && {
        target_division: body.target_division,
      }),
      ...(body.target_product_line !== undefined && {
        target_product_line: body.target_product_line,
      }),
    };

    const productLine = await targetProductLineService.update(lineId, dto);
    return successResponse(productLine);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lineId = Number(id);

    if (isNaN(lineId)) {
      return badRequestResponse('유효하지 않은 ID입니다');
    }

    await targetProductLineService.delete(lineId);
    return successResponse({ message: '타겟제품군 라인이 삭제되었습니다' });
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
