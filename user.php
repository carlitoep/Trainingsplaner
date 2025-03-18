<?php
// Debugging aktivieren
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Header für JSON setzen
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();

// Sicherstellen, dass eine JSON-Antwort kommt, auch bei Fehlern
function jsonError($message) {
    echo json_encode(["error" => $message]);
    exit;
}

// Prüfen, ob der Benutzer eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    jsonError("Bitte melde dich an.");
}

// Datenbankverbindung
$servername = "localhost";
$username = "root";
$password = "";
$database = "Trainingsplaner";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    jsonError("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

// user_id aus der Session
$user_id = intval($_SESSION['user_id']);

if ($user_id === 0) {
    jsonError("user_id fehlt oder ist ungültig.");
}

// SQL-Abfrage
$sql = "SELECT username FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    jsonError("SQL-Fehler: " . $conn->error);
}

$stmt->bind_param("i", $user_id);

if (!$stmt->execute()) {
    jsonError("Fehler beim Ausführen der Abfrage: " . $stmt->error);
}

$result = $stmt->get_result();
$user = $result->fetch_assoc(); 

// Prüfen, ob ein Benutzer gefunden wurde
if (!$user) {
    jsonError("Benutzer nicht gefunden.");
}

// JSON-Antwort zurückgeben
echo json_encode($user);

$stmt->close();
$conn->close();
?>
