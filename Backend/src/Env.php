<?php

final class Env
{
    /** @var array<string, string> */
    private static array $values = [];

    public static function load(string $path): void
    {
        if (!is_file($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        if ($lines === false) {
            return;
        }

        foreach ($lines as $line) {
            $trimmedLine = trim($line);

            if ($trimmedLine === '' || str_starts_with($trimmedLine, '#')) {
                continue;
            }

            [$key, $value] = array_pad(explode('=', $trimmedLine, 2), 2, '');
            $normalizedKey = trim($key);

            if ($normalizedKey === '') {
                continue;
            }

            $normalizedValue = trim($value);
            $normalizedValue = trim($normalizedValue, "\"'");

            self::$values[$normalizedKey] = $normalizedValue;
            $_ENV[$normalizedKey] = $normalizedValue;
            putenv($normalizedKey . '=' . $normalizedValue);
        }
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        if (array_key_exists($key, self::$values)) {
            return self::$values[$key];
        }

        $envValue = $_ENV[$key] ?? getenv($key);

        if ($envValue === false || $envValue === null || $envValue === '') {
            return $default;
        }

        return (string) $envValue;
    }
}
