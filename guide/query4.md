# 실무 쿼리 종합 가이드 (PostgreSQL)

> 도메인 정의

* **Category_System** : 분류 체계 (기술/역량/분야 분류)
* **Tech_Secure_Plan** : 기술확보계획 (확보·개발·적용해야 할 기술 계획)
* **Target_Product_Line** : 타겟제품군 (차종, 플랫폼, 라인업)
* **Target_product** : 타겟제품 (실제 제품/모델)
* **Target_product_line_plan_map** : 타겟제품군 ↔ 기술확보계획 교차 엔티티

본 문서는 **PostgreSQL 기준**, 실무에서 실제로 발생하는 쿼리를
**What / Why / How / 예상 결과 형태**로 정리한 레퍼런스입니다.

---

## 1. 기준정보 관리 (Category / Plan)

### 1-1. 기술 분류 전체 트리 조회

**What**
기술 분류의 상·하위 구조를 한 번에 조회

**Why**

* 분류 체계 검증
* 기준정보 관리 화면

**How**

```sql
SELECT parent.tech_name AS parent_category,
       child.tech_name  AS child_category
FROM Category_System parent
LEFT JOIN Category_System child
  ON child.link_id = parent.category_id
ORDER BY parent.category_level, parent.category_id;
```

**예상 결과**

| parent_category | child_category |
| --------------- | -------------- |
| SW              | 암호기술           |
| SW              | 인증기술           |

---

### 1-2. 분류별 기술확보계획 목록

**What**
각 분류에 어떤 기술확보계획이 정의돼 있는지

**Why**

* 분류는 있으나 계획이 없는 구간 식별

**How**

```sql
SELECT c.tech_name AS category,
       p.tech_plan_name
FROM Category_System c
LEFT JOIN Tech_Secure_Plan p
  ON c.category_id = p.category_id
ORDER BY c.tech_name;
```

**예상 결과**

| category | tech_plan_name |
| -------- | -------------- |
| 암호기술     | 키관리체계 구축       |

---

## 2. 타겟제품군 / 타겟제품

### 2-1. 타겟제품군별 타겟제품 목록

**What**
제품군과 실제 제품 매핑 조회

**Why**

* 제품군 단위 관리
* 로드맵 관리

**How**

```sql
SELECT tpl.target_product_line,
       tp.target_product_name,
       tp.deployment_date
FROM Target_Product_Line tpl
JOIN Target_product tp
  ON tpl.target_product_line_id = tp.target_product_line_id
ORDER BY tpl.target_product_line, tp.deployment_date;
```

**예상 결과**

| product_line | product   | deployment_date |
| ------------ | --------- | --------------- |
| EV 플랫폼       | EV-BMS v2 | 2025-03-01      |

---

### 2-2. 특정 기간 내 출시 제품

**What**
기간 필터링된 제품

**Why**

* 연간 계획
* 분기 보고

**How**

```sql
SELECT target_product_name, deployment_date
FROM Target_product
WHERE deployment_date BETWEEN '2025-01-01' AND '2025-12-31';
```

---

## 3. 핵심 비즈니스 : 기술확보계획 적용

### 3-1. 타겟제품군별 적용 기술확보계획

**What**
제품군 기준 적용 기술 목록

**Why**

* 기술 적용 책임 단위가 제품군인 경우

**How**

```sql
SELECT tpl.target_product_line,
       p.tech_plan_name
FROM Target_Product_Line tpl
JOIN Target_product_line_plan_map m
  ON tpl.target_product_line_id = m.target_product_line_id
JOIN Tech_Secure_Plan p
  ON m.plan_key = p.plan_key
ORDER BY tpl.target_product_line;
```

**예상 결과**

| product_line | tech_plan_name |
| ------------ | -------------- |
| EV 플랫폼       | 키관리체계 구축       |

---

### 3-2. 타겟제품 기준 적용 기술확보계획

**What**
실제 제품에 어떤 기술이 적용되는지

**Why**

* 감사
* 인증 대응

**How**

