'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { candidateAPI } from '../../../lib/api';
import { getUser, can } from '../../../lib/auth';
import StatusBadge from '../../../components/admin/StatusBadge';
import toast from 'react-hot-toast';

const fmt = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
};

export default function ApplicationsPage() {
  const user = getUser();

  const [rows,    setRows]    = useState([]);
  const [pages,   setPages]   = useState({});
  const [loading, setLoading] = useState(true);
  const [delId,   setDelId]   = useState(null);
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('');
  const [page,    setPage]    = useState(1);

  const LIMIT = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await candidateAPI.list({ page, limit: LIMIT, search, status });
      if (r?.success) { setRows(r.data || []); setPages(r.pagination || {}); }
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setDelId(id);
    try {
      const r = await candidateAPI.del(id);
      if (r?.success) { toast.success('Deleted'); load(); }
      else toast.error(r?.message || 'Failed');
    } catch { toast.error('Error'); }
    finally { setDelId(null); }
  };

  const handleExport = async () => {
    try { await candidateAPI.exportExcel(); toast.success('Exported!'); }
    catch { toast.error('Export failed'); }
  };

  const totalPages = pages.pages || 1;
  const pageNums = () => {
    const s = Math.max(1, page-1), e = Math.min(totalPages, page+1);
    const arr = [];
    for (let i = s; i <= e; i++) arr.push(i);
    return arr;
  };

  return (
    <div className="fade">
      <h1 className="page-title">All Applications</h1>

      <div className="card">
        {/* ── Filter bar ── */}
        <div className="filter-bar">
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text" className="search-input" placeholder="Search by name, passport, visa no…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <span className="filter-label">Status</span>
          <select className="sel" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Issued">Issued</option>
          </select>

          <div style={{ flex:1 }} />

          {can(user, 'canExport') && (
            <button className="btn btn-export" onClick={handleExport}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export Excel
            </button>
          )}

          {can(user, 'canAdd') && (
            <Link href="/admin/applications/edit/new" className="btn btn-primary">
              + Add New
            </Link>
          )}
        </div>

        {/* ── Table ── */}
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Application No</th>
                <th>Name</th>
                <th>Visa No</th>
                <th>Visa Type</th>
                <th>Country</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j}><div className="skel" style={{ height:11, width:'80%' }} /></td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign:'center', padding:'52px 0', color:'#9ca3af' }}>
                    <div style={{ fontSize:36, marginBottom:10 }}>📋</div>
                    <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>
                      {search || status ? 'No results found' : 'No applications yet'}
                    </div>
                    <div style={{ fontSize:13 }}>
                      {search || status ? 'Try different filters' : can(user,'canAdd') ? 'Click "Add New" to get started' : 'No records found'}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((c, idx) => (
                  <tr key={c._id}>
                    <td style={{ color:'#9ca3af', fontSize:12 }}>
                      {(page-1)*LIMIT + idx + 1}
                    </td>
                    <td>
                      <span style={{ fontFamily:'monospace', fontSize:12, color:'#1a56db', fontWeight:700 }}>
                        {c.applicationNumber}
                      </span>
                    </td>
                    <td style={{ fontWeight:500 }}>{c.fullName}</td>
                    <td style={{ fontFamily:'monospace', fontSize:12, color:'#374151' }}>{c.visaNumber || '—'}</td>
                    <td style={{ fontSize:12.5 }}>{c.visaType || '—'}</td>
                    <td style={{ fontSize:12.5 }}>{c.country}</td>
                    <td style={{ fontSize:12, color:'#6b7280' }}>{fmt(c.visaIssueDate)}</td>
                    <td style={{ fontSize:12, color:'#6b7280' }}>{fmt(c.visaExpiryDate)}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        {/* View Details — goes to Image 1 page */}
                        <Link
                          href={`/admin/applications/view/${c._id}`}
                          className="btn-view"
                          style={{ fontSize:11.5 }}
                        >
                          View
                        </Link>

                        {can(user, 'canEdit') && (
                          <Link href={`/admin/applications/edit/${c._id}`} className="btn-edit">
                            Edit
                          </Link>
                        )}

                        {can(user, 'canDelete') && (
                          <button
                            className="btn-del"
                            onClick={() => handleDelete(c._id, c.fullName)}
                            disabled={delId === c._id}
                            title="Delete"
                          >
                            {delId === c._id
                              ? <div className="spin spin-dark" style={{ width:13, height:13 }} />
                              : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                            }
                          </button>
                        )}

                        {/* PDF download for Approved/Issued */}
                        {(c.status === 'Approved' || c.status === 'Issued') && can(user, 'canDownload') && (
                          <button
                            className="btn-icon-only"
                            style={{ background:'#f0fdf4', color:'#15803d', border:'1px solid #bbf7d0', borderRadius:5, padding:'4px 6px' }}
                            title="Download Visa PDF"
                            onClick={async () => {
                              try { await candidateAPI.downloadPdf(c._id, c.applicationNumber); }
                              catch { toast.error('PDF not available yet.'); }
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="pagination">
          <span style={{ fontSize:13, color:'#6b7280' }}>
            {pages.total > 0
              ? `Showing ${(page-1)*LIMIT+1}–${Math.min(page*LIMIT, pages.total)} of ${pages.total}`
              : 'No records'
            }
          </span>
          <div className="pg-btns">
            <button className="pg-prev-next" onClick={() => setPage(p=>p-1)} disabled={page===1||loading}>
              Previous
            </button>
            {pageNums().map(n => (
              <button key={n} className={`pg-btn ${n===page?'active':''}`} onClick={() => setPage(n)}>
                {n}
              </button>
            ))}
            <button className="pg-prev-next" onClick={() => setPage(p=>p+1)} disabled={page===totalPages||loading}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}