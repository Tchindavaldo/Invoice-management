export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  
  // Company Info (Header)
  companyName: string;
  companyNameChinese?: string;
  companyAddress: string;
  companyAddress2?: string;
  companyPhone: string;
  companyEmail: string;
  companyLicense?: string;
  companyLogo?: string;
  
  // Client Info
  clientName: string;
  clientLocation?: string;
  clientPhone?: string;
  clientEmail?: string;
  
  // Invoice Items
  items: InvoiceItem[];
  
  // Totals
  subtotal: number;
  tax: number;
  taxRate: number;
  transportFees: number;
  total: number;
  currency: string;
  
  // Additional fields
  signature?: string;
  showSignature?: boolean;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceFormData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  
  companyName: string;
  companyNameChinese: string;
  companyAddress: string;
  companyAddress2: string;
  companyPhone: string;
  companyEmail: string;
  companyLicense: string;
  companyLogo: string;
  
  clientName: string;
  clientLocation: string;
  clientPhone: string;
  clientEmail: string;
  
  items: InvoiceItem[];
  
  taxRate: number;
  transportFees: number;
  currency: string;
  signature: string;
  showSignature: boolean;
}
