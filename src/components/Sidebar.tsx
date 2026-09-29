import React from 'react';
import { 
  Globe2, 
  MapPin, 
  Database, 
  ShieldAlert, 
  BarChart3, 
  HelpCircle,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'map' | 'incidents' | 'database' | 'security' | 'analytics';
  onTabChange: (tab: 'map' | 'incidents' | 'database' | 'security' | 'analytics') => void;
  isSupabaseConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isSupabaseConnected,
}) => {
  const navItems = [
    { id: 'map', icon: Globe2, tooltip: 'Threat Map 3D/2D' },
    { id: 'incidents', icon: MapPin, tooltip: 'Lista de Incidentes' },
    { id: 'database', icon: Database, tooltip: 'Fontes & Repositórios (AIID)' },
    { id: 'security', icon: ShieldAlert, tooltip: 'Arquitetura de Segurança & RLS' },
    { id: 'analytics', icon: BarChart3, tooltip: 'Estatísticas & Prejuízos' },
  ] as const;

  return (
    <aside
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '68px',
        background: 'rgba(9, 13, 22, 0.92)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 0',
        zIndex: 50,
      }}
    >
      {/* Top Brand Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00e5ff 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.35)',
            cursor: 'pointer',
          }}
          onClick={() => onTabChange('map')}
        >
          <Cpu size={22} color="#05070c" />
        </div>

        {/* Navigation Icon Rail */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                title={item.tooltip}
                onClick={() => onTabChange(item.id)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid transparent',
                  color: isActive ? '#00e5ff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <Icon size={20} />
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '-2px',
                      width: '3px',
                      height: '18px',
                      background: '#00e5ff',
                      borderRadius: '0 4px 4px 0',
                      boxShadow: '0 0 10px #00e5ff',
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {/* Supabase status indicator */}
        <div
          title={isSupabaseConnected ? 'Supabase Conectado (Online)' : 'Modo Demonstração / Dados Locais AIID'}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => onTabChange('database')}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isSupabaseConnected ? '#10b981' : '#f59e0b',
              boxShadow: `0 0 8px ${isSupabaseConnected ? '#10b981' : '#f59e0b'}`,
            }}
          />
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isSupabaseConnected ? 'DB LIVE' : 'DEMO'}
          </span>
        </div>

        <button
          title="Ajuda e Documentação"
          onClick={() => onTabChange('security')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </aside>
  );
};
