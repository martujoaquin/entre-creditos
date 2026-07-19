<?php

class AuthController
{
    private Usuario $usuario;

    public function __construct(Usuario $usuario)
    {
        $this->usuario = $usuario;
    }

    public function registrar(): array
    {
        $nombreCompleto = trim($_POST['nombre_completo'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';

        if ($nombreCompleto === '' || $email === '' || $password === '' || $confirmPassword === '') {
            return [
                'success' => false,
                'message' => 'Complete todos los campos obligatorios'
            ];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => false,
                'message' => 'El email no es válido'
            ];
        }

        if($password !== $confirmPassword) {
            return [
                'success' => false,
                'message' => 'Las contraseñas no coinciden'
            ];
        }

        if (!$this->passwordEsSegura($password)) {
            return [
                'success' => false,
                'message' => 'La contraseña no cumple los requisitos de seguridad'
            ];
        }

        if ($this->usuario->buscarPorEmail($email) !== null) {
            return [
                'success' => false,
                'message' => 'El email ya está registrado'
            ];
        }

        $this->usuario->registrar($nombreCompleto, $email, $password);

        return [
            'success' => true,
            'message' => 'Usuario registrado correctamente'
        ];
    }

    public function login(): array
    {
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if ($email === '' || $password === '') {
            return [
                'success' => false,
                'message' => 'Complete todos los campos obligatorios'
            ];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => false,
                'message' => 'El email no es válido'
            ];
        }

        $usuario = $this->usuario->buscarPorEmail($email);

        if ($usuario === null || !password_verify($password, $usuario['password_hash'])) {
            return [
                'success' => false,
                'message' => 'Email o contraseña incorrectos'
            ];
        }

        if ((int) $usuario['activo'] !== 1) {
            return [
                'success' => false,
                'message' => 'El usuario se encuentra inactivo'
            ];
        }

        $_SESSION['id_usuario'] = (int) $usuario['id_usuario'];
        $_SESSION['nombre_completo'] = $usuario['nombre_completo'];
        $_SESSION['es_admin'] = (int) $usuario['es_admin'];

        return [
            'success' => true,
            'message' => 'Inicio de sesión correcto',
            'usuario' => [
                'id_usuario' => (int) $usuario['id_usuario'],
                'nombre_completo' => $usuario['nombre_completo'],
                'email' => $usuario['email'],
                'es_admin' => (int) $usuario['es_admin'],
                'avatar' => $usuario['avatar']
            ]
        ];
    }

    public function me(): array
    {
        if (!isset($_SESSION['id_usuario'])) {
            return [
                'success' => false,
                'message' => 'No hay una sesión activa'
            ];
        }

        return [
            'success' => true,
            'usuario' => [
                'id_usuario' => (int) $_SESSION['id_usuario'],
                'nombre_completo' => $_SESSION['nombre_completo'],
                'es_admin' => (int) $_SESSION['es_admin']
            ]
        ];
    }

    public function logout(): array
    {
        if (!isset($_SESSION['id_usuario'])) {
            return [
                'success' => false,
                'message' => 'No hay una sesión activa'
            ];
        }

        $_SESSION = [];
        session_destroy();

        return [
            'success' => true,
            'message' => 'Sesión cerrada correctamente'
        ];
    }

    private function passwordEsSegura(string $password): bool
    {
        return strlen($password) >= 8
            && preg_match('/[A-Z]/', $password)
            && preg_match('/[0-9]/', $password)
            && preg_match('/[^A-Za-z0-9]/', $password);
    }
}
