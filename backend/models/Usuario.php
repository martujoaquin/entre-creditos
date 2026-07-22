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
                    activo,
                    fecha_registro
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
                    avatar,
                    fecha_registro
                FROM usuarios
                WHERE id_usuario = :id_usuario
                LIMIT 1";
        $consulta = $this->conexion->prepare($sql);
        $consulta->bindValue(':id_usuario', $idUsuario, PDO::PARAM_INT);
        $consulta->execute();

        $usuario = $consulta->fetch();

        return $usuario ?: null;
    }

    public function buscarCredencialesPorId(int $idUsuario): ?array
    {
        $sql = "SELECT
                    id_usuario,
                    password_hash
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

    public function actualizarPerfil(int $idUsuario, string $nombreCompleto, ?string $avatar): bool
    {
        if ($avatar === null) {
            $sql = "UPDATE usuarios
                    SET nombre_completo = :nombre_completo
                    WHERE id_usuario = :id_usuario";
            $consulta = $this->conexion->prepare($sql);
            $consulta->bindValue(':nombre_completo', $nombreCompleto);
            $consulta->bindValue(':id_usuario', $idUsuario, PDO::PARAM_INT);

            return $consulta->execute();
        }

        $sql = "UPDATE usuarios
                SET nombre_completo = :nombre_completo,
                    avatar = :avatar
                WHERE id_usuario = :id_usuario";
        $consulta = $this->conexion->prepare($sql);
        $consulta->bindValue(':nombre_completo', $nombreCompleto);
        $consulta->bindValue(':avatar', $avatar);
        $consulta->bindValue(':id_usuario', $idUsuario, PDO::PARAM_INT);

        return $consulta->execute();
    }

    public function actualizarPassword(int $idUsuario, string $passwordHash): bool
    {
        $sql = "UPDATE usuarios
                SET password_hash = :password_hash
                WHERE id_usuario = :id_usuario";
        $consulta = $this->conexion->prepare($sql);
        $consulta->bindValue(':password_hash', $passwordHash);
        $consulta->bindValue(':id_usuario', $idUsuario, PDO::PARAM_INT);

        return $consulta->execute();
    }

    public function obtenerEstadisticasPerfil(int $idUsuario): array
    {
        $sqlResumen = "SELECT
                            COUNT(r.id_resena) AS cantidad_resenas,
                            AVG(r.puntuacion) AS promedio_puntuacion
                        FROM resenas r
                        INNER JOIN peliculas p ON p.id_pelicula = r.id_pelicula
                        WHERE r.id_usuario = :id_usuario
                        AND p.activo = 1";
        $consultaResumen = $this->conexion->prepare($sqlResumen);
        $consultaResumen->bindValue(':id_usuario', $idUsuario, PDO::PARAM_INT);
        $consultaResumen->execute();
        $resumen = $consultaResumen->fetch() ?: [];

        $sqlGenero = "SELECT g.nombre
                      FROM resenas r
                      INNER JOIN peliculas p ON p.id_pelicula = r.id_pelicula
                      INNER JOIN generos g ON g.id_genero = p.id_genero
                      WHERE r.id_usuario = :id_usuario
                      AND p.activo = 1
                      GROUP BY g.id_genero, g.nombre
                      ORDER BY COUNT(r.id_resena) DESC, g.nombre ASC
                      LIMIT 1";
        $consultaGenero = $this->conexion->prepare($sqlGenero);
        $consultaGenero->bindValue(':id_usuario', $idUsuario, PDO::PARAM_INT);
        $consultaGenero->execute();

        $sqlCompartidas = "SELECT COUNT(id_compartida)
                           FROM resenas_compartidas
                           WHERE id_usuario_remitente = :id_usuario";
        $consultaCompartidas = $this->conexion->prepare($sqlCompartidas);
        $consultaCompartidas->bindValue(':id_usuario', $idUsuario, PDO::PARAM_INT);
        $consultaCompartidas->execute();

        $cantidad = (int) ($resumen['cantidad_resenas'] ?? 0);
        $promedio = $resumen['promedio_puntuacion'] !== null
            ? round((float) $resumen['promedio_puntuacion'], 1)
            : null;

        return [
            'cantidad_resenas' => $cantidad,
            'promedio_puntuacion' => $promedio,
            'genero_mas_resenado' => $consultaGenero->fetchColumn() ?: null,
            'cantidad_compartidas' => (int) $consultaCompartidas->fetchColumn()
        ];
    }
}
