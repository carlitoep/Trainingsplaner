

const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];

const events = ["SP", "DU", "DI", "TA",]

let currentDate = new Date();




//let blocks = []; // Array, um die Trainingsblöcke zu speichern
let draggingBlock = null; // Der aktuell gezogene Block
let offsetX, offsetY;

function renderCalendar() {
    const daysContainer = document.getElementById('days');
    const monthYear = document.getElementById('monthYear');

    // Set the current month and year
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent = `${monthNames[month]} ${year}`;

    // Get the first day of the month and total days in the month
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // Adjust for Monday as the first day (JavaScript uses Sunday as 0)
    const adjustedFirstDay = (firstDay === 0 ? 7 : firstDay) - 1;

    // Clear previous days
    daysContainer.innerHTML = '';

    // Create the calendar grid
    let html = '<tr>';
    for (let i = 0; i < adjustedFirstDay; i++) {
        html += '<td class="empty"></td>'; // Empty cells for days before the 1st
    }
    for (let day = 1; day <= lastDate; day++) {
        if ((day + adjustedFirstDay - 1) % 7 === 0) {
            html += '</tr><tr>'; // Start a new row every week
        }
        html += `<td onclick="selectDay(${day},'${monthNames[month]}',${year})">${day}</td>`; // Add the day
    }
    html += '</tr>';
    daysContainer.innerHTML = html;
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}



// Render the initial calendar


function showPage(page) {
    const content = document.getElementById('content');
    switch (page) {
        case 'page1':
            content.innerHTML = `
                <h1>Seite 1</h1>
                <p>Das ist der Inhalt der ersten Seite.</p>
            `;
            break;
        case 'page2':
            content.innerHTML = `
                <h1>Calender</h1>
                <div class="main">
                <div id="calendar">
        <header>
            <button id="prev" onclick="changeMonth(-1)">❮</button>
            <h1 id="monthYear"></h1>
            <button id="next" onclick="changeMonth(1)">❯</button>
        </header>
        <table>
            <thead>
                <tr>
                    <th>Mo</th>
                    <th>Di</th>
                    <th>Mi</th>
                    <th>Do</th>
                    <th>Fr</th>
                    <th>Sa</th>
                    <th>So</th>
                </tr>
            </thead>
            <tbody id="days"></tbody>
        </table>
    </div>
    </div>
            `;
            break;
        case 'page3':
            content.innerHTML = `
                <h1>Statistiken</h1>
                <label for="timeRange">Zeitraum auswählen:</label>
                <select id="timeRange" onchange="getStats()">
                <option value="7">Woche</option>
                <option value="30">Monat</option>
                <option value="365">Jahr</option>
                </select>
                <button onclick="getStats()">Statistiken anzeigen</button>
                <div id="stat"></div>
                 <div id="records">
                 <label for="10km">10km Rekord</label>
                 <input id="10km" placeholder="40:00">
                 <button onclick="recordsave()">Speichern</button>
                 </div>

            `;
            if (localStorage.getItem("record10km") != null) {
                document.getElementById("10km").value = localStorage.getItem("record10km")
            }
            break;
        case 'page4':
            content.innerHTML = `
                <h1>Seite 4</h1>
                <p>Das ist der Inhalt der vierten Seite.</p>
            `;
            break;
        default:
            content.innerHTML = `
                <h1>Willkommen!</h1>
                <p>Klicken Sie auf die Buttons, um verschiedene Seiteninhalte anzuzeigen.</p>
            `;
    }
    //Calender()
    renderCalendar();


}

