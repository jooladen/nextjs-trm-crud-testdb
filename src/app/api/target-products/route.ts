/**
 * 📖 학습 포인트 3: API Route
 *
 * 이 파일은 "API Route"입니다.
 * 브라우저가 /api/target-products로 요청하면 여기가 실행됩니다.
 *
 * 🤔 왜 API Route를 쓸까요?
 * - 중간 다리: 프론트엔드와 데이터베이스 사이를 연결해요
 * - 보안: 데이터베이스를 직접 노출하지 않아요
 * - 검증: 잘못된 요청을 걸러낼 수 있어요
 *
 * 🔍 여기서 배울 것:
 * 1. GET/POST 메서드 구분
 * 2. 에러 처리 방법
 * 3. JSON 응답 형식
 */

import { NextRequest } from 'next/server';
import { targetProductService } from '@/lib/services/targetProduct.service';
import {
  successResponse,
  createdResponse,
  errorResponse,
  badRequestResponse,
} from '@/lib/utils/apiResponse';
import { handlePrismaError, ValidationError } from '@/lib/utils/errorHandler';
import { CreateTargetProductDto } from '@/lib/types/targetProduct.types';

/**
 * 💡 GET /api/target-products
 * 📍 실행 위치: 서버
 * ⏰ 타이밍: serverFetch가 이 경로로 요청할 때
 *
 * 🎯 역할: 모든 타겟제품 목록 조회
 */
export async function GET() {
  try {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> [API] GET /api/target-products");

    // 💡 Step 1: Service Layer 호출
    // Service가 실제 DB 조회를 담당합니다
    const products = await targetProductService.findAll();
    console.log(`[API] Fetched ${products.length} target products`);

    // 💡 Step 2: 성공 응답 반환
    // { success: true, data: [...] } 형식으로 반환
    return successResponse(products);
  } catch (error) {
    // 💡 Step 3: 에러 처리
    // 에러가 나도 적절한 응답을 보냅니다
    console.error('[API] Error fetching target products:', error);
    return errorResponse(handlePrismaError(error));
  }
}

/**
 * 💡 POST /api/target-products
 * 📍 실행 위치: 서버
 * ⏰ 타이밍: 폼에서 제출 버튼을 클릭할 때
 *
 * 🎯 역할: 새로운 타겟제품 생성
 */
export async function POST(request: NextRequest) {
  try {
    // 💡 Step 1: 요청 본문(body) 읽기
    // 클라이언트가 보낸 JSON 데이터를 파싱합니다
    const body = await request.json();

    // 💡 Step 2: 필수 필드 검증
    // 잘못된 요청은 여기서 걸러냅니다
    if (!body.target_product_line_id || !body.target_product_name || !body.deployment_date) {
      // 400 Bad Request 응답
      return badRequestResponse('필수 필드가 누락되었습니다');
    }

    // 💡 Step 3: DTO로 변환
    // DTO (Data Transfer Object): 데이터 전송 형식
    const dto: CreateTargetProductDto = {
      target_product_line_id: Number(body.target_product_line_id),
      target_product_name: body.target_product_name,
      deployment_date: body.deployment_date,
    };

    // 💡 Step 4: Service Layer 호출
    // Service가 실제 DB 저장을 담당합니다
    const product = await targetProductService.create(dto);

    // 💡 Step 5: 성공 응답 반환
    // 201 Created 상태 코드와 함께 생성된 데이터 반환
    return createdResponse(product);
  } catch (error) {
    // 💡 Step 6: 에러 타입별 처리
    if (error instanceof ValidationError) {
      // 검증 에러: 400 Bad Request
      return badRequestResponse(error.message);
    }
    // 기타 에러: 500 Internal Server Error
    return errorResponse(handlePrismaError(error));
  }
}

/**
 * 🎓 이 파일에서 배운 것:
 *
 * ✅ GET 메서드: 데이터 조회
 * ✅ POST 메서드: 데이터 생성
 * ✅ try-catch로 에러 처리
 * ✅ Service Layer에 로직 위임
 * ✅ 일관된 응답 형식 ({ success: true/false, data/error })
 * ✅ HTTP 상태 코드 (200, 201, 400, 500)
 *
 * 💡 응답 형식:
 * - 성공: { success: true, data: {...} }
 * - 실패: { success: false, error: "..." }
 *
 * 💡 다음 파일:
 * Service Layer를 보면 실제 비즈니스 로직이 어떻게 작동하는지 알 수 있어요!
 */
