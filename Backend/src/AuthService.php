<?php

final class AuthService
{
    public function __construct(
        private readonly PDO $database,
        private readonly ResendMailer $mailer
    ) {
    }

    public function register(array $payload): array
    {
        $email = $this->normalizeEmail($payload['email'] ?? null);
        $password = $this->normalizePasswordForRegistration($payload['password'] ?? null);

        $existingUser = $this->findUserByEmail($email);
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        if ($existingUser && $existingUser['account_status'] === 'active') {
            throw new ApiException(409, 'email_already_exists', 'Este e-mail ja esta cadastrado.');
        }

        $this->database->beginTransaction();

        try {
            if ($existingUser) {
                $userId = (int) $existingUser['id'];

                $statement = $this->database->prepare(
                    'UPDATE users
                     SET password_hash = :password_hash,
                         account_status = :account_status,
                         plan_slug = :plan_slug,
                         plan_status = :plan_status,
                         credits_balance = :credits_balance,
                         email_verified_at = NULL,
                         updated_at = NOW()
                     WHERE id = :id'
                );

                $statement->execute([
                    'password_hash' => $passwordHash,
                    'account_status' => 'pending_verification',
                    'plan_slug' => 'free',
                    'plan_status' => 'trial',
                    'credits_balance' => 250,
                    'id' => $userId,
                ]);
            } else {
                $statement = $this->database->prepare(
                    'INSERT INTO users
                        (uuid, email, password_hash, plan_slug, plan_status, credits_balance, account_role, account_status, timezone, locale)
                     VALUES
                        (:uuid, :email, :password_hash, :plan_slug, :plan_status, :credits_balance, :account_role, :account_status, :timezone, :locale)'
                );

                $statement->execute([
                    'uuid' => $this->generateUuid(),
                    'email' => $email,
                    'password_hash' => $passwordHash,
                    'plan_slug' => 'free',
                    'plan_status' => 'trial',
                    'credits_balance' => 250,
                    'account_role' => 'owner',
                    'account_status' => 'pending_verification',
                    'timezone' => 'America/Sao_Paulo',
                    'locale' => 'pt-BR',
                ]);

                $userId = (int) $this->database->lastInsertId();
            }

            $verification = $this->issueVerificationCode($userId);
            $this->database->commit();
        } catch (Throwable $exception) {
            if ($this->database->inTransaction()) {
                $this->database->rollBack();
            }

            throw $exception;
        }

        $this->mailer->sendVerificationCode($email, $verification['code']);

        return [
            'email' => $email,
            'expires_at' => $verification['expires_at'],
        ];
    }

    public function verifyEmail(array $payload, array $server): array
    {
        $email = $this->normalizeEmail($payload['email'] ?? null);
        $code = $this->normalizeVerificationCode($payload['code'] ?? null);
        $user = $this->findUserByEmail($email);

        if (!$user) {
            throw new ApiException(404, 'user_not_found', 'Nenhum usuario foi encontrado para este e-mail.');
        }

        $verification = $this->findOpenVerification((int) $user['id']);

        if (!$verification) {
            throw new ApiException(422, 'verification_code_expired', 'O codigo informado expirou. Solicite um novo envio.');
        }

        if (!password_verify($code, $verification['code_hash'])) {
            throw new ApiException(422, 'verification_code_invalid', 'O codigo informado nao e valido.');
        }

        $this->database->beginTransaction();

        try {
            $consumeStatement = $this->database->prepare(
                'UPDATE user_email_verifications SET consumed_at = NOW() WHERE id = :id'
            );
            $consumeStatement->execute(['id' => $verification['id']]);

            $userStatement = $this->database->prepare(
                'UPDATE users
                 SET account_status = :account_status,
                     email_verified_at = NOW(),
                     plan_status = :plan_status,
                     last_login_at = NOW(),
                     last_seen_at = NOW(),
                     failed_login_attempts = 0,
                     updated_at = NOW()
                 WHERE id = :id'
            );
            $userStatement->execute([
                'account_status' => 'active',
                'plan_status' => 'active',
                'id' => $user['id'],
            ]);

            $session = $this->createSession((int) $user['id'], $server);
            $freshUser = $this->findUserByEmail($email);
            $this->database->commit();
        } catch (Throwable $exception) {
            if ($this->database->inTransaction()) {
                $this->database->rollBack();
            }

            throw $exception;
        }

        return [
            'session' => $session,
            'user' => $this->sanitizeUser($freshUser ?: $user),
        ];
    }