```sql
SELECT tp.target_product_name,
       p.tech_plan_name
FROM Target_product tp
JOIN Target_Product_Line tpl
  ON tp.target_product_line_id = tpl.target_product_line_id
JOIN Target_product_line_plan_map m
  ON tpl.target_product_line_id = m.target_product_line_id
JOIN Tech_Secure_Plan p
  ON m.plan_key = p.plan_key;
```

---

## 4. 통계 / KPI (고급)

### 4-1. 제품별 적용 기술 개수 (분석 함수)

**What**
제품 단위 기술 개수

**Why**

* 적용 범위 비교

**How**

```sql
WITH base AS (
    SELECT tp.target_product_id,
           tp.target_product_name,
           p.plan_key
    FROM Target_product tp
    JOIN Target_Product_Line tpl
      ON tp.target_product_line_id = tpl.target_product_line_id
    JOIN Target_product_line_plan_map m
      ON tpl.target_product_line_id = m.target_product_line_id
    JOIN Tech_Secure_Plan p
      ON m.plan_key = p.plan_key
)
SELECT DISTINCT
       target_product_name,
       COUNT(plan_key) OVER (PARTITION BY target_product_id) AS tech_count
FROM base;
```

**예상 결과**

| product   | tech_count |
| --------- | ---------- |
| EV-BMS v2 | 7          |

---

### 4-2. 제품별 기술확보 적용률 (%)

**What**
제품별 기술 확보 수준

**Why**

* KPI
* 경영 보고

**How**

```sql
WITH total AS (
    SELECT COUNT(*) AS total_cnt FROM Tech_Secure_Plan
),
product_cnt AS (
    SELECT tp.target_product_id,
           tp.target_product_name,
           COUNT(DISTINCT p.plan_key) AS applied_cnt
    FROM Target_product tp
    JOIN Target_Product_Line tpl
      ON tp.target_product_line_id = tpl.target_product_line_id
    JOIN Target_product_line_plan_map m
      ON tpl.target_product_line_id = m.target_product_line_id
    JOIN Tech_Secure_Plan p
      ON m.plan_key = p.plan_key
    GROUP BY tp.target_product_id, tp.target_product_name
)
SELECT pc.target_product_name,
       pc.applied_cnt,
       t.total_cnt,
       ROUND(pc.applied_cnt * 100.0 / t.total_cnt, 2) AS apply_rate
FROM product_cnt pc
CROSS JOIN total t
ORDER BY apply_rate DESC;
```

**예상 결과**

| product   | applied | total | rate  |
| --------- | ------- | ----- | ----- |
| EV-BMS v2 | 7       | 10    | 70.00 |

---

## 5. 검증 / 누락 점검 (실무 핵심)

### 5-1. 기술확보계획이 하나도 없는 제품군

**Why**
기술 공백 리스크 식별

```sql
SELECT tpl.target_product_line
FROM Target_Product_Line tpl
LEFT JOIN Target_product_line_plan_map m
  ON tpl.target_product_line_id = m.target_product_line_id
WHERE m.plan_key IS NULL;
```

---

### 5-2. 어떤 제품에도 적용되지 않은 기술확보계획

```sql
SELECT p.tech_plan_name
FROM Tech_Secure_Plan p
LEFT JOIN Target_product_line_plan_map m
  ON p.plan_key = m.plan_key
WHERE m.plan_key IS NULL;
```

---

## 6. 설계 제안 (실무 개선 포인트)

* 기술확보계획 버전 관리 테이블 분리
* 제품 단위 override 매핑 테이블 추가
* 적용 상태 컬럼 (계획/진행/완료)
* KPI 스냅샷 테이블 분리 (월별)

---

## 7. 🔥 추가 제안 쿼리 (실무 고급)

아래는 **실무 회의 / 임원 보고 / 감사 질의**에서 실제로 튀어나오는 쿼리들입니다.

---

### 7-1. 기술확보계획 커버리지 (몇 개 제품군에 적용됐는가)

**What**
각 기술확보계획이 몇 개 제품군에 적용됐는지

**Why**

