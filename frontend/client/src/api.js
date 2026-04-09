const API_URL = import.meta.env.VITE_API_URL;

export async function apiCall(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) throw new Error("API Error");
  return res.json();
}
