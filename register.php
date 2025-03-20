<?php
session_start();
include 'config.php';

$errors = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Eingaben validieren
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
        // Überprüfen, ob der Benutzername oder die E-Mail bereits existiert
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->bind_param("ss", $username, $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $errors[] = "Benutzername oder E-Mail bereits vergeben.";
        } else {
            // Passwort hashen und User in DB speichern
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $username, $hashed_password, $email);

            if ($stmt->execute()) {
                // **Hier wird die User-ID nach erfolgreicher Registrierung geholt**
                $user_id = $conn->insert_id;

                // Standard-Bestzeiten hinzufügen
                $zeiten = [5, 10, 21];
                $time = null;

                // **Statement für records nur einmal vorbereiten**
                $stmt_record = $conn->prepare("INSERT INTO records (user_id, distance, time) VALUES (?, ?, ?)");

                foreach ($zeiten as $distance) {
                    $stmt_record->bind_param("iis", $user_id, $distance, $time);
                    $stmt_record->execute();
                }

                $stmt_record->close();

                echo "Registrierung erfolgreich!";
                header("Location: login.php");
                exit();
            } else {
                $errors[] = "Fehler bei der Registrierung: " . $conn->error;
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
    <title>Registrierung</title>
</head>
<body>
    <h2>Registriere dich</h2>

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

        <label>Email:</label><br>
        <input type="email" name="email" required><br><br>

        <label>Passwort (mind. 6 Zeichen):</label><br>
        <input type="password" name="password" required><br><br>

        <button type="submit">Registrieren</button>
    </form>

    <p>Schon registriert? <a href="login.php">Hier einloggen</a></p>
</body>
</html>
