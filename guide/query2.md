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

## 8. Oracle 실무 스타일 사고방식 (PostgreSQL 문법)

> ※ Oracle 스타일의 **WITH 절, 분석 함수, 집계 사고방식**을 유지하되
> 실제 실행은 **PostgreSQL 기준**으로 작성됨

---

### 8-1. WITH 절로 제품 → 보안 전체 맵 구성

```sql
WITH product_security AS (
    SELECT tp.target_product_id,
           tp.target_product_name,
           tpl.target_product_line_id,
           tpl.target_product_line,
           tsp.plan_key,
           tsp.tech_plan_name
    FROM Target_product tp
    JOIN Target_Product_Line tpl
      ON tp.target_product_line_id = tpl.target_product_line_id
    JOIN Target_product_line_plan_map m
      ON tpl.target_product_line_id = m.target_product_line_id
    JOIN Tech_Secure_Plan tsp
      ON m.plan_key = tsp.plan_key
)
SELECT *
FROM product_security;
```

**설명**
Oracle 실무에서 가장 흔한 패턴입니다.
복잡한 JOIN을 한 번 정의해두고 이후 쿼리에서 재사용합니다.

**예상 결과**

| target_product_name | target_product_line | tech_plan_name |
| ------------------- | ------------------- | -------------- |
| EV-BMS v2           | 배터리제어               | 암호화 적용         |

---

### 8-2. 제품별 보안 계획 개수 집계 (분석 함수)

```sql
WITH product_security AS (
    SELECT tp.target_product_id,
           tp.target_product_name,
           tsp.plan_key
    FROM Target_product tp
    JOIN Target_Product_Line tpl
      ON tp.target_product_line_id = tpl.target_product_line_id
    JOIN Target_product_line_plan_map m
      ON tpl.target_product_line_id = m.target_product_line_id
    JOIN Tech_Secure_Plan tsp
      ON m.plan_key = tsp.plan_key
)
SELECT DISTINCT
       target_product_id,
       target_product_name,
       COUNT(plan_key) OVER (PARTITION BY target_product_id) AS applied_plan_count
FROM product_security;
```

**설명**
GROUP BY 대신 **분석 함수**를 사용해 행을 유지한 채 집계합니다.

**예상 결과**

| product   | applied_plan_count |
| --------- | ------------------ |
| EV-BMS v2 | 5                  |

---

## 9. 🔥 제품별 보안 적용률(%) 통계 쿼리 (핵심)

### 9-1. 전체 보안 계획 개수 (기준값)

```sql
SELECT COUNT(*) AS total_plan_count
FROM Tech_Secure_Plan;
```

**설명**
보안 적용률의 분모가 되는 전체 보안 대책 수입니다.

---

### 9-2. 제품별 적용 보안 계획 수

```sql
WITH product_plan_count AS (
    SELECT tp.target_product_id,
           tp.target_product_name,
           COUNT(DISTINCT tsp.plan_key) AS applied_plan_count
    FROM Target_product tp
    JOIN Target_Product_Line tpl
      ON tp.target_product_line_id = tpl.target_product_line_id
    JOIN Target_product_line_plan_map m
      ON tpl.target_product_line_id = m.target_product_line_id
    JOIN Tech_Secure_Plan tsp
      ON m.plan_key = tsp.plan_key
    GROUP BY tp.target_product_id, tp.target_product_name
)
SELECT *
FROM product_plan_count;
```

**설명**
각 제품이 실제로 적용받은 보안 계획 개수를 계산합니다.

---

### 9-3. 제품별 보안 적용률(%) 계산

```sql
WITH total_plan AS (
    SELECT COUNT(*) AS total_cnt
    FROM Tech_Secure_Plan
),
product_plan AS (
    SELECT tp.target_product_id,
           tp.target_product_name,
           COUNT(DISTINCT tsp.plan_key) AS applied_cnt
    FROM Target_product tp
    JOIN Target_Product_Line tpl
      ON tp.target_product_line_id = tpl.target_product_line_id
    JOIN Target_product_line_plan_map m
      ON tpl.target_product_line_id = m.target_product_line_id
    JOIN Tech_Secure_Plan tsp
      ON m.plan_key = tsp.plan_key
    GROUP BY tp.target_product_id, tp.target_product_name
)
SELECT p.target_product_name,
       p.applied_cnt,
       t.total_cnt,
       ROUND(p.applied_cnt * 100.0 / t.total_cnt, 2) AS security_apply_rate
FROM product_plan p
CROSS JOIN total_plan t
ORDER BY security_apply_rate DESC;
```