* 특정 기술이 핵심인지 / 한정적인지 판단

**How**

```sql
SELECT p.tech_plan_name,
       COUNT(DISTINCT m.target_product_line_id) AS product_line_cnt
FROM Tech_Secure_Plan p
LEFT JOIN Target_product_line_plan_map m
  ON p.plan_key = m.plan_key
GROUP BY p.tech_plan_name
ORDER BY product_line_cnt DESC;
```

**예상 결과**

| tech_plan_name | product_line_cnt |
| -------------- | ---------------- |
| 공통암호모듈         | 5                |

---

### 7-2. 제품군별 기술 확보 밀도

**What**
제품군 하나당 평균 몇 개 기술을 확보했는지

**Why**

* 기술 복잡도 비교
* 개발 부담 판단

**How**

```sql
SELECT tpl.target_product_line,
       COUNT(m.plan_key) AS tech_cnt
FROM Target_Product_Line tpl
LEFT JOIN Target_product_line_plan_map m
  ON tpl.target_product_line_id = m.target_product_line_id
GROUP BY tpl.target_product_line;
```

---

### 7-3. 기술 분류별 적용 제품 수

**What**
분류 단위 영향 범위

**Why**

* 전략 기술 판단

**How**

```sql
SELECT c.tech_name AS category,
       COUNT(DISTINCT tpl.target_product_line_id) AS affected_product_lines
FROM Category_System c
JOIN Tech_Secure_Plan p
  ON c.category_id = p.category_id
JOIN Target_product_line_plan_map m
  ON p.plan_key = m.plan_key
JOIN Target_Product_Line tpl
  ON m.target_product_line_id = tpl.target_product_line_id
GROUP BY c.tech_name;
```

---

### 7-4. 기술확보계획 중복 적용 제품군 Top N

**What**
기술이 가장 많이 몰린 제품군

**Why**

* 리스크 집중도 분석

**How**

```sql
SELECT tpl.target_product_line,
       COUNT(m.plan_key) AS tech_cnt
FROM Target_Product_Line tpl
JOIN Target_product_line_plan_map m
  ON tpl.target_product_line_id = m.target_product_line_id
GROUP BY tpl.target_product_line
ORDER BY tech_cnt DESC
LIMIT 5;
```

---

### 7-5. 기술 분류별 제품 적용률

**What**
분류 기준 적용률

**Why**

* 기술 분야별 성숙도 판단

**How**

```sql
WITH total_pl AS (
    SELECT COUNT(*) AS total_cnt FROM Target_Product_Line
)
SELECT c.tech_name,
       COUNT(DISTINCT m.target_product_line_id) AS applied_cnt,
       ROUND(COUNT(DISTINCT m.target_product_line_id) * 100.0 / t.total_cnt, 2) AS rate
FROM Category_System c
JOIN Tech_Secure_Plan p ON c.category_id = p.category_id
LEFT JOIN Target_product_line_plan_map m ON p.plan_key = m.plan_key
CROSS JOIN total_pl t
GROUP BY c.tech_name, t.total_cnt;
```

---

## 8. 🧠 “데이터로 설명하는 사람”이 되는 방법 (실무 제안)

### 8-1. 질문을 이렇게 바꾼다

| 일반 질문      | 데이터 질문                 |
| ---------- | ---------------------- |
| 기술 확보 됐나요? | **적용률이 몇 %인가요?**       |
| 문제 없나요?    | **미적용 제품은 몇 개인가요?**    |
| 중요한 기술은?   | **가장 많은 제품에 적용된 기술은?** |

---

### 8-2. 말보다 표 → 표보다 지표

* ❌ "대부분 적용됐습니다"
* ✅ "전체 12개 기술 중 평균 적용률 78%이며, EV 플랫폼은 65%입니다"

→ 이 문서의 쿼리가 바로 그 근거

---

### 8-3. 회의에서 바로 쓰는 멘트 예시

> "EV-BMS v2는 전체 기술확보계획 대비 70% 수준이며,
> 미적용 기술은 주로 통신 보안 계열입니다"

