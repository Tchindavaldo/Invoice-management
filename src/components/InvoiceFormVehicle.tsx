import React, { useState } from 'react';
import { InvoiceFormData } from '../types';
import { Save, X, Loader2 } from 'lucide-react';

interface InvoiceFormVehicleProps {
  initialData?: Partial<InvoiceFormData>;
  onSubmit: (data: InvoiceFormData) => void | Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const InputField = ({ label, name, value, onChange, type = "text", placeholder, colSpan = 1 }: any) => {
  const colClass = colSpan === 2 ? 'md:col-span-2 col-span-1' : 'md:col-span-1 col-span-1';
  return (
    <div className={`${colClass} mb-4`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-gray-50 text-gray-900"
      />
    </div>
  );
};

export default function InvoiceFormVehicle({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false
}: InvoiceFormVehicleProps) {
  // Parsing the custom data from notes
  let parsedNotes: any = {};
  try {
    if (initialData?.notes) {
      parsedNotes = JSON.parse(initialData.notes);
    }
  } catch (e) {
    console.error("Error parsing vehicle notes:", e);
  }

  const [formData, setFormData] = useState({
    dossier: parsedNotes.dossier || initialData?.invoiceNumber || '',
    marque: parsedNotes.marque || '',
    vin: parsedNotes.vin || '',
    annee: parsedNotes.annee || '',
    couleur: parsedNotes.couleur || '',
    expediteur: parsedNotes.expediteur || initialData?.companyName || '',
    adresseExp: parsedNotes.adresseExp || initialData?.companyAddress || '',
    contactExp: parsedNotes.contactExp || initialData?.companyPhone || '',
    destinataire: parsedNotes.destinataire || initialData?.clientName || '',
    adresseDest: parsedNotes.adresseDest || initialData?.clientLocation || '',
    telephoneDest: parsedNotes.telephoneDest || initialData?.clientPhone || '',
    portDepart: parsedNotes.portDepart || '',
    portArrivee: parsedNotes.portArrivee || '',
    transport: parsedNotes.transport || 'Maritime',
    navire: parsedNotes.navire || '',
    dateExp: parsedNotes.dateExp || initialData?.date || new Date().toISOString().split('T')[0],
    tracking: parsedNotes.tracking || '',
    
    // Signature fields
    signature: initialData?.signature || '',
    showSignature: initialData?.showSignature !== undefined ? initialData.showSignature : true,
    signatureText: initialData?.signatureText || '',

    // Sender Signature fields
    showSenderSignature: parsedNotes.showSenderSignature !== undefined ? parsedNotes.showSenderSignature : false,
    senderSignature: parsedNotes.senderSignature || '',
    senderSignatureText: parsedNotes.senderSignatureText || '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // The main invoice requires specific fields to be valid.
    // We map our custom bordereau fields to the standard invoice structure.
    const vehicleInfo = {
      dossier: formData.dossier,
      marque: formData.marque,
      vin: formData.vin,
      annee: formData.annee,
      couleur: formData.couleur,
      expediteur: formData.expediteur,
      adresseExp: formData.adresseExp,
      contactExp: formData.contactExp,
      destinataire: formData.destinataire,
      adresseDest: formData.adresseDest,
      telephoneDest: formData.telephoneDest,
      portDepart: formData.portDepart,
      portArrivee: formData.portArrivee,
      transport: formData.transport,
      navire: formData.navire,
      dateExp: formData.dateExp,
      tracking: formData.tracking,

      showSenderSignature: formData.showSenderSignature,
      senderSignature: formData.senderSignature,
      senderSignatureText: formData.senderSignatureText,
    };

    const finalData: InvoiceFormData = {
      invoiceType: 'vehicle',
      invoiceNumber: formData.dossier, // Crucial for unique invoice_number
      date: formData.dateExp,
      dueDate: formData.dateExp,
      
      companyName: formData.expediteur,
      companyAddress: formData.adresseExp,
      companyPhone: formData.contactExp,
      companyNameChinese: '',
      companyAddress2: '',
      companyEmail: '',
      companyLicense: '',
      companyLogo: '',
      
      clientName: formData.destinataire,
      clientLocation: formData.adresseDest,
      clientPhone: formData.telephoneDest,
      clientEmail: '',
      
      items: [], // no line items for the bordereau
      
      taxRate: 0,
      transportFees: 0,
      currency: 'EUR',
      
      signature: formData.signature,
      showSignature: formData.showSignature,
      signatureText: formData.signatureText,
      notes: JSON.stringify(vehicleInfo) // Store vehicle specific data here
    };

    try {
      await onSubmit(finalData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Modifier le Bordereau' : 'Nouveau Bordereau d\'Expédition'}
          </h2>
          <p className="text-sm text-gray-500">Remplissez les informations ci-dessous</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* N° Dossier & Tracking */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="N° Dossier (Obligatoire)" name="dossier" value={formData.dossier} onChange={handleChange} placeholder="ex: CE2234567" />
            <InputField label="Numéro de Suivi / Tracking" name="tracking" value={formData.tracking} onChange={handleChange} placeholder="ex: CE22334567-01" />
          </div>
        </div>

        {/* Informations sur le Véhicule */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-primary-900 mb-4 uppercase tracking-wider border-b border-primary-200 pb-2">🚘 Informations sur le Véhicule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Marque / Modèle" name="marque" value={formData.marque} onChange={handleChange} placeholder="ex: Toyota Corolla" />
            <InputField label="Numéro de Châssis (VIN)" name="vin" value={formData.vin} onChange={handleChange} placeholder="ex: JTDBR32E123456789" />
            <InputField label="Année" name="annee" value={formData.annee} onChange={handleChange} placeholder="ex: 2020" />
            <InputField label="Couleur" name="couleur" value={formData.couleur} onChange={handleChange} placeholder="ex: Blanc" />
          </div>
        </div>

        {/* Expéditeur */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-primary-900 mb-4 uppercase tracking-wider border-b border-primary-200 pb-2">📤 Informations sur l'Expéditeur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Expéditeur" name="expediteur" value={formData.expediteur} onChange={handleChange} placeholder="ex: China Auto Ltd." />
            <InputField label="Adresse" name="adresseExp" value={formData.adresseExp} onChange={handleChange} placeholder="ex: 123 Trade Zone, Shanghai" />
            <InputField label="Contact (tél / email)" name="contactExp" value={formData.contactExp} onChange={handleChange} placeholder="ex: +86 21 5555 8888 / info@..." colSpan={2} />
          </div>
        </div>

        {/* Destinataire */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-primary-900 mb-4 uppercase tracking-wider border-b border-primary-200 pb-2">📥 Informations sur le Destinataire</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Destinataire (Obligatoire)" name="destinataire" value={formData.destinataire} onChange={handleChange} placeholder="ex: M. Jean Dupont" />
            <InputField label="Adresse" name="adresseDest" value={formData.adresseDest} onChange={handleChange} placeholder="ex: Libreville, Gabon" />
            <InputField label="Téléphone / Email" name="telephoneDest" value={formData.telephoneDest} onChange={handleChange} placeholder="ex: +241 06 123 4567" colSpan={2} />
          </div>
        </div>

        {/* Transport */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-primary-900 mb-4 uppercase tracking-wider border-b border-primary-200 pb-2">�� Informations sur le Transport</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Port de Départ" name="portDepart" value={formData.portDepart} onChange={handleChange} placeholder="ex: Shanghai, Chine" />
            <InputField label="Port d'Arrivée" name="portArrivee" value={formData.portArrivee} onChange={handleChange} placeholder="ex: Port de Libreville, Gabon" />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode de Transport</label>
              <select 
                name="transport" 
                value={formData.transport} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 text-gray-900"
              >
                <option value="Maritime">Maritime</option>
                <option value="Aérien">Aérien</option>
                <option value="Terrestre">Terrestre</option>
                <option value="Ferroviaire">Ferroviaire</option>
              </select>
            </div>
            
            <InputField label="Nom du Navire / Transporteur" name="navire" value={formData.navire} onChange={handleChange} placeholder="ex: MV Ocean Trader" />
            <InputField label="Date d'Expédition" name="dateExp" value={formData.dateExp} onChange={handleChange} type="date" />
          </div>
        </div>

        {/* Signature Configuration - Expéditeur */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
            Configuration de la signature (Expéditeur)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showSenderSignature}
                  onChange={(e) => setFormData({...formData, showSenderSignature: e.target.checked})}
                  className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-gray-900 font-medium">Afficher la signature graphique</span>
              </label>
              <p className="mt-1 text-sm text-gray-500 ml-8">
                Décochez pour masquer la signature graphique et laisser uniquement une ligne vide.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texte de la signature
              </label>
              <input
                type="text"
                value={formData.senderSignature}
                onChange={(e) => setFormData({...formData, senderSignature: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Jean Dupont"
              />
              <p className="mt-1 text-xs text-gray-500">Nom ou titre (optionnel)</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description / Information sous la signature
              </label>
              <textarea
                value={formData.senderSignatureText}
                onChange={(e) => setFormData({...formData, senderSignatureText: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={2}
                placeholder="Texte additionnel..."
              />
            </div>
          </div>
        </div>

        {/* Signature Configuration - Transporteur */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
            Configuration de la signature (Transporteur)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showSignature}
                  onChange={(e) => setFormData({...formData, showSignature: e.target.checked})}
                  className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="text-gray-900 font-medium">Afficher la signature graphique</span>
              </label>
              <p className="mt-1 text-sm text-gray-500 ml-8">
                Décochez pour masquer la signature graphique et laisser uniquement une ligne vide.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texte de la signature
              </label>
              <input
                type="text"
                value={formData.signature}
                onChange={(e) => setFormData({...formData, signature: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Le Directeur"
              />
              <p className="mt-1 text-xs text-gray-500">Nom ou titre (optionnel)</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description / Information sous la signature
              </label>
              <textarea
                value={formData.signatureText}
                onChange={(e) => setFormData({...formData, signatureText: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={2}
                placeholder="Texte additionnel..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm flex items-center gap-2 disabled:bg-primary-400"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Enregistrer')}
          </button>
        </div>
      </form>
    </div>
  );
}
