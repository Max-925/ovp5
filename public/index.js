import { fetchCurrentData, fetchHistory } from './api.js';
import { initChart } from './charts.js';
import { updateKPIs, updateHistoryUI, handleNetworkError } from './app.js';

async function refreshCurrentData() {
    try {
        const data = await fetchCurrentData();
        updateKPIs(data);
    } catch (error) {
        handleNetworkError(error);
    }
}

async function refreshHistoryData() {
    try {
        const history = await fetchHistory();
        updateHistoryUI(history);
    } catch (error) {
        handleNetworkError(error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    initChart();

    refreshCurrentData();
    refreshHistoryData();

    setInterval(refreshCurrentData, 2000);
    setInterval(refreshHistoryData, 60000);
});