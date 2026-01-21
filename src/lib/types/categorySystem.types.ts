/**
 * 카테고리 시스템(Category_System) DTO 타입 정의
 */

export interface CreateCategorySystemDto {
  category_id: number;
  category_level: number;
  tech_name: string;
  link_id?: number | null;
}

export interface UpdateCategorySystemDto {
  category_level?: number;
  tech_name?: string;
  link_id?: number | null;
}

export interface CategorySystemResponseDto {
  category_id: number;
  category_level: number;
  tech_name: string;
  link_id: number | null;
  parent?: {
    category_id: number;
    tech_name: string;
  } | null;
  _count?: {
    children: number;
    techPlans: number;
  };
}

export interface CategorySystemListItemDto {
  category_id: number;
  category_level: number;
  tech_name: string;
  parentName: string | null;
  childCount: number;
  planCount: number;
}
