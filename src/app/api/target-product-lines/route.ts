/**
 * 타겟제품군 API 엔드포인트
 */

import { NextRequest } from 'next/server';
import { targetProductLineService } from '@/lib/services/targetProductLine.service';
import {
  successResponse,
  createdResponse,
  errorResponse,
  badRequestResponse,
} from '@/lib/utils/apiResponse';
import { handlePrismaError, ValidationError } from '@/lib/utils/errorHandler';
import { CreateTargetProductLineDto } from '@/lib/types/targetProductLine.types';

export async function GET() {
  try {
    const productLines = await targetProductLineService.findAll();
    return successResponse(productLines);
  } catch (error) {
    return errorResponse(handlePrismaError(error));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.target_division || !body.target_product_line) {
      return badRequestResponse('필수 필드가 누락되었습니다');
    }

    const dto: CreateTargetProductLineDto = {
      target_division: body.target_division,
      target_product_line: body.target_product_line,
    };

    const productLine = await targetProductLineService.create(dto);
    return createdResponse(productLine);
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequestResponse(error.message);
    }
    return errorResponse(handlePrismaError(error));
  }
}
