<?php

class Usuario
{
    private PDO $conexion;

    public function __construct(PDO $conexion)
    {
        $this->conexion = $conexion;
    }

    public function buscarPorEmail(string $email): ?array
    {
        $sql = "SELECT
                    id_usuario,
                    nombre_completo,
                    email,
                    password_hash,
                    es_admin,
                    avatar,
                    activo
                FROM usuarios
                WHERE email = :email
                LIMIT 1";
        $consulta = $this->conexion->prepare($sql);
        $consulta->bindValue(':email', $email);
        $consulta->execute();

        $usuario = $consulta->fetch();

        return $usuario ?: null;
    }

    public function buscarPublicoPorId(int $idUsuario): ?array
    {
        $sql = "SELECT
                    id_usuario,
                    nombre_completo,
                    email,
                    es_admin,
                    avatar
                FROM usuarios
                WHERE id_usuario = :id_usuario
                LIMIT 1";
        $consulta = $this->conexion->prepare($sql);
        $consulta->bindValue(':id_usuario', $idUsuario, PDO::PARAM_INT);
        $consulta->execute();

        $usuario = $consulta->fetch();

        return $usuario ?: null;
    }

    public function registrar(string $nombreCompleto, string $email, string $password): bool
    {
        $sql = "INSERT INTO usuarios (
                    nombre_completo,
                    email,
                    password_hash,
                    es_admin,
                    avatar,
                    activo
                ) VALUES (
                    :nombre_completo,
                    :email,
                    :password_hash,
                    0,
                    :avatar,
                    1
                )";

        $consulta = $this->conexion->prepare($sql);

        return $consulta->execute([
            ':nombre_completo' => $nombreCompleto,
            ':email' => $email,
            ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
            ':avatar' => 'uploads/avatars/default-avatar.png'
        ]);
    }
}
