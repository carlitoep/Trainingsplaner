<?php
session_start(); // Session starten, falls noch nicht gestartet
include 'config.php';

header('Content-Type: application/json'); // JSON-Header setzen

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Nicht eingeloggt"]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_POST['date']) || empty($_POST['date'])) {
        echo json_encode(["error" => "Kein Datum übermittelt"]);
        exit();
    }

    $date = date('Y-m-d', strtotime($_POST['date']));
    $user_id = intval($_SESSION['user_id']);

    $sql = "SELECT COUNT(*) AS count FROM trainings WHERE date = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(["error" => "Datenbankfehler: " . $conn->error]);
        exit();
    }

    $stmt->bind_param("si", $date, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        echo json_encode(["count" => intval($row['count'])]);
    } else {
        echo json_encode(["count" => 0]);
    }

    $stmt->close();
    $conn->close();
    exit();
}
?>