function selectDay(day, month, year) {
    const content = document.getElementById('content')
    console.log(day)
    content.innerHTML = `
        <h1>${day} ${month} ${year}</h1>
        <div class="main">
            <div id="eventModal">
                <div id="input-group">
                    <label for="SP${day}.${month}.${year}">Sportart:</label>
                    <select id="SP${day}.${month}.${year}">
                        <option value="running">Running</option>
                        <option value="cycling">Cycling</option>
                        <option value="swimming">Swimming</option>
                    </select>
                </div>
                <div id="input-group">
                    <label for="DU${day}.${month}.${year}">Dauer (Min):</label>
                    <input type="number" id="DU${day}.${month}.${year}" placeholder="60">
                </div>
                <div id="input-group">
                    <label for="DI${day}.${month}.${year}">Distanz (km):</label>
                    <input type="number" id="DI${day}.${month}.${year}" placeholder="5">
                </div>
                <div id="input-group">
                    <label for="TA${day}.${month}.${year}">Beschreibung:</label>
                    <textarea id="TA${day}.${month}.${year}" placeholder="Beschreibung eingeben"></textarea>
                </div>

                <button id="startPlanning">Training planen</button>

                <div id="BL${day}.${month}.${year}" style="display: flex; border: 1px solid #ccc; height: 50px; width: 100%; position: relative;">
                </div>

                <div id="blockModal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border: 1px solid #ccc; padding: 20px;">
                    <label for="blockDuration">Blockdauer (Minuten):</label>
                    <input type="number" id="blockDuration" placeholder="15">
                    <label id="blockIntensityLabel" for="blockIntensity"></label>
                    <input type="text" id="blockIntensity" placeholder="1:30">
                    <button id="saveBlock" onclick="setBlockDuration(${day}, '${month}', ${year})">Speichern</button>
                    <button onclick="closeModal()">Abbrechen</button>
                </div>

                <button onclick="addBlock(${day}, '${month}', ${year})">Block hinzufügen</button>
                <button onclick="save(${day}, '${month}', ${year})" id="BU${day}.${month}.${year}">Save</button>
            </div>
        </div>
    `;
    const blockContainer = document.getElementById(`BL${day}.${month}.${year}`);
    blockContainer.style.display = "flex";
    blockContainer.style.flexWrap = "nowrap"; // Verhindert Umbrüche
    blockContainer.style.overflow = "hidden"; // Verhindert Überlauf
    loadBlocks(day, month, year)


    // Event-Listener fürs Modal


    for (i = 0; i < events.length; i++) {
        document.getElementById(`${events[i]}${day}.${month}.${year}`).value = localStorage.getItem(`${events[i]}${day}.${month}.${year}`)
    }

    document.getElementById(`BL${day}.${month}.${year}`).style.display = "none";
    //document.getElementById(`BL${day}.${month}.${year}`).style.width = 50 %

    document.getElementById("startPlanning").addEventListener("click", function () {
        let trainingContainer = document.getElementById(`BL${day}.${month}.${year}`);
        trainingContainer.style.display = "flex";  // Sichtbar machen
        setTimeout(() => trainingContainer.classList.add("active"), 10); // Größer 

    });
}

let blocks = [];
let selectedBlockIndex = null;


function save(day, month, year) {


    for (i = 0; i < events.length; i++) {
        localStorage.setItem(`${events[i]}${day}.${month}.${year}`, document.getElementById(`${events[i]}${day}.${month}.${year}`).value)
    }


    // Schließe das Modal
    document.getElementById('eventModal').style.display = 'none';
    console.log(document.getElementById(`BL${day}.${month}.${year}`).value)
    saveBlocksToLocalStorage(day, month, year);
    alert('Notiz gespeichert!');
    showPage("page2")

}




// Zufällige Farbe für jeden Block
// Farbskala für die Blöcke
function getColorByPercentage(percentage) {
    const hue = (1 - percentage) * 120; // Grün (120) bis Rot (0)
    return `hsl(${hue}, 70%, 50%)`;
}

