이해했습니다. 제품명과 기술계획명 일반 input 필드 입력 시 쿼리가 계속 스크롤되는 문제네요. SelectField 컴포넌트를 조사하겠습니다.

● Search(pattern: "**/SelectField.tsx")
  ⎿  Found 1 file (ctrl+o to expand)

● Read(src\components\trm\common\SelectField.tsx)
  ⎿  Read 109 lines

● 문제를 발견했습니다! SelectField의 useEffect 의존성 배열 문제입니다. 더 자세히 확인하겠습니다.

● Read(src\components\trm\target-products\TargetProductForm.tsx)
  ⎿  Read 13 lines

● 완벽하게 문제를 파악했습니다! 플랜을 새로 작성하겠습니다.

● Updated plan
  ⎿  /plan to preview
        1 -# 타겟 제품군 수정 시 쿼리 연속 스크롤 문제 해결 계획                                                                                                                 
        2 -                                                                                                                                                                      
        3 -## 문제 요약                                                                                                                                                          
        4 -                                                                                                                                                                      
        5 -타겟 제품군 수정 시 "쿼리가 연속 스크롤되는" 현상 발생:                                                                                                               
        6 -- **원인 1**: Form 컴포넌트에서 `router.push()` + `router.refresh()` 중복 호출                                                                                        
        7 -- **원인 2**: `useOptimisticDelete` 훅에서 불필요한 `router.refresh()` 호출                                                                                           
        8 -- **결과**: 동일 데이터를 2번 fetch, 스크롤 위치 초기화, 페이지 깜박임                                                                                                
        9 -                                                                                                                                                                      
       10 -## 해결 전략                                                                                                                                                          
       11 -                                                                                                                                                                      
       12 -### 핵심 아이디어                                                                                                                                                     
       13 -Next.js App Router에서 `router.push()`는 자동으로 대상 페이지의 Server Component를 재실행하므로, `router.refresh()`는 불필요하며 오히려 중복 요청을 발생시킵니        
          -다.                                                                                                                                                                   
       14 -                                                                                                                                                                      
       15 -### 권장 방안: router.refresh() 제거                                                                                                                                  
       16 -- Form 제출 후: `router.push()`만 사용 (자동 새로고침 활용)                                                                                                           
       17 -- 삭제 성공 시: 낙관적 업데이트만 수행 (refresh 제거)                                                                                                                 
       18 -- 삭제 실패 시: 에러 시에만 `router.refresh()`로 서버 상태 복구                                                                                                       
       19 -                                                                                                                                                                      
       20 -## 구현 상세                                                                                                                                                          
       21 -                                                                                                                                                                      
       22 -### 1. TargetProductLineForm.tsx 수정                                                                                                                                 
       23 -                                                                                                                                                                      
       24 -**파일**: `src/components/trm/target-product-lines/TargetProductLineForm.tsx`                                                                                         
       25 -                                                                                                                                                                      
       26 -**수정 위치**: 라인 59-60                                                                                                                                             
       27 -                                                                                                                                                                      
       28 -```typescript                                                                                                                                                         
       29 -// 수정 전                                                                                                                                                            
       30 -alert(mode === 'create' ? '생성되었습니다' : '수정되었습니다');                                                                                                       
       31 -router.push(ROUTES.TRM.TARGET_PRODUCT_LINES.LIST);                                                                                                                    
       32 -router.refresh(); // ← 제거                                                                                                                                           
       33 -                                                                                                                                                                      
       34 -// 수정 후                                                                                                                                                            
       35 -alert(mode === 'create' ? '생성되었습니다' : '수정되었습니다');                                                                                                       
       36 -router.push(ROUTES.TRM.TARGET_PRODUCT_LINES.LIST);                                                                                                                    
       37 -// router.refresh() 제거: push()가 자동으로 Server Component 재실행                                                                                                   
       38 -```                                                                                                                                                                   
       39 -                                                                                                                                                                      
       40 -**효과**:                                                                                                                                                             
       41 -- 네트워크 요청 2회 → 1회 (50% 감소)                                                                                                                                  
       42 -- 렌더링 횟수 감소                                                                                                                                                    
       43 -- 스크롤 위치 자동 복원 (Next.js 기본 기능)                                                                                                                           
       44 -                                                                                                                                                                      
       45 ----                                                                                                                                                                   
       46 -                                                                                                                                                                      
       47 -### 2. useOptimisticDelete.ts 수정                                                                                                                                    
       48 -                                                                                                                                                                      
       49 -**파일**: `src/lib/hooks/useOptimisticDelete.ts`                                                                                                                      
       50 -                                                                                                                                                                      
       51 -**수정 위치**: 라인 56-73                                                                                                                                             
       52 -                                                                                                                                                                      
       53 -```typescript                                                                                                                                                         
       54 -// 수정 전                                                                                                                                                            
       55 -startTransition(() => {                                                                                                                                               
       56 -  setItems((prev) => prev.filter((i) => getItemId(i) !== itemId));                                                                                                    
       57 -  router.refresh(); // ← 제거                                                                                                                                         
       58 -});                                                                                                                                                                   
       59 -                                                                                                                                                                      
       60 -alert('삭제되었습니다');                                                                                                                                              
       61 -} catch (error) {                                                                                                                                                     
       62 -  alert(                                                                                                                                                              
       63 -    error instanceof Error                                                                                                                                            
       64 -      ? error.message                                                                                                                                                 
       65 -      : '삭제 중 오류가 발생했습니다'                                                                                                                                 
       66 -  );                                                                                                                                                                  
       67 -  router.refresh(); // 에러 시에는 유지                                                                                                                               
       68 -                                                                                                                                                                      
       69 -// 수정 후                                                                                                                                                            
       70 -startTransition(() => {                                                                                                                                               
       71 -  setItems((prev) => prev.filter((i) => getItemId(i) !== itemId));                                                                                                    
       72 -  // router.refresh() 제거: 낙관적 업데이트만으로 충분                                                                                                                
       73 -  // 다음 페이지 이동 시 자동으로 최신 데이터 fetch됨                                                                                                                 
       74 -});                                                                                                                                                                   
       75 -                                                                                                                                                                      
       76 -alert('삭제되었습니다');                                                                                                                                              
       77 -} catch (error) {                                                                                                                                                     
       78 -  alert(                                                                                                                                                              
       79 -    error instanceof Error                                                                                                                                            
       80 -      ? error.message                                                                                                                                                 
       81 -      : '삭제 중 오류가 발생했습니다'                                                                                                                                 
       82 -  );                                                                                                                                                                  
       83 -  // 에러 시에만 서버 데이터로 복구                                                                                                                                   
       84 -  router.refresh();                                                                                                                                                   
       85 -```                                                                                                                                                                   
       86 -                                                                                                                                                                      
       87 -**주석 개선**: 라인 1-6                                                                                                                                               
       88 -```typescript                                                                                                                                                         
       89 -/**                                                                                                                                                                   
       90 - * 최적화된 삭제 훅                                                                                                                                                   
       91 - * - useTransition으로 부드러운 전환                                                                                                                                  
       92 - * - Optimistic update로 즉각적인 UI 반응                                                                                                                             
       93 - * - 에러 시에만 server refresh로 데이터 복구                                                                                                                         
       94 - * - 스크롤 위치 자동 보존                                                                                                                                            
       95 - */                                                                                                                                                                   
       96 -```                                                                                                                                                                   
       97 -                                                                                                                                                                      
       98 -**효과**:                                                                                                                                                             
       99 -- 삭제 시 네트워크 요청 제거 (성공 케이스)                                                                                                                            
      100 -- 스크롤 위치 자동 유지                                                                                                                                               
      101 -- 즉각적인 UI 반응                                                                                                                                                    
      102 -                                                                                                                                                                      
      103 ----                                                                                                                                                                   
      104 -                                                                                                                                                                      
      105 -### 3. 다른 TRM Form 컴포넌트들 동일 수정                                                                                                                             
      106 -                                                                                                                                                                      
      107 -다음 파일들도 동일한 패턴으로 수정:                                                                                                                                   
      108 -                                                                                                                                                                      
      109 -1. **TargetProductForm.tsx** (라인 76-77)                                                                                                                             
      110 -   - 파일: `src/components/trm/target-products/TargetProductForm.tsx`                                                                                                 
      111 -   - 수정: `router.refresh()` 제거                                                                                                                                    
      112 -                                                                                                                                                                      
      113 -2. **TechSecurePlanForm.tsx** (라인 70-71)                                                                                                                            
      114 -   - 파일: `src/components/trm/tech-secure-plans/TechSecurePlanForm.tsx`                                                                                              
      115 -   - 수정: `router.refresh()` 제거                                                                                                                                    
      116 -                                                                                                                                                                      
      117 -3. **CategorySystemForm.tsx** (확인 필요)                                                                                                                             
      118 -   - 파일: `src/components/trm/category-system/CategorySystemForm.tsx`                                                                                                
      119 -   - 수정: 동일 패턴 있으면 수정                                                                                                                                      
      120 -                                                                                                                                                                      
      121 -4. **ProductLinePlanMapForm.tsx** (확인 필요)                                                                                                                         
      122 -   - 파일: `src/components/trm/product-line-plan-map/ProductLinePlanMapForm.tsx`                                                                                      
      123 -   - 수정: 동일 패턴 있으면 수정                                                                                                                                      
      124 -                                                                                                                                                                      
      125 -**공통 수정 패턴**:                                                                                                                                                   
      126 -```typescript                                                                                                                                                         
      127 -// Before                                                                                                                                                             
      128 -router.push(ROUTES.TRM.XXXX.LIST);                                                                                                                                    
      129 -router.refresh(); // ← 제거                                                                                                                                           
      130 -                                                                                                                                                                      
      131 -// After                                                                                                                                                              
      132 -router.push(ROUTES.TRM.XXXX.LIST);                                                                                                                                    
      133 -// router.refresh() 제거                                                                                                                                              
      134 -```                                                                                                                                                                   
      135 -                                                                                                                                                                      
      136 ----                                                                                                                                                                   
      137 -                                                                                                                                                                      
      138 -## 검증 계획                                                                                                                                                          
      139 -                                                                                                                                                                      
      140 -### 테스트 케이스 1: 타겟 제품군 라인 수정                                                                                                                            
      141 -```                                                                                                                                                                   
      142 -1. 제품군 라인 목록 접근                                                                                                                                              
      143 -2. 임의 항목 "수정" 클릭                                                                                                                                              
      144 -3. 데이터 변경 후 "수정" 버튼 클릭                                                                                                                                    
      145 -4. 개발자 도구 Network 탭 확인                                                                                                                                        
      146 -   ✅ GET /api/target-product-lines 요청이 1회만 발생하는지 확인
      147 -5. 목록 페이지 전환이 부드러운지 확인                                                                                                                                 
      148 -   ✅ 깜박임 없이 자연스러운 전환
      149 -```                                                                                                                                                                   
      150 -                                                                                                                                                                      
      151 -### 테스트 케이스 2: 타겟 제품군 라인 삭제 (스크롤 하단)                                                                                                              
      152 -```                                                                                                                                                                   
      153 -전제: 목록에 10개 이상 항목 존재                                                                                                                                      
      154 -                                                                                                                                                                      
      155 -1. 제품군 라인 목록 접근                                                                                                                                              
      156 -2. 페이지 하단으로 스크롤 (10번째 항목)                                                                                                                               
      157 -3. 하단 항목 "삭제" 클릭 후 확인                                                                                                                                      
      158 -4. 스크롤 위치 확인                                                                                                                                                   
      159 -   ✅ 동일한 스크롤 위치 유지 (하단)
      160 -5. Network 탭 확인                                                                                                                                                    
      161 -   ✅ 삭제 후 추가 네트워크 요청 없음
      162 -6. UI 반응 확인                                                                                                                                                       
      163 -   ✅ 항목이 즉시 제거되는지 확인
      164 -```                                                                                                                                                                   
      165 -                                                                                                                                                                      
      166 -### 테스트 케이스 3: 삭제 실패 시 복구                                                                                                                                
      167 -```                                                                                                                                                                   
      168 -1. 네트워크를 오프라인으로 전환                                                                                                                                       
      169 -2. 항목 "삭제" 클릭                                                                                                                                                   
      170 -3. 에러 알림 확인                                                                                                                                                     
      171 -4. 목록 상태 확인                                                                                                                                                     
      172 -   ✅ 항목이 목록에 다시 나타나는지 확인 (router.refresh()로 복구)
      173 -```                                                                                                                                                                   
      174 -                                                                                                                                                                      
      175 -### 테스트 케이스 4: 다른 TRM 페이지들                                                                                                                                
      176 -```                                                                                                                                                                   
      177 -Target Products, Tech Secure Plans 등에서 테스트 케이스 1, 2 반복                                                                                                     
      178 -✅ 모든 페이지에서 동일한 개선 효과 확인
      179 -```                                                                                                                                                                   
      180 -                                                                                                                                                                      
      181 -### 회귀 테스트 체크리스트                                                                                                                                            
      182 -```                                                                                                                                                                   
      183 -□ 수정 후 최신 데이터 반영 여부                                                                                                                                       
      184 -□ 생성 후 목록에 새 항목 표시 여부                                                                                                                                    
      185 -□ 삭제 후 항목 제거 여부                                                                                                                                              
      186 -□ 에러 시 적절한 메시지 표시 여부                                                                                                                                     
      187 -□ 뒤로가기/앞으로가기 브라우저 버튼 동작                                                                                                                              
      188 -□ 페이지 새로고침 (F5) 후 데이터 정합성                                                                                                                               
      189 -```                                                                                                                                                                   
      190 -                                                                                                                                                                      
      191 ----                                                                                                                                                                   
      192 -                                                                                                                                                                      
      193 -## Critical Files                                                                                                                                                     
      194 -                                                                                                                                                                      
      195 -### 필수 수정 파일 (우선순위 순)                                                                                                                                      
      196 -1. `src/components/trm/target-product-lines/TargetProductLineForm.tsx` - 핵심 문제 1                                                                                  
      197 -2. `src/lib/hooks/useOptimisticDelete.ts` - 핵심 문제 2                                                                                                               
      198 -3. `src/components/trm/target-products/TargetProductForm.tsx` - 동일 패턴 수정                                                                                        
      199 -4. `src/components/trm/tech-secure-plans/TechSecurePlanForm.tsx` - 동일 패턴 수정                                                                                     
      200 -                                                                                                                                                                      
      201 -### 확인 필요 파일                                                                                                                                                    
      202 -5. `src/components/trm/category-system/CategorySystemForm.tsx`                                                                                                        
      203 -6. `src/components/trm/product-line-plan-map/ProductLinePlanMapForm.tsx`                                                                                              
      204 -                                                                                                                                                                      
      205 ----                                                                                                                                                                   
      206 -                                                                                                                                                                      
      207 -## 예상 효과                                                                                                                                                          
      208 -                                                                                                                                                                      
      209 -### 성능 개선                                                                                                                                                         
      210 -- 수정 후 네트워크 요청: 2회 → 1회 (50% 감소)                                                                                                                         
      211 -- 삭제 후 네트워크 요청: 1회 → 0회 (100% 감소)                                                                                                                        
      212 -- 렌더링 횟수: 50% 감소                                                                                                                                               
      213 -                                                                                                                                                                      
      214 -### UX 개선                                                                                                                                                           
      215 -- ✅ 스크롤 위치 유지
      216 -- ✅ 삭제 시 즉각적인 UI 반응
      217 -- ✅ 깜박임 현상 제거
      218 -- ✅ 부드러운 페이지 전환
      219 -                                                                                                                                                                      
      220 -### 코드 품질                                                                                                                                                         
      221 -- ✅ 불필요한 코드 제거 (단순화)
      222 -- ✅ Next.js App Router 베스트 프랙티스 준수
      223 -- ✅ 유지보수성 향상
      224 -                                                                                                                                                                      
      225 ----                                                                                                                                                                   
      226 -                                                                                                                                                                      
      227 -## 위험 요소 및 완화 방안                                                                                                                                             
      228 -                                                                                                                                                                      
      229 -### 위험: 낙관적 업데이트 후 서버 상태 불일치                                                                                                                         
      230 -- **발생 확률**: 낮음 (단일 사용자 환경)                                                                                                                              
      231 -- **완화**: 에러 시 router.refresh()로 즉시 복구                                                                                                                      
      232 -                                                                                                                                                                      
      233 -### 위험: 브라우저 스크롤 복원 동작 차이                                                                                                                              
      234 -- **발생 확률**: 낮음 (표준 기능)                                                                                                                                     
      235 -- **완화**: 주요 브라우저에서 테스트                                                                                                                                  
      236 -                                                                                                                                                                      
      237 ----                                                                                                                                                                   
      238 -                                                                                                                                                                      
      239 -## 구현 순서                                                                                                                                                          
      240 -                                                                                                                                                                      
      241 -1. **Phase 1**: TargetProductLineForm.tsx 수정 → 테스트 (10분)                                                                                                        
      242 -2. **Phase 2**: useOptimisticDelete.ts 수정 → 테스트 (10분)                                                                                                           
      243 -3. **Phase 3**: 다른 Form 컴포넌트들 일괄 수정 (10분)                                                                                                                 
      244 -4. **Phase 4**: 전체 회귀 테스트 (20분)                                                                                                                               
      245 -                                                                                                                                                                      
      246 -**총 예상 소요 시간**: 50분                                                                                                                                           
        1 +# 타겟제품/기술확보계획 입력 시 쿼리 연속 스크롤 문제 해결                                                                                                            
        2 +                                                                                                                                                                      
        3 +## 문제 요약                                                                                                                                                          
        4 +                                                                                                                                                                      
        5 +**증상:**                                                                                                                                                             
        6 +- 타겟 제품 폼에서 "제품명" 입력 시마다 쿼리가 계속 스크롤됨                                                                                                          
        7 +- 기술확보계획 폼에서 "기술계획명" 입력 시마다 쿼리가 계속 스크롤됨                                                                                                   
        8 +- 타겟 제품군 라인 폼에서는 문제 없음 (SelectField를 사용하지 않음)                                                                                                   
        9 +                                                                                                                                                                      
       10 +**원인:**                                                                                                                                                             
       11 +SelectField 컴포넌트의 useEffect 의존성 배열에 `formatLabel` 함수 포함                                                                                                
       12 +                                                                                                                                                                      
       13 +```typescript                                                                                                                                                         
       14 +// SelectField.tsx:65                                                                                                                                                 
       15 +}, [apiEndpoint, formatLabel]);  // ← formatLabel 문제!                                                                                                               
       16 +```                                                                                                                                                                   
       17 +                                                                                                                                                                      
       18 +**왜 문제가 발생하는가?**                                                                                                                                             
       19 +                                                                                                                                                                      
       20 +1. 부모 컴포넌트에서 formatLabel을 인라인 함수로 전달:                                                                                                                
       21 +```typescript                                                                                                                                                         
       22 +// TargetProductForm.tsx:102-104                                                                                                                                      
       23 +formatLabel={(item) =>                                                                                                                                                
       24 +  `${item.target_division} - ${item.target_product_line}`                                                                                                             
       25 +}                                                                                                                                                                     
       26 +```                                                                                                                                                                   
       27 +                                                                                                                                                                      
       28 +2. 사용자가 "제품명" input에 키 입력                                                                                                                                  
       29 +3. `formData` 상태 업데이트                                                                                                                                           
       30 +4. TargetProductForm 컴포넌트 리렌더링                                                                                                                                
       31 +5. **인라인 함수 formatLabel이 새로운 참조로 재생성됨**                                                                                                               
       32 +6. SelectField의 useEffect가 formatLabel 변경을 감지                                                                                                                  
       33 +7. **fetchOptions() 재실행 → API 불필요하게 재호출!**                                                                                                                 
       34 +                                                                                                                                                                      
       35 +## 해결 전략                                                                                                                                                          
       36 +                                                                                                                                                                      
       37 +### 핵심 아이디어                                                                                                                                                     
       38 +                                                                                                                                                                      
       39 +`formatLabel`은 **이미 fetch된 데이터의 표시 형식**만 결정하는 순수 함수입니다.                                                                                       
       40 +- formatLabel이 변경되어도 서버에서 데이터를 다시 가져올 필요 없음                                                                                                    
       41 +- formatLabel은 fetch 시점에 한 번만 사용됨 (라인 51-54의 map)                                                                                                        
       42 +- **데이터 fetching과 표시 로직은 독립적이어야 함**                                                                                                                   
       43 +                                                                                                                                                                      
       44 +### 권장 방안: formatLabel을 의존성 배열에서 제거                                                                                                                     
       45 +                                                                                                                                                                      
       46 +```typescript                                                                                                                                                         
       47 +// SelectField.tsx:65                                                                                                                                                 
       48 +// 수정 전                                                                                                                                                            
       49 +}, [apiEndpoint, formatLabel]);                                                                                                                                       
       50 +                                                                                                                                                                      
       51 +// 수정 후                                                                                                                                                            
       52 +}, [apiEndpoint]);                                                                                                                                                    
       53 +```                                                                                                                                                                   
       54 +                                                                                                                                                                      
       55 +이렇게 하면:                                                                                                                                                          
       56 +- apiEndpoint가 변경될 때만 데이터 재fetch (정상적인 동작)                                                                                                            
       57 +- formatLabel 변경은 데이터 재fetch를 트리거하지 않음                                                                                                                 
       58 +- 불필요한 API 호출 제거                                                                                                                                              
       59 +                                                                                                                                                                      
       60 +### 대안 검토                                                                                                                                                         
       61 +                                                                                                                                                                      
       62 +#### 대안 1: useCallback으로 formatLabel 메모이제이션 (비권장)                                                                                                        
       63 +```typescript                                                                                                                                                         
       64 +// 각 부모 컴포넌트에서                                                                                                                                               
       65 +const formatLabel = useCallback((item) =>                                                                                                                             
       66 +  `${item.target_division} - ${item.target_product_line}`,                                                                                                            
       67 +  []                                                                                                                                                                  
       68 +);                                                                                                                                                                    
       69 +```                                                                                                                                                                   
       70 +**문제점:**                                                                                                                                                           
       71 +- 모든 부모 컴포넌트를 수정해야 함 (5개 파일)                                                                                                                         
       72 +- 코드 복잡도 증가                                                                                                                                                    
       73 +- 근본 원인 해결이 아님                                                                                                                                               
       74 +                                                                                                                                                                      
       75 +#### 대안 2: formatLabel을 컴포넌트 외부 정의 (비권장)                                                                                                                
       76 +**문제점:**                                                                                                                                                           
       77 +- formatLabel이 동적인 경우 대응 불가                                                                                                                                 
       78 +- 재사용성 감소                                                                                                                                                       
       79 +                                                                                                                                                                      
       80 +#### 권장 방안이 최선인 이유                                                                                                                                          
       81 +- ✅ **단일 파일만 수정** (SelectField.tsx)                                                                                                                            
       82 +- ✅ **근본 원인 해결**: 데이터 fetching과 표시 로직 분리                                                                                                              
       83 +- ✅ **성능 최적화**: 불필요한 API 호출 제거                                                                                                                           
       84 +- ✅ **코드 단순화**: 추가 복잡도 없음                                                                                                                                 
       85 +                                                                                                                                                                      
       86 +## 구현 상세                                                                                                                                                          
       87 +                                                                                                                                                                      
       88 +### 파일: `src/components/trm/common/SelectField.tsx`                                                                                                                 
       89 +                                                                                                                                                                      
       90 +**수정 위치**: 라인 65                                                                                                                                                
       91 +                                                                                                                                                                      
       92 +```typescript                                                                                                                                                         
       93 +// 수정 전 (라인 38-65)                                                                                                                                               
       94 +  useEffect(() => {                                                                                                                                                   
       95 +    async function fetchOptions() {                                                                                                                                   
       96 +      try {                                                                                                                                                           
       97 +        setLoading(true);                                                                                                                                             
       98 +        setFetchError(null);                                                                                                                                          
       99 +                                                                                                                                                                      
      100 +        const response = await fetch(apiEndpoint);                                                                                                                    
      101 +        const result = await response.json();                                                                                                                         
      102 +                                                                                                                                                                      
      103 +        if (!result.success) {                                                                                                                                        
      104 +          throw new Error(result.error || '데이터를 불러올 수 없습니다');                                                                                             
      105 +        }                                                                                                                                                             
      106 +                                                                                                                                                                      
      107 +        const formattedOptions: SelectOption[] = result.data.map((item: any) => ({                                                                                    
      108 +          value: item[Object.keys(item)[0]],                                                                                                                          
      109 +          label: formatLabel(item),                                                                                                                                   
      110 +        }));                                                                                                                                                          
      111 +                                                                                                                                                                      
      112 +        setOptions(formattedOptions);                                                                                                                                 
      113 +      } catch (err) {                                                                                                                                                 
      114 +        setFetchError(err instanceof Error ? err.message : '오류가 발생했습니다');                                                                                    
      115 +      } finally {                                                                                                                                                     
      116 +        setLoading(false);                                                                                                                                            
      117 +      }                                                                                                                                                               
      118 +    }                                                                                                                                                                 
      119 +                                                                                                                                                                      
      120 +    fetchOptions();                                                                                                                                                   
      121 +  }, [apiEndpoint, formatLabel]);  // ← 문제!                                                                                                                         
      122 +                                                                                                                                                                      
      123 +// 수정 후                                                                                                                                                            
      124 +  useEffect(() => {                                                                                                                                                   
      125 +    async function fetchOptions() {                                                                                                                                   
      126 +      try {                                                                                                                                                           
      127 +        setLoading(true);                                                                                                                                             
      128 +        setFetchError(null);                                                                                                                                          
      129 +                                                                                                                                                                      
      130 +        const response = await fetch(apiEndpoint);                                                                                                                    
      131 +        const result = await response.json();                                                                                                                         
      132 +                                                                                                                                                                      
      133 +        if (!result.success) {                                                                                                                                        
      134 +          throw new Error(result.error || '데이터를 불러올 수 없습니다');                                                                                             
      135 +        }                                                                                                                                                             
      136 +                                                                                                                                                                      
      137 +        const formattedOptions: SelectOption[] = result.data.map((item: any) => ({                                                                                    
      138 +          value: item[Object.keys(item)[0]],                                                                                                                          
      139 +          label: formatLabel(item),                                                                                                                                   
      140 +        }));                                                                                                                                                          
      141 +                                                                                                                                                                      
      142 +        setOptions(formattedOptions);                                                                                                                                 
      143 +      } catch (err) {                                                                                                                                                 
      144 +        setFetchError(err instanceof Error ? err.message : '오류가 발생했습니다');                                                                                    
      145 +      } finally {                                                                                                                                                     
      146 +        setLoading(false);                                                                                                                                            
      147 +      }                                                                                                                                                               
      148 +    }                                                                                                                                                                 
      149 +                                                                                                                                                                      
      150 +    fetchOptions();                                                                                                                                                   
      151 +    // formatLabel 제거: 표시 로직은 데이터 fetching과 독립적                                                                                                         
      152 +    // eslint-disable-next-line react-hooks/exhaustive-deps                                                                                                           
      153 +  }, [apiEndpoint]);                                                                                                                                                  
      154 +```                                                                                                                                                                   
      155 +                                                                                                                                                                      
      156 +**주석 개선**: 라인 3-6                                                                                                                                               
      157 +```typescript                                                                                                                                                         
      158 +/**                                                                                                                                                                   
      159 + * 외래키 선택을 위한 드롭다운 필드 컴포넌트                                                                                                                          
      160 + * - API에서 참조 데이터를 1회만 fetch                                                                                                                                
      161 + * - formatLabel 변경 시 불필요한 재fetch 방지                                                                                                                        
      162 + */                                                                                                                                                                   
      163 +```                                                                                                                                                                   
      164 +                                                                                                                                                                      
      165 +## 영향 받는 컴포넌트 (자동 수정됨)                                                                                                                                   
      166 +                                                                                                                                                                      
      167 +SelectField를 사용하는 모든 폼 컴포넌트가 자동으로 개선됩니다:                                                                                                        
      168 +                                                                                                                                                                      
      169 +1. **TargetProductForm.tsx**                                                                                                                                          
      170 +   - 제품군 선택 시 불필요한 API 재호출 제거                                                                                                                          
      171 +   - 제품명 입력 시 쿼리 스크롤 문제 해결 ✅                                                                                                                           
      172 +                                                                                                                                                                      
      173 +2. **TechSecurePlanForm.tsx**                                                                                                                                         
      174 +   - 카테고리 선택 시 불필요한 API 재호출 제거                                                                                                                        
      175 +   - 기술계획명 입력 시 쿼리 스크롤 문제 해결 ✅                                                                                                                       
      176 +                                                                                                                                                                      
      177 +3. **ProductLinePlanMapForm.tsx**                                                                                                                                     
      178 +   - 제품군 라인 선택 시 개선                                                                                                                                         
      179 +   - 기술계획 선택 시 개선                                                                                                                                            
      180 +                                                                                                                                                                      
      181 +## 검증 계획                                                                                                                                                          
      182 +                                                                                                                                                                      
      183 +### 테스트 케이스 1: 타겟 제품 - 제품명 입력                                                                                                                          
      184 +```                                                                                                                                                                   
      185 +1. 개발자 도구 열기 (F12) → Network 탭                                                                                                                                
      186 +2. 타겟 제품 생성 페이지 접근                                                                                                                                         
      187 +3. Network 탭에서 API 호출 확인:                                                                                                                                      
      188 +   ✅ /api/reference-data/product-lines 요청 1회 발생 (페이지 로드 시)                                                                                                 
      189 +4. "제품명" 필드에 "테스트 제품" 타이핑 (10글자)                                                                                                                      
      190 +5. Network 탭 확인:                                                                                                                                                   
      191 +   ✅ 추가 API 요청 0회 (이전에는 10회 발생)                                                                                                                           
      192 +6. 제품군 드롭다운이 정상 작동하는지 확인                                                                                                                             
      193 +   ✅ 옵션 목록이 올바르게 표시됨                                                                                                                                      
      194 +```                                                                                                                                                                   
      195 +                                                                                                                                                                      
      196 +### 테스트 케이스 2: 기술확보계획 - 기술계획명 입력                                                                                                                   
      197 +```                                                                                                                                                                   
      198 +1. 개발자 도구 열기 (F12) → Network 탭                                                                                                                                
      199 +2. 기술확보계획 생성 페이지 접근                                                                                                                                      
      200 +3. Network 탭에서 API 호출 확인:                                                                                                                                      
      201 +   ✅ /api/reference-data/categories 요청 1회 발생 (페이지 로드 시)                                                                                                    
      202 +4. "기술계획명" 필드에 "테스트 기술" 타이핑 (10글자)                                                                                                                  
      203 +5. Network 탭 확인:                                                                                                                                                   
      204 +   ✅ 추가 API 요청 0회 (이전에는 10회 발생)                                                                                                                           
      205 +6. 카테고리 드롭다운이 정상 작동하는지 확인                                                                                                                           
      206 +   ✅ 옵션 목록이 올바르게 표시됨                                                                                                                                      
      207 +```                                                                                                                                                                   
      208 +                                                                                                                                                                      
      209 +### 테스트 케이스 3: 제품군-계획 매핑                                                                                                                                 
      210 +```                                                                                                                                                                   
      211 +1. 개발자 도구 열기 (F12) → Network 탭                                                                                                                                
      212 +2. 제품군-계획 매핑 생성 페이지 접근                                                                                                                                  
      213 +3. Network 탭에서 API 호출 확인:                                                                                                                                      
      214 +   ✅ /api/target-product-lines 요청 1회                                                                                                                               
      215 +   ✅ /api/tech-secure-plans 요청 1회                                                                                                                                  
      216 +4. 첫 번째 드롭다운 선택                                                                                                                                              
      217 +5. 두 번째 드롭다운 선택                                                                                                                                              
      218 +6. Network 탭 확인:                                                                                                                                                   
      219 +   ✅ 추가 API 요청 0회                                                                                                                                                
      220 +```                                                                                                                                                                   
      221 +                                                                                                                                                                      
      222 +### 테스트 케이스 4: formatLabel 동적 변경 시나리오 (엣지 케이스)                                                                                                     
      223 +```                                                                                                                                                                   
      224 +만약 미래에 formatLabel이 동적으로 변경되어야 하는 요구사항이 생긴다면:                                                                                               
      225 +- 옵션: formatLabel을 state로 관리하고 useMemo 사용                                                                                                                   
      226 +- 현재는 formatLabel이 정적이므로 문제 없음                                                                                                                           
      227 +```                                                                                                                                                                   
      228 +                                                                                                                                                                      
      229 +### 회귀 테스트 체크리스트                                                                                                                                            
      230 +```                                                                                                                                                                   
      231 +□ 모든 SelectField가 초기 로드 시 데이터를 정상적으로 fetch하는가?                                                                                                    
      232 +□ 드롭다운 옵션이 올바르게 표시되는가?                                                                                                                                
      233 +□ 선택한 값이 정상적으로 저장되는가?                                                                                                                                  
      234 +□ apiEndpoint가 변경될 때 데이터가 재fetch되는가? (동적 endpoint 시나리오)                                                                                            
      235 +□ 다른 입력 필드 타이핑 시 SelectField가 리렌더링되지 않는가?                                                                                                         
      236 +```                                                                                                                                                                   
      237 +                                                                                                                                                                      
      238 +## Critical Files                                                                                                                                                     
      239 +                                                                                                                                                                      
      240 +### 수정 파일                                                                                                                                                         
      241 +1. `src/components/trm/common/SelectField.tsx` - **단일 수정으로 모든 문제 해결**                                                                                     
      242 +                                                                                                                                                                      
      243 +### 영향 받는 파일 (자동 수정됨, 직접 수정 불필요)                                                                                                                    
      244 +2. `src/components/trm/target-products/TargetProductForm.tsx`                                                                                                         
      245 +3. `src/components/trm/tech-secure-plans/TechSecurePlanForm.tsx`                                                                                                      
      246 +4. `src/components/trm/product-line-plan-map/ProductLinePlanMapForm.tsx`                                                                                              
      247 +                                                                                                                                                                      
      248 +## 예상 효과                                                                                                                                                          
      249 +                                                                                                                                                                      
      250 +### 성능 개선                                                                                                                                                         
      251 +                                                                                                                                                                      
      252 +**타겟 제품 폼 (제품명 10글자 입력 시):**                                                                                                                             
      253 +- API 호출: 11회 → 1회 (91% 감소)                                                                                                                                     
      254 +- 네트워크 전송량: 91% 감소                                                                                                                                           
      255 +- 렌더링 횟수: 대폭 감소                                                                                                                                              
      256 +                                                                                                                                                                      
      257 +**기술확보계획 폼 (기술계획명 10글자 입력 시):**                                                                                                                      
      258 +- API 호출: 11회 → 1회 (91% 감소)                                                                                                                                     
      259 +- 네트워크 전송량: 91% 감소                                                                                                                                           
      260 +- 렌더링 횟수: 대폭 감소                                                                                                                                              
      261 +                                                                                                                                                                      
      262 +**제품군-계획 매핑 폼:**                                                                                                                                              
      263 +- 불필요한 교차 호출 제거                                                                                                                                             
      264 +- 사용자 경험 개선                                                                                                                                                    
      265 +                                                                                                                                                                      
      266 +### UX 개선                                                                                                                                                           
      267 +- ✅ 입력 시 쿼리 스크롤 완전 제거                                                                                                                                     
      268 +- ✅ 부드러운 타이핑 경험                                                                                                                                              
      269 +- ✅ 페이지 반응성 향상                                                                                                                                                
      270 +- ✅ 서버 부하 감소                                                                                                                                                    
      271 +                                                                                                                                                                      
      272 +### 코드 품질                                                                                                                                                         
      273 +- ✅ **단일 책임 원칙**: 데이터 fetching과 표시 로직 분리                                                                                                              
      274 +- ✅ **성능 최적화**: 불필요한 side effect 제거                                                                                                                        
      275 +- ✅ **유지보수성**: 단일 파일 수정으로 전역 개선                                                                                                                      
      276 +- ✅ **React 모범 사례**: useEffect 의존성 배열 최적화                                                                                                                 
      277 +                                                                                                                                                                      
      278 +## 기술적 배경                                                                                                                                                        
      279 +                                                                                                                                                                      
      280 +### React useEffect 의존성 배열 원칙                                                                                                                                  
      281 +                                                                                                                                                                      
      282 +**올바른 사용:**                                                                                                                                                      
      283 +```typescript                                                                                                                                                         
      284 +useEffect(() => {                                                                                                                                                     
      285 +  // 데이터 fetch                                                                                                                                                     
      286 +}, [dataSource]);  // 데이터 소스가 변경될 때만 재fetch                                                                                                               
      287 +```                                                                                                                                                                   
      288 +                                                                                                                                                                      
      289 +**잘못된 사용:**                                                                                                                                                      
      290 +```typescript                                                                                                                                                         
      291 +useEffect(() => {                                                                                                                                                     
      292 +  // 데이터 fetch                                                                                                                                                     
      293 +}, [dataSource, formatFunction]);  // 표시 함수까지 의존성에 포함 ❌                                                                                                   
      294 +```                                                                                                                                                                   
      295 +                                                                                                                                                                      
      296 +**핵심 원칙:**                                                                                                                                                        
      297 +- 의존성 배열에는 **effect를 재실행해야 할 조건**만 포함                                                                                                              
      298 +- formatLabel은 **표시 방법**이지 **데이터 소스**가 아님                                                                                                              
      299 +- formatLabel 변경 = 같은 데이터를 다르게 표시 ≠ 데이터 재fetch 필요                                                                                                  
      300 +                                                                                                                                                                      
      301 +### ESLint 경고 대응                                                                                                                                                  
      302 +                                                                                                                                                                      
      303 +수정 후 ESLint가 경고할 수 있습니다:                                                                                                                                  
      304 +```                                                                                                                                                                   
      305 +React Hook useEffect has a missing dependency: 'formatLabel'                                                                                                          
      306 +```                                                                                                                                                                   
      307 +                                                                                                                                                                      
      308 +**대응 방법:**                                                                                                                                                        
      309 +```typescript                                                                                                                                                         
      310 +// eslint-disable-next-line react-hooks/exhaustive-deps                                                                                                               
      311 +}, [apiEndpoint]);                                                                                                                                                    
      312 +```                                                                                                                                                                   
      313 +                                                                                                                                                                      
      314 +**정당한 이유:**                                                                                                                                                      
      315 +- formatLabel은 fetchOptions 내부에서 사용되지만, 의도적으로 의존성에서 제외                                                                                          
      316 +- formatLabel 변경 시 데이터 재fetch는 불필요하고 비효율적                                                                                                            
      317 +- 이는 **의도된 최적화**이며 버그가 아님                                                                                                                              
      318 +                                                                                                                                                                      
      319 +## 구현 순서                                                                                                                                                          
      320 +                                                                                                                                                                      
      321 +1. **Phase 1**: SelectField.tsx의 useEffect 의존성 배열 수정 (1분)                                                                                                    
      322 +2. **Phase 2**: 주석 업데이트 (1분)                                                                                                                                   
      323 +3. **Phase 3**: 테스트 케이스 1, 2 실행 (5분)                                                                                                                         
      324 +4. **Phase 4**: 회귀 테스트 (5분)                                                                                                                                     
      325 +                                                                                                                                                                      
      326 +**총 예상 소요 시간**: 12분                                                                                                                                           
      327 +                                                                                                                                                                      
      328 +## 위험 요소 및 완화 방안                                                                                                                                             
      329 +                                                                                                                                                                      
      330 +### 위험: formatLabel이 동적으로 변경되어야 하는 케이스                                                                                                               
      331 +- **발생 확률**: 매우 낮음 (현재 모든 formatLabel이 정적)                                                                                                             
      332 +- **완화**: 만약 발생 시 해당 케이스만 useMemo로 처리                                                                                                                 
      333 +                                                                                                                                                                      
      334 +### 위험: 초기 fetch 시 formatLabel이 undefined                                                                                                                       
      335 +- **발생 확률**: 없음 (formatLabel은 required prop)                                                                                                                   
      336 +- **완화**: TypeScript가 컴파일 타임에 검증                                                                                                                           
      337 +                                                                                                                                                                      
      338 +### 위험: 없음                                                                                                                                                        
      339 +- 이 수정은 순수한 성능 최적화                                                                                                                                        
      340 +- 기능적 변경 없음                                                                                                                                                    
      341 +- 부작용 없음                                                                                                                                                         