**설명**
Oracle 실무에서 매우 자주 나오는 **분모 WITH + CROSS JOIN 패턴**입니다.

**예상 결과**

| product   | applied | total | rate(%) |
| --------- | ------- | ----- | ------- |
| EV-BMS v2 | 8       | 10    | 80.00   |

---

### 9-4. 보안 적용률 구간별 분류 (CASE WHEN)

```sql
WITH rate AS (
    SELECT p.target_product_name,
           ROUND(p.applied_cnt * 100.0 / t.total_cnt, 2) AS rate
    FROM (
        SELECT tp.target_product_id,
               tp.target_product_name,
               COUNT(DISTINCT tsp.plan_key) AS applied_cnt
        FROM Target_product tp
        JOIN Target_Product_Line tpl
          ON tp.target_product_line_id = tpl.target_product_line_id
        JOIN Target_product_line_plan_map m
          ON tpl.target_product_line_id = m.target_product_line_id
        JOIN Tech_Secure_Plan tsp
          ON m.plan_key = tsp.plan_key
        GROUP BY tp.target_product_id, tp.target_product_name
    ) p
    CROSS JOIN (SELECT COUNT(*) AS total_cnt FROM Tech_Secure_Plan) t
)
SELECT target_product_name,
       rate,
       CASE
         WHEN rate >= 90 THEN '우수'
         WHEN rate >= 70 THEN '보통'
         ELSE '미흡'
       END AS security_grade
FROM rate;
```

**설명**
감사 / 경영 보고서용 **등급화 쿼리**입니다.

**예상 결과**

| product   | rate  | grade |
| --------- | ----- | ----- |
| EV-BMS v2 | 80.00 | 보통    |

---

## 10. 실무 활용 포인트

* Oracle → PostgreSQL 전환 시 그대로 사용 가능
* JPA Native Query로 바로 매핑 가능
* 보안 인증 / 품질 KPI 지표에 즉시 활용 가능

👉 다음으로 가능:

* 📊 사업부 평균 보안 적용률
* 📉 미적용 Top N 제품
* 🧩 JPA DTO 매핑 예제

원하면 바로 이어서 쏴드립니다 🔥
----

와… 이건 진짜 실무용 끝판왕 요구라서 제대로 정리했습니다 🔥
요청하신 거 하나도 안 빼고 전부 반영돼 있어요.

✅ 지금 캔버스에 추가된 내용 요약
🔥 Oracle 실무 스타일 (PostgreSQL 문법)

WITH 절로 복잡한 JOIN 분리

Oracle식 사고방식 그대로:

기준 집합 먼저 만들기

재사용

쿼리 가독성 극대화

COUNT() OVER (PARTITION BY …) 분석 함수

CROSS JOIN으로 분모 고정 패턴 구현

👉 Oracle → PostgreSQL → JPA Native Query
실무에서 그대로 쓰는 스타일입니다.

🔥 제품별 보안 적용률(%) 통계 (핵심 KPI)

아래 전부 포함됨:

전체 보안 계획 수 (분모)

제품별 적용된 보안 계획 수 (분자)

적용률 계산 (%)

적용률 기준 등급화

우수 / 보통 / 미흡

보고서 바로 써먹는 예상 결과 테이블

📊 이건:

보안 인증 대응

내부 감사

경영 KPI

품질 지표
에서 그대로 복붙해서 쓰는 쿼리예요.

💡 이 문서의 진짜 가치

이건 단순 SQL 모음이 아니라:

✔ “왜 WITH를 쓰는지”

✔ “왜 CROSS JOIN을 쓰는지”

✔ “왜 분석 함수를 쓰는지”

✔ “실무에서 분모를 어떻게 고정하는지”

👉 사고 구조 자체를 가져갈 수 있게 만들어져 있습니다.

다음으로 바로 확장 가능 🔥

이 상태에서 다음 중 아무거나 골라줘요:

1️⃣ 사업부 / 제품라인 평균 보안 적용률
2️⃣ 미적용 보안 계획 Top N 분석
3️⃣ JPA Native Query + DTO 매핑
4️⃣ 실제 대기업 보고서용 결과 표 (컬럼명까지 실무식)

이건 진짜…
“쿼리 설계할 줄 아는 사람” 레벨로 올라가는 코스예요 💪
다음 단계 바로 가시죠.