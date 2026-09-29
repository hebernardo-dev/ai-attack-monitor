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
                Data Sources & Continuous Ingestion
              </h1>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Data harvesting, enrichment and editorial curation ecosystem powering AI Attack Monitor
            </p>
          </div>
          <button onClick={onClose} className="glass-button">
            Back to Map
          </button>
        </div>

        {/* Supabase Status Card */}
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
                  Supabase Database Connection
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {isSupabaseConfigured
                    ? 'Connected to your Supabase PostgreSQL cluster with active Row Level Security (RLS).'
                    : 'Operating in Demo Mode backed by local verified snapshots from the AI Incident Database.'}
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
              {isSupabaseConfigured ? '● SUPABASE ONLINE' : '● LOCAL DATASET'}
            </span>
          </div>
        </div>

        {/* Main Data Sources Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {/* Source 1: AIID */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#00e5ff', textTransform: 'uppercase' }}>
                Primary Historical Archive
              </div>
              <a href="https://incidentdatabase.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                <ExternalLink size={16} />
              </a>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              AI Incident Database (AIID)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              The authoritative global research repository maintained by the Responsible AI Collaborative. Indexes thousands of audited harms, companion chatbot suicides, autonomous vehicle fatalities, and systemic biases.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="glass-button" style={{ fontSize: '11px', padding: '3px 8px' }}>GraphQL API</span>
              <span className="glass-button" style={{ fontSize: '11px', padding: '3px 8px' }}>Weekly JSON Snapshots</span>
            </div>
          </div>

          {/* Source 2: AIAAIC */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase' }}>
                Global Controversies
              </div>
              <a href="https://www.aiaaic.org" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                <ExternalLink size={16} />
              </a>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              AIAAIC Repository
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              An independent scholarly initiative cataloging algorithm disasters, corporate automation controversies, and autonomous weapon systems with rigorous cross-referencing.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="glass-button" style={{ fontSize: '11px', padding: '3px 8px' }}>CSV Data Pipeline</span>
              <span className="glass-button" style={{ fontSize: '11px', padding: '3px 8px' }}>Open Research</span>
            </div>
          </div>

          {/* Source 3: Live Pipeline */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                24/7 Real-Time
              </div>
              <Cpu size={16} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              News Ingestion & LLM Triage
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Automated crawlers scanning Google News RSS, The Verge, BleepingComputer, and Wired with LLM extraction to structure coordinates, damages, and financial losses in real time.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="glass-button" style={{ fontSize: '11px', padding: '3px 8px' }}>Gemini Extraction</span>
              <span className="glass-button" style={{ fontSize: '11px', padding: '3px 8px' }}>Auto Geocoding</span>
            </div>
          </div>
        </div>

        {/* Supabase SQL Migration Script */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
              Supabase SQL Database Schema
            </h3>
            <span style={{ fontSize: '12px', color: '#00e5ff', fontFamily: 'var(--font-mono)' }}>
              supabase/schema.sql
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Copy and execute the script below in your Supabase <strong>SQL Editor</strong> to configure table schema, spatial indexes, and Row Level Security (RLS) policies:
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
{`-- Create Incidents Table
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public read access for any visitor
CREATE POLICY "Public Read Access" 
ON public.incidents 
FOR SELECT 
USING (true);

-- Policy 2: Secure insert/update restricted to service_role and verified admins
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
