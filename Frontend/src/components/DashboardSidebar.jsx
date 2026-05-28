import {
  HiArrowTrendingUp,
  HiArrowRightOnRectangle,
  HiBell,
  HiBolt,
  HiBuildingOffice2,
  HiChatBubbleBottomCenterText,
  HiChatBubbleLeftRight,
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiCog6Tooth,
  HiMoon,
  HiLifebuoy,
  HiMegaphone,
  HiSpeakerWave,
  HiSpeakerXMark,
  HiSparkles,
  HiSquares2X2,
  HiSun,
  HiUser,
  HiUsers,
} from 'react-icons/hi2'
import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { clearStoredSession } from '../lib/auth.js'

const primaryNavigationItems = [
  { label: 'Conversas', icon: HiChatBubbleLeftRight, to: '/dashboard', end: true },
  { label: 'Contatos', icon: HiUsers, to: '/dashboard/contatos' },
  { label: 'CRM', icon: HiSquares2X2 },
  { label: 'Chatbots', icon: HiChatBubbleBottomCenterText },
  { label: 'Agentes de IA', icon: HiBolt },
  { label: 'Campanhas', icon: HiMegaphone },
  { label: 'Relatorios', icon: HiArrowTrendingUp },
  { label: 'Configuracoes', icon: HiCog6Tooth },
]

const secondaryNavigationItems = [
  { label: 'Notificacoes', icon: HiBell },
  { label: 'Suporte', icon: HiLifebuoy },
]

