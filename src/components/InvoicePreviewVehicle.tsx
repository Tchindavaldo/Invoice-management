import { Invoice } from "../types";
import signatureImage from "../images/signature2.png";

const labelStyle = {
  fontFamily: "'Times New Roman', serif",
  fontSize: "13px",
  color: "#1a2e5a",
  minWidth: "210px", 
  fontWeight: "normal" as any,
};

const valueStyle = {
  fontFamily: "'Times New Roman', serif",
  fontSize: "13px",
  color: "#000",
};

const sectionHeaderStyle = {
  background: "none",
  borderBottom: "2px solid #1a2e5a",
  borderTop: "2px solid #1a2e5a",
  padding: "5px 0",
  marginBottom: "8px",
  marginTop: "14px",
  fontFamily: "'Arial', sans-serif",
  fontWeight: "bold" as any,
  fontSize: "13px",
  color: "#1a2e5a",
  letterSpacing: "0.5px",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", marginBottom: "4px", paddingLeft: "8px" }}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}

interface InvoicePreviewProps {
  invoice: Invoice;
}

export default function InvoicePreviewVehicle({ invoice }: InvoicePreviewProps) {
  let form: any = {};
  try {
    if (invoice.notes) {
      form = JSON.parse(invoice.notes);
    }
  } catch (e) {
    console.error("Failed to parse vehicle info", e);
  }

  // Use fallback generic fields if specific ones not available
  form.dossier = form.dossier || invoice.invoiceNumber || "";
  form.dateExp = form.dateExp || invoice.date || "";

  return (
    <div
      id="invoice-preview"
      className="bg-white mx-auto print-area"
      style={{
        width: "794px", // Matches standard A4 width approx (210mm) for pdf generation 
        minHeight: "1123px",
        padding: "36px 44px 32px",
        fontFamily: "'Times New Roman', serif",
        boxSizing: "border-box"
      }}
    >
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "2px" }}>
        <div style={{ fontFamily: "Arial, sans-serif", fontWeight: "900", fontSize: "19px", color: "#1a2e5a", letterSpacing: "1px", textTransform: "uppercase" }}>
          Bordereau d'Expédition de Véhicule
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontWeight: "700", fontSize: "13px", color: "#1a2e5a", letterSpacing: "2px", marginTop: "3px" }}>
          VEHICLE SHIPPING FORM
        </div>
      </div>

      {/* Dossier */}
      <div style={{ textAlign: "right", margin: "10px 0 4px", fontFamily: "Arial, sans-serif", fontSize: "13px", color: "#1a2e5a" }}>
        <strong>N° DOSSIER : {form.dossier || "—"}</strong>
      </div>

      <hr style={{ border: "none", borderTop: "2px solid #1a2e5a", margin: "4px 0 0" }} />

      {/* Véhicule */}
      <div style={sectionHeaderStyle}>INFORMATIONS SUR LE VÉHICULE</div>
      <Row label="Marque / Modèle :" value={form.marque || "—"} />
      <Row label="Numéro de Châssis (VIN) :" value={form.vin || "—"} />
      <Row label="Année :" value={form.annee || "—"} />
      <Row label="Couleur :" value={form.couleur || "—"} />

      {/* Expéditeur */}
      <div style={sectionHeaderStyle}>INFORMATIONS SUR L'EXPÉDITEUR</div>
      <Row label="Expéditeur :" value={form.expediteur || invoice.companyName || "—"} />
      <Row label="Adresse :" value={form.adresseExp || invoice.companyAddress || "—"} />
      <Row label="Contact :" value={form.contactExp || invoice.companyPhone || "—"} />

      {/* Destinataire */}
      <div style={sectionHeaderStyle}>INFORMATIONS SUR LE DESTINATAIRE</div>
      <Row label="Destinataire :" value={form.destinataire || invoice.clientName || "—"} />
      <Row label="Adresse :" value={form.adresseDest || invoice.clientLocation || "—"} />
      <Row label="Téléphone :" value={form.telephoneDest || invoice.clientPhone || "—"} />

      {/* Transport */}
      <div style={sectionHeaderStyle}>INFORMATIONS SUR LE TRANSPORT</div>
      <Row label="Port de Départ :" value={form.portDepart || "—"} />
      <Row label="Port d'Arrivée :" value={form.portArrivee || "—"} />
      <Row label="Mode de Transport :" value={form.transport || "—"} />
      <Row label="Nom du Navire :" value={form.navire || "—"} />
      <Row label="Date d'Expédition :" value={form.dateExp || invoice.date || "—"} />

      {/* Tracking */}
      <div style={{ background: "#1a2e5a", color: "#fff", fontFamily: "Arial, sans-serif", fontWeight: "bold", fontSize: "13px", padding: "8px 12px", margin: "16px 0 16px", letterSpacing: "0.5px" }}>
        NUMÉRO DE SUIVI / TRACKING NUMBER: &nbsp;{form.tracking || "—"}
      </div>

      {/* Signatures */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", marginBottom: "30px" }}>
        {/* Expéditeur Signature */}
        <div style={{ width: "40%" }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#1a2e5a", marginBottom: "8px" }}>
            Signature de l'Expéditeur:
          </div>
          
          {form.showSenderSignature ? (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px", height: "60px" }}>
              <img
                src={signatureImage}
                alt="Signature"
                style={{ height: "60px", objectFit: "contain" }}
              />
            </div>
          ) : (
            <div style={{ height: "60px", marginBottom: "8px" }}></div>
          )}

          <div style={{ borderBottom: "1px solid #000", width: "100%" }}></div>
          
          {form.senderSignature && form.senderSignature.trim() !== "" && (
            <div style={{ textAlign: "center", marginTop: "4px" }}>
              <p style={{ fontSize: "12px", fontWeight: "bold", color: "#000", margin: 0 }}>
                {form.senderSignature}
              </p>
            </div>
          )}
          {form.senderSignatureText && form.senderSignatureText.trim() !== "" && (
            <div style={{ textAlign: "center", marginTop: "2px" }}>
              <p style={{ fontSize: "11px", color: "#333", margin: 0 }}>
                {form.senderSignatureText}
              </p>
            </div>
          )}
        </div>
        
        {/* Transporteur Signature */}
        <div style={{ width: "40%" }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#1a2e5a", marginBottom: "8px" }}>
            Signature du Transporteur:
          </div>
          
          {/* Implement dynamic signature logic as requested */}
          {invoice.showSignature ? (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px", height: "60px" }}>
              <img
                src={signatureImage}
                alt="Signature"
                style={{ height: "60px", objectFit: "contain" }}
              />
            </div>
          ) : (
            <div style={{ height: "60px", marginBottom: "8px" }}></div>
          )}

          <div style={{ borderBottom: "1px solid #000", width: "100%" }}></div>
          
          {invoice.signature && invoice.signature.trim() !== "" && (
            <div style={{ textAlign: "center", marginTop: "4px" }}>
              <p style={{ fontSize: "12px", fontWeight: "bold", color: "#000", margin: 0 }}>
                {invoice.signature}
              </p>
            </div>
          )}
          {invoice.signatureText && invoice.signatureText.trim() !== "" && (
            <div style={{ textAlign: "center", marginTop: "2px" }}>
              <p style={{ fontSize: "11px", color: "#333", margin: 0 }}>
                {invoice.signatureText}
              </p>
            </div>
          )}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #aaa", margin: "10px 0 8px" }} />

      {/* Footer note */}
      <div style={{ fontFamily: "'Times New Roman', serif", fontStyle: "italic", fontSize: "12px", color: "#333", textAlign: "center", marginBottom: "12px" }}>
        Ce document confirme que le véhicule a été remis au transporteur pour expédition.
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #aaa", margin: "8px 0 10px" }} />

      {/* Company */}
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <div style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold", fontSize: "14px", color: "#1a2e5a" }}>
          {invoice.companyName || "Logistique Cargo Express"}
        </div>
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#555", marginTop: "3px" }}>
          {invoice.companyEmail ? invoice.companyEmail : "contact@logistique-cargo.com"}
          {invoice.companyPhone ? ` | Tel: ${invoice.companyPhone}` : ""}
        </div>
      </div>
    </div>
  );
}
