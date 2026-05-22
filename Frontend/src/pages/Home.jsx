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
  { label: 'Solucao', href: '#solucao' },
  { label: 'Modulos', href: '#modulos' },
  { label: 'Agentes', href: '#agentes' },
  { label: 'Planos', href: '#planos' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contato', href: '#contato' },
]

const heroSlides = [
  {
    title: ['ATENDIMENTO,', 'CRM E', 'AUTOMACAO'],
    description:
      'Atendimento multiusuario via WhatsApp, CRM, cobrancas automatizadas e agentes com IA em uma unica operacao SaaS.',
    ctaPrimary: { label: 'Ver planos', href: '#planos' },
    ctaSecondary: { label: 'Agendar demonstracao', href: '#contato' },
    overlay: 'linear-gradient(135deg, rgba(11, 15, 20, 0.28), rgba(25, 135, 84, 0.44))',
  },
  {
    title: ['VENDA,', 'ORGANIZE E', 'AUTOMATIZE'],
    description:
      'Crie um unico agente geral ou varios agentes especializados para vendas, suporte, cobranca e qualificacao de leads.',
    ctaPrimary: { label: 'Explorar agentes', href: '#agentes' },
    ctaSecondary: { label: 'Conhecer modulos', href: '#modulos' },
    overlay: 'linear-gradient(135deg, rgba(11, 15, 20, 0.24), rgba(32, 159, 163, 0.4))',
  },
]

const solutionCards = [
  {
    icon: <HiChatBubbleLeftRight size={24} />,
    title: 'Multiatendimento via WhatsApp',
    description:
      'Centralize conversas, distribua atendimentos por usuario e acompanhe todo o historico por cliente em uma caixa compartilhada.',
  },
  {
    icon: <HiUsers size={24} />,
    title: 'CRM simples e escalavel',
    description:
      'Organize contatos, leads, oportunidades, etiquetas, anotacoes e etapas do funil com foco em produtividade comercial.',
  },
  {
    icon: <HiCreditCard size={24} />,
    title: 'Cobrancas automaticas',
    description:
      'Controle vencimentos, inadimplencia, links de pagamento e lembretes por WhatsApp e e-mail sem processos manuais repetitivos.',
  },
  {
    icon: <HiCpuChip size={24} />,
    title: 'Agentes com IA oficial OpenAI',
    description:
      'Use IA para responder, resumir conversas, classificar intencoes e automatizar etapas sensiveis com regras e auditoria.',
  },
]

const productHighlights = [
  'OpenAI como provider oficial de IA',
  'Z-API no MVP para conexao de WhatsApp',
  'Resend para e-mails transacionais',
  'Asaas para cobrancas, assinaturas e pagamentos',
]

const operationalSteps = [
  {
    step: 'passo 1',
    icon: <HiChatBubbleLeftRight size={24} />,
    title: 'Conectar WhatsApp',
    description:
      'Crie a instancia, exiba o QR Code da Z-API e coloque o numero em operacao no painel.',
  },
  {
    step: 'passo 2',
    icon: <HiUserGroup size={24} />,
    title: 'Organizar CRM',
    description: 'Cadastre contatos, leads, funil, anotacoes e historico para cada cliente.',
  },
  {
    step: 'passo 3',
    icon: <HiCreditCard size={24} />,
    title: 'Automatizar cobrancas',
    description:
      'Dispare lembretes, acompanhe inadimplencia e distribua links de pagamento.',
  },
  {
    step: 'passo 4',
    icon: <HiBolt size={24} />,
    title: 'Ativar agentes',
    description:
      'Configure agentes por objetivo, base de conhecimento, tom de voz e gatilhos.',
  },
]

