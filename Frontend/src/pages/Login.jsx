import { useMemo, useState } from 'react'
import { FaGithub, FaGoogle } from 'react-icons/fa6'
import { HiEye, HiEyeSlash, HiSparkles } from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router-dom'
import robozinhoImage from '../assets/Robozinho-5000x5000-removebg-preview.png'
import {
  getPasswordStrength,
  loginUser,
  persistPendingVerificationEmail,
} from '../lib/auth.js'

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim()) {
      setErrorMessage('Informe seu e-mail para entrar.')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setErrorMessage('Informe um e-mail valido.')
      return
    }

    if (!password.trim()) {
      setErrorMessage('Informe sua senha para continuar.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await loginUser(email, password)
      navigate('/dashboard')
    } catch (error) {
      if (error.code === 'verification_required' && error.meta?.email) {
        persistPendingVerificationEmail(error.meta.email)
        navigate('/2fa', { state: { email: error.meta.email } })
        return
      }

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
            <h1 className="login-page__title">Bem-vindo de volta!</h1>
            <p>Acesse sua conta e continue transformando seu atendimento e sua operacao.</p>
          </header>

          <div className="cadastro-social">
            <button className="cadastro-social__button" type="button">
              <FaGoogle size={18} className="cadastro-social__icon--google" />
              Entrar com Google
            </button>
            <button className="cadastro-social__button" type="button">
              <FaGithub size={18} className="cadastro-social__icon--github" />
              Entrar com GitHub
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
                  placeholder="Sua senha"
                  autoComplete="current-password"
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

            <div className="login-page__helper-row">
              <span className="form-helper">Use a conta vinculada a sua empresa.</span>
              <Link className="login-page__forgot-link" to="/">
                Esqueceu sua senha?
              </Link>
            </div>

            {errorMessage ? <p className="auth-feedback auth-feedback--error">{errorMessage}</p> : null}

            <button className="cadastro-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar na minha conta'}
            </button>
          </form>

          <footer className="cadastro-footer">
            <span>Ainda nao tem uma conta?</span>
            <Link to="/cadastro">Criar conta</Link>
          </footer>
        </div>
      </section>

      <section className="cadastro-page__visual-side">
        <div className="cadastro-hero">
          <header className="cadastro-hero__header">
            <span className="cadastro-hero__badge">Plataforma pronta para sua operacao</span>
            <h2>
              Atendimento inteligente.
              <br />
              Vendas que acontecem.
              <br />
              <span>Resultados que crescem.</span>
            </h2>
            <p>
              O Reachify reune atendimento, CRM, cobrancas e automacoes em uma unica
              plataforma pensada para empresas que querem crescer com organizacao e
              eficiencia.
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

export default Login
