<?php
session_start();
include 'config.php'; // Stellt die Verbindung zur Datenbank her

header('Content-Type: application/json'); // JSON als Antwort-Format setzen

// Prüfen, ob der Benutzer eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    die(json_encode(['error' => 'Bitte melde dich an.']));
}

$user_id = intval($_SESSION['user_id']); // Benutzer-ID aus der Session
$activity_type = $conn->real_escape_string($_POST['activity_type']);
$week_start = date("Y-m-d", strtotime("monday this week")); // Start der Woche
$week_end = date("Y-m-d", strtotime("sunday this week"));   // Ende der Woche

// Ziel aus der Datenbank holen (angenommen, das Wochenziel steht in der `ziele`-Tabelle)
$sql_goal = "SELECT wochen_km FROM kmziele WHERE user_id = ? AND activity_type = ?";
$stmt = $conn->prepare($sql_goal);
$stmt->bind_param("is", $user_id, $activity_type);
$stmt->execute();
$result = $stmt->get_result();
$goal = $result->fetch_assoc()['wochen_km'] ?? 0; // Falls kein Ziel gesetzt ist, Standardwert 0
$stmt->close();

// Tatsächlich gelaufene Kilometer in der Woche berechnen
$sql_done = "SELECT SUM(distance) as total FROM trainings WHERE user_id = ? AND activity_type = ? AND date BETWEEN ? AND ?";
$stmt = $conn->prepare($sql_done);
$stmt->bind_param("isss", $user_id, $activity_type, $week_start, $week_end);
$stmt->execute();
$result = $stmt->get_result();
$done = $result->fetch_assoc()['total'] ?? 0; // Falls kein Training gemacht wurde, Standardwert 0
$stmt->close();
$conn->close();

// Fortschritt berechnen
$progress = $goal > 0 ? round(($done / $goal) * 100, 1) : 0;

// JSON-Ausgabe
echo json_encode([
    'goal' => $goal,
    'done' => $done,
    'progress' => $progress
]);
?>
