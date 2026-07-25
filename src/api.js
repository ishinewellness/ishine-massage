// API helper - all calls proxy through Vite dev server
const API_BASE = '/api'

async function get(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function post(endpoint, data) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  services: {
    list: (category) => get(`/services${category ? `?category=${category}` : ''}`),
    get: (id) => get(`/services/${id}`)
  },
  stores: {
    list: () => get('/stores'),
    get: (id) => get(`/stores/${id}`)
  },
  therapists: {
    list: (available) => get(`/therapists${available ? '?available=true' : ''}`),
    get: (id) => get(`/therapists/${id}`)
  },
  orders: {
    list: (phone) => get(`/orders${phone ? `?phone=${phone}` : ''}`),
    get: (id) => get(`/orders/${id}`),
    create: (data) => post('/orders', data)
  }
}
