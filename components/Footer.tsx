export default function Footer() {
  return (
    <footer className="site-footer frost footer-compact" role="contentinfo">
      <div className="footer-row">
        <div className="footer-brand">
          <div className="brand-title">LangTech Security</div>
          <p className="muted">
            Hospedagem segura, monitorada 24h, com HTTPS/SSL, firewall ativo e observabilidade.
          </p>
        </div>

        <div className="footer-contact">
          <div className="email">✉️ contato@langtech.dev</div>
          <div className="pay-icons" aria-label="Formas de pagamento">
            <span title="PIX">💠</span>
            <span title="Cartão">💳</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom compact">
        <small>© {new Date().getFullYear()} LangTech Security.</small>
      </div>
    </footer>
  );
}
