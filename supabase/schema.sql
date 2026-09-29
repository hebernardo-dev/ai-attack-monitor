-- ====================================================================
-- AIAttackMonitor - Supabase Database Schema & Security Configuration
-- ====================================================================

-- 1. Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela principal de Incidentes
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices para performance ultra-rápida no mapa e filtros
CREATE INDEX IF NOT EXISTS idx_incidents_date ON public.incidents (date DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON public.incidents (severity);
CREATE INDEX IF NOT EXISTS idx_incidents_category ON public.incidents (category);
CREATE INDEX IF NOT EXISTS idx_incidents_year ON public.incidents (year);
CREATE INDEX IF NOT EXISTS idx_incidents_geo ON public.incidents (lat, lng);

-- ====================================================================
-- CAMADA DE SEGURANÇA CONTRA ATAQUES (ROW LEVEL SECURITY - RLS)
-- ====================================================================

-- Ativar RLS rigoroso
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Regra 1: Qualquer visitante anônimo pode apenas LER incidentes verificados
CREATE POLICY "Allow public read access for verified incidents" 
ON public.incidents 
FOR SELECT 
TO anon, authenticated
USING (verified = true);

-- Regra 2: Submissões da comunidade entram como NÃO VERIFICADAS (pendentes)
CREATE POLICY "Allow public submit incidents" 
ON public.incidents 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (verified = false);

-- Regra 3: Apenas a chave de serviço (service_role) usada em scrapers/Edge Functions pode atualizar ou deletar
CREATE POLICY "Service Role Full Administration" 
ON public.incidents 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 4. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_incidents_modtime
BEFORE UPDATE ON public.incidents
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
