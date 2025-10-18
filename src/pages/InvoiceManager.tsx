import { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Invoice, InvoiceFormData } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  createInvoice as createInvoiceDB,
  getAllInvoices,
  updateInvoice as updateInvoiceDB,
  deleteInvoice as deleteInvoiceDB
} from '../services/invoiceService';
import InvoiceList from '../components/InvoiceList';
import InvoiceForm from '../components/InvoiceForm';
import InvoiceModal from '../components/InvoiceModal';
import Toast from '../components/Toast';

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const loadedInvoices = await getAllInvoices();
      setInvoices(loadedInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setToast({ message: 'Erreur lors du chargement des factures', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceNumber = () => {
    const prefix = 'INV';
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = invoices.length + 1;
    return `${prefix}${year}${month}${String(count).padStart(4, '0')}`;
  };

  const calculateTotals = (items: InvoiceFormData['items'], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCreateInvoice = async (formData: InvoiceFormData) => {
    try {
      const { subtotal, tax, total } = calculateTotals(formData.items, formData.taxRate);
      
      const newInvoice = {
        invoiceNumber: formData.invoiceNumber || generateInvoiceNumber(),
        date: formData.date,
        dueDate: formData.dueDate,
        
        companyName: formData.companyName,
        companyNameChinese: formData.companyNameChinese,
        companyAddress: formData.companyAddress,
        companyAddress2: formData.companyAddress2,
        companyPhone: formData.companyPhone,
        companyEmail: formData.companyEmail,
        companyLicense: formData.companyLicense,
        companyLogo: formData.companyLogo,
        
        clientName: formData.clientName,
        clientLocation: formData.clientLocation,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail,
        
        items: formData.items,
        
        subtotal,
        tax,
        taxRate: formData.taxRate,
        total,
        
        notes: formData.notes,
        terms: formData.terms,
        
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createInvoiceDB(newInvoice);
      await loadInvoices();
      setShowForm(false);
      setToast({ message: 'Facture créée avec succès !', type: 'success' });
    } catch (error) {
      console.error('Error creating invoice:', error);
      setToast({ message: 'Erreur lors de la création de la facture', type: 'error' });
    }
  };

  const handleUpdateInvoice = async (formData: InvoiceFormData) => {
    if (!editingInvoice) return;

    try {
      const { subtotal, tax, total } = calculateTotals(formData.items, formData.taxRate);

      const updatedData = {
        invoiceNumber: formData.invoiceNumber,
        date: formData.date,
        dueDate: formData.dueDate,
        
        companyName: formData.companyName,
        companyNameChinese: formData.companyNameChinese,
        companyAddress: formData.companyAddress,
        companyAddress2: formData.companyAddress2,
        companyPhone: formData.companyPhone,
        companyEmail: formData.companyEmail,
        companyLicense: formData.companyLicense,
        companyLogo: formData.companyLogo,
        
        clientName: formData.clientName,
        clientLocation: formData.clientLocation,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail,
        
        items: formData.items,
        
        subtotal,
        tax,
        taxRate: formData.taxRate,
        total,
        
        notes: formData.notes,
        terms: formData.terms,
      };

      await updateInvoiceDB(editingInvoice.id, updatedData);
      await loadInvoices();
      setEditingInvoice(null);
      setShowForm(false);
      setToast({ message: 'Facture mise à jour avec succès !', type: 'success' });
    } catch (error) {
      console.error('Error updating invoice:', error);
      setToast({ message: 'Erreur lors de la mise à jour de la facture', type: 'error' });
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    setDeletingInvoiceId(id);
    try {
      await deleteInvoiceDB(id);
      await loadInvoices();
      setToast({ message: 'Facture supprimée avec succès !', type: 'success' });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      setToast({ message: 'Erreur lors de la suppression de la facture', type: 'error' });
    } finally {
      setDeletingInvoiceId(null);
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingInvoice(null);
  };

  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setShowForm(true);
  };

  const handleDirectDownload = async (invoice: Invoice) => {
    setDownloadingInvoiceId(invoice.id);
    
    try {
      // Créer un élément temporaire caché pour générer le PDF
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);
      
      // Importer et rendre InvoicePreview
      const { default: InvoicePreview } = await import('../components/InvoicePreview');
      const { createRoot } = await import('react-dom/client');
      
      const root = createRoot(tempDiv);
      root.render(<InvoicePreview invoice={invoice} />);
      
      // Attendre que le rendu soit complète
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const invoiceElement = tempDiv.querySelector('#invoice-preview') as HTMLElement;
      if (!invoiceElement) {
        throw new Error('Élément non trouvé');
      }

      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        width: 794,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`facture-${invoice.invoiceNumber}.pdf`);
      setToast({ message: 'PDF téléchargé avec succès !', type: 'success' });
      
      // Nettoyer
      root.unmount();
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setToast({ message: 'Erreur lors de la génération du PDF', type: 'error' });
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestionnaire de Factures</h1>
                <p className="text-sm text-gray-500">Créez et gérez vos factures professionnelles</p>
              </div>
            </div>
            {!showForm && (
              <button
                onClick={handleNewInvoice}
                className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nouvelle facture</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <InvoiceForm
            initialData={editingInvoice ? {
              invoiceNumber: editingInvoice.invoiceNumber,
              date: editingInvoice.date,
              dueDate: editingInvoice.dueDate,
              companyName: editingInvoice.companyName,
              companyNameChinese: editingInvoice.companyNameChinese || '',
              companyAddress: editingInvoice.companyAddress,
              companyAddress2: editingInvoice.companyAddress2 || '',
              companyPhone: editingInvoice.companyPhone,
              companyEmail: editingInvoice.companyEmail,
              companyLicense: editingInvoice.companyLicense || '',
              companyLogo: editingInvoice.companyLogo || '',
              clientName: editingInvoice.clientName,
              clientLocation: editingInvoice.clientLocation || '',
              clientPhone: editingInvoice.clientPhone || '',
              clientEmail: editingInvoice.clientEmail || '',
              items: editingInvoice.items,
              taxRate: editingInvoice.taxRate || 0,
              notes: editingInvoice.notes || '',
              terms: editingInvoice.terms || '',
            } : undefined}
            onSubmit={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
            onCancel={handleCancelForm}
            isEditing={!!editingInvoice}
          />
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des factures...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Mes factures</h2>
              <p className="text-sm text-gray-500">
                {invoices.length} facture{invoices.length !== 1 ? 's' : ''} au total
              </p>
            </div>
            <InvoiceList
              invoices={invoices}
              onEdit={handleEditInvoice}
              onDelete={handleDeleteInvoice}
              onView={handleViewInvoice}
              onDownload={handleDirectDownload}
              downloadingId={downloadingInvoiceId}
              deletingId={deletingInvoiceId}
            />
          </div>
        )}
      </main>

      {/* Invoice Modal for Viewing/Printing */}
      {viewingInvoice && (
        <InvoiceModal
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
