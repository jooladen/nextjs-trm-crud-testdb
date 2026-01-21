데이터 처리 방식은 어떤 것을 선호하시나요? (기존 posts 예제는 Server Actions를 사용하고 있습니다)
  
❯ 1. API Routes (/api/*) (추천)
     RESTful API 엔드포인트로 서비스 레이어 분리에 더 적합합니다. 명확한 계층 구조를 만들 수 있습니다.
  2. Server Actions
     Next.js 19의 최신 방식으로 더 간단하지만, 서비스 레이어 분리가 덜 명확할 수 있습니다.
  3. 둘 다 혼용
     읽기는 Server Component, 쓰기는 API Routes 또는 Server Actions를 선택적으로 사용합니다.
  4. Type something.

  ---

  네, 알겠습니다! API Routes로 진행하고, 외래키는 Select/Dropdown으로 표시하겠습니다.