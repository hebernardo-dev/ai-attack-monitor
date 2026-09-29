import { createClient } from '@supabase/supabase-js';
import type { Incident } from '../types';
import { INITIAL_INCIDENTS } from '../data/mockIncidents';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function fetchIncidents(): Promise<Incident[]> {
  if (!supabase) {
    return INITIAL_INCIDENTS;
  }

  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('date', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Supabase query returned empty or error, using local dataset:', error?.message);
      return INITIAL_INCIDENTS;
    }

    return data as Incident[];
  } catch (err) {
    console.error('Failed to fetch from Supabase, fallback to local data:', err);
    return INITIAL_INCIDENTS;
  }
}
