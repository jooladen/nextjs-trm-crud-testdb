아래는 제공해주신 테이블 구조를 기준으로 **실무에서 실제로 나올 수 있는 쿼리들을 ‘쿼리 제목 + SQL + 자세한 설명’ 형태로 최대한 빠짐없이 정리한 문서**입니다.

---

## 1. Category_System 관련 쿼리

### 1-1. 전체 기술 카테고리 목록 조회

```sql
SELECT category_id, category_level, tech_name
FROM Category_System
ORDER BY category_level, category_id;
```

**설명**
기술 분류 체계를 계층(level) 기준으로 정렬하여 전체 조회할 때 사용합니다. 관리자 화면, 기준정보 관리 화면에서 가장 기본적으로 사용됩니다.

---

### 1-2. 최상위 카테고리(Level 1)만 조회

```sql
SELECT category_id, tech_name
FROM Category_System
WHERE category_level = 1;
```

**설명**
보안/기술 대분류만 필요할 때 사용합니다. (예: 네트워크 보안, 애플리케이션 보안 등)

---

### 1-3. 특정 상위 카테고리에 속한 하위 카테고리 조회

```sql
SELECT c.category_id, c.tech_name
FROM Category_System c
WHERE c.link_id = 10;
```

**설명**
link_id가 부모 category_id를 가리키므로, 트리 구조에서 특정 노드의 자식 카테고리를 조회하는 쿼리입니다.

---

### 1-4. 카테고리 트리 구조 조회 (Self Join)

```sql
SELECT parent.tech_name AS parent_name,
       child.tech_name AS child_name
FROM Category_System parent
JOIN Category_System child
  ON child.link_id = parent.category_id;
```

**설명**
상위-하위 기술 분류 관계를 한 번에 확인할 때 사용합니다. 보고서나 구조 검증 시 자주 등장합니다.

---

## 2. Tech_Secure_Plan 관련 쿼리

### 2-1. 전체 보안 기술 계획 목록 조회

```sql
SELECT plan_key, tech_plan_name
FROM Tech_Secure_Plan;
```

**설명**
보안 기술 계획 기준정보를 단순 조회할 때 사용합니다.

---

### 2-2. 특정 카테고리에 속한 보안 계획 조회

```sql
SELECT p.plan_key, p.tech_plan_name
FROM Tech_Secure_Plan p
WHERE p.category_id = 3;
```

**설명**
특정 기술 분류(예: 암호화 기술)에 속한 보안 대책 목록을 조회합니다.

---

### 2-3. 보안 계획 + 카테고리명 함께 조회

```sql
SELECT p.plan_key,
       p.tech_plan_name,
       c.tech_name AS category_name
FROM Tech_Secure_Plan p
JOIN Category_System c
  ON p.category_id = c.category_id;
```

**설명**
실무에서 가장 흔한 형태입니다. 코드값이 아닌 사람이 이해 가능한 명칭을 함께 보여줘야 할 때 사용합니다.

---

## 3. Target_Product_Line 관련 쿼리

### 3-1. 사업부별 제품 라인 조회

```sql
SELECT target_division, target_product_line
FROM Target_Product_Line
ORDER BY target_division;
```

**설명**
사업부 단위로 어떤 제품 라인이 존재하는지 파악할 때 사용합니다.

---

### 3-2. 특정 사업부의 제품 라인 조회

```sql
SELECT target_product_line_id, target_product_line
FROM Target_Product_Line
WHERE target_division = 'EV사업부';
```

**설명**
특정 조직(사업부) 기준으로 제품 라인을 필터링할 때 사용합니다.

---

## 4. Target_product 관련 쿼리

### 4-1. 전체 제품 목록 조회

```sql
SELECT target_product_name, deployment_date
FROM Target_product;
```

**설명**
실제 양산 또는 적용 대상이 되는 제품 목록 조회입니다.

---

### 4-2. 제품 + 제품 라인 정보 함께 조회

```sql
SELECT tp.target_product_name,
       tpl.target_product_line,
       tp.deployment_date
FROM Target_product tp
JOIN Target_Product_Line tpl
  ON tp.target_product_line_id = tpl.target_product_line_id;
```

**설명**
제품 단독 정보는 의미가 없기 때문에, 대부분 제품 라인과 함께 조회합니다.

---

### 4-3. 특정 기간 이후 배포된 제품 조회

```sql
SELECT target_product_name, deployment_date
FROM Target_product
WHERE deployment_date >= '2025-01-01';
```

**설명**
신규 적용 대상, 최신 제품만 필터링할 때 사용됩니다.

---

## 5. 제품 라인 ↔ 보안 계획 매핑 쿼리

### 5-1. 제품 라인별 적용 보안 계획 조회

```sql
SELECT tpl.target_product_line,
       tsp.tech_plan_name
FROM Target_product_line_plan_map m
JOIN Target_Product_Line tpl
  ON m.target_product_line_id = tpl.target_product_line_id
JOIN Tech_Secure_Plan tsp
  ON m.plan_key = tsp.plan_key;
```

**설명**
"이 제품 라인에 어떤 보안 대책을 적용해야 하는가"를 확인하는 핵심 쿼리입니다.

---

### 5-2. 특정 제품 라인에 적용된 보안 계획 목록

