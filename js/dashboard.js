const entries = JSON.parse(localStorage.getItem("hopeEntries")) || [];

if (entries.length === 0) {
    alert("No data available yet.");
}

const latest = entries[entries.length - 1];

if (latest) {
    document.getElementById("latestScore").innerText = latest.score.toFixed(2);

    // Phase detection
    let phaseText = "";

    if (latest.score > 5) {
        phaseText = "Accumulation Phase";
    } else if (latest.score >= 0) {
        phaseText = "Consolidation Phase";
    } else {
        phaseText = "Distribution Phase";
    }

    document.getElementById("phase").innerText = phaseText;
}

// Stability Index (volatility measure)
let scores = entries.map(e => e.score);

let stability = 0;

if (scores.length > 1) {
    let mean = scores.reduce((a, b) => a + b) / scores.length;
    let variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    stability = Math.sqrt(variance);
}

document.getElementById("stability").innerText = stability.toFixed(2);

// 7-day trend
const last7 = entries.slice(-7);

const labels = last7.map(e => e.date);
const data = last7.map(e => e.score);

const ctx = document.getElementById("trendChart");

new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Hope Score',
            data: data,
            borderColor: '#d4af37',
            backgroundColor: 'rgba(212,175,55,0.2)',
            tension: 0.3
        }]
    },
    options: {
        plugins: {
            legend: {
                labels: {
                    color: "#ffffff"
                }
            }
        },
        scales: {
            x: {
                ticks: { color: "#ffffff" }
            },
            y: {
                ticks: { color: "#ffffff" }
            }
        }
    }
});
