import { useEffect, useRef, useState } from 'react'
import {
  HiArrowPath,
  HiBars3BottomLeft,
  HiChatBubbleLeftRight,
  HiChevronDown,
  HiHandRaised,
  HiLightBulb,
  HiMagnifyingGlass,
  HiPencilSquare,
  HiPlus,
} from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import { getStoredUser } from '../lib/auth.js'
import { getStoredSidebarCollapsed, setStoredSidebarCollapsed } from '../lib/dashboardUi.js'

function DashboardChatbotEditor() {
  const [user] = useState(() => getStoredUser())
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => getStoredSidebarCollapsed())
  const [flowName, setFlowName] = useState('Fluxo Reachify')
  const [messageText, setMessageText] = useState('Ola! Eu sou o chatbot da Reachify.')
  const [isListed, setIsListed] = useState(false)
  const [isPanModeActive, setIsPanModeActive] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const canvasRef = useRef(null)
  const panStateRef = useRef({
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
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

  useEffect(() => {
    function stopPanning() {
      setIsPanning(false)
    }

    window.addEventListener('mouseup', stopPanning)
    return () => window.removeEventListener('mouseup', stopPanning)
  }, [])

  function beginCanvasPan(event) {
    const isRightButton = event.button === 2
    const canPanWithLeftButton = isPanModeActive && event.button === 0

    if (!isRightButton && !canPanWithLeftButton) {
      return
    }

    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    event.preventDefault()

    panStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: canvas.scrollLeft,
      scrollTop: canvas.scrollTop,
    }

    setIsPanning(true)
  }

  function handleCanvasPan(event) {
    if (!isPanning) {
      return
    }

    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    event.preventDefault()

    const deltaX = event.clientX - panStateRef.current.startX
    const deltaY = event.clientY - panStateRef.current.startY

    canvas.scrollLeft = panStateRef.current.scrollLeft - deltaX
    canvas.scrollTop = panStateRef.current.scrollTop - deltaY
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

      <section className="reachify-chatbots">
        <div className="reachify-chatbots__editor-page">
          <header className="reachify-chatbots__editor-topbar">
            <div className="reachify-chatbots__editor-breadcrumbs">
              <Link to="/dashboard/chatbots">Chatbots</Link>
              <span>/</span>
              <span>Fluxo</span>
            </div>

            <button
              type="button"
              className="reachify-chatbots__editor-search"
              aria-label="Pesquisar"
            >
              <HiMagnifyingGlass size={18} />
            </button>
          </header>

          <div className="reachify-chatbots__editor-toolbar">
            <div className="reachify-chatbots__editor-toolbar-left">
              <button className="is-primary" type="button">
                <HiPlus size={18} />
              </button>
              <button type="button">
                <HiLightBulb size={18} />
              </button>
              <button type="button">
                <HiArrowPath size={18} />
              </button>
              <button
                type="button"
                className={isPanModeActive ? 'is-active-tool' : ''}
                onClick={() => setIsPanModeActive((current) => !current)}
                aria-pressed={isPanModeActive}
                title="Mover mapa"
              >
                <HiHandRaised size={18} />
              </button>
              <button type="button">
                <HiBars3BottomLeft size={18} />
              </button>
            </div>

            <div className="reachify-chatbots__editor-toolbar-right">
              <span className="reachify-chatbots__editor-status">Alteracoes nao salvas</span>
              <div className="reachify-chatbots__editor-flow-name">
                <strong>{flowName}</strong>
                <HiPencilSquare size={16} />
              </div>
            </div>
          </div>

          <div
            ref={canvasRef}
            className={`reachify-chatbots__canvas ${
              isPanModeActive ? 'is-pan-mode' : ''
            } ${isPanning ? 'is-panning' : ''}`}
            onMouseDown={beginCanvasPan}
            onMouseMove={handleCanvasPan}
            onContextMenu={(event) => event.preventDefault()}
          >
            <div className="reachify-chatbots__canvas-surface">
              <svg
                className="reachify-chatbots__connections"
                viewBox="0 0 1600 1200"
                preserveAspectRatio="none"
              >
                <path d="M 150 290 C 170 430, 430 470, 690 470" />
                <path d="M 438 290 C 438 420, 560 470, 690 470" />
              </svg>

              <article
                className="reachify-chatbots__node reachify-chatbots__node--channel"
                style={{ left: 42, top: 70 }}
              >
                <div className="reachify-chatbots__node-handle reachify-chatbots__node-handle--out" />
                <header>
                  <HiChatBubbleLeftRight size={20} />
                  <strong>Iniciar por um canal</strong>
                </header>
                <p>Selecione um ou mais canais</p>
                <button type="button" className="reachify-chatbots__select">
                  <span>Selecione</span>
                  <HiChevronDown size={16} />
                </button>
                <div className="reachify-chatbots__warning">E necessario selecionar um canal</div>
              </article>

              <article
                className="reachify-chatbots__node reachify-chatbots__node--start"
                style={{ left: 330, top: 70 }}
              >
                <div className="reachify-chatbots__node-handle reachify-chatbots__node-handle--out" />
                <header>
                  <HiLightBulb size={20} />
                  <strong>Iniciar manualmente</strong>
                </header>
                <label>
                  <span>Titulo</span>
                  <input
                    type="text"
                    value={flowName}
                    onChange={(event) => setFlowName(event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className={`reachify-chatbots__toggle ${isListed ? 'is-active' : ''}`}
                  onClick={() => setIsListed((current) => !current)}
                >
                  <span />
                  <strong>{isListed ? 'Listado' : 'Nao listado'}</strong>
                </button>
                <button type="button" className="reachify-chatbots__advanced">
                  Avancado
                </button>
              </article>

              <article
                className="reachify-chatbots__node reachify-chatbots__node--message"
                style={{ left: 620, top: 370 }}
              >
                <div className="reachify-chatbots__node-handle reachify-chatbots__node-handle--in" />
                <div className="reachify-chatbots__node-handle reachify-chatbots__node-handle--out is-gray" />
                <header>
                  <HiChatBubbleLeftRight size={20} />
                  <strong>Enviar mensagem</strong>
                </header>
                <div className="reachify-chatbots__node-toolbar">
                  <span>Mensagem</span>
                  <div>
                    <HiPencilSquare size={16} />
                    <span>{'{ }'}</span>
                    <span>⋮</span>
                  </div>
                </div>
                <textarea
                  rows="3"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                />
              </article>
            </div>

            <div className="reachify-chatbots__canvas-controls">
              <button type="button">−</button>
              <button type="button">100%</button>
              <button type="button">+</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default DashboardChatbotEditor
