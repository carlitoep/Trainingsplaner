<?php
// Debugging aktivieren
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS für lokale Tests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();

// Optional: Session-Check (falls nötig)
if (!isset($_SESSION['user_id'])) {
    die(json_encode(['error' => 'Bitte melde dich an.']));
}

// Datenbankverbindung
$servername = "localhost";
$username = "root";
$password = "";
$database = "Trainingsplaner";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die(json_encode(['error' => 'Verbindung fehlgeschlagen: ' . $conn->connect_error]));
}

// user_id aus POST lesen
if (!isset($_POST['user_id']) || !isset($_POST['activity_type'])) {
    die('Fehlende POST-Daten');
}
$user_id = intval($_POST['user_id'] ?? 0);
$activity_type = $conn->real_escape_string($_POST['activity_type']);


if ($user_id === 0) {
    die(json_encode(['error' => 'user_id fehlt oder ist ungültig.']));
}

// SQL-Abfrage
$sql = "WITH week_range AS (
    -- Erstellen einer Liste der Wochen im gewünschten Zeitraum (z. B. letzten 10 Wochen)
    SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n WEEK), '%Y-%u') AS Jahr_Woche
    FROM (SELECT @row := @row + 1 AS n FROM information_schema.columns, (SELECT @row := 0) r LIMIT 10) numbers
)

SELECT 
    w.Jahr_Woche AS Woche,
    COALESCE(COUNT(t.training_id), 0) AS Anzahl_Trainings,
    COALESCE(SUM(t.duration_minutes), 0) AS Gesamtdauer_Minuten,
    COALESCE(AVG(t.duration_minutes), 0) AS Durchschnittsdauer_Minuten,
    COALESCE(SUM(t.distance), 0) AS Gesamtdistanz_KM,
    MIN(t.date) AS Wochenstart,
    MAX(t.date) AS Wochenende
FROM 
    week_range w
LEFT JOIN trainings t 
    ON YEAR(t.date) = YEAR(STR_TO_DATE(CONCAT(w.Jahr_Woche, '-1'), '%Y-%u-%w'))  -- Berechne den ersten Tag der Woche
    AND WEEK(t.date, 1) = WEEK(STR_TO_DATE(CONCAT(w.Jahr_Woche, '-1'), '%Y-%u-%w'), 1)
    AND t.user_id = ? 
    AND t.activity_type = ?
GROUP BY w.Jahr_Woche
ORDER BY w.Jahr_Woche DESC";


$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $user_id, $activity_type);

// Fehlerprüfung für die SQL-Ausführung
if (!$stmt->execute()) {
    die(json_encode(['error' => 'Fehler beim Ausführen der Abfrage: ' . $stmt->error]));
}

$result = $stmt->get_result();

// Daten sammeln
$trainings = [];
while ($row = $result->fetch_assoc()) {
    $trainings[] = $row;
}

// Überprüfe, ob Trainingsdaten existieren
if (empty($trainings)) {
    die(json_encode(['error' => 'Keine Trainingsdaten gefunden.']));
}

echo json_encode($trainings);

$stmt->close();
$conn->close();

?>
