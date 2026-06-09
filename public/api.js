const API_BASE = '/api';

export async function fetchCurrentData() {
    const res = await fetch(`${API_BASE}/data/current`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function fetchHistory() {
    const res = await fetch(`${API_BASE}/data/history`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}