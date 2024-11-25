// Fonction pour récupérer les informations CPU depuis le serveur
async function getCPUInfo() {
    const response = await fetch('/cpu');
    const data = await response.json();

    document.getElementById('cpu-usage').textContent = `Usage: ${data.usage.toFixed(2)}%`;
    document.getElementById('cpu-frequency').textContent = `Fréquence: ${data.frequency.toFixed(2)} MHz`;
    return data.usage;
}

// Fonction pour récupérer les informations GPU depuis le serveur
async function getGPUInfo() {
    const response = await fetch('/gpu');
    const data = await response.json();

    document.getElementById('gpu-usage').textContent = `Utilisation: ${data.usage.toFixed(2)}%`;
    document.getElementById('gpu-temp').textContent = `Température: ${data.temp.toFixed(2)}°C`;
    return data.usage;
}

// Fonction pour récupérer les informations de bande passante depuis le serveur
async function getBandwidthInfo() {
    const response = await fetch('/network');
    const data = await response.json();

    document.getElementById('bandwidth-sent').textContent = `Envoyé: ${data.sent.toFixed(2)} MB`;
    document.getElementById('bandwidth-received').textContent = `Reçu: ${data.received.toFixed(2)} MB`;
    return { sent: data.sent, received: data.received };
}

// Fonction pour mettre à jour les informations toutes les 0.5 secondes
async function updateInfo() {
    const cpuUsage = await getCPUInfo();
    const gpuUsage = await getGPUInfo();
    const { sent, received } = await getBandwidthInfo();

    updateGraph(cpuUsage, gpuUsage, sent, received);
    setTimeout(updateInfo, 500); // Mettre à jour toutes les 0.5 secondes
}

// Configuration des graphiques avec Chart.js
let cpuData = [];
let gpuData = [];
let bandwidthSentData = [];
let bandwidthReceivedData = [];

const cpuCtx = document.getElementById('cpuChart').getContext('2d');
const gpuCtx = document.getElementById('gpuChart').getContext('2d');
const bandwidthCtx = document.getElementById('bandwidthChart').getContext('2d');

// Configuration du graphique CPU
const cpuChart = new Chart(cpuCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Utilisation CPU (%)',
            data: cpuData,
            borderColor: 'rgba(148, 0, 211, 1)', // Violet
            borderWidth: 2,
            fill: false,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

// Configuration du graphique GPU
const gpuChart = new Chart(gpuCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Utilisation GPU (%)',
            data: gpuData,
            borderColor: 'rgba(138, 43, 226, 1)', // Violet clair
            borderWidth: 2,
            fill: false,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

// Configuration du graphique de bande passante
const bandwidthChart = new Chart(bandwidthCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Bande passante envoyée (MB)',
            data: bandwidthSentData,
            borderColor: 'rgba(75, 0, 130, 1)', // Indigo
            borderWidth: 2,
            fill: false,
        },
        {
            label: 'Bande passante reçue (MB)',
            data: bandwidthReceivedData,
            borderColor: 'rgba(128, 0, 128, 1)', // Violet foncé
            borderWidth: 2,
            fill: false,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            }
        }
    }
});

// Fonction pour mettre à jour les graphiques
function updateGraph(cpuUsage, gpuUsage, sent, received) {
    const time = new Date().toLocaleTimeString();

    // Mettre à jour le graphique CPU
    if (cpuData.length > 30) {
        cpuData.shift();
        cpuChart.data.labels.shift();
    }
    cpuData.push(cpuUsage);
    cpuChart.data.labels.push(time);
    cpuChart.update();

    // Mettre à jour le graphique GPU
    if (gpuData.length > 30) {
        gpuData.shift();
        gpuChart.data.labels.shift();
    }
    gpuData.push(gpuUsage);
    gpuChart.data.labels.push(time);
    gpuChart.update();

    // Mettre à jour le graphique de bande passante
    if (bandwidthSentData.length > 30) {
        bandwidthSentData.shift();
        bandwidthChart.data.labels.shift();
    }
    bandwidthSentData.push(sent);
    bandwidthReceivedData.push(received);
    bandwidthChart.data.labels.push(time);
    bandwidthChart.update();
}

// Démarre l'intervalle de mise à jour des informations
updateInfo();
