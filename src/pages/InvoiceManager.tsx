import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
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
import InvoiceFormStandard from '../components/InvoiceFormStandard';
import InvoiceFormDHL from '../components/InvoiceFormDHL';
import InvoiceModal from '../components/InvoiceModal';
import Toast from '../components/Toast';

export default function InvoiceManager() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(null);
  const [invoiceType, setInvoiceType] = useState<'standard' | 'dhl' | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      await checkAuth();
      await loadInvoices(currentPage);
    };
    initializeApp();
  }, [currentPage]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
    }
  };

  const loadInvoices = async (page: number = 1) => {
    setLoading(true);
    try {
      const { data, count } = await getAllInvoices(page, itemsPerPage);
      setInvoices(data);
      setTotalItems(count);
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

  const calculateTotals = (items: InvoiceFormData['items'], taxRate: number, transportFees: number = 0) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax + transportFees;
    return { subtotal, tax, total };
  };

  const handleCreateInvoice = async (formData: InvoiceFormData) => {
    try {
      const { subtotal, tax, total } = calculateTotals(formData.items, formData.taxRate, formData.transportFees);
      
      const newInvoice = {
        invoiceNumber: formData.invoiceNumber || generateInvoiceNumber(),
        invoiceType: formData.invoiceType,
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
        transportFees: formData.transportFees,
        total,
        currency: formData.currency,
        signature: formData.signature,
        showSignature: formData.showSignature,
        signatureText: formData.signatureText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createInvoiceDB(newInvoice);
      await loadInvoices(1); // Reload first page
      setCurrentPage(1);
      setShowForm(false);
      setToast({ message: 'Facture créée avec succès !', type: 'success' });
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      setToast({ message: error.message || 'Erreur lors de la création de la facture', type: 'error' });
    }
  };

  const handleUpdateInvoice = async (formData: InvoiceFormData) => {
    if (!editingInvoice) return;

    try {
      const { subtotal, tax, total } = calculateTotals(formData.items, formData.taxRate, formData.transportFees);

      const updatedData = {
        invoiceNumber: formData.invoiceNumber,
        invoiceType: formData.invoiceType,
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
        transportFees: formData.transportFees,
        total,
        currency: formData.currency,
        signature: formData.signature,
        showSignature: formData.showSignature,
        signatureText: formData.signatureText,
      };

      await updateInvoiceDB(editingInvoice.id, updatedData);
      await loadInvoices(currentPage);
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
      await loadInvoices(currentPage);
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
    setInvoiceType(invoice.invoiceType || 'standard');
    setShowForm(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingInvoice(null);
    setInvoiceType(null);
  };

  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setInvoiceType(null);
    setShowForm(true);
  };

  const changePage = (newPage: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setLoading(true);
      setCurrentPage(newPage);
    }
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

      // Only add new page if significant content remains (more than 10mm)
      while (heightLeft >= 10) {
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
            <div className="flex items-center gap-3">
              {!showForm && (
                <button
                  onClick={handleNewInvoice}
                  className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Nouvelle facture</span>
                </button>
              )}
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate('/login');
                }}
                className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          !invoiceType ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Choisir le type de facture</h2>
                <button
                  onClick={handleCancelForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="w-6 h-6 rotate-180" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setInvoiceType('standard')}
                  className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md border-2 border-transparent hover:border-primary-500 transition-all text-center group"
                >
                  <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Facture Standard</h3>
                  <p className="text-gray-500">
                    Facture classique pour la vente de produits ou services. Idéal pour la plupart des transactions commerciales.
                  </p>
                </button>

                <button
                  onClick={() => setInvoiceType('dhl')}
                  className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md border-2 border-transparent hover:border-primary-500 transition-all text-center group"
                >
                  <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bordereau DHL</h3>
                  <p className="text-gray-500">
                    Bordereau spécifique pour les envois DHL incluant la gestion du poids pour chaque article.
                  </p>
                </button>
              </div>
            </div>
          ) : (
            invoiceType === 'standard' ? (
              <InvoiceFormStandard
                initialData={editingInvoice ? {
                  invoiceType: 'standard',
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
                  taxRate: editingInvoice.taxRate ?? 0,
                  transportFees: editingInvoice.transportFees ?? 0,
                  currency: editingInvoice.currency || 'EUR',
                  signature: editingInvoice.signature || '',
                  showSignature: editingInvoice.showSignature !== undefined ? editingInvoice.showSignature : true,
                  signatureText: editingInvoice.signatureText || '',
                } : undefined}
                onSubmit={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
                onCancel={handleCancelForm}
                isEditing={!!editingInvoice}
              />
            ) : (
              <InvoiceFormDHL
                initialData={editingInvoice ? {
                  invoiceType: 'dhl',
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
                  taxRate: editingInvoice.taxRate ?? 0,
                  transportFees: editingInvoice.transportFees ?? 0,
                  currency: editingInvoice.currency || 'EUR',
                  signature: editingInvoice.signature || '',
                  showSignature: editingInvoice.showSignature !== undefined ? editingInvoice.showSignature : true,
                  signatureText: editingInvoice.signatureText || '',
                } : undefined}
                onSubmit={editingInvoice ? handleUpdateInvoice : handleCreateInvoice}
                onCancel={handleCancelForm}
                isEditing={!!editingInvoice}
              />
            )
          )
        ) : (
          <div className="relative min-h-[60vh]">
            {/* Loading Overlay or Initial Loader */}
            {loading && (
              <div className={`fixed inset-0 z-50 flex items-center justify-center ${invoices.length > 0 ? 'bg-black/20 backdrop-blur-sm' : 'bg-gray-50'}`}>
                <div className="text-center bg-white p-6 rounded-xl shadow-2xl">
                  <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-600">{invoices.length > 0 ? 'Chargement...' : 'Chargement des factures...'}</p>
                </div>
              </div>
            )}

            {/* Content (always rendered if we have invoices, or if we are not loading) */}
            {(invoices.length > 0 || !loading) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Mes factures</h2>
                  <p className="text-sm text-gray-500">
                    {totalItems} facture{totalItems !== 1 ? 's' : ''} au total
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
                
                {/* Pagination Controls */}
                {totalItems > itemsPerPage && (
                  <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 gap-4">
                    <div className="w-full sm:w-auto flex justify-between sm:justify-start items-center">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> à <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> sur <span className="font-medium">{totalItems}</span>
                      </p>
                    </div>
                    
                    <div className="w-full sm:w-auto flex justify-center">
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => changePage(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Précédent</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {/* Responsive Page Numbers */}
                        {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => i + 1).map((page) => {
                          const totalPages = Math.ceil(totalItems / itemsPerPage);
                          // Show fewer pages on mobile
                          const isMobile = window.innerWidth < 640; 
                          const range = isMobile ? 0 : 1; // Show current +/- 1 on desktop, only current on mobile (or small range)
                          
                          // Logic: First, Last, Current, and neighbors
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - range && page <= currentPage + range)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => changePage(page)}
                                disabled={loading}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                  page === currentPage
                                    ? 'bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            (page === currentPage - range - 1 && page > 1) ||
                            (page === currentPage + range + 1 && page < totalPages)
                          ) {
                            return (
                              <span key={page} className="relative inline-flex items-center px-2 sm:px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}

                        <button
                          onClick={() => changePage(currentPage + 1)}
                          disabled={currentPage >= Math.ceil(totalItems / itemsPerPage) || loading}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Suivant</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                )}
              </div>
            )}
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
