async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Request failed');
  return body;
}

export const agroApi = {
  me: () => Promise.resolve({ full_name: 'AgroPredict Admin', role: 'admin' }),
  locationKnowledge: () => request('/location-knowledge'),
  farms: {
    list: () => request('/farms'),
    create: (data) => request('/farms', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/farms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/farms/${id}`, { method: 'DELETE' }),
  },
  cropPredictions: {
    list: () => request('/predictions/crop'),
    create: ({ farm_id, season }) => request('/predictions/crop', {
      method: 'POST',
      body: JSON.stringify({ farm_id, season }),
    }),
    delete: (id) => request(`/predictions/crop/${id}`, { method: 'DELETE' }),
  },
  pricePredictions: {
    list: () => request('/predictions/price'),
    create: (data) => request('/predictions/price', { method: 'POST', body: JSON.stringify(data) }),
  },
  chat: (data) => request('/chat', { method: 'POST', body: JSON.stringify(data) }),
  admin: () => request('/admin/summary', {
    headers: { 'x-admin-key': localStorage.getItem('agropredict_admin_key') || '' },
  }),
};
