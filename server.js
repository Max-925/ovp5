const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/submit-telemetry', (req, res) => {
    const { operatorName, reportDate, energyGenerated, weatherCondition, notes } = req.body;

    if (!operatorName || !reportDate || !energyGenerated || !weatherCondition) {
        return res.status(400).json({ success: false, message: "Усі обов'язкові поля мають бути заповнені." });
    }

    const parsedEnergy = parseFloat(energyGenerated);
    if (isNaN(parsedEnergy) || parsedEnergy < 0) {
        return res.status(400).json({ success: false, message: "Показник енергії повинен бути додатним числом." });
    }

    console.log('\n>>> [ОТРИМАНО НОВИЙ ЗВІТ ЕНЕРГООБ\'ЄКТА (API)] <<<');
    console.log(`Дата: ${reportDate}`);
    console.log(`Оператор: ${operatorName}`);
    console.log(`Генерація: ${parsedEnergy} МВт·год`);
    console.log(`Погода: ${weatherCondition}`);
    console.log(`Примітки: ${notes || 'відсутні'}`);
    console.log('-------------------------------------------\n');

    // Замість HTML відправляємо JSON
    res.status(200).json({
        success: true,
        message: 'Дані успішно прийнято сервером!'
    });
});

let dailyEnergy = 2800;
let currentData = { timestamp: Date.now(), power: 480, irradiance: 720, efficiency: 16.2, temperature: 44, dailyEnergy: 2800 };

function solarPower(hourDecimal) {
    if (hourDecimal < 6 || hourDecimal >= 20) return 0;
    return Math.max(0, 950 * Math.sin(Math.PI * (hourDecimal - 6) / 14));
}

function generateData() {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    const base = solarPower(hour);
    const active = base > 0;

    const power = active ? Math.max(0, base + (Math.random() - 0.5) * 80) : 0;
    if (active) dailyEnergy += power * (2 / 3600);

    currentData = {
        timestamp: Date.now(),
        power: parseFloat(power.toFixed(1)),
        irradiance: active ? parseFloat((power / 950 * 1000 + (Math.random() - 0.5) * 40).toFixed(0)) : 0,
        efficiency: active ? parseFloat((14 + Math.random() * 5).toFixed(1)) : 0,
        temperature: active ? parseFloat((35 + (power / 950) * 25 + (Math.random() - 0.5) * 3).toFixed(1)) : parseFloat((20 + Math.random() * 3).toFixed(1)),
        dailyEnergy: Math.round(dailyEnergy)
    };
}
setInterval(generateData, 2000);

app.get('/api/data/current', (req, res) => res.json(currentData));

app.get('/api/data/history', (req, res) => {
    const history = [];
    const now = Date.now();
    for (let i = 23; i >= 0; i--) {
        const ts = now - i * 3600000;
        const h = new Date(ts).getHours() + new Date(ts).getMinutes() / 60;
        const base = solarPower(h);
        const active = base > 0;
        const power = active ? Math.max(0, base + (Math.random() - 0.5) * 60) : 0;
        history.push({
            timestamp: ts,
            power: parseFloat(power.toFixed(1)),
            irradiance: active ? parseFloat((power / 950 * 1000).toFixed(0)) : 0,
            efficiency: active ? parseFloat((14 + Math.random() * 5).toFixed(1)) : 0,
            temperature: active ? parseFloat((35 + (power / 950) * 25 + (Math.random() - 0.5) * 3).toFixed(1)) : parseFloat((20 + Math.random() * 3).toFixed(1))
        });
    }
    res.json(history);
});

app.listen(PORT, () => console.log(`[СЕРВЕР] REST API запущено на http://localhost:${PORT}`));