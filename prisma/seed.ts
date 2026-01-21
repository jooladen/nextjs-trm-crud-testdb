import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

async function seedCategorySystem() {
  await prisma.category_System.createMany({
    data: [
      { category_id: 1, category_level: 1, tech_name: 'Mobile Communication' },
      { category_id: 2, category_level: 2, tech_name: '무선접속기술', link_id: 1 },
      { category_id: 3, category_level: 2, tech_name: '시스템/네트워크구조', link_id: 1 },
      { category_id: 4, category_level: 2, tech_name: '통신SW기술', link_id: 1 },
      { category_id: 5, category_level: 2, tech_name: '통신HW기술', link_id: 1 },
      { category_id: 6, category_level: 2, tech_name: '통신AI기술', link_id: 1 },

      { category_id: 7, category_level: 1, tech_name: 'Materials' },
      { category_id: 8, category_level: 2, tech_name: '고효율', link_id: 7 },
      { category_id: 9, category_level: 3, tech_name: '단일소재', link_id: 8 },
      { category_id: 10, category_level: 3, tech_name: '방열소재', link_id: 8 },
      { category_id: 11, category_level: 3, tech_name: '자성소재', link_id: 8 },
      { category_id: 12, category_level: 3, tech_name: 'Energy 변환 소재', link_id: 8 },
      { category_id: 13, category_level: 3, tech_name: '차폐소재', link_id: 8 },

      { category_id: 14, category_level: 2, tech_name: '외관(디자인)', link_id: 7 },
      { category_id: 15, category_level: 3, tech_name: '금속소재', link_id: 14 },
      { category_id: 16, category_level: 3, tech_name: '유리소재', link_id: 14 },

      { category_id: 17, category_level: 2, tech_name: '내구성', link_id: 7 },
      { category_id: 18, category_level: 3, tech_name: '금속', link_id: 17 },
      { category_id: 19, category_level: 3, tech_name: '유리', link_id: 17 },
      { category_id: 20, category_level: 3, tech_name: '레진', link_id: 17 },
      { category_id: 21, category_level: 3, tech_name: '고무류', link_id: 17 },
      { category_id: 22, category_level: 3, tech_name: '윤활유', link_id: 17 },

      { category_id: 23, category_level: 2, tech_name: '친환경/자원순환', link_id: 7 },
      { category_id: 24, category_level: 3, tech_name: '재생소재', link_id: 23 },
      { category_id: 25, category_level: 3, tech_name: '재생공정', link_id: 23 },

      { category_id: 26, category_level: 2, tech_name: '기능성소재', link_id: 7 },
      { category_id: 27, category_level: 3, tech_name: '용제', link_id: 26 },
      { category_id: 28, category_level: 3, tech_name: '필터', link_id: 26 },
      { category_id: 29, category_level: 3, tech_name: '세제', link_id: 26 },
      { category_id: 30, category_level: 3, tech_name: '점접착/접합소재', link_id: 26 },
    ]
  })
}

async function seedProductLine() {
  await prisma.target_Product_Line.createMany({
    data: [
      { target_division: 'Mobile', target_product_line: 'Smartphone' },
      { target_division: 'Mobile', target_product_line: 'Tablet' },
      { target_division: 'Device', target_product_line: 'Wearable' },
    ]
  })
}

async function seedProduct() {
  await prisma.target_product.createMany({
    data: [
      {
        target_product_line_id: 1,
        target_product_name: 'Galaxy S Series',
        deployment_date: new Date('2024-03-01')
      },
      {
        target_product_line_id: 2,
        target_product_name: 'Galaxy Tab',
        deployment_date: new Date('2024-06-01')
      },
      {
        target_product_line_id: 3,
        target_product_name: 'Galaxy Watch',
        deployment_date: new Date('2024-09-01')
      }
    ]
  })
}

async function seedTechPlan() {
  await prisma.tech_Secure_Plan.createMany({
    data: [
      { category_id: 2, tech_plan_name: '5G Advanced 무선 기술 확보' },
      { category_id: 4, tech_plan_name: '통신 SW 모듈 내재화' },
      { category_id: 10, tech_plan_name: '고효율 방열 소재 적용' },
      { category_id: 24, tech_plan_name: '재생소재 적용 확대' },
      { category_id: 30, tech_plan_name: '차세대 접합 소재 개발' }
    ]
  })
}

async function seedPlanMap() {
  await prisma.target_product_line_plan_map.createMany({
    data: [
      { target_product_line_id: 1, plan_key: 1 },
      { target_product_line_id: 1, plan_key: 3 },
      { target_product_line_id: 2, plan_key: 4 },
      { target_product_line_id: 3, plan_key: 5 }
    ]
  })
}


async function main() {
  await seedCategorySystem()
  await seedProductLine()
  await seedProduct()
  await seedTechPlan()
  await seedPlanMap()
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
