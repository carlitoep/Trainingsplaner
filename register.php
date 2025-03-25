<?php
session_start();
include 'config.php';

$errors = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($email) || empty($password)) {
        $errors[] = "Bitte fülle alle Felder aus.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Ungültige E-Mail-Adresse.";
    } elseif (strlen($password) < 6) {
        $errors[] = "Das Passwort muss mindestens 6 Zeichen lang sein.";
    } else {
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->bind_param("ss", $username, $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $errors[] = "Benutzername oder E-Mail bereits vergeben.";
        } else {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $username, $hashed_password, $email);

            if ($stmt->execute()) {
                header("Location: login.php");
                exit();
            } else {
                $errors[] = "Fehler bei der Registrierung.";
            }
            $stmt->close();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrierung</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
    <div class="form-box" id="registerBox">
            <h2>Registrieren</h2>
            <form method="POST" id="registerForm">
                <input name="username" type="text" placeholder="Benutzername" required>
                <input name="email" type="email" placeholder="E-Mail" required>
                <input name="password" type="password" placeholder="Passwort" required>
                <button type="submit" class="btn">Registrieren</button>
            </form>
            <p>Schon ein Konto? <a href="login.php">Login</a></p>
        </div>
    </div>
</body>
</html>