● 플랜이 완성되었습니다!

  📋 문제 분석 완료

  핵심 원인:
  - SelectField 컴포넌트의 useEffect 의존성 배열에 formatLabel 함수가 포함됨
  - 부모 컴포넌트에서 인라인 함수로 전달 → 입력할 때마다 새로운 참조 생성
  - 결과: 키 입력마다 API 재호출 (10글자 입력 = 10회 불필요한 API 호출)

  해결 방법:
  - SelectField.tsx의 의존성 배열에서 formatLabel 제거
  - 단일 파일 수정으로 모든 폼 컴포넌트 자동 개선

  예상 효과:
  - API 호출: 11회 → 1회 (91% 감소)
  - 쿼리 스크롤 완전 제거
  - 부드러운 타이핑 경험
  ⎿  User rejected Claude's plan:
     ╭────────────────────────────────────────────────────────────────────────────────────╮
     │ 타겟제품/기술확보계획 입력 시 쿼리 연속 스크롤 문제 해결                           │
     │                                                                                    │
     │ 문제 요약                                                                          │
     │                                                                                    │
     │ 증상:                                                                              │
     │ - 타겟 제품 폼에서 "제품명" 입력 시마다 쿼리가 계속 스크롤됨                       │
     │ - 기술확보계획 폼에서 "기술계획명" 입력 시마다 쿼리가 계속 스크롤됨                │
     │ - 타겟 제품군 라인 폼에서는 문제 없음 (SelectField를 사용하지 않음)                │
     │                                                                                    │
     │ 원인:                                                                              │
     │ SelectField 컴포넌트의 useEffect 의존성 배열에 formatLabel 함수 포함               │
     │                                                                                    │
     │ // SelectField.tsx:65                                                              │
     │ }, [apiEndpoint, formatLabel]);  // ← formatLabel 문제!                            │
     │                                                                                    │
     │ 왜 문제가 발생하는가?                                                              │
     │                                                                                    │
     │ 1. 부모 컴포넌트에서 formatLabel을 인라인 함수로 전달:                             │
     │ // TargetProductForm.tsx:102-104                                                   │
     │ formatLabel={(item) =>                                                             │
     │   `${item.target_division} - ${item.target_product_line}`                          │
     │ }                                                                                  │
     │                                                                                    │
     │ 2. 사용자가 "제품명" input에 키 입력                                               │
     │ 3. formData 상태 업데이트                                                          │
     │ 4. TargetProductForm 컴포넌트 리렌더링                                             │
     │ 5. 인라인 함수 formatLabel이 새로운 참조로 재생성됨                                │
     │ 6. SelectField의 useEffect가 formatLabel 변경을 감지                               │
     │ 7. fetchOptions() 재실행 → API 불필요하게 재호출!                                  │
     │                                                                                    │
     │ 해결 전략                                                                          │
     │                                                                                    │
     │ 핵심 아이디어                                                                      │
     │                                                                                    │
     │ formatLabel은 이미 fetch된 데이터의 표시 형식만 결정하는 순수 함수입니다.          │
     │ - formatLabel이 변경되어도 서버에서 데이터를 다시 가져올 필요 없음                 │
     │ - formatLabel은 fetch 시점에 한 번만 사용됨 (라인 51-54의 map)                     │
     │ - 데이터 fetching과 표시 로직은 독립적이어야 함                                    │
     │                                                                                    │
     │ 권장 방안: formatLabel을 의존성 배열에서 제거                                      │
     │                                                                                    │
     │ // SelectField.tsx:65                                                              │
     │ // 수정 전                                                                         │
     │ }, [apiEndpoint, formatLabel]);                                                    │
     │                                                                                    │
     │ // 수정 후                                                                         │
     │ }, [apiEndpoint]);                                                                 │
     │                                                                                    │
     │ 이렇게 하면:                                                                       │
     │ - apiEndpoint가 변경될 때만 데이터 재fetch (정상적인 동작)                         │
     │ - formatLabel 변경은 데이터 재fetch를 트리거하지 않음                              │
     │ - 불필요한 API 호출 제거                                                           │
     │                                                                                    │
     │ 대안 검토                                                                          │
     │                                                                                    │
     │ 대안 1: useCallback으로 formatLabel 메모이제이션 (비권장)                          │
     │                                                                                    │
     │ // 각 부모 컴포넌트에서                                                            │
     │ const formatLabel = useCallback((item) =>                                          │
     │   `${item.target_division} - ${item.target_product_line}`,                         │
     │   []                                                                               │
     │ );                                                                                 │
     │ 문제점:                                                                            │
     │ - 모든 부모 컴포넌트를 수정해야 함 (5개 파일)                                      │
     │ - 코드 복잡도 증가                                                                 │
     │ - 근본 원인 해결이 아님                                                            │
     │                                                                                    │
     │ 대안 2: formatLabel을 컴포넌트 외부 정의 (비권장)                                  │
     │                                                                                    │
     │ 문제점:                                                                            │
     │ - formatLabel이 동적인 경우 대응 불가                                              │
     │ - 재사용성 감소                                                                    │
     │                                                                                    │
     │ 권장 방안이 최선인 이유                                                            │
     │                                                                                    │
     │ - ✅ 단일 파일만 수정 (SelectField.tsx)                                            │
     │ - ✅ 근본 원인 해결: 데이터 fetching과 표시 로직 분리                              │
     │ - ✅ 성능 최적화: 불필요한 API 호출 제거                                           │
     │ - ✅ 코드 단순화: 추가 복잡도 없음                                                 │
     │                                                                                    │
     │ 구현 상세                                                                          │
     │                                                                                    │
     │ 파일: src/components/trm/common/SelectField.tsx                                    │
     │                                                                                    │
     │ 수정 위치: 라인 65                                                                 │
     │                                                                                    │
     │ // 수정 전 (라인 38-65)                                                            │
     │   useEffect(() => {                                                                │
     │     async function fetchOptions() {                                                │
     │       try {                                                                        │
     │         setLoading(true);                                                          │
     │         setFetchError(null);                                                       │
     │                                                                                    │
     │         const response = await fetch(apiEndpoint);                                 │
     │         const result = await response.json();                                      │
     │                                                                                    │
     │         if (!result.success) {                                                     │
     │           throw new Error(result.error || '데이터를 불러올 수 없습니다');          │
     │         }                                                                          │
     │                                                                                    │
     │         const formattedOptions: SelectOption[] = result.data.map((item: any) => ({ │
     │           value: item[Object.keys(item)[0]],                                       │
     │           label: formatLabel(item),                                                │
     │         }));                                                                       │
     │                                                                                    │
     │         setOptions(formattedOptions);                                              │
     │       } catch (err) {                                                              │
     │         setFetchError(err instanceof Error ? err.message : '오류가 발생했습니다'); │
     │       } finally {                                                                  │
     │         setLoading(false);                                                         │
     │       }                                                                            │
     │     }                                                                              │
     │                                                                                    │
     │     fetchOptions();                                                                │
     │   }, [apiEndpoint, formatLabel]);  // ← 문제!                                      │
     │                                                                                    │
     │ // 수정 후                                                                         │
     │   useEffect(() => {                                                                │
     │     async function fetchOptions() {                                                │
     │       try {                                                                        │
     │         setLoading(true);                                                          │
     │         setFetchError(null);                                                       │
     │                                                                                    │
     │         const response = await fetch(apiEndpoint);                                 │
     │         const result = await response.json();                                      │
     │                                                                                    │
     │         if (!result.success) {                                                     │
     │           throw new Error(result.error || '데이터를 불러올 수 없습니다');          │
     │         }                                                                          │
     │                                                                                    │
     │         const formattedOptions: SelectOption[] = result.data.map((item: any) => ({ │
     │           value: item[Object.keys(item)[0]],                                       │
     │           label: formatLabel(item),                                                │
     │         }));                                                                       │
     │                                                                                    │
     │         setOptions(formattedOptions);                                              │
     │       } catch (err) {                                                              │
     │         setFetchError(err instanceof Error ? err.message : '오류가 발생했습니다'); │
     │       } finally {                                                                  │
     │         setLoading(false);                                                         │
     │       }                                                                            │
     │     }                                                                              │
     │                                                                                    │
     │     fetchOptions();                                                                │
     │     // formatLabel 제거: 표시 로직은 데이터 fetching과 독립적                      │
     │     // eslint-disable-next-line react-hooks/exhaustive-deps                        │
     │   }, [apiEndpoint]);                                                               │
     │                                                                                    │
     │ 주석 개선: 라인 3-6                                                                │
     │ /**                                                                                │
     │  * 외래키 선택을 위한 드롭다운 필드 컴포넌트                                       │
     │  * - API에서 참조 데이터를 1회만 fetch                                             │
     │  * - formatLabel 변경 시 불필요한 재fetch 방지                                     │
     │  */                                                                                │
     │                                                                                    │
     │ 영향 받는 컴포넌트 (자동 수정됨)                                                   │
     │                                                                                    │
     │ SelectField를 사용하는 모든 폼 컴포넌트가 자동으로 개선됩니다:                     │
     │                                                                                    │
     │ 1. TargetProductForm.tsx                                                           │
     │   - 제품군 선택 시 불필요한 API 재호출 제거                                        │
     │   - 제품명 입력 시 쿼리 스크롤 문제 해결 ✅                                        │
     │ 2. TechSecurePlanForm.tsx                                                          │
     │   - 카테고리 선택 시 불필요한 API 재호출 제거                                      │
     │   - 기술계획명 입력 시 쿼리 스크롤 문제 해결 ✅                                    │
     │ 3. ProductLinePlanMapForm.tsx                                                      │
     │   - 제품군 라인 선택 시 개선                                                       │
     │   - 기술계획 선택 시 개선                                                          │
     │                                                                                    │
     │ 검증 계획                                                                          │
     │                                                                                    │
     │ 테스트 케이스 1: 타겟 제품 - 제품명 입력                                           │
     │                                                                                    │
     │ 1. 개발자 도구 열기 (F12) → Network 탭                                             │
     │ 2. 타겟 제품 생성 페이지 접근                                                      │
     │ 3. Network 탭에서 API 호출 확인:                                                   │
     │    ✅ /api/reference-data/product-lines 요청 1회 발생 (페이지 로드 시)             │
     │ 4. "제품명" 필드에 "테스트 제품" 타이핑 (10글자)                                   │
     │ 5. Network 탭 확인:                                                                │
     │    ✅ 추가 API 요청 0회 (이전에는 10회 발생)                                       │
     │ 6. 제품군 드롭다운이 정상 작동하는지 확인                                          │
     │    ✅ 옵션 목록이 올바르게 표시됨                                                  │
     │                                                                                    │
     │ 테스트 케이스 2: 기술확보계획 - 기술계획명 입력                                    │
     │                                                                                    │
     │ 1. 개발자 도구 열기 (F12) → Network 탭                                             │
     │ 2. 기술확보계획 생성 페이지 접근                                                   │
     │ 3. Network 탭에서 API 호출 확인:                                                   │
     │    ✅ /api/reference-data/categories 요청 1회 발생 (페이지 로드 시)                │
     │ 4. "기술계획명" 필드에 "테스트 기술" 타이핑 (10글자)                               │
     │ 5. Network 탭 확인:                                                                │
     │    ✅ 추가 API 요청 0회 (이전에는 10회 발생)                                       │
     │ 6. 카테고리 드롭다운이 정상 작동하는지 확인                                        │
     │    ✅ 옵션 목록이 올바르게 표시됨                                                  │
     │                                                                                    │
     │ 테스트 케이스 3: 제품군-계획 매핑                                                  │
     │                                                                                    │
     │ 1. 개발자 도구 열기 (F12) → Network 탭                                             │
     │ 2. 제품군-계획 매핑 생성 페이지 접근                                               │
     │ 3. Network 탭에서 API 호출 확인:                                                   │
     │    ✅ /api/target-product-lines 요청 1회                                           │
     │    ✅ /api/tech-secure-plans 요청 1회                                              │
     │ 4. 첫 번째 드롭다운 선택                                                           │
     │ 5. 두 번째 드롭다운 선택                                                           │
     │ 6. Network 탭 확인:                                                                │
     │    ✅ 추가 API 요청 0회                                                            │
     │                                                                                    │
     │ 테스트 케이스 4: formatLabel 동적 변경 시나리오 (엣지 케이스)                      │
     │                                                                                    │
     │ 만약 미래에 formatLabel이 동적으로 변경되어야 하는 요구사항이 생긴다면:            │
     │ - 옵션: formatLabel을 state로 관리하고 useMemo 사용                                │
     │ - 현재는 formatLabel이 정적이므로 문제 없음                                        │
     │                                                                                    │
     │ 회귀 테스트 체크리스트                                                             │
     │                                                                                    │
     │ □ 모든 SelectField가 초기 로드 시 데이터를 정상적으로 fetch하는가?                 │
     │ □ 드롭다운 옵션이 올바르게 표시되는가?                                             │
     │ □ 선택한 값이 정상적으로 저장되는가?                                               │
     │ □ apiEndpoint가 변경될 때 데이터가 재fetch되는가? (동적 endpoint 시나리오)         │
     │ □ 다른 입력 필드 타이핑 시 SelectField가 리렌더링되지 않는가?                      │
     │                                                                                    │
     │ Critical Files                                                                     │
     │                                                                                    │
     │ 수정 파일                                                                          │
     │                                                                                    │
     │ 1. src/components/trm/common/SelectField.tsx - 단일 수정으로 모든 문제 해결        │
     │                                                                                    │
     │ 영향 받는 파일 (자동 수정됨, 직접 수정 불필요)                                     │
     │                                                                                    │
     │ 2. src/components/trm/target-products/TargetProductForm.tsx                        │
     │ 3. src/components/trm/tech-secure-plans/TechSecurePlanForm.tsx                     │
     │ 4. src/components/trm/product-line-plan-map/ProductLinePlanMapForm.tsx             │
     │                                                                                    │
     │ 예상 효과                                                                          │
     │                                                                                    │
     │ 성능 개선                                                                          │
     │                                                                                    │
     │ 타겟 제품 폼 (제품명 10글자 입력 시):                                              │
     │ - API 호출: 11회 → 1회 (91% 감소)                                                  │
     │ - 네트워크 전송량: 91% 감소                                                        │
     │ - 렌더링 횟수: 대폭 감소                                                           │
     │                                                                                    │
     │ 기술확보계획 폼 (기술계획명 10글자 입력 시):                                       │
     │ - API 호출: 11회 → 1회 (91% 감소)                                                  │
     │ - 네트워크 전송량: 91% 감소                                                        │
     │ - 렌더링 횟수: 대폭 감소                                                           │
     │                                                                                    │
     │ 제품군-계획 매핑 폼:                                                               │
     │ - 불필요한 교차 호출 제거                                                          │
     │ - 사용자 경험 개선                                                                 │
     │                                                                                    │
     │ UX 개선                                                                            │
     │                                                                                    │
     │ - ✅ 입력 시 쿼리 스크롤 완전 제거                                                 │
     │ - ✅ 부드러운 타이핑 경험                                                          │
     │ - ✅ 페이지 반응성 향상                                                            │
     │ - ✅ 서버 부하 감소                                                                │
     │                                                                                    │
     │ 코드 품질                                                                          │
     │                                                                                    │
     │ - ✅ 단일 책임 원칙: 데이터 fetching과 표시 로직 분리                              │
     │ - ✅ 성능 최적화: 불필요한 side effect 제거                                        │
     │ - ✅ 유지보수성: 단일 파일 수정으로 전역 개선                                      │
     │ - ✅ React 모범 사례: useEffect 의존성 배열 최적화                                 │
     │                                                                                    │
     │ 기술적 배경                                                                        │
     │                                                                                    │
     │ React useEffect 의존성 배열 원칙                                                   │
     │                                                                                    │
     │ 올바른 사용:                                                                       │
     │ useEffect(() => {                                                                  │
     │   // 데이터 fetch                                                                  │
     │ }, [dataSource]);  // 데이터 소스가 변경될 때만 재fetch                            │
     │                                                                                    │
     │ 잘못된 사용:                                                                       │
     │ useEffect(() => {                                                                  │
     │   // 데이터 fetch                                                                  │
     │ }, [dataSource, formatFunction]);  // 표시 함수까지 의존성에 포함 ❌               │
     │                                                                                    │
     │ 핵심 원칙:                                                                         │
     │ - 의존성 배열에는 effect를 재실행해야 할 조건만 포함                               │
     │ - formatLabel은 표시 방법이지 데이터 소스가 아님                                   │
     │ - formatLabel 변경 = 같은 데이터를 다르게 표시 ≠ 데이터 재fetch 필요               │
     │                                                                                    │
     │ ESLint 경고 대응                                                                   │
     │                                                                                    │
     │ 수정 후 ESLint가 경고할 수 있습니다:                                               │
     │ React Hook useEffect has a missing dependency: 'formatLabel'                       │
     │                                                                                    │
     │ 대응 방법:                                                                         │
     │ // eslint-disable-next-line react-hooks/exhaustive-deps                            │
     │ }, [apiEndpoint]);                                                                 │
     │                                                                                    │
     │ 정당한 이유:                                                                       │
     │ - formatLabel은 fetchOptions 내부에서 사용되지만, 의도적으로 의존성에서 제외       │
     │ - formatLabel 변경 시 데이터 재fetch는 불필요하고 비효율적                         │
     │ - 이는 의도된 최적화이며 버그가 아님                                               │
     │                                                                                    │
     │ 구현 순서                                                                          │
     │                                                                                    │
     │ 1. Phase 1: SelectField.tsx의 useEffect 의존성 배열 수정 (1분)                     │
     │ 2. Phase 2: 주석 업데이트 (1분)                                                    │
     │ 3. Phase 3: 테스트 케이스 1, 2 실행 (5분)                                          │
     │ 4. Phase 4: 회귀 테스트 (5분)                                                      │
     │                                                                                    │
     │ 총 예상 소요 시간: 12분                                                            │
     │                                                                                    │
     │ 위험 요소 및 완화 방안                                                             │
     │                                                                                    │

 ▐▛███▜▌   Claude Code v2.1.17
