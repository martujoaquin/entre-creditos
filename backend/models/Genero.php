<?php

class Genero
{
    private PDO $conexion;

    public function __construct(PDO $conexion)
    {
        $this->conexion = $conexion;
    }

    public function contarTodos(): int
    {
        $consulta = $this->conexion->query("SELECT COUNT(*) AS total FROM generos");
        $resultado = $consulta->fetch();

        return (int) $resultado['total'];
    }
}
