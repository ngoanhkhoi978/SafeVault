import { Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="sv-footer">
      <div className="sv-footer-inner">
        <div className="sv-footer-badge">
          <Lock size={12} />
          <span>All processing happens locally in your browser</span>
        </div>
        <p className="sv-footer-copy">
          © {new Date().getFullYear()} SafeVault · Designed by{' '}
          <a
            href="https://github.com/ngoanhkhoi978"
            target="_blank"
            rel="noopener noreferrer"
            className="sv-footer-link"
          >
            ngoanhkhoi978
          </a>
        </p>
      </div>
    </footer>
  );
}