const testimonials = [
  {
    quote:
      'O time comercial ganha historico centralizado, funil visivel e mais velocidade para qualificar leads e fechar oportunidades.',
    title: 'Gestao comercial',
    subtitle: 'CRM e atendimento',
  },
  {
    quote:
      'O financeiro acompanha vencimentos, aciona cobrancas por canal certo e reduz tarefas manuais com integracao de pagamento.',
    title: 'Operacao financeira',
    subtitle: 'Cobrancas e inadimplencia',
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
      '1 empresa e operacao inicial',
      'Cadastro de contatos e leads',
      'Historico de conversas basico',
      'Funil comercial inicial',
      'Usuarios e perfis essenciais',
      'Uso orientado a validacao',
      'Ideal para comecar',
    ],
    cta: 'Falar com o time',
  },
  {
    name: 'Pro',
    price: '149',
    suffix: 'por mes',
    featured: true,
    items: [
      'Multiatendimento com equipe',
      'CRM com funil e etiquetas',
      'Cobrancas por WhatsApp e e-mail',
      'Automacoes operacionais',
      'Relatorios e historico ampliado',
      'Configuracao de agentes por setor',
      'Ideal para operacao comercial ativa',
    ],
    cta: 'Solicitar demo',
  },
  {
    name: 'Premium',
    price: '299',
    suffix: 'por mes',
    items: [
      'Operacao multiempresa mais robusta',
      'Agentes com IA e regras avancadas',
      'Base de conhecimento por agente',
      'Auditoria de fluxos sensiveis',
      'Automacoes comerciais e de cobranca',
      'Escalabilidade para times maiores',
      'Foco em produtividade e controle',
    ],
    cta: 'Agendar demonstracao',
  },
]

const faqItems = [
  'O Reachify atende so WhatsApp?',
  'Posso operar com um unico agente?',
  'Qual provider de IA e oficial?',
  'Como entram as cobrancas no sistema?',
  'O sistema sera multiempresa?',
  'Quais perfis de acesso estao previstos?',
  'Quais fontes de conhecimento os agentes podem usar?',
  'Ja existe estrategia futura para WhatsApp?',
  'O produto cobre CRM e atendimento juntos?',
  'Quais paginas iniciais estao sugeridas?',
]

const faqAnswers = [
  'No MVP, o foco inicial e o WhatsApp com Z-API, mas a modelagem do produto considera tambem e-mail, site, formulario e CRM como canais de atuacao.',
  'Sim. A divisao em varios agentes e opcional. O produto foi definido para suportar um agente geral ou varios agentes separados por setor, objetivo ou etapa.',
  'A decisao tecnica atual do produto define a OpenAI como provider oficial para agentes, automacoes, geracao de respostas, resumos e classificacao de intencao.',
  'O modulo contempla cadastro de cobrancas, parcelas, vencimentos, status de pagamento, inadimplencia, lembretes automaticos e links de pagamento com Asaas.',
  'Sim. A base do projeto foi definida como SaaS multiempresa, com isolamento de dados por cliente, usuarios vinculados, limites por plano e configuracoes por workspace.',
  'Os perfis iniciais listados na documentacao sao: Administrador SaaS, Dono da empresa, Gestor, Atendente e Financeiro.',
  'A base prevista inclui PDFs, textos, links, FAQs, catalogos de produtos, politicas comerciais, scripts internos e documentos institucionais.',
  'Sim. A direcao oficial do produto e evoluir da Z-API no MVP para a WhatsApp Cloud API oficial da Meta, preservando uma camada de abstracao por provider.',
  'Sim. A proposta do Reachify e unir atendimento, relacionamento, CRM, cobranca e recursos de IA em um sistema unico e simples de operar.',
  'A documentacao sugere Login, Cadastro, Dashboard, Contatos, Conversas, CRM, Cobrancas, Automacoes, IA, Configuracoes e Planos.',
]

