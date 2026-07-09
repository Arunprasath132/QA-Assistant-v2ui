import React from 'react';
import { FlaskConical, Code2, Bug, Camera, ArrowRight } from 'lucide-react';

const features = [
  { id: 'testcases',  icon: FlaskConical, color: '#1a56db', bg: '#eff6ff',  border: '#bfdbfe', title: 'Test Case Generator',       desc: 'Generate positive, negative, validation & boundary test cases from module descriptions.', actions: ['Import Excel/CSV','Export Excel/CSV','Edit & review'] },
  { id: 'screenshot', icon: Camera,       color: '#7c3aed', bg: '#f5f3ff',  border: '#ddd6fe', title: 'Screenshot → Test Cases',    desc: 'Upload any UI screenshot and instantly generate test cases from what\'s visible on screen.', actions: ['Upload PNG/JPG','Auto analysis','Export CSV'] },
  { id: 'automation', icon: Code2,        color: '#0284c7', bg: '#e0f2fe',  border: '#bae6fd', title: 'Automation Scripts',         desc: 'Convert your test cases into ready-to-run Playwright or Selenium JavaScript scripts.', actions: ['Playwright JS','Selenium JS','Download ZIP'] },
  { id: 'bugreports', icon: Bug,          color: '#1344b4', bg: '#eff6ff',  border: '#93c5fd', title: 'Bug Report Generator',       desc: 'Create standardized bug reports with severity, priority, and reproduction steps.', actions: ['Auto severity','Steps to reproduce','Download'] },
];

const stats = [
  { label: 'Manual effort saved', value: '70%+' },
  { label: 'Script gen speed',    value: '30s'  },
  { label: 'Frameworks',          value: '2'    },
  { label: 'Export formats',      value: '2'    },
];

export default function Dashboard({ onNavigate }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1a56db 0%,#3b82f6 100%)', borderRadius: 14, padding: '26px 28px', marginBottom: 20, color: 'white', boxShadow: '0 6px 20px rgba(26,86,219,0.25)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 150, height: 150, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Testing Tool </div>
        <h1 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.5px' }}>ABI-TECH QAENGINE</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, maxWidth: 480 }}>Generate test cases, automation scripts, and bug reports in seconds. Built for QA engineers who want to move faster.</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div style={{ display: 'grid', gap: 12 }}>
        {features.map(f => {
          const Icon = f.icon;
          return (
            <div key={f.id} className="card" style={{ display: 'flex', gap: 16, padding: '16px 20px', borderLeft: `4px solid ${f.color}`, cursor: 'pointer', transition: 'box-shadow 0.15s, transform 0.15s' }}
              onClick={() => onNavigate(f.id)}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,86,219,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 10, background: f.bg, border: `1px solid ${f.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={19} color={f.color} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ marginBottom: 3 }}>{f.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 9 }}>{f.desc}</p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                  {f.actions.map(a => (
                    <span key={a} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: f.bg, color: f.color, border: `1px solid ${f.border}`, fontWeight: 600 }}>{a}</span>
                  ))}
                </div>
                <button className="btn btn-primary btn-sm" style={{ background: f.color }} onClick={e => { e.stopPropagation(); onNavigate(f.id); }}>
                  Open <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase 2 */}
      <div style={{ marginTop: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Coming in Phase 2</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }}>URL-based generation · API test cases · Postman collections · Jira integration</div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 10px', borderRadius: 20, fontWeight: 700, whiteSpace: 'nowrap' }}>Roadmap →</div>
      </div>
    </div>
  );
}
