import { NextRequest } from 'next/server';
import { categorySystemService } from '@/lib/services/categorySystem.service';
import { successResponse, errorResponse, notFoundResponse, badRequestResponse } from '@/lib/utils/apiResponse';
import { handlePrismaError, NotFoundError, ValidationError } from '@/lib/utils/errorHandler';
import { UpdateCategorySystemDto } from '@/lib/types/categorySystem.types';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const catId = Number(id);
    if (isNaN(catId)) return badRequestResponse('유효하지 않은 ID입니다');

    const category = await categorySystemService.findById(catId);
    return successResponse(category);
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    return errorResponse(handlePrismaError(error));
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const catId = Number(id);
    if (isNaN(catId)) return badRequestResponse('유효하지 않은 ID입니다');

    const body = await request.json();
    const dto: UpdateCategorySystemDto = {
      ...(body.category_level !== undefined && { category_level: Number(body.category_level) }),
      ...(body.tech_name !== undefined && { tech_name: body.tech_name }),
      ...(body.link_id !== undefined && { link_id: body.link_id ? Number(body.link_id) : null }),
    };

    const category = await categorySystemService.update(catId, dto);
    return successResponse(category);
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    if (error instanceof ValidationError) return badRequestResponse(error.message);
    return errorResponse(handlePrismaError(error));
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const catId = Number(id);
    if (isNaN(catId)) return badRequestResponse('유효하지 않은 ID입니다');

    await categorySystemService.delete(catId);
    return successResponse({ message: '카테고리가 삭제되었습니다' });
  } catch (error) {
    if (error instanceof NotFoundError) return notFoundResponse(error.message);
    if (error instanceof ValidationError) return badRequestResponse(error.message);
    return errorResponse(handlePrismaError(error));
  }
}
