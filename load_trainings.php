<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    die(json_encode([]));
}

$servername = "localhost";
$username = "root";
$password = "";
$database = "Trainingsplaner";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die(json_encode([]));
}

$user_id = $_SESSION['user_id'];
$date = $conn->real_escape_string($_GET['date']);

$sql = "SELECT activity_type, duration_minutes, distance, text, training_id FROM trainings 
        WHERE user_id = '$user_id' AND date = '$date'";

$result = $conn->query($sql);
$trainings = [];
while ($row = $result->fetch_assoc()) {
    $trainings[] = $row;
}

echo json_encode($trainings);

$conn->close();
?>