<?php

class GeneroController
{
    private Genero $genero;

    public function __construct(Genero $genero)
    {
        $this->genero = $genero;
    }

    public function estadoConexion(): array
    {
        return [
            'success' => true,
            'message' => 'Backend conectado correctamente',
            'generos' => $this->genero->contarTodos()
        ];
    }
}
