-- AlterTable
ALTER TABLE `companies` ADD COLUMN `logo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `invoices` ADD COLUMN `paid_date` DATETIME(3) NULL,
    ADD COLUMN `payment_ref` VARCHAR(191) NULL,
    ADD COLUMN `revision_of` VARCHAR(191) NULL,
    MODIFY `status` ENUM('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'DUMMY', 'REVISED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `quotes` ADD COLUMN `revision_of` VARCHAR(191) NULL,
    MODIFY `status` ENUM('DRAFT', 'SENT', 'DUMMY', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'REVISED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `receipts` ADD COLUMN `invoice_id` VARCHAR(191) NULL,
    ADD COLUMN `pdf_generated_at` DATETIME(3) NULL,
    ADD COLUMN `pdf_path` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_revision_of_fkey` FOREIGN KEY (`revision_of`) REFERENCES `quotes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_revision_of_fkey` FOREIGN KEY (`revision_of`) REFERENCES `invoices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipts` ADD CONSTRAINT `receipts_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
