import { NavLink } from 'react-router-dom'
import MobileNav from './MobileNav.jsx'

const AppLayout = ({ navItems, streak, children }) => {
  return (
    <div className="app-shell">
      <main className="app-content">
        <header className="top-bar" style={{ alignItems: 'flex-end' }}>
          <div>
            <h1>Journal Companion</h1>
            <p style={{ marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
              Capture memories, surface insights, and stay connected to what matters most.
            </p>
          </div>
          <div className="top-bar-actions">
            <nav className="tab-bar" aria-label="Primary views">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `tab-button${isActive ? ' active' : ''}`}
                >
                  <span aria-hidden="true">{item.icon}</span> {item.label}
                </NavLink>
              ))}
            </nav>
            <span className="badge">🔥 {streak}-day streak</span>
          </div>
        </header>

        {children}
      </main>

      <MobileNav items={navItems} />
    </div>
  )
}

export default AppLayout
