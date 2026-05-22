<?php

final class Response
{
    public static function json(int $status, array $payload): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success(array $data = [], int $status = 200): never
    {
        self::json($status, ['success' => true, 'data' => $data]);
    }

    public static function error(
        int $status,
        string $code,
        string $message,
        array $meta = []
    ): never {
        self::json($status, [
            'success' => false,
            'error' => [
                'code' => $code,
                'message' => $message,
                'meta' => $meta,
            ],
        ]);
    }
}
