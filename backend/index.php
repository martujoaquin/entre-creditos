<?php

session_start();

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Genero.php';
require_once __DIR__ . '/models/Pelicula.php';
require_once __DIR__ . '/models/Usuario.php';
require_once __DIR__ . '/middleware/RequireAuth.php';
require_once __DIR__ . '/middleware/RequireAdmin.php';
require_once __DIR__ . '/controllers/GeneroController.php';
require_once __DIR__ . '/controllers/PeliculaController.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/DevelopmentController.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $action = $_GET['action'] ?? $_POST['action'] ?? null;

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

    if ($action === 'resetDatabase') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            exit;
        }

        $error = RequireAdmin::verificar();

        if ($error !== null) {
            echo json_encode($error);
            exit;
        }

        $developmentController = new DevelopmentController($conexion);

        echo json_encode($developmentController->resetDatabase($_POST));
        exit;
    }

    if (($_GET['resource'] ?? '') === 'generos') {
        $genero = new Genero($conexion);
        $controller = new GeneroController($genero);
        $metodo = $_SERVER['REQUEST_METHOD'];

        if ($metodo === 'GET') {
            $error = RequireAuth::verificar();

            if ($error !== null) {
                echo json_encode($error);
                exit;
            }

            echo json_encode($controller->listar());
            exit;
        }

        if ($metodo === 'POST') {
            $error = RequireAdmin::verificar();

            if ($error !== null) {
                echo json_encode($error);
                exit;
            }

            echo json_encode($controller->crear());
            exit;
        }

        if ($metodo === 'PATCH') {
            $error = RequireAdmin::verificar();

            if ($error !== null) {
                echo json_encode($error);
                exit;
            }

            parse_str(file_get_contents('php://input'), $datos);
            echo json_encode($controller->actualizar($datos));
            exit;
        }

        if ($metodo === 'DELETE') {
            $error = RequireAdmin::verificar();

            if ($error !== null) {
                echo json_encode($error);
                exit;
            }

            parse_str(file_get_contents('php://input'), $datos);
            echo json_encode($controller->eliminar($datos));
            exit;
        }
    }

    if (($_GET['resource'] ?? '') === 'peliculas') {
        $pelicula = new Pelicula($conexion);
        $genero = new Genero($conexion);
        $controller = new PeliculaController($pelicula, $genero);
        $metodo = $_SERVER['REQUEST_METHOD'];

        if ($metodo === 'POST' && ($_POST['_method'] ?? '') === 'PATCH') {
            $metodo = 'PATCH';
        }

        if ($metodo === 'GET') {
            $error = RequireAuth::verificar();

            if ($error !== null) {
                echo json_encode($error);
                exit;
            }

            $incluirInactivas = (int) ($_SESSION['es_admin'] ?? 0) === 1;

            echo json_encode($controller->listar($incluirInactivas));
            exit;
        }

        if ($metodo === 'POST') {
            $error = RequireAdmin::verificar();

            if ($error !== null) {
                echo json_encode($error);
                exit;
            }

            echo json_encode($controller->crear());
            exit;
        }

        if ($metodo === 'PATCH') {
            $error = RequireAdmin::verificar();

            if ($error !== null) {
                echo json_encode($error);
                exit;
            }

            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $datos = $_POST;
            } else {
                parse_str(file_get_contents('php://input'), $datos);
            }

            echo json_encode($controller->actualizar($datos, $_FILES));
            exit;
        }
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
