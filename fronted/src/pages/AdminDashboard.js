import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, assigned: 0, collected: 0, resolved: 0 });
  const [msg, setMsg] = useState('');
  const [imgModal, setImgModal] = useState(null); // for full screen photo

  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => {
    fetchReports();
    fetchDrivers();
  }, []);

  const fetchReports = async () => {
    const { data } = await axios.get('/api/reports', { headers });
    setReports(data);
    setStats({
      total:     data.length,
      pending:   data.filter(r => r.status === 'pending').length,
      assigned:  data.filter(r => r.status === 'assigned').length,
      collected: data.filter(r => r.status === 'collected').length,
      resolved:  data.filter(r => r.status === 'resolved').length,
    });
  };

  const fetchDrivers = async () => {
    try {
      const { data } = await axios.get('/api/users/drivers', { headers });
      setDrivers(data);
    } catch { setDrivers([]); }
  };

  const assignDriver = async (reportId, driverId) => {
    try {
      await axios.patch(`/api/reports/${reportId}/status`, {
        status: 'assigned', assignedDriver: driverId
      }, { headers });
      setMsg('✅ Driver assigned successfully!');
      fetchReports();
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('❌ Failed to assign driver.'); }
  };

  const updateStatus = async (reportId, status) => {
    try {
      await axios.patch(`/api/reports/${reportId}/status`, { status }, { headers });
      setMsg(`✅ Status updated to "${status}"`);
      fetchReports();
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('❌ Failed to update status.'); }
  };

  const deleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await axios.delete(`/api/reports/${reportId}`, { headers });
      setMsg('✅ Report deleted.');
      fetchReports();
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('❌ Failed to delete report.'); }
  };

  const statusColors = {
    pending:   '#EF9F27',
    assigned:  '#378ADD',
    collected: '#1D9E75',
    resolved:  '#888'
  };

  const wasteColors = {
    general:    '#888',
    recyclable: '#1D9E75',
    hazardous:  '#E24B4A',
    organic:    '#639922'
  };

  if (user.role !== 'admin') {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2 style={{ color: '#E24B4A' }}>Access Denied</h2>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 24px' }}>

      {/* Header */}
      <h1 style={{ fontFamily: 'Poppins', fontSize: 26, marginBottom: 6 }}>Admin Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Manage all city waste reports and drivers</p>

      {/* Alert */}
      {msg && (
        <div className={`alert ${msg.includes('❌') ? 'alert-error' : 'alert-success'}`}
          style={{ marginBottom: 20 }}>
          {msg}
          <button className="alert-close" onClick={() => setMsg('')}>✕</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        {[
          { label: 'Total Reports', value: stats.total,     color: '#534AB7' },
          { label: 'Pending',       value: stats.pending,   color: '#EF9F27' },
          { label: 'Assigned',      value: stats.assigned,  color: '#378ADD' },
          { label: 'Collected',     value: stats.collected, color: '#1D9E75' },
          { label: 'Resolved',      value: stats.resolved,  color: '#888'    },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
            <div className="stat-card-val" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Reports Table */}
      <div className="section-title" style={{ marginBottom: 16 }}>
        All Reports
        <span className="section-badge">{reports.length} total</span>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p className="empty-title">No reports yet</p>
          <p className="empty-desc">Reports submitted by citizens will appear here.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {['Photo', 'Title', 'Citizen', 'Location', 'Type', 'Status', 'Assign Driver', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={r._id}>

                  {/* Photo column */}
                  <td>
                    {r.photo?.url ? (
                      <img
                        src={r.photo.url}
                        alt="waste"
                        onClick={() => setImgModal(r.photo.url)}
                        style={{
                          width: 56, height: 56,
                          objectFit: 'cover',
                          borderRadius: 8,
                          cursor: 'pointer',
                          border: '1px solid var(--border)',
                          transition: 'transform 0.2s'
                        }}
                        onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                        onMouseOut={e  => e.target.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{
                        width: 56, height: 56,
                        borderRadius: 8,
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20
                      }}>📷</div>
                    )}
                  </td>

                  {/* Title */}
                  <td style={{ fontWeight: 500, fontSize: 14, maxWidth: 160 }}>{r.title}</td>

                  {/* Citizen */}
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {r.citizen?.name || 'N/A'}
                  </td>

                  {/* Location */}
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 120 }}>
                    📍 {r.location?.address}
                  </td>

                  {/* Waste Type */}
                  <td>
                    <span style={{
                      background: wasteColors[r.wasteType] + '22',
                      color: wasteColors[r.wasteType],
                      fontSize: 12, padding: '3px 10px', borderRadius: 20
                    }}>
                      {r.wasteType}
                    </span>
                  </td>

                  {/* Status dropdown */}
                  <td>
                    <select
                      value={r.status}
                      onChange={e => updateStatus(r._id, e.target.value)}
                      className="table-select"
                      style={{ color: statusColors[r.status], borderColor: statusColors[r.status] }}>
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="collected">Collected</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>

                  {/* Assign Driver */}
                  <td>
                    {drivers.length > 0 ? (
                      <select
                        className="table-select"
                        defaultValue={r.assignedDriver?._id || ''}
                        onChange={e => e.target.value && assignDriver(r._id, e.target.value)}>
                        <option value="">Select driver</option>
                        {drivers.map(d => (
                          <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={{ fontSize: 12, color: '#aaa' }}>No drivers</span>
                    )}
                  </td>

                  {/* Delete */}
                  <td>
                    <button
                      onClick={() => deleteReport(r._id)}
                      className="btn btn-danger"
                      style={{ padding: '5px 12px', fontSize: 13 }}>
                      🗑️ Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Full screen image modal */}
      {imgModal && (
        <div
          onClick={() => setImgModal(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'zoom-out'
          }}>
          <img
            src={imgModal}
            alt="full"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 14,
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
            }} />
          <button
            onClick={() => setImgModal(null)}
            style={{
              position: 'absolute', top: 20, right: 24,
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff', width: 42, height: 42,
              borderRadius: '50%', fontSize: 18,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>✕</button>
          <p style={{
            position: 'absolute', bottom: 20,
            color: 'rgba(255,255,255,0.6)', fontSize: 13
          }}>Click anywhere to close</p>
        </div>
      )}

    </div>
  );
}