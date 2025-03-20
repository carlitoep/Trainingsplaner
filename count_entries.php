<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $date = date('Y-m-d', strtotime($_POST['date'])); // Entfernen oder absichern!
    $user_id = intval($_SESSION['user_id']);
    $sql = "SELECT COUNT(*) AS count FROM trainings WHERE date = ? AND user_id=?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $date,$user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    
    echo json_encode(["count" => $row['count']]);
}
?>
