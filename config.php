<?php
$host = "localhost";
$username = "152283m120060_1";
$password = "Carlitoep133i";
$dbname = "152283m120060_1";

// Verbindung mit MySQLi
$conn = new mysqli($host, $username, $password, $dbname);

// Verbindung prüfen
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}
?>
