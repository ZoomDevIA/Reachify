import { useEffect, useMemo, useRef, useState } from 'react'
import {
  HiArrowTrendingUp,
  HiBars3BottomLeft,
  HiBell,
  HiBolt,
  HiCheck,
  HiChatBubbleBottomCenterText,
  HiChatBubbleLeftRight,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown,
  HiCog6Tooth,
  HiCreditCard,
  HiBuildingOffice2,
  HiCheckCircle,
  HiEnvelope,
  HiLifebuoy,
  HiLockClosed,
  HiLockOpen,
  HiMagnifyingGlass,
  HiMegaphone,
  HiPaintBrush,
  HiPlus,
  HiSquares2X2,
  HiSparkles,
  HiTag,
  HiUsers,
  HiXMark,
} from 'react-icons/hi2'
import { fetchOnboardingStatus, getStoredUser, saveOnboardingProgress } from '../lib/auth.js'
import DashboardSidebar from '../components/DashboardSidebar.jsx'

const conversationTabs = [
  { key: 'entrada', label: 'Entrada', count: 1 },
  { key: 'esperando', label: 'Esperando', count: 3 },
  { key: 'finalizados', label: 'Finalizados', count: 12 },
]

const conversationItems = [
  {
    id: 1,
    title: 'Agente Reachify',
    preview: 'Ola, posso organizar contatos, CRM, cobrancas e automacoes para sua operacao.',
    channel: 'WhatsApp',
    queue: 'Geral',
    time: 'ha 2 dias',
    unread: true,
  },
  {
    id: 2,
    title: 'Lead Comercial',
    preview: 'Cliente pediu demonstracao do modulo de multiatendimento.',
    channel: 'CRM',
    queue: 'Vendas',
    time: 'ha 18 min',
    unread: false,
  },
]

const bulkConversationActions = [
  { value: 'finalizar', label: 'Finalizar conversas', icon: HiCheck },
  { value: 'adicionar_etiqueta', label: 'Adicionar etiqueta', icon: HiTag },
  { value: 'remover_etiqueta', label: 'Remover etiqueta', icon: HiTag },
  { value: 'marcar_lida', label: 'Marcar como lida', icon: HiCheckCircle },
  { value: 'marcar_nao_lida', label: 'Marcar como nao lida', icon: HiEnvelope },
  { value: 'privar', label: 'Privar conversa', icon: HiLockClosed },
  { value: 'liberar', label: 'Liberar conversa', icon: HiLockOpen },
]

const onboardingGoalOptions = [
  { value: 'Vender mais', icon: HiArrowTrendingUp },
  { value: 'Automatizar atendimento', icon: HiChatBubbleLeftRight },
  { value: 'Organizar clientes', icon: HiUsers },
  { value: 'Automatizar cobrancas', icon: HiCreditCard },
  { value: 'Melhorar suporte', icon: HiLifebuoy },
]

const onboardingToneOptions = [
  { value: 'Formal', icon: HiBuildingOffice2 },
  { value: 'Amigavel', icon: HiSparkles },
  { value: 'Comercial', icon: HiArrowTrendingUp },
  { value: 'Tecnico', icon: HiPaintBrush },
]

const businessSegmentOptions = [
  { value: 'Ciberseguranca', icon: HiSquares2X2 },
  { value: 'Clinica', icon: HiBuildingOffice2 },
  { value: 'E-commerce', icon: HiCreditCard },
  { value: 'Imobiliaria', icon: HiBuildingOffice2 },
  { value: 'Educacao', icon: HiUsers },
  { value: 'Servicos', icon: HiChatBubbleLeftRight },
  { value: 'Outros', icon: HiSparkles },
]

const employeesCountOptions = [
  { value: '1-5', icon: HiUsers },
  { value: '6-20', icon: HiUsers },
  { value: '21-50', icon: HiUsers },
  { value: '51-100', icon: HiUsers },
  { value: '100+', icon: HiUsers },
  { value: 'Outros', icon: HiSparkles },
]

