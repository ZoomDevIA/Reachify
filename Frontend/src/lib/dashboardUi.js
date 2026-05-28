const DASHBOARD_SIDEBAR_STORAGE_KEY = 'reachify.dashboardSidebarCollapsed'

export function getStoredSidebarCollapsed() {
  if (typeof window === 'undefined') {
    return false
  }

  const storedValue = window.localStorage.getItem(DASHBOARD_SIDEBAR_STORAGE_KEY)

  if (storedValue === null) {
    return window.innerWidth <= 1200
  }

  return storedValue === 'true'
}

export function setStoredSidebarCollapsed(value) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(DASHBOARD_SIDEBAR_STORAGE_KEY, String(value))
}
