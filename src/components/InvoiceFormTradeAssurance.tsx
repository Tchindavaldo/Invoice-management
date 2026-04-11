import React, { useState } from 'react';
import { InvoiceFormData } from '../types';
import { Save, X, Loader2, ShieldCheck } from 'lucide-react';

interface InvoiceFormTradeAssuranceProps {
  initialData?: Partial<InvoiceFormData>;
  onSubmit: (data: InvoiceFormData) => void | Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-gray-50 text-gray-900"
    />
  </div>
);

export default function InvoiceFormTradeAssurance({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: InvoiceFormTradeAssuranceProps) {
  // Parse custom data stored in notes
  let parsedNotes: any = {};
  try {
    if (initialData?.notes) {
      parsedNotes = JSON.parse(initialData.notes);
    }
  } catch (e) {
    console.error('Error parsing trade assurance notes:', e);
  }

  const [formData, setFormData] = useState({
    // Identifiers
    referenceNumber: parsedNotes.referenceNumber || initialData?.invoiceNumber || '',
    trackingNumber: parsedNotes.trackingNumber || '',
    date: parsedNotes.date || new Date().toISOString().split('T')[0],

    // Client
    clientName: parsedNotes.clientName || initialData?.clientName || '',

    // Insurance details
    insuranceAmount: parsedNotes.insuranceAmount || '',
    currency: parsedNotes.currency || 'USD',

    // Company info (sender/service provider)
    companyName: parsedNotes.companyName || initialData?.companyName || 'Logistique Cargo Express',
    companyAddress: parsedNotes.companyAddress || initialData?.companyAddress || '',
    companyAddress2: parsedNotes.companyAddress2 || initialData?.companyAddress2 || '',
    companyPhone: parsedNotes.companyPhone || initialData?.companyPhone || '',
    companyEmail: parsedNotes.companyEmail || initialData?.companyEmail || '',

    // Signature
    signature: initialData?.signature || '',
    showSignature: initialData?.showSignature !== undefined ? initialData.showSignature : true,
    signatureText: initialData?.signatureText || 'Service Trade Assurance\nLogistique Cargo Express',
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.referenceNumber.trim()) newErrors.referenceNumber = 'Le numéro de référence est obligatoire.';
    if (!formData.clientName.trim()) newErrors.clientName = 'Le nom du client est obligatoire.';
    if (!formData.insuranceAmount.trim() || isNaN(Number(formData.insuranceAmount)) || Number(formData.insuranceAmount) <= 0) {
      newErrors.insuranceAmount = 'Veuillez saisir un montant valide.';
    }
    if (!formData.companyName.trim()) newErrors.companyName = "Le nom de l'entreprise est obligatoire.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const taInfo = {
      referenceNumber: formData.referenceNumber,
      trackingNumber: formData.trackingNumber,
      date: formData.date,
      clientName: formData.clientName,
      insuranceAmount: formData.insuranceAmount,
      currency: formData.currency,
      companyName: formData.companyName,
      companyAddress: formData.companyAddress,
      companyAddress2: formData.companyAddress2,
      companyPhone: formData.companyPhone,
      companyEmail: formData.companyEmail,
      showSignature: formData.showSignature,
      signature: formData.signature,
      signatureText: formData.signatureText,
    };

    const amount = parseFloat(formData.insuranceAmount) || 0;

    const finalData: InvoiceFormData = {
      invoiceType: 'trade_assurance',
      invoiceNumber: formData.referenceNumber,
      date: formData.date,
      dueDate: formData.date,

      companyName: formData.companyName,
      companyAddress: formData.companyAddress,
      companyAddress2: formData.companyAddress2,
      companyPhone: formData.companyPhone,
      companyEmail: formData.companyEmail,
      companyNameChinese: '',
      companyLicense: '',
      companyLogo: '',

      clientName: formData.clientName,
      clientLocation: '',
      clientPhone: '',
      clientEmail: '',

      items: [],

      taxRate: 0,
      transportFees: 0,
      customsFees: 0,
      currency: formData.currency,

      signature: formData.signature,
      showSignature: formData.showSignature,
      signatureText: formData.signatureText,
      notes: JSON.stringify(taInfo),
    };

    // Store amount as total for list display
    (finalData as any)._total = amount;

    try {
      await onSubmit(finalData);
    } finally {
      setSaving(false);
    }
  };

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'XAF', 'XOF', 'CHF', 'CNY'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Modifier — Trade Assurance' : 'Nouvelle Confirmation Trade Assurance'}
            </h2>
            <p className="text-sm text-gray-500">Assurance de transport de véhicule</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>

        {/* Reference & Date */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-emerald-800 mb-4 uppercase tracking-wider border-b border-emerald-200 pb-2">
            Référence du Dossier
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <InputField
                label="N° de Référence"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                placeholder="ex: TA-2024-001"
                required
              />
              {errors.referenceNumber && (
                <p className="text-xs text-red-600 -mt-3 mb-2">{errors.referenceNumber}</p>
              )}
            </div>
            <InputField
              label="Numéro de Suivi (Tracking)"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              placeholder="ex: CE22334567-01"
            />
            <InputField
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              type="date"
            />
          </div>
        </div>

        {/* Client */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-emerald-800 mb-4 uppercase tracking-wider border-b border-emerald-200 pb-2">
            Informations du Client
          </h3>
          <div>
            <InputField
              label="Nom du Client"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="ex: Jean Dupont"
              required
            />
            {errors.clientName && (
              <p className="text-xs text-red-600 -mt-3 mb-2">{errors.clientName}</p>
            )}
          </div>
        </div>

        {/* Insurance Amount */}
        <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
          <h3 className="text-sm font-bold text-emerald-800 mb-4 uppercase tracking-wider border-b border-emerald-300 pb-2">
            Montant de l'Assurance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant de l'assurance <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="insuranceAmount"
                value={formData.insuranceAmount}
                onChange={handleChange}
                placeholder="ex: 1500"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900"
              />
              {errors.insuranceAmount && (
                <p className="text-xs text-red-600 mt-1">{errors.insuranceAmount}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900"
              >
                {currencies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-emerald-800 mb-4 uppercase tracking-wider border-b border-emerald-200 pb-2">
            Informations de l'Entreprise
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <InputField
                label="Nom de l'entreprise"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="ex: Logistique Cargo Express"
                required
              />
              {errors.companyName && (
                <p className="text-xs text-red-600 -mt-3 mb-2">{errors.companyName}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <InputField
                label="Adresse (ligne 1)"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="ex: 123 Rue du Commerce, Beijing"
              />
            </div>
            <div className="md:col-span-2">
              <InputField
                label="Adresse (ligne 2)"
                name="companyAddress2"
                value={formData.companyAddress2}
                onChange={handleChange}
                placeholder="ex: Chine"
              />
            </div>
            <InputField
              label="Téléphone"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
              placeholder="ex: +86 21 5555 8888"
            />
            <InputField
              label="Email"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              placeholder="ex: contact@logistique-cargo.com"
              type="email"
            />
          </div>
        </div>

        {/* Signature */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
            Signature
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showSignature}
                  onChange={(e) => setFormData({ ...formData, showSignature: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <span className="text-gray-900 font-medium">Afficher la signature graphique</span>
              </label>
              <p className="mt-1 text-sm text-gray-500 ml-8">
                Décochez pour laisser uniquement une ligne de signature vide.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom / Titre signataire</label>
              <input
                type="text"
                name="signature"
                value={formData.signature}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Ex: Le Directeur"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texte sous la signature
              </label>
              <textarea
                name="signatureText"
                value={formData.signatureText}
                onChange={(e) => setFormData({ ...formData, signatureText: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                rows={2}
                placeholder="Service Trade Assurance&#10;Logistique Cargo Express"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
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
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm flex items-center gap-2 disabled:bg-emerald-400"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
