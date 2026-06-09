import { updateChart } from './charts.js';

export function updateKPIs(data) {
    document.getElementById('val-power').textContent = data.power;
    document.getElementById('val-energy').textContent = data.dailyEnergy;
    document.getElementById('val-efficiency').textContent = data.efficiency;
    document.getElementById('val-temp').textContent = data.temperature;

    document.getElementById('status-dot').className = 'dot active';
    document.getElementById('server-status').textContent = 'Підключено';
    document.getElementById('server-status').style.color = '#27ae60';
}

export function updateHistoryUI(historyData) {
    const labels = [];
    const powerData = [];
    let tableHTML = '';

    historyData.forEach(item => {
        const timeStr = new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        labels.push(timeStr);
        powerData.push(item.power);

        tableHTML = `<tr>
            <td><strong>${timeStr}</strong></td>
            <td>${item.power}</td>
            <td>${item.irradiance}</td>
            <td>${item.temperature}</td>
            <td>${item.efficiency}</td>
        </tr>` + tableHTML;
    });

    document.getElementById('historyTableBody').innerHTML = tableHTML;
    updateChart(labels, powerData);
}

export function handleNetworkError(error) {
    console.error("Помилка зв'язку з сервером:", error);
    document.getElementById('status-dot').className = 'dot error';
    document.getElementById('server-status').textContent = 'Втрачено зв\'язок';
    document.getElementById('server-status').style.color = '#e74c3c';
}