import React from 'react';
import type { Incident, MetricSummary } from '../types';
import { 
  TrendingUp, 
  ShieldAlert, 
  DollarSign, 
  Skull, 
  Radio, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface TelemetryHUDProps {
  metrics: MetricSummary;
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  selectedIncident: Incident | null;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  metrics,
  incidents,
  onSelectIncident,
  selectedIncident,
}) => {
  const lethalCount = incidents.filter(i => i.category === 'Lethal & Mental Harm').length;
  const hackCount = incidents.filter(i => i.category === 'Autonomous Agent Hack').length;
  const drainCount = incidents.filter(i => i.category === 'Financial Drain').length;
  const deepfakeCount = incidents.filter(i => i.category === 'Deepfake Extortion').length;

  return (
    <>
      {/* ================= TOP LEFT HUD CARD ================= */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '80px',
          left: '90px',
          width: '280px',
          padding: '20px',
          zIndex: 30,
          pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
              Total de Incidentes
            </div>
            <div className="telemetry-mono" style={{ fontSize: '32px', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
              {(metrics.totalIncidents / 1000).toFixed(1)}k+
            </div>
          </div>
          {/* Mini Sparkline SVG */}
          <div style={{ width: '70px', height: '36px' }}>
            <svg width="70" height="36" viewBox="0 0 70 36">
              <path
                d="M 2 28 Q 18 32 30 18 T 50 14 T 68 4"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="68" cy="4" r="3" fill="#00e5ff" />
            </svg>
          </div>
        </div>

        {/* Status Indicators List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(59, 130, 246, 0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} color="#3b82f6" />
              <span style={{ fontSize: '12px', color: '#93c5fd' }}>Agent Hacks / Exploits</span>
            </div>
            <span className="telemetry-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>1.1k+</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Skull size={16} color="#ef4444" />
              <span style={{ fontSize: '12px', color: '#fca5a5' }}>Vítimas Fatais / Suicídios</span>
            </div>
            <span className="telemetry-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444' }}>{metrics.totalDeaths}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(245, 158, 11, 0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={16} color="#f59e0b" />
              <span style={{ fontSize: '12px', color: '#fcd34d' }}>Prejuízo Estimado</span>
            </div>
            <span className="telemetry-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>$412M+</span>
          </div>
        </div>

        {/* Historical Year Comparison */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ano Atual (2026)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="telemetry-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{metrics.incidentsYear2026}</span>
              <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center' }}>
                <TrendingUp size={11} style={{ marginRight: '2px' }} /> +18%
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Último Mês (Set 2026)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="telemetry-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{metrics.incidentsLastMonth}</span>
              <span style={{ fontSize: '11px', color: '#f59e0b' }}>+12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TOP RIGHT HUD CARD (SEVERITY & ESCALATION) ================= */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '80px',
          right: '24px',
          width: '280px',
          padding: '20px',
          zIndex: 30,
          pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
              Agentes Autônomos sob Risco
            </div>
            <div className="telemetry-mono" style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>
              {metrics.monitoredAgentsCount}
            </div>
          </div>
          <div style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--color-cyan)', fontSize: '11px', padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>
            ▲ 12%
          </div>
        </div>

        {/* Severity Curve Chart */}
        <div style={{ marginTop: '16px', height: '48px', position: 'relative' }}>
          <svg width="100%" height="48" viewBox="0 0 240 48" preserveAspectRatio="none">
            <path
              d="M 0 40 Q 60 38 100 24 T 180 18 T 240 6"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />
            <path
              d="M 0 40 Q 60 38 100 24 T 180 18 T 240 6 L 240 48 L 0 48 Z"
              fill="url(#greenGradient)"
              opacity="0.2"
            />
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Radio size={14} color="#00e5ff" style={{ animation: 'radar-pulse 2s infinite' }} />
          Escalada de incidentes com autonomia em 2026
        </div>
      </div>

      {/* ================= BOTTOM RIGHT HUD CARD (CATEGORIES BREAKDOWN) ================= */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          width: '300px',
          padding: '20px',
          zIndex: 30,
          pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Distribuição por Categoria</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Média global de ocorrências</div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>

        {/* Vertical Bar Chart Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '110px', padding: '0 8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
          {/* Bar 1: Agent Hack */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '40px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>39.7%</span>
            <div style={{ width: '24px', height: '80px', background: 'linear-gradient(to top, #3b82f6, #60a5fa)', borderRadius: '4px' }} />
          </div>

          {/* Bar 2: Financial Drain */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '40px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>28.3%</span>
            <div style={{ width: '24px', height: '58px', background: 'linear-gradient(to top, #10b981, #34d399)', borderRadius: '4px' }} />
          </div>

          {/* Bar 3: Deepfakes */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '40px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>17.4%</span>
            <div style={{ width: '24px', height: '36px', background: 'linear-gradient(to top, #a855f7, #c084fc)', borderRadius: '4px' }} />
          </div>

          {/* Bar 4: Lethal & Harm */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '40px' }}>
            <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700 }}>14.6%</span>
            <div style={{ width: '24px', height: '30px', background: 'linear-gradient(to top, #ef4444, #f87171)', borderRadius: '4px' }} />
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#3b82f6' }} />
            <span>Agent Hacks ({hackCount})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }} />
            <span>Drains Financeiros ({drainCount})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#a855f7' }} />
            <span>Deepfakes ({deepfakeCount})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#ef4444' }} />
            <span style={{ color: '#fca5a5' }}>Dano Vital ({lethalCount})</span>
          </div>
        </div>

        {/* Progress Gauges (75% / 25% style from reference) */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff' }}>
              75%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Auditados & Validados</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', border: '3px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff' }}>
              25%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Em Investigação</div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM LEFT HUD (LIVE INCIDENT STREAM TICKER) ================= */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '90px',
          width: '360px',
          padding: '16px 20px',
          zIndex: 30,
          pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'radar-pulse 1.8s infinite' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Telemetry Feed
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{incidents.length} monitorados</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
          {incidents.slice(0, 4).map((inc) => (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                background: selectedIncident?.id === inc.id ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: selectedIncident?.id === inc.id ? '1px solid var(--color-cyan)' : '1px solid var(--border-light)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ overflow: 'hidden', paddingRight: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#00e5ff', fontWeight: 600 }}>
                  <span>{inc.country_code}</span>
                  <span>•</span>
                  <span style={{ color: inc.deaths_count > 0 ? '#ef4444' : 'var(--text-muted)' }}>
                    {inc.deaths_count > 0 ? `⚠️ ${inc.deaths_count} Fatalidade` : inc.category}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {inc.title}
                </div>
              </div>
              <ExternalLink size={14} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
