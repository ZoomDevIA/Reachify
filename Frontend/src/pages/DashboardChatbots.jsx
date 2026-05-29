import { useEffect, useState } from 'react'
import {
  HiLightBulb,
  HiPlus,
} from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import { getStoredUser } from '../lib/auth.js'
import { getStoredSidebarCollapsed, setStoredSidebarCollapsed } from '../lib/dashboardUi.js'

function DashboardChatbots() {
  const navigate = useNavigate()
  const [user] = useState(() => getStoredUser())
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => getStoredSidebarCollapsed())
  const [isBannerVisible, setIsBannerVisible] = useState(true)

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

  return (
    <main
      className={`reachify-dashboard ${isSidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}
    >
      <DashboardSidebar
        user={user}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((current) => !current)}
      />

      <section className="reachify-chatbots">
        <div className="reachify-chatbots__body">
          <header className="reachify-chatbots__page-head">
            <h1>Chatbots</h1>
            <p>
              Aqui voce consegue criar e gerenciar os chatbots da sua operacao na
              Reachify.
            </p>
          </header>

          {isBannerVisible ? (
            <div className="reachify-chatbots__banner">
              <div className="reachify-chatbots__banner-icon">
                <HiLightBulb size={22} />
              </div>
              <div className="reachify-chatbots__banner-copy">
                <strong>Vamos criar seus chatbots juntos!</strong>
                <p>
                  Conheca nossos planos de implementacao e conte com nosso time para
                  estruturar fluxos especificos para sua demanda.
                </p>
                <button type="button">Ver planos</button>
              </div>
              <button
                type="button"
                className="reachify-chatbots__banner-close"
                onClick={() => setIsBannerVisible(false)}
              >
                ×
              </button>
            </div>
          ) : null}

          <section className="reachify-chatbots__empty-card">
            <div className="reachify-chatbots__empty-actions">
              <button type="button" onClick={() => navigate('/dashboard/chatbots/editor')}>
                <HiPlus size={18} />
                <span>Novo chatbot</span>
              </button>
            </div>

            <div className="reachify-chatbots__empty-illustration">
              <div className="reachify-chatbots__sheet reachify-chatbots__sheet--back" />
              <div className="reachify-chatbots__sheet reachify-chatbots__sheet--front">
                <div className="reachify-chatbots__sheet-plus">
                  <HiPlus size={22} />
                </div>
              </div>
            </div>

            <strong>Crie seu primeiro chatbot!</strong>
          </section>
        </div>
      </section>
    </main>
  )
}

export default DashboardChatbots
