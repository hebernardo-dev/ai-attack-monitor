import React, { useState } from 'react';
import type { Incident } from '../types';

interface Map2DProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  selectedIncident: Incident | null;
}

export const Map2D: React.FC<Map2DProps> = ({
  incidents,
  onSelectIncident,
  selectedIncident,
}) => {
  const [hoveredIncident, setHoveredIncident] = useState<Incident | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Convert lat/lng to SVG percentage (Equirectangular)
  const getCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  const severityColors = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#a855f7',
    low: '#00e5ff',
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#05070c', overflow: 'hidden' }}>
      {/* Background SVG Grid and World Landmass Silhouette */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0, opacity: 0.8 }}
      >
        {/* Latitude & Longitude Coordinate Lines */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0, 229, 255, 0.05)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="1000" height="500" fill="url(#grid)" />

        {/* Equator & Prime Meridian lines */}
        <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(0, 229, 255, 0.15)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Simplified high-tech landmass silhouettes */}
        <g fill="rgba(19, 30, 50, 0.7)" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="0.7">
          {/* North America */}
          <path d="M 120 70 L 320 80 L 300 210 L 220 240 L 150 180 Z" />
          {/* South America */}
          <path d="M 270 270 L 350 290 L 320 440 L 280 400 Z" />
          {/* Europe */}
          <path d="M 460 90 L 580 90 L 560 190 L 480 180 Z" />
          {/* Africa */}
          <path d="M 470 200 L 610 210 L 580 390 L 520 380 Z" />
          {/* Asia */}
          <path d="M 600 70 L 890 80 L 850 250 L 630 240 Z" />
          {/* Oceania */}
          <path d="M 780 320 L 910 330 L 880 420 L 770 400 Z" />
        </g>
      </svg>

      {/* Incident Threat Markers */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {incidents.map((inc) => {
          const { x, y } = getCoordinates(inc.lat, inc.lng);
          const color = severityColors[inc.severity];
          const isSelected = selectedIncident?.id === inc.id;

          return (
            <div
              key={inc.id}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: isSelected ? 50 : 20,
              }}
              onMouseEnter={(e) => {
                setHoveredIncident(inc);
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => {
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoveredIncident(null)}
              onClick={() => onSelectIncident(inc)}
            >
              {/* Radar pulse ring */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: `2px solid ${color}`,
                  position: 'absolute',
                  top: '-7px',
                  left: '-7px',
                  animation: 'radar-pulse 2s infinite ease-out',
                }}
              />
              {/* Core dot */}
              <div
                style={{
                  width: isSelected ? '14px' : '10px',
                  height: isSelected ? '14px' : '10px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  boxShadow: `0 0 12px ${color}`,
                  transition: 'all 0.2s',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Floating Tooltip */}
      {hoveredIncident && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            left: `${tooltipPos.x + 16}px`,
            top: `${tooltipPos.y - 20}px`,
            padding: '10px 14px',
            zIndex: 9999,
            pointerEvents: 'none',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            maxWidth: '300px',
          }}
        >
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#00e5ff', fontWeight: 700, marginBottom: '2px' }}>
            {hoveredIncident.country} • {hoveredIncident.category}
          </div>
          <div style={{ fontWeight: 600, fontSize: '13px', color: '#fff', lineHeight: '1.3' }}>
            {hoveredIncident.title}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
            {hoveredIncident.deaths_count > 0 && (
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ {hoveredIncident.deaths_count} Morte(s) • </span>
            )}
            Clique para inspecionar
          </div>
        </div>
      )}
    </div>
  );
};
