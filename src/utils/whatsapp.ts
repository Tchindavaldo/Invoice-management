import { Invoice } from '../types';

/**
 * Génère un message WhatsApp formaté pour une facture
 */
export const generateWhatsAppMessage = (invoice: Invoice): string => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const message = `
🧾 *FACTURE N° ${invoice.invoiceNumber}*

📅 *Date:* ${new Date(invoice.date).toLocaleDateString('fr-FR')}
📅 *Échéance:* ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}

👤 *Client:* ${invoice.clientName}
${invoice.clientLocation ? `📍 ${invoice.clientLocation}` : ''}

💰 *Montant Total:* ${formatCurrency(invoice.total)}

---
${invoice.companyName}
${invoice.companyPhone}
${invoice.companyEmail}
  `.trim();

  return message;
};

/**
 * Ouvre WhatsApp avec le message prérempli
 * @param phoneNumber - Numéro de téléphone du client (format international sans +)
 * @param message - Message à envoyer
 */
export const openWhatsApp = (phoneNumber: string, message: string): void => {
  // Nettoyer le numéro de téléphone (enlever espaces, tirets, etc.)
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  
  // Encoder le message pour l'URL
  const encodedMessage = encodeURIComponent(message);
  
  // Construire l'URL WhatsApp
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  
  // Ouvrir dans une nouvelle fenêtre
  window.open(whatsappUrl, '_blank');
};

/**
 * Ouvre WhatsApp Web avec le message prérempli (sans numéro spécifique)
 */
export const openWhatsAppWeb = (message: string): void => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};
