/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Division` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Division` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Division` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Division` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Indicator` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Indicator` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Indicator` table. All the data in the column will be lost.
  - You are about to drop the column `isCore` on the `Indicator` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Indicator` table. All the data in the column will be lost.
  - You are about to drop the column `approvedAt` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the column `approvedById` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the column `periodType` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the column `sourceType` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the column `submittedById` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the column `targetValue` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the column `updatedById` on the `Measurement` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Office` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Office` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Office` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Office` table. All the data in the column will be lost.
  - You are about to drop the `AuditEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImportBatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImportRowResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeasurementTransition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReportRun` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOfficeRoleAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRoleAssignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuditEvent" DROP CONSTRAINT "AuditEvent_actorId_fkey";

-- DropForeignKey
ALTER TABLE "AuditEvent" DROP CONSTRAINT "AuditEvent_divisionId_fkey";

-- DropForeignKey
ALTER TABLE "AuditEvent" DROP CONSTRAINT "AuditEvent_officeId_fkey";

-- DropForeignKey
ALTER TABLE "ImportBatch" DROP CONSTRAINT "ImportBatch_divisionId_fkey";

-- DropForeignKey
ALTER TABLE "ImportBatch" DROP CONSTRAINT "ImportBatch_officeId_fkey";

-- DropForeignKey
ALTER TABLE "ImportBatch" DROP CONSTRAINT "ImportBatch_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "ImportRowResult" DROP CONSTRAINT "ImportRowResult_importBatchId_fkey";

-- DropForeignKey
ALTER TABLE "ImportRowResult" DROP CONSTRAINT "ImportRowResult_measurementId_fkey";

-- DropForeignKey
ALTER TABLE "Indicator" DROP CONSTRAINT "Indicator_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Measurement" DROP CONSTRAINT "Measurement_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "Measurement" DROP CONSTRAINT "Measurement_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Measurement" DROP CONSTRAINT "Measurement_submittedById_fkey";

-- DropForeignKey
ALTER TABLE "Measurement" DROP CONSTRAINT "Measurement_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "MeasurementTransition" DROP CONSTRAINT "MeasurementTransition_actorId_fkey";

-- DropForeignKey
ALTER TABLE "MeasurementTransition" DROP CONSTRAINT "MeasurementTransition_measurementId_fkey";

-- DropForeignKey
ALTER TABLE "ReportRun" DROP CONSTRAINT "ReportRun_divisionId_fkey";

-- DropForeignKey
ALTER TABLE "ReportRun" DROP CONSTRAINT "ReportRun_requestedById_fkey";

-- DropForeignKey
ALTER TABLE "UserOfficeRoleAssignment" DROP CONSTRAINT "UserOfficeRoleAssignment_divisionId_fkey";

-- DropForeignKey
ALTER TABLE "UserOfficeRoleAssignment" DROP CONSTRAINT "UserOfficeRoleAssignment_officeId_divisionId_fkey";

-- DropForeignKey
ALTER TABLE "UserOfficeRoleAssignment" DROP CONSTRAINT "UserOfficeRoleAssignment_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserOfficeRoleAssignment" DROP CONSTRAINT "UserOfficeRoleAssignment_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRoleAssignment" DROP CONSTRAINT "UserRoleAssignment_divisionId_fkey";

-- DropForeignKey
ALTER TABLE "UserRoleAssignment" DROP CONSTRAINT "UserRoleAssignment_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRoleAssignment" DROP CONSTRAINT "UserRoleAssignment_userId_fkey";

-- DropIndex
DROP INDEX "Indicator_isActive_isCore_idx";

-- DropIndex
DROP INDEX "Measurement_officeId_indicatorId_periodType_periodStart_per_key";

-- DropIndex
DROP INDEX "Measurement_status_officeId_idx";

-- DropIndex
DROP INDEX "Office_divisionId_isActive_idx";

-- DropIndex
DROP INDEX "Office_id_divisionId_key";

-- AlterTable
ALTER TABLE "Division" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "isActive",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Indicator" DROP COLUMN "createdAt",
DROP COLUMN "createdById",
DROP COLUMN "isActive",
DROP COLUMN "isCore",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Measurement" DROP COLUMN "approvedAt",
DROP COLUMN "approvedById",
DROP COLUMN "createdById",
DROP COLUMN "periodType",
DROP COLUMN "sourceType",
DROP COLUMN "status",
DROP COLUMN "submittedAt",
DROP COLUMN "submittedById",
DROP COLUMN "targetValue",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedById";

-- AlterTable
ALTER TABLE "Office" DROP COLUMN "address",
DROP COLUMN "createdAt",
DROP COLUMN "isActive",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "AuditEvent";

-- DropTable
DROP TABLE "ImportBatch";

-- DropTable
DROP TABLE "ImportRowResult";

-- DropTable
DROP TABLE "MeasurementTransition";

-- DropTable
DROP TABLE "ReportRun";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserOfficeRoleAssignment";

-- DropTable
DROP TABLE "UserRoleAssignment";

-- DropEnum
DROP TYPE "ImportFileFormat";

-- DropEnum
DROP TYPE "ImportRowStatus";

-- DropEnum
DROP TYPE "ImportStatus";

-- DropEnum
DROP TYPE "MeasurementPeriodType";

-- DropEnum
DROP TYPE "MeasurementSourceType";

-- DropEnum
DROP TYPE "MeasurementStatus";

-- DropEnum
DROP TYPE "ReportFormat";

-- DropEnum
DROP TYPE "ReportStatus";

-- DropEnum
DROP TYPE "RoleCode";

-- CreateIndex
CREATE INDEX "Office_divisionId_idx" ON "Office"("divisionId");
