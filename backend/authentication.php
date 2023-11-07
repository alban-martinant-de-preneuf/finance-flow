<?php

use \Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once 'dbConnection.php';

function getUser(string $email, PDO $db): ?array
{
    $stmt = $db->prepare('SELECT * FROM user WHERE email = :email');
    $stmt->execute(['email' => $email]);
    if ($stmt->rowCount() === 0) {
        return null;
    }
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

if (isset($_GET['signin'])) {
    if (!isset($_POST['email']) || !isset($_POST['password']) || !isset($_POST['passwordConfirm'])) {
        echo json_encode(['message' => 'Please fill in all fields.', 'success' => false]);
        die();
    }

    foreach ($_POST as &$arg) {
        if (empty($arg)) {
            echo json_encode(['message' => 'Please fill in all fields.', 'success' => false]);
            die();
        }
        $arg = htmlspecialchars($arg);
    }

    $email = $_POST['email'];
    $password = $_POST['password'];
    $password2 = $_POST['passwordConfirm'];

    if ($password !== $password2) {
        echo json_encode(['message' => 'Passwords do not match.', 'success' => false]);
        die();
    }

    $user = getUser($email, $db);

    if ($user) {
        echo json_encode(['message' => 'User already exists.', 'success' => false]);
        die();
    }

    $password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $db->prepare('INSERT INTO user (email, password) VALUES (:email, :password)');
    $stmt->execute(['email' => $email, 'password' => $password]);

    echo json_encode(['message' => 'User created.', 'success' => true]);
}

if (isset($_GET['login'])) {
    if (!isset($_POST['email']) || !isset($_POST['password'])) {
        echo json_encode(['message' => 'Please fill in all fields.', 'success' => false]);
        die();
    }

    foreach ($_POST as &$element) {
        if (empty($element)) {
            echo json_encode(['message' => 'Please fill in all fields.', 'success' => false]);
            die();
        }
        $element = htmlspecialchars($element);
    }

    $email = $_POST['email'];
    $password = $_POST['password'];

    $user = getUser($email, $db);

    if (!$user) {
        echo json_encode(['message' => 'email or password is incorrect.', 'success' => false]);
        die();
    }

    if (!password_verify($password, $user['password'])) {
        echo json_encode(['message' => 'email or password is incorrect.', 'success' => false]);
        die();
    }

    $payload = [
        'iat' => time(),
        'exp' => time() + 3600,
        'id' => $user['id'],
        'email' => $user['email']
    ];

    $key = $_ENV['JWT_KEY'];

    $jwt = JWT::encode($payload, $key, 'HS256');

    setcookie('jwtToken', $jwt, time() + 3600, '/', '', false, true);

    echo json_encode([
        'message' => 'User logged in.',
        'success' => true,
        'user' => [$user['id'], $user['email']]
    ]);
}

if (isset($_GET['logout'])) {
    if (isset($_COOKIE['jwtToken'])) {
        setcookie('jwtToken', $_COOKIE['jwtToken'], time(), '/', '', false, true);
    }
    echo json_encode(['message' => 'User logged out.', 'success' => true]);
}

if (isset($_GET['check-auth'])) {
    if (isset($_COOKIE['jwtToken'])) {
        $jwtToken = $_COOKIE['jwtToken'];
        $key = $_ENV['JWT_KEY'];
        try {
            $decodedToken = JWT::decode($jwtToken, new Key($key, 'HS256'));
            echo json_encode([
                'message' => 'User logged in.',
                'success' => true,
                'user' => [$decodedToken->id, $decodedToken->email]]);
        } catch (Exception $e) {
            echo json_encode(['message' => 'Not logged in.' . $e, 'success' => false]);
            die();
        }
    } else {
        echo json_encode(['message' => 'Not logged in.', 'success' => false]);
        die();
    }
}
