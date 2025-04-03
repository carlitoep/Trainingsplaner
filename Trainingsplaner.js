document.addEventListener('DOMContentLoaded', function () {
    console.log('Die Seite ist bereit!');
    showPage("page1", true)
});

let dayT = 5;  // Beispielwert
let monthT = 3;  // Beispielwert
let yearT = 2025;  // Beispielwert

// Umwandeln in String und mit führender Null auffüllen, falls nötig
dayT = String(dayT).padStart(2, '0');
monthT = String(monthT).padStart(2, '0');

// Jetzt kannst du das Datum erstellen
const date = `${yearT}-${monthT}-${dayT}`;
console.log(date);  // Ausgabe: "2025-03-05"

const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];

const events = ["SP", "DU", "DI", "TA",]

let currentDate = new Date();

const sportIcons = {
    "Laufen": "🏃‍♂️",
    "Radfahren": "🚴‍♂️",
    "Schwimmen": "🏊‍♂️"
};
/*let trainingsData = {
    "2025-03-12": ["Laufen", "Radfahren"],
    "2025-03-15": ["Schwimmen"],
    "2025-03-20": ["Laufen", "Schwimmen", "Radfahren"]
}; // Beispiel-Daten, später aus Backend laden*/

//let blocks = []; // Array, um die Trainingsblöcke zu speichern
let draggingBlock = null; // Der aktuell gezogene Block
let offsetX, offsetY;

