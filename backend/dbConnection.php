<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, DELETE');

require_once 'vendor/autoload.php';

session_start();

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();


$db = getDatabase();

function getDatabase(): PDO {
    try {
        $db = new PDO(
            $_ENV['TYPE'] . ':dbname=' . $_ENV['DBNAME']
                . ';host=' . $_ENV['HOST']
                . ';charset=' . $_ENV['CHARSET'],
            $_ENV['USER'],
            $_ENV['PASSWORD']
        );
        $db->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
    } catch(PDOException $e) {
        echo json_encode(['error' => 'Could not connect to database.']);
        die();
    }
    return $db;
}