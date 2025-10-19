import { Invoice } from '../types';
import { FileText } from 'lucide-react';

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
                <svg width="220" height="90" viewBox="0 0 220 90" xmlns="http://www.w3.org/2000/svg">
                {/* Dramatic first initial - bold and confident */}
                <path 
                  d="M 15 50 Q 18 20, 35 18 Q 48 17, 55 28 Q 58 35, 52 45 Q 48 52, 40 58 Q 32 62, 25 60 Q 18 58, 15 52" 
                  stroke="#0a0a0a" 
                  strokeWidth="3.2" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Bold crossing stroke */}
                <path 
                  d="M 25 25 L 48 55" 
                  stroke="#0a0a0a" 
                  strokeWidth="2.8" 
                  fill="none" 
                  strokeLinecap="round"
                />
                {/* Flowing connection with character */}
                <path 
                  d="M 48 55 Q 58 50, 68 55 Q 72 58, 70 62" 
                  stroke="#0a0a0a" 
                  strokeWidth="2.5" 
                  fill="none" 
                  strokeLinecap="round"
                />
                {/* Middle signature - dynamic curves */}
                <path 
                  d="M 70 62 Q 80 52, 90 58 Q 95 62, 98 58 Q 105 50, 112 56 Q 118 62, 122 58 Q 128 52, 135 57" 
                  stroke="#0a0a0a" 
                  strokeWidth="2.6" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Ascending flourish */}
                <path 
                  d="M 135 57 Q 142 48, 150 52 Q 158 56, 165 50 Q 172 44, 180 48" 
                  stroke="#0a0a0a" 
                  strokeWidth="2.4" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Final dramatic paraphe (executive flourish) */}
                <path 
                  d="M 180 48 Q 188 42, 195 46 L 202 48 Q 205 50, 208 45" 
                  stroke="#0a0a0a" 
                  strokeWidth="2.2" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Elegant loop at the end */}
                <path 
                  d="M 208 45 Q 210 38, 205 35 Q 200 33, 198 38" 
                  stroke="#0a0a0a" 
                  strokeWidth="1.8" 
                  fill="none" 
                  strokeLinecap="round"
                />
                {/* Sophisticated underline with wave */}
                <path 
                  d="M 20 70 Q 50 75, 80 68 Q 110 62, 140 68 Q 170 74, 200 68" 
                  stroke="#0a0a0a" 
                  strokeWidth="1.6" 
                  fill="none" 
                  strokeLinecap="round"
                />
                {/* Secondary flourish under the paraphe */}
                <path 
                  d="M 175 72 Q 190 76, 205 72" 
                  stroke="#0a0a0a" 
                  strokeWidth="1.2" 
                  fill="none" 
                  strokeLinecap="round"
                />
                {/* Executive dots - mark of authenticity */}
                <circle cx="212" cy="48" r="1.8" fill="#0a0a0a" />
                <circle cx="35" cy="30" r="1.5" fill="#0a0a0a" />
              </svg>
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
        </div>
      </div>

    </div>
  );
}
