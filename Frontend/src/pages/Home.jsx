import { useMemo, useState } from 'react'
import {
  HiArrowRight,
  HiBars3,
  HiBolt,
  HiBuildingOffice2,
  HiChatBubbleLeftRight,
  HiCheck,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown,
  HiCpuChip,
  HiCreditCard,
  HiEnvelope,
  HiGlobeAlt,
  HiPhone,
  HiShieldCheck,
  HiSquares2X2,
  HiUserGroup,
  HiUsers,
  HiXMark,
} from 'react-icons/hi2'
import { Link } from 'react-router-dom'

const ASSET_BASE = '/home-template/assets/img'

const navLinks = [
  { label: 'Solução', href: '#solucao' },
  { label: 'Módulos', href: '#modulos' },
  { label: 'Agentes', href: '#agentes' },
  { label: 'Planos', href: '#planos' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contato', href: '#contato' },
]

const heroSlides = [
  {
    eyebrow: 'Plataforma SaaS multiempresa',
    title: ['ATENDIMENTO,', 'CRM E', 'AUTOMAÇÃO'],
    description:
      'Atendimento multiusuário via WhatsApp, CRM, cobranças automatizadas e agentes com IA — em uma única operação SaaS.',
    ctaPrimary: { label: 'Ver planos', href: '#planos' },
    ctaSecondary: { label: 'Agendar demonstração', href: '#contato' },
  },
  {
    eyebrow: 'IA oficial via OpenAI',
    title: ['VENDA,', 'ORGANIZE E', 'AUTOMATIZE'],
    description:
      'Crie um único agente geral ou vários agentes especializados para vendas, suporte, cobrança e qualificação de leads.',
    ctaPrimary: { label: 'Explorar agentes', href: '#agentes' },
    ctaSecondary: { label: 'Conhecer módulos', href: '#modulos' },
  },
]

const solutionCards = [
  {
    icon: <HiChatBubbleLeftRight size={22} />,
    title: 'Multiatendimento via WhatsApp',
    description:
      'Centralize conversas, distribua atendimentos por usuário e acompanhe todo o histórico por cliente em uma caixa compartilhada.',
  },
  {
    icon: <HiUsers size={22} />,
    title: 'CRM simples e escalável',
    description:
      'Organize contatos, leads, oportunidades, etiquetas, anotações e etapas do funil com foco em produtividade comercial.',
  },
  {
    icon: <HiCreditCard size={22} />,
    title: 'Cobranças automáticas',
    description:
      'Controle vencimentos, inadimplência, links de pagamento e lembretes por WhatsApp e e-mail sem processos manuais repetitivos.',
  },
  {
    icon: <HiCpuChip size={22} />,
    title: 'Agentes com IA oficial OpenAI',
    description:
      'Use IA para responder, resumir conversas, classificar intenções e automatizar etapas sensíveis com regras e auditoria.',
  },
]

const productHighlights = [
  'OpenAI como provider oficial de IA',
  'Z-API no MVP para conexão de WhatsApp',
  'Resend para e-mails transacionais',
  'Asaas para cobranças, assinaturas e pagamentos',
]

const operationalSteps = [
  {
    step: 'Passo 1',
    icon: <HiChatBubbleLeftRight size={22} />,
    title: 'Conectar WhatsApp',
    description:
      'Crie a instância, exiba o QR Code da Z-API e coloque o número em operação no painel.',
  },
  {
    step: 'Passo 2',
    icon: <HiUserGroup size={22} />,
    title: 'Organizar CRM',
    description: 'Cadastre contatos, leads, funil, anotações e histórico para cada cliente.',
  },
  {
    step: 'Passo 3',
    icon: <HiCreditCard size={22} />,
    title: 'Automatizar cobranças',
    description:
      'Dispare lembretes, acompanhe inadimplência e distribua links de pagamento.',
  },
  {
    step: 'Passo 4',
    icon: <HiBolt size={22} />,
    title: 'Ativar agentes',
    description:
      'Configure agentes por objetivo, base de conhecimento, tom de voz e gatilhos.',
  },
]

const testimonials = [
  {
    quote:
      'O time comercial ganha histórico centralizado, funil visível e mais velocidade para qualificar leads e fechar oportunidades.',
    title: 'Gestão comercial',
    subtitle: 'CRM e atendimento',
  },
  {
    quote:
      'O financeiro acompanha vencimentos, aciona cobranças pelo canal certo e reduz tarefas manuais com integração de pagamento.',
    title: 'Operação financeira',
    subtitle: 'Cobranças e inadimplência',
  },
  {
    quote:
      'O atendimento usa IA para resumir conversas, sugerir respostas e transferir para humano com contexto completo.',
    title: 'Suporte e sucesso do cliente',
    subtitle: 'IA aplicada ao dia a dia',
  },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '0',
    suffix: 'base de entrada',
    items: [
      '1 empresa e operação inicial',
      'Cadastro de contatos e leads',
      'Histórico de conversas básico',
      'Funil comercial inicial',
      'Usuários e perfis essenciais',
      'Uso orientado a validação',
      'Ideal para começar',
    ],
    cta: 'Falar com o time',
  },
  {
    name: 'Pro',
    price: '149',
    suffix: 'por mês',
    featured: true,
    items: [
      'Multiatendimento com equipe',
      'CRM com funil e etiquetas',
      'Cobranças por WhatsApp e e-mail',
      'Automações operacionais',
      'Relatórios e histórico ampliado',
      'Configuração de agentes por setor',
      'Ideal para operação comercial ativa',
    ],
    cta: 'Solicitar demo',
  },
  {
    name: 'Premium',
    price: '299',
    suffix: 'por mês',
    items: [
      'Operação multiempresa mais robusta',
      'Agentes com IA e regras avançadas',
      'Base de conhecimento por agente',
      'Auditoria de fluxos sensíveis',
      'Automações comerciais e de cobrança',
      'Escalabilidade para times maiores',
      'Foco em produtividade e controle',
    ],
    cta: 'Agendar demonstração',
  },
]

