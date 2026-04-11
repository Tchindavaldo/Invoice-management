-- Migration: Add 'trade_assurance' to the invoice_type enum
-- Run this on your Supabase database

-- Check if the constraint already allows trade_assurance before running
-- Option 1: if invoice_type is a CHECK constraint (alter the check)
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_invoice_type_check;

ALTER TABLE invoices
  ADD CONSTRAINT invoices_invoice_type_check
  CHECK (invoice_type IN ('standard', 'dhl', 'vehicle', 'trade_assurance'));
