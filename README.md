# 📋 Gestionnaire de Factures Professionnel - Documentation Complète

## 🎯 Vue d'ensemble du Projet

**Gestionnaire de Factures** est une application web moderne, complète et professionnelle conçue pour simplifier la création, la gestion et l'export de factures. Construite avec les dernières technologies web (React 18, TypeScript, Tailwind CSS), elle offre une expérience utilisateur fluide et intuitive avec un backend cloud robuste via Supabase.

### 🌟 Points Forts

- ✅ **CRUD Complet** : Créer, lire, modifier et supprimer des factures
- ✅ **Interface Moderne** : Design professionnel et responsive
- ✅ **Export PDF** : Téléchargement direct en format A4
- ✅ **Cloud Backend** : Données sécurisées avec Supabase
- ✅ **Gestion d'Images** : Upload et stockage automatique des logos
- ✅ **Authentification** : Système de connexion sécurisé
- ✅ **Notifications** : Feedback utilisateur en temps réel
- ✅ **Support Multilingue** : Noms d'entreprise en français et chinois

---

## 📁 Structure du Projet

```
FACTURE/
├── src/
│   ├── components/
│   │   ├── InvoiceForm.tsx          # Formulaire CRUD pour les factures
│   │   ├── InvoiceList.tsx          # Tableau de liste des factures
│   │   ├── InvoicePreview.tsx       # Aperçu/rendu de la facture
│   │   ├── InvoiceModal.tsx         # Modal pour visualisation et impression
│   │   └── Toast.tsx                # Système de notifications
│   ├── pages/
│   │   ├── InvoiceManager.tsx       # Page principale (dashboard)
│   │   ├── Login.tsx                # Page de connexion
│   │   └── NotFound.tsx             # Page 404
│   ├── services/
│   │   ├── invoiceService.ts        # Logique métier des factures (CRUD)
│   │   └── imageService.ts          # Gestion des uploads d'images
│   ├── lib/
│   │   └── supabase.ts              # Configuration Supabase
│   ├── utils/
│   │   ├── storage.ts               # Gestion du stockage local
│   │   └── whatsapp.ts              # Intégration WhatsApp
│   ├── images/
│   │   └── logo.jpg                 # Logo par défaut
│   ├── types.ts                     # Interfaces TypeScript
│   ├── App.tsx                      # Composant racine avec routing
│   ├── main.tsx                     # Point d'entrée React
│   ├── index.css                    # Styles globaux
│   └── vite-env.d.ts                # Types Vite
├── public/
│   └── (fichiers statiques)
├── migrations/
│   ├── migration-add-currency.sql
│   ├── migration-add-show-signature.sql
│   ├── migration-add-signature.sql
│   └── migration-add-transport-fees.sql
├── supabase-schema.sql              # Schéma complet de la base de données
├── SUPABASE_SETUP.md                # Guide de configuration Supabase
├── package.json                     # Dépendances et scripts
├── tsconfig.json                    # Configuration TypeScript
├── tailwind.config.js               # Configuration Tailwind CSS
├── postcss.config.js                # Configuration PostCSS
├── vite.config.ts                   # Configuration Vite
├── index.html                       # Fichier HTML principal
└── .env                             # Variables d'environnement (à configurer)
```

---

## 🚀 Installation et Démarrage

### Prérequis

