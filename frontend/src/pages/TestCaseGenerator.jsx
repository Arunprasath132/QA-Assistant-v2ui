import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { FlaskConical, Upload, Download, FileSpreadsheet, Pencil, Check, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Home.css';


const TYPES = [
  { id: 'positive', label: 'Positive' },
  { id: 'negative', label: 'Negative' },
  { id: 'validation', label: 'Validation' },
  { id: 'boundary', label: 'Boundary' },
];

export default function TestCaseGenerator({ project }) {
  const { api } = useAuth();
  const [form, setForm] = useState({ module: '', feature: '', user_story: '' });
  const [selectedTypes, setSelectedTypes] = useState(['positive', 'negative', 'validation', 'boundary']);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('generate');
  const [editingId, setEditingId] = useState(null);
  const [editBuf, setEditBuf] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [continuePrompt, setContinuePrompt] = useState(null); // { currentCounter, nextId }
  const [askCustomStart, setAskCustomStart] = useState(false);
  const [customStartValue, setCustomStartValue] = useState('');
  const fileRef = useRef();

  const toggleType = (t) => setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const runGenerate = async (customStartId) => {
    setLoading(true);
    try {
      const res = await api.post('/testcases/generate', {
        project_id: project.id,
        ...form,
        test_types: selectedTypes,
        custom_start_id: customStartId ?? null,
      });
      setTestCases(res.data.test_cases);
      toast.success(`${res.data.count} test cases generated (TC-${String(res.data.starting_test_case_id).padStart(3, '0')} to TC-${String(res.data.ending_test_case_id).padStart(3, '0')})`);
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const generate = async () => {
    if (!project) { toast.error('Open a project first'); return; }
    if (!form.module || !form.feature) { toast.error('Module and Feature are required'); return; }
    if (!selectedTypes.length) { toast.error('Select at least one test type'); return; }

    try {
      const check = await api.get(`/testcases/continue-check/${project.id}`);
      if (check.data.current_counter > 0) {
        setContinuePrompt(check.data);
        return;
      }
      await runGenerate(null);
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Could not check test case numbering');
    }
  };

  const exportFile = async (format) => {
    if (!testCases.length) { toast.error('No test cases to export'); return; }
    try {
      const res = await api.post(`/testcases/export/${format}`, testCases, { responseType: 'blob' });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = `test_cases.${format === 'excel' ? 'xlsx' : 'csv'}`; a.click();
      toast.success('Downloaded!');
    } catch { toast.error('Export failed'); }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/testcases/upload', formData);
      setTestCases(res.data.test_cases);
      toast.success(`${res.data.count} test cases imported!`);
    } catch (e) { toast.error(e.response?.data?.detail || 'Upload failed'); }
  };

  const startEdit = (tc) => { setEditingId(tc.id); setEditBuf({ ...tc }); };
  const saveEdit = () => {
    setTestCases(prev => prev.map(tc => tc.id === editingId ? { ...editBuf } : tc));
    setEditingId(null);
  };

  const badgeClass = (v) => {
    const map = { positive: 'badge-positive', negative: 'badge-negative', validation: 'badge-validation', boundary: 'badge-boundary', High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
    return `badge ${map[v] || 'badge-low'}`;
  };

  return (
    <>
    {continuePrompt && (
      <div className="modal-overlay">
        <div className="modal-card">
          <h2>Continue test case numbering?</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            You have previously generated test cases up to TC-{String(continuePrompt.current_counter).padStart(3, '0')}.
            Would you like to continue from TC-{String(continuePrompt.next_id_if_yes).padStart(3, '0')}?
          </p>
          <div className="modal-actions">
            <button onClick={() => { setContinuePrompt(null); setAskCustomStart(true); }}>No, custom start</button>
            <button className="primary" onClick={() => { setContinuePrompt(null); runGenerate(null); }}>
              Yes, continue
            </button>
          </div>
        </div>
      </div>
    )}
    {askCustomStart && (
      <div className="modal-overlay">
        <div className="modal-card">
          <h2>Custom starting Test Case ID</h2>
          <label>Enter the Test Case number to start from</label>
          <input
            type="number"
            min="1"
            autoFocus
            value={customStartValue}
            onChange={(e) => setCustomStartValue(e.target.value)}
            placeholder="e.g. 25"
          />
          <div className="modal-actions">
            <button onClick={() => { setAskCustomStart(false); setCustomStartValue(''); }}>Cancel</button>
            <button
              className="primary"
              onClick={() => {
                const n = parseInt(customStartValue, 10);
                if (!n || n <= 0) { toast.error('Enter a valid number greater than zero'); return; }
                setAskCustomStart(false);
                setCustomStartValue('');
                runGenerate(n);
              }}
            >
              Start Generation
            </button>
          </div>
        </div>
      </div>
    )}
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <FlaskConical size={20} color="#1a56db" />
          <h1>Test Case Generator</h1>
        </div>
        <p className="page-subtitle">Generate comprehensive test cases from feature descriptions.</p>
      </div>

      <div className="tab-bar">
        {['generate', 'upload'].map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'generate' ? <><Sparkles size={13} style={{ marginRight: 5 }} />Generate</> : <><Upload size={13} style={{ marginRight: 5 }} />Upload File</>}
          </button>
        ))}
      </div>

      {tab === 'generate' && (
        <div className="card">
          <div className="form-row">
            <div className="form-group">
              <label>Module Name *</label>
              <input type="text" placeholder="e.g. User Authentication" value={form.module}
                onChange={e => setForm(p => ({ ...p, module: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Feature *</label>
              <input type="text" placeholder="e.g. Login with email & password" value={form.feature}
                onChange={e => setForm(p => ({ ...p, feature: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label>User Story (optional)</label>
            <textarea placeholder="As a user, I want to..." value={form.user_story}
              onChange={e => setForm(p => ({ ...p, user_story: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Test Types</label>
            <div className="checkbox-group">
              {TYPES.map(t => (
                <label key={t.id} className="checkbox-item">
                  <input type="checkbox" checked={selectedTypes.includes(t.id)} onChange={() => toggleType(t.id)} />
                  {t.label}
                </label>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading ? <><div className="spinner" />Generating…</> : <><Sparkles size={15} />Generate Test Cases</>}
          </button>
        </div>
      )}

      {tab === 'upload' && (
        <div className="card">
          <div className={`upload-zone ${dragOver ? 'active' : ''}`}
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files[0]); }}>
            <FileSpreadsheet size={32} color="#1a56db" style={{ opacity: 0.6 }} />
            <p><strong>Click to upload</strong> or drag & drop</p>
            <p>Supports .xlsx and .csv files</p>
            <p style={{ fontSize: 11, color: '#aaa', marginTop: 8 }}>Required columns: title, steps, expected</p>
          </div>
          <input ref={fileRef} type="file" accept=".xlsx,.csv" style={{ display: 'none' }}
            onChange={e => handleUpload(e.target.files[0])} />
        </div>
      )}

      {testCases.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="section-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f0eff8', margin: 0 }}>
            <div>
              <h2 style={{ margin: 0 }}>Test Cases</h2>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{testCases.length} test cases</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => exportFile('csv')}><Download size={13} /> CSV</button>
              <button className="btn btn-secondary btn-sm" onClick={() => exportFile('excel')}><Download size={13} /> Excel</button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="tc-table">
              <thead>
                <tr><th>ID</th><th>Title</th><th>Type</th><th>Steps</th><th>Expected</th><th>Priority</th><th></th></tr>
              </thead>
              <tbody>
                {testCases.map(tc => (
                  <tr key={tc.id}>
                    {editingId === tc.id ? (
                      <>
                        <td><code style={{ fontSize: 11 }}>{tc.id}</code></td>
                        <td><input value={editBuf.title} onChange={e => setEditBuf(p => ({ ...p, title: e.target.value }))} style={{ width: '100%', padding: '4px 6px', fontSize: 12 }} /></td>
                        <td><span className={badgeClass(tc.type)}>{tc.type}</span></td>
                        <td><textarea value={editBuf.steps} onChange={e => setEditBuf(p => ({ ...p, steps: e.target.value }))} style={{ width: '100%', fontSize: 11, minHeight: 60 }} /></td>
                        <td><input value={editBuf.expected} onChange={e => setEditBuf(p => ({ ...p, expected: e.target.value }))} style={{ width: '100%', padding: '4px 6px', fontSize: 12 }} /></td>
                        <td><span className={badgeClass(editBuf.priority)}>{editBuf.priority}</span></td>
                        <td>
                          <button className="btn btn-sm" style={{ color: '#1D9E75', background: 'none', border: 'none' }} onClick={saveEdit}><Check size={14} /></button>
                          <button className="btn btn-sm" style={{ color: '#aaa', background: 'none', border: 'none' }} onClick={() => setEditingId(null)}><X size={14} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td><code style={{ fontSize: 11, color: '#1a56db' }}>{tc.id}</code></td>
                        <td style={{ maxWidth: 220 }}>{tc.title}</td>
                        <td><span className={badgeClass(tc.type)}>{tc.type}</span></td>
                        <td style={{ maxWidth: 200, fontSize: 12, color: '#555', whiteSpace: 'pre-line' }}>{tc.steps}</td>
                        <td style={{ maxWidth: 180, fontSize: 12 }}>{tc.expected}</td>
                        <td><span className={badgeClass(tc.priority)}>{tc.priority}</span></td>
                        <td><button className="btn btn-sm" style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }} onClick={() => startEdit(tc)}><Pencil size={13} /></button></td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
