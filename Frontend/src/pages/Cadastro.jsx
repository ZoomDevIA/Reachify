import { useMemo, useState } from 'react'
import { FaGithub, FaGoogle } from 'react-icons/fa6'
import { HiEye, HiEyeSlash, HiSparkles } from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router-dom'
import robozinhoImage from '../assets/Robozinho-5000x5000-removebg-preview.png'
import {
  getPasswordStrength,
  persistPendingVerificationEmail,
  registerUser,
} from '../lib/auth.js'

function Cadastro() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim()) {
      setErrorMessage('Informe seu e-mail para criar a conta.')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setErrorMessage('Informe um e-mail valido.')
      return
    }

    if (!password.trim()) {
      setErrorMessage('Crie uma senha para continuar.')
      return
    }

    if (!passwordStrength.isStrong) {
      setErrorMessage('Use uma senha forte com pelo menos 8 caracteres, letra maiuscula, numero e simbolo.')
      return
    }

    if (!acceptTerms) {
      setErrorMessage('Voce precisa aceitar os Termos de Uso e a Politica de Privacidade.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await registerUser(email, password)
      persistPendingVerificationEmail(email)
      navigate('/2fa', { state: { email } })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-page__form-side">
        <div className="cadastro-page__form-shell">
          <Link className="cadastro-brand" to="/">
            <span className="cadastro-brand__mark">
              <HiSparkles size={20} />
            </span>
            <span>Reachify</span>
          </Link>

          <header className="cadastro-page__header">
            <h1>Crie sua conta</h1>
            <p>Comece agora e transforme o atendimento da sua empresa com automacao e IA.</p>
          </header>

          <div className="cadastro-social">
            <button className="cadastro-social__button" type="button">
              <FaGoogle size={18} className="cadastro-social__icon--google" />
              Continuar com Google
            </button>

            <button className="cadastro-social__button" type="button">
              <FaGithub size={18} className="cadastro-social__icon--github" />
              Continuar com GitHub
            </button>
          </div>

          <div className="cadastro-divider">
            <span>ou</span>
          </div>

          <form className="cadastro-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Senha</label>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Crie uma senha forte"
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
                </button>
              </div>
              <div className="password-strength" aria-hidden="true">
                <span className={`password-strength__bar password-strength__bar--${passwordStrength.tone} ${passwordStrength.level >= 1 ? 'is-active' : ''}`} />
                <span className={`password-strength__bar password-strength__bar--${passwordStrength.tone} ${passwordStrength.level >= 2 ? 'is-active' : ''}`} />
                <span className={`password-strength__bar password-strength__bar--${passwordStrength.tone} ${passwordStrength.level >= 3 ? 'is-active' : ''}`} />
              </div>
              <span className={`form-helper form-helper--${passwordStrength.tone}`}>{passwordStrength.label}</span>
            </div>

            <label className="cadastro-checkbox" htmlFor="terms">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(event) => setAcceptTerms(event.target.checked)}
              />
              <span>
                Eu aceito os <Link to="/">Termos de Uso</Link> e a{' '}
                <Link to="/">Politica de Privacidade</Link>
              </span>
            </label>

            {errorMessage ? <p className="auth-feedback auth-feedback--error">{errorMessage}</p> : null}

            <button className="cadastro-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <footer className="cadastro-footer">
            <span>Ja tem uma conta?</span>
            <Link to="/login">Entrar</Link>
          </footer>
        </div>
      </section>

      <section className="cadastro-page__visual-side">
        <div className="cadastro-hero">
          <header className="cadastro-hero__header">
            <span className="cadastro-hero__badge">Plataforma completa para crescer</span>
            <h2>Atenda melhor. <span>Venda mais.</span> Automatize tudo.</h2>
            <p>
              O Reachify reune atendimento inteligente, CRM, cobrancas e automacoes em
              uma unica plataforma pensada para empresas que querem crescer com
              organizacao e eficiencia.
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

export default Cadastro
