import { useEffect, useMemo, useState } from 'react'
import {
  HiArrowLeft,
  HiArrowsUpDown,
  HiCalendarDays,
  HiChevronDown,
  HiChevronRight,
  HiClock,
  HiEllipsisVertical,
  HiEnvelope,
  HiEye,
  HiHashtag,
  HiInformationCircle,
  HiMagnifyingGlass,
  HiMapPin,
  HiNoSymbol,
  HiPencilSquare,
  HiPhone,
  HiPlus,
  HiTrash,
  HiUser,
  HiXMark,
} from 'react-icons/hi2'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import { getStoredUser } from '../lib/auth.js'
import { getStoredSidebarCollapsed, setStoredSidebarCollapsed } from '../lib/dashboardUi.js'

const initialContacts = [
  {
    id: 1,
    name: 'Agente Reachify',
    phone: '+55 11 94221-6152',
    email: 'agente@reachify.app',
    tag: 'Geral',
    lastActivity: 'Hoje, 09:24',
    landline: '',
    gender: 'Prefiro nao informar',
    createdAt: '25/05/2026 01:27',
    notes: [],
    activityLogs: [],
    conversations: [
      {
        id: 1,
        date: '21/05/2026',
        status: 'Em andamento',
        weekday: 'Quinta-feira',
        title: 'Me responde aqui se achou legal...',
        preview: 'Serio, responde ai alguma coisa para continuarmos...',
        time: '23:09',
      },
      {
        id: 2,
        date: '19/05/2026',
        status: 'Finalizada',
        weekday: 'Terça-feira',
        title: 'Atualizacao da proposta comercial',
        preview: 'Cliente pediu revisao dos valores e prazo de implantacao.',
        time: '16:42',
      },
      {
        id: 3,
        date: '14/05/2026',
        status: 'Em espera',
        weekday: 'Quarta-feira',
        title: 'Validacao de integracao com WhatsApp',
        preview: 'Aguardando retorno sobre o numero que sera conectado.',
        time: '10:15',
      },
    ],
  },
]

const segmentTags = ['Todos', 'Lead', 'Cliente', 'VIP']
const sortOptions = ['Ultima atividade', 'Nome', 'Criacao mais recente']
const genderOptions = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'prefiro_nao_informar', label: 'Prefiro nao informar' },
]

function normalizeDigits(value) {
  return value.replace(/\D/g, '')
}

