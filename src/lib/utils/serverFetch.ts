/**
 * Server-side fetch utility for calling own API routes
 *
 * This utility provides consistent error handling and base URL management
 * for Server Components that need to call our own API routes.
 *
 * Key design decisions to consider:
 * - How to handle errors (throw vs return)
 * - Cache strategy (no-store vs revalidate)
 * - Base URL configuration
 * - Response format validation
 */

/**
 * Fetches data from our own API routes in Server Components
 *
 * @template T - The expected data type
 * @param endpoint - API endpoint path (e.g., '/api/target-products')
 * @param options - Additional fetch options
 * @returns The data from the API response
 * @throws Error if the request fails or response is invalid
 */
export async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // 1. Construct full URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}${endpoint}`;

  // 2. Make fetch request with no-store cache for real-time data
  const response = await fetch(url, {
    cache: 'no-store', // Always get fresh data
    ...options,
  });

  // 3. Check HTTP response status
  if (!response.ok) {
    throw new Error(
      `API 요청 실패: ${response.status} ${response.statusText}`
    );
  }

  // 4. Parse and validate JSON response
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'API 요청 실패');
  }

  // 5. Return the data
  return result.data;
}
