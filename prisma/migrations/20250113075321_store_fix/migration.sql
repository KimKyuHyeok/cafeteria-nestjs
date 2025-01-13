/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `Store` table. All the data in the column will be lost.
  - Added the required column `storeId` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Store` DROP FOREIGN KEY `Store_restaurantId_fkey`;

-- AlterTable
ALTER TABLE `Restaurant` ADD COLUMN `storeId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Store` DROP COLUMN `restaurantId`;

-- AddForeignKey
ALTER TABLE `Restaurant` ADD CONSTRAINT `Restaurant_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
