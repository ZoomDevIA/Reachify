import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header.jsx'

function MainLayout() {
  const { pathname } = useLocation()
  const hideHeader =
    pathname === '/' ||
    pathname === '/cadastro' ||
    pathname === '/login' ||
    pathname === '/2fa' ||
    pathname.startsWith('/dashboard')

  // Mantém o cabeçalho compartilhado entre as páginas iniciais do MVP.
  return (
    <div className="app-shell">
      {!hideHeader && <Header />}
      <Outlet />
    </div>
  )
}

export default MainLayout