// Block hinzufügen
function addBlock(day, month, year) {
    const blockContainer = document.getElementById(`BL${day}.${month}.${year}`);
    if (!blockContainer) {
        console.log("emopty")
        return;
    }
    blockContainer.classList.add("block-container");
    const block = document.createElement("div");
    block.className = "block";
    block.style.backgroundColor = getColorByPercentage(0); // Default-Farbe
    block.style.width = "10%"; // Standardbreite
    block.style.height = "100%";
    block.style.marginRight = "5px";
    block.textContent = "Block";
    blockContainer.style.display = "flex";
    blockContainer.style.flexWrap = "nowrap"; // verhindert Umbrüche
    blockContainer.style.overflow = "hidden"; // bei zu großen Blöcken wird nichts umgebrochen
    blockContainer.style.alignItems = "stretch"; // alle Blöcke gleiche Höhe

    // Neuen Block dem Array hinzufügen
    blocks.push({ element: block, duration: 0, intensity: "", day, month, year });

    // Eventlistener für jeden Block
    block.addEventListener("click", () => {
        selectedBlockIndex = blocks.findIndex(b => b.element === block); // Richtiges Block-Index setzen
        openModal(block, day, month, year);
    });
    console.log("ED")
    blockContainer.appendChild(block); // Block ins DOM einfügen
}


// Block-Dauer setzen und Breite anpassen
function setBlockDuration(day, month, year) {
    const totalDuration = parseFloat(document.getElementById(`DU${day}.${month}.${year}`).value);
    const blockDuration = parseFloat(document.getElementById('blockDuration').value);
    const blockIntensity = document.getElementById('blockIntensity').value
    console.log(blockIntensity)
    console.log(isValidTime(blockIntensity))

    if (isNaN(totalDuration) || isNaN(blockDuration) || totalDuration <= 0 || blockDuration <= 0 || isValidTime(blockIntensity) == false) {
        alert('Bitte gültige Werte eingeben!');
        return;
    }

    const block = blocks[selectedBlockIndex];
    if (!block) return;

    block.duration = blockDuration;
    block.intensity = blockIntensity
    const percentage = Math.min(blockDuration / totalDuration, 1) * 100; // Wert in Prozent umwandeln

    block.element.style.width = `${percentage}%`; // Breite festlegen
    block.element.style.height = "100%";
    block.element.style.backgroundColor = getColorByPercentage(percentage);
    block.element.textContent = `${blockDuration} Min ${blockIntensity}/km`;

    closeModal();
}

// Speichern der Blöcke in LocalStorage
function saveBlocksToLocalStorage(day, month, year) {
    const blocksToSave = blocks.map(b => ({
        duration: b.duration,
        intensity: b.intensity,
        day: b.day,
        month: b.month,
        year: b.year
    }));

    console.log("Speichere Blöcke:", blocksToSave); // Checkpoint zum Debuggen
    localStorage.setItem(`BL${day}.${month}.${year}`, JSON.stringify(blocksToSave));
}

// Blöcke beim Laden wiederherstellen
function loadBlocks(day, month, year) {
    let savedBlocks = null
    if (localStorage.getItem(`BL${day}.${month}.${year}`) != undefined) {
        savedBlocks = JSON.parse(localStorage.getItem(`BL${day}.${month}.${year}`));
    }
    if (!savedBlocks) return
    const blockContainer = document.getElementById(`BL${day}.${month}.${year}`);
    blockContainer.innerHTML = ""; // Verhindert doppeltes Einfügen





    for (let i = 0; i < savedBlocks.length; i++) {
        blockData = savedBlocks[i]
        blockContainer.classList.add("block-container");
        let block = document.createElement("div");
        block.className = "block";
        block.style.backgroundColor = getColorByPercentage(0); // Default-Farbe
        block.style.width = "10%"; // Standardbreite
        block.style.height = "100%";
        block.style.marginRight = "5px";
        blockContainer.style.display = "flex";
        blockContainer.style.flexWrap = "nowrap"; // verhindert Umbrüche
        blockContainer.style.overflow = "hidden"; // bei zu großen Blöcken wird nichts umgebrochen
        blockContainer.style.alignItems = "stretch"; // alle Blöcke gleiche Höhe
        block.innerHTML = `${blockData.duration} Min ${blockData.intensity}/km`;
        const totalDuration = localStorage.getItem(`DU${day}.${month}.${year}`)
        const percentage = blockData.duration / totalDuration * 100;
        block.style.width = `${percentage}%`;
        block.style.height = "100%";
        block.style.backgroundColor = getColorByPercentage(percentage / 100);

        blockContainer.appendChild(block);
        blocks.push({ element: block, duration: blockData.duration, intensity: blockData.intensity, day, month, year });
        block.addEventListener("click", () => {
            selectedBlockIndex = blocks.findIndex(b => b.element === block); // Richtiges Block-Index setzen
            openModal(block, day, month, year);
        });
    }

    console.log("Geladene Blöcke:", blocks);
}

