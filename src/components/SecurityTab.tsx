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
                Arquitetura de Segurança & Proteção Anti-Ataques
              </h1>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Medidas implementadas para proteger o AI Attack Monitor contra invasões, ataques DDoS, scrapers maliciosos e injeção de dados.
            </p>
          </div>
          <button onClick={onClose} className="glass-button">
            Voltar ao Mapa
          </button>
        </div>

        {/* 4 Pilares de Defesa */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Pilar 1: Supabase RLS */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', marginBottom: '12px' }}>
              <Lock size={20} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>1. Supabase RLS Blindado</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              O banco de dados usa <strong>Row-Level Security</strong> nativo do PostgreSQL. Visitantes anônimos possuem apenas permissão de leitura (`SELECT`). Qualquer tentativa de `INSERT`, `UPDATE` ou `DELETE` via browser é bloqueada diretamente no motor do banco.
            </p>
            <div style={{ marginTop: '14px', fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> Chave pública anon isolada
            </div>
          </div>

          {/* Pilar 2: Cloudflare & Edge DDoS */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6', marginBottom: '12px' }}>
              <Globe size={20} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>2. Escudo Cloudflare / Edge WAF</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Colocar a Cloudflare à frente do domínio garante mitigação ilimitada contra ataques de negação de serviço (DDoS L3/L4/L7), <em>Bot Fight Mode</em> para impedir que scrapers derrubem a aplicação e rate limiting global.
            </p>
            <div style={{ marginTop: '14px', fontSize: '12px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> Mitigação de DDoS automática
            </div>
          </div>

          {/* Pilar 3: Vercel Security Headers */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', marginBottom: '12px' }}>
              <Server size={20} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>3. Cabeçalhos HTTP Rigorosos</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Configuração de cabeçalhos contra Clickjacking (`X-Frame-Options: DENY`), prevenção de ataques MIME (`X-Content-Type-Options: nosniff`) e Content Security Policy (CSP) impedindo execução de scripts não autorizados.
            </p>
            <div style={{ marginTop: '14px', fontSize: '12px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> Proteção contra XSS e Iframes
            </div>
          </div>
        </div>

        {/* Deploy & Git Workflow */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Terminal size={20} color="#00e5ff" />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>
              Fluxo de Deploy Automatizado (Local ➔ GitHub ➔ Vercel)
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
            Para você salvar seus arquivos locais e subir instantaneamente para a produção na Vercel com um único comando:
          </p>

          <ol style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.8' }}>
            <li>Você faz qualquer alteração ou melhoria no código local aqui na sua pasta.</li>
            <li>Configuramos o script <code style={{ color: '#00e5ff', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>npm run deploy</code> que adiciona tudo, faz o commit e envia (<code style={{ color: '#00e5ff' }}>git push origin main</code>).</li>
            <li>A <strong>Vercel</strong> detecta o push no GitHub e compila uma nova versão em segundos com certificado SSL e CDN global automática.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
