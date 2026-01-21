/**
 * 에러 처리 유틸리티
 * Prisma 에러를 사용자 친화적인 메시지로 변환합니다
 */

import { Prisma } from '@prisma/client';

/**
 * Prisma 에러를 처리하고 적절한 메시지를 반환합니다
 */
export function handlePrismaError(error: unknown): string {
  // Prisma 에러인 경우
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint 위반
        const field = (error.meta?.target as string[])?.join(', ') || '필드';
        return `이미 존재하는 ${field} 값입니다`;

      case 'P2003':
        // Foreign key constraint 위반
        return '참조하는 데이터가 존재하지 않습니다';

      case 'P2025':
        // Record not found
        return '요청한 데이터를 찾을 수 없습니다';

      case 'P2014':
        // Relation violation
        return '관련된 데이터와의 관계 제약을 위반했습니다';

      case 'P2023':
        // Invalid ID
        return '잘못된 ID 형식입니다';

      default:
        console.error('Prisma 에러:', error.code, error.message);
        return `데이터베이스 오류가 발생했습니다 (${error.code})`;
    }
  }

  // Prisma validation 에러
  if (error instanceof Prisma.PrismaClientValidationError) {
    return '입력 데이터의 형식이 올바르지 않습니다';
  }

  // 일반 에러
  if (error instanceof Error) {
    console.error('에러:', error.message);
    return error.message;
  }

  // 알 수 없는 에러
  console.error('알 수 없는 에러:', error);
  return '서버 오류가 발생했습니다';
}

/**
 * 외래키 존재 여부를 확인하는 헬퍼
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Not Found 에러
 */
export class NotFoundError extends Error {
  constructor(message: string = '요청한 리소스를 찾을 수 없습니다') {
    super(message);
    this.name = 'NotFoundError';
  }
}
