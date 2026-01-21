import { NextRequest } from 'next/server';
import { productLinePlanMapService } from '@/lib/services/productLinePlanMap.service';
import { successResponse, createdResponse, errorResponse, badRequestResponse } from '@/lib/utils/apiResponse';
import { handlePrismaError, ValidationError } from '@/lib/utils/errorHandler';
import { CreateProductLinePlanMapDto } from '@/lib/types/productLinePlanMap.types';

export async function GET() {
  try {
    const maps = await productLinePlanMapService.findAll();
    return successResponse(maps);
  } catch (error) {
    return errorResponse(handlePrismaError(error));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.target_product_line_id || !body.plan_key) {
      return badRequestResponse('필수 필드가 누락되었습니다');
    }

    const dto: CreateProductLinePlanMapDto = {
      target_product_line_id: Number(body.target_product_line_id),
      plan_key: Number(body.plan_key),
    };

    const map = await productLinePlanMapService.create(dto);
    return createdResponse(map);
  } catch (error) {
    if (error instanceof ValidationError) return badRequestResponse(error.message);
    return errorResponse(handlePrismaError(error));
  }
}