function DashboardSidebar({ user, isCollapsed, onToggle }) {
  const navigate = useNavigate()
  const profileMenuRef = useRef(null)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [activeProfileTab, setActiveProfileTab] = useState('account')
  const [preferences, setPreferences] = useState({
    chatReassignment: 'off',
    theme: 'auto',
    notificationSound: 'enabled',
  })

  const displayName = useMemo(() => {
    if (user?.name?.trim()) {
      return user.name.trim()
    }

    const emailLocalPart = user?.email?.split('@')[0] ?? 'Usuario Reachify'
    return emailLocalPart
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }, [user])

  useEffect(() => {
    function handlePointerDown(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function handleLogout() {
    clearStoredSession()
    setIsProfileMenuOpen(false)
    navigate('/login', { replace: true })
  }

  function renderPreferenceToggle(options, activeValue, onChange) {
    return (
      <div className="reachify-dashboard__preference-toggle">
        {options.map((option) => {
          const Icon = option.icon

          return (
            <button
              key={option.value}
              type="button"
              className={activeValue === option.value ? 'is-active' : ''}
              onClick={() => onChange(option.value)}
            >
              <Icon size={16} />
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <aside className="reachify-dashboard__sidebar">
      <div className="reachify-dashboard__brand">
        <div className="reachify-dashboard__brand-copy">
          <strong>Reachify</strong>
        </div>
        <button
          className="reachify-dashboard__sidebar-toggle"
          type="button"
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
        >
          {isCollapsed ? <HiChevronRight size={18} /> : <HiChevronLeft size={18} />}
        </button>
      </div>

      <nav className="reachify-dashboard__nav">
        {primaryNavigationItems.map((item) => {
          const Icon = item.icon

          if (item.to) {
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `reachify-dashboard__nav-item ${isActive ? 'is-active' : ''}`
                }
                data-tooltip={item.label}
                aria-label={item.label}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            )
          }

          return (
            <button
              key={item.label}
              className="reachify-dashboard__nav-item"
              type="button"
              data-tooltip={item.label}
              aria-label={item.label}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="reachify-dashboard__sidebar-footer">
        {secondaryNavigationItems.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.label}
              className="reachify-dashboard__nav-item"
              type="button"
              data-tooltip={item.label}
              aria-label={item.label}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}

        <div className="reachify-dashboard__profile-menu" ref={profileMenuRef}>
          <button
            className="reachify-dashboard__profile"
            type="button"
            onClick={() => setIsProfileMenuOpen((current) => !current)}
            aria-expanded={isProfileMenuOpen}
            aria-label="Abrir menu do perfil"
          >
            <div className="reachify-dashboard__profile-avatar">
              {(displayName?.[0] ?? 'R').toUpperCase()}
            </div>
            <div className="reachify-dashboard__profile-copy">
              <strong title={displayName}>{displayName}</strong>
              <span title={user?.email ?? 'Operacao ativa'}>{user?.email ?? 'Operacao ativa'}</span>
            </div>
            <HiChevronDown size={16} />
          </button>

          {isProfileMenuOpen ? (
            <div className="reachify-dashboard__profile-card">
              <div className="reachify-dashboard__profile-card-header">
                <div className="reachify-dashboard__profile-card-avatar">
                  {(displayName?.[0] ?? 'R').toUpperCase()}
                </div>
                <strong>{displayName}</strong>
              </div>

              <div className="reachify-dashboard__profile-card-tabs">
                <button
                  className={activeProfileTab === 'account' ? 'is-active' : ''}
                  type="button"
                  onClick={() => setActiveProfileTab('account')}
                >
                  <HiBuildingOffice2 size={18} />
                  <span>Minha conta</span>
                </button>
                <button
                  className={activeProfileTab === 'preferences' ? 'is-active' : ''}
                  type="button"
                  onClick={() => setActiveProfileTab('preferences')}
                >
                  <HiCog6Tooth size={18} />
                  <span>Preferencias</span>
                </button>
              </div>

              {activeProfileTab === 'account' ? (
                <>
                  <div className="reachify-dashboard__profile-card-section">
                    <button type="button">
                      <HiUser size={18} />
                      <span>Meu perfil</span>
                    </button>
                    <button type="button">
                      <HiSparkles size={18} />
                      <span>Assinaturas e planos</span>
                    </button>
                    <button type="button">
                      <HiUsers size={18} />
                      <span>Indique e ganhe</span>
                    </button>
                  </div>

                  <div className="reachify-dashboard__profile-card-orgs">
                    <div className="reachify-dashboard__profile-card-title-row">
                      <strong>Minhas organizacoes</strong>
                      <HiBuildingOffice2 size={16} />
                    </div>
                    <div className="reachify-dashboard__profile-card-org">
                      <div className="reachify-dashboard__profile-card-org-avatar">
                        {(displayName?.[0] ?? 'R').toUpperCase()}
                      </div>
                      <span>{displayName}</span>
                      <HiCog6Tooth size={16} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="reachify-dashboard__preferences-panel">
                  <div className="reachify-dashboard__preference-group">
                    <div className="reachify-dashboard__preference-label-row">
                      <strong>Reatribuicao de chats</strong>
                    </div>
                    {renderPreferenceToggle(
                      [
                        { value: 'off', label: 'Off', icon: HiArrowRightOnRectangle },
                        { value: 'auto', label: 'Auto', icon: HiCog6Tooth },
                        { value: 'always', label: 'Sempre', icon: HiArrowTrendingUp },
                      ],
                      preferences.chatReassignment,
                      (value) =>
                        setPreferences((current) => ({ ...current, chatReassignment: value })),
                    )}
                  </div>

                  <div className="reachify-dashboard__preference-group">
                    <div className="reachify-dashboard__preference-label-row">
                      <strong>Tema</strong>
                    </div>
                    {renderPreferenceToggle(
                      [
                        { value: 'auto', label: 'Auto', icon: HiSparkles },
                        { value: 'light', label: 'Claro', icon: HiSun },
                        { value: 'dark', label: 'Escuro', icon: HiMoon },
                      ],
                      preferences.theme,
                      (value) => setPreferences((current) => ({ ...current, theme: value })),
                    )}
                  </div>

                  <div className="reachify-dashboard__preference-group">
                    <div className="reachify-dashboard__preference-label-row">
                      <strong>Som de notificacao</strong>
                    </div>
                    {renderPreferenceToggle(
                      [
                        { value: 'enabled', label: 'Ativado', icon: HiSpeakerWave },
                        { value: 'disabled', label: 'Desativado', icon: HiSpeakerXMark },
                      ],
                      preferences.notificationSound,
                      (value) =>
                        setPreferences((current) => ({ ...current, notificationSound: value })),
                    )}
                  </div>

                  <button className="reachify-dashboard__preference-link" type="button">
                    <HiArrowTrendingUp size={16} />
                    <span>Outras preferencias pessoais</span>
                  </button>
                </div>
              )}

              <button
                className="reachify-dashboard__profile-card-logout"
                type="button"
                onClick={handleLogout}
              >
                <HiArrowRightOnRectangle size={18} />
                <span>Sair</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  )
}

export default DashboardSidebar
