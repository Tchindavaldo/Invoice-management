import { Invoice } from '../types';

const STORAGE_KEY = 'invoices';

export const storage = {
  getInvoices: (): Invoice[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading invoices:', error);
      return [];
    }
  },

  saveInvoices: (invoices: Invoice[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving invoices:', error);
    }
  },

  addInvoice: (invoice: Invoice): void => {
    const invoices = storage.getInvoices();
    invoices.push(invoice);
    storage.saveInvoices(invoices);
  },

  updateInvoice: (id: string, updatedInvoice: Invoice): void => {
    const invoices = storage.getInvoices();
    const index = invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      invoices[index] = updatedInvoice;
      storage.saveInvoices(invoices);
    }
  },

  deleteInvoice: (id: string): void => {
    const invoices = storage.getInvoices();
    const filtered = invoices.filter(inv => inv.id !== id);
    storage.saveInvoices(filtered);
  },

  getInvoiceById: (id: string): Invoice | undefined => {
    const invoices = storage.getInvoices();
    return invoices.find(inv => inv.id === id);
  }
};
