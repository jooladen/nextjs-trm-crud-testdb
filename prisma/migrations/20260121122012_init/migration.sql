-- CreateTable
CREATE TABLE "Category_System" (
    "category_id" INTEGER NOT NULL,
    "category_level" INTEGER NOT NULL,
    "tech_name" TEXT NOT NULL,
    "link_id" INTEGER,

    CONSTRAINT "Category_System_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Tech_Secure_Plan" (
    "plan_key" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "tech_plan_name" TEXT NOT NULL,

    CONSTRAINT "Tech_Secure_Plan_pkey" PRIMARY KEY ("plan_key")
);

-- CreateTable
CREATE TABLE "Target_Product_Line" (
    "target_product_line_id" SERIAL NOT NULL,
    "target_division" TEXT NOT NULL,
    "target_product_line" TEXT NOT NULL,

    CONSTRAINT "Target_Product_Line_pkey" PRIMARY KEY ("target_product_line_id")
);

-- CreateTable
CREATE TABLE "Target_product" (
    "target_product_id" SERIAL NOT NULL,
    "target_product_line_id" INTEGER NOT NULL,
    "target_product_name" TEXT NOT NULL,
    "deployment_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Target_product_pkey" PRIMARY KEY ("target_product_id")
);

-- CreateTable
CREATE TABLE "Target_product_line_plan_map" (
    "target_product_line_id" INTEGER NOT NULL,
    "plan_key" INTEGER NOT NULL,

    CONSTRAINT "Target_product_line_plan_map_pkey" PRIMARY KEY ("target_product_line_id","plan_key")
);

-- AddForeignKey
ALTER TABLE "Category_System" ADD CONSTRAINT "Category_System_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "Category_System"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tech_Secure_Plan" ADD CONSTRAINT "Tech_Secure_Plan_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category_System"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target_product" ADD CONSTRAINT "Target_product_target_product_line_id_fkey" FOREIGN KEY ("target_product_line_id") REFERENCES "Target_Product_Line"("target_product_line_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target_product_line_plan_map" ADD CONSTRAINT "Target_product_line_plan_map_target_product_line_id_fkey" FOREIGN KEY ("target_product_line_id") REFERENCES "Target_Product_Line"("target_product_line_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target_product_line_plan_map" ADD CONSTRAINT "Target_product_line_plan_map_plan_key_fkey" FOREIGN KEY ("plan_key") REFERENCES "Tech_Secure_Plan"("plan_key") ON DELETE RESTRICT ON UPDATE CASCADE;
