import { HiOutlineBolt } from 'react-icons/hi2'
import { NavLink } from 'react-router-dom'

function navLinkClassName({ isActive }) {
  return `site-nav__link ${isActive ? 'site-nav__link--active' : ''}`.trim()
}

function Header() {
  // Exibe a navegação pública inicial enquanto o app ainda não possui área autenticada.
  return (
    <header className="site-header">
      <div className="site-header__content">
        <NavLink className="brand" to="/">
          <span className="brand__mark">
            <HiOutlineBolt size={22} />
          </span>
          <span>Reachify</span>
        </NavLink>

        <nav className="site-nav" aria-label="Navegação principal">
          <NavLink className={navLinkClassName} to="/">
            Home
          </NavLink>
          <NavLink className={navLinkClassName} to="/login">
            Login
          </NavLink>
          <NavLink className={navLinkClassName} to="/cadastro">
            Cadastro
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
