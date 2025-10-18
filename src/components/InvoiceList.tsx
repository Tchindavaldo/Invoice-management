import { Invoice } from '../types';
import { Edit, Trash2, Eye, FileText, Download, Loader2 } from 'lucide-react';

interface InvoiceListProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onView: (invoice: Invoice) => void;
  onDownload?: (invoice: Invoice) => void;
  downloadingId?: string | null;
  deletingId?: string | null;
}

export default function InvoiceList({ invoices, onEdit, onDelete, onView, onDownload, downloadingId, deletingId }: InvoiceListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune facture</h3>
        <p className="text-gray-500">Commencez par créer votre première facture</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">FACTURE</span>
                <span className="text-sm font-bold text-primary-600">#{invoice.invoiceNumber}</span>
              </div>
              <div className="text-base font-semibold text-gray-900 mb-1">{invoice.clientName}</div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{formatDate(invoice.date)}</span>
                <span className="font-bold text-gray-900">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
            <div className="flex items-center justify-around gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => onView(invoice)}
                className="flex flex-col items-center gap-1 p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex-1"
                title="Voir"
              >
                <Eye className="w-5 h-5" />
                <span className="text-xs">Voir</span>
              </button>
              {onDownload && (
                <button
                  onClick={() => onDownload(invoice)}
                  disabled={downloadingId === invoice.id}
                  className="flex flex-col items-center gap-1 p-2 text-green-600 hover:bg-green-50 disabled:text-green-400 rounded-lg transition-colors flex-1"
                  title="Télécharger PDF"
                >
                  {downloadingId === invoice.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  <span className="text-xs">PDF</span>
                </button>
              )}
              <button
                onClick={() => onEdit(invoice)}
                className="flex flex-col items-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-1"
                title="Modifier"
              >
                <Edit className="w-5 h-5" />
                <span className="text-xs">Modifier</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
                    onDelete(invoice.id);
                  }
                }}
                disabled={deletingId === invoice.id}
                className="flex flex-col items-center gap-1 p-2 text-red-600 hover:bg-red-50 disabled:text-red-400 rounded-lg transition-colors flex-1"
                title="Supprimer"
              >
                {deletingId === invoice.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
                <span className="text-xs">Supprimer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              N° Facture
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Échéance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">{invoice.clientName}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">{formatDate(invoice.date)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">{formatDate(invoice.dueDate)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(invoice.total)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-1 sm:gap-2">
                  <button
                    onClick={() => onView(invoice)}
                    className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Voir"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {onDownload && (
                    <button
                      onClick={() => onDownload(invoice)}
                      disabled={downloadingId === invoice.id}
                      className="text-green-600 hover:text-green-900 disabled:text-green-400 p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Télécharger PDF"
                    >
                      {downloadingId === invoice.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(invoice)}
                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
                        onDelete(invoice.id);
                      }
                    }}
                    disabled={deletingId === invoice.id}
                    className="text-red-600 hover:text-red-900 disabled:text-red-400 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    {deletingId === invoice.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
