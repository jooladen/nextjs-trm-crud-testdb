/**
 * 기술확보계획(Tech_Secure_Plan) DTO 타입 정의
 */

/**
 * 기술확보계획 생성 요청 DTO
 */
export interface CreateTechSecurePlanDto {
  category_id: number;
  tech_plan_name: string;
}

/**
 * 기술확보계획 수정 요청 DTO
 */
export interface UpdateTechSecurePlanDto {
  category_id?: number;
  tech_plan_name?: string;
}

/**
 * 카테고리 참조 데이터 (드롭다운용)
 */
export interface CategoryReferenceDto {
  category_id: number;
  category_level: number;
  tech_name: string;
}

/**
 * 기술확보계획 상세 응답 DTO (관계 포함)
 */
export interface TechSecurePlanResponseDto {
  plan_key: number;
  category_id: number;
  tech_plan_name: string;
  category: {
    category_id: number;
    category_level: number;
    tech_name: string;
  };
}

/**
 * 기술확보계획 목록 항목 DTO
 */
export interface TechSecurePlanListItemDto {
  plan_key: number;
  tech_plan_name: string;
  category: {
    tech_name: string;
    category_level: number;
  };
}