const knownBusinessSegments = new Set(
  businessSegmentOptions.filter((option) => option.value !== 'Outros').map((option) => option.value)
)

const knownEmployeesRanges = new Set(
  employeesCountOptions.filter((option) => option.value !== 'Outros').map((option) => option.value)
)

function isDebugEnabled() {
  return import.meta.env.DEV
}

function debugOnboarding(event, payload) {
  if (!isDebugEnabled()) {
    return
  }

  console.groupCollapsed(`[reachify:onboarding] ${event}`)
  console.log(payload)
  console.groupEnd()
}

function normalizeSelectableValue(value, knownOptions) {
  const normalizedValue = (value ?? '').trim()

  if (!normalizedValue) {
    return { selected: '', other: '' }
  }

  if (knownOptions.has(normalizedValue)) {
    return { selected: normalizedValue, other: '' }
  }

  return { selected: 'Outros', other: normalizedValue }
}

function buildOnboardingFormState(onboarding = {}) {
  const businessSegmentState = normalizeSelectableValue(
    onboarding.business_segment,
    knownBusinessSegments
  )
  const employeesCountState = normalizeSelectableValue(
    onboarding.employees_count,
    knownEmployeesRanges
  )

  return {
    user_name: onboarding.user_name ?? '',
    company_name: onboarding.company_name ?? '',
    business_segment: businessSegmentState.selected,
    business_segment_other: businessSegmentState.other,
    employees_count: employeesCountState.selected,
    employees_count_other: employeesCountState.other,
    main_goal: onboarding.main_goal ?? '',
    ai_communication_style: onboarding.ai_communication_style ?? '',
  }
}

function resolveOnboardingPayload(form) {
  const businessSegment =
    form.business_segment === 'Outros'
      ? form.business_segment_other.trim()
      : form.business_segment.trim()
  const employeesCount =
    form.employees_count === 'Outros'
      ? form.employees_count_other.trim()
      : form.employees_count.trim()

  return {
    user_name: form.user_name.trim(),
    company_name: form.company_name.trim(),
    business_segment: businessSegment,
    employees_count: employeesCount,
    main_goal: form.main_goal,
    ai_communication_style: form.ai_communication_style,
  }
}

