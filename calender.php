<?php
session_start();
include 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Nicht eingeloggt"]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $month = intval($_POST['month']);
    $year = intval($_POST['year']);
    $user_id = intval($_SESSION['user_id']);

    // ✅ Korrekte SQL-Abfrage mit Semikolon am Ende
    $sql = "SELECT 
                DAY(date) AS tag, 
                GROUP_CONCAT(DISTINCT activity_type ORDER BY activity_type SEPARATOR ', ') AS aktivitäten
            FROM trainings
            WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?
            GROUP BY tag
            ORDER BY tag;";

    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(["error" => "Datenbankfehler: " . $conn->error]);
        exit();
    }

    // ✅ Korrekte `bind_param`-Syntax mit Komma zwischen Variablen
    $stmt->bind_param("iii", $user_id, $year, $month);
    $stmt->execute();
    $result = $stmt->get_result();

    // ✅ Daten als Array verarbeiten
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data); // JSON-Antwort senden

    $stmt->close();
    $conn->close();
    exit();
}
?>
