import React from 'react';
import { 
  Globe2, 
  Map, 
  Search, 
  ShieldCheck, 
  PlusCircle, 
} from 'lucide-react';
import type { IncidentCategory } from '../types';

interface NavbarProps {
  viewMode: '3D' | '2D';
  onToggleViewMode: (mode: '3D' | '2D') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: IncidentCategory | 'ALL';
  onSelectCategory: (cat: IncidentCategory | 'ALL') => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onToggleViewMode,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenReportModal,
}) => {
  const categories: { label: string; value: IncidentCategory | 'ALL' }[] = [
    { label: 'Todos', value: 'ALL' },
    { label: '💔 Dano Vital & Mental', value: 'Lethal & Mental Harm' },
    { label: '⚡ Agent Hacks', value: 'Autonomous Agent Hack' },
    { label: '💰 Drains Financeiros', value: 'Financial Drain' },
    { label: '🎭 Deepfakes', value: 'Deepfake Extortion' },
  ];

  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '68px',
        padding: '0 24px 0 88px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 40,
        background: 'linear-gradient(to bottom, rgba(5, 7, 12, 0.95), rgba(5, 7, 12, 0.4) 80%, transparent)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Left: Brand & Radar Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00e5ff, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 229, 255, 0.4)',
            }}
          >
            <ShieldCheck size={18} color="#05070c" />
          </div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>AI Attack Monitor</span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                LIVE RADAR
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Global Observatory of Autonomous Agent Threats & Lethal Incidents
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Search Box & Category Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '620px', margin: '0 24px' }}>
        {/* Search input */}
        <div
          style={{
            position: 'relative',
            width: '260px',
          }}
        >
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Buscar incidentes, agentes, países..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-light)',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-cyan)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-light)')}
          />
        </div>

        {/* Categories Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`glass-button ${selectedCategory === cat.value ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.value)}
              style={{ padding: '5px 10px', fontSize: '11px', whiteSpace: 'nowrap' }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right: 3D/2D Mode Toggle & Report Incident Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* 3D / 2D Switcher (from reference image) */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid var(--border-light)',
          }}
        >
          <button
            onClick={() => onToggleViewMode('3D')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '7px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: viewMode === '3D' ? 'linear-gradient(135deg, #00e5ff, #3b82f6)' : 'transparent',
              color: viewMode === '3D' ? '#05070c' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
          >
            <Globe2 size={14} />
            3D Globe
          </button>
          <button
            onClick={() => onToggleViewMode('2D')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '7px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: viewMode === '2D' ? 'linear-gradient(135deg, #00e5ff, #3b82f6)' : 'transparent',
              color: viewMode === '2D' ? '#05070c' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
          >
            <Map size={14} />
            2D Map
          </button>
        </div>

        {/* Report / Submit Incident */}
        <button
          onClick={onOpenReportModal}
          className="glass-button"
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            fontWeight: 600,
          }}
        >
          <PlusCircle size={14} color="#ef4444" />
          Reportar Incidente
        </button>
      </div>
    </header>
  );
};
