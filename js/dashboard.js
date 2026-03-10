You're right! Here it is:

**`js/dashboard.js`**

```javascript
// ============================================================
// HOPE ENGINE — DASHBOARD
// ============================================================

let dashChartInst = null;
let currentTF     = 7;

function setTimeframe(days, btn) {
  currentTF = days;
  document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderDashboard();
}

function renderDashboard() {
  const entries   = HopeEngine.getEntries();
  const allScores = entries.map(e => e.psychologicalIndex);

  // No data state
  if (!entries.length) {
    ['d-index','d-avg','d-wavg','d-vol','d-stability',
     'd-phase','d-phase-desc','d-best','d-best-date',
     'd-total','d-streak','d-index-ch','d-vol-label','d-stab-label'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '--';
    });
    return;
  }

  // Filter by timeframe
  const cutoff  = new Date();
  cutoff.setDate(cutoff.getDate() - currentTF);
  const filtered = entries.filter(e =>
    currentTF >= 99999 || new Date(e.timestamp) >= cutoff
  );
  const filteredScores = filtered.map(e => e.psychologicalIndex);

  // Analytics
  const latest  = entries[entries.length - 1];
  const prev    = entries[entries.length - 2];
  const avg     = (allScores.reduce((a,b) => a+b, 0) / allScores.length).toFixed(2);
  const wavg    = HopeEngine.getWeightedAvg(allScores);
  const vol     = HopeEngine.getVolatility(allScores);
  const phase   = HopeEngine.getPhase(allScores);
  const best    = Math.max(...allScores);
  const bestEntry = entries.find(e => e.psychologicalIndex === best);
  const closes  = entries.filter(e => e.entryType === 'daily_close');

  // --- Fill stat cards ---
  document.getElementById('d-index').textContent = latest.psychologicalIndex.toFixed(2);
  document.getElementById('d-avg').textContent   = avg;
  document.getElementById('d-wavg').textContent  = wavg ? wavg.toFixed(2) : '--';
  document.getElementById('d-vol').textContent   = vol.toFixed(2);

  document.getElementById('d-vol-label').textContent =
    vol < 0.1 ? 'low — controlled' :
    vol < 0.2 ? 'moderate'         : 'high — unstable';

  document.getElementById('d-stability').textContent =
    vol < 0.1 ? 'HIGH' :
    vol < 0.2 ? 'MED'  : 'LOW';

  document.getElementById('d-stab-label').textContent =
    vol < 0.1 ? 'very consistent' :
    vol < 0.2 ? 'some variance'   : 'needs work';

  // Change vs previous entry
  const change = prev ? (latest.psychologicalIndex - prev.psychologicalIndex) : 0;
  const chEl   = document.getElementById('d-index-ch');
  chEl.textContent = (change >= 0 ? '▲ +' : '▼ ') + change.toFixed(2);
  chEl.className   = 'stat-change ' + (change >= 0 ? 'pos' : 'neg');

  // Phase
  document.getElementById('d-phase').textContent      = phase.name;
  document.getElementById('d-phase-desc').textContent = phase.desc;

  // Best
  document.getElementById('d-best').textContent      = best.toFixed(2);
  document.getElementById('d-best-date').textContent = bestEntry
    ? new Date(bestEntry.timestamp).toLocaleDateString()
    : '--';

  // Totals
  document.getElementById('d-total').textContent  = entries.length;
  document.getElementById('d-streak').textContent = `${closes.length} daily closes`;

  // --- Chart ---
  const chartLabels = filtered.map(e => {
    const d = new Date(e.timestamp);
    return `${d.getMonth()+1}/${d.getDate()}`;
  });

  if (dashChartInst) dashChartInst.destroy();

  dashChartInst = new Chart(document.getElementById('dashChart'), {
    type: 'line',
    data: {
      labels: chartLabels.length ? chartLabels : ['--'],
      datasets: [
        {
          label: 'Psych Index',
          data: filteredScores.length ? filteredScores : [0],
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0,212,255,0.06)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#00d4ff',
          borderWidth: 2
        },
        {
          label: 'Baseline 0.5',
          data: Array(chartLabels.length || 1).fill(0.5),
          borderColor: 'rgba(200,168,75,0.3)',
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
          borderWidth: 1
        }
      ]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color:'#4a6070', font:{ size:9 } },
          grid:  { color:'rgba(255,255,255,0.03)' }
        },
        y: {
          ticks: { color:'#4a6070', font:{ size:9 } },
          grid:  { color:'rgba(255,255,255,0.03)' },
          min: 0, max: 1
        }
      },
      animation: { duration: 600 }
    }
  });
}

document.addEventListener("DOMContentLoaded", renderDashboard);
```

---

Now update your `dashboard.html` — replace the inline `<script>` block at the bottom with these two lines:

```html
<script src="js/engine.js"></script>
<script src="js/dashboard.js"></script>
```

```

Everything is now clean and separated. Push to GitHub and you're live! 🚀
