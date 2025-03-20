<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);


// CORS-Header erlauben Anfragen von anderen Quellen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json'); // JSON-Header setzen

// OPTIONS-Preflight-Anfragen direkt beantworten
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Starte die Session
session_start();
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

// Formulardaten empfangen
$user_id = intval($_SESSION['user_id']);
$time = $_POST['time'] ?? null;
$distance = intval($_POST['distance']);


// Check: Existiert der User?
$user_check = $conn->query("SELECT id FROM users WHERE id = $user_id");
if ($user_check->num_rows === 0) {
    die(json_encode(['error' => 'Fehler: Der angegebene Benutzer existiert nicht.']));
}

// Neuen Rekord speichern
$stmt = $conn->prepare("INSERT INTO records (user_id, distance, time) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $user_id, $distance, $time);
if (!$stmt->execute()) {
    die(json_encode(['error' => "Fehler: " . $stmt->error]));
}

echo json_encode(['success' => 'Bestzeit erfolgreich gespeichert!']);
$stmt->close();
$conn->close();

?>
