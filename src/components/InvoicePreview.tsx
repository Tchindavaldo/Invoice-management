import { Invoice } from '../types';
import InvoicePreviewStandard from './InvoicePreviewStandard';
import InvoicePreviewDHL from './InvoicePreviewDHL';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  if (invoice.invoiceType === 'dhl') {
    return <InvoicePreviewDHL invoice={invoice} />;
  }
  
  return <InvoicePreviewStandard invoice={invoice} />;
}