const footerProductDirections = [
  { label: 'IA oficial:', value: 'OpenAI' },
  { label: 'WhatsApp no MVP:', value: 'Z-API' },
  { label: 'E-mails:', value: 'Resend' },
  { label: 'Cobrancas:', value: 'Asaas' },
]

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [activeHeroSlide, setActiveHeroSlide] = useState(1)

  const faqColumns = useMemo(() => {
    const items = faqItems.map((question, index) => ({
      id: index,
      question,
      answer: faqAnswers[index],
    }))

    return [items.slice(0, 5), items.slice(5)]
  }, [])

  function toggleFaq(index) {
    setOpenFaqIndex((current) => (current === index ? -1 : index))
  }

  function goToPreviousSlide() {
    setActiveHeroSlide((current) => (current === 0 ? heroSlides.length - 1 : current - 1))
  }

  function goToNextSlide() {
    setActiveHeroSlide((current) => (current === heroSlides.length - 1 ? 0 : current + 1))
  }

  const currentSlide = heroSlides[activeHeroSlide]

  return (
    <main id="bdy" className="landing-home">
      <header className="landing-header">
        <div className="landing-container landing-header__inner">
          <a className="landing-brand" href="#bdy">
            <img
              className="landing-brand__logo"
              src={`${ASSET_BASE}/logo/logo-white.png`}
              alt="Reachify"
            />
          </a>

          <button
            className="landing-header__toggle"
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <HiXMark size={24} /> : <HiBars3 size={24} />}
          </button>

          <nav className={`landing-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="landing-nav__actions">
              <Link to="/login">Entrar</Link>
              <Link className="landing-nav__cta" to="/cadastro">
                Criar conta
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero__shape">
          <img src={`${ASSET_BASE}/header/header-shape.png`} alt="" />
        </div>
        <div className="landing-container">
          <div
            className="landing-hero__stage"
            style={{
              backgroundImage: `${currentSlide.overlay}, url(${ASSET_BASE}/header/2440x1578.png)`,
            }}
          >
            <button
              className="landing-hero__arrow landing-hero__arrow--left"
              type="button"
              onClick={goToPreviousSlide}
              aria-label="Slide anterior"
            >
              <HiChevronLeft size={26} />
            </button>

            <article className="landing-hero__slide">
              <div className="landing-hero__content">
                <h1>
                  {currentSlide.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h1>
                <p>{currentSlide.description}</p>
                <div className="landing-hero__actions">
                  <a className="landing-btn landing-btn--solid" href={currentSlide.ctaPrimary.href}>
                    {currentSlide.ctaPrimary.label}
                  </a>
                  <a className="landing-btn landing-btn--ghost" href={currentSlide.ctaSecondary.href}>
                    {currentSlide.ctaSecondary.label}
                  </a>
                </div>
              </div>
              <div className="landing-hero__ghost-size">2440 x 1578</div>
            </article>

            <button
              className="landing-hero__arrow landing-hero__arrow--right"
              type="button"
              onClick={goToNextSlide}
              aria-label="Próximo slide"
            >
              <HiChevronRight size={26} />
            </button>
          </div>

          <div className="landing-laptop">
            <img src={`${ASSET_BASE}/header/laptop2.png`} alt="Painel do Reachify" />
          </div>
        </div>
      </section>

      <section id="solucao" className="landing-section">
        <div className="landing-container">
          <div className="landing-feature-shell">
            <div className="landing-feature-grid">
            {solutionCards.map((card) => (
              <article key={card.title} className="landing-feature-card">
                <div className="landing-feature-card__icon">{card.icon}</div>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </article>
            ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--product">
        <div className="landing-container landing-two-column">
          <div className="landing-product-copy">
            <span className="landing-eyebrow">Produto orientado a operacao real</span>
            <h2>Uma base SaaS multiempresa para atendimento, relacionamento e cobranca</h2>
            <p>
              O Reachify foi pensado para empresas que precisam vender mais, atender
              melhor e reduzir tarefas repetitivas. A arquitetura nasce com isolamento
              por empresa, gestao de usuarios, regras de negocio e integracoes preparadas
              para evolucao.
            </p>
            <ul className="landing-check-list">
              {productHighlights.map((item) => (
                <li key={item}>
                  <HiCheck size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="landing-media-card">
            <img src={`${ASSET_BASE}/bg/about.jpg`} alt="Equipe operando o Reachify" />
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--stats">
        <div className="landing-container">
          <div className="landing-stats-grid">
            <article className="landing-stat-card">
              <HiBuildingOffice2 size={24} />
              <strong>1</strong>
              <span>Plataforma centralizada</span>
            </article>
            <article className="landing-stat-card">
              <HiUsers size={24} />
              <strong>5</strong>
              <span>Perfis iniciais de acesso</span>
            </article>
            <article className="landing-stat-card">
              <HiSquares2X2 size={24} />
              <strong>4</strong>
              <span>Integracoes oficiais do MVP</span>
            </article>
          </div>
        </div>
      </section>

      <section id="modulos" className="landing-section">
        <div className="landing-container">
          <div className="landing-section-head">
            <h2>Visao geral do sistema</h2>
            <p>
              Dashboard objetivo, modulos bem separados e experiencia clara para equipes
              comerciais, suporte e financeiro operarem sem friccao.
            </p>
          </div>

          <div className="landing-dashboard-grid">
            {['Dashboard Reachify', 'Modulo CRM Reachify', 'Modulo de cobrancas Reachify'].map((alt) => (
              <div key={alt} className="landing-dashboard-card">
                <img src={`${ASSET_BASE}/dashboard/dashboard.png`} alt={alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--steps">
        <div className="landing-container">
          <div className="landing-section-head">
            <h2>Fluxo operacional do Reachify</h2>
            <p>
              O produto foi desenhado para acompanhar toda a jornada: conexao do canal,
              organizacao do CRM, automacao comercial e apoio com IA.
            </p>
          </div>

          <div className="landing-steps-layout">
            <div className="landing-steps-grid">
              {operationalSteps.map((step) => (
                <article key={step.title} className="landing-step-card">
                  <div className="landing-step-card__top">
                    <span className="landing-step-card__badge">{step.step}</span>
                    <div className="landing-step-card__icon">{step.icon}</div>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>

            <aside id="agentes" className="landing-agent-panel">
              <h2>Um unico agente geral ou varios agentes especializados</h2>
              <p>
                O Reachify suporta operacao simples ou segmentada. Cada empresa pode
                criar agentes para vendas, pre-atendimento, suporte, cobranca,
                qualificacao de leads ou setores especificos, com regras claras e
                transferencia para humano quando necessario.
              </p>
              <img src={`${ASSET_BASE}/bg/step-2.svg`} alt="Fluxo de agentes com IA" />
            </aside>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-section-head">
            <h2>Cenarios de uso</h2>
            <p>
              A plataforma atende operacoes comerciais e de relacionamento que precisam
              de centralizacao, contexto e automacao com controle.
            </p>
          </div>

          <div className="landing-testimonial-layout">
            <div className="landing-media-card">
              <img src={`${ASSET_BASE}/choose/review.jpg`} alt="Equipe utilizando o sistema" />
            </div>
            <div className="landing-testimonials">
              {testimonials.map((testimonial) => (
                <article key={testimonial.title} className="landing-testimonial-card">
                  <div className="landing-testimonial-card__quote-mark">
                    <img src={`${ASSET_BASE}/shape/qoute.png`} alt="" />
                  </div>
                  <blockquote>{testimonial.quote}</blockquote>
                  <div className="landing-testimonial-card__bio">
                    <img src={`${ASSET_BASE}/single/50x50.png`} alt="" />
                    <div>
                      <strong>{testimonial.title}</strong>
                      <span>{testimonial.subtitle}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="planos" className="landing-section landing-section--pricing">
        <div className="landing-container">
          <div className="landing-section-head">
            <h2>Planos iniciais do SaaS</h2>
            <p>
              A estrutura prevista do produto contempla os planos Free, Pro e Premium,
              com limites por empresa, usuarios e automacoes.
            </p>
          </div>

          <div className="landing-pricing-grid">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`landing-pricing-card ${plan.featured ? 'is-featured' : ''}`}
              >
                <span className="landing-pricing-card__label">{plan.name}</span>
                <div className="landing-pricing-card__price">
                  <h3>
                    <span>R$</span>
                    {plan.price}
                  </h3>
                  <small>{plan.suffix}</small>
                </div>
                <ul>
                  {plan.items.map((item) => (
                    <li key={item}>
                      <HiCheck size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a className="landing-btn landing-btn--solid" href="#contato">
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="landing-section">
        <div className="landing-container">
          <div className="landing-contact-card">
            <div className="landing-contact-card__info">
              <h2>Fale com a equipe do Reachify</h2>

              <div className="landing-contact-list">
                <article>
                  <div className="landing-contact-list__icon">
                    <HiBuildingOffice2 size={22} />
                  </div>
                  <div>
                    <strong>Modelo de operacao</strong>
                    <p>SaaS multiempresa com foco em atendimento, CRM, cobranca e IA aplicada</p>
                  </div>
                </article>
                <article>
                  <div className="landing-contact-list__icon">
                    <HiPhone size={22} />
                  </div>
                  <div>
                    <strong>Pronto para validar</strong>
                    <p>Agende uma demonstracao e defina o desenho da sua operacao</p>
                  </div>
                </article>
                <article>
                  <div className="landing-contact-list__icon">
                    <HiEnvelope size={22} />
                  </div>
                  <div>
                    <strong>E-mail sugerido</strong>
                    <p>contato@reachify.app</p>
                  </div>
                </article>
              </div>
            </div>

            <form className="landing-contact-form">
              <div className="landing-contact-form__grid">
                <input type="text" placeholder="Nome completo*" required />
                <input type="email" placeholder="E-mail corporativo*" required />
                <input type="text" placeholder="WhatsApp" />
                <input type="text" placeholder="Site da empresa" />
              </div>
              <input type="text" placeholder="Qual modulo mais interessa?" />
              <textarea
                rows="5"
                placeholder="Descreva sua operacao, canais e desafios atuais"
              />
              <button className="landing-btn landing-btn--solid" type="submit">
                Solicitar contato
                <HiArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section id="faq" className="landing-section">
        <div className="landing-container">
          <div className="landing-section-head">
            <h2>FAQ</h2>
            <p>
              As decisoes centrais do produto e do MVP ja estao documentadas para guiar
              desenvolvimento, operacao e integracoes.
            </p>
          </div>

          <div className="landing-faq-grid">
            {faqColumns.map((column, columnIndex) => (
              <div key={`faq-column-${columnIndex}`} className="landing-faq-column">
                {column.map((item) => (
                  <article
                    key={item.id}
                    className={`landing-faq-item ${openFaqIndex === item.id ? 'is-open' : ''}`}
                  >
                    <button type="button" onClick={() => toggleFaq(item.id)}>
                      <span>{item.id + 1}. {item.question}</span>
                      <HiChevronDown size={18} />
                    </button>
                    {openFaqIndex === item.id ? <p>{item.answer}</p> : null}
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer__grid">
            <div className="landing-footer__brand">
              <div className="landing-brand landing-brand--footer">
                <span className="landing-brand__mark">R</span>
                <span className="landing-brand__copy">
                  <strong>Reachify</strong>
                  <small>Atendimento, CRM e IA</small>
                </span>
              </div>
              <p>
                Reachify amplia o alcance comercial da empresa, melhora o relacionamento
                com clientes e automatiza interacoes com inteligencia aplicada ao dia a dia.
              </p>
              <form className="landing-footer__subscribe">
                <input type="email" placeholder="Seu melhor e-mail" />
                <button type="submit" aria-label="Enviar">
                  <HiEnvelope size={18} />
                </button>
              </form>
            </div>

            <div className="landing-footer__list">
              <h3>Navegacao</h3>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>

            <div className="landing-footer__list">
              <h3>Modulos</h3>
              {['CRM', 'WhatsApp', 'Cobrancas', 'Agentes IA', 'Planos SaaS', 'Demonstracao'].map((item) => (
                <a key={item} href="#modulos">
                  {item}
                </a>
              ))}
            </div>

            <div className="landing-footer__list">
              <h3>Direcao do produto</h3>
              {footerProductDirections.map((item) => (
                <p key={item.label}>
                  <strong>{item.label}</strong> {item.value}
                </p>
              ))}
            </div>
          </div>

          <div className="landing-footer__bottom">
            <p>
              Copyright &copy; 2026. Todos os direitos reservados por{' '}
              <a href="#bdy">Reachify</a>.
            </p>
            <div className="landing-footer__social">
              <a href="#" aria-label="Instagram">
                <HiGlobeAlt size={18} />
              </a>
              <a href="#" aria-label="LinkedIn">
                <HiBuildingOffice2 size={18} />
              </a>
              <a href="#" aria-label="YouTube">
                <HiBolt size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default Home
