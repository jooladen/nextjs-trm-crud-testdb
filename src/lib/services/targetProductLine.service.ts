/**
 * 타겟제품군 라인(Target_Product_Line) 서비스
 */

import prisma from '../prisma';
import {
  CreateTargetProductLineDto,
  UpdateTargetProductLineDto,
  TargetProductLineResponseDto,
  TargetProductLineListItemDto,
} from '../types/targetProductLine.types';
import { NotFoundError, ValidationError } from '../utils/errorHandler';

class TargetProductLineService {
  /**
   * 모든 타겟제품군 라인 조회
   */
  async findAll(): Promise<TargetProductLineListItemDto[]> {
    const productLines = await prisma.target_Product_Line.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [
        { target_division: 'asc' },
        { target_product_line: 'asc' },
      ],
    });

    return productLines.map((line) => ({
      target_product_line_id: line.target_product_line_id,
      target_division: line.target_division,
      target_product_line: line.target_product_line,
      productCount: line._count.products,
    }));
  }

  /**
   * ID로 타겟제품군 라인 단건 조회
   */
  async findById(id: number): Promise<TargetProductLineResponseDto> {
    const productLine = await prisma.target_Product_Line.findUnique({
      where: { target_product_line_id: id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!productLine) {
      throw new NotFoundError(`ID ${id}에 해당하는 타겟제품군 라인을 찾을 수 없습니다`);
    }

    return {
      target_product_line_id: productLine.target_product_line_id,
      target_division: productLine.target_division,
      target_product_line: productLine.target_product_line,
      _count: {
        products: productLine._count.products,
      },
    };
  }

  /**
   * 타겟제품군 라인 생성
   */
  async create(data: CreateTargetProductLineDto): Promise<TargetProductLineResponseDto> {
    const productLine = await prisma.target_Product_Line.create({
      data: {
        target_division: data.target_division,
        target_product_line: data.target_product_line,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return {
      target_product_line_id: productLine.target_product_line_id,
      target_division: productLine.target_division,
      target_product_line: productLine.target_product_line,
      _count: {
        products: productLine._count.products,
      },
    };
  }

  /**
   * 타겟제품군 라인 수정
   */
  async update(
    id: number,
    data: UpdateTargetProductLineDto
  ): Promise<TargetProductLineResponseDto> {
    // 존재 여부 확인
    const exists = await prisma.target_Product_Line.findUnique({
      where: { target_product_line_id: id },
    });

    if (!exists) {
      throw new NotFoundError(`ID ${id}에 해당하는 타겟제품군 라인을 찾을 수 없습니다`);
    }

    const productLine = await prisma.target_Product_Line.update({
      where: { target_product_line_id: id },
      data: {
        ...(data.target_division !== undefined && {
          target_division: data.target_division,
        }),
        ...(data.target_product_line !== undefined && {
          target_product_line: data.target_product_line,
        }),
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return {
      target_product_line_id: productLine.target_product_line_id,
      target_division: productLine.target_division,
      target_product_line: productLine.target_product_line,
      _count: {
        products: productLine._count.products,
      },
    };
  }

  /**
   * 타겟제품군 라인 삭제
   * 관련 제품이 있으면 삭제 불가
   */
  async delete(id: number): Promise<void> {
    // 존재 여부 확인
    const exists = await prisma.target_Product_Line.findUnique({
      where: { target_product_line_id: id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!exists) {
      throw new NotFoundError(`ID ${id}에 해당하는 타겟제품군 라인을 찾을 수 없습니다`);
    }

    // 관련 제품 확인
    if (exists._count.products > 0) {
      throw new ValidationError(
        `이 제품군 라인은 ${exists._count.products}개의 제품에서 사용 중이므로 삭제할 수 없습니다`
      );
    }

    await prisma.target_Product_Line.delete({
      where: { target_product_line_id: id },
    });
  }
}

export const targetProductLineService = new TargetProductLineService();
