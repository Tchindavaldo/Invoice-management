import { supabase } from '../lib/supabase';
import { Invoice } from '../types';
import { deleteImage, isSupabaseStorageUrl } from './imageService';

const TABLE_NAME = 'invoices';

// Create a new invoice
export const createInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<string> => {
  try {
    // Mapper camelCase vers snake_case pour la base de données
    const dbInvoice = {
      invoice_number: invoice.invoiceNumber,
      invoice_type: invoice.invoiceType,
      date: invoice.date,
      due_date: invoice.dueDate,

      company_name: invoice.companyName,
      company_name_chinese: invoice.companyNameChinese,
      company_address: invoice.companyAddress,
      company_address2: invoice.companyAddress2,
      company_phone: invoice.companyPhone,
      company_email: invoice.companyEmail,
      company_license: invoice.companyLicense,
      company_logo: invoice.companyLogo,

      client_name: invoice.clientName,
      client_location: invoice.clientLocation,
      client_phone: invoice.clientPhone,
      client_email: invoice.clientEmail,

      items: invoice.items,

      subtotal: invoice.subtotal,
      tax: invoice.tax,
      tax_rate: invoice.taxRate,
      transport_fees: invoice.transportFees,
      total: invoice.total,
      currency: invoice.currency,
      signature: invoice.signature,
      show_signature: invoice.showSignature,
      signature_text: invoice.signatureText,

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([dbInvoice])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Ce numéro de facture existe déjà.');
      }
      throw error;
    }
    return data.id;
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    if (error.message === 'Ce numéro de facture existe déjà.') {
      throw error;
    }
    throw new Error('Erreur lors de la création de la facture');
  }
};

// Get all invoices with pagination
export const getAllInvoices = async (page: number = 1, pageSize: number = 10): Promise<{ data: Invoice[], count: number }> => {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from(TABLE_NAME)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Mapper snake_case vers camelCase
    const invoices = (data || []).map((item: any) => ({
      id: item.id,
      invoiceNumber: item.invoice_number,
      invoiceType: item.invoice_type,
      date: item.date,
      dueDate: item.due_date,

      companyName: item.company_name,
      companyNameChinese: item.company_name_chinese,
      companyAddress: item.company_address,
      companyAddress2: item.company_address2,
      companyPhone: item.company_phone,
      companyEmail: item.company_email,
      companyLicense: item.company_license,
      companyLogo: item.company_logo,

      clientName: item.client_name,
      clientLocation: item.client_location,
      clientPhone: item.client_phone,
      clientEmail: item.client_email,

      items: item.items,

      subtotal: item.subtotal,
      tax: item.tax,
      taxRate: item.tax_rate,
      transportFees: item.transport_fees || 0,
      total: item.total,
      currency: item.currency,
      signature: item.signature,
      showSignature: item.show_signature,
      signatureText: item.signature_text,

      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })) as Invoice[];

    return { data: invoices, count: count || 0 };
  } catch (error) {
    console.error('Error getting invoices:', error);
    throw new Error('Erreur lors du chargement des factures');
  }
};

// Get a single invoice by ID
export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (data) {
      // Mapper snake_case vers camelCase
      return {
        id: data.id,
        invoiceNumber: data.invoice_number,
        invoiceType: data.invoice_type,
        date: data.date,
        dueDate: data.due_date,

        companyName: data.company_name,
        companyNameChinese: data.company_name_chinese,
        companyAddress: data.company_address,
        companyAddress2: data.company_address2,
        companyPhone: data.company_phone,
        companyEmail: data.company_email,
        companyLicense: data.company_license,
        companyLogo: data.company_logo,

        clientName: data.client_name,
        clientLocation: data.client_location,
        clientPhone: data.client_phone,
        clientEmail: data.client_email,

        items: data.items,

        subtotal: data.subtotal,
        tax: data.tax,
        taxRate: data.tax_rate,
        transportFees: data.transport_fees || 0,
        total: data.total,
        currency: data.currency,
        signature: data.signature,
        showSignature: data.show_signature,
        signatureText: data.signature_text,

        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as Invoice;
    }

    return null;
  } catch (error) {
    console.error('Error getting invoice:', error);
    throw new Error('Erreur lors du chargement de la facture');
  }
};

// Update an invoice
export const updateInvoice = async (id: string, invoice: Partial<Invoice>): Promise<void> => {
  try {
    // Mapper camelCase vers snake_case
    const dbUpdate: any = {
      updated_at: new Date().toISOString(),
    };

    if (invoice.invoiceNumber !== undefined) dbUpdate.invoice_number = invoice.invoiceNumber;
    if (invoice.invoiceType !== undefined) dbUpdate.invoice_type = invoice.invoiceType;
    if (invoice.date !== undefined) dbUpdate.date = invoice.date;
    if (invoice.dueDate !== undefined) dbUpdate.due_date = invoice.dueDate;

    if (invoice.companyName !== undefined) dbUpdate.company_name = invoice.companyName;
    if (invoice.companyNameChinese !== undefined) dbUpdate.company_name_chinese = invoice.companyNameChinese;
    if (invoice.companyAddress !== undefined) dbUpdate.company_address = invoice.companyAddress;
    if (invoice.companyAddress2 !== undefined) dbUpdate.company_address2 = invoice.companyAddress2;
    if (invoice.companyPhone !== undefined) dbUpdate.company_phone = invoice.companyPhone;
    if (invoice.companyEmail !== undefined) dbUpdate.company_email = invoice.companyEmail;
    if (invoice.companyLicense !== undefined) dbUpdate.company_license = invoice.companyLicense;
    if (invoice.companyLogo !== undefined) dbUpdate.company_logo = invoice.companyLogo;

    if (invoice.clientName !== undefined) dbUpdate.client_name = invoice.clientName;
    if (invoice.clientLocation !== undefined) dbUpdate.client_location = invoice.clientLocation;
    if (invoice.clientPhone !== undefined) dbUpdate.client_phone = invoice.clientPhone;
    if (invoice.clientEmail !== undefined) dbUpdate.client_email = invoice.clientEmail;

    if (invoice.items !== undefined) dbUpdate.items = invoice.items;

    if (invoice.subtotal !== undefined) dbUpdate.subtotal = invoice.subtotal;
    if (invoice.tax !== undefined) dbUpdate.tax = invoice.tax;
    if (invoice.taxRate !== undefined) dbUpdate.tax_rate = invoice.taxRate;
    if (invoice.transportFees !== undefined) dbUpdate.transport_fees = invoice.transportFees;
    if (invoice.total !== undefined) dbUpdate.total = invoice.total;
    if (invoice.currency !== undefined) dbUpdate.currency = invoice.currency;

    if (invoice.signature !== undefined) dbUpdate.signature = invoice.signature;
    if (invoice.showSignature !== undefined) dbUpdate.show_signature = invoice.showSignature;
    if (invoice.signatureText !== undefined) dbUpdate.signature_text = invoice.signatureText;

    const { error } = await supabase
      .from(TABLE_NAME)
      .update(dbUpdate)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw new Error('Erreur lors de la mise à jour de la facture');
  }
};

// Delete an invoice
export const deleteInvoice = async (id: string): Promise<void> => {
  try {
    // Récupérer la facture pour obtenir l'URL du logo
    const invoice = await getInvoiceById(id);

    // Supprimer la facture
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Supprimer le logo de Supabase Storage si c'est une image stockée
    if (invoice?.companyLogo && isSupabaseStorageUrl(invoice.companyLogo)) {
      await deleteImage(invoice.companyLogo);
    }
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw new Error('Erreur lors de la suppression de la facture');
  }
};
