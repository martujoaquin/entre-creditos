<?php

session_start();

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Genero.php';
require_once __DIR__ . '/models/Usuario.php';
require_once __DIR__ . '/controllers/GeneroController.php';
require_once __DIR__ . '/controllers/AuthController.php';

header('Content-Type: application/json; charset=utf-8');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'register') {
        $usuario = new Usuario($conexion);
        $authController = new AuthController($usuario);

        echo json_encode($authController->registrar());
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'login') {
        $usuario = new Usuario($conexion);
        $authController = new AuthController($usuario);

        echo json_encode($authController->login());
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'logout') {
        $usuario = new Usuario($conexion);
        $authController = new AuthController($usuario);

        echo json_encode($authController->logout());
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['action'] ?? '') === 'me') {
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
