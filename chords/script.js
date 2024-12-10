let chords = {};

const chordSelect = document.getElementById("chord-select");
const chordButtons = document.getElementById("chord-buttons");
const chordOutput = document.getElementById("chord-output");
const popup = document.getElementById("popup");
const popupNotes = document.getElementById("popup-notes");

async function fetchChords() {
    try {
        const response = await fetch("https://dnbnc.vercel.app/chords/chords.json");
        chords = await response.json();
        populateChordSelect();
        updateChordButtons();
        updateChordOutput();
    } catch (error) {
        console.error("Error loading chords:", error);
    }
}

function populateChordSelect() {
    chordSelect.innerHTML = ""; // Clear existing options
    const chordNames = Object.keys(chords);
    chordNames.forEach((chord) => {
        const option = document.createElement("option");
        option.value = chord;
        option.textContent = chord;
        chordSelect.appendChild(option);
    });
}
currentChords = [];

function updateChordButtons() {

    chordButtons.innerHTML = ""; // Clear existing buttons
    const chord = chordSelect.value;
    const chordTypes = Object.keys(chords[chord] || {});
    currentChords = chords[chordSelect.value]["Major"];

    chordTypes.forEach((type) => {
        const button = document.createElement("button");
        button.textContent = type; // Тип аккорда (например, major, minor)
        button.addEventListener("click", () => {
            currentChords = chords[chordSelect.value][type];
            updateChordOutput(type);
        });
        chordButtons.appendChild(button);
    });
}



function updateChordOutput(type = null) {
    const chord = chordSelect.value;
    const chordType = type || Object.keys(chords[chord])[0]; // Если не выбран тип, выберем первый
    const notes = chords[chord] ? chords[chord][chordType] : [];
    chordOutput.textContent =
        notes.length > 0 ? `Notes: ${notes.join(", ")}` : "Chord not found";
    currentChords = chords[chordSelect.value][type];


}

function showPopup(chord, type) {
    const notes = chords[chord] ? chords[chord][type] : [];
    popupNotes.textContent =
        notes.length > 0 ? notes.join(", ") : "No notes available";
    popup.style.display = "block";
    popup.style.left = `${event.pageX}px`;
    popup.style.top = `${event.pageY}px`;

    enablePopupDrag();
}

// Функция для перемещения всплывающего окна
function enablePopupDrag() {
    let isDragging = false;
    let offsetX, offsetY;

    popup.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - popup.getBoundingClientRect().left;
        offsetY = e.clientY - popup.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            popup.style.left = `${e.clientX - offsetX}px`;
            popup.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
}

chordSelect.addEventListener("change", () => {
    updateChordButtons();
    updateChordOutput();
});

// Initial load
fetchChords();

const noteColors = {
    C: "#FF4D4D", // Bright Red
    "C#": "#FF6600", // Vivid Orange
    D: "#FF8000", // Bright Orange
    "D#": "#FF9900", // Amber
    E: "#FFFF00", // Bright Yellow
    F: "#99FF00", // Bright Lime Green
    "F#": "#66FF33", // Spring Green
    G: "#33FF66", // Medium Spring Green
    "G#": "#00FF99", // Aquamarine
    A: "#00FFFF", // Cyan
    "A#": "#0099FF", // Dodger Blue
    B: "#0000FF", // Bright Blue
};


function updateChordOutput(type = null) {

    const chord = chordSelect.value;
    const chordType = type || Object.keys(chords[chord])[0]; // Если не выбран тип, выберем первый
    const notes = chords[chord] ? chords[chord][chordType] : [];

    if (notes.length > 0) {
        // Создаем строку, где каждая нота будет иметь свой цвет
        const coloredNotes = notes
            .map((note) => {
                const noteColor = noteColors[note] || "#000000"; // По умолчанию черный, если цвет не найден
                return `<span style="color:${noteColor}">${note}</span>`;
            })
            .join(", ");
        chordOutput.innerHTML = `${chord}-${chordType} <span style="color:#00B244">|</span> Notes: ${coloredNotes}`;
    } else {
        chordOutput.textContent = "Chord not found";

    }
}

updateChordOutput();

function playSelectedChord(type) {
    const chord = chordSelect.value; // Get the selected chord
    const chordType = Object.keys(chords[chord])[0]; // Default to the first type if none selected
    const notes = chords[chord] ? chords[chord][chordType] : [];
    if (notes.length > 0) {
        const player = new NotesPlayer();

        if (type == 1) {
            // Optionally, apply an Impulse Response (IR) and distortion to the chord
            player.playMelody(currentChords);
            //player.playChord(currentChords, 0, 30); // Apply distortion to the chord notes
        } else {
            player.playChord(currentChords, 1, 60);

        }
    } else {
        alert("No chord or notes selected to play!");
    }
}
setInterval(() => {
    console.log(chords[chordSelect.value]['Major']);

}, 2000);
console.log("test")