<?php

final class ResendMailer
{
    public function sendVerificationCode(string $email, string $code): void
    {
        $apiKey = Env::get('RESEND_API_KEY');
        $from = Env::get('RESEND_FROM_EMAIL');
        $replyTo = Env::get('RESEND_REPLY_TO');

        if (!$apiKey || !$from) {
            throw new ApiException(
                500,
                'mail_configuration_missing',
                'As credenciais do Resend ainda nao foram configuradas no backend.'
            );
        }

        $ttlMinutes = (int) (Env::get('VERIFICATION_CODE_TTL_MINUTES', '10') ?? '10');
        $subject = 'Confirme seu cadastro na Reachify';
        $html = <<<HTML
            <!doctype html>
            <html lang="pt-BR">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Confirme seu cadastro</title>
              </head>
              <body style="margin: 0; padding: 32px 16px; background: linear-gradient(180deg, #f3fbfa 0%, #edf8f6 100%); font-family: Arial, Helvetica, sans-serif; color: #0b0f14;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                  <tr>
                    <td align="center">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 580px; border-collapse: collapse;">
                        <tr>
                          <td align="center" style="padding-bottom: 18px;">
                            <div style="display: inline-flex; align-items: center; gap: 12px; color: #0b0f14; font-size: 22px; font-weight: 800;">
                              <span style="display: inline-block; width: 44px; height: 44px; line-height: 44px; text-align: center; border-radius: 14px; background: linear-gradient(135deg, #198754 0%, #209FA3 55%, #20c997 100%); color: #ffffff; font-size: 22px;">R</span>
                              <span>Reachify</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="background: #ffffff; border: 1px solid #dceee9; border-radius: 24px; box-shadow: 0 18px 40px rgba(32, 159, 163, 0.08); padding: 42px 28px 28px;">
                            <div style="text-align: center;">
                              <h1 style="margin: 0 0 14px; font-size: 42px; line-height: 1.02; letter-spacing: -0.04em; color: #0b0f14;">
                                Confirme seu cadastro
                              </h1>
                              <p style="margin: 0 auto 28px; max-width: 420px; color: #556070; font-size: 16px; line-height: 1.7;">
                                Use o codigo abaixo para confirmar sua conta na Reachify e comecar a transformar o atendimento da sua empresa.
                              </p>
                            </div>

                            <div style="border-radius: 20px; padding: 24px 20px; text-align: center; background: linear-gradient(135deg, #209FA3 0%, #198754 58%, #20c997 100%); color: #ffffff; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);">
                              <div style="font-size: 15px; font-weight: 700; opacity: 0.92; margin-bottom: 12px;">
                                Codigo de verificacao
                              </div>
                              <div style="font-size: 42px; font-weight: 800; letter-spacing: 12px; line-height: 1.1;">
                                {$code}
                              </div>
                            </div>

                            <div style="margin-top: 18px; border-radius: 16px; background: #f3fbfa; border: 1px solid #dceee9; padding: 16px 18px; text-align: center; color: #556070; font-size: 15px;">
                              Este codigo expira em <strong style="color: #198754;">{$ttlMinutes} minutos</strong>.
                            </div>

                            <div style="margin-top: 24px; padding-top: 22px; border-top: 1px solid #e4e8ee;">
                              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                                <tr>
                                  <td valign="top" style="width: 52px;">
                                    <div style="width: 44px; height: 44px; line-height: 44px; text-align: center; border-radius: 14px; background: #edf8f6; color: #209FA3; font-size: 22px;">&#128737;</div>
                                  </td>
                                  <td valign="top">
                                    <div style="font-size: 16px; font-weight: 700; color: #0b0f14; margin-bottom: 6px;">
                                      Sua seguranca e importante
                                    </div>
                                    <div style="font-size: 14px; line-height: 1.7; color: #556070;">
                                      Se voce nao solicitou este cadastro, ignore este e-mail com seguranca.
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 18px; text-align: center; color: #8a94a6; font-size: 13px; line-height: 1.7;">
                            Precisa de ajuda? <span style="color: #198754; font-weight: 700;">Fale com nosso suporte</span><br />
                            &copy; 2026 Reachify. Todos os direitos reservados.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
        HTML;

        $payload = [
            'from' => $from,
            'to' => [$email],
            'subject' => $subject,
            'html' => $html,
            'text' => "Confirme seu cadastro na Reachify. Codigo de verificacao: {$code}. Ele expira em {$ttlMinutes} minutos. Se voce nao solicitou este cadastro, ignore este e-mail.",
        ];

        if ($replyTo) {
            $payload['reply_to'] = $replyTo;
        }

        $ch = curl_init('https://api.resend.com/emails');

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json',
            ],
            CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        ]);

        $response = curl_exec($ch);
        $httpStatus = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($response === false || $httpStatus < 200 || $httpStatus >= 300) {
            throw new ApiException(
                502,
                'mail_delivery_failed',
                'Nao foi possivel enviar o codigo de confirmacao por e-mail.',
                ['provider' => 'resend', 'status' => $httpStatus, 'detail' => $curlError]
            );
        }
    }
}
