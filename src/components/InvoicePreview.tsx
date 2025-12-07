import { Invoice } from '../types';
import { FileText } from 'lucide-react';
import signatureImage from '../images/signature2.png';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    // Mapping des devises vers les symboles
    const currencySymbols: { [key: string]: string } = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£',
      'CHF': 'Fr',
      'CAD': '$',
      'JPY': '¥',
      'CNY': '¥',
      'XAF': 'CFA',
      'XOF': 'CFA',
      'MAD': 'DH',
    };

    // Si c'est une devise standard, utiliser Intl.NumberFormat
    if (currencySymbols[currency]) {
      try {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: currency,
        }).format(amount);
      } catch {
        // Fallback si la devise n'est pas supportée par Intl
        return `${amount.toFixed(2)} ${currencySymbols[currency]}`;
      }
    }
    
    // Pour les devises personnalisées
    return `${amount.toFixed(2)} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div id="invoice-preview" className="bg-white p-8 mx-auto shadow-lg" style={{ width: '210mm', minHeight: '297mm', maxWidth: '210mm' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 border-b border-gray-200 pb-6">
        <div className="flex-1">
          {invoice.companyLogo ? (
            <img 
              src={invoice.companyLogo} 
              alt="Company Logo" 
              className="h-16 mb-4 object-contain"
            />
          ) : (
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-12 h-12 text-primary-600" />
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-900">{invoice.companyName}</h2>
          {invoice.companyNameChinese && (
            <p className="text-lg text-gray-700">{invoice.companyNameChinese}</p>
          )}
          <p className="text-sm text-gray-600 mt-2">{invoice.companyAddress}</p>
          {invoice.companyAddress2 && (
            <p className="text-sm text-gray-600">{invoice.companyAddress2}</p>
          )}
          <p className="text-sm text-gray-600">{invoice.companyPhone}</p>
          <p className="text-sm text-gray-600">{invoice.companyEmail}</p>
          {invoice.companyLicense && (
            <p className="text-sm text-gray-600">Licence: {invoice.companyLicense}</p>
          )}
        </div>
        
        <div className="text-right">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">FACTURE</h1>
        </div>
      </div>

      {/* Invoice Details and Client Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2">CLIENT</h3>
          <p className="font-semibold text-gray-900">{invoice.clientName}</p>
          {invoice.clientLocation && <p className="text-sm text-gray-600">{invoice.clientLocation}</p>}
          {invoice.clientPhone && <p className="text-sm text-gray-600">{invoice.clientPhone}</p>}
          {invoice.clientEmail && <p className="text-sm text-gray-600">{invoice.clientEmail}</p>}
        </div>
        
        <div className="text-right">
          <div className="mb-2">
            <span className="font-bold text-gray-900">FACTURE N°</span>
            <p className="text-gray-900">{invoice.invoiceNumber}</p>
          </div>
          <div className="mb-2">
            <span className="font-bold text-gray-900">DATE</span>
            <p className="text-gray-900">{formatDate(invoice.date)}</p>
          </div>
          <div>
            <span className="font-bold text-gray-900">DATE D'ÉCHÉANCE</span>
            <p className="text-gray-900">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="px-4 py-3 text-left font-semibold">Description</th>
              <th className="px-4 py-3 text-center font-semibold">Qté</th>
              <th className="px-4 py-3 text-right font-semibold">Prix</th>
              <th className="px-4 py-3 text-right font-semibold">Montant</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr 
                key={item.id} 
                className={index % 2 === 0 ? 'bg-green-50' : 'bg-white'}
              >
                <td className="px-4 py-3 border-b border-gray-200">{item.description}</td>
                <td className="px-4 py-3 text-center border-b border-gray-200">{item.quantity}</td>
                <td className="px-4 py-3 text-right border-b border-gray-200">{formatCurrency(item.price, invoice.currency)}</td>
                <td className="px-4 py-3 text-right border-b border-gray-200">{formatCurrency(item.amount, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-4 flex justify-end">
          <div className="w-64">
            {invoice.taxRate > 0 && invoice.tax > 0 && (
              <>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Sous-total:</span>
                  <span className="font-semibold">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">TVA ({invoice.taxRate}%):</span>
                  <span className="font-semibold">{formatCurrency(invoice.tax, invoice.currency)}</span>
                </div>
              </>
            )}
            {invoice.transportFees > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Frais de transport:</span>
                <span className="font-semibold">{formatCurrency(invoice.transportFees, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 bg-green-700 text-white px-4 mt-2">
              <span className="text-lg font-bold">TOTAL</span>
              <span className="text-lg font-bold">{formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section - Always visible */}
      <div className="mt-8 flex justify-end">
        <div className="w-64">
          <div className="mb-2">
            <p className="text-sm text-gray-700 mb-1">Signature :</p>
            {/* Ultimate Professional CEO Signature - Only shown if showSignature is true */}
            {invoice.showSignature ? (
              <div className="flex justify-center py-3">
              <div className="flex justify-center py-3">
                <img 
                  src={signatureImage} 
                  alt="Signature" 
                  className="h-24 object-contain scale-150"
                />
              </div>
              </div>
            ) : (
              // Empty space for manual signature when graphic is hidden
              <div className="py-12"></div>
            )}
            {/* Signature line - always visible */}
            <div className="border-b-2 border-gray-900"></div>
          </div>
          {invoice.signature && invoice.signature.trim() !== '' && (
            <div className="text-center mt-2">
              <p className="text-sm font-semibold text-gray-900">{invoice.signature}</p>
              <p className="text-xs text-gray-600">({formatDate(invoice.date)})</p>
            </div>
          )}
          {invoice.signatureText && invoice.signatureText.trim() !== '' && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.signatureText}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
