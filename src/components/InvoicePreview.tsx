import { Invoice } from '../types';
import InvoicePreviewStandard from './InvoicePreviewStandard';
import InvoicePreviewDHL from './InvoicePreviewDHL';
import InvoicePreviewVehicle from './InvoicePreviewVehicle';
import InvoicePreviewTradeAssurance from './InvoicePreviewTradeAssurance';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  if (invoice.invoiceType === 'dhl') {
    return <InvoicePreviewDHL invoice={invoice} />;
  }
  
  if (invoice.invoiceType === 'vehicle') {
    return <InvoicePreviewVehicle invoice={invoice} />;
  }

  if (invoice.invoiceType === 'trade_assurance') {
    return <InvoicePreviewTradeAssurance invoice={invoice} />;
  }
  
  return <InvoicePreviewStandard invoice={invoice} />;
}
