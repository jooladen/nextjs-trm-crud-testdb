/**
 * 📖 학습 포인트 4: Service Layer
 *
 * 이 파일은 "Service Layer"입니다.
 * 비즈니스 로직(실제 일을 처리하는 코드)이 여기 있어요.
 *
 * 🤔 왜 Service를 따로 만들까요?
 * - 재사용: 같은 코드를 여러 곳에서 쓸 수 있어요
 * - 정리: 코드가 깔끔하게 정리돼요
 * - 테스트: 테스트하기 쉬워져요
 *
 * 🔍 여기서 배울 것:
 * 1. Prisma ORM 사용법
 * 2. DTO 패턴 (데이터 형식 변환)
 * 3. 에러 처리
 */

import prisma from '../prisma';
import {
  CreateTargetProductDto,
  UpdateTargetProductDto,
  TargetProductResponseDto,
  TargetProductListItemDto,
  ProductLineReferenceDto,
} from '../types/targetProduct.types';
import { NotFoundError, ValidationError } from '../utils/errorHandler';

class TargetProductService {
  /**
   * 💡 메서드: findAll
   * 📍 실행 위치: 서버
   * ⏰ 타이밍: API Route에서 호출할 때
   *
   * 🎯 역할: 모든 타겟제품군 조회
   */
  async findAll(): Promise<TargetProductListItemDto[]> {
    // 💡 Step 1: Prisma로 DB에서 모든 제품 가져오기
    // include: 관련 테이블(productLine)도 같이 가져오기
    const products = await prisma.target_product.findMany({
      include: {
        productLine: {
          select: {
            target_division: true,
            target_product_line: true,
          },
        },
      },
      orderBy: {
        target_product_id: 'desc',  // 최신순 정렬
      },
    });

    // 💡 Step 2: DTO 변환 (필요한 필드만 추출)
    // 왜? DB 모델 그대로 반환하면 불필요한 정보가 많음
    return products.map((product) => ({
      target_product_id: product.target_product_id,
      target_product_name: product.target_product_name,
      deployment_date: product.deployment_date.toISOString(),  // Date → String
      productLine: product.productLine,
    }));
  }

  /**
   * ID로 타겟제품군 단건 조회
   */
  async findById(id: number): Promise<TargetProductResponseDto> {
    const product = await prisma.target_product.findUnique({
      where: { target_product_id: id },
      include: {
        productLine: true,
      },
    });

    if (!product) {
      throw new NotFoundError(`ID ${id}에 해당하는 타겟제품군을 찾을 수 없습니다`);
    }

    return {
      target_product_id: product.target_product_id,
      target_product_line_id: product.target_product_line_id,
      target_product_name: product.target_product_name,
      deployment_date: product.deployment_date.toISOString(),
      productLine: {
        target_product_line_id: product.productLine.target_product_line_id,
        target_division: product.productLine.target_division,
        target_product_line: product.productLine.target_product_line,
      },
    };
  }

  /**
   * 타겟제품군 생성
   */
  async create(data: CreateTargetProductDto): Promise<TargetProductResponseDto> {
    // 외래키 검증: 제품군이 존재하는지 확인
    const productLineExists = await prisma.target_Product_Line.findUnique({
      where: { target_product_line_id: data.target_product_line_id },
    });

    if (!productLineExists) {
      throw new ValidationError(
        `ID ${data.target_product_line_id}에 해당하는 제품군이 존재하지 않습니다`
      );
    }

    // 생성
    const product = await prisma.target_product.create({
      data: {
        target_product_line_id: data.target_product_line_id,
        target_product_name: data.target_product_name,
        deployment_date: new Date(data.deployment_date),
      },
      include: {
        productLine: true,
      },
    });

    return {
      target_product_id: product.target_product_id,
      target_product_line_id: product.target_product_line_id,
      target_product_name: product.target_product_name,
      deployment_date: product.deployment_date.toISOString(),
      productLine: {
        target_product_line_id: product.productLine.target_product_line_id,
        target_division: product.productLine.target_division,
        target_product_line: product.productLine.target_product_line,
      },
    };
  }

  /**
   * 타겟제품군 수정
   */
  async update(
    id: number,
    data: UpdateTargetProductDto
  ): Promise<TargetProductResponseDto> {
    // 존재 여부 확인
    const exists = await prisma.target_product.findUnique({
      where: { target_product_id: id },
    });

    if (!exists) {
      throw new NotFoundError(`ID ${id}에 해당하는 타겟제품군을 찾을 수 없습니다`);
    }

    // 제품군 변경 시 외래키 검증
    if (data.target_product_line_id !== undefined) {
      const productLineExists = await prisma.target_Product_Line.findUnique({
        where: { target_product_line_id: data.target_product_line_id },
      });

      if (!productLineExists) {
        throw new ValidationError(
          `ID ${data.target_product_line_id}에 해당하는 제품군이 존재하지 않습니다`
        );
      }
    }

    // 수정
    const product = await prisma.target_product.update({
      where: { target_product_id: id },
      data: {
        ...(data.target_product_line_id !== undefined && {
          target_product_line_id: data.target_product_line_id,
        }),
        ...(data.target_product_name !== undefined && {
          target_product_name: data.target_product_name,
        }),
        ...(data.deployment_date !== undefined && {
          deployment_date: new Date(data.deployment_date),
        }),
      },
      include: {
        productLine: true,
      },
    });

    return {
      target_product_id: product.target_product_id,
      target_product_line_id: product.target_product_line_id,
      target_product_name: product.target_product_name,
      deployment_date: product.deployment_date.toISOString(),
      productLine: {
        target_product_line_id: product.productLine.target_product_line_id,
        target_division: product.productLine.target_division,
        target_product_line: product.productLine.target_product_line,
      },
    };
  }

  /**
   * 타겟제품군 삭제
   */
  async delete(id: number): Promise<void> {
    // 존재 여부 확인
    const exists = await prisma.target_product.findUnique({
      where: { target_product_id: id },
    });

    if (!exists) {
      throw new NotFoundError(`ID ${id}에 해당하는 타겟제품군을 찾을 수 없습니다`);
    }

    // 삭제
    await prisma.target_product.delete({
      where: { target_product_id: id },
    });
  }

  /**
   * 제품군 참조 데이터 조회 (드롭다운용)
   */
  async getProductLineReferences(): Promise<ProductLineReferenceDto[]> {
    const productLines = await prisma.target_Product_Line.findMany({
      select: {
        target_product_line_id: true,
        target_division: true,
        target_product_line: true,
      },
      orderBy: [
        { target_division: 'asc' },
        { target_product_line: 'asc' },
      ],
    });

    return productLines;
  }
}

// 싱글톤 인스턴스 export
export const targetProductService = new TargetProductService();
