-- Migration pour ajouter la colonne customs_fees à la table invoices
-- Date: 2026-04-08

-- Ajouter la colonne customs_fees (prix de douane)
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS customs_fees NUMERIC(10, 2) DEFAULT 0 NOT NULL;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN invoices.customs_fees IS 'Prix de douane (frais de dédouanement) à ajouter au montant total de la facture';

-- Mettre à jour les factures existantes pour s'assurer qu'elles ont une valeur par défaut
UPDATE invoices
SET customs_fees = 0
WHERE customs_fees IS NULL;
