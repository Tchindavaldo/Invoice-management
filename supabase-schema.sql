-- Créer la table invoices dans Supabase
-- Exécutez ce script dans votre projet Supabase (SQL Editor)

-- ======================================
-- PARTIE 1: Créer le bucket de stockage
-- ======================================
-- Allez dans Storage > Create a new bucket
-- Nom du bucket: invoice-logos
-- Public bucket: OUI (cocher)
-- Ou exécutez cette requête SQL:

INSERT INTO storage.buckets (id, name, public)
VALUES ('invoice-logos', 'invoice-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques d'accès pour le bucket invoice-logos
-- Les noms sont spécifiques au bucket pour éviter les conflits avec d'autres projets
-- Si vous voyez l'erreur "policy already exists", c'est normal, vous pouvez ignorer cette partie

DO $$
BEGIN
  -- Politique pour la lecture publique
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'invoice_logos_public_access'
  ) THEN
    CREATE POLICY "invoice_logos_public_access"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'invoice-logos' );
  END IF;

  -- Politique pour l'upload
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'invoice_logos_public_upload'
  ) THEN
    CREATE POLICY "invoice_logos_public_upload"
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'invoice-logos' );
  END IF;

  -- Politique pour la mise à jour
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'invoice_logos_public_update'
  ) THEN
    CREATE POLICY "invoice_logos_public_update"
    ON storage.objects FOR UPDATE
    USING ( bucket_id = 'invoice-logos' );
  END IF;

  -- Politique pour la suppression
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'invoice_logos_public_delete'
  ) THEN
    CREATE POLICY "invoice_logos_public_delete"
    ON storage.objects FOR DELETE
    USING ( bucket_id = 'invoice-logos' );
  END IF;
END $$;

-- ======================================
-- PARTIE 2: Créer la table invoices
-- ======================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Informations de base
  invoice_number TEXT NOT NULL UNIQUE,
  date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  
  -- Informations de l'entreprise
  company_name TEXT NOT NULL,
  company_name_chinese TEXT,
  company_address TEXT NOT NULL,
  company_address2 TEXT,
  company_phone TEXT NOT NULL,
  company_email TEXT NOT NULL,
  company_license TEXT,
  company_logo TEXT,
  
  -- Informations du client
  client_name TEXT NOT NULL,
  client_location TEXT,
  client_phone TEXT,
  client_email TEXT,
  
  -- Articles (stockés en JSON)
  items JSONB NOT NULL DEFAULT '[]',
  
  -- Totaux
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
  
  -- Informations complémentaires
  notes TEXT,
  terms TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_client_name ON invoices(client_name);

-- Enable Row Level Security (RLS)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Politique de sécurité pour permettre toutes les opérations (si elle n'existe pas déjà)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'invoices' 
        AND policyname = 'Enable all operations for all users'
    ) THEN
        CREATE POLICY "Enable all operations for all users" ON invoices
        FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Note: Pour la production, remplacez la politique ci-dessus par des politiques plus strictes:
-- CREATE POLICY "Enable read for authenticated users" ON invoices
--   FOR SELECT
--   USING (auth.role() = 'authenticated');
-- CREATE POLICY "Enable insert for authenticated users" ON invoices
--   FOR INSERT
--   WITH CHECK (auth.role() = 'authenticated');
--
-- CREATE POLICY "Enable update for authenticated users" ON invoices
--   FOR UPDATE
--   USING (auth.role() = 'authenticated');
--
-- CREATE POLICY "Enable delete for authenticated users" ON invoices
--   FOR DELETE
--   USING (auth.role() = 'authenticated');

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement (si il n'existe pas déjà)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_invoices_updated_at'
    ) THEN
        CREATE TRIGGER update_invoices_updated_at 
        BEFORE UPDATE ON invoices 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
