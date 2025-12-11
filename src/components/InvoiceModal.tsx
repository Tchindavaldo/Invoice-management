import { useRef, useState } from 'react';
import { Invoice } from '../types';
import InvoicePreview from './InvoicePreview';
import { X, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface InvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export default function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    setDownloadingPDF(true);
    try {
      // Créer un clone de l'élément pour la capture
      const element = invoiceRef.current;
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Configurer le clone pour la capture PDF
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '210mm';
      clone.style.zIndex = '-1';
      
      // Ajouter le clone au DOM
      document.body.appendChild(clone);
      
      // Petit délai pour que le DOM se mette à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(clone, {
        scale: 2,
        logging: false,
        useCORS: true,
        width: 794, // 210mm en pixels à 96 DPI
      });
      
      // Supprimer le clone
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Only add new page if significant content remains (more than 10mm)
      while (heightLeft >= 10) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`facture-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setDownloadingPDF(false);
    }
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl my-4 max-h-[calc(100vh-2rem)] overflow-auto">
        {/* Header with actions */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center no-print z-10">
          <h2 className="text-xl font-bold text-gray-900">Facture {invoice.invoiceNumber}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg transition-colors"
              style={{ minWidth: '140px' }}
              title="Télécharger PDF"
            >
              {downloadingPDF ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div ref={invoiceRef} className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
}
