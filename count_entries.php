<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $date = date('Y-m-d', strtotime($_POST['date'])); // Entfernen oder absichern!
    $sql = "SELECT COUNT(*) AS count FROM trainings WHERE date = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $date);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    
    echo json_encode(["count" => $row['count']]);
}
?>