    public function resendVerificationCode(array $payload): array
    {
        $email = $this->normalizeEmail($payload['email'] ?? null);
        $user = $this->findUserByEmail($email);

        if (!$user) {
            throw new ApiException(404, 'user_not_found', 'Nenhum usuario foi encontrado para este e-mail.');
        }

        if ($user['account_status'] === 'active' && !empty($user['email_verified_at'])) {
            throw new ApiException(409, 'email_already_verified', 'Esta conta ja foi confirmada.');
        }

        $this->database->beginTransaction();

        try {
            $verification = $this->issueVerificationCode((int) $user['id']);
            $this->database->commit();
        } catch (Throwable $exception) {
            if ($this->database->inTransaction()) {
                $this->database->rollBack();
            }

            throw $exception;
        }

        $this->mailer->sendVerificationCode($email, $verification['code']);

        return [
            'email' => $email,
            'expires_at' => $verification['expires_at'],
        ];
    }

    public function login(array $payload, array $server): array
    {
        $email = $this->normalizeEmail($payload['email'] ?? null);
        $password = $this->normalizePasswordForLogin($payload['password'] ?? null);
        $user = $this->findUserByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            throw new ApiException(401, 'invalid_credentials', 'E-mail ou senha invalidos.');
        }

        if ($user['account_status'] === 'pending_verification' || empty($user['email_verified_at'])) {
            $verification = $this->resendVerificationCode(['email' => $email]);

            throw new ApiException(
                403,
                'verification_required',
                'Sua conta ainda precisa ser confirmada. Enviamos um novo codigo para o seu e-mail.',
                $verification
            );
        }

        if ($user['account_status'] !== 'active') {
            throw new ApiException(403, 'account_unavailable', 'Sua conta nao esta disponivel para acesso no momento.');
        }

        $this->database->beginTransaction();

        try {
            $updateStatement = $this->database->prepare(
                'UPDATE users
                 SET last_login_at = NOW(),
                     last_seen_at = NOW(),
                     failed_login_attempts = 0,
                     updated_at = NOW()
                 WHERE id = :id'
            );
            $updateStatement->execute(['id' => $user['id']]);

            $session = $this->createSession((int) $user['id'], $server);
            $freshUser = $this->findUserByEmail($email);
            $this->database->commit();
        } catch (Throwable $exception) {
            if ($this->database->inTransaction()) {
                $this->database->rollBack();
            }

            throw $exception;
        }

