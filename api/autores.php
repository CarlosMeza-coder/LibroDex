<?php
require __DIR__ . '/helpers.php';

$base = require __DIR__ . '/data/autores.php';
$archivoNuevos = __DIR__ . '/data/autores_nuevos.json';

$nuevos = [];
if (file_exists($archivoNuevos)) {
    $contenido = json_decode(file_get_contents($archivoNuevos), true);
    if (is_array($contenido)) {
        $nuevos = $contenido;
    }
}

$autores = array_merge($base, $nuevos);
$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = (int) $_GET['id'];
            foreach ($autores as $autor) {
                if ($autor['id'] === $id) {
                    responder($autor, 200);
                }
            }
            responder(['error' => "No se encontró el autor con id $id"], 404);
        }

        responder($autores, 200);

    case 'POST':
        $entrada = leerJson();

        $nombre    = trim($entrada['nombre'] ?? '');
        $iniciales = strtoupper(trim($entrada['iniciales'] ?? ''));
        $datos     = trim($entrada['datos'] ?? '');
        $insignia  = trim($entrada['insignia'] ?? '');

        if ($nombre === '' || $datos === '' || $insignia === '') {
            responder(['error' => 'Los campos nombre, datos e insignia son obligatorios.'], 422);
        }

        if (mb_strlen($nombre) < 3) {
            responder(['error' => 'El nombre del autor debe tener al menos 3 caracteres.'], 422);
        }

        if ($iniciales === '') {
            $palabras = preg_split('/\s+/', $nombre);
            foreach (array_slice($palabras, 0, 3) as $p) {
                $iniciales .= mb_strtoupper(mb_substr($p, 0, 1));
            }
        } elseif (mb_strlen($iniciales) < 2 || mb_strlen($iniciales) > 4) {
            responder(['error' => 'Las iniciales deben tener entre 2 y 4 caracteres.'], 422);
        }

        $ultimoId = 0;
        foreach ($autores as $a) {
            if ($a['id'] > $ultimoId) {
                $ultimoId = $a['id'];
            }
        }

        $nuevoAutor = [
            'id'        => $ultimoId + 1,
            'iniciales' => $iniciales,
            'nombre'    => $nombre,
            'datos'     => $datos,
            'insignia'  => $insignia,
        ];

        $nuevos[] = $nuevoAutor;
        $guardado = file_put_contents(
            $archivoNuevos,
            json_encode($nuevos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
            LOCK_EX
        );

        if ($guardado === false) {
            responder(['error' => 'No se pudo guardar el autor en el servidor.'], 500);
        }

        responder($nuevoAutor, 201);

    default:
        responder(['error' => 'Método no permitido'], 405);
}