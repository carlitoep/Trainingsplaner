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

include 'config.php';
// Formulardaten empfangen
$user_id = intval($_SESSION['user_id']);
$distance = intval($_POST['distance']);



// Check: Existiert der User?
$user_check = $conn->query("SELECT id FROM users WHERE id = $user_id");
if ($user_check->num_rows === 0) {
    die(json_encode(['error' => 'Fehler: Der angegebene Benutzer existiert nicht.']));
}

$stmt = $conn->prepare("SELECT MIN(time) AS best_time FROM records WHERE user_id = ? AND distance = ?");
$stmt->bind_param("ii", $user_id, $distance);
$stmt->execute();
$result = $stmt->get_result();
$record = $result->fetch_assoc();

// Prüfen, ob ein Rekord existiert
if (!$record) {
    die(json_encode(['error' => 'Kein Rekord gefunden.']));
}

// JSON-Antwort zurückgeben
echo json_encode($record);

$stmt->close();
$conn->close();

?>
