<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/Env.php';
require_once dirname(__DIR__) . '/src/ApiException.php';
require_once dirname(__DIR__) . '/src/Response.php';
require_once dirname(__DIR__) . '/src/Database.php';
require_once dirname(__DIR__) . '/src/ResendMailer.php';
require_once dirname(__DIR__) . '/src/AuthService.php';

Env::load(dirname(__DIR__) . '/.env');

$frontendUrl = Env::get('FRONTEND_URL', 'http://localhost:5173');
header('Access-Control-Allow-Origin: ' . $frontendUrl);
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Vary: Origin');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $payload = readJsonPayload();

    $authService = new AuthService(Database::connection(), new ResendMailer());

    if ($method === 'GET' && $path === '/api/health') {
        Response::success([
            'status' => 'ok',
            'service' => 'reachify-backend',
        ]);
    }

    if ($method === 'POST' && $path === '/api/auth/register') {
        Response::success($authService->register($payload), 201);
    }

    if ($method === 'POST' && $path === '/api/auth/verify-email') {
        Response::success($authService->verifyEmail($payload, $_SERVER));
    }

    if ($method === 'POST' && $path === '/api/auth/resend-code') {
        Response::success($authService->resendVerificationCode($payload));
    }

    if ($method === 'POST' && $path === '/api/auth/login') {
        Response::success($authService->login($payload, $_SERVER));
    }

    Response::error(404, 'route_not_found', 'A rota solicitada nao existe.');
} catch (ApiException $exception) {
    Response::error(
        $exception->status(),
        $exception->errorCode(),
        $exception->getMessage(),
        $exception->meta()
    );
} catch (PDOException $exception) {
    Response::error(
        500,
        'database_error',
        'Nao foi possivel acessar o banco de dados configurado.',
        ['detail' => $exception->getMessage()]
    );
} catch (Throwable $exception) {
    Response::error(
        500,
        'internal_server_error',
        'O backend encontrou um erro inesperado.',
        ['detail' => $exception->getMessage()]
    );
}

function readJsonPayload(): array
{
    $rawBody = file_get_contents('php://input');

    if ($rawBody === false || trim($rawBody) === '') {
        return [];
    }

    $decodedBody = json_decode($rawBody, true);

    if (!is_array($decodedBody)) {
        throw new ApiException(400, 'invalid_json', 'O corpo da requisicao precisa estar em JSON valido.');
    }

    return $decodedBody;
}
