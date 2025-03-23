<?php
session_start();
include 'config.php'; // Stellt die Verbindung zur Datenbank her

header('Content-Type: application/json'); // JSON als Antwort-Format setzen

// Prüfen, ob der Benutzer eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    die(json_encode(['error' => 'Bitte melde dich an.']));
}

$user_id = intval($_SESSION['user_id']);
$week_start = date("Y-m-d", strtotime("monday this week"));
$week_end = date("Y-m-d", strtotime("sunday this week"));

// Ziel (wochen_dauer) aus der Datenbank holen und in Minuten umwandeln
$sql_goal = "SELECT IFNULL(wochen_dauer, '00:00:00') AS wochen_dauer FROM ziele WHERE user_id = ?";
$stmt = $conn->prepare($sql_goal);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$goal_hms = $result->fetch_assoc()['wochen_dauer']; // Format hh:mm:ss
$stmt->close();

// Funktion zur Umwandlung von hh:mm:ss in Minuten
function timeToMinutes($time) {
    sscanf($time, "%d:%d:%d", $hours, $minutes, $seconds);
    return ($hours * 60) + $minutes; // Sekunden ignorieren
}

// Wochenziel in Minuten umwandeln
$goal_minutes = round(timeToMinutes($goal_hms));

// Tatsächlich absolvierte Zeit summieren (direkt als Minuten)
$sql_done = "SELECT IFNULL(SUM(duration_minutes), 0) as total FROM trainings WHERE user_id = ? AND date BETWEEN ? AND ?";
$stmt = $conn->prepare($sql_done);
$stmt->bind_param("iss", $user_id, $week_start, $week_end);
$stmt->execute();
$result = $stmt->get_result();
$done_minutes = $result->fetch_assoc()['total']; // Bereits in Minuten gespeichert
$stmt->close();
$conn->close();

// Fortschritt berechnen
$progress = $goal_minutes > 0 ? round(($done_minutes / $goal_minutes) * 100, 1) : 0;

// JSON-Ausgabe
echo json_encode([
    'goal' => $goal_minutes,   // Ziel in Minuten
    'done' => $done_minutes,   // Erreichte Zeit in Minuten
    'progress' => $progress    // Fortschritt in %
]);
?>