function renderCalendar() {
    const daysContainer = document.getElementById("days");
    const monthYear = document.getElementById("monthYear");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const adjustedFirstDay = (firstDay === 0 ? 7 : firstDay) - 1;

    daysContainer.innerHTML = "";

    let trainingsData = {}; // WICHTIG: Initialisierung als leeres Objekt

    // Daten vom Server abrufen
    const formData = new FormData();
    formData.append("month", month + 1);
    formData.append("year", year);

    fetch("calender.php", {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Fehler beim Abrufen der Einträge");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Empfangene Daten:", data);

            // Daten für jedes Datum speichern
            data.forEach((entry) => {
                let dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(entry.tag).padStart(2, "0")}`;
                trainingsData[dateKey] = entry.aktivitäten.split(", ");
            });

            console.log("trainingsData nach Fetch:", trainingsData);

            // Jetzt erst den Kalender updaten
            updateCalendar(daysContainer, adjustedFirstDay, lastDate, year, month, trainingsData);
        })
        .catch((error) => console.error("Fehler beim Laden der Daten:", error));
}

function updateCalendar(daysContainer, adjustedFirstDay, lastDate, year, month, trainingsData) {
    let row = document.createElement("tr");

    for (let i = 0; i < adjustedFirstDay; i++) {
        let emptyCell = document.createElement("td");
        emptyCell.classList.add("empty");
        row.appendChild(emptyCell);
    }

    for (let day = 1; day <= lastDate; day++) {
        let dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        let cell = document.createElement("td");
        cell.onclick = () => selectDay(day, monthNames[month], year);
        cell.innerHTML = `<span>${day}</span>`;

        // Sportarten-Icons einfügen
        if (trainingsData[dateKey]) {
            let iconsHTML = trainingsData[dateKey].map((sport) => sportIcons[sport] || "❓").join(" ");
            let iconDiv = document.createElement("div");
            iconDiv.innerHTML = iconsHTML;
            iconDiv.style.fontSize = "14px"; // Icons kleiner machen
            cell.appendChild(iconDiv);
        }

        row.appendChild(cell);

        if ((day + adjustedFirstDay) % 7 === 0) {
            daysContainer.appendChild(row);
            row = document.createElement("tr");
        }
    }

    if (row.children.length > 0) {
        daysContainer.appendChild(row);
    }
}


function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}




function showPage(page, button) {
    const content = document.getElementById('content');
    console.log(button)
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (button != true) {

        button.classList.add('active');

    } else {
    }
    console.log('Seite wechseln zu:', page);
    let btn1 = document.getElementById("btn-1")
    let btn2 = document.getElementById("btn-2")
    let btn3 = document.getElementById("btn-3")
    let btn4 = document.getElementById("btn-4")
    console.log(btn2)


    switch (page) {
        case 'page1':
            content.innerHTML = `
                <header class="header">
        <h1 id="user">Willkommen zurück, </h1>
        <p>Dein Weg zu neuen Bestzeiten beginnt hier.</p>
    </header>

    <main class="dashboard">
        <!-- Ziele und Fortschritt -->
        <section class="card goals">
            <h2>Deine Wochenziele 📈</h2>
          
            <p id ="distanzzielLaufen"><strong>Distanzziel Laufen:</strong></p>
             <div class="progress-bar">
                <div id="barLaufen" class="progress" style="width: 50%;"></div>
            </div>
            <p id ="distanzzielRadfahren"><strong>Distanzziel Radfrahren:</strong></p>
             <div class="progress-bar">
                <div id="barRadfahren" class="progress" style="width: 50%;"></div>
            </div>
            <p id ="distanzzielSchwimmen"><strong>Distanzziel Schwimmen:</strong></p>
            <div class="progress-bar">
                <div id="barSchwimmen" class="progress" style="width: 50%;"></div>
            </div>
    
        </section>
         <section class="card goals">
            <h2>Deine Wochenziele 📈</h2>
          
            <p id ="stundenZiel"><strong>Trainingsziel:</strong></p>
             <div class="progress-bar">
                <div id="barStunden" class="progress" style="width: 50%;"></div>
            </div>
            <p id="motivation"></p>
        </section>

        <!-- Letzte Aktivitäten -->
        <section class="card recent-activities">
            <h2>Deine letzten Trainings 🏅</h2>
            <ul>
                <li id ="vergangen1"></li>
                <li id ="vergangen2"></li>
                <li id ="vergangen3"></li>
            </ul>
        </section>

        <!-- Nächste geplante Trainings -->
        <section class="card upcoming-trainings">
            <h2>Nächste geplante Trainings 📅</h2>
            <ul>
                <li id ="zukunft1"></li>
                <li id ="zukunft2"></li>
            </ul>
            <a id="kalenderbtn" class="btn">Zum Kalender →</a>
        </section>

        <!-- Bestzeiten -->
        <section class="card best-times">
            <h2>Deine Bestzeiten 🏆</h2>
            <ul>
                <li id="5k"></li>
                <li id="10k"></li>
                <li id="21k"></li>
            </ul>
        </section>

    </main>

    <footer>
        <p>&copy; 2025 Trainingsplaner. Bleib stark und bleib dran! 💪</p>
    </footer>
            `;
            document.getElementById('kalenderbtn').addEventListener('click', function () {
                showPage('page2', btn2);
            });
            startseite()
            break;
        case 'page2':
            content.innerHTML = `
                <!-- Kalender-Seite -->
<div id="page2" class="page-content">
    <header class="header">
        <h1>Kalender 📅</h1>
    </header>
    <main class="calendar-container">
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
    </main>
    <footer>
        <p>&copy; 2025 Trainingsplaner. Dein Kalender für sportliche Erfolge! 💪</p>
    </footer>
</div>

            `;
            renderCalendar();
            break;
        case 'page3':
            content.innerHTML = `
               <!-- Statistik-Seite -->
<div id="page3" class="page-content">
    <header class="header">
        <h1>Statistiken 📊</h1>
    </header>
    <main class="stats-container">
        <section class="card">
            <label for="activity">Aktivität auswählen:</label>
            <select id="activity" onchange="getStats()">
                <option value="Schwimmen">Schwimmen</option>
                <option value="Radfahren">Radfahren</option>
                <option value="Laufen">Laufen</option>
            </select>
        </section>

        <section class="card">
            <h2>Trainingsdauer: <span id="selected-range">Woche</span></h2>
            <div class="chart-container">
                <canvas id="Chart"></canvas>
            </div>
           
        </section>
    </main>
    <footer>
        <p>&copy; 2025 Trainingsplaner. Deine Fortschritte im Blick! 💪</p>
    </footer>
</div>


            `
            getStats();

            break;
        case 'page4':
            content.innerHTML = `
               <div id="page-best-times" class="page-content">
    <header class="header">
        <h1 id="h1">🏆 Bestzeiten & Trainingsziele</h1>
        <p id="p1"></p>
    </header>

    <main class="best-times-container">
        <section class="card">
            <h2>🏁 Bestzeiten hinzufügen</h2>
            <form id="best-times-form">
                <label for="best-time-5k">5 km Lauf:</label>
                <input type="text" id="best-time-5k" placeholder="00:23:45">

                <label for="best-time-10k">10 km Lauf:</label>
                <input type="text" id="best-time-10k" placeholder="00:50:10">

                <label for="best-time-half-marathon">Halbmarathon:</label>
                <input type="text" id="best-time-half-marathon" placeholder="01:45:00">

                <button type="button" onclick="bestzeiten()" class="btn">Speichern</button>
            </form>
        </section>

        <section class="card">
            <h2>📜 Gespeicherte Bestzeiten</h2>
            <ul id="saved-best-times"></ul>
        </section>
    </main>

    <section class="card">
        <h2>📅 Wöchentliche Trainingsziele</h2>
        <form id="weekly-goals-form">
            <label for="goal-km">📏 Gesamtkilometer pro Woche:</label>
            <input type="number" id="goal-km" placeholder="z.B. 40" min="0">

            <label for="activity">🏋️ Sportart wählen:</label>
            <select id="activity">
                <option value="Laufen">Laufen</option>
                <option value="Radfahren">Radfahren</option>
                <option value="Schwimmen">Schwimmen</option>
            </select>

            <label for="goal-time">⏱ Gesamtzeit pro Woche:</label>
            <input type="text" id="goal-time" placeholder="05:30:00 (hh:mm:ss)">

            <button type="button" onclick="zielErstellen()" class="btn">Ziele speichern</button>
        </form>
    </section>

    <footer>
        <p>&copy; 2025 Trainingsplaner. Bleib stark und bleib dran! 💪</p>
    </footer>
</div>
`

            let distances = [5, 10, 21];
            getRecords().then(records => {

                for (let j = 0; j < distances.length; j++) {
                    if (records[j] == null) { continue }
                    let li = document.createElement("li")
                    if (distances[j] == 21) {
                        document.getElementById(`best-time-half-marathon`).value = records[j]
                        li.innerHTML = "<strong>Halbmarathon: </strong>" + records[j]
                        document.getElementById("saved-best-times").appendChild(li)
                        continue
                    }
                    document.getElementById(`best-time-${distances[j]}k`).value = records[j]
                    li.innerHTML = "<strong>" + distances[j] + " km Lauf: </strong>" + records[j]
                    document.getElementById("saved-best-times").appendChild(li)
                }
            })
            ziele().then(ziele => {
                console.log(ziele)
            })
            break;
        default:
            content.innerHTML = `
                <h1>Willkommen!</h1>
                <p>Klicken Sie auf die Buttons, um verschiedene Seiteninhalte anzuzeigen.</p>
            `;
    }


    //Calender()


}

function selectDay(day, month, year) {
    const content = document.getElementById('content')
    content.innerHTML = `
        <h1>${day} ${month} ${year}</h1>
        <div class="main">
            <div id="eventModal">
                <header id="trainings">
                        
                </header>
                <div id="input-group">
                    <label for="activity_type">Sportart:</label>
                    <select name="activity_type" id="activity_type">
                        <option value="Laufen">Laufen</option>
                        <option value="Radfahren">Radfahren</option>
                        <option value="Schwimmen">Schwimmen</option>
                    </select>
                </div>
                <div id="input-group">
                    <label for="duration">Dauer (Min):</label>
                    <input type="number" id="duration" placeholder="60">
                </div>
                <div id="input-group">
                    <label for="distance">Distanz (km):</label>
                    <input type="number" id="distance" name="duration" required placeholder="5">
                </div>
                 
                <div id="input-group">
                    <label for="text">Beschreibung:</label>
                    <textarea id="text" placeholder="Beschreibung eingeben"></textarea>
                </div>

                <button id="startPlanning">Training planen</button>

                <div id="blockContainer" style="display: flex; border: 1px solid #ccc; height: 50px; width: 100%; position: relative;">
                </div>

                <div id="blockModal" style="   align-items: center;justify-content: center;display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border: 1px solid #ccc; padding: 20px;">
                    <label for="blockDuration">Blockdauer (Minuten):</label>
                    <input type="number" id="blockDuration" placeholder="15">
                    <label id="blockIntensityLabel" for="blockIntensity"></label>
                    <input type="text" id="blockIntensity" placeholder="1:30">
                    <button id="saveBlock" onclick="setBlockDuration(${day}, '${month}', ${year})">Speichern</button>
                    <button onclick="closeModal()">Abbrechen</button>
                </div>

               <div class="button-container">
            <button class="delete-btn" onclick="addBlock(${day}, '${month}', ${year})">Block hinzufügen</button>
            <button class="delete-btn" onclick="save(${day}, '${month}', ${year})">Speichern</button>
            <button onclick="deleteTraining(${day}, '${month}', ${year})" class="delete-btn">Löschen</button>
        </div>
            </div>
        </div>
    `;
    const blockContainer = document.getElementById(`blockContainer`);
    blockContainer.style.display = "flex";
    blockContainer.style.flexWrap = "nowrap"; // Verhindert Umbrüche
    blockContainer.style.overflow = "hidden"; // Verhindert Überlauf


    loadTraining(day, month, year)



    document.getElementById(`blockContainer`).style.display = "none";
    //document.getElementById(`BL${day}.${month}.${year}`).style.width = 50 %

    document.getElementById("startPlanning").addEventListener("click", function () {
        let trainingContainer = document.getElementById(`blockContainer`);
        trainingContainer.style.display = "flex";  // Sichtbar machen
        setTimeout(() => trainingContainer.classList.add("active"), 10); // Größer 

    });
}

let blocks = [];
let selectedBlockIndex = null;
let trainingsIDElement = ""


function save(day, month, year) {
    const blocksToSave = blocks.map(b => ({
        element: b.element,
        duration: b.duration,
        intensity: b.intensity,
        date: `${year}-${(monthNames.indexOf(month) + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    }));

    console.log("Speichere Blöcke:", blocksToSave); // Checkpoint zum Debuggen
    console.log(document.getElementById("activity_type").value, document.getElementById(`duration`).value, `${year}-${month}-${day}`, document.getElementById("text").value, document.getElementById("distance").value)
    addTraining(day, month, year, document.getElementById("activity_type").value, document.getElementById(`duration`).value, `${year}-${(monthNames.indexOf(month) + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`, document.getElementById("text").value, document.getElementById("distance").value, blocksToSave)

    /* for (i = 0; i < events.length; i++) {
         localStorage.setItem(`${ events[i] }${ day }.${ month }.${ year } `, document.getElementById(`${ events[i] }${ day }.${ month }.${ year } `).value)
     }
 
 */
    // Schließe das Modal
    document.getElementById('eventModal').style.display = 'none';
    //console.log(document.getElementById(`BL${day}.${month}.${year} `).value)
    //saveBlocksToLocalStorage(day, month, year);

    alert('Notiz gespeichert!');
    trainingsIDElement = ""
    showPage('page2', true)

}




// Zufällige Farbe für jeden Block
// Farbskala für die Blöcke
function getColorByPercentage(percentage) {
    const hue = (1 - percentage) * 120; // Grün (120) bis Rot (0)
    return `hsl(${hue}, 70 %, 50 %)`;
}

// Block hinzufügen
function addBlock(day, month, year) {
    const blockContainer = document.getElementById(`blockContainer`);
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
    blocks.push({ element: block, duration: 0, intensity: "", date: `${year}-${(monthNames.indexOf(month) + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}` });

    // Eventlistener für jeden Block
    block.addEventListener("click", () => {
        selectedBlockIndex = blocks.findIndex(b => b.element === block); // Richtiges Block-Index setzen
        openModal(block, blocks);
    });
    console.log("ED")
    blockContainer.appendChild(block); // Block ins DOM einfügen
}


// Block-Dauer setzen und Breite anpassen
function setBlockDuration(day, month, year) {
    const totalDuration = parseFloat(document.getElementById(`duration`).value);
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

    block.element.style.width = `${percentage}% `; // Breite festlegen
    block.element.style.height = "100%";
    block.element.style.backgroundColor = getColorByPercentage(percentage);
    block.element.textContent = `${blockDuration} Min ${blockIntensity}/km`;

    let intensity = parseFloat(blockIntensity);
    if (intensity <= 1.5) {
        block.classList.add("intensity-low");
    } else if (intensity > 1.5 && intensity <= 2.5) {
        block.classList.add("intensity-medium");
    } else {
        block.classList.add("intensity-high");
    }

    closeModal();
}


// Blöcke beim Laden wiederherstellen
function loadBlocks(date, savedBlocksS) {

    const blockContainer = document.getElementById(`blockContainer`);
    blockContainer.innerHTML = ""; // Verhindert doppeltes Einfügen
    console.log(savedBlocksS)
    let savedBlocks = JSON.parse(savedBlocksS.replace(/\\"/g, '"'))
    console.log(savedBlocks)
    blocks = []


    for (let i = 0; i < savedBlocks.length; i++) {
        blockData = savedBlocks[i]
        blockContainer.classList.add("block-container");
        let block = document.createElement("div");
        block.className = "block";
        block.style.backgroundColor = getColorByPercentage(0); // Default-Farbe
        block.style.height = "100%";
        block.style.marginRight = "5px";
        const totalDuration = document.getElementById(`duration`).value
        const percentage = parseFloat(blockData.duration) / totalDuration * 100;
        console.log(percentage)
        block.style.width = `${percentage}%`;
        block.style.height = "100%";
        block.style.backgroundColor = getColorByPercentage(percentage / 100);
        blockContainer.style.display = "flex";
        blockContainer.style.flexWrap = "nowrap"; // verhindert Umbrüche
        blockContainer.style.overflow = "hidden"; // bei zu großen Blöcken wird nichts umgebrochen
        blockContainer.style.alignItems = "stretch"; // alle Blöcke gleiche Höhe
        block.innerHTML = `${blockData.duration} Min ${blockData.intensity}/km`;


        blockContainer.appendChild(block);
        blocks.push({ element: block, duration: blockData.duration, intensity: blockData.intensity, date });
        block.addEventListener("click", () => {
            selectedBlockIndex = savedBlocks.findIndex(b => b.element === block); // Richtiges Block-Index setzen
            openModal(block, blocks);
        });
    }

    console.log("Geladene Blöcke:", blocks);
}

function openModal(block, blocks) {
    selectedBlockIndex = blocks.findIndex(b => b.element === block);
    document.getElementById('blockModal').style.display = 'block';
    let sport = document.getElementById(`activity_type`).value
    let label = document.getElementById("blockIntensityLabel")
    let input = document.getElementById("blockIntensity")
    switch (sport) {
        case "Schwimmen": label.textContent = "Geschwindigkeit(min/100m)"
            input.placeholder = "1:30"
        case "Radfahren": label.textContent = "Geschwindigkeit(km/h)"
            input.placeholder = "30"
        case "Laufen": label.textContent = "Geschwindigkeit(min/km)"
            input.placeholder = "4:30"
        default: label.textContent = "Geschwindigkeit(min/km)"
            input.placeholder = "4:30"
    }
}

// Modal schließen
function closeModal() {
    document.getElementById('blockModal').style.display = 'none';
}


async function getStats() {
    let lastTenWeeks = [];

    let activity = document.getElementById("activity").value

    const formData = new FormData();
    formData.append('activity_type', activity);
    console.log(activity)

    try {
        const response = await fetch('stats.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }

        const responseText = await response.json();
        console.log(responseText);
        lastTenWeeks.push(responseText)
    } catch (error) {
        console.error('Fehler:', error);
    }




    console.log(lastTenWeeks);

    let lastTenWeeksArray = [[], [], []]
    let lastTenWeeksLabel = [[], [], []]
    for (let i = 0; i < lastTenWeeks.length; i++) {
        for (let j = 0; j < lastTenWeeks[i].length; j++) {
            lastTenWeeksArray[i].push(lastTenWeeks[i][j].Gesamtdauer_Minuten)
            lastTenWeeksLabel[i].push(lastTenWeeks[i][j].Woche)
        }
    }
    console.log(lastTenWeeksArray)
    createChart(
        `Chart`,
        activity + " (Minuten)",
        lastTenWeeksArray[0].reverse(),
        "rgba(255, 99, 132, 0.7)",
        lastTenWeeksLabel[0].reverse()
    );

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

let myChart = null; // Globale Variable für das Diagramm

function createChart(canvasId, label, data, color, weeks) {
    console.log(canvasId);
    const canvas = document.getElementById(canvasId);
    console.log(label);

    if (!canvas) {
        console.error("Canvas mit ID " + canvasId + " nicht gefunden!");
        return;
    }

    const ctx = canvas.getContext("2d");

    // Falls schon ein Diagramm existiert, es zerstören
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: weeks,
            datasets: [
                {
                    label: label,
                    data: data,
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Minuten",
                    },
                },
            },
        },
    });
}

function addTraining(day, month, year, activityType, duration, date, text, distance, blocksToSave) {
    let blocks = JSON.stringify(blocksToSave)
    console.log(blocks)
    const formData1 = new FormData();
    console.log(date)
    formData1.append('date', date);

    fetch('count_entries.php', {
        method: 'POST',
        body: formData1
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Einträge');
            }
            return response.json();
        })
        .then(data => {
            console.log(`Anzahl der Einträge am ${date}:`, data.count);

            let training_id;
            console.log(trainingsIDElement)

            if (trainingsIDElement == "") {
                // Neues Training erstellen
                training_id = `${date}${data.count + 1}`;

                const formData = new FormData();
                formData.append('user_id', 1); // Achtung: besser dynamisch machen!
                formData.append('activity_type', activityType);
                formData.append('duration_minutes', duration);
                formData.append('distance', distance);
                formData.append('text', text);
                formData.append('date', date); // YYYY-MM-DD
                formData.append('training_id', training_id);
                formData.append('blocks', blocks);

                fetch('add_training.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Fehler beim Speichern des Trainings');
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log('Training hinzugefügt:', data);
                    })
                    .catch(error => console.error('Fehler:', error));

            } else {
                // Bestehendes Training aktualisieren
                training_id = parseFloat(trainingsIDElement.slice(-1)); // Letztes Zeichen (ID) extrahieren
                console.log('Training aktualisieren mit ID:', training_id);

                const formData = new FormData();
                formData.append('user_id', 1); // Achtung: besser dynamisch machen!
                formData.append('training_id', `${date}${training_id}`);
                formData.append('activity_type', activityType);
                formData.append('duration_minutes', duration);
                formData.append('date', date); // YYYY-MM-DD
                formData.append('distance', distance);
                formData.append('text', text);
                formData.append('blocks', blocks);

                fetch('edit_training.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Fehler beim Aktualisieren des Trainings');
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log('Antwort:', data);
                        trainingsIDElement = ""
                    })
                    .catch(error => console.error('Fehler:', error));
            }
        })
        .catch(error => console.error('Fehler:', error));
}
// Beispiel für das Laden von Trainings für ein bestimmtes Datum
function loadTraining(day, month, year) {
    let date = `${year}-${(monthNames.indexOf(month) + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    console.log(date)
    const formData = new FormData();
    formData.append('date', date);
    fetch('load_trainings.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.length > 0) {
                console.log(data[0].duration_minutes)
                console.log(document.getElementById("duration").value)
                document.getElementById("activity_type").value = data[0].activity_type
                document.getElementById("duration").value = parseFloat(data[0].duration_minutes)
                document.getElementById("text").value = data[0].text
                document.getElementById("distance").value = parseFloat(data[0].distance)
                trainingsIDElement = data[0].training_id
                loadBlocks(data[0].date, data[0].blocks)
                for (let i = 0; i < data.length + 1; i++) {
                    console.log(i)
                    if (i == data.length && i > 0) {
                        let button = document.createElement("button")
                        button.textContent = "+"
                        document.getElementById("trainings").appendChild(button)
                        button.addEventListener("click", function () {
                            document.getElementById("activity_type").value = "Laufen"
                            document.getElementById("duration").value = null
                            document.getElementById("text").value = ""
                            document.getElementById("distance").value = null
                            trainingsIDElement = ""
                        })
                        break
                    }
                    let button = document.createElement("button")
                    button.textContent = data[i].activity_type
                    document.getElementById("trainings").appendChild(button)
                    button.addEventListener("click", function () {
                        document.getElementById("activity_type").value = data[i].activity_type
                        document.getElementById("duration").value = parseFloat(data[i].duration_minutes)
                        document.getElementById("text").value = data[i].text
                        document.getElementById("distance").value = parseFloat(data[i].distance)
                        trainingsIDElement = data[i].training_id
                        loadBlocks(data[i].date, data[i].blocks)
                    })
                }
            }
        })
        .catch(error => console.error('Error:', error));
}

function deleteTraining(day, month, year) {
    console.log(trainingsIDElement)
    let date = `${year}-${(monthNames.indexOf(month) + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    console.log(date)
    let training_id
    if (trainingsIDElement == "") training_id = date + `${1}`
    else training_id = trainingsIDElement
    const formData = new FormData();
    formData.append('training_id', training_id);
    fetch('delete_training.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.löschen === "erfolgreich") {
                alert("Training erfolgreich gelöscht!");
                showPage('page2', true)
                trainingsIDElement = ""
            } else {
                alert("Fehler beim Löschen des Trainings.");
            }
        })
        .catch(error => console.error('Error:', error));
}

