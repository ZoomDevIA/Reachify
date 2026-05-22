function FeatureCard({ icon, title, description }) {
  // Padroniza os blocos de destaque usados na Home.
  return (
    <article className="feature-card">
      <div className="feature-card__icon" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

export default FeatureCard
