<?php
// Debugging aktivieren
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS-Header erlauben Anfragen von anderen Quellen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json'); // JSON als Rückgabeformat

// OPTIONS-Preflight-Anfragen direkt beantworten
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Session starten und Benutzer checken
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Nicht angemeldet']);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$database = "Trainingsplaner";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Verbindung fehlgeschlagen: ' . $conn->connect_error]);
    exit();
}

// Eingaben validieren
$user_id = $_SESSION['user_id'];
$date = isset($_POST['date']) ? $_POST['date'] : null;

if (!$date || !strtotime($date)) {
    echo json_encode(['error' => 'Ungültiges Datum']);
    exit();
}

$date = date('Y-m-d', strtotime($date));

// SQL-Statement mit prepared statement
$stmt = $conn->prepare("SELECT activity_type, duration_minutes, distance, text, training_id, date, blocks FROM trainings WHERE user_id = ? AND date = ?");
$stmt->bind_param("is", $user_id, $date);
$stmt->execute();
$result = $stmt->get_result();

$trainings = [];
while ($row = $result->fetch_assoc()) {
    $trainings[] = $row;
}

echo json_encode($trainings);

$stmt->close();
$conn->close();
?>
