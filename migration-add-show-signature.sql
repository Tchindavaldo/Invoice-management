-- Migration pour ajouter la colonne show_signature à la table invoices
-- Exécutez ce script dans votre console Supabase SQL Editor

-- Ajouter la colonne show_signature si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'invoices' 
        AND column_name = 'show_signature'
    ) THEN
        ALTER TABLE invoices ADD COLUMN show_signature BOOLEAN NOT NULL DEFAULT true;
    END IF;
END $$;

-- Mettre à jour les factures existantes avec true par défaut
UPDATE invoices SET show_signature = true WHERE show_signature IS NULL;

-- Commentaire pour information
COMMENT ON COLUMN invoices.show_signature IS 'Afficher ou masquer la signature graphique par défaut (true = afficher)';