- **Node.js** : v16+ (recommandé v18+)
- **npm** : v8+ ou **yarn** v3+
- **Compte Supabase** : Gratuit sur [supabase.com](https://supabase.com)

### Étape 1 : Cloner et Installer

```bash
# Cloner le projet
git clone <votre-repo>
cd FACTURE

# Installer les dépendances
npm install
```

### Étape 2 : Configurer Supabase

Suivez le guide détaillé dans `SUPABASE_SETUP.md` :

1. Créer un projet Supabase
2. Exécuter le script `supabase-schema.sql`
3. Copier les clés API

### Étape 3 : Configurer les Variables d'Environnement

Créez un fichier `.env` à la racine :

```env
VITE_SUPABASE_URL=https://votre-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique-ici
```

### Étape 4 : Lancer le Serveur de Développement

```bash
npm run dev
```

L'application sera accessible à `http://localhost:3000`

### Étape 5 : Build pour la Production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`

---

## 🔐 Authentification et Sécurité

### Système de Connexion

- **Page de Login** : `/login`
- **Authentification** : Via Supabase Auth (email/mot de passe)
- **Redirection** : Les utilisateurs non authentifiés sont redirigés vers `/login`
- **Session** : Gérée automatiquement par Supabase

### Configuration de Sécurité

```typescript
// src/lib/supabase.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Row Level Security (RLS)

- **État** : Activé sur la table `invoices`
- **Politique Actuelle** : Permissive (développement)
- **Recommandation Production** : Implémenter des politiques basées sur l'authentification

---

## 📊 Modèle de Données

### Interface Invoice

```typescript
interface Invoice {
  id: string; // UUID généré automatiquement
  invoiceNumber: string; // Numéro unique (ex: INV202401001)
  date: string; // Date de la facture (YYYY-MM-DD)
  dueDate: string; // Date d'échéance

  // Informations Entreprise
  companyName: string; // Nom de l'entreprise
  companyNameChinese?: string; // Nom en chinois
  companyAddress: string; // Adresse ligne 1
  companyAddress2?: string; // Adresse ligne 2
  companyPhone: string; // Téléphone
  companyEmail: string; // Email
  companyLicense?: string; // Numéro de licence/SIRET
  companyLogo?: string; // URL du logo

  // Informations Client
  clientName: string; // Nom du client
  clientLocation?: string; // Localisation
  clientPhone?: string; // Téléphone
  clientEmail?: string; // Email

  // Articles
  items: InvoiceItem[]; // Tableau d'articles

  // Totaux
  subtotal: number; // Sous-total
  tax: number; // Montant TVA
  taxRate: number; // Taux TVA (%)
  transportFees: number; // Frais de transport
  total: number; // Total TTC
  currency: string; // Devise (EUR, USD, CNY, etc.)

  // Signature
  signature?: string; // Signature numérique
  showSignature?: boolean; // Afficher la signature

  // Métadonnées
  createdAt?: string; // Date de création (ISO 8601)
  updatedAt?: string; // Date de modification
}

interface InvoiceItem {
  id: string; // UUID unique
  description: string; // Description du produit/service
  quantity: number; // Quantité
  price: number; // Prix unitaire
  amount: number; // Montant (quantity × price)
}
```

### Schéma Base de Données

La table `invoices` dans Supabase contient :

- **Colonnes de base** : id, invoice_number, date, due_date
- **Informations entreprise** : company_name, company_address, company_phone, etc.
- **Informations client** : client_name, client_location, client_phone, etc.
- **Articles** : items (stocké en JSONB)
- **Totaux** : subtotal, tax, tax_rate, transport_fees, total, currency
- **Métadonnées** : created_at, updated_at
- **Indices** : Sur invoice_number, created_at, client_name pour les performances

---

## 🎨 Composants Principaux

### 1. **InvoiceManager.tsx** (Page Principale)

**Responsabilité** : Gestion globale de l'application

**Fonctionnalités** :

- Affichage du header avec navigation
- Gestion de l'état des factures
- Logique CRUD (Create, Read, Update, Delete)
- Génération de PDF
- Gestion des notifications
- Vérification de l'authentification

**État Local** :

```typescript
const [invoices, setInvoices] = useState<Invoice[]>([]);
const [loading, setLoading] = useState(true);
const [showForm, setShowForm] = useState(false);
const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(
  null
);
const [toast, setToast] = useState<{
  message: string;
  type: "success" | "error" | "info";
} | null>(null);
```

### 2. **InvoiceForm.tsx** (Formulaire CRUD)

**Responsabilité** : Création et édition des factures

**Sections du Formulaire** :

1. **Informations de Base** : Numéro, dates
2. **Informations Entreprise** : Nom, adresse, contact, logo
3. **Informations Client** : Nom, localisation, contact
4. **Articles** : Tableau dynamique avec ajout/suppression
5. **Totaux** : TVA, frais de transport, devise
6. **Options** : Signature, notes

**Fonctionnalités** :

- Validation complète des champs
- Upload de logo avec gestion d'erreurs
- Ajout/suppression dynamique d'articles
- Calcul automatique des montants
- Génération automatique du numéro de facture
- Support du mode édition

### 3. **InvoiceList.tsx** (Tableau des Factures)

**Responsabilité** : Affichage et gestion de la liste

**Colonnes** :

- Numéro de facture
- Date
- Client
- Montant total
- Actions (Voir, Éditer, Supprimer, Télécharger)

**Fonctionnalités** :

- Tri par date (récent d'abord)
- Indicateurs de chargement
- Confirmations de suppression
- États de chargement pour les actions

### 4. **InvoicePreview.tsx** (Rendu de Facture)

**Responsabilité** : Rendu professionnel de la facture

**Sections** :

- En-tête avec logo et infos entreprise
- Informations client
- Tableau d'articles
- Totaux avec TVA et frais
- Signature (optionnelle)
- Pied de page

**Styles** :

- Format A4 professionnel
- Responsive et imprimable
- Couleurs cohérentes avec le design

### 5. **InvoiceModal.tsx** (Modal de Visualisation)

**Responsabilité** : Affichage et export

**Fonctionnalités** :

- Visualisation complète de la facture
- Bouton d'impression
- Bouton de téléchargement PDF
- Intégration WhatsApp
- Fermeture avec ESC ou clic extérieur

### 6. **Toast.tsx** (Notifications)

**Responsabilité** : Feedback utilisateur

**Types** :

- `success` : Actions réussies (vert)
- `error` : Erreurs (rouge)
- `info` : Informations (bleu)

**Durée** : 4 secondes avant fermeture automatique

---

## 🔧 Services et Utilitaires

### invoiceService.ts

Gère toutes les opérations CRUD avec Supabase :

```typescript
// Créer une facture
export const createInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<string>

// Récupérer toutes les factures
export const getAllInvoices = async (): Promise<Invoice[]>

// Récupérer une facture par ID
export const getInvoiceById = async (id: string): Promise<Invoice | null>

// Mettre à jour une facture
export const updateInvoice = async (id: string, invoice: Partial<Invoice>): Promise<void>

// Supprimer une facture
export const deleteInvoice = async (id: string): Promise<void>
```

**Mapping** : Conversion automatique entre camelCase (TypeScript) et snake_case (PostgreSQL)

### imageService.ts

Gère les uploads et suppressions d'images :

```typescript
// Upload une image vers Supabase Storage
export const uploadImage = async (file: File): Promise<string>

// Supprime une image de Supabase Storage
export const deleteImage = async (imageUrl: string): Promise<void>

// Vérifie si l'URL est une image Supabase
export const isSupabaseStorageUrl = (url: string): boolean
```

### storage.ts

Gestion du stockage local (localStorage) :

- Sauvegarde des brouillons
- Récupération des données locales

### whatsapp.ts

Intégration WhatsApp :

- Génération de lien WhatsApp
- Envoi de messages préremplis
- Support des numéros de téléphone

---

## 🎯 Flux de Travail Utilisateur

### Créer une Facture

1. Cliquer sur "Nouvelle facture"
2. Remplir les informations de l'entreprise
3. Uploader un logo (optionnel)
4. Entrer les informations du client
5. Ajouter des articles
6. Configurer TVA et frais
7. Cliquer sur "Créer"
8. Notification de succès

### Modifier une Facture

1. Cliquer sur l'icône d'édition
2. Modifier les champs souhaités
3. Cliquer sur "Mettre à jour"
4. Notification de succès

### Visualiser et Exporter

1. Cliquer sur l'icône d'œil
2. Modal de visualisation s'ouvre
3. Options disponibles :
   - **Imprimer** : Ctrl+P ou bouton d'impression
   - **Télécharger PDF** : Génère et télécharge le PDF
   - **Partager WhatsApp** : Ouvre WhatsApp avec le PDF

### Supprimer une Facture

1. Cliquer sur l'icône de corbeille
2. Confirmer la suppression
3. Facture et logo associé supprimés
4. Notification de succès

---

## 🛠️ Technologies et Dépendances

### Framework & Build

- **React 18.2.0** : Framework UI moderne
- **TypeScript 5.3.3** : Typage statique
- **Vite 5.0.8** : Build tool ultra-rapide
- **React Router 6.20.0** : Navigation SPA

### Styling

- **Tailwind CSS 3.3.6** : Utility-first CSS
- **PostCSS 8.4.32** : Traitement CSS
- **Autoprefixer 10.4.16** : Préfixes navigateurs

### Backend & Données

- **Supabase 2.75.1** : Backend cloud (PostgreSQL + Auth)
- **@supabase/supabase-js** : Client JavaScript

### Export & Génération

- **html2canvas 1.4.1** : Capture d'écran HTML
- **jsPDF 2.5.1** : Génération de PDF

### UI & Icônes

- **Lucide React 0.294.0** : Icônes modernes et légères

### Développement

- **@vitejs/plugin-react 4.2.1** : Plugin React pour Vite
- **@types/react** : Types TypeScript pour React

---

## 📱 Responsive Design

L'application est entièrement responsive :

- **Mobile** : Écrans < 640px
- **Tablet** : Écrans 640px - 1024px
- **Desktop** : Écrans > 1024px

**Points de rupture Tailwind** :

```javascript
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 🎨 Palette de Couleurs

**Couleur Primaire** (Bleu) :

```javascript
primary-50: #f0f9ff
primary-100: #e0f2fe
primary-200: #bae6fd
primary-300: #7dd3fc
primary-400: #38bdf8
primary-500: #0ea5e9
primary-600: #0284c7  // Principale
primary-700: #0369a1
primary-800: #075985
primary-900: #0c4a6e
```

**Couleurs Secondaires** :

- Gris : Texte et arrière-plans
- Rouge : Erreurs et suppressions
- Vert : Succès et confirmations
- Bleu : Informations et actions

---

## 🔄 Flux de Données

```
User Action
    ↓
Component State Update
    ↓
Service Call (invoiceService)
    ↓
Supabase API
    ↓
PostgreSQL Database
    ↓
Response
    ↓
State Update
    ↓
Component Re-render
    ↓
Toast Notification
```

---

## 📤 Export PDF

### Processus

1. **Capture** : html2canvas capture le rendu HTML
2. **Conversion** : Conversion en image PNG
3. **Génération** : jsPDF crée le document PDF
4. **Pagination** : Gestion automatique des pages
5. **Téléchargement** : Fichier téléchargé localement

### Paramètres

- **Format** : A4 (210mm × 297mm)
- **Orientation** : Portrait
- **Qualité** : 2x (haute résolution)
- **Nom** : `facture-{invoiceNumber}.pdf`

### Code

```typescript
const canvas = await html2canvas(invoiceElement, {
  scale: 2,
  logging: false,
  useCORS: true,
  width: 794,
});

const pdf = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "a4",
});

pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
pdf.save(`facture-${invoice.invoiceNumber}.pdf`);
```

---

## 🌐 Gestion des Images

### Upload de Logo

1. **Sélection** : Clic sur "Ajouter un logo"
2. **Upload** : Envoi vers Supabase Storage
3. **Validation** : Vérification du type et taille
4. **Stockage** : Sauvegarde dans le bucket `invoice-logos`
5. **URL** : Génération d'une URL publique

### Suppression Automatique

- Lors de la suppression d'une facture
- Le logo associé est supprimé de Supabase Storage
- Évite l'accumulation de fichiers inutiles

### Limites

- **Taille max** : 5 MB
- **Formats** : JPG, PNG, GIF, WebP
- **Bucket** : `invoice-logos` (public)

---

## 🔔 Système de Notifications

### Types de Toast

```typescript
type ToastType = "success" | "error" | "info";

interface Toast {
  message: string;
  type: ToastType;
}
```

### Exemples d'Utilisation

```typescript
// Succès
setToast({ message: "Facture créée avec succès !", type: "success" });

// Erreur
setToast({ message: "Erreur lors de la création", type: "error" });

// Info
setToast({ message: "Chargement en cours...", type: "info" });
```

---

## 🚀 Déploiement

### Options de Déploiement

#### Netlify

```bash
npm run build
# Déployer le dossier 'dist' sur Netlify
```

#### Vercel

```bash
npm run build
# Connecter le repo GitHub à Vercel
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Variables d'Environnement en Production

```env
VITE_SUPABASE_URL=https://votre-project.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-production
```

---

## 🐛 Dépannage

### Erreur "Failed to fetch"

- Vérifier l'URL Supabase
- Vérifier la clé API
- Vérifier la connexion internet

### La table n'existe pas

- Exécuter le script `supabase-schema.sql`
- Vérifier dans Supabase que la table existe

### Erreur de permissions (RLS)

- Vérifier que RLS est activé
- Vérifier les politiques d'accès
- Pour le développement, désactiver RLS temporairement

### Logo ne s'affiche pas

- Vérifier le bucket `invoice-logos` existe
- Vérifier les politiques de stockage
- Vérifier que le fichier est public

### PDF ne se télécharge pas

- Vérifier que html2canvas fonctionne
- Vérifier que jsPDF est chargé
- Vérifier la console pour les erreurs

---

## 📚 Ressources Utiles

### Documentation Officielle

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Guides Spécifiques

- [Supabase Setup](./SUPABASE_SETUP.md)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 👨‍💻 Auteur

**Valdoblair** - Développeur Full Stack

---

## 🎉 Remerciements

- Merci à Supabase pour l'infrastructure cloud
- Merci à la communauté React
- Merci à Tailwind CSS pour les styles
- Merci à tous les contributeurs

---

## 📞 Support

Pour toute question ou problème :

- Créer une issue sur GitHub
- Consulter la documentation Supabase
- Vérifier les logs de la console

---

## 🗺️ Roadmap Futur

- [ ] Authentification multi-utilisateurs
- [ ] Gestion des modèles de factures
- [ ] Système de rappels de paiement
- [ ] Intégration comptable
- [ ] Statistiques et rapports
- [ ] Gestion des clients
- [ ] Historique des modifications
- [ ] Export en Excel
- [ ] Facturation récurrente
- [ ] API REST publique

---

**Dernière mise à jour** : Novembre 2024
**Version** : 1.0.0
**Statut** : Production Ready ✅
