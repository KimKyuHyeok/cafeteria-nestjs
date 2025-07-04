-- CreateTable
CREATE TABLE `ChatMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` VARCHAR(191) NOT NULL,
    `senderId` INTEGER NOT NULL,
    `senderType` ENUM('User', 'Company') NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
