/*
  Warnings:

  - A unique constraint covering the columns `[companyId,status,userId]` on the table `CompanyUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CompanyUser_companyId_status_userId_key` ON `CompanyUser`(`companyId`, `status`, `userId`);