        return [
            'session' => $session,
            'user' => $this->sanitizeUser($freshUser ?: $user),
        ];
    }

    private function normalizeEmail(mixed $value): string
    {
        $email = strtolower(trim((string) $value));

        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new ApiException(422, 'invalid_email', 'Informe um e-mail valido.');
        }

        return $email;
    }

    private function normalizePasswordForRegistration(mixed $value): string
    {
        $password = trim((string) $value);

        if (strlen($password) < 8) {
            throw new ApiException(422, 'invalid_password', 'A senha deve ter pelo menos 8 caracteres.');
        }

        if (!preg_match('/[A-Z]/', $password)) {
            throw new ApiException(422, 'invalid_password', 'A senha precisa ter pelo menos uma letra maiuscula.');
        }

        if (!preg_match('/[0-9]/', $password)) {
            throw new ApiException(422, 'invalid_password', 'A senha precisa ter pelo menos um numero.');
        }

        if (!preg_match('/[^A-Za-z0-9]/', $password)) {
            throw new ApiException(422, 'invalid_password', 'A senha precisa ter pelo menos um simbolo.');
        }

        return $password;
    }

    private function normalizePasswordForLogin(mixed $value): string
    {
        $password = trim((string) $value);

        if ($password === '') {
            throw new ApiException(422, 'invalid_password', 'Informe sua senha para continuar.');
        }

        return $password;
    }

    private function normalizeVerificationCode(mixed $value): string
    {
        $code = preg_replace('/\D+/', '', (string) $value) ?? '';

        if (strlen($code) !== 6) {
            throw new ApiException(422, 'invalid_verification_code', 'Informe um codigo de 6 digitos.');
        }

        return $code;
    }

    private function findUserByEmail(string $email): ?array
    {
        $statement = $this->database->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $statement->execute(['email' => $email]);
        $user = $statement->fetch();

        return $user ?: null;
    }

    private function issueVerificationCode(int $userId): array
    {
        $deleteStatement = $this->database->prepare(
            'DELETE FROM user_email_verifications WHERE user_id = :user_id AND purpose = :purpose'
        );
        $deleteStatement->execute([
            'user_id' => $userId,
            'purpose' => 'email_verification',
        ]);

        $ttlMinutes = (int) (Env::get('VERIFICATION_CODE_TTL_MINUTES', '10') ?? '10');
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = (new DateTimeImmutable())
            ->modify(sprintf('+%d minutes', $ttlMinutes))
            ->format('Y-m-d H:i:s');

        $insertStatement = $this->database->prepare(
            'INSERT INTO user_email_verifications (user_id, purpose, code_hash, expires_at)
             VALUES (:user_id, :purpose, :code_hash, :expires_at)'
        );
        $insertStatement->execute([
            'user_id' => $userId,
            'purpose' => 'email_verification',
            'code_hash' => password_hash($code, PASSWORD_DEFAULT),
            'expires_at' => $expiresAt,
        ]);

        return [
            'code' => $code,
            'expires_at' => $expiresAt,
        ];
    }

    private function findOpenVerification(int $userId): ?array
    {
        $statement = $this->database->prepare(
            'SELECT *
             FROM user_email_verifications
             WHERE user_id = :user_id
               AND purpose = :purpose
               AND consumed_at IS NULL
               AND expires_at >= NOW()
             ORDER BY id DESC
             LIMIT 1'
        );
        $statement->execute([
            'user_id' => $userId,
            'purpose' => 'email_verification',
        ]);
        $verification = $statement->fetch();

        return $verification ?: null;
    }

    private function createSession(int $userId, array $server): array
    {
        $ttlDays = (int) (Env::get('SESSION_TTL_DAYS', '30') ?? '30');
        $token = bin2hex(random_bytes(32));
        $expiresAt = (new DateTimeImmutable())
            ->modify(sprintf('+%d days', $ttlDays))
            ->format('Y-m-d H:i:s');

        $statement = $this->database->prepare(
            'INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at)
             VALUES (:user_id, :session_token, :ip_address, :user_agent, :expires_at)'
        );
        $statement->execute([
            'user_id' => $userId,
            'session_token' => $token,
            'ip_address' => $server['REMOTE_ADDR'] ?? null,
            'user_agent' => substr((string) ($server['HTTP_USER_AGENT'] ?? ''), 0, 255),
            'expires_at' => $expiresAt,
        ]);

        return [
            'token' => $token,
            'expires_at' => $expiresAt,
        ];
    }

    private function sanitizeUser(array $user): array
    {
        return [
            'id' => (int) $user['id'],
            'uuid' => $user['uuid'],
            'full_name' => $user['full_name'],
            'company_name' => $user['company_name'],
            'email' => $user['email'],
            'plan_slug' => $user['plan_slug'],
            'plan_status' => $user['plan_status'],
            'credits_balance' => (int) $user['credits_balance'],
            'credits_used' => (int) $user['credits_used'],
            'account_role' => $user['account_role'],
            'account_status' => $user['account_status'],
            'is_super_admin' => (bool) $user['is_super_admin'],
            'email_verified_at' => $user['email_verified_at'],
            'last_login_at' => $user['last_login_at'],
            'created_at' => $user['created_at'],
            'onboarding_completed_at' => $user['onboarding_completed_at'],
        ];
    }

    private function generateUuid(): string
    {
        $bytes = random_bytes(16);
        $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
        $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));
    }
}
