<?php
session_start();
include 'config.php'; // Stellt die Verbindung zur Datenbank her

header('Content-Type: application/json'); // JSON als Antwort-Format setzen

// Prüfen, ob der Benutzer eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    die(json_encode(['error' => 'Bitte melde dich an.']));
}

$user_id = intval($_SESSION['user_id']); // Benutzer-ID aus der Session
$wochen_dauer = $_POST['wochen_dauer'] ?? null;

// Prüfen, ob das Feld leer ist
if (empty($wochen_dauer)) {
    die(json_encode(['error' => 'Bitte eine Zeit im Format hh:mm:ss eingeben.']));
}

// Regex für das Format HH:MM:SS (24-Stunden-Format)
if (!preg_match('/^(2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/', $wochen_dauer)) {
    die(json_encode(['error' => 'Ungültiges Zeitformat! Bitte hh:mm:ss verwenden.']));
}

// MySQL erwartet oft Zeitangaben im Format 'HH:MM:SS'
$wochen_dauer = date("H:i:s", strtotime($wochen_dauer));

// Bestehendes Ziel löschen
$stmt = $conn->prepare("DELETE FROM ziele WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->close();

// Neues Ziel speichern
$stmt = $conn->prepare("INSERT INTO ziele (user_id, wochen_dauer) VALUES (?, ?)");
$stmt->bind_param("is", $user_id, $wochen_dauer); 
$stmt->execute();
$stmt->close();

$conn->close();

// JSON-Ausgabe
echo json_encode(["success" => "Zeit gespeichert!"]);
?>