async function startseite() {
    const formData = new FormData();

    fetch('startseite.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Vergangene Trainings:', data.past);
            console.log('Zukünftige Trainings:', data.future);
            if (data.past != null) {
                for (let i = 0; i < data.past.length; i++) {
                    if (data.past[i].tage_seit == 0) {
                        document.getElementById(`vergangen${i + 1}`).innerHTML = "<strong>Heute:</strong> " + data.past[i].activity_type + " | " + data.past[i].duration_minutes + " Minuten"
                    }
                    else if (data.past[i].tage_seit == 1) {
                        document.getElementById(`vergangen${i + 1}`).innerHTML = "<strong>Gestern:</strong> " + data.past[i].activity_type + " | " + data.past[i].duration_minutes + " Minuten"
                    } else if (data.past[i].tage_seit == 2) {
                        document.getElementById(`vergangen${i + 1}`).innerHTML = "<strong>Vorgestern:</strong> " + data.past[i].activity_type + " | " + data.past[i].duration_minutes + " Minuten"
                    } else {
                        document.getElementById(`vergangen${i + 1}`).innerHTML = "<strong>Vor " + data.past[i].tage_seit + " Tagen:</strong> " + data.past[i].activity_type + " | " + data.past[i].duration_minutes + " Minuten"
                    }
                }
            }
            if (data.future != null) {
                for (let i = 0; i < data.future.length; i++) {
                    if (data.future[i].tage_seit == 0) {
                        document.getElementById(`zukunft${i + 1}`).innerHTML = "<strong>Morgen:</strong> " + data.future[i].activity_type + " | " + data.future[i].duration_minutes + " Minuten"
                    }
                    else if (data.future[i].tage_seit == 1) {
                        document.getElementById(`zukunft${i + 1}`).innerHTML = "<strong>Übermorgen:</strong> " + data.future[i].activity_type + " | " + data.future[i].duration_minutes + " Minuten"
                    }
                    else {
                        document.getElementById(`zukunft${i + 1}`).innerHTML = "<strong>In " + (data.future[i].tage_seit - 1) + " Tagen:</strong> " + data.future[i].activity_type + " | " + data.future[i].duration_minutes + " Minuten"
                    }
                }
            }
        })

        .catch(error => console.error('Error:', error));

    fetch('user.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text()) // Erst als Text ausgeben!
        .then(text => {
            console.log("Server-Antwort (Text):", text); // Sehen, was der Server sendet
            return JSON.parse(text); // Dann zu JSON umwandeln
        })
        .then(data => {
            console.log("Server-Antwort (JSON):", data);

            if (data.error) {
                console.error("Fehler:", data.error);
                document.getElementById("user").textContent = "Fehler: " + data.error;
            } else {
                document.getElementById("user").textContent += data.username + "! 🏃‍♀️";
            }
        })
        .catch(error => console.error('Error:', error));
    let records = await getRecords(); // Warte, bis das Promise aufgelöst wird
    let distances = [5, 10, 21];
    for (let j = 0; j < distances.length; j++) {
        if (distances[j] == 21) {
            if (records[j] != null && records[j] != "00:00:00") {
                document.getElementById(`${distances[j]}k`).innerHTML = "<strong>Halbmarathon: </strong>" + records[j]
            }
            continue
        }
        if (records[j] != null && records[j] != "00:00:00") {
            document.getElementById(`${distances[j]}k`).innerHTML = "<strong>" + distances[j] + " km Lauf: </strong>" + records[j]
        }
    }
    ziele().then(ziele => {
        console.log(ziele)

        let activities = ["Schwimmen", "Radfahren", "Laufen"];
        for (let k = 0; k < activities.length; k++) {
            if (ziele[k].goal != null) {
                document.getElementById(`distanzziel${activities[k]}`).innerHTML += " " + ziele[k].goal + " km"
                document.getElementById(`bar${activities[k]}`).style.width = `${ziele[k].progress}%`
            }
        }
    })

    let stundenZiel = await stundenZiele()
    if (stundenZiel.goal != null) {
        document.getElementById(`stundenZiel`).innerHTML += " " + Math.floor(stundenZiel.goal / 60) + ":" + String(stundenZiel.goal % 60).padStart(2, "0") + " Stunden"
        document.getElementById(`barStunden`).style.width = `${stundenZiel.progress}%`
        if (Math.floor(stundenZiel.done / 60) == 1) {
            document.getElementById("motivation").innerHTML = `Du hast schon über ${Math.floor(stundenZiel.done / 60)} Stunde geschafft — weiter so! 🚀`
        } else if (Math.floor(stundenZiel.done / 60) > 1) {
            document.getElementById("motivation").innerHTML = `Du hast schon über ${Math.floor(stundenZiel.done / 60)} Stunden geschafft — weiter so! 🚀`
        }
    }
}

