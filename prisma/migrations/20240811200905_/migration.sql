/*
  Warnings:

  - You are about to drop the column `createdAt` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `companies` table. All the data in the column will be lost.
  - Added the required column `db_host` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `db_port` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3),
ADD COLUMN     "db_host" TEXT NOT NULL,
ADD COLUMN     "db_port" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
