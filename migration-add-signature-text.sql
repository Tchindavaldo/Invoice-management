-- Add signature_text column to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS signature_text TEXT;