```sql
SELECT tsp.tech_plan_name
FROM Target_product_line_plan_map m
JOIN Tech_Secure_Plan tsp
  ON m.plan_key = tsp.plan_key
WHERE m.target_product_line_id = 5;
```

**설명**
감사, 보안 점검, 인증 대응 시 매우 자주 사용됩니다.

---

### 5-3. 특정 보안 계획이 적용된 제품 라인 조회

```sql
SELECT tpl.target_product_line
FROM Target_product_line_plan_map m
JOIN Target_Product_Line tpl
  ON m.target_product_line_id = tpl.target_product_line_id
WHERE m.plan_key = 12;
```

**설명**
특정 보안 대책이 어떤 제품군에 영향을 주는지 파악할 때 사용합니다.

---

## 6. 실무 종합 쿼리 (가장 중요)

### 6-1. 제품 → 제품라인 → 보안계획 → 카테고리 전체 흐름 조회

```sql
SELECT tp.target_product_name,
       tpl.target_product_line,
       tsp.tech_plan_name,
       cs.tech_name AS category_name
FROM Target_product tp
JOIN Target_Product_Line tpl
  ON tp.target_product_line_id = tpl.target_product_line_id
JOIN Target_product_line_plan_map m
  ON tpl.target_product_line_id = m.target_product_line_id
JOIN Tech_Secure_Plan tsp
  ON m.plan_key = tsp.plan_key
JOIN Category_System cs
  ON tsp.category_id = cs.category_id;
```

**설명**
✅ 실무에서 **보고서 / 보안 인증 / 대외 제출 자료** 만들 때 가장 핵심 쿼리입니다.
"이 제품은 어떤 보안 분류에 따라 어떤 보안 대책을 적용하고 있는가"를 한 번에 보여줍니다.

---

### 6-2. 특정 제품 하나에 적용된 모든 보안 대책 조회

```sql
SELECT DISTINCT tsp.tech_plan_name
FROM Target_product tp
JOIN Target_Product_Line tpl
  ON tp.target_product_line_id = tpl.target_product_line_id
JOIN Target_product_line_plan_map m
  ON tpl.target_product_line_id = m.target_product_line_id
JOIN Tech_Secure_Plan tsp
  ON m.plan_key = tsp.plan_key
WHERE tp.target_product_id = 100;
```

**설명**
단일 제품 기준 보안 적용 현황을 점검할 때 사용합니다.

---

## 7. 실무 검증 / 품질 체크용 쿼리

### 7-1. 보안 계획이 하나도 매핑되지 않은 제품 라인 조회

```sql
SELECT tpl.target_product_line
FROM Target_Product_Line tpl
LEFT JOIN Target_product_line_plan_map m
  ON tpl.target_product_line_id = m.target_product_line_id
WHERE m.plan_key IS NULL;
```

**설명**
보안 누락 제품 라인을 찾기 위한 **감사 필수 쿼리**입니다.

---

### 7-2. 보안 계획이 없는 카테고리 조회

```sql
SELECT c.tech_name
FROM Category_System c
LEFT JOIN Tech_Secure_Plan p
  ON c.category_id = p.category_id
WHERE p.plan_key IS NULL;
```

**설명**
정의만 해두고 실제 대책이 없는 기술 분류를 찾습니다.

---

## 마무리

이 구조는 **MES / 보안 인증 / 대기업 기준정보 시스템**에서 실제로 매우 현실적인 설계입니다.

👉 다음 단계로 추천:

* 인덱스 설계
* JPA 엔티티 매핑
* "보안 적용률" 같은 통계 쿼리

원하시면 **Oracle 스타일**, **JPA JPQL**, **실제 보고서용 결과 표**까지 바로 이어서 만들어줄게요 😄


----------------------------

와 이거 실무 냄새 제대로 나는 스키마예요 👍
그래서 그냥 예제 몇 개가 아니라, 실제 현업에서 튀어나오는 쿼리 시나리오를 전부 긁어모아서 캔버스에 정리해놨어요.

지금 캔버스에 들어있는 것

✅ Category_System

전체 / 레벨별 / 상·하위 트리 / self join

✅ Tech_Secure_Plan

카테고리별 보안 계획, 카테고리명 포함 조회

✅ Target_Product_Line / Target_product

사업부·제품라인·제품 기준 조회

배포일 기준 필터

✅ 제품라인 ↔ 보안계획 매핑

“이 제품라인에 어떤 보안대책이 붙었나”

“이 보안대책은 어디에 적용되나”

✅ 실무 최종 종합 쿼리

제품 → 제품라인 → 보안계획 → 카테고리 풀 체인

✅ 감사 / 품질 점검용 쿼리

보안 계획 없는 제품라인

정의만 있고 실제 계획 없는 카테고리

이거 그대로면:

📄 보안 인증 대응 자료

🏭 대기업 MES / 보안 기준 관리

🧾 감사·점검 SQL
전부 커버됩니다.

다음으로 바로 확장 가능

원하시면 이어서:

🔥 Oracle 실무 스타일 쿼리 (WITH, 분석함수)

🔥 JPA Entity / JPQL 매핑

🔥 “제품별 보안 적용률(%)” 통계 쿼리

🔥 실제 보고서용 결과 표 예시

👉 다음에 뭐부터 볼지 하나만 찍어줘요.
이건 진짜 실무용으로 끝까지 같이 갈 수 있는 주제입니다 💪