async function getRecords() {
    let array = []
    let records = [5, 10, 21];

    for (let distance of records) {
        const formData = new FormData();
        formData.append('distance', distance);

        try {
            const response = await fetch('getRecord.php', {
                method: 'POST',
                body: formData
            });

            // Antwort als Text holen
            const responseText = await response.text();

            // Prüfen, ob die Antwort mit "<" beginnt (HTML-Fehlermeldung)
            if (responseText.trim().startsWith("<")) {
                console.error("Server-Fehler:", responseText);
                continue; // Gehe zur nächsten Distanz
            }

            // Als JSON parsen
            const data = JSON.parse(responseText);

            console.log(`Rekord für ${distance} km:`, data);
            array.push(data.best_time)
        } catch (error) {
            console.error('Fehler:', error);
        }
    }
    console.log(array)
    return array
}


async function bestzeiten() {
    console.log("ddd")
    let records = [[5, 10, 21], [document.getElementById("best-time-5k").value, document.getElementById("best-time-10k").value, document.getElementById("best-time-half-marathon").value]]
    for (let i = 0; i < records[0].length; i++) {
        const formData = new FormData();
        formData.append('time', records[1][i]);
        formData.append('distance', records[0][i]);

        try {
            console.log("dddd")
            const response = await fetch('records.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Server error: ' + response.status);
            }
            console.log(response)

        } catch (error) {
            console.error('Fehler:', error);
        }
    }
}

