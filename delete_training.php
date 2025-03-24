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

$training_id = $conn->real_escape_string($_POST['training_id']);



$stmt = $conn->prepare("DELETE FROM trainings WHERE user_id = ? AND training_id = ?");
$stmt->bind_param("is",$user_id,  $training_id);

if ($stmt->execute()) {
    echo json_encode(["löschen" => "erfolgreich"]);
} else {
    echo json_encode(["error" => "Fehler beim Löschen"]);
}

$stmt->close();
$conn->close();
?>

