<?php

use \Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once 'dbConnection.php';

if (!isset($_COOKIE['jwtToken'])) {
    echo json_encode(['message' => 'Not logged in.', 'success' => false]);
    die();
}

$jwtToken = $_COOKIE['jwtToken'];
$key = $_ENV['JWT_KEY'];

try {
    $decodedToken = JWT::decode($jwtToken, new Key($key, 'HS256'));
} catch (Exception $e) {
    echo json_encode(['message' => 'Not logged in.', 'success' => false]);
    die();
}

if (isset($_POST)) {
    foreach ($_POST as &$field) {
        $field = htmlspecialchars($field);
    }
}

if (isset($_GET['get-transactions'])) {

    $month = 0;
    if (isset($_GET['month'])) {
        $month = (int) $_GET['month'];
    }

    $query = ('SELECT * FROM transaction
        WHERE id_user = :user_id');

    if ($month <= 12 && $month >= 1) {
        $query .= ' AND MONTH(date) = :month';
    }

    if ($month <= -1 && $month >= -12) {
        $month = abs($month);
        $query .= ' AND MONTH(date) <> :month';
    }

    if (isset($_GET['recurent_only'])) {
        $query .= ' AND frequency != "once"';
    }

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $decodedToken->id);

    if ($month <= 12 && $month >= 1) {
        $stmt->bindParam(':month', $month);
    }

    $stmt->execute();
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($transactions);
}

if (isset($_GET['get-previous-budget'])) {
    if (isset($_GET['month']) && isset($_GET['year'])) {
        $target_date = $_GET['year'] . '-' . $_GET['month'] . '-01';
    } else {
        $target_date = date('Y-m-d');
    }

    $stmt = $db->prepare('
        SELECT 
        SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) AS total_expense
        FROM transaction
        WHERE id_user = :user_id 
        AND DATE(date) < :target_date
    ');
    $stmt->execute([
        'user_id' => $decodedToken->id,
        'target_date' => $target_date
    ]);
    $previous_budget = $stmt->fetch(PDO::FETCH_ASSOC);
    $remaining = $previous_budget['total_income'] - $previous_budget['total_expense'];
    echo json_encode($previous_budget + ['remaining' => $remaining]);
}

if (isset($_GET['add-transaction'])) {
    if (!isset($_POST['type']) || !isset($_POST['frequency']) || !isset($_POST['title']) || !isset($_POST['date']) || !isset($_POST['description']) || !isset($_POST['id_category']) || !isset($_POST['amount'])) {
        echo json_encode(['message' => 'Missing data.', 'success' => false]);
        die();
    }
    $stmt = $db->prepare(
        'INSERT INTO transaction (type, frequency, title, date, description, id_category, id_user, amount)
        VALUES (:type, :frequency, :title, :date, :description, :id_category, :id_user, :amount)'
    );
    $stmt->execute([
        'type' => $_POST['type'],
        'frequency' => $_POST['frequency'],
        'title' => $_POST['title'],
        'date' => $_POST['date'],
        'description' => $_POST['description'],
        'id_category' => $_POST['id_category'],
        'id_user' => $decodedToken->id,
        'amount' => $_POST['amount']
    ]);
    echo json_encode(['message' => 'Transaction added.', 'success' => true]);
}

if (isset($_GET['del-transaction']) && isset($_GET['id'])) {
    $stmt = $db->prepare('DELETE FROM transaction WHERE id = :id AND id_user = :user_id');
    $stmt->execute(['id' => $_GET['id'], 'user_id' => $decodedToken->id]);
    if ($stmt->rowCount() === 0) {
        echo json_encode(['message' => 'Transaction not found.', 'success' => false]);
        die();
    }
    echo json_encode(['message' => 'Transaction deleted.', 'success' => true]);
}

if (isset($_GET['modif-transaction']) && isset($_GET['id'])) {
    if (!isset($_POST['type']) || !isset($_POST['frequency']) || !isset($_POST['title']) || !isset($_POST['date']) || !isset($_POST['description']) || !isset($_POST['id_category']) || !isset($_POST['amount'])) {
        echo json_encode(['message' => 'Missing data.', 'success' => false]);
        die();
    }
    $stmt = $db->prepare(
        'UPDATE transaction SET type = :type, frequency = :frequency, title = :title, date = :date, description = :description, id_category = :id_category, amount = :amount
        WHERE id = :id AND id_user = :user_id'
    );
    $stmt->execute([
        'type' => $_POST['type'],
        'frequency' => $_POST['frequency'],
        'title' => $_POST['title'],
        'date' => $_POST['date'],
        'description' => $_POST['description'],
        'id_category' => $_POST['id_category'],
        'amount' => $_POST['amount'],
        'id' => $_GET['id'],
        'user_id' => $decodedToken->id
    ]);
    if ($stmt->rowCount() === 0) {
        echo json_encode(['message' => 'Transaction not found.', 'success' => false]);
        die();
    }
    echo json_encode(['message' => 'Transaction modified.', 'success' => true]);
}
