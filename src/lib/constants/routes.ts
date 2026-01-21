/**
 * 애플리케이션 라우트 상수
 * 하드코딩을 방지하고 라우트 변경 시 한 곳에서만 수정하도록 합니다
 */

export const ROUTES = {
  // TRM 메인
  TRM: {
    ROOT: '/trm',

    // 타겟제품군
    TARGET_PRODUCTS: {
      LIST: '/trm/target-products',
      NEW: '/trm/target-products/new',
      EDIT: (id: number) => `/trm/target-products/${id}/edit`,
    },

    // 기술확보계획
    TECH_SECURE_PLANS: {
      LIST: '/trm/tech-secure-plans',
      NEW: '/trm/tech-secure-plans/new',
      EDIT: (id: number) => `/trm/tech-secure-plans/${id}/edit`,
    },

    // 타겟제품군 라인
    TARGET_PRODUCT_LINES: {
      LIST: '/trm/target-product-lines',
      NEW: '/trm/target-product-lines/new',
      EDIT: (id: number) => `/trm/target-product-lines/${id}/edit`,
    },

    // 카테고리 시스템
    CATEGORY_SYSTEM: {
      LIST: '/trm/category-system',
      NEW: '/trm/category-system/new',
      EDIT: (id: number) => `/trm/category-system/${id}/edit`,
    },

    // 제품군-계획 매핑
    PRODUCT_LINE_PLAN_MAP: {
      LIST: '/trm/product-line-plan-map',
      NEW: '/trm/product-line-plan-map/new',
      EDIT: (id: number) => `/trm/product-line-plan-map/${id}/edit`,
    },
  },

  // API 엔드포인트
  API: {
    TARGET_PRODUCTS: {
      BASE: '/api/target-products',
      BY_ID: (id: number) => `/api/target-products/${id}`,
    },

    TECH_SECURE_PLANS: {
      BASE: '/api/tech-secure-plans',
      BY_ID: (id: number) => `/api/tech-secure-plans/${id}`,
    },

    TARGET_PRODUCT_LINES: {
      BASE: '/api/target-product-lines',
      BY_ID: (id: number) => `/api/target-product-lines/${id}`,
    },

    CATEGORY_SYSTEM: {
      BASE: '/api/category-system',
      BY_ID: (id: number) => `/api/category-system/${id}`,
    },

    PRODUCT_LINE_PLAN_MAP: {
      BASE: '/api/product-line-plan-map',
      BY_ID: (id: number) => `/api/product-line-plan-map/${id}`,
    },

    REFERENCE_DATA: {
      PRODUCT_LINES: '/api/reference-data/product-lines',
      CATEGORIES: '/api/reference-data/categories',
    },
  },
} as const;
