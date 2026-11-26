<?php
require __DIR__ . '/helpers.php';
require __DIR__ . '/db.php';

function validarAutor(array $entrada): array
{
    $nombre    = trim($entrada['nombre'] ?? '');
    $iniciales = strtoupper(trim($entrada['iniciales'] ?? ''));
    $datos     = trim($entrada['datos'] ?? '');
    $insignia  = trim($entrada['insignia'] ?? '');

    if ($nombre === '' || $datos === '' || $insignia === '' || mb_strlen($nombre) < 3) {
        responder(['error' => 'Datos inválidos: nombre (mínimo 3 caracteres), datos e insignia son obligatorios'], 422);
    }

    if ($iniciales === '') {
        $palabras = preg_split('/\s+/', $nombre);
        foreach (array_slice($palabras, 0, 3) as $p) {
            $iniciales .= mb_strtoupper(mb_substr($p, 0, 1));
        }
    } elseif (mb_strlen($iniciales) < 2 || mb_strlen($iniciales) > 4) {
        responder(['error' => 'Las iniciales deben tener entre 2 y 4 caracteres'], 422);
    }

    return [$iniciales, $nombre, $datos, $insignia];
}

try {
    $pdo    = conectar();
    $metodo = $_SERVER['REQUEST_METHOD'];
    $id     = isset($_GET['id']) ? (int) $_GET['id'] : null;

    switch ($metodo) {
        case 'GET':
            if ($id !== null) {
                $stmt = $pdo->prepare('SELECT id_autor AS id, iniciales, nombre, datos, insignia FROM autores WHERE id_autor = :id');
                $stmt->execute(['id' => $id]);
                $autor = $stmt->fetch();

                if (!$autor) {
                    responder(['error' => 'No se encontró el autor'], 404);
                }
                responder($autor, 200);
            }

            $buscar = trim($_GET['buscar'] ?? '');
            $stmt = $pdo->prepare(
                'SELECT id_autor AS id, iniciales, nombre, datos, insignia FROM autores WHERE nombre LIKE :buscar ORDER BY id_autor'
            );
            $stmt->execute(['buscar' => "%$buscar%"]);
            responder($stmt->fetchAll(), 200);

        case 'POST':
            [$iniciales, $nombre, $datos, $insignia] = validarAutor(leerJson());

            $stmt = $pdo->prepare(
                'INSERT INTO autores (iniciales, nombre, datos, insignia) VALUES (:iniciales, :nombre, :datos, :insignia)'
            );
            $stmt->execute([
                'iniciales' => $iniciales,
                'nombre'    => $nombre,
                'datos'     => $datos,
                'insignia'  => $insignia,
            ]);

            responder([
                'id'        => (int) $pdo->lastInsertId(),
                'iniciales' => $iniciales,
                'nombre'    => $nombre,
                'datos'     => $datos,
                'insignia'  => $insignia,
            ], 201);

        case 'PUT':
            if ($id === null) {
                responder(['error' => 'Falta el id'], 400);
            }
            [$iniciales, $nombre, $datos, $insignia] = validarAutor(leerJson());

            $existe = $pdo->prepare('SELECT id_autor FROM autores WHERE id_autor = :id');
            $existe->execute(['id' => $id]);
            if (!$existe->fetch()) {
                responder(['error' => 'No se encontró el autor'], 404);
            }

            $stmt = $pdo->prepare(
                'UPDATE autores SET iniciales = :iniciales, nombre = :nombre, datos = :datos, insignia = :insignia WHERE id_autor = :id'
            );
            $stmt->execute([
                'iniciales' => $iniciales,
                'nombre'    => $nombre,
                'datos'     => $datos,
                'insignia'  => $insignia,
                'id'        => $id,
            ]);

            responder([
                'id'        => $id,
                'iniciales' => $iniciales,
                'nombre'    => $nombre,
                'datos'     => $datos,
                'insignia'  => $insignia,
            ], 200);

        case 'DELETE':
            if ($id === null) {
                responder(['error' => 'Falta el id'], 400);
            }

            $stmt = $pdo->prepare('DELETE FROM autores WHERE id_autor = :id');
            $stmt->execute(['id' => $id]);

            if ($stmt->rowCount() === 0) {
                responder(['error' => 'No se encontró el autor'], 404);
            }

            http_response_code(204);
            exit;

        default:
            responder(['error' => 'Método no permitido'], 405);
    }
} catch (PDOException $e) {
   responder(['error' => 'Error interno del servidor'], 500);
}