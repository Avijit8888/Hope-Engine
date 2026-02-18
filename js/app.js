const quotes = [
    "Emotions move like markets. Discipline creates stability.",
    "Hope is not noise. It is direction.",
    "Silence reveals your true emotional trend.",
    "Control the reaction. The event is neutral.",
    "Every storm is a cycle, not a sentence."
];

document.getElementById("dailyQuote").innerText =
    quotes[Math.floor(Math.random() * quotes.length)];

const hope = document.getElementById("hope");
const fear = document.getElementById("fear");
const voidSlider = document.getElementById("void");

const hopeValue = document.getElementById("hopeValue");
const fearValue = document.getElementById("fearValue");
const voidValue = document.getElementById("voidValue");

hope.oninput = () => hopeValue.innerText = hope.value;
fear.oninput = () => fearValue.innerText = fear.value;
voidSlider.oninput = () => voidValue.innerText = voidSlider.value;

document.getElementById("saveEntry").addEventListener("click", () => {

    const reflection = document.getElementById("reflection").value;

    const entry = {
        date: new Date().toISOString().split('T')[0],
        reflection,
        hope: parseInt(hope.value),
        fear: parseInt(fear.value),
        void: parseInt(voidSlider.value),
    };

    entry.score = entry.hope - entry.fear + (entry.void * 0.5);

    let entries = JSON.parse(localStorage.getItem("hopeEntries")) || [];
    entries.push(entry);

    localStorage.setItem("hopeEntries", JSON.stringify(entries));

    alert("Moment Anchored.");
    document.getElementById("reflection").value = "";
});
