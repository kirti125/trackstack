import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ts_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ts_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ── Project API ──────────────────────────────────────────
export const projectsApi = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  delete: (id) => api.delete(`/projects/${id}`),
  addMember: (id, email) => api.post(`/projects/${id}/members`, { email }),
}

// ── Issue API ─────────────────────────────────────────────
export const issuesApi = {
  getByProject: (projectId, params = {}) =>
    api.get('/issues', { params: { projectId, ...params } }),
  create: (data) => api.post('/issues', data),
  update: (id, data) => api.put(`/issues/${id}`, data),
  updateStatus: (id, status) => api.put(`/issues/${id}/status`, { status }),
  assign: (id, userId) => api.put(`/issues/${id}/assign`, { userId }),
  delete: (id) => api.delete(`/issues/${id}`),
}
