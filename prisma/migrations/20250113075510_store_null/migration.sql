-- DropForeignKey
ALTER TABLE `Restaurant` DROP FOREIGN KEY `Restaurant_storeId_fkey`;

-- AlterTable
ALTER TABLE `Restaurant` MODIFY `storeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Restaurant` ADD CONSTRAINT `Restaurant_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
