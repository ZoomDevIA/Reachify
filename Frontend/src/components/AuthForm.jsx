import { Link } from 'react-router-dom'

function AuthForm({
  title,
  description,
  fields,
  submitLabel,
  helperText,
  footerText,
  footerLinkText,
  footerLinkHref,
}) {
  function handleSubmit(event) {
    // Impede recarregamento da página enquanto o backend de autenticação não existe.
    event.preventDefault()
  }

  // Centraliza o formulário das páginas de login e cadastro para evitar duplicação.
  return (
    <section className="auth-card">
      <header className="auth-card__header">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      <form className="auth-form" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.group === 'row' ? 'form-row' : undefined}
          >
            {field.group === 'row' ? (
              field.inputs.map((input) => (
                <div key={input.name} className="form-field">
                  <label htmlFor={input.name}>{input.label}</label>
                  <input
                    id={input.name}
                    name={input.name}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))
            ) : (
              <div className="form-field">
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                />
              </div>
            )}
          </div>
        ))}

        <span className="form-helper">{helperText}</span>
        <button className="primary-button" type="submit">
          {submitLabel}
        </button>
      </form>

      <footer className="auth-card__footer">
        <span>{footerText}</span>
        <Link to={footerLinkHref}>{footerLinkText}</Link>
      </footer>
    </section>
  )
}

export default AuthForm
