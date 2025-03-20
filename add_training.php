<?php

// CORS-Header erlauben Anfragen von anderen Quellen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// OPTIONS-Preflight-Anfragen direkt beantworten
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Starte die Session
session_start();
if (!isset($_SESSION['user_id'])) {
    die('Bitte melde dich an.');
}

// Datenbankverbindung
$servername = "localhost";
$username = "root";
$password = "";
$database = "Trainingsplaner";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

// Formulardaten empfangen
$user_id = intval($_SESSION['user_id']);
$activity_type = $conn->real_escape_string($_POST['activity_type']);
$duration = intval($_POST['duration_minutes']);
$date = $_POST['date'] ?? null;

if ($date && preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    // Gültiges Format
} else {
    die('Ungültiges Datum.');
}
$distance = intval($_POST['distance']);
$text = $conn->real_escape_string($_POST['text']);
$training_id = $conn->real_escape_string($_POST['training_id']);
$blocks = $conn->real_escape_string($_POST['blocks']);

// Check: Existiert der User?
$user_check = $conn->query("SELECT id FROM users WHERE id = $user_id");
if ($user_check->num_rows === 0) {
    die('Fehler: Der angegebene Benutzer existiert nicht.');
}

// SQL vorbereiten INSERT INTO trainings (user_id, activity_type, duration_minutes, date, distance, text, training_id) VALUES (?, ?, ?, ?, ?, ?, ?)$user_id, $activity_type, $duration, $date, $distance, $text, $training_id

$stmt = $conn->prepare("INSERT INTO trainings (user_id, activity_type, duration_minutes, date, distance, text, training_id, blocks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isisisss",$user_id, $activity_type, $duration, $date, $distance, $text, $training_id, $blocks);

if ($stmt->execute()) {
    echo "Training erfolgreich gespeichert!";
} else {
    echo "Fehler: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>