async function zielErstellen() {
    console.log(document.getElementById("activity").value, document.getElementById("goal-km").value)
    const formData = new FormData();
    formData.append('activity_type', document.getElementById("activity").value);
    formData.append("wochen_km", document.getElementById("goal-km").value)
    fetch('zielerstellen.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text()) // Erst als Text ausgeben!
        .then(text => {
            console.log(text)
        })
    const formData2 = new FormData();
    formData2.append("wochen_dauer", document.getElementById("goal-time").value)
    fetch('stundenzielerstellen.php', {
        method: 'POST',
        body: formData2
    })
        .then(response => response.text()) // Erst als Text ausgeben!
        .then(text => {
            console.log(text)
        })
}

async function ziele() {
    let array = [];
    let activities = ["Schwimmen", "Radfahren", "Laufen"];

    for (let i = 0; i < activities.length; i++) {
        const formData = new FormData();
        formData.append('activity_type', activities[i]);

        try {
            console.log("Anfrage gesendet für:", activities[i]);

            const response = await fetch('ziele.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Server error: ' + response.status);
            }

            // Wandle die Antwort in JSON um
            const data = await response.json();
            console.log("Antwort für", activities[i], ":", data);

            // Füge das JSON zur Liste hinzu
            array.push(data);
        } catch (error) {
            console.error('Fehler bei', activities[i], ":", error);
        }
    }

    return array;
}

async function stundenZiele() {
    const formData = new FormData();

    try {
        const response = await fetch('stundenziel.php', {
            method: 'POST',
            body: formData
        });

        const text = await response.text();
        console.log("Server-Antwort als Text:", text);
        const json = JSON.parse(text); // JSON manuell parsen
        console.log(json);

        return json; // ✅ Jetzt gibt die Funktion das richtige Ergebnis zurück!
    } catch (error) {
        console.error("Fehler:", error);
        return null; // Falls ein Fehler passiert, null zurückgeben
    }
}
