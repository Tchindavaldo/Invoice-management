-- Migration pour ajouter la colonne signature à la table invoices
-- Exécutez ce script dans votre console Supabase SQL Editor

-- Ajouter la colonne signature si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' 
        AND column_name = 'signature'
    ) THEN
        ALTER TABLE invoices ADD COLUMN signature VARCHAR(255);
    END IF;
END $$;

-- Commentaire pour information
COMMENT ON COLUMN invoices.signature IS 'Nom du signataire de la facture (optionnel)';
