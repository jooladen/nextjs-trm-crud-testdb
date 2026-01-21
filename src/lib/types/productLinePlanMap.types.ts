/**
 * 제품군-계획 매핑(Target_product_line_plan_map) DTO 타입 정의
 */

export interface CreateProductLinePlanMapDto {
  target_product_line_id: number;
  plan_key: number;
}

export interface ProductLinePlanMapResponseDto {
  target_product_line_id: number;
  plan_key: number;
  productLine: {
    target_product_line_id: number;
    target_division: string;
    target_product_line: string;
  };
  plan: {
    plan_key: number;
    tech_plan_name: string;
  };
}

export interface ProductLinePlanMapListItemDto {
  target_product_line_id: number;
  plan_key: number;
  productLineName: string;
  planName: string;
}