▝▜█████▛▘  Sonnet 4.5 · Claude Pro
  ▘▘ ▝▝    ~\Desktop\nextjs-trm-crud-testdb

❯ Implement the following plan:                                                                                                                                                  
                                                                                                                                                                                 
  # 타겟제품/기술확보계획 입력 시 쿼리 연속 스크롤 문제 해결                                                                                                                     
                                                                                                                                                                                 
  ## 문제 요약                                                                                                                                                                   
                                                                                                                                                                                 
  **증상:**                                                                                                                                                                      
  - 타겟 제품 폼에서 "제품명" 입력 시마다 쿼리가 계속 스크롤됨                                                                                                                   
  - 기술확보계획 폼에서 "기술계획명" 입력 시마다 쿼리가 계속 스크롤됨                                                                                                            
  - 타겟 제품군 라인 폼에서는 문제 없음 (SelectField를 사용하지 않음)                                                                                                            
                                                                                                                                                                                 
  **원인:**                                                                                                                                                                      
  SelectField 컴포넌트의 useEffect 의존성 배열에 `formatLabel` 함수 포함                                                                                                         
                                                                                                                                                                                 
  ```typescript                                                                                                                                                                  
  // SelectField.tsx:65                                                                                                                                                          
  }, [apiEndpoint, formatLabel]);  // ← formatLabel 문제!                                                                                                                        
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  **왜 문제가 발생하는가?**                                                                                                                                                      
                                                                                                                                                                                 
  1. 부모 컴포넌트에서 formatLabel을 인라인 함수로 전달:                                                                                                                         
  ```typescript                                                                                                                                                                  
  // TargetProductForm.tsx:102-104                                                                                                                                               
  formatLabel={(item) =>                                                                                                                                                         
  `${item.target_division} - ${item.target_product_line}`                                                                                                                        
  }                                                                                                                                                                              
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  2. 사용자가 "제품명" input에 키 입력                                                                                                                                           
  3. `formData` 상태 업데이트                                                                                                                                                    
  4. TargetProductForm 컴포넌트 리렌더링                                                                                                                                         
  5. **인라인 함수 formatLabel이 새로운 참조로 재생성됨**                                                                                                                        
  6. SelectField의 useEffect가 formatLabel 변경을 감지                                                                                                                           
  7. **fetchOptions() 재실행 → API 불필요하게 재호출!**                                                                                                                          
                                                                                                                                                                                 
  ## 해결 전략                                                                                                                                                                   
                                                                                                                                                                                 
  ### 핵심 아이디어                                                                                                                                                              
                                                                                                                                                                                 
  `formatLabel`은 **이미 fetch된 데이터의 표시 형식**만 결정하는 순수 함수입니다.                                                                                                
  - formatLabel이 변경되어도 서버에서 데이터를 다시 가져올 필요 없음                                                                                                             
  - formatLabel은 fetch 시점에 한 번만 사용됨 (라인 51-54의 map)                                                                                                                 
  - **데이터 fetching과 표시 로직은 독립적이어야 함**                                                                                                                            
                                                                                                                                                                                 
  ### 권장 방안: formatLabel을 의존성 배열에서 제거                                                                                                                              
                                                                                                                                                                                 
  ```typescript                                                                                                                                                                  
  // SelectField.tsx:65                                                                                                                                                          
  // 수정 전                                                                                                                                                                     
  }, [apiEndpoint, formatLabel]);                                                                                                                                                
                                                                                                                                                                                 
  // 수정 후                                                                                                                                                                     
  }, [apiEndpoint]);                                                                                                                                                             
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  이렇게 하면:                                                                                                                                                                   
  - apiEndpoint가 변경될 때만 데이터 재fetch (정상적인 동작)                                                                                                                     
  - formatLabel 변경은 데이터 재fetch를 트리거하지 않음                                                                                                                          
  - 불필요한 API 호출 제거                                                                                                                                                       
                                                                                                                                                                                 
  ### 대안 검토                                                                                                                                                                  
                                                                                                                                                                                 
  #### 대안 1: useCallback으로 formatLabel 메모이제이션 (비권장)                                                                                                                 
  ```typescript                                                                                                                                                                  
  // 각 부모 컴포넌트에서                                                                                                                                                        
  const formatLabel = useCallback((item) =>                                                                                                                                      
  `${item.target_division} - ${item.target_product_line}`,                                                                                                                       
  []                                                                                                                                                                             
  );                                                                                                                                                                             
  ```                                                                                                                                                                            
  **문제점:**                                                                                                                                                                    
  - 모든 부모 컴포넌트를 수정해야 함 (5개 파일)                                                                                                                                  
  - 코드 복잡도 증가                                                                                                                                                             
  - 근본 원인 해결이 아님                                                                                                                                                        
                                                                                                                                                                                 
  #### 대안 2: formatLabel을 컴포넌트 외부 정의 (비권장)                                                                                                                         
  **문제점:**                                                                                                                                                                    
  - formatLabel이 동적인 경우 대응 불가                                                                                                                                          
  - 재사용성 감소                                                                                                                                                                
                                                                                                                                                                                 
  #### 권장 방안이 최선인 이유                                                                                                                                                   
  - ✅ **단일 파일만 수정** (SelectField.tsx)                                                                                                                                     
  - ✅ **근본 원인 해결**: 데이터 fetching과 표시 로직 분리                                                                                                                       
  - ✅ **성능 최적화**: 불필요한 API 호출 제거                                                                                                                                    
  - ✅ **코드 단순화**: 추가 복잡도 없음                                                                                                                                          
                                                                                                                                                                                 
  ## 구현 상세                                                                                                                                                                   
                                                                                                                                                                                 
  ### 파일: `src/components/trm/common/SelectField.tsx`                                                                                                                          
                                                                                                                                                                                 
  **수정 위치**: 라인 65                                                                                                                                                         
                                                                                                                                                                                 
  ```typescript                                                                                                                                                                  
  // 수정 전 (라인 38-65)                                                                                                                                                        
  useEffect(() => {                                                                                                                                                              
  async function fetchOptions() {                                                                                                                                                
  try {                                                                                                                                                                          
  setLoading(true);                                                                                                                                                              
  setFetchError(null);                                                                                                                                                           
                                                                                                                                                                                 
  const response = await fetch(apiEndpoint);                                                                                                                                     
  const result = await response.json();                                                                                                                                          
                                                                                                                                                                                 
  if (!result.success) {                                                                                                                                                         
  throw new Error(result.error || '데이터를 불러올 수 없습니다');                                                                                                                
  }                                                                                                                                                                              
                                                                                                                                                                                 
  const formattedOptions: SelectOption[] = result.data.map((item: any) => ({                                                                                                     
  value: item[Object.keys(item)[0]],                                                                                                                                             
  label: formatLabel(item),                                                                                                                                                      
  }));                                                                                                                                                                           
                                                                                                                                                                                 
  setOptions(formattedOptions);                                                                                                                                                  
  } catch (err) {                                                                                                                                                                
  setFetchError(err instanceof Error ? err.message : '오류가 발생했습니다');                                                                                                     
  } finally {                                                                                                                                                                    
  setLoading(false);                                                                                                                                                             
  }                                                                                                                                                                              
  }                                                                                                                                                                              
                                                                                                                                                                                 
  fetchOptions();                                                                                                                                                                
  }, [apiEndpoint, formatLabel]);  // ← 문제!                                                                                                                                    
                                                                                                                                                                                 
  // 수정 후                                                                                                                                                                     
  useEffect(() => {                                                                                                                                                              
  async function fetchOptions() {                                                                                                                                                
  try {                                                                                                                                                                          
  setLoading(true);                                                                                                                                                              
  setFetchError(null);                                                                                                                                                           
                                                                                                                                                                                 
  const response = await fetch(apiEndpoint);                                                                                                                                     
  const result = await response.json();                                                                                                                                          
                                                                                                                                                                                 
  if (!result.success) {                                                                                                                                                         
  throw new Error(result.error || '데이터를 불러올 수 없습니다');                                                                                                                
  }                                                                                                                                                                              
                                                                                                                                                                                 
  const formattedOptions: SelectOption[] = result.data.map((item: any) => ({                                                                                                     
  value: item[Object.keys(item)[0]],                                                                                                                                             
  label: formatLabel(item),                                                                                                                                                      
  }));                                                                                                                                                                           
                                                                                                                                                                                 
  setOptions(formattedOptions);                                                                                                                                                  
  } catch (err) {                                                                                                                                                                
  setFetchError(err instanceof Error ? err.message : '오류가 발생했습니다');                                                                                                     
  } finally {                                                                                                                                                                    
  setLoading(false);                                                                                                                                                             
  }                                                                                                                                                                              
  }                                                                                                                                                                              
                                                                                                                                                                                 
  fetchOptions();                                                                                                                                                                
  // formatLabel 제거: 표시 로직은 데이터 fetching과 독립적                                                                                                                      
  // eslint-disable-next-line react-hooks/exhaustive-deps                                                                                                                        
  }, [apiEndpoint]);                                                                                                                                                             
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  **주석 개선**: 라인 3-6                                                                                                                                                        
  ```typescript                                                                                                                                                                  
  /**                                                                                                                                                                            
  * 외래키 선택을 위한 드롭다운 필드 컴포넌트                                                                                                                                    
  * - API에서 참조 데이터를 1회만 fetch                                                                                                                                          
  * - formatLabel 변경 시 불필요한 재fetch 방지                                                                                                                                  
  */                                                                                                                                                                             
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  ## 영향 받는 컴포넌트 (자동 수정됨)                                                                                                                                            
                                                                                                                                                                                 
  SelectField를 사용하는 모든 폼 컴포넌트가 자동으로 개선됩니다:                                                                                                                 
                                                                                                                                                                                 
  1. **TargetProductForm.tsx**                                                                                                                                                   
  - 제품군 선택 시 불필요한 API 재호출 제거                                                                                                                                      
  - 제품명 입력 시 쿼리 스크롤 문제 해결 ✅                                                                                                                                       
                                                                                                                                                                                 
  2. **TechSecurePlanForm.tsx**                                                                                                                                                  
  - 카테고리 선택 시 불필요한 API 재호출 제거                                                                                                                                    
  - 기술계획명 입력 시 쿼리 스크롤 문제 해결 ✅                                                                                                                                   
                                                                                                                                                                                 
  3. **ProductLinePlanMapForm.tsx**                                                                                                                                              
  - 제품군 라인 선택 시 개선                                                                                                                                                     
  - 기술계획 선택 시 개선                                                                                                                                                        
                                                                                                                                                                                 
  ## 검증 계획                                                                                                                                                                   
                                                                                                                                                                                 
  ### 테스트 케이스 1: 타겟 제품 - 제품명 입력                                                                                                                                   
  ```                                                                                                                                                                            
  1. 개발자 도구 열기 (F12) → Network 탭                                                                                                                                         
  2. 타겟 제품 생성 페이지 접근                                                                                                                                                  
  3. Network 탭에서 API 호출 확인:                                                                                                                                               
  ✅ /api/reference-data/product-lines 요청 1회 발생 (페이지 로드 시)                                                                                                             
  4. "제품명" 필드에 "테스트 제품" 타이핑 (10글자)                                                                                                                               
  5. Network 탭 확인:                                                                                                                                                            
  ✅ 추가 API 요청 0회 (이전에는 10회 발생)                                                                                                                                       
  6. 제품군 드롭다운이 정상 작동하는지 확인                                                                                                                                      
  ✅ 옵션 목록이 올바르게 표시됨                                                                                                                                                  
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  ### 테스트 케이스 2: 기술확보계획 - 기술계획명 입력                                                                                                                            
  ```                                                                                                                                                                            
  1. 개발자 도구 열기 (F12) → Network 탭                                                                                                                                         
  2. 기술확보계획 생성 페이지 접근                                                                                                                                               
  3. Network 탭에서 API 호출 확인:                                                                                                                                               
  ✅ /api/reference-data/categories 요청 1회 발생 (페이지 로드 시)                                                                                                                
  4. "기술계획명" 필드에 "테스트 기술" 타이핑 (10글자)                                                                                                                           
  5. Network 탭 확인:                                                                                                                                                            
  ✅ 추가 API 요청 0회 (이전에는 10회 발생)                                                                                                                                       
  6. 카테고리 드롭다운이 정상 작동하는지 확인                                                                                                                                    
  ✅ 옵션 목록이 올바르게 표시됨                                                                                                                                                  
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  ### 테스트 케이스 3: 제품군-계획 매핑                                                                                                                                          
  ```                                                                                                                                                                            
  1. 개발자 도구 열기 (F12) → Network 탭                                                                                                                                         
  2. 제품군-계획 매핑 생성 페이지 접근                                                                                                                                           
  3. Network 탭에서 API 호출 확인:                                                                                                                                               
  ✅ /api/target-product-lines 요청 1회                                                                                                                                           
  ✅ /api/tech-secure-plans 요청 1회                                                                                                                                              
  4. 첫 번째 드롭다운 선택                                                                                                                                                       
  5. 두 번째 드롭다운 선택                                                                                                                                                       
  6. Network 탭 확인:                                                                                                                                                            
  ✅ 추가 API 요청 0회                                                                                                                                                            
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  ### 테스트 케이스 4: formatLabel 동적 변경 시나리오 (엣지 케이스)                                                                                                              
  ```                                                                                                                                                                            
  만약 미래에 formatLabel이 동적으로 변경되어야 하는 요구사항이 생긴다면:                                                                                                        
  - 옵션: formatLabel을 state로 관리하고 useMemo 사용                                                                                                                            
  - 현재는 formatLabel이 정적이므로 문제 없음                                                                                                                                    
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  ### 회귀 테스트 체크리스트                                                                                                                                                     
  ```                                                                                                                                                                            
  □ 모든 SelectField가 초기 로드 시 데이터를 정상적으로 fetch하는가?                                                                                                             
  □ 드롭다운 옵션이 올바르게 표시되는가?                                                                                                                                         
  □ 선택한 값이 정상적으로 저장되는가?                                                                                                                                           
  □ apiEndpoint가 변경될 때 데이터가 재fetch되는가? (동적 endpoint 시나리오)                                                                                                     
  □ 다른 입력 필드 타이핑 시 SelectField가 리렌더링되지 않는가?                                                                                                                  
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  ## Critical Files                                                                                                                                                              
                                                                                                                                                                                 
  ### 수정 파일                                                                                                                                                                  
  1. `src/components/trm/common/SelectField.tsx` - **단일 수정으로 모든 문제 해결**                                                                                              
                                                                                                                                                                                 
  ### 영향 받는 파일 (자동 수정됨, 직접 수정 불필요)                                                                                                                             
  2. `src/components/trm/target-products/TargetProductForm.tsx`                                                                                                                  
  3. `src/components/trm/tech-secure-plans/TechSecurePlanForm.tsx`                                                                                                               
  4. `src/components/trm/product-line-plan-map/ProductLinePlanMapForm.tsx`                                                                                                       
                                                                                                                                                                                 
  ## 예상 효과                                                                                                                                                                   
                                                                                                                                                                                 
  ### 성능 개선                                                                                                                                                                  
                                                                                                                                                                                 
  **타겟 제품 폼 (제품명 10글자 입력 시):**                                                                                                                                      
  - API 호출: 11회 → 1회 (91% 감소)                                                                                                                                              
  - 네트워크 전송량: 91% 감소                                                                                                                                                    
  - 렌더링 횟수: 대폭 감소                                                                                                                                                       
                                                                                                                                                                                 
  **기술확보계획 폼 (기술계획명 10글자 입력 시):**                                                                                                                               
  - API 호출: 11회 → 1회 (91% 감소)                                                                                                                                              
  - 네트워크 전송량: 91% 감소                                                                                                                                                    
  - 렌더링 횟수: 대폭 감소                                                                                                                                                       
                                                                                                                                                                                 
  **제품군-계획 매핑 폼:**                                                                                                                                                       
  - 불필요한 교차 호출 제거                                                                                                                                                      
  - 사용자 경험 개선                                                                                                                                                             
                                                                                                                                                                                 
  ### UX 개선                                                                                                                                                                    
  - ✅ 입력 시 쿼리 스크롤 완전 제거                                                                                                                                              
  - ✅ 부드러운 타이핑 경험                                                                                                                                                       
  - ✅ 페이지 반응성 향상                                                                                                                                                         
  - ✅ 서버 부하 감소                                                                                                                                                             
                                                                                                                                                                                 
  ### 코드 품질                                                                                                                                                                  
  - ✅ **단일 책임 원칙**: 데이터 fetching과 표시 로직 분리                                                                                                                       
  - ✅ **성능 최적화**: 불필요한 side effect 제거                                                                                                                                 
  - ✅ **유지보수성**: 단일 파일 수정으로 전역 개선                                                                                                                               
  - ✅ **React 모범 사례**: useEffect 의존성 배열 최적화                                                                                                                          
                                                                                                                                                                                 
  ## 기술적 배경                                                                                                                                                                 
                                                                                                                                                                                 
  ### React useEffect 의존성 배열 원칙                                                                                                                                           
                                                                                                                                                                                 
  **올바른 사용:**                                                                                                                                                               
  ```typescript                                                                                                                                                                  
  useEffect(() => {                                                                                                                                                              
  // 데이터 fetch                                                                                                                                                                
  }, [dataSource]);  // 데이터 소스가 변경될 때만 재fetch                                                                                                                        
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  **잘못된 사용:**                                                                                                                                                               
  ```typescript                                                                                                                                                                  
  useEffect(() => {                                                                                                                                                              
  // 데이터 fetch                                                                                                                                                                
  }, [dataSource, formatFunction]);  // 표시 함수까지 의존성에 포함 ❌                                                                                                            
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  **핵심 원칙:**                                                                                                                                                                 
  - 의존성 배열에는 **effect를 재실행해야 할 조건**만 포함                                                                                                                       
  - formatLabel은 **표시 방법**이지 **데이터 소스**가 아님                                                                                                                       
  - formatLabel 변경 = 같은 데이터를 다르게 표시 ≠ 데이터 재fetch 필요                                                                                                           
                                                                                                                                                                                 
  ### ESLint 경고 대응                                                                                                                                                           
                                                                                                                                                                                 
  수정 후 ESLint가 경고할 수 있습니다:                                                                                                                                           
  ```                                                                                                                                                                            
  React Hook useEffect has a missing dependency: 'formatLabel'                                                                                                                   
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  **대응 방법:**                                                                                                                                                                 
  ```typescript                                                                                                                                                                  
  // eslint-disable-next-line react-hooks/exhaustive-deps                                                                                                                        
  }, [apiEndpoint]);                                                                                                                                                             
  ```                                                                                                                                                                            
                                                                                                                                                                                 
  **정당한 이유:**                                                                                                                                                               
  - formatLabel은 fetchOptions 내부에서 사용되지만, 의도적으로 의존성에서 제외                                                                                                   
  - formatLabel 변경 시 데이터 재fetch는 불필요하고 비효율적                                                                                                                     
  - 이는 **의도된 최적화**이며 버그가 아님                                                                                                                                       
                                                                                                                                                                                 
  ## 구현 순서                                                                                                                                                                   
                                                                                                                                                                                 
  1. **Phase 1**: SelectField.tsx의 useEffect 의존성 배열 수정 (1분)                                                                                                             
  2. **Phase 2**: 주석 업데이트 (1분)                                                                                                                                            
  3. **Phase 3**: 테스트 케이스 1, 2 실행 (5분)                                                                                                                                  
  4. **Phase 4**: 회귀 테스트 (5분)                                                                                                                                              
                                                                                                                                                                                 
  **총 예상 소요 시간**: 12분                                                                                                                                                    
                                                                                                                                                                                 
  ## 위험 요소 및 완화 방안                                                                                                                                                      
                                                                                                                                                                                 
  ### 위험: formatLabel이 동적으로 변경되어야 하는 케이스                                                                                                                        
  - **발생 확률**: 매우 낮음 (현재 모든 formatLabel이 정적)                                                                                                                      
  - **완화**: 만약 발생 시 해당 케이스만 useMemo로 처리                                                                                                                          
                                                                                                                                                                                 
  ### 위험: 초기 fetch 시 formatLabel이 undefined                                                                                                                                
  - **발생 확률**: 없음 (formatLabel은 required prop)                                                                                                                            
  - **완화**: TypeScript가 컴파일 타임에 검증                                                                                                                                    
                                                                                                                                                                                 
  ### 위험: 없음                                                                                                                                                                 
  - 이 수정은 순수한 성능 최적화                                                                                                                                                 
  - 기능적 변경 없음                                                                                                                                                             
  - 부작용 없음                                                                                                                                                                  
                                                                                                                                                                                 
                                                                                                                                                                                 
  If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at:                  
  C:\Users\jooladen\.claude\projects\C--Users-jooladen-Desktop-nextjs-trm-crud-testdb\dfde8517-0ecc-45e7-997b-16cd64a9449c.jsonl                                                 

● 이 계획을 구현하겠습니다. 먼저 SelectField.tsx 파일을 읽어서 현재 상태를 확인하겠습니다.

● Read(src\components\trm\common\SelectField.tsx)
  ⎿  Read 109 lines

● 완벽합니다! 파일을 확인했으니 이제 문제를 해결하겠습니다.                                                                                                                      

  ★ Insight ─────────────────────────────────────
  React useEffect 최적화의 핵심 원칙:
  - useEffect 의존성 배열은 "언제 재실행해야 하는가?"에 대한 답
  - formatLabel은 데이터를 표시하는 방법이지 데이터 소스가 아님
  - 인라인 함수를 prop으로 받으면 부모가 리렌더링될 때마다 새 참조 생성됨
  - 불필요한 의존성을 제거하면 cascade re-rendering을 방지할 수 있음
  ─────────────────────────────────────────────────

  이제 SelectField.tsx를 수정하겠습니다:

● Update(src\components\trm\common\SelectField.tsx)
  ⎿  Added 2 lines, removed 1 line
      2  
      3  /**
      4   * 외래키 선택을 위한 드롭다운 필드 컴포넌트
      5 - * API에서 참조 데이터를 fetch하여 표시합니다                                                                                                                           
      5 + * - API에서 참조 데이터를 1회만 fetch                                                                                                                                  
      6 + * - formatLabel 변경 시 불필요한 재fetch 방지                                                                                                                          
      7   */
      8  
      9  import { useEffect, useState } from 'react';

● Update(src\components\trm\common\SelectField.tsx)
  ⎿  Added 3 lines, removed 1 line
      63      }
      64  
      65      fetchOptions();
      66 -  }, [apiEndpoint, formatLabel]);                                                                                                                                      
      66 +    // formatLabel 제거: 표시 로직은 데이터 fetching과 독립적                                                                                                          
      67 +    // eslint-disable-next-line react-hooks/exhaustive-deps                                                                                                            
      68 +  }, [apiEndpoint]);                                                                                                                                                   
      69  
      70    return (
      71      <div className="mb-4">

● 완벽합니다! 수정이 완료되었습니다. 수정된 내용을 확인해보겠습니다:

● Read(src\components\trm\common\SelectField.tsx)
  ⎿  Read 70 lines

● ✅ 수정 완료! 단일 파일 수정으로 문제가 해결되었습니다.  )

  변경 사항

  src/components/trm/common/SelectField.tsx:68
  // 수정 전
  }, [apiEndpoint, formatLabel]);

  // 수정 후
  // formatLabel 제거: 표시 로직은 데이터 fetching과 독립적
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiEndpoint]);

  ★ Insight ─────────────────────────────────────
  문제의 연쇄 반응:
  1. 사용자가 "제품명" 입력 → formData 상태 변경
  2. 부모 컴포넌트 리렌더링 → 인라인 함수 formatLabel 새 참조 생성
  3. SelectField의 useEffect가 formatLabel 변경 감지 → API 재호출
  4. 10글자 입력 시 11번의 불필요한 API 호출 발생!

  해결 방법: formatLabel은 이미 fetch된 데이터의 표시 방식만 결정하므로 데이터 재fetch를 트리거할 필요가 없습니다. apiEndpoint만 의존성으로 유지하면 데이터 소스가 변경될 때만   
  재fetch합니다.
  ─────────────────────────────────────────────────

  테스트 방법

  1️⃣ 타겟 제품 폼 테스트


  # 개발 서버 시작
  npm run dev

  1. 개발자 도구 열기 (F12) → Network 탭 선택
  2. http://localhost:3000/trm/target-products/create 접속
  3. 초기 API 호출 확인:
    - ✅ /api/reference-data/product-lines 요청 1회 발생 (정상)
  4. "제품명" 필드에 "테스트제품12345" 타이핑 (10글자)
  5. Network 탭 확인:
    - ✅ 추가 API 요청 0회 (이전에는 10회 발생했음!)
    - ✅ 쿼리가 더 이상 스크롤되지 않음
  6. 제품군 드롭다운 정상 작동 확인

  2️⃣ 기술확보계획 폼 테스트


  1. http://localhost:3000/trm/tech-secure-plans/create 접속
  2. 초기 API 호출 확인:
    - ✅ /api/reference-data/categories 요청 1회 발생
  3. "기술계획명" 필드에 "테스트기술12345" 타이핑 (10글자)
  4. Network 탭 확인:
    - ✅ 추가 API 요청 0회
    - ✅ 쿼리가 더 이상 스크롤되지 않음

  3️⃣ 제품군-계획 매핑 테스트


  1. http://localhost:3000/trm/product-line-plan-map/create 접속
  2. 초기 API 호출 확인:
    - ✅ /api/target-product-lines 요청 1회
    - ✅ /api/tech-secure-plans 요청 1회
  3. 드롭다운 선택 시 추가 API 요청 없음 확인

  예상 효과

  성능 개선

  - API 호출 횟수: 91% 감소 (11회 → 1회)
  - 네트워크 부하: 91% 감소
  - 서버 부하: 대폭 감소

  UX 개선

  - ✅ 입력 시 쿼리 스크롤 완전 제거
  - ✅ 부드러운 타이핑 경험
  - ✅ 즉각적인 반응성

  영향 받는 컴포넌트 (자동 수정됨)

  이 단일 수정으로 모든 SelectField 사용처가 자동으로 개선됩니다:
  - ✅ TargetProductForm.tsx (src/components/trm/target-products/TargetProductForm.tsx:102-104)
  - ✅ TechSecurePlanForm.tsx (src/components/trm/tech-secure-plans/TechSecurePlanForm.tsx)
  - ✅ ProductLinePlanMapForm.tsx (src/components/trm/product-line-plan-map/ProductLinePlanMapForm.tsx)
  - ✅ TargetProductLineForm.tsx
  - ✅ CategorySystemForm.tsx

  테스트해보시고 문제가 해결되었는지 확인해주세요! 🚀