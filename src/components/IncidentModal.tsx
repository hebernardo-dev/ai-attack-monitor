import React from 'react';
import type { Incident } from '../types';
import { 
  X, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Skull, 
  Cpu, 
  Target, 
  ShieldCheck 
} from 'lucide-react';

interface IncidentModalProps {
  incident: Incident | null;
  onClose: () => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({ incident, onClose }) => {
  if (!incident) return null;

  const severityColors = {
    critical: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', text: '#ef4444', label: 'Crítico / Dano Vital' },
    high: { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#f59e0b', label: 'Alto Risco / Exploração' },
    medium: { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)', text: '#a855f7', label: 'Médio / Extorsão' },
    low: { bg: 'rgba(0, 229, 255, 0.15)', border: 'rgba(0, 229, 255, 0.4)', text: '#00e5ff', label: 'Moderado / Operacional' },
  };

  const sev = severityColors[incident.severity];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          background: 'rgba(13, 19, 33, 0.95)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 229, 255, 0.15)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '6px',
                background: sev.bg,
                border: `1px solid ${sev.border}`,
                color: sev.text,
              }}
            >
              {sev.label}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              {incident.category}
            </span>
            {incident.verified && (
              <span
                style={{
                  fontSize: '11px',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={14} /> Auditado
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', lineHeight: '1.3', marginBottom: '14px' }}>
          {incident.title}
        </h2>

        {/* Location & Date tags */}
        <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} color="#00e5ff" />
            <span>{incident.city ? `${incident.city}, ` : ''}{incident.country}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} color="var(--text-muted)" />
            <span>{incident.date}</span>
          </div>
        </div>

        {/* Critical Impact Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '22px' }}>
          {/* Deaths / Casualties */}
          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: incident.deaths_count > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.03)',
              border: incident.deaths_count > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-light)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: incident.deaths_count > 0 ? '#ef4444' : 'var(--text-muted)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
              <Skull size={15} /> Vítimas Fatais
            </div>
            <div className="telemetry-mono" style={{ fontSize: '22px', fontWeight: 800, color: incident.deaths_count > 0 ? '#ef4444' : '#fff', marginTop: '6px' }}>
              {incident.deaths_count}
            </div>
          </div>

          {/* Financial Loss */}
          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: incident.financial_loss_usd > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.03)',
              border: incident.financial_loss_usd > 0 ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid var(--border-light)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
              <DollarSign size={15} /> Prejuízo Estimado
            </div>
            <div className="telemetry-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              {incident.financial_loss_usd > 0 
                ? `$${(incident.financial_loss_usd / 1000000).toFixed(1)}M` 
                : '$0'}
            </div>
          </div>

          {/* Target type */}
          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-light)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
              <Target size={15} /> Tipo de Alvo
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginTop: '8px' }}>
              {incident.target_type}
            </div>
          </div>
        </div>

        {/* Detailed Dossier Text */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>
            Relatório de Inteligência
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '12px' }}>
            {incident.summary}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {incident.description}
          </p>
        </div>

        {/* Entities Involved */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Agentes e Tecnologias Identificadas
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {incident.entities_involved.map((ent, idx) => (
              <span
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  background: 'rgba(0, 229, 255, 0.1)',
                  color: '#00e5ff',
                  border: '1px solid rgba(0, 229, 255, 0.25)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                <Cpu size={13} /> {ent}
              </span>
            ))}
          </div>
        </div>

        {/* Source link footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Fonte Jornalística / Jurídica: <strong style={{ color: '#fff' }}>{incident.source_name}</strong>
          </div>
          <a
            href={incident.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-button"
            style={{
              background: 'rgba(0, 229, 255, 0.15)',
              borderColor: 'var(--color-cyan)',
              color: '#00e5ff',
              fontWeight: 600,
            }}
          >
            <span>Ver Notícia Original</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
