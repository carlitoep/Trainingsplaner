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
        <h1>Willkommen zurück, [Benutzername]! 🏃‍♀️</h1>
        <p>Dein Weg zu neuen Bestzeiten beginnt hier.</p>
    </header>

    <main class="dashboard">
        <!-- Ziele und Fortschritt -->
        <section class="card goals">
            <h2>Deine Wochenziele 📈</h2>
            <p><strong>Trainingsziel:</strong> 3 Workouts</p>
            <p><strong>Distanzziel:</strong> 20 km</p>
            <div class="progress-bar">
                <div class="progress" style="width: 50%;"></div>
            </div>
            <p>Du hast 10 km geschafft — weiter so! 🚀</p>
        </section>

        <!-- Letzte Aktivitäten -->
        <section class="card recent-activities">
            <h2>Deine letzten Trainings 🏅</h2>
            <ul>
                <li><strong>Gestern:</strong> 5 km Laufen | 30 Min. | Tempo: 5:30 min/km</li>
                <li><strong>Vorgestern:</strong> 40 Min. Radfahren | 15 km</li>
                <li><strong>Sonntag:</strong> 1 km Schwimmen | 25 Min.</li>
            </ul>
        </section>

        <!-- Nächste geplante Trainings -->
        <section class="card upcoming-trainings">
            <h2>Nächste geplante Trainings 📅</h2>
            <ul>
                <li>🏃‍♂️ Lauftraining — 10 km am Mittwoch, 6. März, 17:00 Uhr</li>
                <li>🚴‍♀️ Radtraining — 20 km am Samstag, 9. März, 10:00 Uhr</li>
            </ul>
            <a id="kalenderbtn" class="btn">Zum Kalender →</a>
        </section>

        <!-- Bestzeiten -->
        <section class="card best-times">
            <h2>Deine Bestzeiten 🏆</h2>
            <ul>
                <li><strong>5 km Lauf:</strong> 23:45 Min.</li>
                <li><strong>10 km Lauf:</strong> 50:10 Min.</li>
                <li><strong>Halbmarathon:</strong> 1:45:00 Std.</li>
            </ul>
        </section>

        <!-- Schnelle Links -->
        <section class="quick-links">
            <a id="TrainingHinzufügen" class="btn">Neues Training hinzufügen</a>
            <a id="StatsAnzeigen" class="btn">Statistiken ansehen</a>
            <a  id="Bestzeiten" class="btn">Bestzeiten und Vorhersagen</a>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Trainingsplaner. Bleib stark und bleib dran! 💪</p>
    </footer>
            `;
            document.getElementById('kalenderbtn').addEventListener('click', function () {
                showPage('page2', btn2);
            });
            document.getElementById('TrainingHinzufügen').addEventListener('click', function () {
                showPage('page2', btn2);
            });
            document.getElementById('StatsAnzeigen').addEventListener('click', function () {
                showPage('page3', btn3);
            });
            document.getElementById('Bestzeiten').addEventListener('click', function () {
                showPage('page4', btn4);
            });
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
            <label for="timeRange">Zeitraum auswählen:</label>
            <select id="timeRange" onchange="getStats()">
                <option value="7">Woche</option>
                <option value="30">Monat</option>
                <option value="365">Jahr</option>
            </select>
        </section>

        <section class="card">
            <h2>Trainingsdauer: <span id="selected-range">Woche</span></h2>
            <div class="chart-container">
                <canvas id="runningChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="cyclingChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="swimmingChart"></canvas>
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
                <!-- Seite für Bestzeiten -->
<div id="page-best-times" class="page-content">
    <header class="header">
        <h1>Gib deine Bestzeiten ein 🏆</h1>
        <p>Trage deine Bestzeiten für verschiedene Distanzen ein und speichere sie!</p>
    </header>

    <main class="best-times-form">
        <section class="card">
            <h2>Bestzeiten hinzufügen</h2>
            <form id="best-times-form">
                <label for="best-time-5k">5 km Lauf:</label>
                <input type="text" id="best-time-5k" placeholder="z.B. 00:23:45" required>

                <label for="best-time-10k">10 km Lauf:</label>
                <input type="text" id="best-time-10k" placeholder="z.B. 00:50:10" required>

                <label for="best-time-half-marathon">Halbmarathon:</label>
                <input type="text" id="best-time-half-marathon" placeholder="z.B. 01:45:00" required>

                <button type="submit" class="btn">Bestzeiten speichern</button>
            </form>
        </section>

        <section class="card">
            <h2>Deine gespeicherten Bestzeiten 🏅</h2>
            <ul id="saved-best-times">
                <!-- Hier werden die gespeicherten Bestzeiten angezeigt -->
            </ul>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Trainingsplaner. Bleib stark und bleib dran! 💪</p>
    </footer>`
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
                        <option value="running">Running</option>
                        <option value="cycling">Cycling</option>
                        <option value="swimming">Swimming</option>
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

                <div id="blockModal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border: 1px solid #ccc; padding: 20px;">
                    <label for="blockDuration">Blockdauer (Minuten):</label>
                    <input type="number" id="blockDuration" placeholder="15">
                    <label id="blockIntensityLabel" for="blockIntensity"></label>
                    <input type="text" id="blockIntensity" placeholder="1:30">
                    <button id="saveBlock" onclick="setBlockDuration(${day}, '${month}', ${year})">Speichern</button>
                    <button onclick="closeModal()">Abbrechen</button>
                </div>

                <button onclick="addBlock(${day}, '${month}', ${year})">Block hinzufügen</button>
                <button type="submit" onclick="save(${day}, '${month}', ${year})" id="button">Save</button>
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
    showPage("page2")

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