const faqItems = [
  'O Reachify atende só WhatsApp?',
  'Posso operar com um único agente?',
  'Qual provider de IA é oficial?',
  'Como entram as cobranças no sistema?',
  'O sistema será multiempresa?',
  'Quais perfis de acesso estão previstos?',
  'Quais fontes de conhecimento os agentes podem usar?',
  'Já existe estratégia futura para WhatsApp?',
  'O produto cobre CRM e atendimento juntos?',
  'Quais páginas iniciais estão sugeridas?',
]

const faqAnswers = [
  'No MVP, o foco inicial é o WhatsApp com Z-API, mas a modelagem do produto considera também e-mail, site, formulário e CRM como canais de atuação.',
  'Sim. A divisão em vários agentes é opcional. O produto foi definido para suportar um agente geral ou vários agentes separados por setor, objetivo ou etapa.',
  'A decisão técnica atual do produto define a OpenAI como provider oficial para agentes, automações, geração de respostas, resumos e classificação de intenção.',
  'O módulo contempla cadastro de cobranças, parcelas, vencimentos, status de pagamento, inadimplência, lembretes automáticos e links de pagamento com Asaas.',
  'Sim. A base do projeto foi definida como SaaS multiempresa, com isolamento de dados por cliente, usuários vinculados, limites por plano e configurações por workspace.',
  'Os perfis iniciais listados na documentação são: Administrador SaaS, Dono da empresa, Gestor, Atendente e Financeiro.',
  'A base prevista inclui PDFs, textos, links, FAQs, catálogos de produtos, políticas comerciais, scripts internos e documentos institucionais.',
  'Sim. A direção oficial do produto é evoluir da Z-API no MVP para a WhatsApp Cloud API oficial da Meta, preservando uma camada de abstração por provider.',
  'Sim. A proposta do Reachify é unir atendimento, relacionamento, CRM, cobrança e recursos de IA em um sistema único e simples de operar.',
  'A documentação sugere Login, Cadastro, Dashboard, Contatos, Conversas, CRM, Cobranças, Automações, IA, Configurações e Planos.',
]

