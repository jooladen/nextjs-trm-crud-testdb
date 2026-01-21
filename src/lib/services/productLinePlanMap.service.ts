/**
 * 제품군-계획 매핑 서비스
 */

import prisma from '../prisma';
import {
  CreateProductLinePlanMapDto,
  ProductLinePlanMapResponseDto,
  ProductLinePlanMapListItemDto,
} from '../types/productLinePlanMap.types';
import { NotFoundError, ValidationError } from '../utils/errorHandler';

class ProductLinePlanMapService {
  async findAll(): Promise<ProductLinePlanMapListItemDto[]> {
    const maps = await prisma.target_product_line_plan_map.findMany({
      include: {
        productLine: { select: { target_product_line: true } },
        plan: { select: { tech_plan_name: true } },
      },
      orderBy: [{ target_product_line_id: 'asc' }, { plan_key: 'asc' }],
    });

    return maps.map((m) => ({
      target_product_line_id: m.target_product_line_id,
      plan_key: m.plan_key,
      productLineName: m.productLine.target_product_line,
      planName: m.plan.tech_plan_name,
    }));
  }

  async findById(lineId: number, planKey: number): Promise<ProductLinePlanMapResponseDto> {
    const map = await prisma.target_product_line_plan_map.findUnique({
      where: {
        target_product_line_id_plan_key: {
          target_product_line_id: lineId,
          plan_key: planKey,
        },
      },
      include: { productLine: true, plan: true },
    });

    if (!map) {
      throw new NotFoundError(`매핑을 찾을 수 없습니다`);
    }

    return {
      target_product_line_id: map.target_product_line_id,
      plan_key: map.plan_key,
      productLine: {
        target_product_line_id: map.productLine.target_product_line_id,
        target_division: map.productLine.target_division,
        target_product_line: map.productLine.target_product_line,
      },
      plan: {
        plan_key: map.plan.plan_key,
        tech_plan_name: map.plan.tech_plan_name,
      },
    };
  }

  async create(data: CreateProductLinePlanMapDto): Promise<ProductLinePlanMapResponseDto> {
    const lineExists = await prisma.target_Product_Line.findUnique({
      where: { target_product_line_id: data.target_product_line_id },
    });
    if (!lineExists) throw new ValidationError('제품군 라인이 존재하지 않습니다');

    const planExists = await prisma.tech_Secure_Plan.findUnique({
      where: { plan_key: data.plan_key },
    });
    if (!planExists) throw new ValidationError('기술계획이 존재하지 않습니다');

    const map = await prisma.target_product_line_plan_map.create({
      data: {
        target_product_line_id: data.target_product_line_id,
        plan_key: data.plan_key,
      },
      include: { productLine: true, plan: true },
    });

    return {
      target_product_line_id: map.target_product_line_id,
      plan_key: map.plan_key,
      productLine: {
        target_product_line_id: map.productLine.target_product_line_id,
        target_division: map.productLine.target_division,
        target_product_line: map.productLine.target_product_line,
      },
      plan: {
        plan_key: map.plan.plan_key,
        tech_plan_name: map.plan.tech_plan_name,
      },
    };
  }

  async delete(lineId: number, planKey: number): Promise<void> {
    const exists = await prisma.target_product_line_plan_map.findUnique({
      where: {
        target_product_line_id_plan_key: {
          target_product_line_id: lineId,
          plan_key: planKey,
        },
      },
    });

    if (!exists) throw new NotFoundError('매핑을 찾을 수 없습니다');

    await prisma.target_product_line_plan_map.delete({
      where: {
        target_product_line_id_plan_key: {
          target_product_line_id: lineId,
          plan_key: planKey,
        },
      },
    });
  }
}

export const productLinePlanMapService = new ProductLinePlanMapService();
