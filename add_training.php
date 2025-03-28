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
include 'config.php';

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

