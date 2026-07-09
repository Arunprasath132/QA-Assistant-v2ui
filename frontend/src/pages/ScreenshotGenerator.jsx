import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Camera, Upload, Download, Sparkles, X, Pencil, Check } from 'lucide-react';


export default function ScreenshotGenerator({ project }) {
  const { api } = useAuth();
  const [image, setImage]         = useState(null);
  const [preview, setPreview]     = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editBuf, setEditBuf]     = useState({});
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, etc.)');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setTestCases([]);
  };

  const generate = async () => {
    if (!project) { toast.error('Open a project first'); return; }
    if (!image) { toast.error('Please upload a screenshot first'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('project_id', project.id);
      const res = await api.post('/testcases/from-screenshot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTestCases(res.data.test_cases);
      toast.success(`${res.data.count} test cases generated from screenshot!`);
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Generation failed');
    } finally { setLoading(false); }
  };

  const exportCSV = () => {
    if (!testCases.length) return;
    const headers = ['ID','Title','Type','Steps','Expected Result','Priority'];
    const rows = testCases.map(tc => [tc.id, tc.title, tc.type, tc.steps, tc.expected, tc.priority].map(v => `"${v}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'screenshot_test_cases.csv'; a.click();
    toast.success('Downloaded!');
  };

  const startEdit = (tc) => { setEditingId(tc.id); setEditBuf({ ...tc }); };
  const saveEdit  = () => { setTestCases(prev => prev.map(tc => tc.id === editingId ? { ...editBuf } : tc)); setEditingId(null); };

  const badgeClass = (v) => {
    const map = { positive:'badge-positive', negative:'badge-negative', validation:'badge-validation', boundary:'badge-boundary', High:'badge-high', Medium:'badge-medium', Low:'badge-low' };
    return `badge ${map[v] || 'badge-low'}`;
  };

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Camera size={20} color="var(--primary)" />
          <h1>Screenshot → Test Cases</h1>
        </div>
        <p className="page-subtitle">Upload a UI screenshot and generate test cases automatically.</p>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 12 }}>Upload UI Screenshot</h2>
        {!preview ? (
          <div
            className={`upload-zone ${dragOver ? 'active' : ''}`}
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          >
            <Camera size={32} color="var(--primary)" style={{ opacity: 0.5 }} />
            <p><strong>Click to upload</strong> or drag & drop</p>
            <p>PNG, JPG, JPEG, WEBP supported</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Upload any UI screen — login page, form, dashboard, etc.</p>
          </div>
        ) : (
          <div className="screenshot-preview">
            <img src={preview} alt="UI Screenshot" />
            <span className="screenshot-badge">📸 Ready</span>
            <button onClick={() => { setImage(null); setPreview(null); setTestCases([]); }}
              style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={14} />
            </button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />

        {preview && (
          <div style={{ marginTop: 14 }}>
            <button className="btn btn-primary" onClick={generate} disabled={loading}>
              {loading ? <><div className="spinner" />Analyzing screenshot…</> : <><Sparkles size={15} />Generate Test Cases</>}
            </button>
            <button className="btn btn-secondary" onClick={() => fileRef.current.click()} style={{ marginLeft: 10 }}>
              <Upload size={13} /> Change Image
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {testCases.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="section-header" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', margin: 0 }}>
            <div>
              <h2 style={{ margin: 0 }}>Generated Test Cases</h2>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{testCases.length} test cases from screenshot</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={exportCSV}><Download size={13} /> Export CSV</button>
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
                        <td><code style={{ fontSize: 10, color: 'var(--primary)' }}>{tc.id}</code></td>
                        <td><input value={editBuf.title} onChange={e => setEditBuf(p => ({...p, title: e.target.value}))} style={{ width: '100%', padding: '4px 6px', fontSize: 11 }} /></td>
                        <td><span className={badgeClass(tc.type)}>{tc.type}</span></td>
                        <td><textarea value={editBuf.steps} onChange={e => setEditBuf(p => ({...p, steps: e.target.value}))} style={{ width: '100%', fontSize: 10, minHeight: 50 }} /></td>
                        <td><input value={editBuf.expected} onChange={e => setEditBuf(p => ({...p, expected: e.target.value}))} style={{ width: '100%', padding: '4px 6px', fontSize: 11 }} /></td>
                        <td><span className={badgeClass(editBuf.priority)}>{editBuf.priority}</span></td>
                        <td>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a' }} onClick={saveEdit}><Check size={13} /></button>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setEditingId(null)}><X size={13} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td><code style={{ fontSize: 10, color: 'var(--primary)' }}>{tc.id}</code></td>
                        <td style={{ maxWidth: 180, fontSize: 12 }}>{tc.title}</td>
                        <td><span className={badgeClass(tc.type)}>{tc.type}</span></td>
                        <td style={{ maxWidth: 180, fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>{tc.steps}</td>
                        <td style={{ maxWidth: 160, fontSize: 11 }}>{tc.expected}</td>
                        <td><span className={badgeClass(tc.priority)}>{tc.priority}</span></td>
                        <td><button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => startEdit(tc)}><Pencil size={12} /></button></td>
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
  );
}
