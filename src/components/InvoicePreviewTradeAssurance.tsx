import { Invoice } from '../types';
import signatureImage from '../images/signature2.png';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export default function InvoicePreviewTradeAssurance({ invoice }: InvoicePreviewProps) {
  let form: any = {};
  try {
    if (invoice.notes) {
      form = JSON.parse(invoice.notes);
    }
  } catch (e) {
    console.error('Failed to parse trade assurance info', e);
  }

  // Fallbacks
  const clientName = form.clientName || invoice.clientName || '—';
  const trackingNumber = form.trackingNumber || '—';
  const insuranceAmount = form.insuranceAmount || '—';
  const currency = form.currency || invoice.currency || 'USD';
  const date = form.date || invoice.date || '—';
  const referenceNumber = form.referenceNumber || invoice.invoiceNumber || '—';

  // Company info with fallbacks
  const companyName = form.companyName || invoice.companyName || 'Logistique Cargo Express';
  const companyAddress = form.companyAddress || invoice.companyAddress || '';
  const companyAddress2 = form.companyAddress2 || invoice.companyAddress2 || '';

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('fr-FR');
    } catch {
      return d;
    }
  };

  const formattedAmount = (() => {
    const num = parseFloat(insuranceAmount);
    if (isNaN(num)) return `${insuranceAmount} ${currency}`;
    try {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(num);
    } catch {
      return `${num.toFixed(2)} ${currency}`;
    }
  })();

  return (
    <div
      id="invoice-preview"
      className="bg-white mx-auto print-area"
      style={{
        width: '794px',
        minHeight: '1123px',
        padding: '40px 52px 40px',
        fontFamily: "'Times New Roman', serif",
        boxSizing: 'border-box',
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          borderBottom: '2px solid #065f46',
          padding: '22px 0px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 900,
              fontSize: '24px',
              color: '#064e3b',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            TRADE ASSURANCE
          </div>
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 400,
              fontSize: '13px',
              color: '#065f46',
              letterSpacing: '0.5px',
              marginTop: '4px',
            }}
          >
            CONFIRMATION D'ASSURANCE DE TRANSPORT
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '13px', color: '#064e3b' }}>
              {companyName}
            </div>
            <div style={{ fontSize: '11px', color: '#555' }}>
              {[companyAddress, companyAddress2].filter(Boolean).join(' — ')}
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#666' }}>
            N° RÉFÉRENCE
          </div>
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              fontSize: '18px',
              color: '#000',
              marginBottom: '4px'
            }}
          >
            {referenceNumber}
          </div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#444' }}>
            Date: {formatDate(date)}
          </div>
        </div>
      </div>

      {/* ===== CLIENT + TRACKING ===== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {/* Client block */}
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '14px 18px',
          }}
        >
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              fontSize: '10px',
              color: '#666',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              borderBottom: '1px solid #eee',
              paddingBottom: '6px',
              marginBottom: '8px',
            }}
          >
            Client
          </div>
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#000',
            }}
          >
            {clientName}
          </div>
        </div>

        {/* Tracking block */}
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '14px 18px',
          }}
        >
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              fontSize: '10px',
              color: '#666',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              borderBottom: '1px solid #eee',
              paddingBottom: '6px',
              marginBottom: '8px',
            }}
          >
            Numéro de Suivi
          </div>
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#000',
            }}
          >
            {trackingNumber}
          </div>
        </div>
      </div>

      {/* ===== SERVICE INFO TABLE ===== */}
      <div style={{ marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#065f46' }}>
              <th
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  color: '#ffffff',
                  padding: '10px 14px',
                  textAlign: 'left',
                  letterSpacing: '0.5px',
                }}
              >
                Produit
              </th>
              <th
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  color: '#ffffff',
                  padding: '10px 14px',
                  textAlign: 'left',
                }}
              >
                Type de Service
              </th>
              <th
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  color: '#ffffff',
                  padding: '10px 14px',
                  textAlign: 'left',
                }}
              >
                Statut
              </th>
              <th
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  color: '#ffffff',
                  padding: '10px 14px',
                  textAlign: 'right',
                }}
              >
                Montant de l'Assurance
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#ecfdf5' }}>
              <td
                style={{
                  fontFamily: "'Times New Roman', serif",
                  fontSize: '13px',
                  color: '#000',
                  padding: '12px 14px',
                  borderBottom: '1px solid #a7f3d0',
                }}
              >
                Véhicule
              </td>
              <td
                style={{
                  fontFamily: "'Times New Roman', serif",
                  fontSize: '13px',
                  color: '#000',
                  padding: '12px 14px',
                  borderBottom: '1px solid #a7f3d0',
                }}
              >
                Assurance de transport
              </td>
              <td
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid #a7f3d0',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    background: '#065f46',
                    color: '#ffffff',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    letterSpacing: '0.5px',
                  }}
                >
                  ✓ Payé et confirmé
                </span>
              </td>
              <td
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  color: '#065f46',
                  padding: '12px 14px',
                  textAlign: 'right',
                  borderBottom: '1px solid #a7f3d0',
                }}
              >
                {formattedAmount}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Total line */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '0',
          }}
        >
          <div
            style={{
              background: '#064e3b',
              color: '#ffffff',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              fontSize: '14px',
              padding: '10px 20px',
              display: 'flex',
              gap: '32px',
              borderRadius: '0 0 6px 0',
            }}
          >
            <span>TOTAL ASSURANCE</span>
            <span>{formattedAmount}</span>
          </div>
        </div>
      </div>

      {/* ===== CONFIRMATION MESSAGE ===== */}
      <div
        style={{
          border: '1px solid #a7f3d0',
          borderRadius: '8px',
          padding: '18px 22px',
          background: '#f0fdf4',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fontSize: '11px',
            color: '#065f46',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          Message de Confirmation
        </div>
        <p
          style={{
            fontFamily: "'Times New Roman', serif",
            fontSize: '13px',
            color: '#000000',
            lineHeight: '1.7',
            margin: 0,
          }}
        >
          Nous confirmons que le client <strong>{clientName}</strong> a payé les frais
          d'assurance du véhicule d'un montant de{' '}
          <strong>{formattedAmount}</strong>. Ce montant correspond à l'assurance de sécurité
          exigée pour la protection du véhicule pendant le transport international.
        </p>
        <p
          style={{
            fontFamily: "'Times New Roman', serif",
            fontSize: '13px',
            color: '#000000',
            lineHeight: '1.7',
            margin: '10px 0 0',
          }}
        >
          L'assurance sera <strong>entièrement remboursée</strong> au client lors de la
          réception du véhicule à destination, conformément aux conditions de livraison et de
          sécurité du transport.
        </p>
      </div>

      {/* ===== STATUS BADGES ===== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            border: '2px solid #065f46',
            borderRadius: '6px',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <span
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '10px',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Statut actuel
          </span>
          <span
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              fontSize: '13px',
              color: '#000',
            }}
          >
            ✓ Assurance confirmée
          </span>
        </div>
        <div
          style={{
            border: '2px solid #065f46',
            borderRadius: '6px',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <span
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '10px',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Remboursement
          </span>
          <span
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              fontSize: '13px',
              color: '#000',
            }}
          >
            À la livraison du véhicule
          </span>
        </div>
      </div>

      {/* ===== SIGNATURE ===== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '28px',
        }}
      >
        <div style={{ width: '240px' }}>
          <div
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '12px',
              color: '#065f46',
              fontWeight: 'bold',
              marginBottom: '6px',
            }}
          >
            Signature:
          </div>

          {invoice.showSignature ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', height: '60px' }}>
              <img
                src={signatureImage}
                alt="Signature"
                style={{ height: '60px', objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div style={{ height: '60px', marginBottom: '8px' }} />
          )}

          <div style={{ borderBottom: '1.5px solid #000', width: '100%' }} />

          {invoice.signature && invoice.signature.trim() !== '' && (
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', fontWeight: 'bold', color: '#000', margin: 0 }}>
                {invoice.signature}
              </p>
            </div>
          )}
          {invoice.signatureText && invoice.signatureText.trim() !== '' && (
            <div style={{ textAlign: 'center', marginTop: '2px' }}>
              {invoice.signatureText.split('\n').map((line: string, i: number) => (
                <p key={i} style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#333', margin: 0 }}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== FOOTER (Company) ===== */}
      <div style={{ padding: '20px 0', borderTop: '1px solid #eee' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Service Trade Assurance
          </div>
          <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
            Document généré officiellement par Logistique Cargo Express
          </div>
        </div>
      </div>
    </div>
  );
}
