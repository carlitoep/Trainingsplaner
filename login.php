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
        // Benutzer aus der DB holen
        $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user && password_verify($password, $user['password'])) {
            // Session setzen und weiterleiten
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
    <title>Login</title>
</head>
<body>
    <h2>Login</h2>

    <?php
    if (!empty($errors)) {
        echo '<ul>';
        foreach ($errors as $error) {
            echo "<li style='color: red;'>$error</li>";
        }
        echo '</ul>';
    }
    ?>

    <form method="POST">
        <label>Benutzername:</label><br>
        <input type="text" name="username" required><br><br>

        <label>Passwort:</label><br>
        <input type="password" name="password" required><br><br>

        <button type="submit">Einloggen</button>
    </form>

    <p>Noch keinen Account? <a href="register.php">Registrieren</a></p>
</body>
</html>
