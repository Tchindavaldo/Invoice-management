import { useState, useRef } from 'react';
import { InvoiceFormData, InvoiceItem } from '../types';
import { Plus, Trash2, Upload, X, Loader2 } from 'lucide-react';
import logoImage from '../images/logo.jpg';
import { uploadImage, isSupabaseStorageUrl, deleteImage } from '../services/imageService';
import ValidationDialog from './ValidationDialog';

interface InvoiceFormProps {
  initialData?: Partial<InvoiceFormData>;
  onSubmit: (data: InvoiceFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function InvoiceFormStandard({ initialData, onSubmit, onCancel, isEditing = false }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceType: 'standard',
    invoiceNumber: initialData?.invoiceNumber || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    dueDate: initialData?.dueDate || '',
    
    companyName: initialData?.companyName || 'AliExpress',
    companyNameChinese: initialData?.companyNameChinese || '阿里速运通',
    companyAddress: initialData?.companyAddress || '699 Wang Shang Lu, Bin Jiang Qu, Hang Zhou Shi, Zhe Jiang Sheng, Chine, 310052',
    companyAddress2: initialData?.companyAddress2 || '699 Wang Shang Lu, Bin Jiang Qu, Hang Zhou Shi, Zhe Jiang Sheng, Chine, 310052',
    companyPhone: initialData?.companyPhone || '+852 5912 3024',
    companyEmail: initialData?.companyEmail || 'alibaba36@gmail.com',
    companyLicense: initialData?.companyLicense || '6839LDBD6',
    companyLogo: initialData?.companyLogo || logoImage,
    
    clientName: initialData?.clientName || '',
    clientLocation: initialData?.clientLocation || '',
    clientPhone: initialData?.clientPhone || '',
    clientEmail: initialData?.clientEmail || '',
    
    items: initialData?.items || [],
    
    taxRate: initialData?.taxRate ?? 0,
    transportFees: initialData?.transportFees ?? 0,
    currency: initialData?.currency || 'EUR',
    signature: initialData?.signature || '',
    showSignature: initialData?.showSignature !== undefined ? initialData.showSignature : true,
    signatureText: initialData?.signatureText || '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  const handleInputChange = (field: keyof InvoiceFormData, value: string | number | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Le numéro de facture est obligatoire';
    }
    if (!formData.date) {
      newErrors.date = 'La date est obligatoire';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'La date d\'échéance est obligatoire';
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Le nom de l\'entreprise est obligatoire';
    }
    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = 'L\'adresse de l\'entreprise est obligatoire';
    }
    if (!formData.companyPhone.trim()) {
      newErrors.companyPhone = 'Le téléphone de l\'entreprise est obligatoire';
    }
    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = 'L\'email de l\'entreprise est obligatoire';
    }
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Le nom du client est obligatoire';
    }
    if (formData.items.length === 0) {
      newErrors.items = 'Veuillez ajouter au moins un article';
    }
    
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = 'Description obligatoire';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantité invalide';
      }
      if (item.price <= 0) {
        newErrors[`item_${index}_price`] = 'Prix invalide';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    setUploadingLogo(true);
    try {
      const publicUrl = await uploadImage(file);
      
      if (formData.companyLogo && isSupabaseStorageUrl(formData.companyLogo)) {
        await deleteImage(formData.companyLogo);
      }
      
      setFormData({ ...formData, companyLogo: publicUrl });
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Erreur lors de l\'upload du logo. Veuillez réessayer.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0,
      amount: 0,
      weight: '',
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const removeItem = (id: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id),
    });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.price);
        }
        return updatedItem;
      }
      return item;
    });
    setFormData({ ...formData, items: updatedItems });
  };

  const getFormattedErrors = () => {
    const formattedErrors: { field: string; message: string }[] = [];
    
    Object.entries(errors).forEach(([key, message]) => {
      let fieldName = key;
      
      // Formater les noms de champs pour qu'ils soient lisibles
      if (key.startsWith('item_')) {
        const match = key.match(/item_(\d+)_(\w+)/);
        if (match) {
          const itemIndex = parseInt(match[1]) + 1;
          const fieldType = match[2];
          const fieldTypeMap: { [key: string]: string } = {
            description: 'Description',
            quantity: 'Quantité',
            price: 'Prix unitaire',
          };
          fieldName = `Article ${itemIndex} - ${fieldTypeMap[fieldType] || fieldType}`;
        }
      } else {
        const fieldNameMap: { [key: string]: string } = {
          invoiceNumber: 'Numéro de facture',
          date: 'Date',
          dueDate: 'Date d\'échéance',
          companyName: 'Nom de l\'entreprise',
          companyAddress: 'Adresse de l\'entreprise',
          companyPhone: 'Téléphone de l\'entreprise',
          companyEmail: 'Email de l\'entreprise',
          clientName: 'Nom du client',
          items: 'Articles',
        };
        fieldName = fieldNameMap[key] || key;
      }
      
      formattedErrors.push({ field: fieldName, message });
    });
    
    return formattedErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowValidationDialog(true);
      return;
    }

    setSaving(true);
    try {
      await onSubmit(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Modifier la facture Standard' : 'Nouvelle facture Standard'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Invoice Basic Info */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              N° Facture *
            </label>
            <input
              type="text"
              value={formData.invoiceNumber}
              onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.invoiceNumber 
                  ? 'border-2 border-red-600 focus:ring-red-600' 
                  : 'border-gray-300 focus:ring-primary-600'
              }`}
            />
            {errors.invoiceNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.invoiceNumber}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-2 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base ${
                  errors.date 
                    ? 'border-2 border-red-600 focus:ring-red-600' 
                    : 'border-gray-300 focus:ring-primary-600'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Échéance *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className={`w-full px-2 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base ${
                  errors.dueDate 
                    ? 'border-2 border-red-600 focus:ring-red-600' 
                    : 'border-gray-300 focus:ring-primary-600'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de l'entreprise (Header de la facture)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Ces informations apparaîtront dans l'en-tête de votre facture. Les valeurs par défaut sont pré-remplies, mais vous pouvez toutes les modifier selon vos besoins.
        </p>
        
        {/* Logo Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo de l'entreprise
          </label>
          <div className="flex items-center gap-4">
            {formData.companyLogo && (
              <img 
                src={formData.companyLogo} 
                alt="Logo" 
                className="h-16 w-16 object-contain border border-gray-200 rounded"
              />
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingLogo}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm"
            >
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">{uploadingLogo ? 'Upload en cours...' : (formData.companyLogo ? 'Changer le logo' : 'Ajouter un logo')}</span>
              <span className="sm:hidden">{uploadingLogo ? 'Upload...' : 'Logo'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'entreprise *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.companyName 
                  ? 'border-2 border-red-600 focus:ring-red-600' 
                  : 'border-gray-300 focus:ring-primary-600'
              }`}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom en chinois (optionnel)
            </label>
            <input
              type="text"
              value={formData.companyNameChinese}
              onChange={(e) => handleInputChange('companyNameChinese', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse de l'entreprise *
            </label>
            <input
              type="text"
              value={formData.companyAddress}
              onChange={(e) => handleInputChange('companyAddress', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.companyAddress 
                  ? 'border-2 border-red-600 focus:ring-red-600' 
                  : 'border-gray-300 focus:ring-primary-600'
              }`}
            />
            {errors.companyAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.companyAddress}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse ligne 2 (optionnel)
            </label>
            <input
              type="text"
              value={formData.companyAddress2}
              onChange={(e) => handleInputChange('companyAddress2', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone *
            </label>
            <input
              type="tel"
              value={formData.companyPhone}
              onChange={(e) => handleInputChange('companyPhone', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.companyPhone 
                  ? 'border-2 border-red-600 focus:ring-red-600' 
                  : 'border-gray-300 focus:ring-primary-600'
              }`}
            />
            {errors.companyPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.companyPhone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.companyEmail}
              onChange={(e) => handleInputChange('companyEmail', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.companyEmail 
                  ? 'border-2 border-red-600 focus:ring-red-600' 
                  : 'border-gray-300 focus:ring-primary-600'
              }`}
            />
            {errors.companyEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.companyEmail}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Licence (optionnel)
            </label>
            <input
              type="text"
              value={formData.companyLicense}
              onChange={(e) => handleInputChange('companyLicense', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du client</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du client *
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.clientName 
                  ? 'border-2 border-red-600 focus:ring-red-600' 
                  : 'border-gray-300 focus:ring-primary-600'
              }`}
            />
            {errors.clientName && (
              <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation
            </label>
            <input
              type="text"
              value={formData.clientLocation}
              onChange={(e) => handleInputChange('clientLocation', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => handleInputChange('clientPhone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => handleInputChange('clientEmail', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Articles / Lignes de la facture</h3>
            <p className="text-sm text-gray-600">Ajoutez autant de lignes que nécessaire pour vos produits ou services</p>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Ajouter une ligne</span>
          </button>
        </div>

        {formData.items.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Aucun article ajouté. Cliquez sur "Ajouter une ligne" pour commencer.</p>
          </div>
        )}

        <div className="space-y-4">
          {formData.items.map((item) => (
            <div key={item.id} className="bg-gray-50 p-4 rounded-lg space-y-3">
              {/* Desktop view - flex */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-medium text-gray-600">
                  <div className="col-span-5">Description *</div>
                  <div className="col-span-2 text-center">Quantité *</div>
                  <div className="col-span-2 text-center">Prix unitaire *</div>
                  <div className="col-span-2 text-center">Montant total</div>
                  <div className="col-span-1"></div>
                </div>
                <div className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Nom de l'article ou service"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors[`item_${formData.items.indexOf(item)}_description`] 
                          ? 'border-2 border-red-600 focus:ring-red-600' 
                          : 'border-gray-300 focus:ring-primary-600'
                      }`}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      placeholder="1"
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors[`item_${formData.items.indexOf(item)}_quantity`] 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-primary-600'
                      }`}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors[`item_${formData.items.indexOf(item)}_price`] 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-primary-600'
                      }`}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer cette ligne"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Mobile view - stacked with labels */}
              <div className="sm:hidden space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Nom de l'article"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Qté</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Prix</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Total</label>
                    <input
                      type="text"
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations complémentaires</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taux de TVA (%)
            </label>
            <input
              type="number"
              value={formData.taxRate}
              onChange={(e) => handleInputChange('taxRate', Number(e.target.value))}
              min="0"
              max="100"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <p className="text-xs text-gray-500 mt-1">Laissez à 0 si pas de TVA applicable</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frais de transport
            </label>
            <input
              type="number"
              value={formData.transportFees}
              onChange={(e) => handleInputChange('transportFees', Number(e.target.value))}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">Montant des frais de transport à ajouter au total</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise
            </label>
            <div className="space-y-2">
              <select
                value={formData.currency === 'custom' || (formData.currency && !['EUR', 'USD', 'GBP', 'CHF', 'CAD', 'JPY', 'CNY', 'XAF', 'XOF', 'MAD'].includes(formData.currency)) ? 'custom' : formData.currency}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    handleInputChange('currency', 'custom');
                  } else {
                    handleInputChange('currency', e.target.value);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="EUR">EUR (€) - Euro</option>
                <option value="USD">USD ($) - Dollar américain</option>
                <option value="GBP">GBP (£) - Livre sterling</option>
                <option value="CHF">CHF (Fr) - Franc suisse</option>
                <option value="CAD">CAD ($) - Dollar canadien</option>
                <option value="JPY">JPY (¥) - Yen japonais</option>
                <option value="CNY">CNY (¥) - Yuan chinois</option>
                <option value="XAF">XAF (CFA) - Franc CFA Afrique Centrale</option>
                <option value="XOF">XOF (CFA) - Franc CFA Afrique Ouest</option>
                <option value="MAD">MAD (DH) - Dirham marocain</option>
                <option value="custom">Personnalisée...</option>
              </select>
              {(formData.currency === 'custom' || (formData.currency && !['EUR', 'USD', 'GBP', 'CHF', 'CAD', 'JPY', 'CNY', 'XAF', 'XOF', 'MAD'].includes(formData.currency))) && (
                <input
                  type="text"
                  value={formData.currency === 'custom' ? '' : formData.currency}
                  placeholder="Ex: BTC, USDT, EURO..."
                  onChange={(e) => handleInputChange('currency', e.target.value || 'custom')}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  autoFocus
                />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Choisissez la devise ou définissez une devise personnalisée
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Afficher la signature graphique
            </label>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.showSignature}
                onChange={(e) => handleInputChange('showSignature', e.target.checked)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">
                Afficher la signature dessinée par défaut sur la facture
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Décochez pour masquer la signature graphique et laisser uniquement une ligne vide
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du signataire
            </label>
            <input
              type="text"
              value={formData.signature}
              onChange={(e) => handleInputChange('signature', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="Ex: Le Directeur, Jean Dupont..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Nom qui apparaîtra sous la ligne de signature (optionnel)
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description / Information sous la signature
            </label>
            <textarea
              value={formData.signatureText}
              onChange={(e) => handleInputChange('signatureText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="Texte additionnel à afficher sous la signature..."
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Ce texte apparaîtra juste en bas de la signature après le nom et la date
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="hidden sm:inline">Annuler</span>
          <span className="sm:hidden">Annuler</span>
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg transition-colors"
        >
          {saving && <Loader2 className="w-5 h-5 animate-spin" />}
          <span className="hidden sm:inline">{saving ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer la facture')}</span>
          <span className="sm:hidden">{saving ? '...' : 'Enregistrer'}</span>
        </button>
      </div>

      {/* Dialogue de validation */}
      <ValidationDialog
        isOpen={showValidationDialog}
        onClose={() => setShowValidationDialog(false)}
        errors={getFormattedErrors()}
      />
    </form>
  );
}
