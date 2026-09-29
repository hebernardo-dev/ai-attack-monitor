export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';

export type IncidentCategory = 
  | 'Lethal & Mental Harm' 
  | 'Autonomous Agent Hack' 
  | 'Financial Drain' 
  | 'Deepfake Extortion' 
  | 'Operational Failure';

export interface Incident {
  id: string;
  title: string;
  summary: string;
  description: string;
  date: string;
  year: number;
  month: number;
  country: string;
  country_code: string;
  city?: string;
  lat: number;
  lng: number;
  severity: IncidentSeverity;
  category: IncidentCategory;
  deaths_count: number;
  financial_loss_usd: number;
  entities_involved: string[];
  target_type: 'Individuals' | 'Financial & Crypto' | 'Enterprise Infrastructure' | 'Critical Infrastructure' | 'Government';
  source_url: string;
  source_name: string;
  verified: boolean;
}

export interface MetricSummary {
  totalIncidents: number;
  incidentsYear2026: number;
  incidentsLastMonth: number;
  monthlyGrowthPercent: number;
  totalDeaths: number;
  totalFinancialLossUsd: number;
  monitoredAgentsCount: number;
  criticalSeverityPercent: number;
}
