import { useEffect, useState } from 'react'
import {
  HiCalendarDays,
  HiCamera,
  HiInformationCircle,
  HiPhone,
  HiPlus,
} from 'react-icons/hi2'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import { getStoredUser } from '../lib/auth.js'
import { getStoredSidebarCollapsed, setStoredSidebarCollapsed } from '../lib/dashboardUi.js'

const initialTokens = []

function DashboardProfile() {
  const [user] = useState(() => getStoredUser())
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => getStoredSidebarCollapsed())
  const [tokens, setTokens] = useState(initialTokens)
  const [profileForm, setProfileForm] = useState({
    name: 'Leandro Augusto',
    signature: '',
    phone: '(11) 96123-4567',
    closingMessageEnabled: false,
    closingMessage: '',
  })

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 720) {
        setIsSidebarCollapsed(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setStoredSidebarCollapsed(isSidebarCollapsed)
  }, [isSidebarCollapsed])

  function updateProfileField(field, value) {
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleCreateToken() {
    const token = `rk_${Math.random().toString(36).slice(2, 10)}${Date.now()
      .toString(36)
      .slice(-4)}`

    setTokens((current) => [
      {
        id: token,
        label: `Token ${current.length + 1}`,
        value: token,
        createdAt: new Date().toLocaleString('pt-BR'),
      },
      ...current,
    ])
  }

  return (
    <main
      className={`reachify-dashboard ${isSidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}
    >
      <DashboardSidebar
        user={user}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((current) => !current)}
      />

      <section className="reachify-profile">
        <div className="reachify-profile__body">
          <header className="reachify-profile__page-head">
            <h1>Perfil</h1>
            <p>
              Aqui voce consegue gerenciar seus dados pessoais e executar configuracoes
              basicas da Reachify.
            </p>
          </header>

          <div className="reachify-profile__grid">
            <article className="reachify-profile__card">
              <div className="reachify-profile__card-head">
                <h2>Dados do seu perfil</h2>
              </div>

              <div className="reachify-profile__hero">
                <div className="reachify-profile__avatar-wrap">
                  <div className="reachify-profile__avatar">L</div>
                  <button type="button" className="reachify-profile__avatar-action">
                    <HiCamera size={18} />
                  </button>
                </div>

                <div className="reachify-profile__hero-copy">
                  <strong>Leandro Augusto</strong>
                  <span>Portugues (Brasil)</span>
                  <p>
                    Gerencie seus dados de acesso, idioma e assinatura da conta da
                    operacao.
                  </p>
                </div>
              </div>

              <div className="reachify-profile__form-grid">
                <label className="reachify-profile__field">
                  <span>Nome</span>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(event) => updateProfileField('name', event.target.value)}
                  />
                </label>

                <label className="reachify-profile__field">
                  <span>Assinatura</span>
                  <input
                    type="text"
                    value={profileForm.signature}
                    onChange={(event) => updateProfileField('signature', event.target.value)}
                    placeholder="Sua assinatura profissional"
                  />
                </label>

                <label className="reachify-profile__field">
                  <span>Telefone</span>
                  <div className="reachify-profile__input-icon">
                    <HiPhone size={18} />
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(event) => updateProfileField('phone', event.target.value)}
                    />
                  </div>
                </label>

                <div className="reachify-profile__toggle-row">
                  <button
                    className={`reachify-profile__switch ${
                      profileForm.closingMessageEnabled ? 'is-active' : ''
                    }`}
                    type="button"
                    onClick={() =>
                      updateProfileField(
                        'closingMessageEnabled',
                        !profileForm.closingMessageEnabled,
                      )
                    }
                    aria-pressed={profileForm.closingMessageEnabled}
                  >
                    <span />
                  </button>
                  <strong>Mensagem de finalizacao de conversa</strong>
                </div>

                <div className="reachify-profile__info">
                  <HiInformationCircle size={18} />
                  <span>
                    Se definida, tem precedencia sobre a mensagem de finalizacao
                    configurada na organizacao.
                  </span>
                </div>

                <label className="reachify-profile__field reachify-profile__field--full">
                  <span>Sua mensagem de encerramento</span>
                  <textarea
                    rows="5"
                    value={profileForm.closingMessage}
                    onChange={(event) =>
                      updateProfileField('closingMessage', event.target.value)
                    }
                    placeholder="Sua mensagem de encerramento"
                  />
                </label>
              </div>
            </article>

            <aside className="reachify-profile__card reachify-profile__card--tokens">
              <div className="reachify-profile__card-head">
                <div>
                  <h2>Tokens de Acesso</h2>
                  <p>
                    Tokens criam chaves temporarias para conectar apps e APIs com
                    seguranca, sem expor sua senha principal.
                  </p>
                </div>
                <button
                  type="button"
                  className="reachify-profile__token-button"
                  onClick={handleCreateToken}
                >
                  <HiPlus size={18} />
                  <span>Novo token</span>
                </button>
              </div>

              {tokens.length === 0 ? (
                <div className="reachify-profile__tokens-empty">
                  <div className="reachify-profile__tokens-illustration">
                    <div className="reachify-profile__token-sheet reachify-profile__token-sheet--back" />
                    <div className="reachify-profile__token-sheet reachify-profile__token-sheet--front">
                      <div className="reachify-profile__token-plus">
                        <HiPlus size={22} />
                      </div>
                    </div>
                  </div>
                  <strong>Crie seu primeiro token!</strong>
                </div>
              ) : (
                <div className="reachify-profile__token-list">
                  {tokens.map((token) => (
                    <article key={token.id} className="reachify-profile__token-item">
                      <strong>{token.label}</strong>
                      <span>{token.value}</span>
                      <small>
                        <HiCalendarDays size={14} />
                        {token.createdAt}
                      </small>
                    </article>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}

export default DashboardProfile
