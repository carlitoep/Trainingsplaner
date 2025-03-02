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
$user_id = intval($_POST['user_id']);
$activity_type = $conn->real_escape_string($_POST['activity_type']);
$duration = intval($_POST['duration_minutes']);
$date = $conn->real_escape_string($_POST['date']);
$distance = intval($_POST['distance']);
$text = $conn->real_escape_string($_POST['text']);
$training_id = $conn->real_escape_string($_POST['training_id']);

// Check, ob das Training existiert und dem User gehört
$check_training = $conn->prepare("SELECT * FROM trainings WHERE training_id = ? AND user_id = ?");
$check_training->bind_param("si", $training_id, $user_id);
$check_training->execute();
$result = $check_training->get_result();

if ($result->num_rows === 0) {
    die('Fehler: Training nicht gefunden oder du hast keine Berechtigung.');
}

// Update-Statement
$stmt = $conn->prepare("UPDATE trainings SET activity_type = ?, duration_minutes = ?, date = ?, distance = ?, text = ? WHERE training_id = ?");
$stmt->bind_param("sisiss", $activity_type, $duration, $date, $distance, $text, $training_id);

if ($stmt->execute()) {
    echo "Training erfolgreich aktualisiert!";
} else {
    echo "Fehler: " . $stmt->error;
}

$stmt->close();
$conn->close();

?>
