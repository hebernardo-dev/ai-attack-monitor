import { useState, useEffect, useMemo } from 'react';
import type { Incident, IncidentCategory } from './types';
import { INITIAL_INCIDENTS, computeMetrics } from './data/mockIncidents';
import { fetchIncidents, isSupabaseConfigured } from './lib/supabaseClient';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Globe3D } from './components/Globe3D';
import { Map2D } from './components/Map2D';
import { TelemetryHUD } from './components/TelemetryHUD';
import { IncidentModal } from './components/IncidentModal';
import { ReportModal } from './components/ReportModal';
import { DatabaseTab } from './components/DatabaseTab';
import { SecurityTab } from './components/SecurityTab';
import { IncidentsListTab } from './components/IncidentsListTab';

export function App() {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [activeTab, setActiveTab] = useState<'map' | 'incidents' | 'database' | 'security' | 'analytics'>('map');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | 'ALL'>('ALL');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Fetch initial incidents
  useEffect(() => {
    async function loadData() {
      const data = await fetchIncidents();
      if (data && data.length > 0) {
        setIncidents(data);
      }
    }
    loadData();
  }, []);

  // Filtered incidents based on search and category
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchesCategory = selectedCategory === 'ALL' || inc.category === selectedCategory;
      const matchesSearch =
        searchTerm === '' ||
        inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.entities_involved.some((e) => e.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [incidents, selectedCategory, searchTerm]);

  // Telemetry metrics
  const metrics = useMemo(() => computeMetrics(filteredIncidents), [filteredIncidents]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-space)' }}>
      {/* 1. Left Vertical Dock */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
        isSupabaseConnected={isSupabaseConfigured}
      />

      {/* 2. Top Header Navigation */}
      <Navbar
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* 3. Central Map Visualization (3D Globe or 2D Flat Map) */}
      <main style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
        {viewMode === '3D' ? (
          <Globe3D
            incidents={filteredIncidents}
            onSelectIncident={setSelectedIncident}
            selectedIncident={selectedIncident}
          />
        ) : (
          <Map2D
            incidents={filteredIncidents}
            onSelectIncident={setSelectedIncident}
            selectedIncident={selectedIncident}
          />
        )}
      </main>

      {/* 4. Telemetry Glass HUD Overlays (Visible on map mode) */}
      {activeTab === 'map' && (
        <TelemetryHUD
          metrics={metrics}
          incidents={filteredIncidents}
          onSelectIncident={setSelectedIncident}
          selectedIncident={selectedIncident}
        />
      )}

      {/* 5. Incidents Catalog Tab */}
      {activeTab === 'incidents' && (
        <IncidentsListTab
          incidents={incidents}
          onSelectIncident={(inc) => {
            setSelectedIncident(inc);
            setActiveTab('map');
          }}
          onClose={() => setActiveTab('map')}
        />
      )}

      {/* 6. Database / Sources Tab */}
      {activeTab === 'database' && (
        <DatabaseTab onClose={() => setActiveTab('map')} />
      )}

      {/* 7. Security Architecture Tab */}
      {activeTab === 'security' && (
        <SecurityTab onClose={() => setActiveTab('map')} />
      )}

      {/* 8. Incident Dossier Inspection Modal */}
      <IncidentModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />

      {/* 9. Report / Submit Incident Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onIncidentSubmitted={async () => {
          const fresh = await fetchIncidents();
          setIncidents(fresh);
        }}
      />
    </div>
  );
}

export default App;
