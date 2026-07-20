<?php

session_start();

$allowedOrigins = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Genero.php';
require_once __DIR__ . '/models/Usuario.php';
require_once __DIR__ . '/controllers/GeneroController.php';
require_once __DIR__ . '/controllers/AuthController.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $action = $_GET['action'] ?? $_POST['action'] ?? '';

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'register') {
        $usuario = new Usuario($conexion);
        $authController = new AuthController($usuario);

        echo json_encode($authController->registrar());
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'login') {
        $usuario = new Usuario($conexion);
        $authController = new AuthController($usuario);

        echo json_encode($authController->login());
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'logout') {
        $usuario = new Usuario($conexion);
        $authController = new AuthController($usuario);

        echo json_encode($authController->logout());
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'me') {
        $usuario = new Usuario($conexion);
        $authController = new AuthController($usuario);

        echo json_encode($authController->me());
        exit;
    }

    $genero = new Genero($conexion);
    $controller = new GeneroController($genero);

    echo json_encode($controller->estadoConexion());

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Error al consultar la base de datos'
    ]);
} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor'
    ]);
}
