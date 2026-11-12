/*
  Warnings:

  - You are about to drop the column `calculationMethod` on the `Indicator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Indicator" DROP COLUMN "calculationMethod";

-- DropEnum
DROP TYPE "IndicatorCalculationMethod";
