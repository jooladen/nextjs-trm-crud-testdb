/**
 * 카테고리 시스템(Category_System) 서비스
 */

import prisma from '../prisma';
import {
  CreateCategorySystemDto,
  UpdateCategorySystemDto,
  CategorySystemResponseDto,
  CategorySystemListItemDto,
} from '../types/categorySystem.types';
import { NotFoundError, ValidationError } from '../utils/errorHandler';

class CategorySystemService {
  async findAll(): Promise<CategorySystemListItemDto[]> {
    const categories = await prisma.category_System.findMany({
      include: {
        parent: { select: { tech_name: true } },
        _count: { select: { children: true, techPlans: true } },
      },
      orderBy: [{ category_level: 'asc' }, { tech_name: 'asc' }],
    });

    return categories.map((cat) => ({
      category_id: cat.category_id,
      category_level: cat.category_level,
      tech_name: cat.tech_name,
      parentName: cat.parent?.tech_name || null,
      childCount: cat._count.children,
      planCount: cat._count.techPlans,
    }));
  }

  async findById(id: number): Promise<CategorySystemResponseDto> {
    const category = await prisma.category_System.findUnique({
      where: { category_id: id },
      include: {
        parent: { select: { category_id: true, tech_name: true } },
        _count: { select: { children: true, techPlans: true } },
      },
    });

    if (!category) {
      throw new NotFoundError(`ID ${id}에 해당하는 카테고리를 찾을 수 없습니다`);
    }

    return {
      category_id: category.category_id,
      category_level: category.category_level,
      tech_name: category.tech_name,
      link_id: category.link_id,
      parent: category.parent,
      _count: { children: category._count.children, techPlans: category._count.techPlans },
    };
  }

  async create(data: CreateCategorySystemDto): Promise<CategorySystemResponseDto> {
    if (data.link_id) {
      const parentExists = await prisma.category_System.findUnique({
        where: { category_id: data.link_id },
      });
      if (!parentExists) {
        throw new ValidationError(`ID ${data.link_id}에 해당하는 부모 카테고리가 존재하지 않습니다`);
      }
    }

    const category = await prisma.category_System.create({
      data: {
        category_id: data.category_id,
        category_level: data.category_level,
        tech_name: data.tech_name,
        link_id: data.link_id,
      },
      include: {
        parent: { select: { category_id: true, tech_name: true } },
        _count: { select: { children: true, techPlans: true } },
      },
    });

    return {
      category_id: category.category_id,
      category_level: category.category_level,
      tech_name: category.tech_name,
      link_id: category.link_id,
      parent: category.parent,
      _count: { children: category._count.children, techPlans: category._count.techPlans },
    };
  }

  async update(id: number, data: UpdateCategorySystemDto): Promise<CategorySystemResponseDto> {
    const exists = await prisma.category_System.findUnique({ where: { category_id: id } });
    if (!exists) {
      throw new NotFoundError(`ID ${id}에 해당하는 카테고리를 찾을 수 없습니다`);
    }

    if (data.link_id !== undefined && data.link_id !== null) {
      const parentExists = await prisma.category_System.findUnique({
        where: { category_id: data.link_id },
      });
      if (!parentExists) {
        throw new ValidationError(`ID ${data.link_id}에 해당하는 부모 카테고리가 존재하지 않습니다`);
      }
    }

    const category = await prisma.category_System.update({
      where: { category_id: id },
      data: {
        ...(data.category_level !== undefined && { category_level: data.category_level }),
        ...(data.tech_name !== undefined && { tech_name: data.tech_name }),
        ...(data.link_id !== undefined && { link_id: data.link_id }),
      },
      include: {
        parent: { select: { category_id: true, tech_name: true } },
        _count: { select: { children: true, techPlans: true } },
      },
    });

    return {
      category_id: category.category_id,
      category_level: category.category_level,
      tech_name: category.tech_name,
      link_id: category.link_id,
      parent: category.parent,
      _count: { children: category._count.children, techPlans: category._count.techPlans },
    };
  }

  async delete(id: number): Promise<void> {
    const exists = await prisma.category_System.findUnique({
      where: { category_id: id },
      include: { _count: { select: { children: true, techPlans: true } } },
    });

    if (!exists) {
      throw new NotFoundError(`ID ${id}에 해당하는 카테고리를 찾을 수 없습니다`);
    }

    if (exists._count.children > 0) {
      throw new ValidationError(`이 카테고리는 ${exists._count.children}개의 하위 카테고리에서 사용 중이므로 삭제할 수 없습니다`);
    }

    if (exists._count.techPlans > 0) {
      throw new ValidationError(`이 카테고리는 ${exists._count.techPlans}개의 기술계획에서 사용 중이므로 삭제할 수 없습니다`);
    }

    await prisma.category_System.delete({ where: { category_id: id } });
  }
}

export const categorySystemService = new CategorySystemService();
