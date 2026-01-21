/**
 * 타겟제품군 라인(Target_Product_Line) DTO 타입 정의
 */

/**
 * 타겟제품군 라인 생성 요청 DTO
 */
export interface CreateTargetProductLineDto {
  target_division: string;
  target_product_line: string;
}

/**
 * 타겟제품군 라인 수정 요청 DTO
 */
export interface UpdateTargetProductLineDto {
  target_division?: string;
  target_product_line?: string;
}

/**
 * 타겟제품군 라인 상세 응답 DTO
 */
export interface TargetProductLineResponseDto {
  target_product_line_id: number;
  target_division: string;
  target_product_line: string;
  _count?: {
    products: number;
  };
}

/**
 * 타겟제품군 라인 목록 항목 DTO
 */
export interface TargetProductLineListItemDto {
  target_product_line_id: number;
  target_division: string;
  target_product_line: string;
  productCount: number;
}
