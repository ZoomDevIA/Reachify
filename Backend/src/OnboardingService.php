<?php

final class OnboardingService
{
    public function __construct(private readonly PDO $database)
    {
    }

    public function getStatus(array $server): array
    {
        $user = $this->resolveAuthenticatedUser($server);
        $onboarding = $this->findOnboardingByUserId((int) $user['id']);

        return [
            'user' => $this->sanitizeUser($user),
            'onboarding' => $this->sanitizeOnboarding($onboarding, $user),
        ];
    }

    public function save(array $payload, array $server): array
    {
        $user = $this->resolveAuthenticatedUser($server);
        $onboarding = $this->findOnboardingByUserId((int) $user['id']);
        $isCompletionRequest = (bool) ($payload['onboarding_completed'] ?? false);

        $normalized = [
            'user_name' => $this->sanitizeNullableText($payload['user_name'] ?? $onboarding['user_name'] ?? $user['full_name'] ?? null, 120),
            'company_name' => $this->sanitizeNullableText($payload['company_name'] ?? $onboarding['company_name'] ?? $user['company_name'] ?? null, 160),
            'business_segment' => $this->sanitizeNullableText($payload['business_segment'] ?? $onboarding['business_segment'] ?? null, 160),
            'employees_count' => $this->sanitizeNullableText($payload['employees_count'] ?? $onboarding['employees_count'] ?? null, 80),
            'main_goal' => $this->sanitizeNullableText($payload['main_goal'] ?? $onboarding['main_goal'] ?? null, 120),
            'ai_communication_style' => $this->sanitizeNullableText($payload['ai_communication_style'] ?? $onboarding['ai_communication_style'] ?? null, 80),
        ];

        if ($isCompletionRequest) {
            $this->assertRequiredOnboardingFields($normalized);
        }

        $aiInitialContext = $this->buildInitialAiContext($normalized);
        $initialAgentPreferences = json_encode([
            'main_goal' => $normalized['main_goal'],
            'communication_style' => $normalized['ai_communication_style'],
            'business_segment' => $normalized['business_segment'],
            'employees_count' => $normalized['employees_count'],
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $this->database->beginTransaction();

        try {
            $statement = $this->database->prepare(
                'INSERT INTO company_onboarding
                    (user_id, company_id, user_name, company_name, business_segment, employees_count, main_goal, ai_communication_style, ai_initial_context, initial_agent_preferences, onboarding_completed)
                 VALUES
                    (:user_id, :company_id, :user_name, :company_name, :business_segment, :employees_count, :main_goal, :ai_communication_style, :ai_initial_context, :initial_agent_preferences, :onboarding_completed)
                 ON DUPLICATE KEY UPDATE
                    company_id = VALUES(company_id),
                    user_name = VALUES(user_name),
                    company_name = VALUES(company_name),
                    business_segment = VALUES(business_segment),
                    employees_count = VALUES(employees_count),
                    main_goal = VALUES(main_goal),
                    ai_communication_style = VALUES(ai_communication_style),
                    ai_initial_context = VALUES(ai_initial_context),
                    initial_agent_preferences = VALUES(initial_agent_preferences),
                    onboarding_completed = VALUES(onboarding_completed),
                    updated_at = NOW()'
            );

            $statement->execute([
                'user_id' => (int) $user['id'],
                'company_id' => (int) $user['id'],
                'user_name' => $normalized['user_name'],
                'company_name' => $normalized['company_name'],
                'business_segment' => $normalized['business_segment'],
                'employees_count' => $normalized['employees_count'],
                'main_goal' => $normalized['main_goal'],
                'ai_communication_style' => $normalized['ai_communication_style'],
                'ai_initial_context' => $aiInitialContext,
                'initial_agent_preferences' => $initialAgentPreferences,
                'onboarding_completed' => $isCompletionRequest ? 1 : 0,
            ]);

            $userStatement = $this->database->prepare(
                'UPDATE users
                 SET full_name = COALESCE(:full_name, full_name),
                     company_name = COALESCE(:company_name, company_name),
                     onboarding_completed_at = :onboarding_completed_at,
                     updated_at = NOW()
                 WHERE id = :id'
            );
            $userStatement->execute([
                'full_name' => $normalized['user_name'],
                'company_name' => $normalized['company_name'],
                'onboarding_completed_at' => $isCompletionRequest ? date('Y-m-d H:i:s') : ($user['onboarding_completed_at'] ?? null),
                'id' => (int) $user['id'],
            ]);

            $freshUser = $this->findUserById((int) $user['id']);
            $freshOnboarding = $this->findOnboardingByUserId((int) $user['id']);
            $this->database->commit();
        } catch (Throwable $exception) {
            if ($this->database->inTransaction()) {
                $this->database->rollBack();
            }

            throw $exception;
        }

        return [
            'user' => $this->sanitizeUser($freshUser ?: $user),
            'onboarding' => $this->sanitizeOnboarding($freshOnboarding, $freshUser ?: $user),
        ];
    }

    private function resolveAuthenticatedUser(array $server): array
    {
        $token = $this->extractBearerToken($server);

        if ($token === '') {
            throw new ApiException(401, 'auth_token_missing', 'Sua sessao nao foi encontrada para esta operacao.');
        }

        $statement = $this->database->prepare(
            'SELECT users.*
             FROM user_sessions
             INNER JOIN users ON users.id = user_sessions.user_id
             WHERE user_sessions.session_token = :token
               AND user_sessions.expires_at >= NOW()
             LIMIT 1'
        );
        $statement->execute(['token' => $token]);
        $user = $statement->fetch();

        if (!$user) {
            throw new ApiException(401, 'invalid_session', 'Sua sessao expirou. Faca login novamente.');
        }

        return $user;
    }

    private function extractBearerToken(array $server): string
    {
        $header = $server['HTTP_AUTHORIZATION'] ?? $server['Authorization'] ?? '';

        if (!is_string($header) || !preg_match('/Bearer\s+(.+)/i', $header, $matches)) {
            return '';
        }

        return trim($matches[1]);
    }

    private function findOnboardingByUserId(int $userId): ?array
    {
        $statement = $this->database->prepare('SELECT * FROM company_onboarding WHERE user_id = :user_id LIMIT 1');
        $statement->execute(['user_id' => $userId]);
        $onboarding = $statement->fetch();

        return $onboarding ?: null;
    }

    private function findUserById(int $userId): ?array
    {
        $statement = $this->database->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $statement->execute(['id' => $userId]);
        $user = $statement->fetch();

        return $user ?: null;
    }

    private function sanitizeNullableText(mixed $value, int $maxLength): ?string
    {
        $text = trim((string) ($value ?? ''));

        if ($text === '') {
            return null;
        }

        return mb_substr($text, 0, $maxLength);
    }

    private function assertRequiredOnboardingFields(array $data): void
    {
        $requiredFields = [
            'user_name' => 'Informe o nome do usuario.',
            'company_name' => 'Informe o nome da empresa.',
            'business_segment' => 'Informe o segmento do negocio.',
            'employees_count' => 'Informe a quantidade de funcionarios.',
            'main_goal' => 'Selecione o principal objetivo com a Reachify.',
            'ai_communication_style' => 'Selecione como a IA deve falar com seus clientes.',
        ];

        foreach ($requiredFields as $field => $message) {
            if (empty($data[$field])) {
                throw new ApiException(422, 'invalid_onboarding_data', $message, ['field' => $field]);
            }
        }
    }

    private function buildInitialAiContext(array $data): string
    {
        $parts = array_filter([
            $data['company_name'] ? "Empresa: {$data['company_name']}." : null,
            $data['business_segment'] ? "Segmento: {$data['business_segment']}." : null,
            $data['employees_count'] ? "Time atual: {$data['employees_count']}." : null,
            $data['main_goal'] ? "Objetivo principal: {$data['main_goal']}." : null,
            $data['ai_communication_style'] ? "Tom desejado da IA: {$data['ai_communication_style']}." : null,
        ]);

        return implode(' ', $parts);
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

    private function sanitizeOnboarding(?array $onboarding, array $user): array
    {
        return [
            'user_name' => $onboarding['user_name'] ?? $user['full_name'] ?? '',
            'company_name' => $onboarding['company_name'] ?? $user['company_name'] ?? '',
            'business_segment' => $onboarding['business_segment'] ?? '',
            'employees_count' => $onboarding['employees_count'] ?? '',
            'main_goal' => $onboarding['main_goal'] ?? '',
            'ai_communication_style' => $onboarding['ai_communication_style'] ?? '',
            'ai_initial_context' => $onboarding['ai_initial_context'] ?? '',
            'onboarding_completed' => (bool) ($onboarding['onboarding_completed'] ?? !empty($user['onboarding_completed_at'])),
        ];
    }
}
