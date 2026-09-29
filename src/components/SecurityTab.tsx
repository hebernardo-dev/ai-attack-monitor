import React from 'react';
import { ShieldCheck, Lock, Globe, Server, CheckCircle2, Terminal } from 'lucide-react';

interface SecurityTabProps {
  onClose: () => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '68px',
        left: '68px',
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.94)',
        backdropFilter: 'blur(20px)',
        zIndex: 35,
        padding: '32px 48px',
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={26} color="#00e5ff" />
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff' }}>
                Security Architecture & Threat Defense
              </h1>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Multi-layered safeguards implemented to defend AI Attack Monitor against DDoS, scraper abuse, data poisoning, and unauthorized injections.
            </p>
          </div>
          <button onClick={onClose} className="glass-button">
            Back to Map
          </button>
        </div>

        {/* 3 Pillars of Defense */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Pillar 1: Supabase RLS */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', marginBottom: '12px' }}>
              <Lock size={20} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>1. Hardened Supabase RLS</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              The database enforces native PostgreSQL <strong>Row-Level Security (RLS)</strong>. Anonymous browser clients hold strict read-only (`SELECT`) permissions. Direct `INSERT`, `UPDATE`, or `DELETE` requests from unauthenticated clients are rejected at the database engine level.
            </p>
            <div style={{ marginTop: '14px', fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> Public Anon Role Isolated
            </div>
          </div>

          {/* Pillar 2: Cloudflare & Edge DDoS */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6', marginBottom: '12px' }}>
              <Globe size={20} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>2. Cloudflare Shield & Edge WAF</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Positioning Cloudflare in front of the Vercel production domain guarantees unmetered Layer 3/4/7 DDoS mitigation, <em>Bot Fight Mode</em> to block scrapers, and global rate limiting across any automated probing attempts.
            </p>
            <div style={{ marginTop: '14px', fontSize: '12px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> Automated DDoS Mitigation
            </div>
          </div>

          {/* Pillar 3: Vercel Security Headers */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', marginBottom: '12px' }}>
              <Server size={20} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>3. Strict HTTP Headers</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Strict security headers block clickjacking (`X-Frame-Options: DENY`), prevent MIME confusion attacks (`X-Content-Type-Options: nosniff`), and enforce Content Security Policies (CSP) against unauthorized script injection.
            </p>
            <div style={{ marginTop: '14px', fontSize: '12px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> XSS & Iframe Defense
            </div>
          </div>
        </div>

        {/* Deploy & Git Workflow */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Terminal size={20} color="#00e5ff" />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>
              Automated CI/CD Pipeline (Local ➔ GitHub ➔ Vercel)
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
            To save local adjustments and trigger an instant production release on Vercel:
          </p>

          <ol style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.8' }}>
            <li>Make any code changes or refine data attributes in your local workspace.</li>
            <li>Run the automated deployment script or trigger a git push to the <code style={{ color: '#00e5ff', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>main</code> branch.</li>
            <li><strong>Vercel</strong> automatically detects the commit, runs production bundling, and updates the live domain with zero downtime and global SSL.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
