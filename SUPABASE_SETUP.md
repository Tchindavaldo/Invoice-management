# Configuration Supabase - Gestionnaire de Factures

Ce guide vous explique comment configurer Supabase pour votre gestionnaire de factures.

## Étape 1 : Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous ou créez un compte
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name** : Gestionnaire Factures (ou le nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Choisissez la région la plus proche de vous
5. Cliquez sur "Create new project"
6. Attendez que le projet soit créé (environ 2 minutes)

## Étape 2 : Créer la table invoices et le bucket de stockage

1. Dans votre projet Supabase, allez dans **SQL Editor** (dans la barre latérale)
2. Cliquez sur **New query**
3. Copiez tout le contenu du fichier `supabase-schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run** pour exécuter le script
6. Vous devriez voir un message de succès

**Note** : Le script crée automatiquement :
- La table `invoices` pour stocker les factures
- Le bucket `invoice-logos` pour stocker les images des logos
- Les politiques d'accès pour permettre l'upload/lecture des images

## Étape 3 : Obtenir les clés API

1. Dans votre projet Supabase, allez dans **Settings** (icône engrenage en bas de la barre latérale)
2. Cliquez sur **API** dans le menu de gauche
3. Vous verrez deux informations importantes :
   - **Project URL** : Votre URL Supabase (commence par `https://`)
   - **anon public** : Votre clé API publique (une longue chaîne de caractères)

## Étape 4 : Configurer l'application

1. Ouvrez le fichier `.env` à la racine du projet
2. Remplacez les valeurs par vos vraies clés :

```env
VITE_SUPABASE_URL=https://votre-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique-ici
```

3. Sauvegardez le fichier

## Étape 5 : Tester l'application

1. Redémarrez le serveur de développement si nécessaire :
```bash
npm run dev
```

2. Créez une nouvelle facture pour tester
3. Vérifiez dans Supabase (Table Editor > invoices) que la facture a bien été créée

## Structure de la table invoices

La table contient les champs suivants :

### Informations de base
- `id` : UUID (généré automatiquement)
- `invoice_number` : Numéro de facture (unique)
- `date` : Date de la facture
- `due_date` : Date d'échéance

### Informations de l'entreprise
- `company_name` : Nom de l'entreprise
- `company_name_chinese` : Nom en chinois
- `company_address` : Adresse ligne 1
- `company_address2` : Adresse ligne 2
- `company_phone` : Téléphone
- `company_email` : Email
- `company_license` : Numéro de licence
- `company_logo` : URL du logo

### Informations du client
- `client_name` : Nom du client
- `client_location` : Localisation
- `client_phone` : Téléphone
- `client_email` : Email

### Articles et totaux
- `items` : Articles (format JSON)
- `subtotal` : Sous-total
- `tax` : Montant TVA
- `tax_rate` : Taux de TVA
- `total` : Total

### Autres
- `notes` : Notes
- `terms` : Conditions de paiement
- `created_at` : Date de création
- `updated_at` : Date de modification

## Sécurité (Row Level Security)

Par défaut, le script crée une politique permissive pour le développement.

**Pour la production**, vous devriez :

1. Activer l'authentification Supabase
2. Remplacer la politique permissive par des politiques basées sur l'authentification
3. Voir les exemples de politiques commentées dans `supabase-schema.sql`

## Gestion des images (logos)

### Upload automatique vers Supabase Storage

Lorsque vous uploadez un logo d'entreprise :
1. L'image est automatiquement envoyée vers **Supabase Storage** (bucket `invoice-logos`)
2. Une URL publique est générée et stockée dans la base de données
3. L'ancienne image est automatiquement supprimée si vous changez de logo

### Suppression automatique

Lorsque vous supprimez une facture :
- Le logo associé est automatiquement supprimé de Supabase Storage
- Cela évite l'accumulation de fichiers inutiles

### Limites

- **Taille maximale** : 5 MB par image
- **Formats acceptés** : JPG, PNG, GIF, WebP, etc.
- **Stockage** : Images stockées dans le bucket public `invoice-logos`

### Avantages par rapport à base64

✅ **Performance** : Chargement plus rapide des factures
✅ **Taille de BD** : Base de données plus légère
✅ **CDN** : Les images sont servies via le CDN de Supabase
✅ **Gestion** : Nettoyage automatique des images inutilisées

## Fonctionnalité WhatsApp

Le bouton WhatsApp :
1. Génère automatiquement le PDF de la facture
2. Le télécharge localement
3. Ouvre WhatsApp avec un message prérempli
4. Si le client a un numéro de téléphone, ouvre la conversation avec ce numéro
5. Sinon, ouvre WhatsApp Web pour que vous puissiez choisir le contact

**Note** : Le PDF doit être envoyé manuellement dans WhatsApp après avoir cliqué sur le bouton.

## Dépannage

### Erreur "Failed to fetch"
- Vérifiez que votre URL Supabase est correcte
- Vérifiez que la clé API est correcte
- Vérifiez votre connexion internet

### La table n'existe pas
- Assurez-vous d'avoir exécuté le script SQL complet
- Vérifiez dans Table Editor que la table "invoices" existe

### Erreur de permissions (RLS)
- Vérifiez que Row Level Security est activé
- Vérifiez que les politiques sont créées
- Pour le développement, vous pouvez désactiver RLS temporairement

## Support

Pour plus d'informations sur Supabase, consultez :
- [Documentation Supabase](https://supabase.com/docs)
- [Guide Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
