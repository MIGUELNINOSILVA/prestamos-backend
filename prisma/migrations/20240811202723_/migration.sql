/*
  Warnings:

  - Added the required column `db_name` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "db_name" TEXT NOT NULL;
