import React, { useState } from 'react';
import type { Incident } from '../types';
import { 
  MapPin, 
  Skull, 
  Search, 
  Download 
} from 'lucide-react';

interface IncidentsListTabProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onClose: () => void;
}

export const IncidentsListTab: React.FC<IncidentsListTabProps> = ({
  incidents,
  onSelectIncident,
  onClose,
}) => {
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'deaths' | 'loss'>('date');

  const filtered = incidents
    .filter(
      (inc) =>
        inc.title.toLowerCase().includes(filterText.toLowerCase()) ||
        inc.country.toLowerCase().includes(filterText.toLowerCase()) ||
        inc.category.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'deaths') return b.deaths_count - a.deaths_count;
      if (sortBy === 'loss') return b.financial_loss_usd - a.financial_loss_usd;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const exportCSV = () => {
    const headers = ['ID', 'Data', 'Titulo', 'Pais', 'Categoria', 'Severidade', 'Mortes', 'Prejuizo_USD', 'Fonte'];
    const rows = filtered.map((i) => [
      i.id,
      i.date,
      `"${i.title.replace(/"/g, '""')}"`,
      `"${i.country}"`,
      `"${i.category}"`,
      i.severity,
      i.deaths_count,
      i.financial_loss_usd,
      `"${i.source_url}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ai_incidents_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={26} color="#00e5ff" />
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff' }}>
                Catálogo Global de Incidentes Auditados
              </h1>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {filtered.length} casos catalogados com impactos humanos, financeiros e cibersegurança
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={exportCSV} className="glass-button">
              <Download size={15} /> Exportar CSV
            </button>
            <button onClick={onClose} className="glass-button">
              Voltar ao Mapa
            </button>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Filtrar por nome, país, categoria..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-light)',
                color: '#fff',
                fontSize: '13px',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ordenar por:</span>
            <button
              className={`glass-button ${sortBy === 'date' ? 'active' : ''}`}
              onClick={() => setSortBy('date')}
            >
              Data Recente
            </button>
            <button
              className={`glass-button ${sortBy === 'deaths' ? 'active' : ''}`}
              onClick={() => setSortBy('deaths')}
            >
              Fatalidades
            </button>
            <button
              className={`glass-button ${sortBy === 'loss' ? 'active' : ''}`}
              onClick={() => setSortBy('loss')}
            >
              Prejuízo ($)
            </button>
          </div>
        </div>

        {/* Table / List */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Data</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Incidente / Agente</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>País</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Categoria</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Impacto Fatal</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Prejuízo (USD)</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inc) => (
                <tr
                  key={inc.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  onClick={() => onSelectIncident(inc)}
                >
                  <td style={{ padding: '14px 18px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {inc.date}
                  </td>
                  <td style={{ padding: '14px 18px', color: '#fff', fontWeight: 600, maxWidth: '340px' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inc.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#00e5ff', fontWeight: 500, marginTop: '2px' }}>
                      {inc.entities_involved.slice(0, 2).join(' • ')}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                    {inc.country}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {inc.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    {inc.deaths_count > 0 ? (
                      <span style={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Skull size={14} /> {inc.deaths_count}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>0</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)' }}>
                    {inc.financial_loss_usd > 0 ? (
                      <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                        ${(inc.financial_loss_usd / 1000000).toFixed(1)}M
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ color: '#00e5ff', fontSize: '12px', fontWeight: 600 }}>
                      Examinar ➔
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
