/**
 * 기술확보계획(Tech_Secure_Plan) 서비스
 * 비즈니스 로직과 데이터베이스 작업을 처리합니다
 */

import prisma from '../prisma';
import {
  CreateTechSecurePlanDto,
  UpdateTechSecurePlanDto,
  TechSecurePlanResponseDto,
  TechSecurePlanListItemDto,
  CategoryReferenceDto,
} from '../types/techSecurePlan.types';
import { NotFoundError, ValidationError } from '../utils/errorHandler';

class TechSecurePlanService {
  /**
   * 모든 기술확보계획 조회
   */
  async findAll(): Promise<TechSecurePlanListItemDto[]> {
    const plans = await prisma.tech_Secure_Plan.findMany({
      include: {
        category: {
          select: {
            tech_name: true,
            category_level: true,
          },
        },
      },
      orderBy: {
        plan_key: 'desc',
      },
    });

    return plans.map((plan) => ({
      plan_key: plan.plan_key,
      tech_plan_name: plan.tech_plan_name,
      category: plan.category,
    }));
  }

  /**
   * ID로 기술확보계획 단건 조회
   */
  async findById(id: number): Promise<TechSecurePlanResponseDto> {
    const plan = await prisma.tech_Secure_Plan.findUnique({
      where: { plan_key: id },
      include: {
        category: true,
      },
    });

    if (!plan) {
      throw new NotFoundError(`ID ${id}에 해당하는 기술확보계획을 찾을 수 없습니다`);
    }

    return {
      plan_key: plan.plan_key,
      category_id: plan.category_id,
      tech_plan_name: plan.tech_plan_name,
      category: {
        category_id: plan.category.category_id,
        category_level: plan.category.category_level,
        tech_name: plan.category.tech_name,
      },
    };
  }

  /**
   * 기술확보계획 생성
   */
  async create(data: CreateTechSecurePlanDto): Promise<TechSecurePlanResponseDto> {
    // 외래키 검증: 카테고리가 존재하는지 확인
    const categoryExists = await prisma.category_System.findUnique({
      where: { category_id: data.category_id },
    });

    if (!categoryExists) {
      throw new ValidationError(
        `ID ${data.category_id}에 해당하는 카테고리가 존재하지 않습니다`
      );
    }

    // 생성
    const plan = await prisma.tech_Secure_Plan.create({
      data: {
        category_id: data.category_id,
        tech_plan_name: data.tech_plan_name,
      },
      include: {
        category: true,
      },
    });

    return {
      plan_key: plan.plan_key,
      category_id: plan.category_id,
      tech_plan_name: plan.tech_plan_name,
      category: {
        category_id: plan.category.category_id,
        category_level: plan.category.category_level,
        tech_name: plan.category.tech_name,
      },
    };
  }

  /**
   * 기술확보계획 수정
   */
  async update(
    id: number,
    data: UpdateTechSecurePlanDto
  ): Promise<TechSecurePlanResponseDto> {
    // 존재 여부 확인
    const exists = await prisma.tech_Secure_Plan.findUnique({
      where: { plan_key: id },
    });

    if (!exists) {
      throw new NotFoundError(`ID ${id}에 해당하는 기술확보계획을 찾을 수 없습니다`);
    }

    // 카테고리 변경 시 외래키 검증
    if (data.category_id !== undefined) {
      const categoryExists = await prisma.category_System.findUnique({
        where: { category_id: data.category_id },
      });

      if (!categoryExists) {
        throw new ValidationError(
          `ID ${data.category_id}에 해당하는 카테고리가 존재하지 않습니다`
        );
      }
    }

    // 수정
    const plan = await prisma.tech_Secure_Plan.update({
      where: { plan_key: id },
      data: {
        ...(data.category_id !== undefined && {
          category_id: data.category_id,
        }),
        ...(data.tech_plan_name !== undefined && {
          tech_plan_name: data.tech_plan_name,
        }),
      },
      include: {
        category: true,
      },
    });

    return {
      plan_key: plan.plan_key,
      category_id: plan.category_id,
      tech_plan_name: plan.tech_plan_name,
      category: {
        category_id: plan.category.category_id,
        category_level: plan.category.category_level,
        tech_name: plan.category.tech_name,
      },
    };
  }

  /**
   * 기술확보계획 삭제
   * 교차테이블에서 참조되고 있으면 삭제 불가
   */
  async delete(id: number): Promise<void> {
    // 존재 여부 확인
    const exists = await prisma.tech_Secure_Plan.findUnique({
      where: { plan_key: id },
    });

    if (!exists) {
      throw new NotFoundError(`ID ${id}에 해당하는 기술확보계획을 찾을 수 없습니다`);
    }

    // 교차테이블에서 참조 확인
    const referencedInMap = await prisma.target_product_line_plan_map.findFirst({
      where: { plan_key: id },
    });

    if (referencedInMap) {
      throw new ValidationError(
        '이 기술확보계획은 제품군-계획 매핑에서 사용 중이므로 삭제할 수 없습니다'
      );
    }

    // 삭제
    await prisma.tech_Secure_Plan.delete({
      where: { plan_key: id },
    });
  }

  /**
   * 카테고리 참조 데이터 조회 (드롭다운용)
   */
  async getCategoryReferences(): Promise<CategoryReferenceDto[]> {
    const categories = await prisma.category_System.findMany({
      select: {
        category_id: true,
        category_level: true,
        tech_name: true,
      },
      orderBy: [
        { category_level: 'asc' },
        { tech_name: 'asc' },
      ],
    });

    return categories;
  }
}

// 싱글톤 인스턴스 export
export const techSecurePlanService = new TechSecurePlanService();
