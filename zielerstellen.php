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
$wochen_km =  intval($_POST['wochen_km']);

$stmt = $conn->prepare("DELETE FROM kmziele WHERE user_id = ? AND activity_type = ? ");
$stmt->bind_param("is", $user_id, $activity_type);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();
$stmt = $conn->prepare("INSERT INTO kmziele (user_id, wochen_km, activity_type) VALUES (?,?,?)");
$stmt->bind_param("iis", $user_id, $wochen_km,$activity_type);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();




// JSON-Ausgabe
echo json_encode([
    "Successful"
]);
?>
