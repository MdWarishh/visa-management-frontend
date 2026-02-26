// ── Centralized API ───────────────────────────────────
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const hdrs = (extra = {}) => {
  const h = { 'Content-Type': 'application/json', ...extra };
  const t = getToken();
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
};

const fileHdrs = () => {
  const h = {};
  const t = getToken();
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
};

const on401 = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

const req = async (url, opts = {}) => {
  const r = await fetch(url, { ...opts, credentials: 'include' });
  if (r.status === 401) { on401(); return null; }
  return r;
};

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: async (email, password) => {
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    return r.json();
  },
  logout: async () => {
    await req('/api/auth/logout', { method: 'POST', headers: hdrs() });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  me: async () => {
    const r = await req('/api/auth/me', { headers: hdrs() });
    if (!r || !r.ok) return null;
    return r.json();
  },
};

// ── Super Admin ───────────────────────────────────────
export const superAdminAPI = {
  stats: async () => {
    const r = await req('/api/superadmin/stats', { headers: hdrs() });
    return r?.json();
  },
  getAdmins: async ({ page = 1, limit = 20, search = '', isActive = '' } = {}) => {
    const q = new URLSearchParams({ page, limit });
    if (search)   q.set('search', search);
    if (isActive !== '') q.set('isActive', isActive);
    const r = await req(`/api/superadmin/admins?${q}`, { headers: hdrs() });
    return r?.json();
  },
  getAdmin: async (id) => {
    const r = await req(`/api/superadmin/admins/${id}`, { headers: hdrs() });
    return r?.json();
  },
  createAdmin: async (data) => {
    const r = await req('/api/superadmin/admins', {
      method: 'POST', headers: hdrs(), body: JSON.stringify(data),
    });
    return r?.json();
  },
  updateAdmin: async (id, data) => {
    const r = await req(`/api/superadmin/admins/${id}`, {
      method: 'PUT', headers: hdrs(), body: JSON.stringify(data),
    });
    return r?.json();
  },
  toggleAdmin: async (id) => {
    const r = await req(`/api/superadmin/admins/${id}/toggle`, {
      method: 'PATCH', headers: hdrs(),
    });
    return r?.json();
  },
};

// ── Admin → Users ─────────────────────────────────────
export const userAPI = {
  getAll: async () => {
    const r = await req('/api/users', { headers: hdrs() });
    return r?.json();
  },
  create: async (data) => {
    const r = await req('/api/users', {
      method: 'POST', headers: hdrs(), body: JSON.stringify(data),
    });
    return r?.json();
  },
  update: async (id, data) => {
    const r = await req(`/api/users/${id}`, {
      method: 'PUT', headers: hdrs(), body: JSON.stringify(data),
    });
    return r?.json();
  },
  delete: async (id) => {
    const r = await req(`/api/users/${id}`, {
      method: 'DELETE', headers: hdrs(),
    });
    return r?.json();
  },
};

// ── Candidates ────────────────────────────────────────
export const candidateAPI = {
  stats: async () => {
    const r = await req('/api/candidates/stats', { headers: hdrs() });
    return r?.json();
  },
  list: async ({ page = 1, limit = 10, search = '', status = '' } = {}) => {
    const q = new URLSearchParams({ page, limit });
    if (search) q.set('search', search);
    if (status) q.set('status', status);
    const r = await req(`/api/candidates?${q}`, { headers: hdrs() });
    return r?.json();
  },
  get: async (id) => {
    const r = await req(`/api/candidates/${id}`, { headers: hdrs() });
    return r?.json();
  },
  create: async (fd) => {
    const r = await req('/api/candidates', { method: 'POST', headers: fileHdrs(), body: fd });
    return r?.json();
  },
  update: async (id, fd) => {
    const r = await req(`/api/candidates/${id}`, { method: 'PUT', headers: fileHdrs(), body: fd });
    return r?.json();
  },
  del: async (id) => {
    const r = await req(`/api/candidates/${id}`, { method: 'DELETE', headers: hdrs() });
    return r?.json();
  },
  exportExcel: async () => {
    const r = await fetch('/api/candidates/export/excel', { headers: fileHdrs(), credentials: 'include' });
    if (!r.ok) throw new Error('Export failed');
    const blob = await r.blob();
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `candidates-${new Date().toISOString().slice(0,10)}.xlsx`,
    });
    document.body.appendChild(a); a.click(); a.remove();
  },
  downloadPdf: async (id, appNo) => {
    const r = await fetch(`/api/candidates/admin/download/${id}`, { headers: fileHdrs(), credentials: 'include' });
    if (!r.ok) throw new Error('Download failed');
    const blob = await r.blob();
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `Visa-${appNo}.pdf`,
    });
    document.body.appendChild(a); a.click(); a.remove();
  },
  monthly: async () => {
    const r = await candidateAPI.list({ limit: 2000 });
    if (!r?.data) return [];
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const map = {}; MONTHS.forEach(m => { map[m] = 0; });
    r.data.forEach(c => { map[MONTHS[new Date(c.applicationDate || c.createdAt).getMonth()]]++; });
    return MONTHS.map(m => ({ month: m, count: map[m] }));
  },
  track: async (data) => {
    const r = await fetch('/api/candidates/public/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return r.json();
  },
};
