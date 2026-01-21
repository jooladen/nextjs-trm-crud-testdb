/**
 * 타겟제품군(Target_Product) DTO 타입 정의
 */

/**
 * 타겟제품군 생성 요청 DTO
 */
export interface CreateTargetProductDto {
  target_product_line_id: number;
  target_product_name: string;
  deployment_date: string; // ISO 날짜 문자열 (프론트엔드에서 전송)
}

/**
 * 타겟제품군 수정 요청 DTO
 */
export interface UpdateTargetProductDto {
  target_product_line_id?: number;
  target_product_name?: string;
  deployment_date?: string; // ISO 날짜 문자열
}

/**
 * 제품군 참조 데이터 (드롭다운용)
 */
export interface ProductLineReferenceDto {
  target_product_line_id: number;
  target_division: string;
  target_product_line: string;
}

/**
 * 타겟제품군 상세 응답 DTO (관계 포함)
 */
export interface TargetProductResponseDto {
  target_product_id: number;
  target_product_line_id: number;
  target_product_name: string;
  deployment_date: string; // ISO 날짜 문자열
  productLine: {
    target_product_line_id: number;
    target_division: string;
    target_product_line: string;
  };
}

/**
 * 타겟제품군 목록 항목 DTO
 */
export interface TargetProductListItemDto {
  target_product_id: number;
  target_product_name: string;
  deployment_date: string;
  productLine: {
    target_division: string;
    target_product_line: string;
  };
}
