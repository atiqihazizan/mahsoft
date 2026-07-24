-- CreateTable
CREATE TABLE `companies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `tax_number` VARCHAR(191) NULL,
    `bankholder` VARCHAR(191) NULL,
    `bankname` VARCHAR(191) NULL,
    `bankacc` VARCHAR(191) NULL,
    `bankbranch` VARCHAR(191) NULL,
    `ssm` VARCHAR(191) NULL,
    `manager` VARCHAR(191) NULL,
    `assist` VARCHAR(191) NULL,
    `accountant` VARCHAR(191) NULL,
    `technical` VARCHAR(191) NULL,
    `invoice_seq` INTEGER NOT NULL DEFAULT 0,
    `quote_seq` INTEGER NOT NULL DEFAULT 0,
    `receipt_seq` INTEGER NOT NULL DEFAULT 0,
    `delivery_order_seq` INTEGER NOT NULL DEFAULT 0,
    `invoice_prefix` VARCHAR(191) NULL,
    `quote_prefix` VARCHAR(191) NULL,
    `receipt_prefix` VARCHAR(191) NULL,
    `delivery_order_prefix` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `tempId` INTEGER NOT NULL DEFAULT 0,
    `is_default` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER', 'VIEWER') NOT NULL DEFAULT 'USER',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_login` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` VARCHAR(191) NOT NULL,
    `tempId` INTEGER NOT NULL,
    `short` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `mobile` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `attn` VARCHAR(191) NULL,
    `tax_number` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `tax_number` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quotes` (
    `id` VARCHAR(191) NOT NULL,
    `quote_number` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `valid_until` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'SENT', 'DUMMY', 'ACCEPTED', 'REJECTED', 'EXPIRED') NOT NULL DEFAULT 'DRAFT',
    `subject` VARCHAR(191) NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discount_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discount_label` VARCHAR(191) NULL,
    `tax_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `notes` TEXT NULL,
    `pdf_path` VARCHAR(191) NULL,
    `pdf_generated_at` DATETIME(3) NULL,
    `items` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `customer_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `quotes_quote_number_key`(`quote_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoices` (
    `id` VARCHAR(191) NOT NULL,
    `invoice_number` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'DUMMY') NOT NULL DEFAULT 'DRAFT',
    `subject` VARCHAR(191) NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discount_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discount_label` VARCHAR(191) NULL,
    `tax_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `paid_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `notes` TEXT NULL,
    `pdf_path` VARCHAR(191) NULL,
    `pdf_generated_at` DATETIME(3) NULL,
    `items` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `customer_id` VARCHAR(191) NOT NULL,
    `quote_id` VARCHAR(191) NULL,

    UNIQUE INDEX `invoices_invoice_number_key`(`invoice_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receipts` (
    `id` VARCHAR(191) NOT NULL,
    `receipt_number` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'ISSUED', 'CANCELLED', 'UNPAID') NOT NULL DEFAULT 'DRAFT',
    `subject` VARCHAR(191) NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discount_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discount_label` VARCHAR(191) NULL,
    `tax_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `notes` TEXT NULL,
    `items` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `customer_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `receipts_receipt_number_key`(`receipt_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `method` ENUM('CASH', 'BANK_TRANSFER', 'CHEQUE', 'CREDIT_CARD', 'DEBIT_CARD', 'EWALLET') NOT NULL DEFAULT 'CASH',
    `reference` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `customer_id` VARCHAR(191) NOT NULL,
    `invoice_id` VARCHAR(191) NULL,
    `receipt_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `debtors` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'PAID', 'OVERDUE', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `customer_id` VARCHAR(191) NULL,
    `supplier_id` VARCHAR(191) NULL,
    `invoice_id` VARCHAR(191) NULL,
    `receipt_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_orders` (
    `id` VARCHAR(191) NOT NULL,
    `do_number` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `delivery_date` DATETIME(3) NOT NULL,
    `status` ENUM('DRAFT', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discount_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discount_label` VARCHAR(191) NULL,
    `tax_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `delivery_address` VARCHAR(191) NULL,
    `contact_person` VARCHAR(191) NULL,
    `contact_phone` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `customer_id` VARCHAR(191) NOT NULL,
    `invoice_id` VARCHAR(191) NULL,

    UNIQUE INDEX `delivery_orders_do_number_key`(`do_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_details` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `delivered_qty` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `delivery_order_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_quote_id_fkey` FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipts` ADD CONSTRAINT `receipts_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipts` ADD CONSTRAINT `receipts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipts` ADD CONSTRAINT `receipts_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_receipt_id_fkey` FOREIGN KEY (`receipt_id`) REFERENCES `receipts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debtors` ADD CONSTRAINT `debtors_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debtors` ADD CONSTRAINT `debtors_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debtors` ADD CONSTRAINT `debtors_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debtors` ADD CONSTRAINT `debtors_receipt_id_fkey` FOREIGN KEY (`receipt_id`) REFERENCES `receipts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery_orders` ADD CONSTRAINT `delivery_orders_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery_orders` ADD CONSTRAINT `delivery_orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery_orders` ADD CONSTRAINT `delivery_orders_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery_orders` ADD CONSTRAINT `delivery_orders_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery_details` ADD CONSTRAINT `delivery_details_delivery_order_id_fkey` FOREIGN KEY (`delivery_order_id`) REFERENCES `delivery_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
