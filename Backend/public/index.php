<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/Env.php';
require_once dirname(__DIR__) . '/src/ApiException.php';
require_once dirname(__DIR__) . '/src/Response.php';
require_once dirname(__DIR__) . '/src/Database.php';
require_once dirname(__DIR__) . '/src/ResendMailer.php';
require_once dirname(__DIR__) . '/src/AuthService.php';
require_once dirname(__DIR__) . '/src/OnboardingService.php';

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

    $scriptName = (string) ($_SERVER['SCRIPT_NAME'] ?? '');
    $scriptDirectory = normalizePath((string) dirname($scriptName));
    $path = normalizePath($path);

    $shouldTrimScriptDirectory = $scriptName !== '' && str_ends_with($scriptName, '.php');

    if ($shouldTrimScriptDirectory && $scriptDirectory !== '' && $scriptDirectory !== '/' && str_starts_with($path, $scriptDirectory)) {
        $path = substr($path, strlen($scriptDirectory)) ?: '/';
    }

    if (str_starts_with($path, '/index.php')) {
        $path = substr($path, strlen('/index.php')) ?: '/';
    }

    $apiPathPosition = strpos($path, '/api/');
    if ($apiPathPosition !== false) {
        $path = substr($path, $apiPathPosition) ?: '/';
    }

    $authService = new AuthService(Database::connection(), new ResendMailer());
    $onboardingService = new OnboardingService(Database::connection());

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

    if ($method === 'GET' && $path === '/api/onboarding') {
        Response::success($onboardingService->getStatus($_SERVER));
    }

    if ($method === 'POST' && $path === '/api/onboarding') {
        Response::success($onboardingService->save($payload, $_SERVER));
    }

    Response::error(404, 'route_not_found', 'A rota solicitada nao existe.', [
        'debug' => [
            'method' => $method,
            'normalized_path' => $path,
            'request_uri' => $_SERVER['REQUEST_URI'] ?? null,
            'script_name' => $_SERVER['SCRIPT_NAME'] ?? null,
            'php_self' => $_SERVER['PHP_SELF'] ?? null,
            'path_info' => $_SERVER['PATH_INFO'] ?? null,
            'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? null,
        ],
    ]);
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

function normalizePath(string $path): string
{
    $normalizedPath = str_replace('\\', '/', $path);

    if ($normalizedPath === '') {
        return '/';
    }

    if ($normalizedPath[0] !== '/') {
        $normalizedPath = '/' . $normalizedPath;
    }

    return rtrim($normalizedPath, '/') ?: '/';
}
