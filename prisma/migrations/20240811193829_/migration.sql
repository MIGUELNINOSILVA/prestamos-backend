/*
  Warnings:

  - You are about to drop the column `schemaName` on the `companies` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[schema_name]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schema_name` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "companies_schemaName_key";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "schemaName",
ADD COLUMN     "schema_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companies_schema_name_key" ON "companies"("schema_name");
