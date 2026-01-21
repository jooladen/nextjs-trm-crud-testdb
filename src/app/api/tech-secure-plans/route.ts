/**
 * 기술확보계획 API 엔드포인트
 * GET /api/tech-secure-plans - 전체 조회
 * POST /api/tech-secure-plans - 생성
 */

import { NextRequest } from 'next/server';
import { techSecurePlanService } from '@/lib/services/techSecurePlan.service';
import {
  successResponse,
  createdResponse,
  errorResponse,
  badRequestResponse,
} from '@/lib/utils/apiResponse';
import { handlePrismaError, ValidationError } from '@/lib/utils/errorHandler';
import { CreateTechSecurePlanDto } from '@/lib/types/techSecurePlan.types';

/**
 * GET /api/tech-secure-plans
 * 모든 기술확보계획 조회
 */
export async function GET() {
  try {
    const plans = await techSecurePlanService.findAll();
    return successResponse(plans);
  } catch (error) {
    return errorResponse(handlePrismaError(error));
  }
}

/**
 * POST /api/tech-secure-plans
 * 기술확보계획 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 필수 필드 검증
    if (!body.category_id || !body.tech_plan_name) {
      return badRequestResponse('필수 필드가 누락되었습니다');
    }

    const dto: CreateTechSecurePlanDto = {
      category_id: Number(body.category_id),
      tech_plan_name: body.tech_plan_name,
    };

    const plan = await techSecurePlanService.create(dto);
    return createdResponse(plan);
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequestResponse(error.message);
    }
    return errorResponse(handlePrismaError(error));
  }
}
