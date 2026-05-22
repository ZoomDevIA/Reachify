import { HiChatBubbleLeftRight, HiChartBar, HiCreditCard, HiUserGroup } from 'react-icons/hi2'
import { getStoredUser } from '../lib/auth.js'

const dashboardCards = [
  { title: 'Atendimentos ativos', value: '128', icon: <HiChatBubbleLeftRight size={22} /> },
  { title: 'Novos contatos', value: '42', icon: <HiUserGroup size={22} /> },
  { title: 'Cobrancas abertas', value: '17', icon: <HiCreditCard size={22} /> },
  { title: 'Taxa de resposta', value: '96%', icon: <HiChartBar size={22} /> },
]

function Dashboard() {
  const user = getStoredUser()

  // Representa o primeiro estado visual do painel autenticado.
  return (
    <main className="page-container dashboard-page">
      <header className="dashboard-page__header">
        <span className="section-badge">Dashboard inicial</span>
        <h1 className="section-title">Sua operacao comecou.</h1>
        <p className="section-description">
          {user?.email
            ? `Conta ativa para ${user.email} no plano ${user.plan_slug}.`
            : 'O usuario foi validado no fluxo 2FA e agora pode acessar a primeira versao do painel.'}
        </p>
      </header>

      <section className="dashboard-grid">
        {dashboardCards.map((card) => (
          <article key={card.title} className="feature-card">
            <div className="feature-card__icon" aria-hidden="true">
              {card.icon}
            </div>
            <h3>{card.title}</h3>
            <p>{card.value}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Dashboard
