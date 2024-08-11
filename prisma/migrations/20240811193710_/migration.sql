/*
  Warnings:

  - You are about to drop the column `dbPassword` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `dbUsername` on the `companies` table. All the data in the column will be lost.
  - Added the required column `db_username` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "dbPassword",
DROP COLUMN "dbUsername",
ADD COLUMN     "db_password" TEXT,
ADD COLUMN     "db_username" TEXT NOT NULL;
