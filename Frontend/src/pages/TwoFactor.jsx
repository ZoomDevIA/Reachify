import { useEffect, useMemo, useRef, useState } from 'react'
import { HiArrowLeft, HiCheckCircle, HiEnvelope, HiShieldCheck } from 'react-icons/hi2'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import robozinhoImage from '../assets/Robozinho-5000x5000-removebg-preview.png'
import {
  getPendingVerificationEmail,
  resendEmailCode,
  verifyEmailCode,
} from '../lib/auth.js'

function TwoFactor() {
  const location = useLocation()
  const navigate = useNavigate()
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [resendCooldown, setResendCooldown] = useState(60)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const inputsRef = useRef([])
  const redirectTimeoutRef = useRef(null)
  const email = location.state?.email ?? getPendingVerificationEmail() ?? ''

  const code = useMemo(() => digits.join(''), [digits])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!email) {
      navigate('/cadastro', { replace: true })
    }
  }, [email, navigate])

  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [resendCooldown])

  function updateDigit(index, value) {
    const sanitized = value.replace(/\D/g, '').slice(-1)
    const nextDigits = [...digits]
    nextDigits[index] = sanitized
    setDigits(nextDigits)

    if (sanitized && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  function handlePaste(event) {
    event.preventDefault()
    const pastedValue = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)

    if (!pastedValue) {
      return
    }

    const nextDigits = ['', '', '', '', '', '']
    pastedValue.split('').forEach((character, index) => {
      nextDigits[index] = character
    })
    setDigits(nextDigits)
    inputsRef.current[Math.min(pastedValue.length, 6) - 1]?.focus()
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (code.length !== 6) {
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await verifyEmailCode(email, code)
      setShowSuccessModal(true)
      redirectTimeoutRef.current = window.setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResendCode() {
    if (!email || resendCooldown > 0) {
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsResending(true)

    try {
      await resendEmailCode(email)
      setSuccessMessage('Enviamos um novo codigo para o seu e-mail.')
      setResendCooldown(60)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <main className="twofactor-layout">
      {showSuccessModal ? (
        <div className="twofactor-success-modal" role="dialog" aria-modal="true" aria-labelledby="twofactor-success-title">
          <div className="twofactor-success-modal__card">
            <div className="twofactor-success-modal__icon">
              <HiCheckCircle size={34} />
            </div>
            <h2 id="twofactor-success-title">Conta confirmada com sucesso</h2>
            <p>Seu acesso foi validado. Estamos redirecionando voce para o Dashboard.</p>
          </div>
        </div>
      ) : null}

      <section className="twofactor-layout__form-side">
        <div className="twofactor-layout__shell">
          <Link className="twofactor-layout__back" to="/cadastro">
            <HiArrowLeft size={18} />
            <span>Voltar</span>
          </Link>

          <span className="twofactor-layout__badge">
            <HiShieldCheck size={16} />
            Verificacao em duas etapas
          </span>

          <header className="twofactor-layout__header">
            <h1>Confirme seu e-mail e proteja sua conta</h1>
            <p>
              Enviamos um codigo de 6 digitos para <strong>{email || 'seu@email.com'}</strong>. Digite o
              codigo abaixo para verificar seu e-mail e ativar o 2FA.
            </p>
          </header>

          <form className="twofactor-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Codigo de verificacao</label>
              <div className="twofactor-code" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={`digit-${index}`}
                    ref={(element) => {
                      inputsRef.current[index] = element
                    }}
                    className="twofactor-code__input"
                    inputMode="numeric"
                    maxLength={1}
                    type="text"
                    value={digit}
                    onChange={(event) => updateDigit(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    aria-label={`Digito ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="twofactor-form__hint">
              <HiShieldCheck size={16} />
              <span>
                Este codigo expira em <strong>10:00</strong> minutos.
              </span>
            </div>

            {errorMessage ? <p className="auth-feedback auth-feedback--error">{errorMessage}</p> : null}
            {successMessage ? <p className="auth-feedback auth-feedback--success">{successMessage}</p> : null}

            <button className="cadastro-submit" type="submit" disabled={code.length !== 6 || isSubmitting}>
              {isSubmitting ? 'Verificando...' : 'Verificar codigo'}
            </button>

            <div className="cadastro-divider">
              <span>ou</span>
            </div>

            <button
              className="twofactor-resend-button"
              type="button"
              onClick={handleResendCode}
              disabled={isResending || resendCooldown > 0}
            >
              <HiEnvelope size={18} />
              {isResending
                ? 'Reenviando...'
                : resendCooldown > 0
                  ? `Reenviar em ${resendCooldown}s`
                  : 'Reenviar codigo'}
            </button>

            {resendCooldown > 0 ? (
              <p className="twofactor-resend-hint">
                Voce podera solicitar um novo e-mail em {resendCooldown} segundos.
              </p>
            ) : null}
          </form>

          <footer className="twofactor-layout__footer">
            <span>Nao recebeu o codigo?</span>
            <Link to="/">Verifique o spam ou tente novamente.</Link>
          </footer>
        </div>
      </section>

      <section className="cadastro-page__visual-side twofactor-layout__visual-side">
        <div className="cadastro-hero">
          <header className="cadastro-hero__header">
            <span className="cadastro-hero__badge">Verificacao em duas etapas</span>
            <h2>
              Sua seguranca.
              <br />
              <span>Nossa prioridade.</span>
              <br />
              Protecao em cada acesso.
            </h2>
            <p>
              A verificacao em duas etapas adiciona uma camada extra de seguranca para
              manter sua conta, seu time e os dados da operacao sempre protegidos.
            </p>
          </header>

          <div className="cadastro-hero__content cadastro-hero__content--clean">
            <div className="cadastro-hero__robot-placeholder">
              <div className="cadastro-hero__robot-stage">
                <img src={robozinhoImage} alt="Robo do Reachify" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default TwoFactor
