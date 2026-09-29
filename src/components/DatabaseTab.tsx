import React from 'react';
import { Database, Server, ExternalLink, Cpu } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabaseClient';

interface DatabaseTabProps {
  onClose: () => void;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ onClose }) => {
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
              <Database size={26} color="#00e5ff" />
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff' }}>
                Fontes de Dados & Ingestão Contínua
              </h1>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Ecossistema de coleta, enriquecimento e curadoria de dados para o AIAttackMonitor
            </p>
          </div>
          <button onClick={onClose} className="glass-button">
            Voltar ao Mapa
          </button>
        </div>

        {/* Status Supabase Card */}
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            marginBottom: '32px',
            border: isSupabaseConfigured ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
            background: isSupabaseConfigured ? 'rgba(16, 185, 129, 0.05)' : 'rgba(245, 158, 11, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Server size={28} color={isSupabaseConfigured ? '#10b981' : '#f59e0b'} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                  Conexão Supabase Database
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {isSupabaseConfigured
                    ? 'Conectado com sucesso ao seu PostgreSQL Supabase com RLS ativo.'
                    : 'Operando em modo Demonstração com o dataset local do AI Incident Database (AIID).'}
                </p>
              </div>
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: '8px',
                background: isSupabaseConfigured ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: isSupabaseConfigured ? '#10b981' : '#f59e0b',
                border: `1px solid ${isSupabaseConfigured ? '#10b981' : '#f59e0b'}`,
              }}
            >
              {isSupabaseConfigured ? '● SUPABASE ONLINE' : '● DATASET LOCAL'}
            </span>
          </div>
        </div>

        {/* Grid de Fontes Principais */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {/* Fonte 1: AIID */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#00e5ff', textTransform: 'uppercase' }}>
                Base Histórica Primária
              </div>
              <a href="https://incidentdatabase.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                <ExternalLink size={16} />
              </a>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              AI Incident Database (AIID)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              O repositório científico de referência mundial da Responsible AI Collaborative. Inclui milhares de incidentes auditados, suicídios associados a chatbots, atropelamentos de carros autônomos e falhas éticas.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="glass-button" style={{ fontSize: '11px', padding: '3px 8px' }}>GraphQL API</span>
              <span className="glass-button" style={{ fontSize: '11px', padding: '3px 8px' }}>Weekly JSON Snapshots</span>
            </div>
          </div>

          {/* Fonte 2: AIAAIC */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase' }}>
                Controvérsias Globais
              </div>
              <a href="https://www.aiaaic.org" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                <ExternalLink size={16} />
              </a>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              AIAAIC Repository
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Iniciativa independente focada em catalogar desastres de automação, algoritmos corporativos e armas autônomas, mantida com curadoria acadêmica e jornalística.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="glass-button" style={{ fontSize: '11px', padding: '3px 8px' }}>CSV Dataflow</span>
              <span className="glass-button" style={{ fontSize: '11px', padding: '3px 8px' }}>Open Research</span>
            </div>
          </div>

          {/* Fonte 3: Pipeline de Scraper e Notícias */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                Tempo Real 24/7
              </div>
              <Cpu size={16} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Pipeline Noticioso & LLM Triage
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Rotinas agendadas (Cron) que monitoram Google News RSS, The Verge, BleepingComputer e Wired com extração automática via modelo de linguagem para classificar coordenadas, danos e prejuízos.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="glass-button" style={{ fontSize: '11px', padding: '3px 8px' }}>Gemini Extraction</span>
              <span className="glass-button" style={{ fontSize: '11px', padding: '3px 8px' }}>Auto Geocoding</span>
            </div>
          </div>
        </div>

        {/* Script SQL Supabase pronto para copiar */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
              Schema SQL do Banco de Dados (Supabase)
            </h3>
            <span style={{ fontSize: '12px', color: '#00e5ff', fontFamily: 'var(--font-mono)' }}>
              supabase/schema.sql
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Copie o script abaixo e execute no <strong>SQL Editor</strong> do painel do seu projeto no Supabase para criar a tabela com Row Level Security (RLS) e índices espaciais:
          </p>
          <pre
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid var(--border-light)',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              overflowX: 'auto',
              maxHeight: '260px',
            }}
          >
{`-- Criar tabela de Incidentes
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  month INT NOT NULL DEFAULT EXTRACT(MONTH FROM CURRENT_DATE),
  country TEXT NOT NULL,
  country_code VARCHAR(3) DEFAULT 'US',
  city TEXT,
  lat FLOAT NOT NULL DEFAULT 0.0,
  lng FLOAT NOT NULL DEFAULT 0.0,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  category VARCHAR(50) NOT NULL,
  deaths_count INT NOT NULL DEFAULT 0,
  financial_loss_usd NUMERIC(15,2) NOT NULL DEFAULT 0.0,
  entities_involved TEXT[] DEFAULT '{}',
  target_type VARCHAR(50) DEFAULT 'Individuals',
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar Row Level Security (RLS)
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Política 1: Leitura pública irrestrita para qualquer visitante
CREATE POLICY "Public Read Access" 
ON public.incidents 
FOR SELECT 
USING (true);

-- Política 2: Inserção protegida (somente admin autenticado ou chave service_role de scrapers)
CREATE POLICY "Service Role Full Access" 
ON public.incidents 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);`}
          </pre>
        </div>
      </div>
    </div>
  );
};
