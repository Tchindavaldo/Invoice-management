// ----------------------------------------------------------------------
// Page de blocage : la version gratuite Vercel a expiré.
// Meme design que le FRONTEND / BACKEND de WOOD PRO.
// ----------------------------------------------------------------------

export default function Expired() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        background: '#0f1115',
        color: '#e7e9ee',
      }}
    >
      <div style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>⛔</div>
        <h1 style={{ fontSize: 28, margin: '0 0 12px', fontWeight: 700 }}>
          Site temporairement indisponible
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: '#aab0bd', margin: '0 0 8px' }}>
          La version gratuite de l’hébergement Vercel a expiré.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: '#aab0bd', margin: 0 }}>
          Pour continuer à accéder au site, il est nécessaire d’acheter un nom de
          domaine et de configurer un hébergement actif.
        </p>
        <div
          style={{
            marginTop: 28,
            padding: '12px 16px',
            borderRadius: 8,
            background: '#1a1d24',
            border: '1px solid #2a2e38',
            fontSize: 14,
            color: '#8b90a0',
          }}
        >
          Erreur&nbsp;: URL Vercel expirée — version gratuite terminée.
        </div>
      </div>
    </div>
  );
}
