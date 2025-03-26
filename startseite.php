<?php
session_start();

include 'config.php';
// Überprüfen, ob der User eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    die(json_encode(['error' => 'Nicht eingeloggt']));
}

$user_id = intval($_SESSION['user_id']);
$now = date('Y-m-d H:i:s');

// Vergangene Trainings (letzte 3)
$sql_past = "
    SELECT * FROM trainings
    WHERE date < ? AND user_id = ?
    ORDER BY date DESC
    LIMIT 3
";


function tageSeitDatum($datum) {
    $gegebenesDatum = new DateTime($datum);
    $heute = new DateTime();
    
    // Differenz berechnen
    $differenz = $heute->diff($gegebenesDatum);
    
    return $differenz->days;
}

$stmt_past = $conn->prepare($sql_past);
$stmt_past->bind_param("si", $now, $user_id);
$stmt_past->execute();
$result_past = $stmt_past->get_result();

$past_trainings = [];
while ($row = $result_past->fetch_assoc()) {
    $row['tage_seit'] = tageSeitDatum($row['date']); // Anzahl der Tage seit dem Training hinzufügen
    $past_trainings[] = $row;
}
$stmt_past->close();

// Zukünftige Trainings (nächste 2)
$sql_future = "
    SELECT * FROM trainings
    WHERE date >= ? AND user_id = ?
    ORDER BY date ASC
    LIMIT 2
";

$stmt_future = $conn->prepare($sql_future);
$stmt_future->bind_param("si", $now, $user_id);
$stmt_future->execute();
$result_future = $stmt_future->get_result();

$future_trainings = [];
while ($row = $result_future->fetch_assoc()) {
    $row['tage_seit'] = tageSeitDatum($row['date']); // Anzahl der Tage seit dem Training hinzufügen
    $future_trainings[] = $row;
}
$stmt_future->close();

$conn->close();

// JSON-Ausgabe
header('Content-Type: application/json');
echo json_encode([
    'past' => $past_trainings,
    'future' => $future_trainings
]);
?>