function Dashboard() {
  const [user, setUser] = useState(() => getStoredUser())
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.innerWidth <= 1200
  })
  const [activeTab, setActiveTab] = useState('entrada')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const [selectedConversationIds, setSelectedConversationIds] = useState([])
  const [selectedBulkAction, setSelectedBulkAction] = useState('finalizar')
  const [isBulkMenuOpen, setIsBulkMenuOpen] = useState(false)
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true)
  const [isOnboardingSaving, setIsOnboardingSaving] = useState(false)
  const [onboardingError, setOnboardingError] = useState('')
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)
  const autosaveTimeoutRef = useRef(null)
  const [onboardingForm, setOnboardingForm] = useState(() => buildOnboardingFormState())

  const visibleConversations = useMemo(() => {
    let conversations = []

    if (activeTab === 'entrada') {
      conversations = conversationItems.slice(0, 1)
    } else if (activeTab === 'esperando') {
      conversations = conversationItems.slice(1)
    }

    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return conversations
    }

    return conversations.filter((conversation) =>
      [conversation.title, conversation.preview, conversation.channel, conversation.queue]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    )
  }, [activeTab, searchTerm])

  const selectedConversation = visibleConversations.find(
    (conversation) => conversation.id === selectedConversationId
  )
  const selectedBulkActionOption =
    bulkConversationActions.find((action) => action.value === selectedBulkAction) ||
    bulkConversationActions[0]
  const allVisibleSelected =
    visibleConversations.length > 0 &&
    visibleConversations.every((conversation) => selectedConversationIds.includes(conversation.id))

  const onboardingProgress = (onboardingStep / 3) * 100

  useEffect(() => {
    let isMounted = true

    async function loadOnboarding() {
      try {
        const data = await fetchOnboardingStatus()
        debugOnboarding('load_success', data)

        if (!isMounted) {
          return
        }

        if (data.user) {
          setUser(data.user)
        }

        if (data.onboarding) {
          setOnboardingForm(buildOnboardingFormState(data.onboarding))
          setShowOnboardingModal(!data.onboarding.onboarding_completed)
        }
      } catch (error) {
        debugOnboarding('load_error', error)
        if (isMounted) {
          setOnboardingError(error.message)
          setShowOnboardingModal(true)
        }
      } finally {
        if (isMounted) {
          setIsOnboardingLoading(false)
        }
      }
    }

    loadOnboarding()

    return () => {
      isMounted = false
      if (autosaveTimeoutRef.current) {
        window.clearTimeout(autosaveTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 720) {
        setIsSidebarCollapsed(true)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (!showOnboardingModal || isOnboardingLoading) {
      return
    }

    if (autosaveTimeoutRef.current) {
      window.clearTimeout(autosaveTimeoutRef.current)
    }

    const resolvedPayload = resolveOnboardingPayload(onboardingForm)

    autosaveTimeoutRef.current = window.setTimeout(async () => {
      try {
        debugOnboarding('autosave_request', resolvedPayload)
        await saveOnboardingProgress(resolvedPayload)
      } catch (error) {
        debugOnboarding('autosave_error', error)
        // Mantem a experiencia do modal sem interromper a digitacao em caso de falha momentanea.
      }
    }, 500)

    return () => {
      if (autosaveTimeoutRef.current) {
        window.clearTimeout(autosaveTimeoutRef.current)
      }
    }
  }, [onboardingForm, showOnboardingModal, isOnboardingLoading])

  function updateOnboardingField(field, value) {
    setOnboardingForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function toggleConversationSelection(conversationId) {
    setSelectedConversationIds((current) =>
      current.includes(conversationId)
        ? current.filter((id) => id !== conversationId)
        : [...current, conversationId],
    )
  }

  function toggleAllVisibleConversations() {
    setSelectedConversationIds((current) => {
      if (allVisibleSelected) {
        return current.filter(
          (id) => !visibleConversations.some((conversation) => conversation.id === id),
        )
      }

      const next = new Set(current)
      visibleConversations.forEach((conversation) => next.add(conversation.id))
      return Array.from(next)
    })
  }

  function clearConversationSelection() {
    setSelectedConversationIds([])
    setIsBulkMenuOpen(false)
  }

  function validateOnboardingStep() {
    const resolvedPayload = resolveOnboardingPayload(onboardingForm)

    if (onboardingStep === 1) {
      if (
        !resolvedPayload.user_name ||
        !resolvedPayload.company_name ||
        !resolvedPayload.business_segment ||
        !resolvedPayload.employees_count
      ) {
        setOnboardingError('Preencha todas as informacoes do negocio para continuar.')
        return false
      }
    }

    if (onboardingStep === 2 && !onboardingForm.main_goal) {
      setOnboardingError('Selecione o principal objetivo da sua operacao.')
      return false
    }

    if (onboardingStep === 3 && !onboardingForm.ai_communication_style) {
      setOnboardingError('Selecione como a IA deve falar com seus clientes.')
      return false
    }

    setOnboardingError('')
    return true
  }

  async function handleOnboardingContinue() {
    if (!validateOnboardingStep()) {
      return
    }

    const resolvedPayload = resolveOnboardingPayload(onboardingForm)

    if (onboardingStep < 3) {
      setIsOnboardingSaving(true)

      try {
        debugOnboarding('continue_step_request', {
          step: onboardingStep,
          payload: resolvedPayload,
        })
        await saveOnboardingProgress(resolvedPayload)
        setOnboardingStep((current) => current + 1)
      } catch (error) {
        debugOnboarding('continue_step_error', error)
        setOnboardingError(error.message)
      } finally {
        setIsOnboardingSaving(false)
      }

      return
    }

    setIsOnboardingSaving(true)

    try {
      const finalPayload = {
        ...resolvedPayload,
        onboarding_completed: true,
      }
      debugOnboarding('finish_request', finalPayload)
      const data = await saveOnboardingProgress({
        ...finalPayload,
      })
      if (data.user) {
        setUser(data.user)
      }
      setShowOnboardingModal(false)
    } catch (error) {
      debugOnboarding('finish_error', error)
      setOnboardingError(error.message)
    } finally {
      setIsOnboardingSaving(false)
    }
  }

  function renderOnboardingStep() {
    if (onboardingStep === 1) {
      return (
        <div className="reachify-onboarding__form-grid">
          <label className="reachify-onboarding__field">
            <span>Nome do usuario</span>
            <div className="reachify-onboarding__input-shell">
              <HiUsers size={18} />
              <input
                type="text"
                value={onboardingForm.user_name}
                onChange={(event) => updateOnboardingField('user_name', event.target.value)}
                placeholder="Seu nome"
              />
            </div>
          </label>

          <label className="reachify-onboarding__field">
            <span>Nome da empresa</span>
            <div className="reachify-onboarding__input-shell">
              <HiBuildingOffice2 size={18} />
              <input
                type="text"
                value={onboardingForm.company_name}
                onChange={(event) => updateOnboardingField('company_name', event.target.value)}
                placeholder="Nome da empresa"
              />
            </div>
          </label>

          <label className="reachify-onboarding__field">
            <span>Segmento do negocio</span>
            <div className="reachify-onboarding__input-shell">
              <HiSquares2X2 size={18} />
              <select
                value={onboardingForm.business_segment}
                onChange={(event) => updateOnboardingField('business_segment', event.target.value)}
              >
                <option value="">Selecione um segmento</option>
                {businessSegmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
            {onboardingForm.business_segment === 'Outros' ? (
              <div className="reachify-onboarding__input-shell">
                <HiSquares2X2 size={18} />
                <input
                  type="text"
                  value={onboardingForm.business_segment_other}
                  onChange={(event) =>
                    updateOnboardingField('business_segment_other', event.target.value)
                  }
                  placeholder="Descreva o segmento do negocio"
                />
              </div>
            ) : null}
          </label>

          <label className="reachify-onboarding__field">
            <span>Quantidade de funcionarios</span>
            <div className="reachify-onboarding__input-shell">
              <HiUsers size={18} />
              <select
                value={onboardingForm.employees_count}
                onChange={(event) => updateOnboardingField('employees_count', event.target.value)}
              >
                <option value="">Selecione uma faixa</option>
                {employeesCountOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
            {onboardingForm.employees_count === 'Outros' ? (
              <div className="reachify-onboarding__input-shell">
                <HiUsers size={18} />
                <input
                  type="text"
                  value={onboardingForm.employees_count_other}
                  onChange={(event) =>
                    updateOnboardingField('employees_count_other', event.target.value)
                  }
                  placeholder="Ex.: 200+, time distribuido ou estrutura personalizada"
                />
              </div>
            ) : null}
          </label>
        </div>
      )
    }

    if (onboardingStep === 2) {
      return (
        <div className="reachify-onboarding__options-grid">
          {onboardingGoalOptions.map((option) => {
            const Icon = option.icon

            return (
              <button
                key={option.value}
                className={`reachify-onboarding__option-card ${
                  onboardingForm.main_goal === option.value ? 'is-selected' : ''
                }`}
                type="button"
                onClick={() => updateOnboardingField('main_goal', option.value)}
              >
                <Icon size={20} />
                <span>{option.value}</span>
              </button>
            )
          })}
        </div>
      )
    }

    return (
      <div className="reachify-onboarding__options-grid">
        {onboardingToneOptions.map((option) => {
          const Icon = option.icon

          return (
            <button
              key={option.value}
              className={`reachify-onboarding__option-card ${
                onboardingForm.ai_communication_style === option.value ? 'is-selected' : ''
              }`}
              type="button"
              onClick={() => updateOnboardingField('ai_communication_style', option.value)}
            >
              <Icon size={20} />
              <span>{option.value}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <main
      className={`reachify-dashboard ${isSidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}
    >
      {showOnboardingModal ? (
        <div className="reachify-onboarding">
          <div className="reachify-onboarding__dialog" role="dialog" aria-modal="true" aria-labelledby="reachify-onboarding-title">
            <div className="reachify-onboarding__progress">
              <div className="reachify-onboarding__progress-bar" style={{ width: `${onboardingProgress}%` }} />
            </div>

            <div className="reachify-onboarding__header">
              <span className="reachify-onboarding__eyebrow">Onboarding inicial</span>
              <h2 id="reachify-onboarding-title">
                {onboardingStep === 1 && 'Conte sobre o seu negocio'}
                {onboardingStep === 2 && 'Qual seu principal objetivo usando a Reachify?'}
                {onboardingStep === 3 && 'Como a IA deve falar com seus clientes?'}
              </h2>
              <p>
                A Reachify usa essas respostas para preparar agentes, automacoes, CRM e atendimento no contexto real da sua operacao.
              </p>
            </div>

            {renderOnboardingStep()}

            {onboardingError ? (
              <p className="auth-feedback auth-feedback--error">{onboardingError}</p>
            ) : null}

            <div className="reachify-onboarding__footer">
              <button
                className="reachify-onboarding__ghost-button"
                type="button"
                onClick={() => setOnboardingStep((current) => Math.max(current - 1, 1))}
                disabled={onboardingStep === 1 || isOnboardingSaving}
              >
                Voltar
              </button>
              <button
                className="reachify-onboarding__primary-button"
                type="button"
                onClick={handleOnboardingContinue}
                disabled={isOnboardingSaving || isOnboardingLoading}
              >
                {isOnboardingSaving
                  ? 'Salvando...'
                  : onboardingStep === 3
                    ? 'Finalizar onboarding'
                    : 'Continuar'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <DashboardSidebar
        user={user}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((current) => !current)}
      />

      <section className="reachify-dashboard__inbox">
        <header className="reachify-dashboard__panel-header">
          <h1>Conversas</h1>
          <div className="reachify-dashboard__panel-actions">
            <button className="is-primary" type="button" aria-label="Nova conversa">
              <HiPlus size={22} />
            </button>
          </div>
        </header>

        <div className="reachify-dashboard__search">
          <HiMagnifyingGlass size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nome ou telefone"
          />
        </div>

        {selectedConversationIds.length > 0 ? (
          <div className="reachify-dashboard__bulk-panel">
            <div className="reachify-dashboard__bulk-head">
              <label className="reachify-dashboard__bulk-check">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisibleConversations}
                />
              </label>
              <strong>Selecione uma conversa</strong>
              <button
                className="reachify-dashboard__bulk-close"
                type="button"
                onClick={clearConversationSelection}
                aria-label="Fechar selecao"
              >
                <HiXMark size={18} />
              </button>
            </div>

            <div className="reachify-dashboard__bulk-bar">
              <div className="reachify-dashboard__bulk-select">
                <button
                  className="reachify-dashboard__bulk-select-button"
                  type="button"
                  onClick={() => setIsBulkMenuOpen((current) => !current)}
                >
                  <span>
                    <HiCheck size={16} />
                    {selectedBulkActionOption.label}
                  </span>
                  <HiChevronDown size={16} />
                </button>

                {isBulkMenuOpen ? (
                  <div className="reachify-dashboard__bulk-dropdown">
                    {bulkConversationActions.map((action) => {
                      const Icon = action.icon

                      return (
                        <button
                          key={action.value}
                          type="button"
                          className={selectedBulkAction === action.value ? 'is-selected' : ''}
                          onClick={() => {
                            setSelectedBulkAction(action.value)
                            setIsBulkMenuOpen(false)
                          }}
                        >
                          <Icon size={16} />
                          <span>{action.label}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : null}
              </div>

              <button className="reachify-dashboard__bulk-apply" type="button">
                Aplicar
              </button>
            </div>
          </div>
        ) : null}

        <div className="reachify-dashboard__tabs">
          {conversationTabs.map((tab) => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? 'is-active' : ''}
              type="button"
              onClick={() => {
                setActiveTab(tab.key)
                setSelectedConversationId(null)
                setSelectedConversationIds([])
                setIsBulkMenuOpen(false)
              }}
            >
              <span>{tab.label}</span>
              <small>{tab.count}</small>
            </button>
          ))}
        </div>

        <article className="reachify-dashboard__banner">
          <div className="reachify-dashboard__banner-count">4</div>
          <div className="reachify-dashboard__banner-copy">
            <p>
              Seu periodo de testes finaliza <strong>daqui a 4 dias</strong>.
            </p>
            <button type="button">Assinar agora</button>
          </div>
        </article>

        <div className="reachify-dashboard__conversation-list">
          {visibleConversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`reachify-dashboard__conversation-card ${
                selectedConversationId === conversation.id ? 'is-selected' : ''
              }`}
              type="button"
              onClick={() => setSelectedConversationId(conversation.id)}
            >
              <label
                className="reachify-dashboard__conversation-check"
                onClick={(event) => event.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedConversationIds.includes(conversation.id)}
                  onChange={() => toggleConversationSelection(conversation.id)}
                />
              </label>
              <div className="reachify-dashboard__conversation-avatar">AI</div>
              <div className="reachify-dashboard__conversation-content">
                <div className="reachify-dashboard__conversation-top">
                  <strong>{conversation.title}</strong>
                  <span>{conversation.time}</span>
                </div>
                <p>{conversation.preview}</p>
                <div className="reachify-dashboard__conversation-meta">
                  <span>{conversation.channel}</span>
                  <span>{conversation.queue}</span>
                  {conversation.unread ? <small>novo</small> : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="reachify-dashboard__workspace">
        {isOnboardingLoading ? (
          <div className="reachify-dashboard__empty-state">
            <h2>Carregando seu workspace</h2>
            <p>Estamos preparando o contexto inicial da sua operacao Reachify.</p>
          </div>
        ) : selectedConversation ? (
          <div className="reachify-dashboard__workspace-card">
            <div className="reachify-dashboard__workspace-card-header">
              <div className="reachify-dashboard__workspace-avatar">AI</div>
              <div>
                <strong>{selectedConversation.title}</strong>
                <span>{selectedConversation.channel} • {selectedConversation.queue}</span>
              </div>
            </div>
            <div className="reachify-dashboard__workspace-message is-agent">
              <p>Ola. Sou o agente oficial do Reachify e posso seguir com atendimento, CRM e cobrancas.</p>
            </div>
            <div className="reachify-dashboard__workspace-message">
              <p>{selectedConversation.preview}</p>
            </div>
          </div>
        ) : (
          <div className="reachify-dashboard__empty-state">
            <div className="reachify-dashboard__empty-illustration">
              <div className="reachify-dashboard__empty-card is-front">
                <span />
                <span />
                <span />
              </div>
              <div className="reachify-dashboard__empty-card is-back">
                <span />
                <span />
                <span />
              </div>
            </div>
            <h2>Selecione uma conversa</h2>
            <p>
              Acompanhe atendimento, CRM, multiatendimento, cobrancas e automacoes em um unico painel Reachify.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard
