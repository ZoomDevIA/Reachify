import {
  HiArrowTrendingUp,
  HiArrowRightOnRectangle,
  HiBell,
  HiBolt,
  HiChatBubbleBottomCenterText,
  HiChatBubbleLeftRight,
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiCog6Tooth,
  HiLifebuoy,
  HiMegaphone,
  HiSquares2X2,
  HiUsers,
} from 'react-icons/hi2'
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

  function handleLogout() {
    clearStoredSession()
    navigate('/login', { replace: true })
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

        <button
          className="reachify-dashboard__nav-item reachify-dashboard__logout"
          type="button"
          onClick={handleLogout}
          data-tooltip="Logout"
          aria-label="Logout"
        >
          <HiArrowRightOnRectangle size={20} />
          <span>Sair</span>
        </button>

        <div className="reachify-dashboard__profile">
          <div className="reachify-dashboard__profile-avatar">
            {(user?.email?.[0] ?? 'R').toUpperCase()}
          </div>
          <div className="reachify-dashboard__profile-copy">
            <strong title={user?.email ?? 'Usuario Reachify'}>
              {user?.email ?? 'Usuario Reachify'}
            </strong>
            <span>Operacao ativa</span>
          </div>
          <HiChevronDown size={16} />
        </div>
      </div>
    </aside>
  )
}

export default DashboardSidebar
