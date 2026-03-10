**File 6a — `js/engine.js`**

```javascript
// ============================================================
// HOPE ENGINE — CORE MODULE
// ============================================================

const HopeEngine = (() => {

  const STORAGE_KEY = "hope_entries";
  const WEIGHT_KEY  = "hope_weights";

  // ---------------------------
  // WEIGHTS
  // ---------------------------

  function initWeights() {
    let w = JSON.parse(localStorage.getItem(WEIGHT_KEY));
    if (!w) {
      w = { mood:25, energy:25, focus:25, discipline:25 };
      localStorage.setItem(WEIGHT_KEY, JSON.stringify(w));
    }
    return w;
  }

  function getWeights() {
    return JSON.parse(localStorage.getItem(WEIGHT_KEY)) || { mood:25, energy:25, focus:25, discipline:25 };
  }

  function setWeights(w) {
    const total = w.mood + w.energy + w.focus + w.discipline;
    if (total !== 100) {
      alert("Weights must total exactly 100%");
      return false;
    }
    localStorage.setItem(WEIGHT_KEY, JSON.stringify(w));
    return true;
  }

  // ---------------------------
  // ENTRIES
  // ---------------------------

  function getEntries() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function saveEntry(entry) {
    const entries = getEntries();
    entries.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  // ---------------------------
  // INDEX CALCULATION
  // ---------------------------

  function calculateIndex(mood, energy, focus, discipline) {
    const w = getWeights();
    const idx =
      (mood             * w.mood       / 100) +
      ((energy / 10)    * w.energy     / 100) +
      ((focus / 10)     * w.focus      / 100) +
      ((discipline / 10)* w.discipline / 100);
    return parseFloat(idx.toFixed(4));
  }

  // ---------------------------
  // ANALYTICS
  // ---------------------------

  function getPhase(scores) {
    if (!scores || scores.length < 3) {
      return { name: "UNKNOWN", desc: "Need more data to detect phase", pct: 0 };
    }
    const recent  = scores.slice(-5);
    const avg     = recent.reduce((a,b) => a+b, 0) / recent.length;

    if (avg >= 0.65) {
      return {
        name: "ACCUMULATION",
        desc: "Building energy for the next run",
        pct: Math.round(avg * 100)
      };
    } else if (avg >= 0.45) {
      return {
        name: "CONSOLIDATION",
        desc: "Stable — holding ground, coiling",
        pct: Math.round(avg * 100)
      };
    } else {
      return {
        name: "DISTRIBUTION",
        desc: "Recovery phase — rest and reset",
        pct: Math.round(avg * 100)
      };
    }
  }

  function getVolatility(scores) {
    if (scores.length < 2) return 0;
    const mean     = scores.reduce((a,b) => a+b, 0) / scores.length;
    const variance = scores.reduce((s,v) => s + Math.pow(v - mean, 2), 0) / scores.length;
    return parseFloat(Math.sqrt(variance).toFixed(4));
  }

  function getWeightedAvg(scores) {
    if (!scores.length) return null;
    let weightedSum = 0, totalWeight = 0;
    scores.forEach((s, i) => {
      const w = i + 1;
      weightedSum  += s * w;
      totalWeight  += w;
    });
    return parseFloat((weightedSum / totalWeight).toFixed(4));
  }

  function getTodayClose() {
    const today  = new Date().toISOString().split('T')[0];
    const closes = getEntries().filter(e => e.entryType === 'daily_close');
    const entry  = closes.find(e => e.timestamp.startsWith(today));
    return entry ? entry.psychologicalIndex : null;
  }

  function getLast7Average() {
    const closes = getEntries()
      .filter(e => e.entryType === 'daily_close')
      .slice(-7)
      .map(e => e.psychologicalIndex);
    if (!closes.length) return null;
    return parseFloat((closes.reduce((a,b) => a+b, 0) / closes.length).toFixed(4));
  }

  // ---------------------------
  // CSV EXPORT
  // ---------------------------

  function exportCSV() {
    const entries = getEntries();
    if (!entries.length) {
      alert("No data to export yet.");
      return;
    }

    const headers = [
      "id", "timestamp", "entry_type",
      "mood", "energy", "focus", "discipline",
      "weight_mood", "weight_energy", "weight_focus", "weight_discipline",
      "psychological_index", "notes"
    ];

    let csv = headers.join(",") + "\n";

    entries.forEach(e => {
      csv += [
        e.id,
        e.timestamp,
        e.entryType,
        e.mood,
        e.energy,
        e.focus,
        e.discipline,
        e.weights.mood,
        e.weights.energy,
        e.weights.focus,
        e.weights.discipline,
        e.psychologicalIndex,
        `"${(e.notes || '').replace(/"/g, '""')}"`
      ].join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `hope_engine_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------------------------
  // INIT
  // ---------------------------

  initWeights();

  return {
    getEntries,
    saveEntry,
    getWeights,
    setWeights,
    calculateIndex,
    getPhase,
    getVolatility,
    getWeightedAvg,
    getTodayClose,
    getLast7Average,
    exportCSV
  };

})();
```

---

Say **next** for **`style.css`** 👇
