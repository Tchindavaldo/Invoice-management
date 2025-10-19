-- Migration pour ajouter la colonne currency à la table invoices existante
-- Exécutez ce script dans votre console Supabase SQL Editor

-- Ajouter la colonne currency si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' 
        AND column_name = 'currency'
    ) THEN
        ALTER TABLE invoices ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'EUR';
    END IF;
END $$;

-- Mettre à jour les factures existantes avec EUR par défaut
UPDATE invoices SET currency = 'EUR' WHERE currency IS NULL OR currency = '';

-- Commentaire pour information
COMMENT ON COLUMN invoices.currency IS 'Code de devise (EUR, USD, XAF, XOF, etc.)';
