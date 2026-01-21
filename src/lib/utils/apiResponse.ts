/**
 * API 응답 헬퍼 유틸리티
 * 모든 API 엔드포인트에서 일관된 응답 형식을 제공합니다
 */

import { NextResponse } from 'next/server';
import { ApiResponse, HttpStatus } from '../types/common.types';

/**
 * 성공 응답 생성
 */
export function successResponse<T>(
  data: T,
  status: HttpStatus = HttpStatus.OK
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * 에러 응답 생성
 */
export function errorResponse(
  error: string,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

/**
 * 생성 성공 응답 (201 Created)
 */
export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return successResponse(data, HttpStatus.CREATED);
}

/**
 * Not Found 응답 (404)
 */
export function notFoundResponse(message: string = '요청한 리소스를 찾을 수 없습니다'): NextResponse<ApiResponse> {
  return errorResponse(message, HttpStatus.NOT_FOUND);
}

/**
 * Bad Request 응답 (400)
 */
export function badRequestResponse(message: string = '잘못된 요청입니다'): NextResponse<ApiResponse> {
  return errorResponse(message, HttpStatus.BAD_REQUEST);
}

/**
 * Conflict 응답 (409)
 */
export function conflictResponse(message: string = '충돌이 발생했습니다'): NextResponse<ApiResponse> {
  return errorResponse(message, HttpStatus.CONFLICT);
}