function openModal(block, day, month, year) {
    selectedBlockIndex = blocks.findIndex(b => b.element === block);
    document.getElementById('blockModal').style.display = 'block';
    let sport = document.getElementById(`SP${day}.${month}.${year}`).value
    let label = document.getElementById("blockIntensityLabel")
    let input = document.getElementById("blockIntensity")
    switch (sport) {
        case "swimming": label.textContent = "Geschwindigkeit(min/100m)"
            input.placeholder = "1:30"
        case "cycling": label.textContent = "Geschwindigkeit(km/h)"
            input.placeholder = "30"
        case "running": label.textContent = "Geschwindigkeit(min/km)"
            input.placeholder = "4:30"
    }
}

// Modal schließen
function closeModal() {
    document.getElementById('blockModal').style.display = 'none';
}


function getStats() {
    let range = parseInt(document.getElementById('timeRange').value);
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth(); // Monatsindex (0 = Januar, 1 = Februar, ...)
    let day = currentDate.getDate();

    let durationR = 0;
    let durationC = 0;
    let durationS = 0;
    let distanceR = 0;
    let distanceC = 0;
    let distanceS = 0;

    for (let j = 0; j < range; j++) {
        let date = new Date(year, month, day - j); // Korrekte Handhabung von Monatsgrenzen
        let currentDay = date.getDate();
        let currentMonth = monthNames[date.getMonth()];
        let currentYear = date.getFullYear();

        let duration = parseFloat(localStorage.getItem(`DU${currentDay}.${currentMonth}.${currentYear}`)) || 0;
        let sportart = localStorage.getItem(`SP${currentDay}.${currentMonth}.${currentYear}`);

        // Trainingsdauer berechnen
        switch (sportart) {
            case "running":
                durationR += duration;
                break;
            case "cycling":
                durationC += duration;
                break;
            case "swimming":
                durationS += duration;
                break;
        }

        // Distanz berechnen
        let distance = parseFloat(localStorage.getItem(`DI${currentDay}.${currentMonth}.${currentYear}`)) || 0;

        switch (sportart) {
            case "running":
                distanceR += distance;
                break;
            case "cycling":
                distanceC += distance;
                break;
            case "swimming":
                distanceS += distance;
                break;
        }
    }

    // Ergebnisse anzeigen
    document.getElementById("stat").innerHTML = `
        <h3>Wöchentliche Statistik:</h3>
        <p><strong>Trainingsdauer:</strong></p>
        <ul>
            <li>Running: ${durationR} Minuten</li>
            <li>Cycling: ${durationC} Minuten</li>
            <li>Swimming: ${durationS} Minuten</li>
        </ul>
        <p><strong>Distanz:</strong></p>
        <ul>
            <li>Running: ${distanceR} km</li>
            <li>Cycling: ${distanceC} km</li>
            <li>Swimming: ${distanceS} km</li>
        </ul>
    `;
}

function isValidTime(time) {
    const timeRegex = /^([0-9]):([0-5][0-9])$/;
    return timeRegex.test(time);
}
function recordsave() {
    console.log("dad")
    const timeRegex = /^([0-9])([0-9]):([0-5][0-9])$/;
    if (timeRegex.test(document.getElementById("10km").value) == false) {
        alert("Geben sie eine richtige Zeit ein")
        return
    }
    console.log("dad")
    localStorage.setItem("record10km", document.getElementById("10km").value)
}