(→ 4-2, 7-3 쿼리 근거)

---

### 8-4. 실무 루틴 제안

1. 기준 정의 (Category / Plan)
2. 대상 매핑 (Product Line)
3. 적용 현황 산출 (WITH + 집계)
4. 지표화 (비율 / Top N)
5. 스냅샷 저장 (월별)

---

## 결론 (중요)

> SQL을 잘 치는 사람과
> **데이터로 설명하는 사람의 차이는**
>
> 👉 "조회"에서 끝나느냐
> 👉 "지표"로 말하느냐

지금 이 구조와 쿼리들은
**보고·설득·의사결정용 SQL**입니다.

이 문서 하나면:

* 실무 SQL 레퍼런스
* 회의 대응 자료
* KPI 산출 근거

전부 커버됩니다.
----------------

좋다… 이제 이건 쿼리 몇 개 더 수준이 아니라
👉 **“실무에서 영향력 생기는 사람 코스”**로 들어왔어요 🔥

지금 캔버스에 제가 한 일부터 요약할게요.

✅ 추가로 넣어준 쿼리 성격
🔹 “왜 임원이 묻는 질문”에 답하는 쿼리들

단순 조회 ❌
판단·비교·우선순위를 만드는 쿼리 ⭕

추가된 것들:

기술확보계획 커버리지

어떤 기술이 몇 개 제품군에 적용됐는지

👉 핵심 기술 / 마이너 기술 구분

제품군별 기술 확보 밀도

제품군 하나에 기술이 너무 많은지?

👉 복잡도 / 리스크 집중도

기술 분류별 영향 범위

어떤 기술 분야가 실제로 많이 쓰이는지

👉 전략 투자 근거

기술 몰림 Top N

기술이 가장 많이 얹힌 제품군

👉 품질·일정 리스크 후보

분류 기준 적용률

기술 분야별 성숙도

👉 “어디가 약한가”를 수치로 설명

이건 전부:

회의실

보고서

감사 대응
에서 바로 질문으로 튀어나오는 것들이에요.

🧠 “데이터로 설명하는 사람” 파트가 진짜 핵심

이 부분은 쿼리보다 더 중요해요.

1️⃣ 질문을 바꾸는 능력

이미 문서에 들어가 있지만 다시 강조하면:

평범한 사람	데이터로 설명하는 사람
됐습니다	몇 %입니다
대부분	12개 중 9개입니다
문제없음	미적용 3개 존재합니다

👉 이 순간부터 말의 무게가 달라짐

2️⃣ SQL의 목적이 바뀜

❌

“데이터 뽑아주세요”

✅

“의사결정에 필요한 지표를 만듭니다”

그래서:

GROUP BY → 비교

COUNT → 규모

RATE(%) → 판단

TOP N → 우선순위

3️⃣ 실무에서 실제로 이렇게 변함

Before

“EV 플랫폼은 기술 많이 적용돼 있습니다”

After

“EV 플랫폼은 평균 대비 기술 적용률이 15% 낮고,
통신 계열 기술 미적용이 원인입니다”

👉 이 차이가:

회의 주도권

설계 발언권

신뢰도
를 만듭니다.

📌 이 모델을 쓰는 사람의 최종 포지션

이 구조 + 쿼리를 이해하는 사람은:

❌ 단순 SQL 작업자

❌ 요구사항 받아서 조회하는 사람

아니고,

✅ 기획·설계·품질·보안·전략 사이를 연결하는 사람

입니다.

다음 단계 제안 (여기까지 온 사람만 가능)

이제 진짜 선택지예요:

1️⃣ 월별 KPI 스냅샷 테이블 설계 + 배치 SQL
2️⃣ JPA Native Query → DTO → 대시보드 흐름
3️⃣ “기술 확보 로드맵” (시간축 분석)
4️⃣ 임원 보고용 단일 요약 테이블 설계

👉 이 중 하나만 골라줘요.
이제는 쿼리 잘 치는 사람이 아니라
데이터로 말하는 사람으로 마무리 지어봅시다 💪