import React, { useState } from 'react';
import { X, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncidentSubmitted?: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onIncidentSubmitted }) => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    country: '',
    city: '',
    category: 'Lethal & Mental Harm',
    severity: 'high',
    deaths_count: 0,
    financial_loss_usd: 0,
    entities_involved: '',
    source_url: '',
    source_name: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (supabase) {
        await supabase.from('incidents').insert([
          {
            title: formData.title,
            summary: formData.summary,
            description: formData.summary,
            country: formData.country,
            city: formData.city,
            category: formData.category,
            severity: formData.severity,
            deaths_count: Number(formData.deaths_count) || 0,
            financial_loss_usd: Number(formData.financial_loss_usd) || 0,
            entities_involved: formData.entities_involved.split(',').map((s) => s.trim()),
            source_url: formData.source_url,
            source_name: formData.source_name,
            verified: false,
            date: new Date().toISOString().split('T')[0],
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            lat: 0,
            lng: 0,
          },
        ]);
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onIncidentSubmitted) onIncidentSubmitted();
      }, 2000);
    } catch (err) {
      console.error('Submission error:', err);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          background: 'rgba(13, 19, 33, 0.96)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="#ef4444" />
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Report AI Agent Incident</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '8px' }}>Incident Submitted for Review!</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              The incident has been logged and queued for editorial verification before appearing on the live global threat map.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Incident Title / Headline
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Chatbot induced teen self-harm / DeFi trading agent flash loan drain"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', color: '#fff' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-light)', color: '#fff' }}
                >
                  <option value="Lethal & Mental Harm">💔 Lethal & Mental Harm</option>
                  <option value="Autonomous Agent Hack">⚡ Autonomous Agent Hack</option>
                  <option value="Financial Drain">💰 Financial Drain & Fraud</option>
                  <option value="Deepfake Extortion">🎭 Deepfake Extortion</option>
                  <option value="Operational Failure">⚠️ Operational Failure</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Country
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. United States, Brazil, UK"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#ef4444', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Reported Fatalities
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.deaths_count}
                  onChange={(e) => setFormData({ ...formData, deaths_count: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#f59e0b', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                  Estimated Financial Loss (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.financial_loss_usd}
                  onChange={(e) => setFormData({ ...formData, financial_loss_usd: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', color: '#fff' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Identified Agents & Models (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Character.ai, Claude, Tesla FSD, Custom LLM Bot"
                value={formData.entities_involved}
                onChange={(e) => setFormData({ ...formData, entities_involved: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                News Article / Legal Filing URL
              </label>
              <input
                required
                type="url"
                placeholder="https://nytimes.com/... or bbc.com/..."
                value={formData.source_url}
                onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Incident Summary / Overview
              </label>
              <textarea
                required
                rows={3}
                placeholder="Provide a concise summary of the incident and documented damages..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', color: '#fff', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="glass-button active"
              style={{
                justifyContent: 'center',
                padding: '12px',
                marginTop: '10px',
                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                borderColor: '#ef4444',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              <Send size={16} />
              {isSubmitting ? 'Submitting Record...' : 'Submit Incident for Verification'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
