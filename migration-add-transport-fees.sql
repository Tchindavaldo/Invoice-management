-- Migration pour ajouter la colonne transport_fees à la table invoices
-- Date: 2025-10-21

-- Ajouter la colonne transport_fees (frais de transport)
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS transport_fees NUMERIC(10, 2) DEFAULT 0 NOT NULL;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN invoices.transport_fees IS 'Frais de transport à ajouter au montant total de la facture';

-- Mettre à jour les factures existantes pour s'assurer qu'elles ont une valeur par défaut
UPDATE invoices
SET transport_fees = 0
WHERE transport_fees IS NULL;
