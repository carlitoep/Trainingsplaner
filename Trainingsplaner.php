<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Trainingsplaner</title>
</head>
<body>
    <h1>Willkommen, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h1>
    <p>Hier kannst du deine Trainings planen.</p>

    <a href="logout.php">Abmelden</a>

    <!-- Dein HTML-Code von Trainingsplaner.html kommt hier rein -->
</body>
</html>
