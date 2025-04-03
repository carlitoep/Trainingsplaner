<?php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "trainingsplaner";

// Verbindung mit MySQLi
$conn = new mysqli($host, $username, $password, $dbname);

// Verbindung prüfen
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}
?>