function formatPhone(value) {
  const digits = normalizeDigits(value).slice(0, 11)

  if (digits.length <= 2) {
    return digits ? `(${digits}` : ''
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatZipCode(value) {
  const digits = normalizeDigits(value).slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

function isValidFullName(value) {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter((part) => part.length >= 2)

  return parts.length >= 2
}

function isValidPhone(value) {
  const digits = normalizeDigits(value)
  return digits.length === 10 || digits.length === 11
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function createEmptyContact() {
  return {
    name: '',
    mobile: '',
    landline: '',
    email: '',
    gender: 'prefiro_nao_informar',
    createdAt: new Date().toLocaleString('pt-BR'),
    address: '',
    complement: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  }
}

function createContactDetailForm(contact) {
  return {
    name: contact?.name || '',
    phone: formatPhone(contact?.phone || ''),
  }
}

function DashboardContacts() {
  const [user] = useState(() => getStoredUser())
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => getStoredSidebarCollapsed())
  const [isCreatingContact, setIsCreatingContact] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('Todos')
  const [selectedSort, setSelectedSort] = useState('Ultima atividade')
  const [contacts, setContacts] = useState(initialContacts)
  const [contactForm, setContactForm] = useState(() => createEmptyContact())
  const [selectedContact, setSelectedContact] = useState(null)
  const [isEditingContactDetails, setIsEditingContactDetails] = useState(false)
  const [contactDetailForm, setContactDetailForm] = useState(() => createContactDetailForm(null))
  const [contactDetailErrors, setContactDetailErrors] = useState({})
  const [activeDetailView, setActiveDetailView] = useState('overview')
  const [contactNoteDraft, setContactNoteDraft] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [zipLookupMessage, setZipLookupMessage] = useState({
    tone: 'neutral',
    text: 'Opcional: informe o CEP para tentar preencher o endereco automaticamente.',
  })

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
    setStoredSidebarCollapsed(isSidebarCollapsed)
  }, [isSidebarCollapsed])

  const filteredContacts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return contacts.filter((contact) => {
      const matchesSearch =
        !normalizedSearch ||
        contact.name.toLowerCase().includes(normalizedSearch) ||
        contact.phone.toLowerCase().includes(normalizedSearch) ||
        contact.email.toLowerCase().includes(normalizedSearch)

      const matchesTag = selectedTag === 'Todos' || contact.tag === selectedTag

      return matchesSearch && matchesTag
    })
  }, [contacts, searchTerm, selectedTag])

  function updateContactField(field, value) {
    const formattedValue =
      field === 'mobile' || field === 'landline'
        ? formatPhone(value)
        : field === 'zipCode'
          ? formatZipCode(value)
          : value

    setContactForm((current) => ({
      ...current,
      [field]: formattedValue,
    }))

    setFormErrors((current) => {
      if (!current[field]) {
        return current
      }

      const next = { ...current }
      delete next[field]
      return next
    })

    if (field === 'zipCode' && normalizeDigits(formattedValue).length < 8) {
      setZipLookupMessage({
        tone: 'neutral',
        text: 'Opcional: informe o CEP para tentar preencher o endereco automaticamente.',
      })
    }
  }

  function openCreateContact() {
    setContactForm(createEmptyContact())
    setFormErrors({})
    setZipLookupMessage({
      tone: 'neutral',
      text: 'Opcional: informe o CEP para tentar preencher o endereco automaticamente.',
    })
    setIsCreatingContact(true)
  }

  function closeCreateContact() {
    setContactForm(createEmptyContact())
    setFormErrors({})
    setZipLookupMessage({
      tone: 'neutral',
      text: 'Opcional: informe o CEP para tentar preencher o endereco automaticamente.',
    })
    setIsCreatingContact(false)
  }

  function openContactDetails(contact) {
    setSelectedContact(contact)
    setIsEditingContactDetails(false)
    setActiveDetailView('overview')
    setContactDetailForm(createContactDetailForm(contact))
    setContactDetailErrors({})
    setContactNoteDraft('')
  }

  function closeContactDetails() {
    setSelectedContact(null)
    setIsEditingContactDetails(false)
    setActiveDetailView('overview')
    setContactDetailForm(createContactDetailForm(null))
    setContactDetailErrors({})
    setContactNoteDraft('')
  }

  function startEditingContactDetails() {
    if (!selectedContact) {
      return
    }

    setIsEditingContactDetails(true)
    setContactDetailForm(createContactDetailForm(selectedContact))
    setContactDetailErrors({})
  }

  function cancelEditingContactDetails() {
    if (!selectedContact) {
      return
    }

    setIsEditingContactDetails(false)
    setContactDetailForm(createContactDetailForm(selectedContact))
    setContactDetailErrors({})
  }

  function updateContactDetailField(field, value) {
    const nextValue = field === 'phone' ? formatPhone(value) : value

    setContactDetailForm((current) => ({
      ...current,
      [field]: nextValue,
    }))

    setContactDetailErrors((current) => {
      if (!current[field]) {
        return current
      }

      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleSaveContactDetails() {
    if (!selectedContact) {
      return
    }

    const errors = {}

    if (!isValidFullName(contactDetailForm.name)) {
      errors.name = 'Informe nome e sobrenome.'
    }

    if (!isValidPhone(contactDetailForm.phone)) {
      errors.phone = 'Informe um celular valido no formato brasileiro.'
    }

    if (Object.keys(errors).length > 0) {
      setContactDetailErrors(errors)
      return
    }

    const updatedContact = {
      ...selectedContact,
      name: contactDetailForm.name.trim(),
      phone: contactDetailForm.phone.trim(),
    }

    setContacts((current) =>
      current.map((contact) => (contact.id === selectedContact.id ? updatedContact : contact)),
    )
    setSelectedContact(updatedContact)
    setIsEditingContactDetails(false)
    setContactDetailErrors({})
  }

  function openDetailSubpage(view) {
    setIsEditingContactDetails(false)
    setActiveDetailView(view)
  }

  function returnToDetailOverview() {
    setIsEditingContactDetails(false)
    setActiveDetailView('overview')
  }

  function addContactObservation() {
    if (!selectedContact || !contactNoteDraft.trim()) {
      return
    }

    const nextNote = {
      id: Date.now(),
      text: contactNoteDraft.trim(),
      createdAt: new Date().toLocaleString('pt-BR'),
    }

    const updatedContact = {
      ...selectedContact,
      notes: [nextNote, ...(selectedContact.notes || [])],
    }

    setContacts((current) =>
      current.map((contact) => (contact.id === selectedContact.id ? updatedContact : contact)),
    )
    setSelectedContact(updatedContact)
    setContactNoteDraft('')
  }

  async function handleZipCodeBlur() {
    const zipDigits = normalizeDigits(contactForm.zipCode)

    if (!zipDigits) {
      setZipLookupMessage({
        tone: 'neutral',
        text: 'Opcional: informe o CEP para tentar preencher o endereco automaticamente.',
      })
      return
    }

    if (zipDigits.length !== 8) {
      setFormErrors((current) => ({
        ...current,
        zipCode: 'CEP deve ter 8 digitos.',
      }))
      setZipLookupMessage({
        tone: 'error',
        text: 'CEP invalido. Use o formato 00000-000.',
      })
      return
    }

    setZipLookupMessage({
      tone: 'neutral',
      text: 'Buscando endereco pelo CEP...',
    })

    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipDigits}/json/`)
      const data = await response.json()

      if (!response.ok || data.erro) {
        throw new Error('CEP nao encontrado')
      }

      setContactForm((current) => ({
        ...current,
        address: [data.logradouro, data.bairro].filter(Boolean).join(', '),
        city: data.localidade || current.city,
        state: data.uf || current.state,
        country: current.country || 'Brasil',
      }))

      setFormErrors((current) => {
        const next = { ...current }
        delete next.zipCode
        return next
      })

      setZipLookupMessage({
        tone: 'success',
        text: 'Endereco preenchido automaticamente pelo CEP. Voce ainda pode ajustar manualmente.',
      })
    } catch {
      setZipLookupMessage({
        tone: 'error',
        text: 'Nao foi possivel localizar o CEP. Voce pode preencher o endereco manualmente.',
      })
    }
  }

  function handleCreateContact(event) {
    event.preventDefault()

    const errors = {}

    if (!isValidFullName(contactForm.name)) {
      errors.name = 'Informe nome e sobrenome.'
    }

    if (!isValidPhone(contactForm.mobile)) {
      errors.mobile = 'Informe um celular valido no formato brasileiro.'
    }

    if (contactForm.landline.trim() && !isValidPhone(contactForm.landline)) {
      errors.landline = 'Telefone fixo invalido.'
    }

    if (!isValidEmail(contactForm.email)) {
      errors.email = 'Informe um e-mail valido.'
    }

    if (contactForm.zipCode.trim() && normalizeDigits(contactForm.zipCode).length !== 8) {
      errors.zipCode = 'CEP deve ter 8 digitos.'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const newContact = {
      id: Date.now(),
      name: contactForm.name.trim(),
      phone: contactForm.mobile.trim(),
      email: contactForm.email.trim(),
      tag: 'Lead',
      lastActivity: 'Agora',
      landline: contactForm.landline.trim(),
      gender:
        genderOptions.find((option) => option.value === contactForm.gender)?.label ||
        'Prefiro nao informar',
      createdAt: contactForm.createdAt,
    }

    setContacts((current) => [newContact, ...current])
    closeCreateContact()
  }

  return (
    <main
      className={`reachify-dashboard reachify-dashboard--contacts ${
        isSidebarCollapsed ? 'is-sidebar-collapsed' : ''
      }`}
    >
      <DashboardSidebar
        user={user}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((current) => !current)}
      />

      <section className="reachify-contacts">
        <header className="reachify-contacts__topbar">
          <strong>Reachify desk</strong>
          <span>Contatos</span>
          {isCreatingContact ? <small>/ Novo contato</small> : null}
        </header>

        <div className="reachify-contacts__body">
          {isCreatingContact ? (
            <>
              <div className="reachify-contacts__page-head reachify-contacts__page-head--detail">
                <button
                  className="reachify-contacts__back"
                  type="button"
                  onClick={closeCreateContact}
                >
                  <HiArrowLeft size={20} />
                </button>
                <div>
                  <h1>Contatos</h1>
                  <p>
                    Aqui voce pode gerenciar as informacoes dos seus contatos e acessar os
                    historicos de mensagens.
                  </p>
                </div>
              </div>

              <section className="reachify-contacts__form-card">
                <div className="reachify-contacts__form-header">
                  <strong>Novo contato</strong>
                  <button type="button" onClick={closeCreateContact} aria-label="Fechar">
                    <HiXMark size={18} />
                  </button>
                </div>

                <div className="reachify-contacts__avatar-stage">
                  <div className="reachify-contacts__avatar-circle">
                    <HiUser size={56} />
                  </div>
                  <button type="button" className="reachify-contacts__avatar-action">
                    <HiPlus size={16} />
                  </button>
                </div>

                <form className="reachify-contacts__form" onSubmit={handleCreateContact}>
                  <div className="reachify-contacts__section-label">
                    <span>Informacoes basicas</span>
                  </div>

                  <div className="reachify-contacts__form-grid">
                    <label className="reachify-contacts__field">
                      <span>Nome</span>
                      <div
                        className={`reachify-contacts__input-shell ${
                          formErrors.name ? 'is-invalid' : ''
                        }`}
                      >
                        <HiUser size={18} />
                        <input
                          type="text"
                          value={contactForm.name}
                          onChange={(event) => updateContactField('name', event.target.value)}
                          placeholder="Nome completo"
                        />
                      </div>
                      <small className="reachify-contacts__field-helper">
                        {formErrors.name || 'Use nome e sobrenome.'}
                      </small>
                    </label>

                    <label className="reachify-contacts__field">
                      <span>Celular</span>
                      <div
                        className={`reachify-contacts__input-shell ${
                          formErrors.mobile ? 'is-invalid' : ''
                        }`}
                      >
                        <HiPhone size={18} />
                        <input
                          type="text"
                          value={contactForm.mobile}
                          onChange={(event) => updateContactField('mobile', event.target.value)}
                          placeholder="(11) 96123-4567"
                        />
                      </div>
                      <small className="reachify-contacts__field-helper">
                        {formErrors.mobile || 'Formato esperado: (11) 96123-4567'}
                      </small>
                    </label>
                  </div>

                  <div className="reachify-contacts__section-label">
                    <span>Dados complementares</span>
                  </div>

                  <div className="reachify-contacts__form-grid">
                    <label className="reachify-contacts__field">
                      <span>Telefone fixo</span>
                      <div
                        className={`reachify-contacts__input-shell ${
                          formErrors.landline ? 'is-invalid' : ''
                        }`}
                      >
                        <HiPhone size={18} />
                        <input
                          type="text"
                          value={contactForm.landline}
                          onChange={(event) => updateContactField('landline', event.target.value)}
                          placeholder="(11) 3123-4567"
                        />
                      </div>
                      <small className="reachify-contacts__field-helper">
                        {formErrors.landline || 'Opcional. Se informar, use um telefone valido.'}
                      </small>
                    </label>

                    <label className="reachify-contacts__field">
                      <span>E-mail</span>
                      <div
                        className={`reachify-contacts__input-shell ${
                          formErrors.email ? 'is-invalid' : ''
                        }`}
                      >
                        <HiEnvelope size={18} />
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(event) => updateContactField('email', event.target.value)}
                          placeholder="contato@empresa.com"
                        />
                      </div>
                      <small className="reachify-contacts__field-helper">
                        {formErrors.email || 'Use um e-mail valido, como contato@empresa.com'}
                      </small>
                    </label>

                    <label className="reachify-contacts__field">
                      <span>Genero</span>
                      <div className="reachify-contacts__input-shell">
                        <HiUser size={18} />
                        <select
                          value={contactForm.gender}
                          onChange={(event) => updateContactField('gender', event.target.value)}
                        >
                          {genderOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <small className="reachify-contacts__field-helper">
                        Escolha como deseja registrar esse contato.
                      </small>
                    </label>

                    <label className="reachify-contacts__field">
                      <span>Data de criacao</span>
                      <div className="reachify-contacts__input-shell">
                        <HiCalendarDays size={18} />
                        <input type="text" value={contactForm.createdAt} readOnly />
                      </div>
                      <small className="reachify-contacts__field-helper">
                        Gerada automaticamente pelo sistema.
                      </small>
                    </label>
                  </div>

                  <label className="reachify-contacts__field">
                    <span>Endereco</span>
                    <div className="reachify-contacts__input-shell">
                      <HiMapPin size={18} />
                      <input
                        type="text"
                        value={contactForm.address}
                        onChange={(event) => updateContactField('address', event.target.value)}
                        placeholder="Rua, numero, bairro e cidade"
                      />
                    </div>
                  </label>

                  <label className="reachify-contacts__field">
                    <span>Complemento</span>
                    <div className="reachify-contacts__input-shell">
                      <HiMapPin size={18} />
                      <input
                        type="text"
                        value={contactForm.complement}
                        onChange={(event) => updateContactField('complement', event.target.value)}
                        placeholder="Apto. 123"
                      />
                    </div>
                  </label>

                  <div className="reachify-contacts__form-grid">
                    <label className="reachify-contacts__field">
                      <span>Cidade</span>
                      <div className="reachify-contacts__input-shell">
                        <HiMapPin size={18} />
                        <input
                          type="text"
                          value={contactForm.city}
                          onChange={(event) => updateContactField('city', event.target.value)}
                          placeholder="Sao Paulo"
                        />
                      </div>
                    </label>

                    <label className="reachify-contacts__field">
                      <span>Estado</span>
                      <div className="reachify-contacts__input-shell">
                        <HiMapPin size={18} />
                        <input
                          type="text"
                          value={contactForm.state}
                          onChange={(event) => updateContactField('state', event.target.value)}
                          placeholder="SP"
                        />
                      </div>
                    </label>

                    <label className="reachify-contacts__field">
                      <span>CEP</span>
                      <div
                        className={`reachify-contacts__input-shell ${
                          formErrors.zipCode ? 'is-invalid' : ''
                        }`}
                      >
                        <HiMapPin size={18} />
                        <input
                          type="text"
                          value={contactForm.zipCode}
                          onChange={(event) => updateContactField('zipCode', event.target.value)}
                          onBlur={handleZipCodeBlur}
                          placeholder="11111-111"
                        />
                      </div>
                      <small
                        className={`reachify-contacts__field-helper is-${zipLookupMessage.tone}`}
                      >
                        {formErrors.zipCode || zipLookupMessage.text}
                      </small>
                    </label>

                    <label className="reachify-contacts__field">
                      <span>Pais</span>
                      <div className="reachify-contacts__input-shell">
                        <HiMapPin size={18} />
                        <input
                          type="text"
                          value={contactForm.country}
                          onChange={(event) => updateContactField('country', event.target.value)}
                          placeholder="BR"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="reachify-contacts__form-actions">
                    <button
                      className="reachify-contacts__ghost-button"
                      type="button"
                      onClick={closeCreateContact}
                    >
                      Cancelar
                    </button>
                    <button className="reachify-contacts__primary-button" type="submit">
                      Salvar contato
                    </button>
                  </div>
                </form>
              </section>
            </>
          ) : (
            <>
              <div className="reachify-contacts__page-head">
                <div>
                  <div className="reachify-contacts__page-title-row">
                    <h1>Contatos</h1>
                    <small>{filteredContacts.length}</small>
                  </div>
                  <p>
                    Aqui voce pode gerenciar as informacoes dos seus contatos e acessar os
                    historicos de mensagens.
                  </p>
                </div>
              </div>

              <section className="reachify-contacts__list-card">
                <div className="reachify-contacts__toolbar">
                  <div className="reachify-contacts__search">
                    <HiMagnifyingGlass size={18} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Pesquisar"
                    />
                  </div>

                  <div className="reachify-contacts__toolbar-filters">
                    <div className="reachify-contacts__filter-chip">
                      <span>{selectedTag}</span>
                      <HiChevronDown size={16} />
                    </div>
                    <div className="reachify-contacts__filter-chip">
                      <span>Etiquetas</span>
                      <HiChevronDown size={16} />
                    </div>
                    <div className="reachify-contacts__filter-chip reachify-contacts__filter-chip--wide">
                      <span>Ordenar por: {selectedSort}</span>
                      <HiChevronDown size={16} />
                    </div>
                    <button className="reachify-contacts__icon-button" type="button">
                      <HiArrowsUpDown size={18} />
                    </button>
                  </div>

                  <div className="reachify-contacts__toolbar-actions">
                    <button
                      className="reachify-contacts__primary-button"
                      type="button"
                      onClick={openCreateContact}
                    >
                      <HiPlus size={18} />
                      <span>Adicionar contato</span>
                    </button>
                    <button className="reachify-contacts__icon-button" type="button">
                      <HiEllipsisVertical size={18} />
                    </button>
                  </div>
                </div>

                <div className="reachify-contacts__table">
                  <div className="reachify-contacts__table-head">
                    <label className="reachify-contacts__check">
                      <input type="checkbox" />
                    </label>
                    <strong>Contato</strong>
                    <strong>Acoes</strong>
                  </div>

                  {filteredContacts.map((contact) => (
                    <div key={contact.id} className="reachify-contacts__table-row">
                      <label className="reachify-contacts__check">
                        <input type="checkbox" />
                      </label>

                      <div className="reachify-contacts__contact-cell">
                        <div className="reachify-contacts__contact-avatar">
                          {contact.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong>{contact.name}</strong>
                          <span>{contact.phone}</span>
                        </div>
                      </div>

                      <div className="reachify-contacts__row-actions">
                        <span className="reachify-contacts__tag">{contact.tag}</span>
                        <button
                          className="reachify-contacts__icon-button"
                          type="button"
                          onClick={() => openContactDetails(contact)}
                        >
                          <HiEye size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="reachify-contacts__toolbar-meta">
                    {segmentTags.map((tag) => (
                      <button
                        key={tag}
                        className={`reachify-contacts__tag-filter ${
                          selectedTag === tag ? 'is-active' : ''
                        }`}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}

                    <div className="reachify-contacts__sort-pills">
                      {sortOptions.map((option) => (
                        <button
                          key={option}
                          className={`reachify-contacts__sort-pill ${
                            selectedSort === option ? 'is-active' : ''
                          }`}
                          type="button"
                          onClick={() => setSelectedSort(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        {selectedContact ? (
          <div className="reachify-contacts__detail-overlay" onClick={closeContactDetails}>
            <aside
              className="reachify-contacts__detail-drawer"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="reachify-contacts__detail-header">
                <div className="reachify-contacts__detail-header-top">
                  <button
                    className="reachify-contacts__detail-close"
                    type="button"
                    onClick={closeContactDetails}
                    aria-label="Fechar detalhes"
                  >
                    <HiXMark size={18} />
                  </button>

                  <button
                    className="reachify-contacts__detail-edit"
                    type="button"
                    onClick={startEditingContactDetails}
                    aria-label="Editar contato"
                  >
                    <HiPencilSquare size={18} />
                  </button>
                </div>

                <div className="reachify-contacts__detail-identity">
                  <div className="reachify-contacts__detail-avatar">
                    {selectedContact.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <strong>{selectedContact.name}</strong>
                    <span>{selectedContact.phone}</span>
                  </div>
                </div>
              </div>

              {isEditingContactDetails ? (
                <div className="reachify-contacts__detail-edit-body">
                  <div className="reachify-contacts__section-label">
                    <span>Informacoes basicas</span>
                  </div>

                  <div className="reachify-contacts__detail-form">
                    <label className="reachify-contacts__field">
                      <span>Nome</span>
                      <div
                        className={`reachify-contacts__input-shell ${
                          contactDetailErrors.name ? 'is-invalid' : ''
                        }`}
                      >
                        <HiUser size={18} />
                        <input
                          type="text"
                          value={contactDetailForm.name}
                          onChange={(event) =>
                            updateContactDetailField('name', event.target.value)
                          }
                          placeholder="Nome completo"
                        />
                      </div>
                      <small className="reachify-contacts__field-helper">
                        {contactDetailErrors.name || 'Use nome e sobrenome.'}
                      </small>
                    </label>

                    <label className="reachify-contacts__field">
                      <span>Celular</span>
                      <div
                        className={`reachify-contacts__input-shell ${
                          contactDetailErrors.phone ? 'is-invalid' : ''
                        }`}
                      >
                        <HiPhone size={18} />
                        <input
                          type="text"
                          value={contactDetailForm.phone}
                          onChange={(event) =>
                            updateContactDetailField('phone', event.target.value)
                          }
                          placeholder="(11) 96123-4567"
                        />
                      </div>
                      <small className="reachify-contacts__field-helper">
                        {contactDetailErrors.phone || 'Formato esperado: (11) 96123-4567'}
                      </small>
                    </label>
                  </div>

                  <div className="reachify-contacts__detail-edit-actions">
                    <button
                      className="reachify-contacts__ghost-button"
                      type="button"
                      onClick={cancelEditingContactDetails}
                    >
                      Cancelar
                    </button>
                    <button
                      className="reachify-contacts__primary-button"
                      type="button"
                      onClick={handleSaveContactDetails}
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              ) : activeDetailView === 'notes' ? (
                <div className="reachify-contacts__detail-subpage">
                  <div className="reachify-contacts__detail-subpage-head">
                    <button
                      className="reachify-contacts__detail-back"
                      type="button"
                      onClick={returnToDetailOverview}
                      aria-label="Voltar para detalhes"
                    >
                      <HiArrowLeft size={18} />
                    </button>
                    <h3>Observacoes do contato</h3>
                  </div>

                  <p className="reachify-contacts__detail-subpage-copy">
                    As observacoes deste contato podem orientar atendimento, CRM e futuras
                    automacoes dentro da Reachify.
                  </p>

                  <div className="reachify-contacts__detail-note-editor">
                    <div className="reachify-contacts__detail-note-toolbar">
                      <button type="button">B</button>
                      <button type="button">I</button>
                      <button type="button">U</button>
                      <button type="button">-</button>
                    </div>
                    <textarea
                      value={contactNoteDraft}
                      onChange={(event) => setContactNoteDraft(event.target.value)}
                      placeholder="Insira aqui a sua observacao"
                      rows="6"
                    />
                  </div>

                  <button
                    className="reachify-contacts__primary-button reachify-contacts__detail-note-submit"
                    type="button"
                    onClick={addContactObservation}
                  >
                    Adicionar observacao
                  </button>

                  {selectedContact.notes?.length ? (
                    <div className="reachify-contacts__detail-notes-list">
                      {selectedContact.notes.map((note) => (
                        <article key={note.id} className="reachify-contacts__detail-note-card">
                          <p>{note.text}</p>
                          <span>{note.createdAt}</span>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="reachify-contacts__detail-note-empty">
                      <HiInformationCircle size={16} />
                      <span>Este contato nao possui nenhuma observacao.</span>
                    </div>
                  )}
                </div>
              ) : activeDetailView === 'activity' ? (
                <div className="reachify-contacts__detail-subpage reachify-contacts__detail-subpage--scrollable">
                  <div className="reachify-contacts__detail-subpage-head">
                    <button
                      className="reachify-contacts__detail-back"
                      type="button"
                      onClick={returnToDetailOverview}
                      aria-label="Voltar para detalhes"
                    >
                      <HiArrowLeft size={18} />
                    </button>
                    <h3>Logs de atividade deste contato</h3>
                  </div>

                  {selectedContact.activityLogs?.length ? (
                    <div className="reachify-contacts__detail-log-list">
                      {selectedContact.activityLogs.map((log) => (
                        <article key={log.id} className="reachify-contacts__detail-log-card">
                          <strong>{log.title}</strong>
                          <p>{log.description}</p>
                          <span>{log.createdAt}</span>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="reachify-contacts__detail-note-empty">
                      <HiInformationCircle size={16} />
                      <span>Nenhum log de atividade encontrado.</span>
                    </div>
                  )}
                </div>
              ) : activeDetailView === 'conversations' ? (
                <div className="reachify-contacts__detail-subpage reachify-contacts__detail-subpage--scrollable">
                  <div className="reachify-contacts__detail-subpage-head">
                    <button
                      className="reachify-contacts__detail-back"
                      type="button"
                      onClick={returnToDetailOverview}
                      aria-label="Voltar para detalhes"
                    >
                      <HiArrowLeft size={18} />
                    </button>
                    <h3>Conversas do contato</h3>
                  </div>

                  <div className="reachify-contacts__detail-conversation-toolbar">
                    <button className="reachify-contacts__detail-filter" type="button">
                      Filtrar
                    </button>
                    <button className="reachify-contacts__primary-button" type="button">
                      <HiPlus size={16} />
                      <span>Conversa</span>
                    </button>
                  </div>

                  <div className="reachify-contacts__detail-conversation-list">
                    {(selectedContact.conversations || []).map((conversation) => (
                      <article
                        key={conversation.id}
                        className="reachify-contacts__detail-conversation-card"
                      >
                        <header className="reachify-contacts__detail-conversation-head">
                          <div>
                            <strong>{conversation.date}</strong>
                            <span
                              className={`reachify-contacts__detail-conversation-status ${
                                conversation.status === 'Em andamento'
                                  ? 'is-active'
                                  : conversation.status === 'Finalizada'
                                    ? 'is-finished'
                                    : 'is-waiting'
                              }`}
                            >
                              {conversation.status}
                            </span>
                          </div>
                          <HiChevronRight size={18} />
                        </header>

                        <div className="reachify-contacts__detail-conversation-day">
                          {conversation.weekday}
                        </div>

                        <div className="reachify-contacts__detail-bubble">
                          <strong>{conversation.title}</strong>
                          <p>{conversation.preview}</p>
                          <span>{conversation.time}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="reachify-contacts__detail-section">
                    <h3>Etiquetas do contato</h3>
                    <div className="reachify-contacts__detail-tag-list">
                      <span className="reachify-contacts__tag">{selectedContact.tag}</span>
                    </div>
                  </div>

                  <div className="reachify-contacts__detail-nav">
                    <button type="button" onClick={() => openDetailSubpage('notes')}>
                      <span className="reachify-contacts__detail-nav-icon">
                        <HiHashtag size={18} />
                      </span>
                      <span>Observacoes do contato</span>
                      <HiChevronRight size={18} />
                    </button>
                    <button type="button" onClick={() => openDetailSubpage('activity')}>
                      <span className="reachify-contacts__detail-nav-icon">
                        <HiClock size={18} />
                      </span>
                      <span>Logs de atividade do contato</span>
                      <HiChevronRight size={18} />
                    </button>
                    <button type="button" onClick={() => openDetailSubpage('conversations')}>
                      <span className="reachify-contacts__detail-nav-icon">
                        <HiEnvelope size={18} />
                      </span>
                      <span>Todas as conversas deste contato</span>
                      <HiChevronRight size={18} />
                    </button>
                  </div>

                  <div className="reachify-contacts__detail-meta">
                    <div className="reachify-contacts__detail-meta-row">
                      <span>Telefone fixo</span>
                      <strong>{selectedContact.landline || 'Adicionar'}</strong>
                    </div>
                    <div className="reachify-contacts__detail-meta-row">
                      <span>E-mail</span>
                      <strong>{selectedContact.email || 'Adicionar'}</strong>
                    </div>
                    <div className="reachify-contacts__detail-meta-row">
                      <span>Genero</span>
                      <strong>{selectedContact.gender || 'Adicionar'}</strong>
                    </div>
                    <div className="reachify-contacts__detail-meta-row">
                      <span>Data de criacao da conta</span>
                      <strong>{selectedContact.createdAt || 'Adicionar'}</strong>
                    </div>
                  </div>

                  <div className="reachify-contacts__detail-actions">
                    <button className="reachify-contacts__detail-ghost" type="button">
                      <HiNoSymbol size={18} />
                      <span>Bloquear contato</span>
                    </button>
                    <button className="reachify-contacts__detail-danger" type="button">
                      <HiTrash size={18} />
                      <span>Excluir contato</span>
                    </button>
                  </div>
                </>
              )}
            </aside>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default DashboardContacts
