// ===============================
// HOPE ENGINE CORE MODULE
// ===============================

const HopeEngine = (() => {

    const STORAGE_KEY = "hope_entries";
    const WEIGHT_KEY = "hope_weights";
    const MODE_KEY = "hope_mode";

    // ---------------------------
    // INITIALIZATION
    // ---------------------------

    function initWeights() {
        let weights = JSON.parse(localStorage.getItem(WEIGHT_KEY));

        if (!weights) {
            weights = {
                mood: 25,
                energy: 25,
                focus: 25,
                discipline: 25
            };
            localStorage.setItem(WEIGHT_KEY, JSON.stringify(weights));
        }

        return weights;
    }

    function getActiveWeights() {
        return JSON.parse(localStorage.getItem(WEIGHT_KEY));
    }

    function setWeights(newWeights) {
        const total =
            newWeights.mood +
            newWeights.energy +
            newWeights.focus +
            newWeights.discipline;

        if (total !== 100) {
            alert("Weights must total 100%");
            return false;
        }

        localStorage.setItem(WEIGHT_KEY, JSON.stringify(newWeights));
        return true;
    }

    // ---------------------------
    // ENTRY HANDLING
    // ---------------------------

    function getEntries() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    function saveEntry(entry) {
        const entries = getEntries();
        entries.push(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    function normalize(value) {
        return value / 10;
    }

    function calculateIndex(mood, energy, focus, discipline) {
        const weights = getActiveWeights();

        const index =
            (mood * weights.mood / 100) +
            (normalize(energy) * weights.energy / 100) +
            (normalize(focus) * weights.focus / 100) +
            (normalize(discipline) * weights.discipline / 100);

        return parseFloat(index.toFixed(4));
    }

    // ---------------------------
    // DAILY CLOSE + AGGREGATION
    // ---------------------------

    function getDailyCloseEntries() {
        return getEntries().filter(e => e.entryType === "daily_close");
    }

    function getTodayClose() {
        const today = new Date().toISOString().split("T")[0];

        const entry = getDailyCloseEntries().find(e =>
            e.timestamp.startsWith(today)
        );

        return entry ? entry.psychologicalIndex : null;
    }

    function getLast7Average() {
        const closes = getDailyCloseEntries()
            .slice(-7)
            .map(e => e.psychologicalIndex);

        if (closes.length === 0) return null;

        const avg = closes.reduce((a, b) => a + b, 0) / closes.length;
        return parseFloat(avg.toFixed(4));
    }

    // ---------------------------
    // CSV EXPORT
    // ---------------------------

    function exportCSV() {
        const entries = getEntries();

        if (entries.length === 0) {
            alert("No data to export.");
            return;
        }

        const headers = [
            "id",
            "timestamp",
            "entry_type",
            "mood",
            "energy",
            "focus",
            "discipline",
            "weight_mood",
            "weight_energy",
            "weight_focus",
            "weight_discipline",
            "psychological_index",
            "notes"
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
                `"${e.notes.replace(/"/g, '""')}"`
            ].join(",") + "\n";
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `hope_engine_backup_${new Date().toISOString()}.csv`;
        a.click();

        URL.revokeObjectURL(url);
    }

    // ---------------------------
    // INIT
    // ---------------------------

    initWeights();

    return {
        calculateIndex,
        saveEntry,
        exportCSV,
        getActiveWeights,
        setWeights,
        getTodayClose,
        getLast7Average
    };

})();
