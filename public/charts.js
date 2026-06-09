let historyChart;

export function initChart() {
    const ctx = document.getElementById('historyChart').getContext('2d');
    historyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Потужність (кВт)',
                data: [],
                borderColor: '#f1c40f',
                backgroundColor: 'rgba(241, 196, 15, 0.2)',
                borderWidth: 2, fill: true, tension: 0.3, pointRadius: 3
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}

export function updateChart(labels, powerData) {
    if (historyChart) {
        historyChart.data.labels = labels;
        historyChart.data.datasets[0].data = powerData;
        historyChart.update();
    }
}