import { Navigate } from 'react-router-dom'
import { getStoredSession } from '../lib/auth.js'

function RequireAuth({ children }) {
  const session = getStoredSession()

  if (!session?.token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RequireAuth
