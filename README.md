# Gestionnaire de Factures Professionnel

Application web moderne pour créer, gérer et exporter des factures professionnelles.

## Fonctionnalités

✨ **CRUD Complet**
- Créer de nouvelles factures
- Modifier des factures existantes
- Supprimer des factures
- Visualiser les factures

📄 **Design Professionnel**
- En-tête personnalisable avec logo d'entreprise
- Informations complètes de l'entreprise (nom, adresse, téléphone, email, licence)
- Support du nom en chinois
- Informations client détaillées
- Tableau d'articles avec colonnes configurables (Description, Quantité, Prix, Montant)
- Calcul automatique des totaux avec TVA optionnelle

💾 **Gestion des Données**
- Backend Supabase (PostgreSQL)
- Stockage cloud sécurisé et scalable
- Gestion automatique des images via Supabase Storage
- Upload et suppression automatique des logos

📤 **Export et Impression**
- Téléchargement en PDF
- Impression directe
- Format A4 professionnel

🎨 **Interface Moderne**
- Design inspiré de votre dashboard Admin.tsx
- Interface responsive et intuitive
- Notifications toast pour les actions
- Formulaires avec validation

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

## Utilisation

1. **Créer une nouvelle facture**
   - Cliquez sur "Nouvelle facture"
   - Remplissez les informations de votre entreprise
   - Ajoutez un logo (optionnel)
   - Renseignez les informations du client
   - Ajoutez des articles avec quantités et prix
   - Configurez la TVA si nécessaire
   - Ajoutez des notes et conditions de paiement

2. **Gérer les factures**
   - Visualisez toutes vos factures dans le tableau
   - Modifiez une facture en cliquant sur l'icône d'édition
   - Supprimez une facture (avec confirmation)

3. **Exporter une facture**
   - Cliquez sur l'icône œil pour visualiser
   - Téléchargez en PDF ou imprimez directement

## Structure du Projet

```
src/
├── components/
│   ├── InvoiceForm.tsx       # Formulaire CRUD
│   ├── InvoiceList.tsx       # Liste des factures
│   ├── InvoicePreview.tsx    # Aperçu de facture
│   ├── InvoiceModal.tsx      # Modal pour visualisation/export
│   └── Toast.tsx             # Notifications
├── pages/
│   └── InvoiceManager.tsx    # Page principale
├── utils/
│   └── storage.ts            # Gestion du stockage local
├── types.ts                  # Types TypeScript
├── App.tsx                   # Composant racine
└── main.tsx                  # Point d'entrée
```

## Technologies

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **Vite** - Build tool
- **Supabase** - Backend (PostgreSQL + Storage)
- **html2canvas** - Capture d'écran pour PDF
- **jsPDF** - Génération de PDF
- **Lucide React** - Icônes
- **React Router** - Navigation

## Personnalisation

### Changer le logo par défaut
Dans le formulaire, cliquez sur "Ajouter un logo" et sélectionnez votre image d'entreprise.

### Modifier les couleurs
Éditez `tailwind.config.js` pour personnaliser la palette de couleurs primaire.

### Ajouter des champs
Modifiez `src/types.ts` pour ajouter de nouveaux champs à l'interface Invoice.

## Support

Pour toute question ou problème, veuillez consulter la documentation ou créer une issue.

---

Créé avec ❤️ pour une gestion professionnelle des factures
