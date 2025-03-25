<?php
session_start();
include 'config.php';

$errors = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($password)) {
        $errors[] = "Bitte fülle beide Felder aus.";
    } else {
        $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            header("Location: Trainingsplaner.html");
            exit();
        } else {
            $errors[] = "Falscher Benutzername oder Passwort.";
        }
        $stmt->close();
    }
}
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login & Registrierung</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <div class="container">
        <div class="form-box" id="loginBox">
            <h2>Login</h2>
            <form method="POST" id="loginForm">
                <input name="username" type="text" placeholder="Benutzername" required>
                <input name="password" type="password" placeholder="Passwort" required>
                <button type="submit" class="btn">Login</button>
            </form>
            <p>Noch kein Konto? <a href="register.php">Registrieren</a></p>
        </div>

        
    </div>
</body>
</html>

</body>
</html>
