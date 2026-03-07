import { Invoice } from '../types';
import InvoicePreviewStandard from './InvoicePreviewStandard';
import InvoicePreviewDHL from './InvoicePreviewDHL';
import InvoicePreviewVehicle from './InvoicePreviewVehicle';

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
  
  return <InvoicePreviewStandard invoice={invoice} />;
}
