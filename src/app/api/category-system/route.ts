import { NextRequest } from 'next/server';
import { categorySystemService } from '@/lib/services/categorySystem.service';
import { successResponse, createdResponse, errorResponse, badRequestResponse } from '@/lib/utils/apiResponse';
import { handlePrismaError, ValidationError } from '@/lib/utils/errorHandler';
import { CreateCategorySystemDto } from '@/lib/types/categorySystem.types';

export async function GET() {
  try {
    const categories = await categorySystemService.findAll();
    return successResponse(categories);
  } catch (error) {
    return errorResponse(handlePrismaError(error));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.category_id || !body.category_level || !body.tech_name) {
      return badRequestResponse('필수 필드가 누락되었습니다');
    }

    const dto: CreateCategorySystemDto = {
      category_id: Number(body.category_id),
      category_level: Number(body.category_level),
      tech_name: body.tech_name,
      link_id: body.link_id ? Number(body.link_id) : null,
    };

    const category = await categorySystemService.create(dto);
    return createdResponse(category);
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequestResponse(error.message);
    }
    return errorResponse(handlePrismaError(error));
  }
}
