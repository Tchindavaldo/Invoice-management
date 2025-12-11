import { Invoice } from '../types';
import { Phone } from 'lucide-react';
import dhlLogo from '../images/dhl-express-logo.jpg';

interface InvoicePreviewProps {
  invoice: Invoice;
}





export default function InvoicePreviewDHL({ invoice }: InvoicePreviewProps) {
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    const currencySymbols: { [key: string]: string } = {
      'EUR': '€', 'USD': '$', 'GBP': '£', 'CHF': 'Fr', 'CAD': '$',
      'JPY': '¥', 'CNY': '¥', 'XAF': 'CFA', 'XOF': 'CFA', 'MAD': 'DH',
    };

    if (currencySymbols[currency]) {
      try {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: currency,
        }).format(amount);
      } catch {
        return `${amount.toFixed(2)} ${currencySymbols[currency]}`;
      }
    }
    return `${amount.toFixed(2)} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div id="invoice-preview" className="bg-white mx-auto shadow-lg relative font-sans text-black" style={{ width: '210mm', minHeight: '297mm', padding: '15mm 20mm' }}>
       {/* Header with DHL Logo */}
       <div className="h-24 flex items-center justify-center" style={{ marginBottom: '3rem' }}>
          <img src={dhlLogo} alt="DHL Express" className=" object-contain" />
       </div>
       
       {/* Title - BORDEREAU D'EXPEDITION */}
       <div className="text-center mb-8 mt-0">
          <h1 style={{ color: '#D40511', fontWeight: 'bold', fontSize: '2.5rem', textTransform: 'uppercase' }}>
             BORDEREAU D'EXPEDITION
          </h1>
       </div>

       {/* Info Grid - 2 Rows, 3 Columns */}
       <div className="mb-12">
          <div className="grid grid-cols-3 gap-y-12 gap-x-8 text-sm">
             {/* Row 1 */}
             <div className=" pl-4 text-left">
                <h3 className="font-bold text-gray-600 text-xs uppercase mb-2">Expéditeur</h3>
                <p className="font-bold text-base">{invoice.companyName}</p>
             </div>
             
             <div className="pl-4 text-left">
                <h3 className="font-bold text-gray-600 text-xs uppercase mb-2">Date</h3>
                <p className="font-bold text-base">{formatDate(invoice.date)}</p>
             </div>
             
             <div className="pr-4 pl-4 text-left">
                <h3 className="font-bold text-gray-600 text-xs uppercase mb-2">Récepteur</h3>
                <p className="font-bold text-base">{invoice.clientName}</p>
             </div>

             {/* Row 2 */}
             <div className=" pl-4 text-left">
                <h3 className="font-bold text-gray-600 text-xs uppercase mb-2">Destination</h3>
                <p className="font-bold text-base">{invoice.clientLocation}</p>
             </div>
             
             <div className="pl-4 text-left">
                <h3 className="font-bold text-gray-600 text-xs uppercase mb-2">Tél. Expéditeur</h3>
                <p className="font-bold text-base">{invoice.companyPhone}</p>
             </div>
             
             <div className="pr-4 pl-4 text-left">
                <h3 className="font-bold text-gray-600 text-xs uppercase mb-2">Tél. Client</h3>
                <p className="font-bold text-base">{invoice.clientPhone}</p>
             </div>
          </div>
       </div>

       {/* Items Table */}
       <div className="mb-12">
           {/* Table Header */}
           <div className="grid grid-cols-12 border-y-2  py-3 mb-0 font-bold text-sm uppercase" style={{ backgroundColor: '#D40511', color: 'white' }}>
              <div className="col-span-5" style={{ paddingLeft: '1.5rem' }}>ITEM</div>
              <div className="col-span-3 text-center">POIDS</div>
              <div className="col-span-2 text-right">UNIT PRICE</div>
              <div className="col-span-2 text-right" style={{ paddingRight: '1.5rem' }}>TOTAL</div>
           </div>
                    <div className="space-y-6 text-sm">
              {invoice.items.map((item, index) => (
                 <div key={item.id} className="border-b border-gray-200 pb-4" style={{ backgroundColor: index % 2 === 0 ? '#FFF9E6' : 'white' }}>
                    {/* Line 1: Main Item Info */}
                    <div className="grid grid-cols-12 mb-2 font-bold py-4">
                       <div className="col-span-5" style={{ paddingLeft: '1.5rem' }}>{item.description}</div>
                       <div className="col-span-3 text-center">{item.weight}</div>
                       <div className="col-span-2 text-right">{formatCurrency(item.price, invoice.currency)}</div>
                       <div className="col-span-2 text-right" style={{ color: '#D40511', paddingRight: '1.5rem' }}>{formatCurrency(item.amount, invoice.currency)}</div>
                    </div>
                    
                    {/* Line 2: Valeurs */}
                    <div className="grid grid-cols-12 mb-2 text-gray-600 py-3">
                       <div className="col-span-5 italic" style={{ paddingLeft: '1.5rem' }}>Valeurs</div>
                       <div className="col-span-3 text-center font-medium text-black">{formatCurrency(item.amount, invoice.currency)}</div>
                       <div className="col-span-2 text-right">/</div>
                       <div className="col-span-2 text-right" style={{ paddingRight: '1.5rem' }}>/</div>
                    </div>

                    {/* Line 3: Quantité */}
                    <div className="grid grid-cols-12 text-gray-600 py-3">
                       <div className="col-span-5 italic" style={{ paddingLeft: '1.5rem' }}>Quantité</div>
                       <div className="col-span-3 text-center font-medium text-black">{item.quantity} colis</div>
                       <div className="col-span-2 text-right">/</div>
                       <div className="col-span-2 text-right" style={{ paddingRight: '1.5rem' }}>/</div>
                    </div>
                 </div>
              ))}
          </div>
       </div>

       {/* Footer Section */}
       <div className="mt-auto">
          {/* Totals */}
          <div className="flex justify-end mb-12">
             <div className="w-1/2 border-t-2 border-black pt-4">
                <div className="flex justify-between mb-2 mt-2 text-sm">
                   <span className="font-bold text-gray-600 ">Sous-total TVA ({invoice.taxRate}%)</span>
                   <span className="font-medium">{formatCurrency(invoice.tax, invoice.currency)}</span>
                </div>
                 <div className="flex justify-between items-center mt-4">
                    <span className="font-black text-xl uppercase">TOTAL</span>
                    <span className="font-black text-xl py-1  text-right" style={{ minWidth: '150px', display: 'inline-block' }}>
                       {formatCurrency(invoice.total, invoice.currency)}
                    </span>
                 </div>
             </div>
          </div>

          {/* Bottom Info */}
          <div className="grid grid-cols-2 gap-8 items-end border-t border-gray-300 pt-16 mt-2">
              {/* Left: Signature & Contact */}
              <div>
                 <div className="mt-4">
                    {/* Logo and Name side by side */}
                    <div className="flex items-start gap-4 mb-3">
                       {invoice.companyLogo ? (
                          <img src={invoice.companyLogo} alt="Logo" className="h-12 object-contain" />
                       ) : (
                          <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded font-bold text-gray-500">LOGO</div>
                       )}
                       <p className="font-bold uppercase text-sm">{invoice.signature || 'NATALIE DUFOUR'}</p>
                    </div>
                    
                    {/* WhatsApp icon and phone number */}
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <div className="bg-green-600 text-white p-2 rounded-full">
                           <Phone size={16} fill="currentColor" />
                        </div>
                        {invoice.companyPhone}
                    </div>
                 </div>
              </div>

             {/* Right: Disclaimer */}
             <div className="text-right mt-4">
                <div className="inline-block  p-3 ">
                   <p className="text-xs font-bold text-red-800 leading-relaxed">
                      A retirer avant le <span className="underline">{formatDate(invoice.dueDate)}</span><br/>
                      sous peine de payer les frais de<br/>
                      consignation du colis.
                   </p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