const footerProductDirections = [
  { label: 'IA oficial:', value: 'OpenAI' },
  { label: 'WhatsApp no MVP:', value: 'Z-API' },
  { label: 'E-mails:', value: 'Resend' },
  { label: 'Cobranças:', value: 'Asaas' },
]

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)

  const faqColumns = useMemo(() => {
    const items = faqItems.map((question, index) => ({
      id: index,
      question,
      answer: faqAnswers[index],
    }))
    return [items.slice(0, 5), items.slice(5)]
  }, [])

  function toggleFaq(index) {
    setOpenFaqIndex((cur) => (cur === index ? -1 : index))
  }

  const prevSlide = () => setActiveSlide((cur) => (cur === 0 ? heroSlides.length - 1 : cur - 1))
  const nextSlide = () => setActiveSlide((cur) => (cur === heroSlides.length - 1 ? 0 : cur + 1))
  const slide = heroSlides[activeSlide]

  return (
    <main id="bdy" className="lp">

      {/* ── HEADER ───────────────────────────────────── */}
      <header className="lp-header">
        <div className="lp-container lp-header__inner">
          <a className="lp-brand" href="#bdy">
            <span className="lp-brand__mark">R</span>
            <div>
              <span className="lp-brand__name">Reachify</span>
              <span className="lp-brand__tag">Atendimento, CRM e IA</span>
            </div>
          </a>

          <button
            className="lp-header__burger"
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <HiXMark size={22} /> : <HiBars3 size={22} />}
          </button>

          <nav className={`lp-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="lp-nav__link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="lp-nav__sep" />
            <Link to="/login" className="lp-nav__login">Entrar</Link>
            <Link to="/cadastro" className="lp-nav__cta">Criar conta</Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero__bg" />
        <div className="lp-hero__overlay" />

        <button className="lp-hero__prev" type="button" onClick={prevSlide} aria-label="Slide anterior">
          <HiChevronLeft size={24} />
        </button>
        <button className="lp-hero__next" type="button" onClick={nextSlide} aria-label="Próximo slide">
          <HiChevronRight size={24} />
        </button>

        <div className="lp-container">
          <div className="lp-hero__body">
            <span className="lp-hero__eyebrow">
              <span />
              {slide.eyebrow}
            </span>
            <h1 className="lp-hero__h1">
              {slide.title.map((line, i) => (
                <span key={i} style={{ display: 'block' }}>
                  {i === slide.title.length - 1 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>
            <p className="lp-hero__desc">{slide.description}</p>
            <div className="lp-hero__actions">
              <a className="lp-btn lp-btn--primary" href={slide.ctaPrimary.href}>
                {slide.ctaPrimary.label}
                <HiArrowRight size={16} />
              </a>
              <a className="lp-btn lp-btn--outline" href={slide.ctaSecondary.href}>
                {slide.ctaSecondary.label}
              </a>
            </div>
          </div>

          <div className="lp-hero__laptop">
            <img src={`${ASSET_BASE}/header/laptop2.png`} alt="Painel do Reachify" />
          </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────────── */}
      <section id="solucao" className="lp-section">
        <div className="lp-container">
          <div className="lp-solution-grid">
            {solutionCards.map((card) => (
              <article key={card.title} className="lp-solution-card">
                <div className="lp-solution-card__icon">{card.icon}</div>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT SPLIT ────────────────────────────── */}
      <section className="lp-section lp-section--alt">
        <div className="lp-container">
          <div className="lp-split">
            <div className="lp-split__copy">
              <span className="lp-eyebrow">Produto orientado a operação real</span>
              <h2>Uma base SaaS multiempresa para atendimento, relacionamento e cobrança</h2>
              <p>
                O Reachify foi pensado para empresas que precisam vender mais, atender melhor e
                reduzir tarefas repetitivas. A arquitetura nasce com isolamento por empresa, gestão
                de usuários, regras de negócio e integrações preparadas para evolução.
              </p>
              <ul className="lp-checklist">
                {productHighlights.map((item) => (
                  <li key={item}>
                    <span className="lp-checklist__icon"><HiCheck size={14} /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lp-split__visual">
              <img src={`${ASSET_BASE}/bg/about.jpg`} alt="Equipe operando o Reachify" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="lp-section" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="lp-container">
          <div className="lp-stats">
            <div className="lp-stat">
              <HiBuildingOffice2 size={22} className="lp-stat__icon" />
              <strong className="lp-stat__num">1</strong>
              <span className="lp-stat__label">Plataforma centralizada</span>
            </div>
            <div className="lp-stat">
              <HiUsers size={22} className="lp-stat__icon" />
              <strong className="lp-stat__num">5</strong>
              <span className="lp-stat__label">Perfis iniciais de acesso</span>
            </div>
            <div className="lp-stat">
              <HiSquares2X2 size={22} className="lp-stat__icon" />
              <strong className="lp-stat__num">4</strong>
              <span className="lp-stat__label">Integrações oficiais do MVP</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULES / DASHBOARD ──────────────────────── */}
      <section id="modulos" className="lp-section lp-section--alt">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Módulos do sistema</span>
            <h2>Visão geral da plataforma</h2>
            <p>
              Dashboard objetivo, módulos bem separados e experiência clara para equipes
              comerciais, de suporte e financeiro operarem sem fricção.
            </p>
          </div>
          <div className="lp-dashboard-grid">
            {['Dashboard Reachify', 'Módulo CRM Reachify', 'Módulo de cobranças Reachify'].map((alt) => (
              <div key={alt} className="lp-dashboard-card">
                <img src={`${ASSET_BASE}/dashboard/dashboard.png`} alt={alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS + AGENT ────────────────────────────── */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Fluxo operacional</span>
            <h2>Do canal à IA — em quatro passos</h2>
            <p>
              Conexão do canal, organização do CRM, automação comercial e apoio com IA:
              tudo em uma jornada contínua.
            </p>
          </div>
          <div className="lp-steps-wrap">
            <div className="lp-steps-grid">
              {operationalSteps.map((step) => (
                <article key={step.title} className="lp-step-card">
                  <div className="lp-step-card__head">
                    <span className="lp-step-card__badge">{step.step}</span>
                    <div className="lp-step-card__icon">{step.icon}</div>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>

            <aside id="agentes" className="lp-agent-panel">
              <span className="lp-eyebrow">Agentes com IA</span>
              <h2>Um único agente geral ou vários agentes especializados</h2>
              <p>
                O Reachify suporta operação simples ou segmentada. Cada empresa pode criar
                agentes para vendas, pré-atendimento, suporte, cobrança, qualificação de leads
                ou setores específicos, com regras claras e transferência para humano quando
                necessário.
              </p>
              <img src={`${ASSET_BASE}/bg/step-2.svg`} alt="Fluxo de agentes com IA" />
            </aside>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="lp-section lp-section--alt">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Cenários de uso</span>
            <h2>Para quem é o Reachify</h2>
            <p>
              A plataforma atende operações comerciais e de relacionamento que precisam de
              centralização, contexto e automação com controle.
            </p>
          </div>
          <div className="lp-testimonials-wrap">
            <div className="lp-testimonials-media">
              <img src={`${ASSET_BASE}/choose/review.jpg`} alt="Equipe utilizando o sistema" />
            </div>
            <div className="lp-testimonials-list">
              {testimonials.map((t) => (
                <article key={t.title} className="lp-testimonial-card">
                  <img className="lp-quote-mark" src={`${ASSET_BASE}/shape/qoute.png`} alt="" />
                  <blockquote>{t.quote}</blockquote>
                  <div className="lp-testimonial-card__bio">
                    <img src={`${ASSET_BASE}/single/50x50.png`} alt="" />
                    <div>
                      <strong>{t.title}</strong>
                      <span>{t.subtitle}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────── */}
      <section id="planos" className="lp-section">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Planos do SaaS</span>
            <h2>Escolha o plano ideal para sua operação</h2>
            <p>
              A estrutura prevista contempla os planos Free, Pro e Premium, com limites por
              empresa, usuários e automações.
            </p>
          </div>
          <div className="lp-pricing-grid">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`lp-pricing-card ${plan.featured ? 'lp-pricing-card--featured' : ''}`}
              >
                <span className={`lp-pricing-card__label ${plan.featured ? 'lp-pricing-card__featured-badge' : ''}`}>
                  {plan.name}
                </span>
                <div className="lp-pricing-card__price">
                  <h3><sup>R$</sup>{plan.price}</h3>
                  <small>{plan.suffix}</small>
                </div>
                <ul>
                  {plan.items.map((item) => (
                    <li key={item}>
                      <HiCheck size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a className="lp-btn lp-btn--dark" href="#contato">
                  {plan.cta}
                  <HiArrowRight size={15} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────── */}
      <section id="contato" className="lp-section lp-section--alt">
        <div className="lp-container">
          <div className="lp-contact-card">
            <div>
              <span className="lp-eyebrow">Fale com a gente</span>
              <h2>Entre em contato com a equipe do Reachify</h2>
              <div className="lp-contact-info-list">
                <div className="lp-contact-info-item">
                  <div className="lp-contact-info-item__icon"><HiBuildingOffice2 size={20} /></div>
                  <div>
                    <strong>Modelo de operação</strong>
                    <p>SaaS multiempresa com foco em atendimento, CRM, cobrança e IA aplicada</p>
                  </div>
                </div>
                <div className="lp-contact-info-item">
                  <div className="lp-contact-info-item__icon"><HiPhone size={20} /></div>
                  <div>
                    <strong>Pronto para validar</strong>
                    <p>Agende uma demonstração e defina o desenho da sua operação</p>
                  </div>
                </div>
                <div className="lp-contact-info-item">
                  <div className="lp-contact-info-item__icon"><HiEnvelope size={20} /></div>
                  <div>
                    <strong>E-mail de contato</strong>
                    <p>contato@reachify.app</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="lp-contact-form">
              <div className="lp-contact-form__row">
                <input className="lp-field" type="text" placeholder="Nome completo*" required />
                <input className="lp-field" type="email" placeholder="E-mail corporativo*" required />
                <input className="lp-field" type="text" placeholder="WhatsApp" />
                <input className="lp-field" type="text" placeholder="Site da empresa" />
              </div>
              <input className="lp-field" type="text" placeholder="Qual módulo mais interessa?" />
              <textarea
                className="lp-field lp-field--textarea"
                rows="5"
                placeholder="Descreva sua operação, canais e desafios atuais"
              />
              <button className="lp-btn lp-btn--primary" type="submit">
                Solicitar contato
                <HiArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section id="faq" className="lp-section">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Perguntas frequentes</span>
            <h2>FAQ</h2>
            <p>
              As decisões centrais do produto e do MVP já estão documentadas para guiar
              desenvolvimento, operação e integrações.
            </p>
          </div>
          <div className="lp-faq-grid">
            {faqColumns.map((col, ci) => (
              <div key={ci} className="lp-faq-col">
                {col.map((item) => (
                  <article
                    key={item.id}
                    className={`lp-faq-item ${openFaqIndex === item.id ? 'lp-faq-item--open' : ''}`}
                  >
                    <button className="lp-faq-item__btn" type="button" onClick={() => toggleFaq(item.id)}>
                      <span>{item.id + 1}. {item.question}</span>
                      <HiChevronDown size={18} />
                    </button>
                    {openFaqIndex === item.id && (
                      <p className="lp-faq-item__answer">{item.answer}</p>
                    )}
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer__body">
            <div>
              <div className="lp-brand">
                <span className="lp-brand__mark">R</span>
                <div>
                  <span className="lp-brand__name">Reachify</span>
                  <span className="lp-brand__tag">Atendimento, CRM e IA</span>
                </div>
              </div>
              <p className="lp-footer__brand-text">
                Reachify amplia o alcance comercial da empresa, melhora o relacionamento com
                clientes e automatiza interações com inteligência aplicada ao dia a dia.
              </p>
              <form className="lp-footer__subscribe">
                <input type="email" placeholder="Seu melhor e-mail" />
                <button type="submit" aria-label="Enviar">
                  <HiEnvelope size={17} />
                </button>
              </form>
            </div>

            <div className="lp-footer__col">
              <span className="lp-footer__col-title">Navegação</span>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href}>{link.label}</a>
              ))}
            </div>

            <div className="lp-footer__col">
              <span className="lp-footer__col-title">Módulos</span>
              {['CRM', 'WhatsApp', 'Cobranças', 'Agentes IA', 'Planos SaaS', 'Demonstração'].map((item) => (
                <a key={item} href="#modulos">{item}</a>
              ))}
            </div>

            <div className="lp-footer__col">
              <span className="lp-footer__col-title">Direção do produto</span>
              {footerProductDirections.map((item) => (
                <p key={item.label}><strong>{item.label}</strong> {item.value}</p>
              ))}
            </div>
          </div>

          <div className="lp-footer__bottom">
            <p className="lp-footer__copy">
              Copyright &copy; 2026. Todos os direitos reservados por <a href="#bdy">Reachify</a>.
            </p>
            <div className="lp-footer__social">
              <a href="#" aria-label="Instagram"><HiGlobeAlt size={17} /></a>
              <a href="#" aria-label="LinkedIn"><HiBuildingOffice2 size={17} /></a>
              <a href="#" aria-label="YouTube"><HiBolt size={17} /></a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}

export default Home