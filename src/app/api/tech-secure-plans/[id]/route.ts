/**
 * 기술확보계획 ID별 API 엔드포인트
 * GET /api/tech-secure-plans/[id] - 단건 조회
 * PUT /api/tech-secure-plans/[id] - 수정
 * DELETE /api/tech-secure-plans/[id] - 삭제
 */

import { NextRequest } from 'next/server';
import { techSecurePlanService } from '@/lib/services/techSecurePlan.service';
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
import { UpdateTechSecurePlanDto } from '@/lib/types/techSecurePlan.types';

/**
 * GET /api/tech-secure-plans/[id]
 * 기술확보계획 단건 조회
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const planId = Number(id);

    if (isNaN(planId)) {
      return badRequestResponse('유효하지 않은 ID입니다');
    }

    const plan = await techSecurePlanService.findById(planId);
    return successResponse(plan);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return notFoundResponse(error.message);
    }
    return errorResponse(handlePrismaError(error));
  }
}

/**
 * PUT /api/tech-secure-plans/[id]
 * 기술확보계획 수정
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const planId = Number(id);

    if (isNaN(planId)) {
      return badRequestResponse('유효하지 않은 ID입니다');
    }

    const body = await request.json();

    const dto: UpdateTechSecurePlanDto = {
      ...(body.category_id !== undefined && {
        category_id: Number(body.category_id),
      }),
      ...(body.tech_plan_name !== undefined && {
        tech_plan_name: body.tech_plan_name,
      }),
    };

    const plan = await techSecurePlanService.update(planId, dto);
    return successResponse(plan);
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
 * DELETE /api/tech-secure-plans/[id]
 * 기술확보계획 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const planId = Number(id);

    if (isNaN(planId)) {
      return badRequestResponse('유효하지 않은 ID입니다');
    }

    await techSecurePlanService.delete(planId);
    return successResponse({ message: '기술확보계획이 삭제되었습니다' });
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