async function getStats() {
    let range = parseInt(document.getElementById('timeRange').value);
    let lastTenWeeks = [];

    let array = ["running", "cycling", "swimming"];
    for (let i = 0; i < array.length; i++) {
        const formData = new FormData();
        formData.append('user_id', 1); // Deine user_id einfügen
        formData.append('activity_type', array[i]);

        try {
            const response = await fetch('stats.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Server error: ' + response.status);
            }

            // Antworte als Text (nicht JSON)
            const responseText = await response.json();
            console.log(responseText);
            lastTenWeeks.push(responseText)
            // Wenn du JSON erwartest, aber Text erhältst, kannst du später entscheiden, wie du den Inhalt behandeln möchtest
            /* try {
                 const data = JSON.parse(responseText); // Versuchen, es als JSON zu parsen
                 console.log('Trainingsdaten:', data);
                 lastTenWeeks.push(data); // Speichert das Ergebnis in lastTenWeeks
             } catch (jsonError) {
                 console.error('Fehler beim Parsen der JSON-Antwort:', jsonError);
             }
 */
        } catch (error) {
            console.error('Fehler:', error);
        }
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
        "runningChart",
        "Laufen (Minuten)",
        lastTenWeeksArray[0].reverse(),
        "rgba(255, 99, 132, 0.7)",
        lastTenWeeksLabel[0].reverse()
    );
    createChart(
        "cyclingChart",
        "Radfahren (Minuten)",
        lastTenWeeksArray[1].reverse(),
        "rgba(54, 162, 235, 0.7)",
        lastTenWeeksLabel[1].reverse()
    );
    createChart(
        "swimmingChart",
        "Schwimmen (Minuten)",
        lastTenWeeksArray[2].reverse(),
        "rgba(75, 192, 192, 0.7)",
        lastTenWeeksLabel[2].reverse()
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

function createChart(canvasId, label, data, color, weeks) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    //const weeks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]


    new Chart(ctx, {
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

                fetch('http://localhost/trainingsplaner/add_training.php', {
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
                        document.getElementById("activity_type").value = "running"
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
        })
        .catch(error => console.error('Error:', error));
}
